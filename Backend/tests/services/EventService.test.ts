import { connect, closeDatabase, clearDatabase } from "../../database/db";
import {
  addressResource,
  categoryResource,
  eventResource,
  userResource,
} from "../../src/Resources";
import { Event } from "../../src/model/EventModel";
import { User } from "../../src/model/UserModel";
import { EventService } from "../../src/services/EventService";

const a: addressResource = {
  street: "Street",
  houseNumber: "1",
  postalCode: "12345",
  city: "Berlin",
  country: "Germany",
};

const c: categoryResource = {
  name: "Hobbys",
  description: "persönliche Interessen, Freizeit",
};

const c1: categoryResource = {
  name: "Sport",
  description: "sportliche Aktivitäten, Spiele, Fitness",
};

const u: userResource = {
  email: "John@doe.com",
  name: {
    first: "John",
    last: "Doe",
  },
  password: "12abcAB!",
  isAdministrator: true,
  address: a,
  birthDate: new Date(),
  gender: "male",
  isActive: true,
  profilePicture: "picture1",
  socialMediaUrls: {
    facebook: "facebook",
    instagram: "instagram",
  },
};

const u1: userResource = {
  email: "Don@joe.com",
  name: {
    first: "Don",
    last: "Joe",
  },
  password: "12abcAB!",
  isAdministrator: true,
  address: a,
  birthDate: new Date(),
  gender: "male",
  isActive: true,
  profilePicture: "picture1",
  socialMediaUrls: {
    facebook: "facebook",
    instagram: "instagram",
  },
};

const e: eventResource = {
  name: "Sample Event",
  description: "This is my first event",
  price: 10,
  date: new Date(),
  address: a,
  thumbnail: "sampleThumbnail",
  hashtags: ["sport", "freizeit"],
  category: [c, c1],
};

const e1: eventResource = {
  name: "Sample Event 1",
  description: "for anyone interested",
  price: 0,
  date: new Date(),
  address: a,
  thumbnail: "sampleThumbnail",
  category: [c],
};

const e2: eventResource = {
  name: "Sample Event 2",
  description: "this is my second gym party",
  price: 100,
  date: new Date(),
  address: a,
  hashtags: ["freizeit"],
  category: [c1],
};

const eventService: EventService = new EventService();
const NON_EXISTING_ID = "635d2e796ea2e8c9bde5787c";

