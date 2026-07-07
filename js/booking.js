const BASE_URL = "https://restful-booker.herokuapp.com";

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
    getBooking(1);
});

// async function getBookings() {
//     try {
//         const response = await fetch(`${BASE_URL}/booking`);

//         if (!response.ok) {
//             throw new Error(`HTTP ${response.status}`);
//         }

//         const bookings = await response.json();

//         console.log(bookings);
//     } catch (error) {s
//         console.error(error);
//     }
// }

// document.getElementById("loadBookings").addEventListener("click", getBookings);