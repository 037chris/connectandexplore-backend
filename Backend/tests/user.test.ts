import request from "supertest";
import app from "../server";

describe("User Registration", () => {
  it("should register a new user", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({
        email: "testuser5@example.com",
        name: {
          first: "Test",
          last: "User",
        },
        password: "testpassword",
        isAdministrator: false,
        address: {
          street: "123 Test Street",
          houseNumber: "1",
          postalCode: "12345",
          city: "Test City",
          country: "Test Country",
        },
        birthDate: "2000-01-01",
        gender: "Male",
        socialMediaUrls: {
          facebook: "https://www.facebook.com/testuser",
        },
      });

    expect(response.status).toBe(201);
  });
  it("user already exist", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({
        email: "testuser5@example.com",
        name: {
          first: "Test 2",
          last: "User 2",
        },
        password: "testpassword2",
        isAdministrator: false,
        address: {
          street: "1234 Test Street",
          houseNumber: "12",
          postalCode: "123456",
          city: "Test City 2",
          country: "Test Country 2",
        },
        birthDate: "2001-01-01",
        gender: "Female",
        socialMediaUrls: {
          facebook: "https://www.facebook.com/testuser2",
        },
      });

    expect(response.status).toBe(409);
  });
  it("Cannot register user - required data missed", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({
        email: "testuser4@example.com",
        name: {
          first: "Test 4",
        },
        password: "testpassword23",
        isAdministrator: false,
        address: {
          street: "123476 Test Street",
          houseNumber: "124",
          postalCode: "126345",
          city: "Test City 5",
          country: "Test Country 4",
        },
        birthDate: "2002-01-01",
        gender: "Male",
        socialMediaUrls: {
          facebook: "https://www.facebook.com/testuser2",
        },
      });

    expect(response.status).toBe(500);
  });
});
