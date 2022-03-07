const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));
afterAll(() => {
  connection.end();
});

describe("App", () => {
  describe("GET /api", () => {
    test("status: 200, responds with all available endpoints in JSON format", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          expect(typeof endpoints).toBe("object");
        });
    });
  });
  describe("GET /api/*", () => {
    test("status: 404, path does not exist", () => {
      return request(app)
        .get("/api/notARoute")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });
  });
});
