import { createWorker } from 'tesseract.js'

export async function imagetoText(filePath: number) {
  const worker = await createWorker('eng')
  const ret = await worker.recognize(`./${filePath}.png`)

  await worker.terminate()

  return ret.data.text
}
