import qrcode from 'qrcode-terminal'
import { Client, LocalAuth } from 'whatsapp-web.js'

export const client = new Client({
  puppeteer: {
    args: ['--no-sandbox']
  },
  authStrategy: new LocalAuth()
})

export function runServer() {
  client.on('qr', (qr: any) => {
    qrcode.generate(qr, { small: true })
  })

  client.on('ready', () => {
    console.log('Client is ready!')
  })

  client.initialize()
}
