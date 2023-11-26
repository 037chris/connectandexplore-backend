"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const mongoose_1 = require("mongoose");
const EventModel_1 = require("../model/EventModel");
const UserModel_1 = require("../model/UserModel");
class EventService {
    /**
     * Event erstellen
     */
    async createEvent(eventResource, creatorID) {
        try {
            console.log("Before creating event:", eventResource);
            const creator = await UserModel_1.User.findById(creatorID);
            const event = await EventModel_1.Event.create({
                name: eventResource.name,
                creator: creator.id,
                description: eventResource.description,
                price: eventResource.price,
                date: eventResource.date,
                address: eventResource.address,
                thumbnail: eventResource.thumbnail,
                hashtags: eventResource.hashtags,
                category: eventResource.category,
                chat: new mongoose_1.Types.ObjectId(),
                participants: [creatorID],
            });
            console.log("After creating event:", event);
            return {
                id: event.id,
                name: event.name,
                creator: event.creator.toString(),
                description: event.description,
                price: event.price,
                date: event.date,
                address: event.address,
                thumbnail: event.thumbnail,
                hashtags: event.hashtags,
                category: event.category,
                chat: event.chat.toString(),
                participants: event.participants.map((participantId) => participantId.toString()),
            };
        }
        catch (err) {
            console.error("Error creating event:", err);
            throw new Error("Event creation failed");
        }
    }
    async getEvent(eventID) {
        try {
            const event = await EventModel_1.Event.findById(eventID).exec();
            if (!event) {
                throw new Error("Event not found");
            }
            return {
                id: event.id,
                name: event.name,
                creator: event.creator.toString(),
                description: event.description,
                price: event.price,
                date: event.date,
                address: event.address,
                thumbnail: event.thumbnail,
                hashtags: event.hashtags,
                category: event.category,
                chat: event.chat.toString(),
                participants: event.participants.map((participantId) => participantId.toString()),
            };
        }
        catch (error) {
            throw new Error("Error getting event");
        }
    }
    /**
     * Alle erstellten Events abrufen ( Event Manager / Admin )
     */
    async getEvents(userID) {
        if (!userID) {
            throw new Error("Can not get creator, userID is invalid");
        }
        try {
            const events = await EventModel_1.Event.find({ creator: userID }).exec();
            const eventsResult = {
                events: events.map((event) => ({
                    id: event.id,
                    name: event.name,
                    creator: event.creator.toString(),
                    description: event.description,
                    price: event.price,
                    date: event.date,
                    address: event.address,
                    thumbnail: event.thumbnail,
                    hashtags: event.hashtags,
                    category: event.category,
                    chat: event.chat.toString(),
                    participants: event.participants.map((participantId) => participantId.toString()),
                })),
            };
            return eventsResult;
        }
        catch (error) {
            throw new Error("Error getting events");
        }
    }
    /**
     * Alle Events abrufen
     */
    async getAllEvents() {
        try {
            const events = await EventModel_1.Event.find({}).exec();
            const eventsResult = {
                events: events.map((event) => ({
                    id: event.id,
                    name: event.name,
                    creator: event.creator.toString(),
                    description: event.description,
                    price: event.price,
                    date: event.date,
                    address: event.address,
                    thumbnail: event.thumbnail,
                    hashtags: event.hashtags,
                    category: event.category,
                    chat: event.chat.toString(),
                    participants: event.participants.map((participantId) => participantId.toString()),
                })),
            };
            return eventsResult;
        }
        catch (error) {
            throw new Error("Error getting events");
        }
    }
    /**
     * Events filtern / Event suchen
     */
    async searchEvents(query) {
        if (!query || query.trim().length === 0)
            return this.getAllEvents();
        try {
            const events = await EventModel_1.Event.find({
                $or: [
                    { name: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } },
                    { hashtags: { $in: [query] } },
                ],
            }).exec();
            const eventsResult = {
                events: events.map((event) => ({
                    id: event.id,
                    name: event.name,
                    creator: event.creator.toString(),
                    description: event.description,
                    price: event.price,
                    date: event.date,
                    address: event.address,
                    thumbnail: event.thumbnail,
                    hashtags: event.hashtags,
                    category: event.category,
                    chat: event.chat.toString(),
                    participants: event.participants.map((participantId) => participantId.toString()),
                })),
            };
            return eventsResult;
        }
        catch (error) {
            throw new Error("Error searching events");
        }
    }
    /**
     * Am Event teilnehmen ( Event Teilnehmer )
     */
    async joinEvent(userID, eventID) {
        try {
            const user = await UserModel_1.User.findById(userID).exec();
            const event = await EventModel_1.Event.findById(eventID).exec();
            if (!user)
                throw new Error("User not found");
            if (!event)
                throw new Error("Event not found");
            if (event.participants.includes(user._id)) {
                throw new Error("User is already participating in the event");
            }
            event.participants.push(user._id);
            await event.save();
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Alle teilgenommenen Events abrufen ( Event Teilnehmer )
     */
    async getJoinedEvents(userID) {
        try {
            const events = await EventModel_1.Event.find({ participants: userID }).exec();
            const eventsResult = {
                events: events.map((event) => ({
                    id: event.id,
                    name: event.name,
                    creator: event.creator.toString(),
                    description: event.description,
                    price: event.price,
                    date: event.date,
                    address: event.address,
                    thumbnail: event.thumbnail,
                    hashtags: event.hashtags,
                    category: event.category,
                    chat: event.chat.toString(),
                    participants: event.participants.map((participantId) => participantId.toString()),
                })),
            };
            return eventsResult;
        }
        catch (error) {
            throw new Error("Error getting events");
        }
    }
    /**
     * Teilnahme am Event absagen ( Event Teilnehmer )
     */
    async cancelEvent(userID, eventID) {
        try {
            const event = await EventModel_1.Event.findById(eventID);
            if (!event)
                throw new Error("Event not found");
            const index = event.participants.findIndex((participant) => {
                return participant.equals(new mongoose_1.Types.ObjectId(userID));
            });
            if (index === -1) {
                throw new Error("User is not participating in the event");
            }
            event.participants.splice(index, 1);
            await event.save();
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Alle Teilnehmer vom Event abrufen ( Event Manager / Admin )
     */
    async getParticipants(eventID, creatorID) {
        try {
            const event = await EventModel_1.Event.findById(eventID).exec();
            if (!event)
                throw new Error("Event not found");
            const creator = await UserModel_1.User.findById(event.creator).exec();
            if (!creator ||
                (creator._id.toString() !== creatorID && !creator.isAdministrator)) {
                throw new Error("Invalid authorization");
            }
            const participantIDs = event.participants;
            const participants = await UserModel_1.User.find({
                _id: { $in: participantIDs },
            }).exec();
            const result = {
                users: participants.map((user) => ({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isAdministrator: user.isAdministrator,
                    address: user.address,
                    profilePicture: user.profilePicture,
                    birthDate: user.birthDate,
                    gender: user.gender,
                    socialMediaUrls: user.socialMediaUrls,
                    isActive: user.isActive,
                })),
            };
            return result;
        }
        catch (error) {
            throw new Error("Error getting participants");
        }
    }
    /**
     * Event bearbeiten ( Event Manager / Admin )
     */
    async updateEvent(eventID, eventResource, userID) {
        const event = await EventModel_1.Event.findById(eventID).exec();
        if (!event)
            throw new Error("Event not found");
        const creator = await UserModel_1.User.findById(event.creator).exec();
        const user = await UserModel_1.User.findById(userID).exec();
        if (!creator ||
            !user ||
            (creator._id.toString() !== userID && !user.isAdministrator)) {
            throw new Error("Invalid authorization");
        }
        if (eventResource.name)
            event.name = eventResource.name;
        if (eventResource.description)
            event.description = eventResource.description;
        if (eventResource.price)
            event.price = eventResource.price;
        if (eventResource.date)
            event.date = eventResource.date;
        if (eventResource.address)
            event.address = eventResource.address;
        if (eventResource.thumbnail)
            event.thumbnail = eventResource.thumbnail;
        if (eventResource.hashtags)
            event.hashtags = eventResource.hashtags;
        if (eventResource.category)
            event.category = eventResource.category;
        if (eventResource.participants)
            event.participants = eventResource.participants.map((participantId) => new mongoose_1.Types.ObjectId(participantId));
        const savedEvent = await event.save();
        return {
            id: savedEvent.id,
            name: savedEvent.name,
            creator: savedEvent.creator.toString(),
            description: savedEvent.description,
            price: savedEvent.price,
            date: savedEvent.date,
            address: savedEvent.address,
            thumbnail: savedEvent.thumbnail,
            hashtags: savedEvent.hashtags,
            category: savedEvent.category,
            chat: savedEvent.chat.toString(),
            participants: savedEvent.participants.map((participantId) => participantId.toString()),
        };
    }
    /**
     * Event löschen ( Event Manager / Admin )
     */
    async deleteEvent(eventID, userID) {
        try {
            const event = await EventModel_1.Event.findById(eventID).exec();
            if (!event)
                throw new Error("Event not found");
            const creator = await UserModel_1.User.findById(event.creator).exec();
            const user = await UserModel_1.User.findById(userID).exec();
            if (!creator ||
                !user ||
                (creator._id.toString() !== userID && !user.isAdministrator)) {
                throw new Error("Invalid authorization");
            }
            const result = await EventModel_1.Event.deleteOne({ _id: eventID }).exec();
            return result.deletedCount == 1;
        }
        catch (error) {
            throw new Error("Error deleting event");
        }
    }
}
exports.EventService = EventService;
exports.default = new EventService();
//# sourceMappingURL=EventService.js.map