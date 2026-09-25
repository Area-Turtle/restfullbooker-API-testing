async function getBooking(id) {
    try {
        const response = await fetch(`/api/booking/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const booking = await response.json();

        console.log(booking);

        const result = document.getElementById("bookingResult");
        result.replaceChildren();

        const title = document.createElement("h3");
        title.textContent = `Booking ${id}`;

        const firstName = document.createElement("p");
        firstName.textContent = `First Name: ${booking.firstname}`;

        const lastName = document.createElement("p");
        lastName.textContent = `Last Name: ${booking.lastname}`;

        const totalPrice = document.createElement("p");
        totalPrice.textContent = `Total Price: $${booking.totalprice}`;

        const depositPaid = document.createElement("p");
        depositPaid.textContent = `Deposit Paid: ${booking.depositpaid}`;

        const checkIn = document.createElement("p");
        checkIn.textContent = `Check In: ${booking.bookingdates.checkin}`;

        const checkOut = document.createElement("p");
        checkOut.textContent = `Check Out: ${booking.bookingdates.checkout}`;

        result.append(
            title,
            firstName,
            lastName,
            totalPrice,
            depositPaid,
            checkIn,
            checkOut
        );
    } catch (error) {
        console.error(error);

        document.getElementById("bookingResult").textContent =
            "Failed to load booking.";
    }
}

document.getElementById("loadBookings").addEventListener("click", () => {
    getBooking(1);
});