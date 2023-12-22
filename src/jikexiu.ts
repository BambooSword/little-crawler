import puppeteer from 'puppeteer'
import fs from 'node:fs'
import os from 'node:os'

import saveData, { ISheetDate } from './sheet'

const jikexiu = async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: 'new',
  })
  const page = await browser.newPage()

  // Navigate the page to a URL
  await page.goto('https://www.jikexiu.com/repair/list/12-0-all')

  // Set screen size
  await page.setViewport({ width: 1080, height: 2024 })

  // console.log('hello world')
  // // query for an element handle
  // const element = await page.waitForSelector(
  //   '#j-header .ui-nav-item._phone .ui-link'
  // )
  // console.log('🚀 ~ file: jikexiu.ts:18 ~ jikexiu ~ element:', element)
  // element?.hover()

  const category = await page.$$eval(
    '.container .__category .ui-repeater-item a',
    category => {
      return category.map(cat => ({
        href: cat.href,
        name: cat.textContent?.trim(),
      }))
    }
  )
  console.log(1, category)
  for (const cat of category) {
    await page.goto(cat.href)
    console.log('====================================')
    console.log(cat.name)
    console.log('====================================')
    const brands = await page.$$eval(
      '.container .__brand .ui-repeater-item a',
      brands => {
        return brands.map(brand => ({
          href: brand.href,
          name: brand.textContent?.trim(),
        }))
      }
    )
    console.log('🚀 ~ file: jikexiu.ts:37 ~ jikexiu ~ brands:', brands)
    for (const [brandInd, brand] of brands.entries()) {
      console.log('🚀 ~ file: jikexiu.ts:31 ~ jikexiu ~ brand:', brand?.name)
      await page.goto(brand?.href ?? '')
      const items = await page.$$eval(
        '.container .__bd .device-item a',
        items => {
          return items.map(item => ({ href: item.href }))
        }
      )
      console.log('🚀 ~ file: jikexiu.ts:52 ~ jikexiu ~ items:', items)
      for (const [goodInd, item] of items.entries()) {
        console.log('url ===>', item)
        // 'item.href'
        // await page.goto(item.href, { waitUntil: 'networkidle0' })
        await page.goto(item.href, { waitUntil: 'networkidle0' })
        const nameEl = await page.$('.container #deviceName')
        let name: string
        const pname = (await nameEl?.getProperty('textContent'))
          ?.jsonValue()
          .then(res => (name = res))
        await page.waitForSelector('.w-attributes._faults .attrs-item')
        const malfunctions = await page.$$('.w-attributes._faults .attrs-item')
        for (const [index, mal] of malfunctions.entries()) {
          let malName: string
          ;(await mal.getProperty('textContent'))
            .jsonValue()
            .then(res => (malName = res))
          await mal.click()
          if (index === 0) {
            await page.waitForTimeout(1000)
          }
          await page
            .waitForSelector(`.__solution.__solution_${index}`)
            .then(async solution => {
              if (!solution) return
              await solution.waitForSelector('.sl-item')
              return await solution.$$('.sl-item').then(async items => {
                console.log(
                  '🚀 ~ file: jikexiu.ts:80 ~ jikexiu ~ items:',
                  items.length
                )
                for (const [itemInd, item] of items.entries()) {
                  const title = await item.$eval(
                    '.__title',
                    title => title.textContent
                  )
                  const desc = await item.$eval(
                    '.__desc',
                    title => title.textContent
                  )
                  const price = await item.$eval(
                    '.__price .__price1',
                    title => title.textContent
                  )
                  const data: ISheetDate = [
                    cat.name || '',
                    brand.name || '',
                    name,
                    malName,
                    title || '',
                    desc || '',
                    price || '',
                  ]
                  saveData([data], {
                    category: cat.name || '',
                    addHead:
                      brandInd === 0 &&
                      goodInd === 0 &&
                      itemInd === 0 &&
                      index === 0,
                  })
                  // await fs.appendFileSync(
                  //   'message1.txt',
                  //   `问题标题：${title}, 问题描述：${desc}, 价格：${price}` +
                  //     os.EOL
                  // )
                  // console.log(
                  //   '问题标题: ',
                  //   title,
                  //   ' 问题描述: ',
                  //   desc,
                  //   ' 价格：',
                  //   price
                  // )
                }
              })
            })
        }
      }
    }
  }
  browser.close()
}
jikexiu()
export default jikexiu
