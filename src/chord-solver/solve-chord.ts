import axios from 'axios'
import { scrapper } from './scrapper'

export async function solveChord(filename: number) {
  const FILE_URL = `./${filename}.mp3`

  const { note, scale } = await scrapper(FILE_URL)

  return `${note} ${scale}`
}
