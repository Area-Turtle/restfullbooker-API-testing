// const express = require("express");
// const app = express();
// app.use(express.json());
require("dotenv").config();
const SERVER_API_URL = process.env.SERVER_API_URL;
const { app, startServer } = require("../../server");

describe("Server", () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should start server and log server address", () => {

        const listenMock = jest
            .spyOn(app, "listen")
            .mockImplementation((port, callback) => {
                callback();
                return {};
            });

        const consoleLogMock = jest
            .spyOn(console, "log")
            .mockImplementation();

        startServer();

        expect(listenMock).toHaveBeenCalled();

        expect(consoleLogMock).toHaveBeenCalledWith(
            expect.stringContaining("Server running at")
        );
    });

});
// Ping Unit Tests
describe("GET /api/ping", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => { });
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    test("should return successful ping response", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            status: 201,
            text: jest.fn().mockResolvedValue("Created")
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn()
        };

        const route = app.router.stack.find(
            layer => layer.route?.path === "/api/ping"
        );

        await route.route.stack[0].handle(req, res);

        expect(fetch).toHaveBeenCalledWith(
            `${SERVER_API_URL}/ping`
        );

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith("Created");
    });

    test("should return 500 when ping fails", async () => {
        global.fetch = jest.fn().mockRejectedValue(
            new Error("Network error")
        );

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn()
        };

        const route = app.router.stack.find(
            layer => layer.route?.path === "/api/ping"
        );

        await route.route.stack[0].handle(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: "Ping failed"
        });
    });
});

describe("POST /api/auth", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => { });
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should authenticate successfully", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            status: 200,
            json: jest.fn().mockResolvedValue({
                token: "abc123"
            })
        });

        const req = {
            body: {
                username: "admin",
                password: "password123"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const route = app.router.stack.find(
            layer => layer.route?.path === "/api/auth"
        );

        await route.route.stack[0].handle(req, res);

        expect(fetch).toHaveBeenCalledWith(
            `${SERVER_API_URL}/auth`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: "admin",
                    password: "password123"
                })
            }
        );

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            token: "abc123"
        });
    });

    test("should return 500 when authentication fails", async () => {
        global.fetch = jest.fn().mockRejectedValue(
            new Error("Authentication request failed")
        );

        const req = {
            body: {
                username: "admin",
                password: "wrongpassword"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const route = app.router.stack.find(
            layer => layer.route?.path === "/api/auth"
        );

        await route.route.stack[0].handle(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: "Unable to authenticate."
        });
    });
});

describe("GET /api/booking/:id", () => {

    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should return booking details", async () => {
        const booking = {
            firstname: "John",
            lastname: "Doe",
            totalprice: 100,
            depositpaid: true
        };

        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue(booking)
        });

        const req = {
            params: {
                id: "1"
            }
        };

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const route = app.router.stack.find(
            layer => layer.route?.path === "/api/booking/:id"
        );

        await route.route.stack[0].handle(req, res);

        expect(fetch).toHaveBeenCalledWith(
            `${SERVER_API_URL}/booking/1`
        );

        expect(res.json).toHaveBeenCalledWith(booking);
    });

    test("should return 500 when fetching booking fails", async () => {
        global.fetch = jest.fn().mockRejectedValue(
            new Error("Network error")
        );

        const req = {
            params: {
                id: "1"
            }
        };

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const route = app.router.stack.find(
            layer => layer.route?.path === "/api/booking/:id"
        );

        await route.route.stack[0].handle(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: "Booking Entry doesn't Exist"
        });
    });
});

describe("GET /api/booking", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should return all bookings", async () => {
        const bookings = [
            {
                bookingid: 1,
                booking: {
                    firstname: "John",
                    lastname: "Doe",
                    totalprice: 100
                }
            },
            {
                bookingid: 2,
                booking: {
                    firstname: "Jane",
                    lastname: "Smith",
                    totalprice: 200
                }
            }
        ];

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValue(bookings)
        });

        const req = {};

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const route = app.router.stack.find(
            layer => layer.route?.path === "/api/booking"
        );

        await route.route.stack[0].handle(req, res);

        expect(fetch).toHaveBeenCalledWith(
            `${SERVER_API_URL}/booking`
        );

        expect(res.json).toHaveBeenCalledWith(bookings);
    });

    test("should return 500 when API returns an error status", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 500
        });

        const req = {};

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const route = app.router.stack.find(
            layer => layer.route?.path === "/api/booking"
        );

        await route.route.stack[0].handle(req, res);

        expect(fetch).toHaveBeenCalledWith(
            `${SERVER_API_URL}/booking`
        );

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: "Unable to fetch bookings."
        });
    });

    test("should return 500 when fetching bookings fails", async () => {
        global.fetch = jest.fn().mockRejectedValue(
            new Error("Network error")
        );

        const req = {};

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const route = app.router.stack.find(
            layer => layer.route?.path === "/api/booking"
        );

        await route.route.stack[0].handle(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: "Unable to fetch bookings."
        });
    });
});

