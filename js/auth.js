async function getToken() {
    const response = await fetch(`${BASE_URL}/auth`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: "admin",
            password: "password123"
        })
    });

    const token = await response.json();

    console.log(token);
}