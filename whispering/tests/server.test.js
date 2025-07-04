import supertest from "supertest";
import { app } from "../server.js";
import { getById } from "../store.js";
import {
  restoreDB,
  populateDB,
  getFixture,
  ensureDbConnection,
  normalize,
  closeDbConnection,
} from "./utils.js";

let whispers;
let inventedId;
let existingId;

describe("Server", () => {
  beforeAll(ensureDbConnection);
  beforeEach(async () => {
    await restoreDB();
    await populateDB(whispers);
    const fixtures = await getFixture();
    whispers = fixtures.whispers;
    inventedId = fixtures.inventedId;
    existingId = fixtures.existingId;
  });
  afterAll(closeDbConnection);

  describe("/about", () => {
    it("Should return a 200 with the tolta whispers in the platform", async () => {
      const response = await supertest(app).get("/about");
      expect(response.status).toBe(200);
      expect(response.text).toContain(
        `Currently there are ${whispers.length} whispers available`
      );
    });
  });

  describe("GET /api/v1/whisper", () => {
    it("Should return an empy array when there's no data", async () => {
      await restoreDB();
      const response = await supertest(app).get("/api/v1/whisper");
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
    it("Shoud return all the whispers", async () => {
      const response = await supertest(app).get("/api/v1/whisper");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(whispers);
    });
  });

  describe("GET /api/v1/whisper/:id", () => {
    it("Should return a 404 when the whisper doesn't exist", async () => {
      const response = await supertest(app).get(
        `/api/v1/whisper/${inventedId}`
      );
      expect(response.status).toBe(404);
    });
    it("Should return a whisper details", async () => {
      const response = await supertest(app).get(
        `/api/v1/whisper/${existingId}`
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(whispers.find((w) => w.id === existingId));
    });
  });

  describe("POST /api/v1/whisper", () => {
    it("Should return a 400 when the body is empty", async () => {
      const response = await supertest(app).post("/api/v1/whisper").send({});
      expect(response.status).toBe(400);
    });
    it("Should return a 400 when the body is invalid", async () => {
      const response = await supertest(app)
        .post("/api/v1/whisper")
        .send({ invented: "This is a new shisper" });
      expect(response.status).toBe(400);
    });
    it("Shoud return a 201 when the whisper is created", async () => {
      const newWhisper = {
        message: "Test 3",
      };
      const response = await supertest(app)
        .post("/api/v1/whisper")
        .send({ message: newWhisper.message });

      expect(response.status).toBe(201);
      expect(response.body.message).toEqual(newWhisper.message);

      const storedWhisper = await getById(response.body.id);
      expect(normalize(storedWhisper).message).toStrictEqual(
        newWhisper.message
      );
    });
  });

  describe("PUT /api/v1/whisper/:id", () => {
    it("Should return a 400 when the body is empty", async () => {
      const response = await supertest(app)
        .put(`/api/v1/whisper/${existingId}`)
        .send({});
      expect(response.status).toBe(400);
    });
    it("Should return a 400 when the body is invalid", async () => {
      const response = await supertest(app)
        .put(`/api/v1/whisper/${existingId}`)
        .send({
          invented: "Hello",
        });
      expect(response.status).toBe(400);
    });
    it("Should return a 404 when the whisper doesn't exist", async () => {
      const response = await supertest(app)
        .put(`/api/v1/whisper/${inventedId}`)
        .send({ message: "Dosen't work" });
      expect(response.status).toBe(404);
    });
    it("Should return a 200 when the whisper is updated", async () => {
      const resposne = await supertest(app)
        .put(`/api/v1/whisper/${existingId}`)
        .send({ message: "body changed" });

      expect(resposne.status).toBe(200);
      const storedWhisper = await getById(existingId);
      expect(normalize(storedWhisper)).toStrictEqual({
        id: existingId,
        message: "body changed",
      });
    });
  });

  describe("DELETE /api/v1/whisper/:id", () => {
    it("Should return a 404 when the whisper doesn't exist", async () => {
      const response = await supertest(app).delete(
        `/api/v1/whisper/${inventedId}`
      );
      expect(response.status).toBe(404);
    });
    it("Shoudl return a 200 when the whisper is deleted", async () => {
      const response = await supertest(app).delete(
        `/api/v1/whisper/${existingId}`
      );
      expect(response.status).toBe(200);

      const storedWhisper = await getById(existingId);
      expect(storedWhisper).toBe(null);
    });
  });
});
