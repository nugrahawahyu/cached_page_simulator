const express = require('express')
const app = express()
const port = 3000
const puppeteer = require('puppeteer');

app.get('/', async (req, res) => {
  const targetUrl = req.query.target_url
  let status

  try {
    const browser = await puppeteer.launch()
    const [page] = await browser.pages()
    await page.goto(targetUrl, { waitUntil: 'networkidle0' })
    const data = await page.evaluate(() => document.querySelector('*').outerHTML)
    res.send(data)
    status = 'success'
    await browser.close()
  } catch (err) {
    console.error(err)
    status = 'failed'
    res.send(err.message)
  } finally {
    console.log({targetUrl, status})
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
