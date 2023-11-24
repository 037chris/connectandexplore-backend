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
                    category: event.category.map((categoryId) => categoryId.toString()),
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
                    category: event.category.map((categoryId) => categoryId.toString()),
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
        try {
            const events = await EventModel_1.Event.find({
                $or: [
                    { name: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } },
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
                    category: event.category.map((categoryId) => categoryId.toString()),
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
                throw new Error(`User with id ${userID} not found`);
            if (!event)
                throw new Error(`Event with id ${eventID} not found`);
            if (event.participants.includes(user._id)) {
                throw new Error("User is already participating in the event");
            }
            event.participants.push(user._id);
            await event.save();
        }
        catch (error) {
            throw new Error("Error joining event");
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
                    category: event.category.map((categoryId) => categoryId.toString()),
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
                throw new Error(`Event with id ${eventID} not found`);
            const index = event.participants.findIndex((participant) => {
                const userObjecId = new mongoose_1.Types.ObjectId(userID);
                return participant.equals(userObjecId);
            });
            if (index === -1) {
                throw new Error("User is not participating in the event");
            }
            event.participants.splice(index, 1);
            await event.save();
        }
        catch (error) {
            throw new Error("Error canceling event");
        }
    }
    /**
     * Alle Teilnehmer vom Event abrufen ( Event Manager / Admin )
     */
    async getParticipants() { }
    /**
     * Event bearbeiten ( Event Manager / Admin )
     */
    async updateEvent() { }
    /**
     * Event löschen ( Event Manager / Admin )
     */
    async deleteEvent() { }
}
exports.EventService = EventService;
exports.default = new EventService();
//# sourceMappingURL=EventService.js.map