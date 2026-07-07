document.getElementById("btn").addEventListener("click", () => {
    alert("Button clicked!");
});

async function createBooking() {
    const response = await fetch(`${BASE_URL}/booking`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            firstname: "John",
            lastname: "Doe",
            totalprice: 150,
            depositpaid: true,
            bookingdates: {
                checkin: "2026-07-01",
                checkout: "2026-07-05"
            },
            additionalneeds: "Breakfast"
        })
    });

    const data = await response.json();

    console.log(data);
}

async function getBooking(id) {
    const response = await fetch(`${BASE_URL}/booking/${id}`);
    const booking = await response.json();

    console.log(booking);
}

//createBooking();
//getBooking(1);