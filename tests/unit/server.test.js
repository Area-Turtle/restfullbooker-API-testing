// const express = require("express");
// const app = express();
// app.use(express.json());

const app = require("../../server");

describe("GET /api/ping", () => {
    test("should return successful ping response", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            status: 201,
            text: jest.fn().mockResolvedValue("Created")
        });

        const req = {
            method: "GET",
            url: "/api/ping"
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn()
        };

        const route = app._router.stack.find(
            layer => layer.route && layer.route.path === "/api/ping"
        );

        await route.route.stack[0].handle(req, res);

        expect(fetch).toHaveBeenCalledWith(
            "https://restful-booker.herokuapp.com/ping"
        );

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith("Created");
    });

    test("should return 500 when ping fails", async () => {
        global.fetch = jest.fn().mockRejectedValue(
            new Error("Network error")
        );

        const req = {
            method: "GET",
            url: "/api/ping"
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn()
        };

        const route = app._router.stack.find(
            layer => layer.route && layer.route.path === "/api/ping"
        );

        await route.route.stack[0].handle(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: "Ping failed"
        });
    });
});