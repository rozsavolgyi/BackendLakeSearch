const request = require("supertest");
const app = require("../../server");
const fs = require('fs');

// Mockolás beállítása
jest.mock("../../models/CatchModel");
jest.mock("../../models/FishModel");
jest.mock("../../models/TavakModel");
jest.mock("../../models/MethodModel");
jest.mock("../../models/User");
jest.mock("fs");

const Catch = require("../../models/CatchModel");
const Fish = require("../../models/FishModel");
const Lake = require("../../models/TavakModel");
const Method = require("../../models/MethodModel");
const User = require("../../models/User");

describe("Catch Controller Unit Tests", () => {
  // Teszt beállítások
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET /catch tesztek
  test("GET /catch should return all catches", async () => {
    const mockCatches = [
      {
        _id: "1",
        fish: { _id: "f1", name: "Ponty", img: "ponty.jpg" },
        lake: { _id: "l1", name: "Velencei-tó" },
        user: { _id: "u1", name: "Teszt Felhasználó" },
        method: { _id: "m1", name: "Úszós" },
        weight: 5.2,
        length: 65,
        date: "2023-06-15",
        bait: "Kukorica",
        description: "Szép fogás a hajnali órában",
        img: "http://localhost:3000/uploads/image1.jpg",
        catchandrelease: true
      },
      {
        _id: "2",
        fish: { _id: "f2", name: "Csuka", img: "csuka.jpg" },
        lake: { _id: "l1", name: "Velencei-tó" },
        user: { _id: "u1", name: "Teszt Felhasználó" },
        method: { _id: "m2", name: "Pergető" },
        weight: 3.5,
        length: 78,
        date: "2023-06-16",
        bait: "Villantó",
        description: "Erős küzdelem a ragadozóval",
        img: "http://localhost:3000/uploads/image2.jpg",
        catchandrelease: false
      }
    ];

    Catch.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockCatches)
          })
        })
      })
    });

    const res = await request(app).get("/catch");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(2);
    expect(res.body.data).toEqual(mockCatches);
  });

  test("GET /catch should filter by lake", async () => {
    const mockCatches = [
      {
        _id: "1",
        fish: { _id: "f1", name: "Ponty", img: "ponty.jpg" },
        lake: { _id: "l1", name: "Velencei-tó" },
        user: { _id: "u1", name: "Teszt Felhasználó" },
        method: { _id: "m1", name: "Úszós" }
      }
    ];

    Catch.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockCatches)
          })
        })
      })
    });

    const res = await request(app).get("/catch?lakeId=l1");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
    expect(Catch.find).toHaveBeenCalledWith({ lake: "l1" });
  });

  test("GET /catch should handle server errors", async () => {
    Catch.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockRejectedValue(new Error("Database error"))
          })
        })
      })
    });

    const res = await request(app).get("/catch");

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Hiba történt a fogások lekérésekor");
  });

  // GET /catch/:id tesztek
  test("GET /catch/:id should return a specific catch", async () => {
    const mockCatch = {
      _id: "1",
      fish: { _id: "f1", name: "Ponty" },
      lake: { _id: "l1", name: "Velencei-tó" },
      user: { _id: "u1", name: "Teszt Felhasználó" },
      method: { _id: "m1", name: "Úszós" },
      weight: 5.2,
      length: 65,
      date: "2023-06-15",
      bait: "Kukorica",
      description: "Szép fogás a hajnali órában"
    };

    Catch.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockCatch)
          })
        })
      })
    });

    const res = await request(app).get("/catch/1");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockCatch);
  });

  test("GET /catch/:id should return 400 if catch not found", async () => {
    Catch.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(null)
          })
        })
      })
    });

    const res = await request(app).get("/catch/999");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Nem található");
  });

  test("GET /catch/:id should handle invalid IDs", async () => {
    Catch.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockRejectedValue(new Error("Invalid ID"))
          })
        })
      })
    });

    const res = await request(app).get("/catch/invalid_id");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe("Catch id (invalid_id) not correct");
  });

  // POST /catch tesztek
  test("POST /catch should create a new catch", async () => {
    const mockFish = {
      _id: "f1",
      name: "Ponty",
      min_weight: 0.5,
      max_weight: 20,
      min_length: 20,
      max_length: 100
    };

    Fish.findById.mockResolvedValue(mockFish);

    const newCatch = {
      _id: "new1",
      fish: "f1",
      weight: 5.2,
      length: 65,
      date: "2023-06-15",
      method: "m1",
      lake: "l1",
      user: "u1",
      bait: "Kukorica",
      description: "Szép fogás a hajnali órában",
      catchandrelease: "false"
    };

    Catch.prototype.save = jest.fn().mockResolvedValue({
      ...newCatch,
      _id: "new1",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP-OEry7CChvfqglcuIYjclKu7b0NEcMeegg&s"
    });

    const res = await request(app)
      .post("/catch")
      .send(newCatch);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Fogás sikeresen létrehozva");
    expect(res.body.data).toHaveProperty("_id", "new1");
  });

  test("POST /catch should validate fish parameters", async () => {
    const mockFish = {
      _id: "f1",
      name: "Ponty",
      min_weight: 0.5,
      max_weight: 20,
      min_length: 20,
      max_length: 100
    };

    Fish.findById.mockResolvedValue(mockFish);

    const invalidCatch = {
      fish: "f1",
      weight: 50, // Túl nagy súly
      length: 65,
      date: "2023-06-15",
      method: "m1",
      lake: "l1",
      user: "u1",
      bait: "Kukorica",
      description: "Szép fogás a hajnali órában",
      catchandrelease: "false"
    };

    const res = await request(app)
      .post("/catch")
      .send(invalidCatch);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("A hal súlya 0.5-20 kg között lehet!");
  });

  // DELETE /catch/:id tesztek
  test("DELETE /catch/:id should delete a catch", async () => {
    const mockCatch = {
      _id: "1",
      img: "http://localhost:3000/uploads/image1.jpg"
    };

    Catch.findById.mockResolvedValue(mockCatch);
    Catch.findByIdAndDelete.mockResolvedValue(mockCatch);
    fs.unlink.mockImplementation((path, callback) => callback(null));

    const res = await request(app).delete("/catch/1");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Fogás és a hozzá tartozó fájl sikeresen törölve");
    expect(res.body.deletedCatch).toEqual(mockCatch);
    expect(fs.unlink).toHaveBeenCalled();
  });

  test("DELETE /catch/:id should handle default images", async () => {
    const mockCatch = {
      _id: "1",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP-OEry7CChvfqglcuIYjclKu7b0NEcMeegg&s"
    };

    Catch.findById.mockResolvedValue(mockCatch);
    Catch.findByIdAndDelete.mockResolvedValue(mockCatch);

    const res = await request(app).delete("/catch/1");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Fogás és a hozzá tartozó fájl sikeresen törölve");
    expect(fs.unlink).not.toHaveBeenCalled(); // Nem törölheti az alapértelmezett képet
  });

  // PUT /catch/:id tesztek
  test("PUT /catch/:id should update a catch", async () => {
    const mockCatch = {
      _id: "1",
      fish: "f1",
      weight: 5.2,
      length: 65,
      date: "2023-06-15",
      method: "m1",
      lake: "l1",
      user: "u1",
      bait: "Kukorica",
      description: "Régi leírás",
      img: "http://localhost:3000/uploads/image1.jpg",
      save: jest.fn().mockResolvedValue({
        _id: "1",
        fish: "f1",
        weight: 5.5,
        length: 70,
        date: "2023-06-15",
        method: "m1",
        lake: "l1",
        user: "u1",
        bait: "Bojli",
        description: "Új leírás",
        img: "http://localhost:3000/uploads/image1.jpg"
      })
    };

    const updatedData = {
      fish: "f1",
      weight: 5.5,
      length: 70,
      date: "2023-06-15",
      method: "m1",
      lake: "l1",
      user: "u1",
      bait: "Bojli",
      description: "Új leírás",
      img: "http://localhost:3000/uploads/image1.jpg"
    };

    Fish.findById.mockResolvedValue({ _id: "f1" });
    Method.findById.mockResolvedValue({ _id: "m1" });
    Lake.findById.mockResolvedValue({ _id: "l1" });
    User.findById.mockResolvedValue({ _id: "u1" });
    Catch.findById.mockResolvedValue(mockCatch);

    const res = await request(app)
      .put("/catch/1")
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Fogás sikeresen frissítve");
    expect(mockCatch.bait).toBe("Bojli");
    expect(mockCatch.description).toBe("Új leírás");
  });

  // GET /catch/user/:userId tesztek
  test("GET /catch/user/:userId should return user's catches", async () => {
    const mockCatches = [
      {
        _id: "1",
        fish: { _id: "f1", name: "Ponty", img: "ponty.jpg" },
        lake: { _id: "l1", name: "Velencei-tó" },
        user: { _id: "u1", name: "Teszt Felhasználó" },
        method: { _id: "m1", name: "Úszós" }
      }
    ];

    Catch.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockCatches)
          })
        })
      })
    });

    const res = await request(app).get("/catch/user/u1");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockCatches);
    expect(Catch.find).toHaveBeenCalledWith({ user: "u1" });
  });

  test("GET /catch/user/:userId should return empty array if no catches", async () => {
    Catch.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue([])
          })
        })
      })
    });

    const res = await request(app).get("/catch/user/u1");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });
});