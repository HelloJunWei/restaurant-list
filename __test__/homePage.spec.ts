import { test, expect } from '@playwright/test';
import path from 'path'
import fs from 'fs'

test('檢查餐廳數量以及排序', async ({ page }) => {
  await page.goto('http:localhost:3000');
  await page.waitForSelector('.col-md-10.col-12.mx-auto')
  const text = await fs.readFileSync(path.resolve(`${__dirname}`, '../restaurant.json'), 'utf8')
  const restaurantData = JSON.parse(text).results
  const restaurantList = await page.locator('[data-tag="restaurants"]').all()
  expect(restaurantList.length).toBe(8)
  for (let i = 0; i < restaurantList.length; i++) {
    const restaurant = restaurantList[i]
    const awswer = restaurantData[i]
    const img = await restaurant.locator('img').getAttribute('src')
    const catagory = await (await restaurant.locator('[data-tag="category"]').innerText()).replace(' ', '')
    // const rating = await (await restaurant.locator('.restaurant-rating.mb-1.mt-1').innerText()).replace(' ', '')
    const title = await restaurant.locator('[data-tag="title"]').textContent()

    expect(img).toBe(awswer.image)
    expect(title).toBe(awswer.name)
    expect(catagory).toBe(awswer.category)
    // expect(rating).toBe(awswer.rating.toString())
  }
});


test('檢查卡片連結是否正常', async ({ page }) => {
  await page.goto('http:localhost:3000');
  await page.waitForSelector('.col-md-10.col-12.mx-auto')
  const text = await fs.readFileSync(path.resolve(`${__dirname}`, '../restaurant.json'), 'utf8')
  const restaurantData = JSON.parse(text).results
  const restaurantList = await page.locator('.text-secondary').all()
  expect(restaurantList.length).toBe(8)
  for (let i = 0; i < restaurantList.length; i++) {
    const restaurant = restaurantList[i]
    const awswer = restaurantData[i]
    const img = await restaurant.locator('img').getAttribute('src')
    const catagory = await (await restaurant.locator('.restaurant-category.mb-1').innerText()).replace(' ', '')
    // const rating = await (await restaurant.locator('.restaurant-rating.mb-1.mt-1').innerText()).replace(' ', '')
    const title = await restaurant.locator('.card-title.mb-1').textContent()

    expect(img).toBe(awswer.image)
    expect(title).toBe(awswer.name)
    expect(catagory).toBe(awswer.category)
    // expect(rating).toBe(awswer.rating.toString())
  }
});


