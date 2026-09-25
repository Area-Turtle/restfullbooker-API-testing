import { test, expect } from "@playwright/test";

test('Check API status', async ({ page, request }) => {
  // Check frontend
  await page.goto('/');
  await expect(page).toHaveTitle(/Restful Booker Demo/i);

  // Check API
  const response = await request.get('/api/ping');

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(201);
});

test('homepage loads', async ({ page }) => {
  const response = await page.goto('/');

  expect(response.status()).toBe(200);
  await expect(page).toHaveTitle(/Restful Booker Demo/i);
});

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
})

test('Create booking', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Restful Booker Demo/i);

  await page.locator('#firstname').fill('John');
  await page.locator('#lastname').fill('Doe');
  await page.locator('#totalprice').fill('150');
  await page.locator('#depositpaid').check();
  await page.locator('#checkin').fill('2026-10-01');
  await page.locator('#checkout').fill('2026-10-05');
  await page.locator('#additionalneeds').fill('Breakfast');

  const responsePromise = page.waitForResponse(
    response =>
      response.url().includes('/api/booking') &&
      response.request().method() === 'POST'
  );

  await page.getByRole('button', { name: /create booking/i }).click();

  const response = await responsePromise;

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.bookingid).toBeDefined();
  expect(body.bookingid).toEqual(expect.any(Number));

  await expect(page.locator('#createBookingResult'))
    .toContainText(`Booking Created! ID: ${body.bookingid}`);
});

test('View booking', async ({ page }) => {
  const id = 7
  await page.goto('/');

  await expect(page).toHaveTitle(/Restful Booker Demo/i);

  await page.locator('#bookingId').fill(`${id}`);
  await page.locator('#loadBookings').click();

  const bookingResult = page.locator('#bookingResult');

  await expect(bookingResult).toContainText(`Booking ${id}`);
  await expect(bookingResult).toContainText('First Name:');
  await expect(bookingResult).toContainText('Last Name:');
  await expect(bookingResult).toContainText('Total Price:');
  await expect(bookingResult).toContainText('Deposit Paid:');
  await expect(bookingResult).toContainText('Check In:');
  await expect(bookingResult).toContainText('Check Out:');
  await expect(bookingResult).toContainText('Additional Needs:');
});
/**
 * TODO add test to close booking
 */
test('View all booking', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Restful Booker Demo/i);

  await page.locator('#allBookings').click();

  const bookingResult = page.locator('#allBookingResult');

  await expect(bookingResult).not.toBeEmpty();
  await expect(bookingResult.locator('p').first()).toBeVisible();
});


/**
 * TODO Add additional test to check if changes work > lookup id in view booking
 */

test("Edit booking", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Restful Booker Demo/i);
  // Login
  await page.locator("#username").fill("admin");
  await page.locator("#password").fill("password123");
  await page.locator("#submit-btn").click();
  // Create a new booking


  await page.locator("#firstname").fill("Test");
  await page.locator("#lastname").fill("User");
  await page.locator("#totalprice").fill("100");
  await page.locator("#depositpaid").check();
  await page.locator("#checkin").fill("2026-10-01");
  await page.locator("#checkout").fill("2026-10-05");
  await page.locator("#additionalneeds").fill("Breakfast");

  await page.locator("#createBooking").click();
  const createResponsePromise = page.waitForResponse(
    response =>
      response.url().includes("/api/booking") &&
      response.request().method() === "POST"
  );
  const createResponse = await createResponsePromise;

  expect(createResponse.status()).toBe(200);

  const createResult = await createResponse.json();
  const bookingId = createResult.bookingid;

  expect(bookingId).toBeTruthy();

  // Edit the newly created booking
  await page.locator("#bookingid").fill(String(bookingId));
  await page.locator("#editFirstname").fill("Updated");
  await page.locator("#editLastname").fill("User");
  await page.locator("#editTotalprice").fill("200");
  await page.locator("#editDepositpaid").uncheck();
  await page.locator("#editCheckin").fill("2026-11-01");
  await page.locator("#editCheckout").fill("2026-11-05");
  await page.locator("#editAdditionalneeds").fill("Lunch");

  // Wait for PUT request
  const updateResponsePromise = page.waitForResponse(
    response =>
      response.url().includes(`/api/booking/${bookingId}`) &&
      response.request().method() === "PUT"
  );

  await page.locator("#editBooking").click();

  const updateResponse = await updateResponsePromise;

  // Verify API response
  expect(updateResponse.status()).toBe(200);

  // Verify UI
  await expect(page.locator("#editBookingResult"))
    .toContainText("Booking Updated");
});

