const express = require("express");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;
// console.log(PORT);

const SERVER_API_URL = process.env.SERVER_API_URL;
const BASE_URL = process.env.BASE_URL;
// console.log(SERVER_API_URL);

// Serve your frontend files
const path = require("path");

app.use(express.json());

// Serve only frontend files
app.use(express.static(path.join(__dirname, "public")));

// Proxy endpoint
// express server ping
app.get("/api/ping", async (req, res) => {
    try {
        const response = await fetch(`${SERVER_API_URL}/ping`);

        const data = await response.text();

        res.status(response.status).send(data);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Ping failed"
        });
    }
});

// express server booker auth 
app.post("/api/auth", async (req, res) => {
    // console.log("Received JSON:");
    // console.log(req.body);

    try {
        const requestBody = {
            username: req.body.username,
            password: req.body.password
        };

        // console.log("Sending to Restful Booker:");
        // console.log(JSON.stringify(requestBody, null, 2));

        const response = await fetch(`${SERVER_API_URL}/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        console.log("Status:", response.status);

        const data = await response.json();

        // console.log("Response from Restful Booker:");
        // console.log(data);

        res.status(response.status).json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to authenticate." });
    }
});

// express server booker get view id
app.get("/api/booking/:id", async (req, res) => {
    const bookingId = req.params.id;

    if (!/^\d+$/.test(bookingId)) {
        return res.status(400).json({
            error: "Invalid booking ID"
        });
    }
    const id = Number(bookingId);
    // console.log("PUT booking ID:", req.params.id);
    try {
        const response = await fetch(
            `${SERVER_API_URL}/booking/${id}`
        );

        const booking = await response.json();

        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Booking Entry doesn't Exist" });
    }
});

// express server booker get view all
app.get("/api/booking", async (req, res) => {
    try {
        const response = await fetch(`${SERVER_API_URL}/booking`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const bookings = await response.json();

        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to fetch bookings." });
    }
});

// express server booker create booking
app.post("/api/booking", async (req, res) => {
    try {
        const response = await fetch(`${SERVER_API_URL}/booking`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.status(200).json(data);
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({
            error: "Failed to create booking"
        });
    }
});
// express server booker edit booking given id
app.put("/api/booking/:id", async (req, res) => {
    // console.log("PUT booking ID:", req.params.id);
    const bookingId = req.params.id;

    if (!/^\d+$/.test(bookingId)) {
        return res.status(400).json({
            error: "Invalid booking ID"
        });
    }
    const id = Number(bookingId);
    // console.log("PUT booking ID:", req.params.id);
    try {
        const tokenResponse = await fetch(`${SERVER_API_URL}/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: "admin",
                password: "password123"
            })
        });

        const tokenData = await tokenResponse.json();

        const response = await fetch(
            `${SERVER_API_URL}/booking/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": `token=${tokenData.token}`
                },
                body: JSON.stringify(req.body)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);

    } catch (error) {
        console.error("Edit booking error:", error);
        res.status(500).json({
            error: "Booking Entry doesn't Exist"
        });
    }
});

app.patch("/api/booking/:id", async (req, res) => {
    const bookingId = req.params.id;

    if (!/^\d+$/.test(bookingId)) {
        return res.status(400).json({
            error: "Invalid booking ID"
        });
    }
    const id = Number(bookingId);
    try {
        const authResponse = await fetch(`${SERVER_API_URL}/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: "admin",
                password: "password123"
            })
        });

        const authData = await authResponse.json();

        const response = await fetch(
            `${SERVER_API_URL}/booking/${id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    //"Accept": "application/json",
                    "Cookie": `token=${authData.token}`
                },
                body: JSON.stringify(req.body)
            }
        );

        const data = await response.text();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data
            });
        }

        try {
            res.json(JSON.parse(data));
        } catch {
            res.send(data);
        }

    } catch (error) {
        console.error("PATCH booking error:", error);

        res.status(500).json({
            error: "Booking Entry doesn't Exist"
        });
    }
});

app.delete("/api/booking/:id", async (req, res) => {
    const bookingId = req.params.id;

    if (!/^\d+$/.test(bookingId)) {
        return res.status(400).json({
            error: "Invalid booking ID"
        });
    }
    const id = Number(bookingId);
    // console.log("PUT booking ID:", req.params.id);
    try {
        const tokenResponse = await fetch(`${SERVER_API_URL}/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: "admin",
                password: "password123"
            })
        });

        const tokenData = await tokenResponse.json();

        const response = await fetch(
            `${SERVER_API_URL}/booking/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Cookie": `token=${tokenData.token}`
                }
            }
        );
        // console.log("Status:", response.status);
        // console.log("Content-Type:", response.headers.get("content-type"));

        const contentType = response.headers.get("content-type");

        let data;

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            return res.status(response.status).json({
                error: data
            });
        } res.json({
            bookingid: req.params.id,
            response: data
        });

    } catch (error) {
        console.error("Edit booking error:", error);
        res.status(500).json({
            error: "Booking Entry Doesn't Exist"
        });
    }
});

// Only start the server when running `node server.js`
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running at ${BASE_URL}:${PORT}`);
    });
}

// Allow Jest to import the Express app
module.exports = app;