describe("EventService Tests", () => {
  beforeAll(async () => await connect());
  afterEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());

  test("create event", async () => {
    const user = await User.create(u);
    const event = await eventService.createEvent(e, user.id);
    expect(event).toBeDefined();
    expect(event.id).toBeDefined();
    expect(event.name).toBe(e.name);
    expect(event.creator).toBeDefined;
    expect(event.description).toBe(e.description);
    expect(event.price).toBe(e.price);
    expect(event.date).toBe(e.date);
    expect(event.address).toMatchObject(a);
    expect(event.thumbnail).toBe(e.thumbnail);
    expect(event.hashtags).toStrictEqual(e.hashtags);
    expect(event.category.map((c) => c.name)).toContain("Hobbys");
    expect(event.chat).toBeDefined();
    expect(event.participants.length).toBe(1);
  });

  test("get event", async () => {
    const user = await User.create(u);
    const event = await eventService.createEvent(e, user.id);
    await expect(eventService.getEvent(undefined)).rejects.toThrow();
    await expect(eventService.getEvent(NON_EXISTING_ID)).rejects.toThrow();
    const er = await eventService.getEvent(event.id);
    const em = await Event.findById(event.id);
    expect(er.id).toBe(em.id);
    expect(er.name).toBe(em.name);
    expect(er.creator).toBeDefined();
    expect(er.description).toBe(em.description);
    expect(er.price).toBe(em.price);
    expect(er.date).toStrictEqual(em.date);
    expect(er.address).toMatchObject(a);
    expect(er.thumbnail).toBe(em.thumbnail);
    expect(er.hashtags).toStrictEqual(em.hashtags);
    expect(er.category.map((c) => c.name)).toContain("Hobbys");
    expect(er.chat).toBeDefined;
    expect(er.participants.length).toBe(1);
  });

  test("get created events", async () => {
    await expect(eventService.getEvents(undefined)).rejects.toThrow();
    const user1 = await User.create(u);
    const user2 = await User.create(u1);
    await eventService.createEvent(e, user1.id);
    await eventService.createEvent(e1, user1.id);
    await eventService.createEvent(e2, user2.id);
    const events = await eventService.getEvents(user1.id);
    expect(events.events.length).toBe(2);
    expect(events.events[0].name).toBe("Sample Event");
    expect(events.events[1].name).toBe("Sample Event 1");
  });

  test("get all events", async () => {
    const user1 = await User.create(u);
    const user2 = await User.create(u1);
    await eventService.createEvent(e, user1.id);
    await eventService.createEvent(e1, user1.id);
    await eventService.createEvent(e2, user2.id);
    const events = await eventService.getAllEvents();
    expect(events.events.length).toBe(3);
    expect(events.events[0].name).toBe("Sample Event");
    expect(events.events[1].name).toBe("Sample Event 1");
    expect(events.events[2].name).toBe("Sample Event 2");
  });

  test("search events by name", async () => {
    const user1 = await User.create(u);
    const user2 = await User.create(u1);
    await eventService.createEvent(e, user1.id);
    await eventService.createEvent(e1, user1.id);
    await eventService.createEvent(e2, user2.id);
    let events;
    events = await eventService.searchEvents("sample event");
    expect(events.events.length).toBe(3);
    expect(events.events[0].name).toBe("Sample Event");
    expect(events.events[1].name).toBe("Sample Event 1");
    expect(events.events[2].name).toBe("Sample Event 2");
    events = await eventService.searchEvents("Sample Event 2");
    expect(events.events.length).toBe(1);
    expect(events.events[0].name).toBe("Sample Event 2");
    events = await eventService.searchEvents("event sample");
    expect(events.events.length).toBe(0);
    events = await eventService.searchEvents("");
    expect(events.events.length).toBe(3);
    events = await eventService.searchEvents(undefined);
    expect(events.events.length).toBe(3);
  });

  test("search events by description", async () => {
    const user1 = await User.create(u);
    const user2 = await User.create(u1);
    await eventService.createEvent(e, user1.id);
    await eventService.createEvent(e1, user1.id);
    await eventService.createEvent(e2, user2.id);
    let events;
    events = await eventService.searchEvents("this is my");
    expect(events.events.length).toBe(2);
    expect(events.events[0].description).toBe("This is my first event");
    expect(events.events[1].description).toBe("this is my second gym party");
    events = await eventService.searchEvents("for anyone");
    expect(events.events.length).toBe(1);
    expect(events.events[0].description).toBe("for anyone interested");
    events = await eventService.searchEvents("this is my third event");
    expect(events.events.length).toBe(0);
  });

  test("search events by hashtags", async () => {
    const user1 = await User.create(u);
    const user2 = await User.create(u1);
    await eventService.createEvent(e, user1.id);
    await eventService.createEvent(e1, user1.id);
    await eventService.createEvent(e2, user2.id);
    let events;
    events = await eventService.searchEvents("sport");
    expect(events.events.length).toBe(1);
    expect(events.events[0].hashtags[0]).toBe("sport");
    events = await eventService.searchEvents("freizeit");
    expect(events.events.length).toBe(2);
    expect(events.events[0].hashtags[1]).toBe("freizeit");
    expect(events.events[1].hashtags[0]).toBe("freizeit");
    events = await eventService.searchEvents("sport freizeit");
    expect(events.events.length).toBe(0);
  });

  test("join event", async () => {
    const user1 = await User.create(u);
    const user2 = await User.create(u1);
    const event1 = await eventService.createEvent(e1, user1.id);
    const event2 = await eventService.createEvent(e2, user2.id);
    expect(await eventService.joinEvent(user1.id, event2.id)).toBeTruthy();
    expect((await eventService.getEvent(event2.id)).participants).toHaveLength(2);
    expect(await eventService.joinEvent(user2.id, event1.id)).toBeTruthy();
    expect((await eventService.getEvent(event1.id)).participants).toHaveLength(2);
  });
});
