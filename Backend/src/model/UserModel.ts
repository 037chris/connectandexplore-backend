import mongoose, { Model, model, Schema } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser {
    email: string,
    name: {
        first:string,
        last:string
    },
    password: string,
    isAdministrator: Boolean
    address: IAddress,
    profilePicture?: string; 
    birthDate: Date; 
    gender: string; 
    socialMediaUrls?: {
        facebook?: string;
        instagram?: string;
    };
}

export interface IAddress {
    street: String,
    houseNumber: String,
    apartmentNumber?: String,
    postalCode: String,
    city: String,
    stateOrRegion?: String,
    country: String
}

export enum userRole {
    User = "u",
    Admin = "a"
}
interface IUserMethods {
    isCorrectPassword(password: string):Promise<boolean> 
}
type UserModel = Model<IUser, {}, IUserMethods>;


/**
 * Adressen werden später in das UserSchema eingefügt und als teil eines Users in mongoDB gespeichert
 */
const addressSchema = new Schema({
    street: { type: String, required: true },
    houseNumber: { type: String, required: true },
    apartmentNumber: String, 
    postalCode: { type: String, required: true },
    city: { type: String, required: true },
    stateOrRegion: String, 
    country: { type: String, required: true }
});

const userSchema = new Schema<IUser, UserModel>({
    email: { type: String, required: true, unique: true },
    name: {
        first: { type:String, required:true},
        last:{ type:String, required:true}
    },
    password: { type: String, required: true },
    isAdministrator: { type: Boolean, default: false },
    address: addressSchema,
    profilePicture: String, 
    birthDate: { type: Date, required: true }, 
    gender: { type: String, required: true }, 
    socialMediaUrls: {
        facebook: String,
        instagram: String,
    }
});

userSchema.pre("save", async function() {
    if (this.isModified("password")) {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }
});
//updateOne method wäre hier aber dc nachricht zu lang
userSchema.method("isCorrectPassword", async function(password:string): Promise<boolean>
    {
        const isPW = await bcrypt.compare(password, this.password);
        return isPW;
    }
)

export const User = model<IUser, UserModel>("User", userSchema);