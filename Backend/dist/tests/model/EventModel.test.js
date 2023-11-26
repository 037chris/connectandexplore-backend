"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const EventModel_1 = require("../../src/model/EventModel");
const db_1 = require("../../database/db");
const a = {
    street: "Street",
    houseNumber: "1",
    postalCode: "12345",
    city: "Berlin",
    country: "Germany",
};
const c = {
    name: "Hobbys",
    description: "persönliche Interessen, Freizeit",
};
describe("Event Model Tests", () => {
    beforeAll(async () => await (0, db_1.connect)());
    afterEach(async () => await (0, db_1.clearDatabase)());
    afterAll(async () => await (0, db_1.closeDatabase)());
    test("create event", async () => {
        const eventData = {
            name: "Test Event",
            creator: new mongoose_1.Types.ObjectId(),
            description: "A test event",
            price: 10,
            date: new Date(),
            address: a,
            category: [c],
            chat: new mongoose_1.Types.ObjectId(),
            participants: [],
        };
        const createdEvent = await EventModel_1.Event.create(eventData);
        expect(createdEvent).toBeDefined();
        expect(createdEvent.name).toBe(eventData.name);
        expect(createdEvent.creator).toBe(eventData.creator);
        expect(createdEvent.description).toBe(eventData.description);
        expect(createdEvent.price).toBe(eventData.price);
        expect(createdEvent.date).toBe(eventData.date);
        expect(createdEvent.address).toMatchObject(a);
        expect(createdEvent.category.map(c => c.name)).toContain("Hobbys");
        expect(createdEvent.chat).toBe(eventData.chat);
        expect(createdEvent.participants).toStrictEqual(eventData.participants);
    });
    test("empty eventdata", async () => {
        const eventData = {
            name: "",
            creator: new mongoose_1.Types.ObjectId(),
            description: "",
            price: 0,
            date: undefined,
            address: undefined,
            category: [],
            chat: new mongoose_1.Types.ObjectId(),
            participants: [],
        };
        await expect(EventModel_1.Event.create(eventData)).rejects.toThrow();
    });
    test("negative price", async () => {
        const eventData = {
            name: "Test Event",
            creator: new mongoose_1.Types.ObjectId(),
            description: "A test event",
            price: -1,
            date: new Date(),
            address: a,
            category: [c],
            chat: new mongoose_1.Types.ObjectId(),
            participants: [],
        };
        await expect(EventModel_1.Event.create(eventData)).rejects.toThrow();
    });
});
//# sourceMappingURL=EventModel.test.js.map