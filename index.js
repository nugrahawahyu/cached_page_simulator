const express = require('express')
const app = express()
const port = 3000
const puppeteer = require('puppeteer');

const cache = {}

app.get('/', async (req, res) => {
  const targetUrl = req.query.target_url
  const baseTagHref = req.query.base_tag_href
  const forceFresh = req.query.forceFresh === 'true'
  const cacheKey = `${targetUrl}-${baseTagHref}`
  const cachedData = cache[cacheKey]
  const useCachedData = Boolean(!forceFresh && cachedData)

  let status

  try {
    if (useCachedData) {
      return res.send(cachedData)
    }

    const browser = await puppeteer.launch()
    const [page] = await browser.pages()
    await page.goto(targetUrl, { waitUntil: 'networkidle0' })
    let data = await page.evaluate(() => document.querySelector('*').outerHTML)
    if (baseTagHref) {
      data = data.replace(/<base href=".*">/g, `<base href="${baseTagHref}">`)
    }
    res.send(data)
    status = 'success'
    cache[cacheKey] = data
    await browser.close()
  } catch (err) {
    console.error(err)
    status = 'failed'
    res.send(err.message)
  } finally {
    console.log({targetUrl, status, useCachedData})
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
