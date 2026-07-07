const express = require("express");

const app = express();
const PORT = 3000;

// Serve your frontend files
app.use(express.static(__dirname));

// Proxy endpoint
app.get("/api/booking/:id", async (req, res) => {
    try {
        const response = await fetch(
            `https://restful-booker.herokuapp.com/booking/${req.params.id}`
        );

        const booking = await response.json();

        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to fetch booking." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});