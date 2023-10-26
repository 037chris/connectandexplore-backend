import mongoose, { Model, model, Schema } from "mongoose"
import bcrypt from "bcryptjs"


export interface IUser {
    email: string
    name: string
    password: string
    address: mongoose.Types.ObjectId
}

interface IUserMethods {
    isCorrectPassword(password: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: Schema.Types.ObjectId, ref: "Address" }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
});

userSchema.method("isCorrectPassword", async function isCorrectPassword(password) {
    return await bcrypt.compare(password, this.password);
});


export const User = model<IUser, UserModel>("User", userSchema);