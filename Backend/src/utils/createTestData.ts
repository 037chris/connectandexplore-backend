import { categoryResource, eventResource, userResource } from "../Resources";
import { IAddress } from "../model/UserModel";
import EventService from "../services/EventService";
import { UserService } from "../services/UserService";

const createTestData = async () => {
  const a: IAddress = {
    postalCode: "54321",
    city: "Berlin",
  };

  const u: userResource = {
    email: "John@some-host.de",
    name: {
      first: "John",
      last: "Doe",
    },
    password: "12abcAB!",
    isAdministrator: false,
    address: a,
    birthDate: new Date("2000-06-14"),
    gender: "male",
    isActive: true,
  };

  const u2: userResource = {
    email: "Jane@some-host.de",
    name: {
      first: "Jane",
      last: "Doe",
    },
    password: "12abcAB!",
    isAdministrator: false,
    address: a,
    birthDate: new Date("2000-04-10"),
    gender: "female",
    isActive: true,
  };

  const userService: UserService = new UserService();
  const john = await userService.createUser(u);
  const jane = await userService.createUser(u2);

  const category1: categoryResource = {
    name: "Music",
    description: "Music Event",
  };
  const category2: categoryResource = {
    name: "Art",
    description: "Art Event",
  };

  const event1: eventResource = {
    name: "Summer Music Festival",
    description:
      "Ein großes Festival mit verschiedenen Musikgenres und lokalen Künstlern.",
    price: 50,
    date: new Date("2024-06-21"),
    address: {
      street: "Musikstraße",
      houseNumber: "1",
      city: "Berlin",
      postalCode: "10115",
      country: "Deutschland",
    },
    category: [category1],
    hashtags: ["party", "Party", "food", "Food"],
  };

  const event2: eventResource = {
    name: "Street Food Market",
    description:
      "Eine kulinarische Reise durch die Street Food Kulturen der Welt.",
    price: 10,
    date: new Date("2024-07-10"),
    address: {
      street: "Gourmetplatz",
      houseNumber: "5",
      city: "Hamburg",
      postalCode: "20095",
      country: "Deutschland",
    },
    hashtags: ["Food", "food"],
  };

  const event3: eventResource = {
    name: "Coding Workshop",
    description: "Ein interaktiver Workshop für Anfänger im Programmieren.",
    price: 0,
    date: new Date("2024-08-15"),
    address: {
      street: "Techweg",
      houseNumber: "3",
      city: "München",
      postalCode: "80331",
      country: "Deutschland",
    },
  };

  const event4: eventResource = {
    name: "Yoga im Park",
    description: "Entspannende Yoga-Sessions im Freien für alle Niveaus.",
    price: 15,
    date: new Date("2024-05-25"),
    address: {
      street: "Grünallee",
      houseNumber: "2",
      city: "Köln",
      postalCode: "50678",
      country: "Deutschland",
    },
  };

  const event5: eventResource = {
    name: "Kunstausstellung Modern Art",
    description: "Entdecken Sie moderne Kunstwerke lokaler Künstler.",
    price: 20,
    date: new Date("2024-09-30"),
    address: {
      street: "Künstlerstraße",
      houseNumber: "4",
      city: "Frankfurt",
      postalCode: "60311",
      country: "Deutschland",
    },
    category: [category2],
  };

  await EventService.createEvent(event1, john.id);
  await EventService.createEvent(event2, john.id);
  await EventService.createEvent(event3, john.id);
  await EventService.createEvent(event4, jane.id);
  await EventService.createEvent(event5, jane.id);
};

export default createTestData;
