import { clearDatabase, closeDatabase, connect } from "../../database/db";
import { IAddress, IUser, User } from "../../src/model/UserModel";


describe("userModel test", () => {
    beforeAll(async () => await connect());
    afterEach(async () => await clearDatabase());
    afterAll(async () => await closeDatabase());

    test("create User", async () => {
        const a:IAddress = {
            street: "Street",
            houseNumber: "1",
            postalCode: "12345",
            city: "Berlin",
            country: "Germany"
        }
        const u:IUser = {
            email: "John@doe.com",
            name: {
                first: "John",
                last: "Doe"
            },
            password: "123",
            isAdministrator: true,
            address: a,
            birthDate: new Date(),
            gender: "male"
        }
        const user = await User.create(u);
        expect(user.name.first).toBe(u.name.first);
        expect(user.name.last).toBe(u.name.last);
        
    })
})