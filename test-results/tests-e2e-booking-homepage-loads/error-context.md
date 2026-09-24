# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e\booking.spec.js >> homepage loads
- Location: tests\e2e\booking.spec.js:3:5

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /Restful Booker/i
Received string:  "My Local Website"
Timeout: 5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    14 × locator resolved to <html lang="en">…</html>
       - unexpected value "My Local Website"

```

```yaml
- heading "Restful Booker Demo" [level=1]
- paragraph: My localhost express server website is working.
- button "Check API Status"
- paragraph
- heading "Sign in" [level=1]
- text: Username
- textbox "Username"
- text: Password
- textbox "Password"
- button "Sign in"
- text: admin | password123
- heading "View Booking" [level=2]
- text: "Booking ID:"
- spinbutton "Booking ID:"
- button "Load Booking"
- button "Load All Booking List"
- heading "Create Booking" [level=2]
- text: First Name
- textbox "First Name": John
- text: Last Name
- textbox "Last Name": Doe
- text: Total Price
- spinbutton "Total Price": "80085"
- text: Deposit Paid
- checkbox "Deposit Paid" [checked]
- text: Check-in Date
- textbox "Check-in Date": 1990-01-01
- text: Check-out Date
- textbox "Check-out Date": 2026-01-01
- text: Additional Needs
- textbox "Additional Needs": Breakfast, Lunch, Dinner
- button "Create Booking"
```

# Test source

```ts
  1 | import { test, expect } from "@playwright/test";
  2 | 
  3 | test("homepage loads", async ({ page }) => {
  4 |   await page.goto("http://localhost:3000/");
  5 | 
> 6 |   await expect(page).toHaveTitle(/Restful Booker/i);
    |                      ^ Error: expect(page).toHaveTitle(expected) failed
  7 | });
```