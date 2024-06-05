const request = require("supertest");
const { app } = require("../src/app");
const { User } = require("../src/models/mongo-user-schema");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();

const testUser = {
    email: "testuser3@example.com",
    password: "password123",
    avatarURL: "avatar",
};
let server;

describe("POST /login", () => {
    beforeAll(() => {
        server = app.listen(3000);
    });

    afterAll(() => {
        server.close();
    });

    beforeEach(async () => {
        const hashedPassword = await bcrypt.hash(testUser.password, 10);
        await mongoose.connect(process.env.CONNECTION_STRING);
        await User.create({
            email: testUser.email,
            password: hashedPassword,
            avatarURL: testUser.avatarURL,
        });
    });

    afterEach(async () => {
        await User.findOneAndDelete({ email: testUser.email });
        await mongoose.disconnect();
    });

    it("should return a token and user object with email and subscription fields", async () => {
        const response = await request(app).post("/api/users/login").send({
            email: testUser.email,
            password: testUser.password,
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(typeof response.body.token).toBe("string");

        expect(response.body).toHaveProperty("user");
        const { email, subscription } = response.body.user;
        expect(email).toBe(testUser.email);
        expect(typeof email).toBe("string");
        expect(typeof subscription).toBe("string");
    });

    it("should return 401 error if email is wrong", async () => {
        const wrongEmailUser = {
            email: "wrongemail@example.com",
            password: testUser.password,
        };
        const response = await request(app)
            .post("/api/users/login")
            .send(wrongEmailUser);

        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty("message");
        const { message } = response.body;
        expect(
            message === `No registered user with email ${wrongEmailUser.email}`
        ).toBe(true);
    });

    it("should return 401 error if password is wrong", async () => {
        const wrongPswUser = {
            email: testUser.email,
            password: "wrongpassword",
        };
        const response = await request(app)
            .post("/api/users/login")
            .send(wrongPswUser);

        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty("message");
        const { message } = response.body;
        expect(message === "Wrong password").toBe(true);
    });
});
