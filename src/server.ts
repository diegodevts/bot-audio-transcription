import express from 'express'
import { bot } from './bot/bot'
import { runServer } from './whatsapp-server'

const app = express()

runServer()
bot()
app.listen(3000, () => {
  console.log('Server running on port 3000')
})
