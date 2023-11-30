import { User, IAddress, IUser } from "../model/UserModel";

const createAdminUser = async () => {
  const a: IAddress = {
    street: "Street",
    houseNumber: "1",
    postalCode: "12345",
    city: "Berlin",
    country: "Germany",
  };

  let u: IUser = {
    email: "admin.team@connectandexplore.com",
    name: {
      first: "admin",
      last: "team",
    },
    password: "k.9MSn#JJh+§3F3a",
    isAdministrator: true,
    address: a,
    birthDate: new Date(),
    gender: "male",
    isActive: true,
    socialMediaUrls: {
      facebook: "facebook.com",
      instagram: "instagram.com",
    },
  };

  try {
    const user = await User.create(u);
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};
export default createAdminUser;
