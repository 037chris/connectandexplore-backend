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
<<<<<<< HEAD
    async createEvent(event) {
        if (!event || typeof event !== "object") {
            throw new Error("Invalid event data");
        }
        try {
            const newEvent = await EventModel_1.Event.create(event);
            newEvent.save();
            return newEvent;
        }
        catch (error) {
            throw new Error("Event creation failed");
=======
    async createEvent(eventResource, creatorID) {
        try {
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
            throw new Error("Event creation failed");
        }
    }
    /**
     * Ein bestimmtes Event abrufen
     */
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
>>>>>>> main
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
<<<<<<< HEAD
                    category: event.category.map((categoryId) => categoryId.toString()),
=======
                    category: event.category,
>>>>>>> main
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
<<<<<<< HEAD
                    category: event.category.map((categoryId) => categoryId.toString()),
=======
                    category: event.category,
>>>>>>> main
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
<<<<<<< HEAD
        try {
            const events = await EventModel_1.Event.find({
                $or: [
<<<<<<< HEAD
                    { name: { $regex: new RegExp(query, "i") } },
                    { description: { $regex: new RegExp(query, "i") } },
                    { hashtags: { $in: [new RegExp(query, "i")] } },
=======
                    { name: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } },
                    { hashtags: { $in: [query] } },
=======
        if (!query || query.trim().length === 0)
            return this.getAllEvents();
        try {
            const events = await EventModel_1.Event.find({
                $or: [
                    { name: { $regex: new RegExp(query, "i") } },
                    { description: { $regex: new RegExp(query, "i") } },
                    { hashtags: { $in: [new RegExp(query, "i")] } },
>>>>>>> main
>>>>>>> f033aa4c98017bfa3ca92460a5a643a8c5baddc6
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
<<<<<<< HEAD
                    category: event.category.map((categoryId) => categoryId.toString()),
=======
                    category: event.category,
>>>>>>> main
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
<<<<<<< HEAD
        if (!userID)
            throw new Error(`User ID: ${userID} is invalid.`);
        if (!eventID)
            throw new Error(`Event ID: ${eventID} is invalid.`);
        const user = await UserModel_1.User.findById(userID).exec();
        const event = await EventModel_1.Event.findById(eventID).exec();
        if (!user)
            throw new Error("User not found");
        if (!event)
            throw new Error("Event not found");
        if (event.participants.includes(user._id)) {
            throw new Error("User is already participating in the event");
        }
=======
<<<<<<< HEAD
>>>>>>> f033aa4c98017bfa3ca92460a5a643a8c5baddc6
        try {
            event.participants.push(user._id);
            await event.save();
        }
        catch (error) {
            throw new Error("Error joining event");
=======
        if (!userID)
            throw new Error(`User ID: ${userID} is invalid.`);
        if (!eventID)
            throw new Error(`Event ID: ${eventID} is invalid.`);
        const user = await UserModel_1.User.findById(userID).exec();
        const event = await EventModel_1.Event.findById(eventID).exec();
        if (!user)
            throw new Error("User not found");
        if (!event)
            throw new Error("Event not found");
        if (event.participants.includes(user._id)) {
            throw new Error("User is already participating in the event");
        }
        try {
            event.participants.push(user._id);
            await event.save();
            return true;
        }
        catch (error) {
            return false;
>>>>>>> main
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
<<<<<<< HEAD
                    category: event.category.map((categoryId) => categoryId.toString()),
=======
                    category: event.category,
>>>>>>> main
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
<<<<<<< HEAD
        if (!userID)
            throw new Error(`User ID: ${userID} is invalid.`);
        if (!eventID)
            throw new Error(`Event ID: ${eventID} is invalid.`);
        const event = await EventModel_1.Event.findById(eventID).exec();
        if (!event)
            throw new Error("Event not found");
        if (event.creator && event.creator.toString() === userID)
            throw new Error("Can not cancel participation as event manager");
        const index = event.participants.findIndex((participant) => {
            return participant.equals(new mongoose_1.Types.ObjectId(userID));
        });
        if (index === -1) {
            throw new Error("User is not participating in the event");
        }
        try {
=======
<<<<<<< HEAD
        try {
            const event = await EventModel_1.Event.findById(eventID);
            if (!event)
                throw new Error(`Event with id ${eventID} not found`);
            const index = event.participants.findIndex((participant) => {
                const userObjecId = new mongoose_1.Types.ObjectId(userID);
                return participant.equals(userObjecId);
            });
            if (index === -1) {
                throw new Error("User is not participating in the event");
            }
>>>>>>> f033aa4c98017bfa3ca92460a5a643a8c5baddc6
            event.participants.splice(index, 1);
            await event.save();
        }
        catch (error) {
            throw new Error("Error canceling event");
=======
        if (!userID)
            throw new Error(`User ID: ${userID} is invalid.`);
        if (!eventID)
            throw new Error(`Event ID: ${eventID} is invalid.`);
        const event = await EventModel_1.Event.findById(eventID).exec();
        if (!event)
            throw new Error("Event not found");
        if (event.creator && event.creator.toString() === userID)
            throw new Error("Can not cancel participation as event manager");
        const index = event.participants.findIndex((participant) => {
            return participant.equals(new mongoose_1.Types.ObjectId(userID));
        });
        if (index === -1) {
            throw new Error("User is not participating in the event");
        }
        try {
            event.participants.splice(index, 1);
            await event.save();
            return true;
        }
        catch (error) {
            return false;
>>>>>>> main
        }
    }
    /**
     * Alle Teilnehmer vom Event abrufen ( Event Manager / Admin )
     */
    async getParticipants(eventID, creatorID) {
        try {
            const event = await EventModel_1.Event.findById(eventID).exec();
            if (!event)
<<<<<<< HEAD
                throw new Error(`Event with id ${eventID} not found`);
            const creator = await UserModel_1.User.findById(event.creator).exec();
            if (!creator ||
                (creator._id.toString() !== creatorID && !creator.isAdministrator)) {
=======
                throw new Error("Event not found");
            const creator = await UserModel_1.User.findById(event.creator).exec();
            const user = await UserModel_1.User.findById(creatorID);
            if (!creator ||
                !user ||
                (creator.id !== creatorID && !user.isAdministrator)) {
>>>>>>> main
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
<<<<<<< HEAD
    async updateEvent() { }
    /**
     * Event löschen ( Event Manager / Admin )
     */
    async deleteEvent(eventID, creatorID) {
        try {
            const event = await EventModel_1.Event.findById(eventID).exec();
            if (!event)
                throw new Error(`Event with id ${eventID} not found`);
            const creator = await UserModel_1.User.findById(event.creator).exec();
            if (!creator ||
                (creator._id.toString() !== creatorID && !creator.isAdministrator)) {
=======
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
        if (eventResource.price !== undefined) {
            if (eventResource.price < 0) {
                throw new Error("Event price cannot be less than 0");
            }
            else if (eventResource.price === 0) {
                event.price = 0;
            }
            else {
                event.price = eventResource.price;
            }
        }
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
>>>>>>> main
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