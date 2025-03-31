const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../server");
const typicalFishModel = require("../../models/typicalFishModel");

jest.mock("../../models/typicalFishModel");

describe("TypicalFish Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Az adatbáziskapcsolat lezárása
  });

  test("GET /typicalFish should return all fish", async () => {
    const mockData = [{ _id: "1", name: "Ponty", img: "ponty.jpg" }];
    typicalFishModel.find.mockResolvedValue(mockData);

    const res = await request(app).get("/typicalFish");

    expect(res.status).toBe(200);
    expect(res.body.succes).toBe(true);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].name).toBe("Ponty");
  });

  test("GET /typicalFish/:id should return a fish by ID", async () => {
    const mockFish = { _id: "1", name: "Ponty", img: "ponty.jpg" };
    typicalFishModel.findById.mockResolvedValue(mockFish);

    const res = await request(app).get("/typicalFish/1");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Ponty");
  });

  test("GET /typicalFish/:id should return 400 if fish not found", async () => {
    typicalFishModel.findById.mockResolvedValue(null);

    const res = await request(app).get("/typicalFish/999");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.msg).toBe("Not found");
  });
});
