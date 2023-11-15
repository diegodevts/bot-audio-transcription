import puppeteer from 'puppeteer'

export async function scrapper(filename: string) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--autoplay-policy=no-user-gesture-required'],
    ignoreDefaultArgs: ['--mute-audio']
  })
  const page = await browser.newPage()

  // Navigate the page to a URL
  await page.goto('http://localhost:3876')

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 })

  const [fileChooser] = await Promise.all([
    page.waitForFileChooser(),
    page.click('#audio_file')
  ])

  await fileChooser.accept([filename])

  await page.evaluate(() => {
    const startButton = document.getElementById('start')
    const stopButton = document.getElementById('stop')
    let audio = document.querySelector('audio')

    startButton?.click()

    if (audio) {
      audio.addEventListener('pause', async () => {
        stopButton?.click()
      })
    }
  })

  const hasChord = await page.waitForSelector('#chord > h1')
  let lastChord
  if (hasChord) {
    const data = await page.evaluate(() => {
      const chord = document.querySelector('#chord > h1')?.textContent

      return chord
    })

    lastChord = data
  }

  return JSON.parse(lastChord as string)
}
