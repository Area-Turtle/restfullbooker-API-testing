import { test, expect } from "@playwright/test";

test('Login with valid credentials', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Restful Booker Demo/i);

  await page.locator('#username').fill('admin');
  await page.locator('#password').fill('password123');

  await page.locator('#submit-btn').click();

  // Verify login was successful
  await expect(page.locator('#message')).not.toContainText(
    /invalid username or password/i
  );
});

test('Login with invalid credentials', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Restful Booker Demo/i);

  await page.locator('#username').fill('wronguser');
  await page.locator('#password').fill('wrongpassword');

  await page.locator('#submit-btn').click();

  await expect(page.locator('#message')).toContainText(
    /Bad credentials/i
  );
});
