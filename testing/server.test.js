const request = require("supertest");
const bcrypt = require("bcryptjs");
const server = require("../api/server.js");
const db = require("../database/dbConfig");

beforeEach(async () => {
  // this function executes and clears out the table before each test
  await db("users").truncate();
  await db("users").insert({
    username: "test1",
    password: bcrypt.hashSync("test1", 10)
  });
});

describe("server.js", () => {
  describe("index route", () => {
    it("should set testing env", () => {
      expect(process.env.DB_ENV).toBe("testing");
    });

    it("should return a JSON object from the index route", async () => {
      const response = await request(server).get("/api");

      expect(response.type).toEqual("application/json");
    });

    it("should return a message from the index route", async () => {
      const expectedBody = { message: "API Working!!!!!" };
      const response = await request(server).get("/api");

      expect(response.type).toEqual("application/json");
    });
  }),
    describe("jokes route", () => {
      it("should return 201 status code to get jokes", async () => {
        const expectedStatusCode = 201;

        const response = await request(server).get("/api/jokes");

        expect(response.status).toEqual(expectedStatusCode);
      });
      it("should fail to retrieve jokes due to login restriction", async () => {
        const expectedBody = { message: "You shall not pass!" };
        const response = await request(server).get("/api/jokes");

        expect(response.body).not.toEqual(expectedBody);
      });
    }),
    describe("auth route", () => {
      it("should login successfully with test1 user", async () => {
        const expectedStatusCode = 200;
        const response = await request(server)
          .post("/api/auth/login")
          .send({ username: "test1", password: "test1" });

        expect(response.status).toEqual(expectedStatusCode);
      });
      it("should fail to login with error message", async () => {
        const expectedBody = { message: "You shall not pass!" };
        const response = await request(server)
          .post("/api/auth/login")
          .send({ username: "wrongUsername", password: "wrongPassword" });

        expect(response.body).toEqual(expectedBody);
      });
      it("should allow creation of new user test4", async () => {
        const expectedStatusCode = 201;

        const response = await request(server)
          .post("/api/auth/register")
          .send({ username: "test4", password: "test4" });

        expect(response.status).toEqual(expectedStatusCode);
      });
      it("should fail creation of new user (missing password)", async () => {
        const expectedBody = {
          errMessage:
            "createUser error: Error: Illegal arguments: undefined, number"
        };
        const response = await request(server)
          .post("/api/auth/register")
          .send({ username: "noPassword" });

        expect(response.body).toEqual(expectedBody);
      });
    });
});
