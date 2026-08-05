const express = require("express");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT;
console.log(PORT)

const SERVER_API_URL = process.env.SERVER_API_URL;
console.log(SERVER_API_URL)

// Serve your frontend files
app.use(express.static(__dirname));
app.use(express.json());

// Proxy endpoint
app.get("/api/booking/:id", async (req, res) => {
    try {
        const response = await fetch(
            `${SERVER_API_URL}/booking/${req.params.id}`
        );

        const booking = await response.json();

        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to fetch booking." });
    }
});

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

app.post("/api/booking", async (req, res) => {
    try {
        const response = await fetch(`${SERVER_API_URL}/booking`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const booking = await response.json();

        res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Unable to create booking."
        });
    }
});

app.post("/api/auth", async (req, res) => {
    console.log("Received JSON:");
    console.log(req.body);

    try {
        const requestBody = {
            username: req.body.username,
            password: req.body.password
        };

        console.log("Sending to Restful Booker:");
        console.log(JSON.stringify(requestBody, null, 2));

        const response = await fetch(`${SERVER_API_URL}/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        console.log("Status:", response.status);

        const data = await response.json();

        console.log("Response from Restful Booker:");
        console.log(data);

        res.status(response.status).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to authenticate." });
    }
});


// app.post("/api/auth", async (req, res) => {
//     console.log("Received JSON:");
//     console.log(req.body);

//     try {
//         const response = await fetch(`${SERVER_API_URL}/auth`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 username: req.body.username,
//                 password: req.body.password
//             })
//         });

//         const data = await response.json();

//         console.log(data);

//         res.status(response.status).json(data);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Unable to authenticate." });
//     }
// });

// app.post("/api/auth", async (req, res) => {
//     try {
//         const response = await fetch(`${SERVER_API_URL}/auth`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(req.body)
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP ${response.status}`);
//         }

//         const auth = await response.json();

//         res.json(auth);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             error: "Unable to authenticate."
//         });
//     }
// });

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});