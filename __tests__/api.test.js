const request = require("supertest");
const app = require("../startup/app");
const mongoose = require("mongoose");
const Url = require("../models/Url");
const dotenv = require("dotenv");

// configure dotenv
dotenv.config();

// Connect to the database before running tests
beforeAll(async () => {
    const url = process.env.MONGO_URL;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, });
});

// Disconnect from the database after running tests
afterAll(async () => {
    await mongoose.disconnect();
    // await Url.deleteMany();
});

describe("URL shortener endpoints", () => {
    let pathId;
    let originalUrl;

    describe("POST /encode", () => {
        it("should return a shortened URL", async () => {
            const res = await request(app)
                .post("/encode")
                .send({ url: "https://indicina.com" })
                .expect(200);

            expect(res.body.message).toBe("Url encoded succesfully");
            expect(res.body.data).toBeDefined();
            expect(res.body.data).toContain(process.env.BASE_URL);
            pathId = res.body.data.split("/").pop();
            originalUrl = "https://indicina.com";
        });

        it("should return a previously generated shortened URL for a repeated request", async () => {
            const res = await request(app)
                .post("/encode")
                .send({ url: "https://indicina.com" })
                .expect(200);

            expect(res.body.message).toBe("Url encoded already");
            expect(res.body.data).toBeDefined();
            expect(res.body.data).toContain(process.env.BASE_URL);
        });

        it("should return an error message for an invalid URL", async () => {
            const res = await request(app)
                .post("/encode")
                .send({ url: "invalid" })
                .expect(500);

            expect(res.body.message).toBe("The url is not correct");
        });

        it("should return an error message for a missing URL", async () => {
            const res = await request(app).post("/encode").expect(404);

            expect(res.body.message).toBe("Url field is required");
        });
    });

    describe("POST /decode", () => {
        it("should return the original URL for a shortened URL", async () => {
            const res = await request(app)
                .post("/decode")
                .send({ url: process.env.BASE_URL + "/" + pathId })
                .expect(200);

            expect(res.body.message).toBe("Url decoded successfully");
            expect(res.body.data).toBe(originalUrl);
        });

        it("should return an error message for an invalid shortened URL", async () => {
            const res = await request(app)
                .post("/decode")
                .send({ url: "invalid" })
                .expect(404);

            expect(res.body.message).toBe("Short Url does not exist");
        });

        it("should return an error message for a missing URL", async () => {
            const res = await request(app).post("/decode").expect(404);

            expect(res.body.message).toBe("Url field is required");
        });
    });

    describe("GET /:pathId", () => {
        it("should return an error message for an invalid pathId", async () => {
            await request(app).get(`/invalid`).expect(404);
        });
    });

    describe("GET /statistics/:pathId", () => {
        it("should return the statistics for a valid pathId", async () => {
            const url = new Url({
                originalUrl: "https://example.com",
                shortUrl: "http://localhost:5000/abc123",
                pathId: "abc123",
                visits: 10
            });
            await url.save();

            const res = await request(app).get(`/statistics/${url.pathId}`).expect(200);

            expect(res.body.message).toEqual("Url succesfully fetched");
            expect(res.body.data).toHaveProperty("originalUrl", url.originalUrl);
            expect(res.body.data).toHaveProperty("shortUrl", url.shortUrl);
            expect(res.body.data).toHaveProperty("pathId", url.pathId);
            expect(res.body.data).toHaveProperty("visits", url.visits);
        });

        it("should return 404 if the pathId does not exist", async () => {
            const res = await request(app).get(`/statistics/invalidPathId`).expect(404);
            expect(res.body.message).toEqual("Path Id does not exist");
        });
    });
})
