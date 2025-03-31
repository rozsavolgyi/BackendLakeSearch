const request = require("supertest");
const app = require("../../server");
const MethodModel = require("../../models/MethodModel");

// Mockoljuk a Mongoose modellt
jest.mock("../../models/MethodModel");

describe("Method Controller Unit Tests", () => {
    afterEach(() => {
        jest.clearAllMocks(); // Minden teszt után töröljük a mockokat
    });


    test("GET /method should return all methods", async () => {
        const mockData = [
            { _id: "1", name: "Feeder" },
            { _id: "2", name: "Bojlis" }
        ];

        MethodModel.find.mockResolvedValue(mockData); // Mockolt válasz

        const res = await request(app).get("/method");

        expect(res.status).toBe(200);
        expect(res.body.succes).toBe(true);
        expect(res.body.count).toBe(2);
        expect(res.body.data).toEqual(mockData);
    });

    test("GET /method/:id should return a method by ID", async () => {
        const mockMethod = { _id: "1", name: "Feeder" };

        MethodModel.findById.mockResolvedValue(mockMethod);

        const res = await request(app).get("/method/1");

        expect(res.status).toBe(200);
        expect(res.body.succes).toBe(true);
        expect(res.body.data).toEqual(mockMethod);
    });

    test("GET /method/:id should return 400 if method not found", async () => {
        MethodModel.findById.mockResolvedValue(null);

        const res = await request(app).get("/method/999");

        expect(res.status).toBe(400);
        expect(res.body.succes).toBe(false);
        expect(res.body.msg).toBe("Not found");
    });

    test("GET /method should handle errors", async () => {
        MethodModel.find.mockRejectedValue(new Error("Database error"));

        const res = await request(app).get("/method");

        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
    });

    test("GET /method/:id should handle invalid IDs", async () => {
        MethodModel.findById.mockImplementation(() => {
            throw new Error("Invalid ID format");
        });

        const res = await request(app).get("/method/invalid");

        expect(res.status).toBe(404);
    });
});
