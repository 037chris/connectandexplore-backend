import { Model, Schema, Types, model } from "mongoose";
import { IAddress, addressSchema } from "./UserModel";

export interface IEAddress {
  street: String;
  houseNumber: String;
  apartmentNumber?: String;
  postalCode: String;
  city: String;
  stateOrRegion?: String;
  country: String;
}
export interface IEvent {
  name: string;
  creator: Types.ObjectId;
  description: string;
  price: number;
  date: Date;
  address: IEAddress;
  thumbnail?: string;
  hashtags?: string[];
  category: ICategory[];
  chat: Types.ObjectId;
  participants: Types.ObjectId[];
}

export interface ICategory {
  name: string;
  description: string;
}
/**
 * Adressen werden später in das EventSchema eingefügt und als teil eines Users in mongoDB gespeichert
 */
export const addressESchema = new Schema({
  street: { type: String, required: true },
  houseNumber: { type: String, required: true },
  apartmentNumber: String,
  postalCode: { type: String, required: true },
  city: { type: String, required: true },
  stateOrRegion: String,
  country: { type: String, required: true },
});
const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true /* , unique: true */ },
  description: { type: String },
});

type EventModel = Model<IEvent, {}>;
type CategoryModel = Model<ICategory, {}>;

const eventSchema = new Schema<IEvent>({
  name: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true },
  address: addressESchema,
  thumbnail: { type: String },
  hashtags: [{ type: String }],
  category: [categorySchema],
  chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
});

/* 
Zu implementieren?:
Middleware-Methode, die sicherstellt, dass nach Bearbeitung eines Events, alle Teilnehmer benachrichtigt werden

eventSchema.post('updateOne', async function (result, next) {
    try {
        //Funktion zur Benachrichtigung aller Teilnehmer
    } catch (error) {
        //throw new Error()
    }
    next();
}); */

export const Event = model<IEvent, EventModel>("Event", eventSchema);
export const Categoty = model<ICategory, CategoryModel>(
  "Category",
  categorySchema
);
