import { clearDatabase, closeDatabase, connect } from "../../database/db";
import app from "../../server";
import { IAddress, User } from "../../src/model/UserModel";
import {
  LoginResource,
  userResource,
  usersResource,
} from "../../src/Resources";
import { UserService } from "../../src/services/UserService";
import request from "supertest";

const a: IAddress = {
  street: "Street",
  houseNumber: "1",
  postalCode: "12345",
  city: "Berlin",
  country: "Germany",
};
const u: userResource = {
  email: "John@doe.com",
  name: {
    first: "John",
    last: "Doe",
  },
  password: "12abcAB!",
  isAdministrator: true,
  address: a,
  birthDate: new Date(),
  gender: "male",
  isActive: true,
  profilePicture: "picture1",
  socialMediaUrls: {
    facebook: "facebook",
    instagram: "instagram",
  },
};

const JaneData: userResource = {
  email: "Jane@doe.com",
  name: {
    first: "Jane",
    last: "Doe",
  },
  password: "12abcAB!",
  isAdministrator: false,
  address: a,
  birthDate: new Date(),
  gender: "male",
  isActive: true,
  profilePicture: "picture1",
  socialMediaUrls: {
    facebook: "facebook",
    instagram: "instagram",
  },
};

const userService: UserService = new UserService();
const NON_EXISTING_ID = "635d2e796ea2e8c9bde5787c";
let admin: userResource;
let AdminToken: string;
let jane: userResource;
let token: string;
describe("userRoute test", () => {
  beforeAll(async () => await connect());
  beforeEach(async () => {
    admin = await userService.createUser(u);
    jane = await userService.createUser(JaneData);
    const req = request(app);
    const adminloginData = { email: "John@doe.com", password: "12abcAB!" };
    const adminRes = await req.post(`/api/login`).send(adminloginData);
    const AdminLoginResource = adminRes.body as LoginResource;
    AdminToken = AdminLoginResource.access_token;

    const janeLoginData = { email: "Jane@doe.com", password: "12abcAB!" };
    const janeRes = await req.post(`/api/login`).send(janeLoginData);
    const janeLoginResource = janeRes.body as LoginResource;
    token = janeLoginResource.access_token;
  });
  afterEach(async () => await clearDatabase());
  //afterAll(async () => await closeDatabase());

  test("getUsers", async () => {
    const req = request(app);
    const response = await req
      .get("/api/users")
      .set("Authorization", `Bearer ${AdminToken}`);
    expect(response.statusCode).toBe(200);
    const users: usersResource = response.body;
    expect(users.users.length).toBe(2);

    expect(users.users[0].id).toBeDefined();
    expect(users.users[0].name.first).toBe(u.name.first);
    expect(users.users[0].name.last).toBe(u.name.last);
    expect(users.users[0].email).toBe(u.email);
    expect(users.users[0].password).toBeUndefined();
    expect(users.users[0].address).toMatchObject(a);
    expect(users.users[0].birthDate).toBe(u.birthDate);
    expect(users.users[0].gender).toBe(u.gender);
    expect(users.users[0].isActive).toBeTruthy();
    expect(users.users[0].profilePicture).toBe(u.profilePicture);
    expect(users.users[0].socialMediaUrls).toMatchObject(u.socialMediaUrls);
  });
});
