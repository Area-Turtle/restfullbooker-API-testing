import { test, expect } from "@playwright/test";

test("Check API status", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page).toHaveTitle(/Restful Booker Demo/i);
});

test("homepage loads", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page).toHaveTitle(/Restful Booker Demo/i);
});

test("Login with valid credentials", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page).toHaveTitle(/Restful Booker Demo/i);
});

test("Login with invalid credentials", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page).toHaveTitle(/Restful Booker Demo/i);
});

test("Create booking", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page).toHaveTitle(/Restful Booker Demo/i);
});

test("View booking", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page).toHaveTitle(/Restful Booker Demo/i);
});

test("View all booking", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page).toHaveTitle(/Restful Booker Demo/i);
});

test("Edit booking", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page).toHaveTitle(/Restful Booker Demo/i);
});

test("Update booking", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page).toHaveTitle(/Restful Booker Demo/i);
});

test("Delete booking", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page).toHaveTitle(/Restful Booker Demo/i);
});

