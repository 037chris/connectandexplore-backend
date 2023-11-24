import { connect, closeDatabase, clearDatabase } from "../../database/db";
import {
  addressResource,
  categoryResource,
  eventResource,
  eventsResource,
  userResource,
  usersResource,
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

const u2: userResource = {
  email: "test@mail.com",
  name: {
    first: "test",
    last: "name",
  },
  password: "12abcAB!",
  isAdministrator: false,
  address: a,
  birthDate: new Date(),
  gender: "female",
  isActive: true,
};

const u3: userResource = {
  email: "inactive@mail.com",
  name: {
    first: "in",
    last: "active",
  },
  password: "12abcAB!",
  isAdministrator: false,
  address: a,
  birthDate: new Date(),
  gender: "female",
  isActive: false,
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
    // identical event data
    const event1 = await eventService.createEvent(e, user.id);
    expect(event1).toBeDefined();
    expect(event1.id).not.toBe(event.id);
    expect(event1.name).toBe(event.name);
    expect(event1.creator).toBe(event.creator);
    expect(event1.description).toBe(event.description);
    expect(event1.price).toBe(event.price);
    expect(event1.date).toBe(event.date);
    expect(event1.thumbnail).toBe(event.thumbnail);
    expect(event1.hashtags).toStrictEqual(event.hashtags);
    expect(event1.chat).not.toBe(event.chat);
    expect(event.participants.length).toBe(event.participants.length);
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
    let events: eventsResource;
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
    let events: eventsResource;
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
    let events: eventsResource;
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
    let result: eventResource;
    result = await eventService.getEvent(event2.id);
    expect(result.participants).toHaveLength(1);
    expect(result.participants[0]).toBe(user2.id);
    expect(await eventService.joinEvent(user1.id, event2.id)).toBeTruthy();
    result = await eventService.getEvent(event2.id);
    expect(result.participants).toHaveLength(2);
    expect(result.participants[0]).toBe(user2.id);
    expect(result.participants[1]).toBe(user1.id);
    expect(await eventService.joinEvent(user2.id, event1.id)).toBeTruthy();
    result = await eventService.getEvent(event1.id);
    expect(result.participants).toHaveLength(2);
    // invalid/no id
    const id = NON_EXISTING_ID;
    expect(await eventService.joinEvent(user1.id, id)).toBeFalsy();
    expect(await eventService.joinEvent(id, event1.id)).toBeFalsy();
    result = await eventService.getEvent(event1.id);
    expect(result.participants).toHaveLength(2);
    expect(await eventService.joinEvent(undefined, undefined)).toBeFalsy();
    // user already participating
    expect(await eventService.joinEvent(user1.id, event2.id)).toBeFalsy();
    expect(await eventService.joinEvent(user1.id, event1.id)).toBeFalsy();
    result = await eventService.getEvent(event2.id);
    expect(result.participants).toHaveLength(2);
    expect(await eventService.joinEvent(user2.id, event1.id)).toBeFalsy();
    expect(await eventService.joinEvent(user2.id, event2.id)).toBeFalsy();
    result = await eventService.getEvent(event1.id);
    expect(result.participants).toHaveLength(2);
  });

  test("get joined events", async () => {
    const user1 = await User.create(u);
    const user2 = await User.create(u1);
    const user3 = await User.create(u2);
    const event1 = await eventService.createEvent(e1, user1.id);
    const event2 = await eventService.createEvent(e2, user1.id);
    await eventService.joinEvent(user2.id, event1.id);
    await eventService.joinEvent(user2.id, event2.id);
    let result: eventsResource;
    result = await eventService.getJoinedEvents(user2.id);
    expect(result.events).toHaveLength(2);
    expect(result.events[0].name).toBe("Sample Event 1");
    expect(result.events[1].name).toBe("Sample Event 2");
    result = await eventService.getJoinedEvents(user3.id);
    expect(result.events).toHaveLength(0);
  });

  test("cancel event", async () => {
    const user1 = await User.create(u);
    const user2 = await User.create(u1);
    const event1 = await eventService.createEvent(e1, user1.id);
    const event2 = await eventService.createEvent(e2, user2.id);
    let result: eventResource;
    await eventService.joinEvent(user1.id, event2.id);
    result = await eventService.getEvent(event2.id);
    expect(result.participants).toHaveLength(2);
    // invalid/no id
    const id = NON_EXISTING_ID;
    expect(await eventService.cancelEvent(user1.id, id)).toBeFalsy();
    expect(await eventService.cancelEvent(id, event1.id)).toBeFalsy();
    expect(await eventService.cancelEvent(undefined, undefined)).toBeFalsy();
    // successful cancel
    expect(await eventService.cancelEvent(user1.id, event2.id)).toBeTruthy();
    result = await eventService.getEvent(event2.id);
    expect(result.participants).toHaveLength(1);
    // cancel participation as event manager
    expect(await eventService.cancelEvent(user1.id, event1.id)).toBeFalsy();
    result = await eventService.getEvent(event1.id);
    expect(result.participants).toHaveLength(1);
    expect(result.creator).toBe(user1.id);
  });

  test("get participants of event", async () => {
    const user = await User.create(u);
    const user1 = await User.create(u1);
    const user2 = await User.create(u2);
    const event = await eventService.createEvent(e, user.id);
    let participants: usersResource;
    participants = await eventService.getParticipants(event.id, user.id);
    expect(participants.users).toHaveLength(1);
    expect(participants.users[0].id).toBe(user.id);
    await eventService.joinEvent(user1.id, event.id);
    await eventService.joinEvent(user2.id, event.id);
    participants = await eventService.getParticipants(event.id, user.id);
    expect(participants.users).toHaveLength(3);
    expect(participants.users[1].id).toBe(user1.id);
    expect(participants.users[2].id).toBe(user2.id);
    // not event creator but admin
    participants = await eventService.getParticipants(event.id, user1.id);
    expect(participants.users).toHaveLength(3);
    // invalid authorization
    await expect(
      eventService.getParticipants(event.id, user2.id)
    ).rejects.toThrow();
    // after cancel participation
    await eventService.cancelEvent(user1.id, event.id);
    await eventService.cancelEvent(user2.id, event.id);
    participants = await eventService.getParticipants(event.id, user.id);
    expect(participants.users).toHaveLength(1);
    expect(participants.users[0].id).toBe(user.id);
  });

  test("delete event", async () => {
    const user = await User.create(u);
    const user1 = await User.create(u1);
    const user2 = await User.create(u2);
    let event = await eventService.createEvent(e, user.id);
    expect(event).toBeDefined();
    let result;
    result = await eventService.deleteEvent(event.id, user.id);
    expect(result).toBeTruthy();
    await expect(eventService.getEvent(event.id)).rejects.toThrow();
    // invalid/no id
    const id = NON_EXISTING_ID;
    await expect(eventService.deleteEvent(id, undefined)).rejects.toThrow();
    await expect(eventService.deleteEvent(undefined, id)).rejects.toThrow();
    // not event creator but admin
    event = await eventService.createEvent(e, user.id);
    expect(event).toBeDefined();
    result = await eventService.deleteEvent(event.id, user1.id);
    expect(result).toBeTruthy();
    await expect(eventService.getEvent(event.id)).rejects.toThrow();
    // invalid authorization
    event = await eventService.createEvent(e, user.id);
    expect(event).toBeDefined();
    await expect(
      eventService.deleteEvent(event.id, user2.id)
    ).rejects.toThrow();
    expect(await eventService.getEvent(event.id)).toBeDefined();
  });
});