test("Update booking", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Restful Booker Demo/i);

  // Login
  await page.locator("#username").fill("admin");
  await page.locator("#password").fill("password123");
  await page.locator("#submit-btn").click();

  // Create a new booking
  const createResponsePromise = page.waitForResponse(
    response =>
      response.url().includes("/api/booking") &&
      response.request().method() === "POST"
  );

  await page.locator("#firstname").fill("Test");
  await page.locator("#lastname").fill("User");
  await page.locator("#totalprice").fill("100");
  await page.locator("#depositpaid").check();
  await page.locator("#checkin").fill("2026-10-01");
  await page.locator("#checkout").fill("2026-10-05");

  await page.locator("#createBooking").click();

  const createResponse = await createResponsePromise;

  expect(createResponse.status()).toBe(200);

  const createResult = await createResponse.json();
  const bookingId = createResult.bookingid;

  expect(bookingId).toBeTruthy();

  // Fill edit form with newly created booking ID
  await page.locator("#bookingid").fill(String(bookingId));
  await page.locator("#editFirstname").fill("Updated");
  await page.locator("#editLastname").fill("User");
  await page.locator("#editTotalprice").fill("200");
  await page.locator("#editDepositpaid").uncheck();
  await page.locator("#editCheckin").fill("2026-11-01");
  await page.locator("#editCheckout").fill("2026-11-05");
  await page.locator("#editAdditionalneeds").fill("Lunch");

  // Wait for PUT request
  const updateResponsePromise = page.waitForResponse(
    response =>
      response.url().includes(`/api/booking/${bookingId}`) &&
      response.request().method() === "PUT"
  );

  await page.locator("#editBooking").click();

  const updateResponse = await updateResponsePromise;

  expect(updateResponse.status()).toBe(200);

  // Verify UI
  await expect(page.locator("#editBookingResult"))
    .toContainText("Booking Updated");
});

test("Delete booking", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Restful Booker Demo/i);

  // Login
  await page.locator("#username").fill("admin");
  await page.locator("#password").fill("password123");
  await page.locator("#submit-btn").click();

  // Create a new booking
  const createResponsePromise = page.waitForResponse(
    response =>
      response.url().includes("/api/booking") &&
      response.request().method() === "POST"
  );

  await page.locator("#firstname").fill("Delete");
  await page.locator("#lastname").fill("Test");
  await page.locator("#totalprice").fill("100");
  await page.locator("#depositpaid").check();
  await page.locator("#checkin").fill("2026-10-01");
  await page.locator("#checkout").fill("2026-10-05");
  await page.locator("#additionalneeds").fill("Breakfast");

  await page.locator("#createBooking").click();

  const createResponse = await createResponsePromise;

  expect(createResponse.status()).toBe(200);

  const createResult = await createResponse.json();
  const bookingId = createResult.bookingid;

  expect(bookingId).toBeTruthy();

  // Enter newly created booking ID
  await page.locator("#deleteBookingId").fill(String(bookingId));

  // Wait for DELETE request
  const deleteResponsePromise = page.waitForResponse(
    response =>
      response.url().includes(`/api/booking/${bookingId}`) &&
      response.request().method() === "DELETE"
  );

  await page.locator("#deleteBooking").click();

  const deleteResponse = await deleteResponsePromise;

  expect(deleteResponse.status()).toBe(200);

  // Verify UI
  await expect(page.locator("#deleteBookingResult"))
    .toContainText("Booking Deleted");
});
