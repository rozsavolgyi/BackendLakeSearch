const request = require("supertest");
const app = require("../../server");
jest.mock("../../models/FishModel");
const FishModel = require("../../models/FishModel");

describe("Fish Controller Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  test("GET /fish should return all fish", async () => {
    const mockFish = [
      {
        _id: "1",
        name: "Ponty",
        min_length: 30,
        max_length: 100,
        min_weight: 0.5,
        max_weight: 20,
        curfew: { start: "10-01", end: "04-30" }
      },
      {
        _id: "2",
        name: "Csuka",
        min_length: 40,
        max_length: 130,
        min_weight: 1,
        max_weight: 25,
        curfew: { start: "02-01", end: "03-31" }
      }
    ];

    FishModel.find.mockResolvedValue(mockFish);

    const res = await request(app).get("/fish");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(2);
    expect(res.body.data).toEqual(mockFish);
  });

  test("GET /fish should handle query parameters", async () => {
    const mockFish = [
      {
        _id: "1",
        name: "Ponty",
        min_length: 30,
        max_length: 100,
        min_weight: 0.5,
        max_weight: 20,
        curfew: { start: "10-01", end: "04-30" }
      }
    ];

    FishModel.find.mockResolvedValue(mockFish);

    const res = await request(app).get("/fish?name=Ponty");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
    expect(FishModel.find).toHaveBeenCalledWith({ name: "Ponty" });
  });

  test("GET /fish should handle server errors", async () => {
    FishModel.find.mockRejectedValue(new Error("Database error"));

    const res = await request(app).get("/fish");

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });

  test("GET /fish/:id should return a specific fish", async () => {
    const mockFish = {
      _id: "1",
      name: "Ponty",
      min_length: 30,
      max_length: 100,
      min_weight: 0.5,
      max_weight: 20,
      curfew: { start: "10-01", end: "04-30" }
    };

    FishModel.findById.mockResolvedValue(mockFish);

    const res = await request(app).get("/fish/1");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockFish);
  });

  test("GET /fish/:id should return 400 if fish not found", async () => {
    FishModel.findById.mockResolvedValue(null);

    const res = await request(app).get("/fish/999");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.msg).toBe("Not found");
  });

  test("GET /fish/:id should handle invalid IDs", async () => {
    FishModel.findById.mockRejectedValue(new Error("Invalid ID"));

    const res = await request(app).get("/fish/invalid_id");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe("Fish id (invalid_id) not correct");
  });
});