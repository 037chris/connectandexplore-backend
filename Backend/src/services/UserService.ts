import { User } from '../model/UserModel'



export class UserService {
    async registerUser(user: any) {
      if (!user || typeof user !== 'object') {
        throw new Error('Invalid user data');
      }
      // Check if the user already exists in the database
      const { email } = user;
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        throw new Error('User already exists');
      }
      // Create a new user
      try {
        console.log(user)
        const newUser = await User.create(user);
        return newUser;
      } catch (error) {
        console.log(error)
        throw new Error('Registration failed');
      }
    }
  }
  
  export default new UserService();
