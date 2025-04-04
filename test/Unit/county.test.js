const request = require("supertest");
const app = require("../../server");

jest.mock("../../models/CountyModel");
const CountyModel = require("../../models/CountyModel");

describe("County Controller Unit Tests", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });


  test("GET /county should return all counties", async () => {
    const mockCounties = [
      {
        _id: "1",
        name: "Pest megye",
        lake: [
          { _id: "101", name: "Velencei-tó" },
          { _id: "102", name: "Pusztaszeri-tó" }
        ]
      },
      {
        _id: "2",
        name: "Fejér megye",
        lake: [
          { _id: "103", name: "Tisza-tó" }
        ]
      }
    ];

    CountyModel.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockCounties)
    });

    const res = await request(app).get("/county");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(2);
    expect(res.body.data).toEqual(mockCounties);
    expect(CountyModel.find).toHaveBeenCalledWith({});
  });

  test("GET /county should handle query parameters", async () => {
    const mockCounties = [
      {
        _id: "1",
        name: "Pest megye",
        lake: [
          { _id: "101", name: "Velencei-tó" },
          { _id: "102", name: "Pusztaszeri-tó" }
        ]
      }
    ];

    CountyModel.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockCounties)
    });

    const res = await request(app).get("/county?name=Pest megye");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
    expect(CountyModel.find).toHaveBeenCalledWith({ name: "Pest megye" });
  });

  test("GET /county should handle server errors", async () => {
    CountyModel.find.mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error("Database error"))
    });

    const res = await request(app).get("/county");

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });


  test("GET /county/:id should return a specific county", async () => {
    const mockCounty = {
      _id: "1",
      name: "Pest megye",
      lake: [
        { _id: "101", name: "Velencei-tó" },
        { _id: "102", name: "Pusztaszeri-tó" }
      ]
    };

    CountyModel.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockCounty)
    });

    const res = await request(app).get("/county/1");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockCounty);
  });

  test("GET /county/:id should return 400 if county not found", async () => {
    CountyModel.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null)
    });

    const res = await request(app).get("/county/999");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.msg).toBe("Not found");
  });

  test("GET /county/:id should handle invalid IDs", async () => {
    CountyModel.findById.mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error("Invalid ID"))
    });

    const res = await request(app).get("/county/invalid_id");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe("County id (invalid_id) not correct");
  });
});