describe("POST /api/booking", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should create booking successfully", async () => {
        const booking = {
            firstname: "John",
            lastname: "Doe",
            totalprice: 100,
            depositpaid: true
        };

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValue(booking)
        });

        const req = {
            body: booking
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const route = app.router.stack.find(
            layer =>
                layer.route?.path === "/api/booking" &&
                layer.route?.methods?.post
        );

        await route.route.stack[0].handle(req, res);

        expect(fetch).toHaveBeenCalledWith(
            `${SERVER_API_URL}/booking`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(booking)
            }
        );

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith(booking);
    });

    test("should return 400 for invalid booking ID", async () => {

        const req = {
            params: {
                id: "abc"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const route = app.router.stack.find(
            layer =>
                layer.route?.path === "/api/booking/:id" &&
                layer.route?.methods?.get
        );

        await route.route.stack[0].handle(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            error: "Invalid booking ID"
        });
    });

    test("should return API error status when creating booking fails", async () => {

        const errorResponse = {
            error: "Invalid booking data"
        };

        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 400,
            json: jest.fn().mockResolvedValue(errorResponse)
        });

        const req = {
            body: {
                firstname: "John"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const route = app.router.stack.find(
            layer =>
                layer.route?.path === "/api/booking" &&
                layer.route?.methods?.post
        );

        await route.route.stack[0].handle(req, res);

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining("/booking"),
            expect.objectContaining({
                method: "POST"
            })
        );

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith(errorResponse);
    });

    test("should return 500 when creating booking fails unexpectedly", async () => {
        global.fetch = jest.fn().mockRejectedValue(
            new Error("Network error")
        );

        const req = {
            body: {
                firstname: "John",
                lastname: "Doe"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const route = app.router.stack.find(
            layer =>
                layer.route?.path === "/api/booking" &&
                layer.route?.methods?.post
        );

        await route.route.stack[0].handle(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: "Failed to create booking"
        });
    });
});

describe("PUT /api/booking/:id", () => {
    beforeEach(() => {
        jest.spyOn(console, "log").mockImplementation(() => { });
        jest.spyOn(console, "error").mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should update booking successfully", async () => {
        const updatedBooking = {
            firstname: "John",
            lastname: "Updated",
            totalprice: 200,
            depositpaid: true
        };

        global.fetch = jest.fn()
            // Auth request
            .mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue({
                    token: "abc123"
                })
            })
            // PUT booking request
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: jest.fn().mockResolvedValue(updatedBooking)
            });

        const req = {
            params: {
                id: "1"
            },
            body: updatedBooking
        };

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const route = app.router.stack.find(
            layer =>
                layer.route?.path === "/api/booking/:id" &&
                layer.route?.methods?.put
        );

        await route.route.stack[0].handle(req, res);

        expect(fetch).toHaveBeenNthCalledWith(
            1,
            `${SERVER_API_URL}/auth`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: "admin",
                    password: "password123"
                })
            }
        );

        expect(fetch).toHaveBeenNthCalledWith(
            2,
            `${SERVER_API_URL}/booking/1`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": "token=abc123"
                },
                body: JSON.stringify(updatedBooking)
            }
        );

        expect(res.json).toHaveBeenCalledWith(updatedBooking);
    });

    test("should return API error status when booking update fails", async () => {
        const errorResponse = {
            error: "Booking does not exist"
        };

        global.fetch = jest.fn()
            // Auth request
            .mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue({
                    token: "abc123"
                })
            })
            // PUT booking request
            .mockResolvedValueOnce({
                ok: false,
                status: 404,
                json: jest.fn().mockResolvedValue(errorResponse)
            });

        const req = {
            params: {
                id: "999"
            },
            body: {
                firstname: "John",
                lastname: "Doe"
            }
        };

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const route = app.router.stack.find(
            layer =>
                layer.route?.path === "/api/booking/:id" &&
                layer.route?.methods?.put
        );

        await route.route.stack[0].handle(req, res);

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith(errorResponse);
    });

    test("should return 500 when booking update fails unexpectedly", async () => {
        global.fetch = jest.fn().mockRejectedValue(
            new Error("Network error")
        );

        const req = {
            params: {
                id: "1"
            },
            body: {
                firstname: "John",
                lastname: "Doe"
            }
        };

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const route = app.router.stack.find(
            layer => layer.route?.path === "/api/booking/:id" &&
                layer.route?.methods?.put
        );

        await route.route.stack[0].handle(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: "Booking Entry doesn't Exist"
        });
    });

    test("should return 400 for invalid booking ID", async () => {

        const req = {
            params: {
                id: "abc"
            },
            body: {}
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const route = app.router.stack.find(
            layer =>
                layer.route?.path === "/api/booking/:id" &&
                layer.route?.methods?.put
        );

        await route.route.stack[0].handle(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            error: "Invalid booking ID"
        });
    });
});

