'use strict'

const START = Date.now()

const args = require('./args')
const opts = args.parse(process.argv.slice(1))

process.env.NODE_ENV = opts.environment
global.ARGS = opts

const { app }  = require('electron')
const { extname, join } = require('path')
const { darwin }  = require('../common/os')
const { qualified }  = require('../common/release')

let USERDATA = opts.dir
let LOGDIR

if (!USERDATA) {
  switch (opts.environment) {
    case 'development':
      USERDATA = join(process.cwd(), 'tmp')
      break
    case 'production':
      USERDATA = join(
        app.getPath('appData'),
        qualified[process.platform === 'linux' ? 'name' : 'product'])
      break
  }
}

// Set app name and data location as soon as possible!
app.setName(qualified.product)
if (USERDATA) {
  app.setPath('userData', USERDATA)
  LOGDIR = join(USERDATA, 'log')
}

if (!require('./squirrel')()) {
  const { info, warn } = require('../common/log')(LOGDIR, opts)

  if (opts.environment !== 'test') {
    if (!app.requestSingleInstanceLock()) {
      info('other instance detected, exiting...')
      app.exit(0)
    }
  }

  if (opts.ignoreGpuBlacklist) {
    app.commandLine.appendSwitch('ignore-gpu-blacklist')
  }

  if (opts.scale) {
    app.commandLine.appendSwitch('force-device-scale-factor', opts.scale)
  }

  info(`using ${app.getPath('userData')}`)

  const Tropy = require('./tropy')
  const tropy = new Tropy()

  Promise.all([
    app.whenReady(),
    tropy.start()
  ])
    .then(() => {
      info('ready after %sms', Date.now() - START)
      tropy.isReady = true
      tropy.open(...opts._)
    })

  if (darwin) {
    app.on('open-file', (event, file) => {
      if (tropy.isReady) {
        if (tropy.open(file))
          event.preventDefault()
      } else {
        if (extname(file) === '.tpy') {
          opts._.push(file)
          event.preventDefault()
        }
      }
    })
  }

  app.on('second-instance', (_, argv) => {
    tropy.open(...args.parse(argv.slice(1))._)
  })

  app.on('web-contents-created', (_, contents) => {
    contents.on('new-window', (event, url) => {
      warn(`prevented loading ${url}`)
      event.preventDefault()
    })
  })

  app.on('window-all-closed', () => {
    if (!darwin) app.quit()
  })

  app.on('quit', (_, code) => {
    tropy.stop()
    info(`quit with exit code ${code}`)
  })
}
