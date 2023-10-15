import { Sticker, StickerTypes } from 'wa-sticker-formatter'
import { client } from '../whatsapp-server'
import fs from 'fs/promises'
import { MessageMedia } from 'whatsapp-web.js'
import { config } from 'dotenv'
import { transcriptor } from '../transcriptor/transcript'

config()
export async function bot() {
  client.on('message', async (message: any) => {
    if (message.body == '!reveal') {
      const media = await message.getQuotedMessage()
      const mediaC = await media.downloadMedia()

      message.reply(mediaC)
    }

    if (message.body == '!sticker') {
      const media = await message.getQuotedMessage()
      const mediaC = await media.downloadMedia()

      const sticker = new Sticker(Buffer.from(mediaC.data, 'base64'), {
        pack: 'My Pack', // The pack name
        author: 'Me', // The author name
        type: StickerTypes.FULL, // The sticker type
        categories: ['🎉'], // The sticker category
        id: '12345', // The sticker id
        quality: 50, // The quality of the output file
        background: '#000000' // The sticker background color (only for full stickers)
      })

      const stickerConverted = await sticker.toBuffer()

      await fs.writeFile(__dirname + '/pic.webp', stickerConverted)

      const mediaSaved = MessageMedia.fromFilePath(__dirname + '/pic.webp')
      message.reply(mediaSaved, message.from, { sendMediaAsSticker: true })

      await fs.unlink(__dirname + '/pic.webp')
    }
  })

  client.on('message_create', async (message) => {
    if (message.body == '!reveal') {
      const media = await message.getQuotedMessage()
      const mediaC = await media.downloadMedia()

      message.reply(mediaC)
    }

    if (message.body == '!sticker') {
      const media = await message.getQuotedMessage()
      const mediaC = (await media.downloadMedia()).data

      const sticker = new Sticker(Buffer.from(mediaC, 'base64'), {
        pack: 'My Pack', // The pack name
        author: 'Me', // The author name
        type: StickerTypes.FULL, // The sticker type
        categories: ['🎉'], // The sticker category
        id: '12345', // The sticker id
        quality: 50, // The quality of the output file
        background: '#000000' // The sticker background color (only for full stickers)
      })

      const stickerConverted = await sticker.toBuffer()

      await fs.writeFile(__dirname + '/pics.webp', stickerConverted)

      const mediaSaved = MessageMedia.fromFilePath(__dirname + '/pics.webp')
      message.reply(mediaSaved, message.to, { sendMediaAsSticker: true })

      await fs.unlink(__dirname + '/pics.webp')
    }

    if (message.body == '!transcript') {
      const media = await (await message.getQuotedMessage()).downloadMedia()
      const mediaC = media.data

      await fs.writeFile('./audio.mp3', Buffer.from(mediaC, 'base64'))

      const text = await transcriptor()
      await fs.unlink('./audio.mp3')

      message.reply(text)
    }
  })
}