describe("PATCH /api/booking/:id", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should update booking successfully and return JSON", async () => {
        const updatedBooking = {
            firstname: "John",
            lastname: "Updated",
            totalprice: 250
        };

        global.fetch = jest.fn()
            // Auth request
            .mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue({
                    token: "abc123"
                })
            })
            // PATCH booking request
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                text: jest.fn().mockResolvedValue(
                    JSON.stringify(updatedBooking)
                )
            });

        const req = {
            params: {
                id: "1"
            },
            body: {
                lastname: "Updated",
                totalprice: 250
            }
        };

        const res = {
            json: jest.fn(),
            send: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const route = app.router.stack.find(
            layer => layer.route?.path === "/api/booking/:id" &&
                layer.route?.methods?.patch
        );

        await route.route.stack[0].handle(req, res);

        expect(fetch).toHaveBeenNthCalledWith(
            1,
            `${SERVER_API_URL}/auth`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: "admin",
                    password: "password123"
                })
            }
        );

        expect(fetch).toHaveBeenNthCalledWith(
            2,
            `${SERVER_API_URL}/booking/1`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": "token=abc123"
                },
                body: JSON.stringify(req.body)
            }
        );

        expect(res.json).toHaveBeenCalledWith(updatedBooking);
    });

    test("should return plain text when response is not valid JSON", async () => {
        const responseText = "Booking updated successfully";

        global.fetch = jest.fn()
            // Auth request
            .mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue({
                    token: "abc123"
                })
            })
            // PATCH booking request
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                text: jest.fn().mockResolvedValue(responseText)
            });

        const req = {
            params: {
                id: "1"
            },
            body: {
                lastname: "Updated"
            }
        };

        const res = {
            json: jest.fn(),
            send: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const route = app.router.stack.find(
            layer => layer.route?.path === "/api/booking/:id" &&
                layer.route?.methods?.patch
        );

        await route.route.stack[0].handle(req, res);

        expect(res.send).toHaveBeenCalledWith(responseText);
    });

    test("should return API error when PATCH fails", async () => {
        const errorResponse = "Booking does not exist";

        global.fetch = jest.fn()
            // Auth request
            .mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue({
                    token: "abc123"
                })
            })
            // PATCH booking request
            .mockResolvedValueOnce({
                ok: false,
                status: 404,
                text: jest.fn().mockResolvedValue(errorResponse)
            });

        const req = {
            params: {
                id: "999"
            },
            body: {
                lastname: "Updated"
            }
        };

        const res = {
            json: jest.fn(),
            send: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const route = app.router.stack.find(
            layer =>
                layer.route?.path === "/api/booking/:id" &&
                layer.route?.methods?.patch
        );

        await route.route.stack[0].handle(req, res);

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({
            error: errorResponse
        });
    });

    test("should return 500 when PATCH request fails unexpectedly", async () => {
        global.fetch = jest.fn().mockRejectedValue(
            new Error("Network error")
        );

        const req = {
            params: {
                id: "1"
            },
            body: {
                lastname: "Updated"
            }
        };

        const res = {
            json: jest.fn(),
            send: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const route = app.router.stack.find(
            layer => layer.route?.path === "/api/booking/:id" &&
                layer.route?.methods?.patch
        );

        await route.route.stack[0].handle(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: "Booking Entry doesn't Exist"
        });
    });

    test("should return 400 for invalid booking ID", async () => {

        const req = {
            params: {
                id: "abc"
            },
            body: {}
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };

        const route = app.router.stack.find(
            layer =>
                layer.route?.path === "/api/booking/:id" &&
                layer.route?.methods?.patch
        );

        await route.route.stack[0].handle(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            error: "Invalid booking ID"
        });
    });
});

