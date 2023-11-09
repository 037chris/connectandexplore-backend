import { User } from "../model/UserModel";
import { usersResource, userResource } from "../Resources";

export class UserService {
  async registerUser(user: any) {
    if (!user || typeof user !== "object") {
      throw new Error("Invalid user data");
    }
    // Check if the user already exists in the database
    const { email } = user;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("User already exists");
    }
    // Create a new user
    try {
      const newUser = await User.create(user);
      return newUser;
    } catch (error) {
      throw new Error("Registration failed");
    }
  }

  async getUsers(): Promise<usersResource> {
    const users = await User.find({}).exec();
    const usersResource: usersResource = {
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdministrator: user.isAdministrator,
        address: user.address,
        profilePicture: user.profilePicture,
        birthDate: user.birthDate,
        gender: user.gender,
        socialMediaUrls: user.socialMediaUrls,
      })),
    };
    return usersResource;
  }

  async getUser(userID: string): Promise<userResource> {
    if (!userID) {
      throw new Error("Can not get user, userID is invalid");
    }
    const user = await User.findById(userID).exec();
    if (!user) {
      throw new Error(`No user with id: ${userID} exists.`);
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdministrator: user.isAdministrator,
      address: user.address,
      profilePicture: user.profilePicture,
      birthDate: user.birthDate,
      gender: user.gender,
      socialMediaUrls: user.socialMediaUrls,
    };
  }

  /**
   * used to prefill db with standard admin user. Therefore this servicemethod does not need an endpoint.
   * @param userResource
   * @returns userResource
   */
  async createUser(userResource: userResource): Promise<userResource> {
    const user = await User.create({
      name: userResource.name,
      email: userResource.email,
      isAdministrator: userResource.isAdministrator,
      address: userResource.address,
      profilePicture: userResource.profilePicture,
      birthDate: userResource.birthDate,
      gender: userResource.gender,
      socialMediaUrls: userResource.socialMediaUrls,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdministrator: user.isAdministrator,
      address: user.address,
      profilePicture: user.profilePicture,
      birthDate: user.birthDate,
      gender: user.gender,
      socialMediaUrls: user.socialMediaUrls,
    };
  }

  /**
   * Admin function to update userdata. can update password & isAdministrator.
   * @param userResource
   * @returns userResource of updated user.
   */
  async updateUserWithAdmin(userResource: userResource): Promise<userResource> {
    if (!userResource.id) {
      throw new Error("User id is missing, cannot update User.");
    }
    const user = await User.findById(userResource.id).exec();
    if (!user) {
      throw new Error(
        `No user with id: ${userResource.id} found, cannot update`
      );
    }
    if (userResource.name) user.name = userResource.name;
    if (userResource.email) {
      userResource.email = userResource.email.toLowerCase();
      if (userResource.email !== user.email) {
        const c = await User.count({ email: userResource.email }).exec();
        if (c > 0) {
          throw new Error(`Duplicate email`);
        }
      }
      user.email = userResource.email;
    }
    if (userResource.password) user.password = userResource.password;
    if (userResource.isAdministrator)
      user.isAdministrator = userResource.isAdministrator;
    if (userResource.address) user.address = userResource.address;
    if (userResource.birthDate) user.birthDate = userResource.birthDate;
    if (userResource.gender) user.gender = userResource.gender;
    if (userResource.profilePicture)
      user.profilePicture = userResource.profilePicture;
    if (userResource.socialMediaUrls)
      user.socialMediaUrls = userResource.socialMediaUrls;
    const savedUser = await user.save();
    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      address: savedUser.address,
      isAdministrator: savedUser.isAdministrator,
      birthDate: savedUser.birthDate,
      gender: savedUser.gender,
      socialMediaUrls: savedUser.socialMediaUrls,
    };
  }

  /**
   * only admins can change isAdministrator:
   * authorization to change isAdministrator is done in userRouter ->
   * isAdministratorfield = null if user in req is not an admin
   * @param userResource
   * @param oldPw
   * @returns userResource
   */
  async updateUserWithPw(
    userResource: userResource,
    oldPw?: string
  ): Promise<userResource> {
    if (!userResource.id) {
      throw new Error("User id is missing, cannot update User.");
    }
    const user = await User.findById(userResource.id).exec();
    if (!user) {
      throw new Error(
        `No user with id: ${userResource.id} found, cannot update`
      );
    }
    if (oldPw) {
      const res = user.isCorrectPassword(oldPw);
      if (!res) {
        throw new Error("invalid oldPassword, can not update User!");
      }
      if (userResource.password) user.password = userResource.password;
    }

    if (userResource.name) user.name = userResource.name;
    if (userResource.email) {
      userResource.email = userResource.email.toLowerCase();
      if (userResource.email !== user.email) {
        const c = await User.count({ email: userResource.email }).exec();
        if (c > 0) {
          throw new Error(`Duplicate email`);
        }
      }
      user.email = userResource.email;
    }
    if (userResource.address) user.address = userResource.address;
    if (userResource.birthDate) user.birthDate = userResource.birthDate;
    if (userResource.gender) user.gender = userResource.gender;
    if (userResource.profilePicture)
      user.profilePicture = userResource.profilePicture;
    if (userResource.socialMediaUrls)
      user.socialMediaUrls = userResource.socialMediaUrls;
    const savedUser = await user.save();
    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      address: savedUser.address,
      isAdministrator: savedUser.isAdministrator,
      birthDate: savedUser.birthDate,
      gender: savedUser.gender,
      socialMediaUrls: savedUser.socialMediaUrls,
    };
  }
}

export default new UserService();
