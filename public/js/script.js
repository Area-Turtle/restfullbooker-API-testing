
console.log("script.js loaded");

const form = document.getElementById("login-form");
const submitBtn = document.getElementById("submit-btn");
const messageEl = document.getElementById("message");


async function getBooking(id) {
    try {
        const response = await fetch(`/api/booking/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const booking = await response.json();

        console.log(booking);

        document.getElementById("bookingResult").textContent =
            `Booking ${id}
            First Name: ${booking.firstname}
            Last Name: ${booking.lastname}
            Total Price: $${booking.totalprice}
            Deposit Paid: ${booking.depositpaid}
            Check In: ${booking.bookingdates.checkin}
            Check Out: ${booking.bookingdates.checkout}
            Additional needs: ${booking.additionalneeds}`;
    } catch (error) {
        console.error(error);
        document.getElementById("bookingResult").textContent =
            "Failed to load booking.";
    }
}

async function getAllBookings() {
    try {
        const response = await fetch("/api/booking");

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

async function authenticate(username, password) {
    const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    const data = await response.json();

    if (!response.ok || data.reason) {
        throw new Error(
            data.reason || "Invalid username or password."
        );
    }

    return data;
}

async function createBooking() {
    console.log("createBooking called");
    const booking = {
        firstname: document.getElementById("firstname").value,
        lastname: document.getElementById("lastname").value,
        totalprice: Number(document.getElementById("totalprice").value),
        depositpaid: document.getElementById("depositpaid").checked,
        bookingdates: {
            checkin: document.getElementById("checkin").value,
            checkout: document.getElementById("checkout").value
        },
        additionalneeds: document.getElementById("additionalneeds").value
    };

    try {
        const response = await fetch("/api/booking", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(booking)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Failed to create booking");
        }

        //const result = await response.json();
        document.getElementById("createBookingResult").textContent =
            `Booking Created! ID: ${result.bookingid}`;

        return result.bookingid;
    } catch (error) {
        console.error(error);
        document.getElementById("bookingResult").textContent =
            "Unable to create booking.";
    }
}

async function editBooking() {
    const bookingId = document.getElementById("bookingid").value;
    const firstname = document.getElementById("editFirstname").value.trim();
    const lastname = document.getElementById("editLastname").value.trim();
    const totalprice = document.getElementById("editTotalprice").value;
    const depositpaid = document.getElementById("editDepositpaid").checked;
    const checkin = document.getElementById("editCheckin").value;
    const checkout = document.getElementById("editCheckout").value;
    const additionalneeds =
        document.getElementById("editAdditionalneeds").value.trim();

    const usePatch =
        firstname === "" ||
        lastname === "" ||
        totalprice === "" ||
        checkin === "" ||
        checkout === "" ||
        additionalneeds === "";

    let booking = {};

    if (usePatch) {
        if (firstname !== "") booking.firstname = firstname;
        if (lastname !== "") booking.lastname = lastname;
        if (totalprice !== "") booking.totalprice = Number(totalprice);

        booking.depositpaid = depositpaid;

        const bookingdates = {};

        if (checkin !== "") bookingdates.checkin = checkin;
        if (checkout !== "") bookingdates.checkout = checkout;

        if (Object.keys(bookingdates).length > 0) {
            booking.bookingdates = bookingdates;
        }

        if (additionalneeds !== "") {
            booking.additionalneeds = additionalneeds;
        }
    } else {
        booking = {
            firstname,
            lastname,
            totalprice: Number(totalprice),
            depositpaid,
            bookingdates: {
                checkin,
                checkout
            },
            additionalneeds
        };
    }

    const method = usePatch ? "PATCH" : "PUT";

    try {
        const response = await fetch(
            `/api/booking/${bookingId}`,
            {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(booking)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.error || `HTTP ${response.status}`
            );
        }

        document.getElementById("editBookingResult").textContent =
            "Booking Updated";
    } catch (error) {
        console.error(error);

        document.getElementById("editBookingResult").textContent =
            `Unable to update booking: ${error.message}`;
    }
}

async function deleteBooking() {
    console.log("calleddelete")
    const bookingId = document.getElementById("deleteBookingId").value;

    try {
        const response = await fetch(
            `/api/booking/${bookingId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            }
        );

        const result = await response.json();
        if (!response.ok) {
            throw new Error(
                result.error || `HTTP ${response.status}`
            );
        }
        document.getElementById("deleteBookingResult").textContent =
            // JSON.stringify(result, null, 1),
            "Booking Deleted"

    } catch (error) {
        console.error(error);

        document.getElementById("deleteBookingResult").textContent =
            "Unable to delete booking.";
    }
}

document.getElementById("loadBookings").addEventListener("click", () => {
    console.log("Button loadBookings clicked");
    const bookingId = document.getElementById("bookingId").value;

    if (!bookingId) {
        alert("Please enter a booking ID");
        return;
    }

    getBooking(bookingId);
});

document.getElementById("allBookings").addEventListener("click", () => {
    console.log("Button clicked");
    getAllBookings();
});

document.getElementById("createBookingForm").addEventListener("click", function (e) {
    e.preventDefault();
    console.log("Form submitted");
    createBooking();
});

document.getElementById("checkStatus").addEventListener("click", async () => {
    const statusResult = document.getElementById("statusResult");

    try {
        const response = await fetch("/api/ping");

        const data = await response.text();

        if (response.ok || response.status === 201) {
            statusResult.textContent = `API Status: Online (${response.status}) - ${data}`;
        } else {
            statusResult.textContent = `API Error: ${response.status}`;
        }

    } catch (error) {
        console.error(error);

        statusResult.textContent = "API is unavailable";
    }
});

document.getElementById("editBooking").addEventListener("click", editBooking);

document.getElementById("deleteBooking").addEventListener("click", deleteBooking);

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    // console.log(username)
    // console.log(password)

    // console.log(req.body);

    submitBtn.disabled = true;
    submitBtn.textContent = "Signing in…";
    messageEl.textContent = "";
    messageEl.className = "message";

    try {
        const data = await authenticate(username, password);

        if (data.token) {

            messageEl.textContent =
                "Signed in successfully.";

            messageEl.className =
                "message success";


            localStorage.setItem(
                "token",
                data.token
            );
            document.getElementById("loginContainer").style.display = "";
            // document.getElementById("editContainer").style.display = "block";
            // document.getElementById("deleteContainer").style.display = "block";
            document.getElementById("editBookingForm").style.display = "";
            document.getElementById("deleteBookingForm").style.display = "";

        } else {

            messageEl.textContent =
                "Invalid username or password.";

            messageEl.className =
                "message error";

        }


        console.log(data);
        // e.g. store a token: if (data.token) localStorage.setItem("token", data.token);
    } catch (err) {
        messageEl.textContent = err.message || "Something went wrong. Please try again.";
        messageEl.className = "message error";
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Sign in";
    }
});