describe("DELETE /api/booking/:id", () => {
    beforeEach(() => {
        jest.spyOn(console, "log").mockImplementation(() => { });
        jest.spyOn(console, "error").mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should delete booking successfully with JSON response", async () => {
        const deleteResponse = {
            message: "Booking deleted successfully"
        };

        global.fetch = jest.fn()
            // Auth request
            .mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue({
                    token: "abc123"
                })
            })
            // DELETE booking request
            .mockResolvedValueOnce({
                ok: true,
                status: 201,
                headers: {
                    get: jest.fn().mockReturnValue("application/json")
                },
                json: jest.fn().mockResolvedValue(deleteResponse)
            });

        const req = {
            params: {
                id: "1"
            }
        };

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const route = app.router.stack.find(
            layer =>
                layer.route?.path === "/api/booking/:id" &&
                layer.route?.methods?.delete
        );

        await route.route.stack[0].handle(req, res);

        expect(fetch).toHaveBeenNthCalledWith(
            1,
            `${SERVER_API_URL}/auth`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: "admin",
                    password: "password123"
                })
            }
        );

        expect(fetch).toHaveBeenNthCalledWith(
            2,
            `${SERVER_API_URL}/booking/1`,
            {
                method: "DELETE",
                headers: {
                    "Cookie": "token=abc123"
                }
            }
        );

        expect(res.json).toHaveBeenCalledWith({
            bookingid: "1",
            response: deleteResponse
        });
    });

    test("should delete booking successfully with text response", async () => {
        const deleteResponse = "Created";

        global.fetch = jest.fn()
            // Auth request
            .mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue({
                })
            })
            // DELETE booking request
            .mockResolvedValueOnce({
                ok: true,
                status: 201,
                headers: {
                    get: jest.fn().mockReturnValue("text/plain")
                },
                text: jest.fn().mockResolvedValue(deleteResponse)
            });

        const req = {
            params: {
                id: "1"
            }
        };

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const route = app.router.stack.find(
            layer =>
                layer.route?.path === "/api/booking/:id" &&
                layer.route?.methods?.delete
        );

        await route.route.stack[0].handle(req, res);

        expect(res.json).toHaveBeenCalledWith({
            bookingid: "1",
            response: deleteResponse
        });
    });

    test("should return API error status when deleting booking fails", async () => {
        const errorResponse = "Booking does not exist";

        global.fetch = jest.fn()
            // Auth request
            .mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue({
                })
            })
            // DELETE booking request
            .mockResolvedValueOnce({
                ok: false,
                status: 404,
                headers: {
                    get: jest.fn().mockReturnValue("text/plain")
                },
                text: jest.fn().mockResolvedValue(errorResponse)
            });

        const req = {
            params: {
                id: "999"
            }
        };

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const route = app.router.stack.find(
            layer =>
                layer.route?.path === "/api/booking/:id" &&
                layer.route?.methods?.delete
        );

        await route.route.stack[0].handle(req, res);

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({
            error: errorResponse
        });
    });

    test("should return 500 when deleting booking fails unexpectedly", async () => {
        global.fetch = jest.fn().mockRejectedValue(
            new Error("Network error")
        );

        const req = {
            params: {
                id: "1"
            }
        };

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        const route = app.router.stack.find(
            layer =>
                layer.route?.path === "/api/booking/:id" &&
                layer.route?.methods?.delete
        );

        await route.route.stack[0].handle(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: "Booking Entry Doesn't Exist"
        });
    });

    test("should return 400 for invalid booking ID", async () => {

        const req = {
            params: {
                id: "abc"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const route = app.router.stack.find(
            layer =>
                layer.route?.path === "/api/booking/:id" &&
                layer.route?.methods?.delete
        );

        await route.route.stack[0].handle(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            error: "Invalid booking ID"
        });
    });
});