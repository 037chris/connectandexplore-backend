import { clearDatabase, closeDatabase, connect } from "../../database/db";
import { userResource } from "../../src/Resources";
import { IAddress, IUser, User } from "../../src/model/UserModel";
import { UserService } from "../../src/services/UserService";

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

const userService: UserService = new UserService();
const NON_EXISTING_ID = "635d2e796ea2e8c9bde5787c";
describe("userModel test", () => {
  beforeAll(async () => await connect());
  afterEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());

  test("createUser function", async () => {
    const user = await userService.createUser(u);
    expect(user.id).toBeDefined();
    expect(user.name.first).toBe(u.name.first);
    expect(user.name.last).toBe(u.name.last);
    expect(user.email).toBe(u.email);
    expect(user.password).toBeUndefined();
    const res = await User.findById(user.id);
    expect(await res.isCorrectPassword("12abcAB!")).toBeTruthy();
    expect(user.address).toMatchObject(a);
    expect(user.birthDate).toBe(u.birthDate);
    expect(user.gender).toBe(u.gender);
    expect(user.isActive).toBeTruthy();
    expect(user.profilePicture).toBe(u.profilePicture);
    expect(user.socialMediaUrls).toMatchObject(u.socialMediaUrls);
  });

  test("getUser works and returns user without password", async () => {
    const user = await userService.createUser(u);
    await expect(userService.getUser(undefined)).rejects.toThrow(
      "Can not get user, userID is invalid",
    );
    await expect(userService.getUser(NON_EXISTING_ID)).rejects.toThrow(
      `No user with id: ${NON_EXISTING_ID} exists.`,
    );
    const res: userResource = await userService.getUser(user.id);
    expect(user.id).toBeDefined();
    expect(user.name.first).toBe(u.name.first);
    expect(user.name.last).toBe(u.name.last);
    expect(user.email).toBe(u.email);
    expect(user.password).toBeUndefined();
    const r = await User.findById(user.id);
    expect(await r.isCorrectPassword("12abcAB!")).toBeTruthy();
    expect(user.address).toMatchObject(a);
    expect(user.birthDate).toBe(u.birthDate);
    expect(user.gender).toBe(u.gender);
    expect(user.isActive).toBeTruthy();
    expect(user.profilePicture).toBe(u.profilePicture);
    expect(user.socialMediaUrls).toMatchObject(u.socialMediaUrls);
  });

  test("get all users also returns inactive users, getUser(userID) throws error at inactive user.", async () => {
    const u1 = await userService.createUser(u);
    const user1: userResource = {
      id: u1.id,
      email: u1.email,
      name: {
        first: u1.name.first,
        last: u1.name.last,
      },
      isAdministrator: u1.isAdministrator,
      address: u1.address,
      birthDate: u1.birthDate,
      gender: u1.gender,
      isActive: u1.isActive,
    };
    u.isActive = false;
    u.email = "Jane@doe.com";
    u.name.first = "Jane";
    const u2 = await User.create(u);
    const user2: userResource = {
      id: u2.id,
      email: u2.email,
      name: {
        first: u2.name.first,
        last: u2.name.last,
      },
      isAdministrator: u2.isAdministrator,
      address: u2.address,
      birthDate: u2.birthDate,
      gender: u2.gender,
      isActive: u2.isActive,
    };
    await expect(userService.getUser(u2.id)).rejects.toThrow(
      `No user with id: ${u2.id} exists.`,
    );
    const users = await userService.getUsers();
    expect(users.users.length).toBe(2);
    expect(users.users[0].isActive).toBe(user1.isActive);
    expect(users.users[1].isActive).toBe(user2.isActive);
  });

  test("updateUserWithAdmin user update validations", async () => {
    const user = await userService.createUser(u);
    const existingUserId = user.id;
    const updatedUser = {
      ...u,
      id: existingUserId,
      email: "newemail@example.com",
    };
    const result = await userService.updateUserWithAdmin(updatedUser);
    expect(result.id).toBeDefined();
    expect(result.name.first).toBe(updatedUser.name.first);
    expect(result.name.last).toBe(updatedUser.name.last);
    expect(result.email).toBe(updatedUser.email);
    expect(result.password).toBeUndefined();
    expect(result.address).toMatchObject(updatedUser.address);
    expect(result.birthDate).toBe(updatedUser.birthDate);
    expect(result.gender).toBe(updatedUser.gender);
    expect(result.isActive).toBeTruthy();
    expect(result.profilePicture).toBe(updatedUser.profilePicture);
    expect(result.socialMediaUrls).toMatchObject(updatedUser.socialMediaUrls);

    //Test for missing userID
    const userWithNoId = { ...u, id: undefined };
    await expect(userService.updateUserWithAdmin(userWithNoId)).rejects.toThrow(
      "User id is missing, cannot update User.",
    );

    //Test for non-existing userID
    const nonExistingUser = { ...u, id: NON_EXISTING_ID };
    await expect(
      userService.updateUserWithAdmin(nonExistingUser),
    ).rejects.toThrow(
      `No user with id: ${NON_EXISTING_ID} found, cannot update`,
    );
  });

  test("duplicate email check", async () => {
    const user = await userService.createUser(u);
    await userService.createUser({ ...u, email: "duplicate@example.com" });
    //Create another user with a different ID but same email for duplicate check
    const userWithDuplicateEmail = { ...user, email: "duplicate@example.com" };
    await expect(
      userService.updateUserWithAdmin(userWithDuplicateEmail),
    ).rejects.toThrow("Duplicate email");
  });
});
