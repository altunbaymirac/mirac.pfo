const fs = require('fs')
const http = require('http')
const path = require('path')
const { spawn } = require('child_process')

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = ''
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end', () => {
          try {
            resolve(JSON.parse(data))
          } catch (error) {
            reject(error)
          }
        })
      })
      .on('error', reject)
  })
}

async function waitForDebugTarget(port) {
  for (let i = 0; i < 60; i += 1) {
    try {
      const targets = await getJson(`http://127.0.0.1:${port}/json/list`)
      const page = targets.find((target) => target.type === 'page')
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl
    } catch (_) {
      // Edge is still starting.
    }
    await wait(250)
  }
  throw new Error('Timed out waiting for Edge remote debugging target')
}

function createCdpClient(wsUrl) {
  const ws = new WebSocket(wsUrl)
  let id = 0
  const pending = new Map()
  const events = []

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data)
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id)
      pending.delete(message.id)
      if (message.error) reject(new Error(message.error.message))
      else resolve(message.result)
    } else if (message.method) {
      events.push(message)
    }
  }

  const opened = new Promise((resolve, reject) => {
    ws.onopen = resolve
    ws.onerror = reject
  })

  return {
    events,
    async send(method, params = {}) {
      await opened
      id += 1
      ws.send(JSON.stringify({ id, method, params }))
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject })
      })
    },
    close() {
      ws.close()
    },
  }
}

async function main() {
  const url = process.argv[2] || 'http://127.0.0.1:3000/demos/concreteweb?presentation=1'
  const output = path.resolve(process.argv[3] || 'concreteweb-james-dyson-screenshot.png')
  const port = 9333 + Math.floor(Math.random() * 1000)
  const userDataDir = path.join(process.env.TEMP || process.cwd(), `edge-cdp-${Date.now()}`)

  const edge = spawn(EDGE_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=1440,1050',
    'about:blank',
  ])

  let client
  try {
    const wsUrl = await waitForDebugTarget(port)
    client = createCdpClient(wsUrl)
    await client.send('Page.enable')
    await client.send('Runtime.enable')
    await client.send('Log.enable')
    await client.send('Page.navigate', { url })
    await wait(5000)

    const textResult = await client.send('Runtime.evaluate', {
      expression: 'document.body ? document.body.innerText : ""',
      returnByValue: true,
    })
    const text = textResult.result.value || ''
    const screenshot = await client.send('Page.captureScreenshot', { format: 'png', fromSurface: true })
    fs.writeFileSync(output, Buffer.from(screenshot.data, 'base64'))

    const consoleWarnings = client.events
      .filter((event) => event.method === 'Runtime.consoleAPICalled')
      .filter((event) => event.params.type === 'warning')
      .map((event) => `${event.params.type}: ${event.params.args.map((arg) => arg.value || arg.description || '').join(' ')}`)
    const consoleErrors = client.events
      .filter((event) => event.method === 'Runtime.consoleAPICalled')
      .filter((event) => event.params.type === 'error')
      .map((event) => `${event.params.type}: ${event.params.args.map((arg) => arg.value || arg.description || '').join(' ')}`)
    const pageErrors = client.events
      .filter((event) => event.method === 'Runtime.exceptionThrown' || (event.method === 'Log.entryAdded' && event.params.entry?.level === 'error'))
      .map((event) => event.params.exceptionDetails?.text || event.params.entry?.text || JSON.stringify(event.params))
      .filter(Boolean)

    const checks = {
      title: text.includes('ConcreteWeb Mesh & Triage Simulation'),
      navigationHidden: !text.includes('mirac@portfolio'),
      chatbotHidden: !text.includes('MIRAC.AI'),
      oldEmergencySystemHidden: !text.includes('Emergency System'),
      oldSosHidden: !text.includes('SOS'),
      concretewebRoute: url.includes('/demos/concreteweb'),
    }

    const result = { url, output, checks, consoleWarnings, consoleErrors, pageErrors }
    fs.writeFileSync(output.replace(/\.png$/i, '.json'), JSON.stringify(result, null, 2))

    if (Object.values(checks).some((value) => !value) || consoleErrors.length || pageErrors.length) {
      console.error(JSON.stringify(result, null, 2))
      process.exitCode = 1
      return
    }

    console.log(JSON.stringify(result, null, 2))
  } finally {
    if (client) client.close()
    edge.kill()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
