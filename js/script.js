document.getElementById("btn").addEventListener("click", () => {
    console.log("button is clicked loaded");
    alert("Button clicked!");
});


console.log("script.js loaded");
// require("dotenv").config();
// console.log(process.env.PORT)
// console.log(process.env.SERVER_API_URL)

// async function createBooking() {
//     const response = await fetch(`${BASE_URL}/booking`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             firstname: "John",
//             lastname: "Doe",
//             totalprice: 150,
//             depositpaid: true,
//             bookingdates: {
//                 checkin: "2026-07-01",
//                 checkout: "2026-07-05"
//             },
//             additionalneeds: "Breakfast"
//         })
//     });

//     const data = await response.json();

//     console.log(data);
// }

const BASE_URL = "http://localhost:3000/api";

async function getBooking(id) {
    try {
        const response = await fetch(`${BASE_URL}/booking/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const booking = await response.json();

        console.log(booking);

        document.getElementById("bookingResult").innerHTML = `
            <h3>Booking ${id}</h3>
            <p><strong>First Name:</strong> ${booking.firstname}</p>
            <p><strong>Last Name:</strong> ${booking.lastname}</p>
            <p><strong>Total Price:</strong> $${booking.totalprice}</p>
            <p><strong>Deposit Paid:</strong> ${booking.depositpaid}</p>
            <p><strong>Check In:</strong> ${booking.bookingdates.checkin}</p>
            <p><strong>Check Out:</strong> ${booking.bookingdates.checkout}</p>
        `;
    } catch (error) {
        console.error(error);
        document.getElementById("bookingResult").textContent =
            "Failed to load booking.";
    }
}
// When the button is clicked, load booking #1
document.getElementById("loadBookings").addEventListener("click", () => {
    console.log("Button loadBookings clicked");
    const bookingId = document.getElementById("bookingId").value;

    if (!bookingId) {
        alert("Please enter a booking ID");
        return;
    }

    getBooking(bookingId);
});

async function getAllBookings() {
    try {
        const response = await fetch(`${BASE_URL}/booking`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const bookings = await response.json();

        console.log(bookings);
        document.getElementById("allBookings").innerHTML =
            bookings.map(b => `<p>${b.bookingid}</p>`).join("");
    } catch (error) {
        console.error(error);
        document.getElementById("allBookingListResult").textContent =
            "Failed to load booking.";
    }
}

document.getElementById("allBookings").addEventListener("click", () => {
    console.log("Button clicked");
    getAllBookings();
});

// document.getElementById("loadBookings").addEventListener("click", getBookings);
//createBooking();
//getBooking(1);

async function createBooking() {
    const booking = {
        firstname: "John",
        lastname: "Doe",
        totalprice: 150,
        depositpaid: true,
        bookingdates: {
            checkin: "2026-07-01",
            checkout: "2026-07-05"
        },
        additionalneeds: "Breakfast"
    };

    const response = await fetch("http://localhost:3000/api/booking", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(booking)
    });

    const result = await response.json();

    console.log(result);
}

async function authenticate() {
    const response = await fetch("http://localhost:3000/api/auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: "admin",
            password: "password123"
        })
    });

    const data = await response.json();

    console.log(data);
}