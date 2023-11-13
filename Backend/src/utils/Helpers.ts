import { IUser } from "../model/UserModel";

// Generated with chatgpt
export default function sanitizeUser(user: IUser): Omit<IUser, "password"> {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
}
