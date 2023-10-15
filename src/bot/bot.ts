import { Sticker, StickerTypes } from 'wa-sticker-formatter'
import { client } from '../whatsapp-server'
import fs from 'fs/promises'
import WAWebJS, { MessageMedia } from 'whatsapp-web.js'
import { config } from 'dotenv'
import { transcriptor } from '../transcriptor/transcript'

config()
export async function bot() {
  client.on('message_create', async (message: WAWebJS.Message) => {
    const mediaQuote = await message.getQuotedMessage()
    const mediaQuotedType = mediaQuote?.type ?? null
    if (
      message.body == '!reveal' &&
      mediaQuotedType &&
      mediaQuotedType == 'image'
    ) {
      const media = await message.getQuotedMessage()
      const mediaC = await media.downloadMedia()

      message.reply(mediaC)
    }

    if (
      message.body == '!sticker' &&
      mediaQuotedType &&
      mediaQuotedType == 'image'
    ) {
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

    if (
      message.body == '!transcript' &&
      mediaQuotedType &&
      mediaQuotedType == 'ptt'
    ) {
      const media = await (await message.getQuotedMessage()).downloadMedia()
      const mediaC = media.data

      await fs.writeFile('./audio.mp3', Buffer.from(mediaC, 'base64'))

      const text = await transcriptor()
      await fs.unlink('./audio.mp3')

      message.reply(text)
    }
  })
}
