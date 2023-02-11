import { test, expect, Page, Locator } from '@playwright/test';
import path from 'path'
import fs from 'fs'

const text = fs.readFileSync(path.resolve(`${__dirname}`, '../restaurant.json'), 'utf8')
const restaurantData = JSON.parse(text).results

async function checkShowPageDetail(page: Page, answer: any) {
  const img = await page.locator('[data-tag="image"]').getAttribute('src')
  const catagory = await(await page.locator('[data-tag="category"]').innerText()).replace(/\s/g, '')
  const title = (await page.locator('[data-tag="title"]').innerText())
  const address = (await page.locator('[data-tag="address"]').innerText()).replace(/\s/g, '')
  const phone = (await page.locator('[data-tag="phone"]').innerText()).replace(/\s/g, '')
  const description = (await page.locator('[data-tag="description"]').innerText()).replace(/\s/g, '')

  expect(title).toBe(answer.name)
  expect(img).toBe(answer.image)
  expect(catagory).toBe(`類別：${answer.category.replace(/\s/g, '')}`)
  expect(address).toBe(`地址：${answer.location.replace(/\s/g, '')}`)
  expect(phone).toBe(`電話：${answer.phone.replace(/\s/g, '')}`)
  expect(description).toBe(answer.description.replace(/\s/g, ''))
}

async function checkMainPageSingleDetal(locator: Locator, answer: any) {
  const img = await locator.locator('img').getAttribute('src')
  const catagory = (await locator.locator('[data-tag="category"]').innerText()).replace(/\s/g, '')
  // const rating = await (await locator.locator('.restaurant-rating.mb-1.mt-1').innerText()).replace(/\s/g, '')
  const title = await (await locator.locator('[data-tag="title"]').innerText())

  expect(img).toBe(answer.image)
  expect(title).toBe(answer.name)
  expect(catagory).toBe(answer.category)
}

test('檢查餐廳數量以及排序', async ({ page }) => {
  await page.goto('http:localhost:3000');
  await page.waitForSelector('.container')
  const restaurantList = await page.locator('[data-tag="restaurants"]').all()
  expect(restaurantList.length).toBe(8)
  for (let i = 0; i < restaurantList.length; i++) {
    const restaurant = restaurantList[i]
    const answer = restaurantData[i]
    await checkMainPageSingleDetal(restaurant, answer)
  }
});


test('檢查卡片連結是否正常', async ({ page }) => {
  await page.goto('http:localhost:3000');
  await page.waitForSelector('.container')
  const restaurantList = await page.locator('[data-tag="restaurants"]').all()
  expect(restaurantList.length).toBe(8)
  for (let i = 0; i < restaurantList.length; i++) {
    const restaurant = restaurantList[0]
    const answer = restaurantData[0]
    await restaurant.click()
    await expect(page).toHaveURL(`http://localhost:3000/restaurants/${0 + 1}`); 
    await page.waitForSelector('.container'); 
    await checkShowPageDetail(page, answer)

    // back to home page
    await page.locator('.navbar-brand').click()
    await page.waitForSelector('.container')
  }
});

test('測試搜尋結果是否正常', async({ page }) => {
  await page.goto('http:localhost:3000');
  await page.waitForSelector('.container')
  await page.locator('[data-tag="search"]').fill('牛排')
  await page.locator('[data-tag="search-button"]').click()
  await page.waitForSelector('.container')

  const restaurantList = await page.locator('[data-tag="restaurants"]').all()
  expect(restaurantList.length).toBe(1)
  const restaurant = restaurantList[0]
  const answer = restaurantData[3]
  await checkMainPageSingleDetal(restaurant, answer)


  await page.locator('[data-tag="search"]').fill('Cafe')
  await page.locator('[data-tag="search-button"]').click()
  
  const restaurantList2 = await page.locator('[data-tag="restaurants"]').all()
  expect(restaurantList2.length).toBe(1)
  const restaurant2 = restaurantList[0]
  const answer2 = restaurantData[6]
  await checkMainPageSingleDetal(restaurant2, answer2)
})
