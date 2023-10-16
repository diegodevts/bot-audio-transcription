import AssemblyAI from 'assemblyai'

export async function transcriptor(filename: number) {
  const apiKey = process.env.ASSEMBLY_AI_API_KEY

  const client = new AssemblyAI({
    apiKey
  })

  const FILE_URL = `./${filename}.mp3`

  const transcript = await client.transcripts.create({
    audio_url: FILE_URL,
    language_code: 'pt'
  })

  return transcript.text
}
