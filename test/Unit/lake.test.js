const request = require("supertest");
const app = require("../../server");
const TavakModel = require("../../models/TavakModel");

jest.mock("../../models/TavakModel");

describe("Lake Controller Unit Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });



    test("GET /tavak should return lakes with pagination", async () => {
        const mockLakes = [
            { _id: "1", name: "Lake 1" },
            { _id: "2", name: "Lake 2" }
        ];
        TavakModel.find.mockImplementation(() => ({
            skip: () => ({
                limit: () => ({
                    populate: () => Promise.resolve(mockLakes)
                })
            })
        }));
        TavakModel.countDocuments.mockResolvedValue(2);
        const res = await request(app).get("/tavak?page=1&limit=10");
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual(mockLakes);
        expect(res.body.total).toBe(2);
        expect(res.body.currentPage).toBe(1);
        expect(res.body.totalPages).toBe(1);
    });



    test("GET /tavak/:id should return 400 if lake not found", async () => {
        TavakModel.findById = jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(null)
        });
        const res = await request(app).get("/tavak/999");
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe("Not found");
    });


    test("GET /tavak/:id should handle invalid IDs", async () => {
        TavakModel.findById.mockImplementation(() => {
            throw new Error("Invalid ID format");
        });
        const res = await request(app).get("/tavak/invalid");
        expect(res.status).toBe(404);
    });
});