import { Types } from "mongoose";
import { eventResource, eventsResource, usersResource } from "../Resources";
import { Event } from "../model/EventModel";
import { User } from "../model/UserModel";

export class EventService {
  /**
   * Event erstellen
   */
  async createEvent(eventResource: eventResource, creatorID: string): Promise<eventResource> {
    try {
      const event = await Event.create({
        name: eventResource.name,
        creator: creatorID,
        description: eventResource.description,
        price: eventResource.price,
        date: eventResource.date,
        address: eventResource.address,
        thumbnail: eventResource.thumbnail,
        hashtags: eventResource.hashtags,
        category: eventResource.category,
        chat: new Types.ObjectId(),
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
        category: event.category.map((categoryId) => categoryId.toString()),
        chat: event.chat.toString(),
      };
    } catch (err) {
      throw new Error("Event creation failed");
    }
  }

  async getEvent(eventID: string): Promise<eventResource> {
    try {
      const event = await Event.findById(eventID).exec();
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
        category: event.category.map((categoryId) => categoryId.toString()),
        chat: event.chat.toString(),
        participants: event.participants.map((participantId) =>
          participantId.toString()
        ),
      };
    } catch (error) {
      throw new Error("Error getting event");
    }
  }

  /**
   * Alle erstellten Events abrufen ( Event Manager / Admin )
   */
  async getEvents(userID: string): Promise<eventsResource> {
    if (!userID) {
      throw new Error("Can not get creator, userID is invalid");
    }
    try {
      const events = await Event.find({ creator: userID }).exec();
      const eventsResult: eventsResource = {
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
          category: event.category.map((categoryId) => categoryId.toString()),
          chat: event.chat.toString(),
          participants: event.participants.map((participantId) =>
            participantId.toString()
          ),
        })),
      };
      return eventsResult;
    } catch (error) {
      throw new Error("Error getting events");
    }
  }

  /**
   * Alle Events abrufen
   */
  async getAllEvents(): Promise<eventsResource> {
    try {
      const events = await Event.find({}).exec();
      const eventsResult: eventsResource = {
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
          category: event.category.map((categoryId) => categoryId.toString()),
          chat: event.chat.toString(),
          participants: event.participants.map((participantId) =>
            participantId.toString()
          ),
        })),
      };
      return eventsResult;
    } catch (error) {
      throw new Error("Error getting events");
    }
  }

  /**
   * Events filtern / Event suchen
   */
  async searchEvents(query: string): Promise<eventsResource> {
    try {
      const events = await Event.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { hashtags: { $in: [query] } },
        ],
      }).exec();
      const eventsResult: eventsResource = {
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
          category: event.category.map((categoryId) => categoryId.toString()),
          chat: event.chat.toString(),
          participants: event.participants.map((participantId) =>
            participantId.toString()
          ),
        })),
      };
      return eventsResult;
    } catch (error) {
      throw new Error("Error searching events");
    }
  }

  /**
   * Am Event teilnehmen ( Event Teilnehmer )
   */
  async joinEvent(userID: string, eventID: string): Promise<void> {
    try {
      const user = await User.findById(userID).exec();
      const event = await Event.findById(eventID).exec();
      if (!user) throw new Error("User not found");
      if (!event) throw new Error("Event not found");
      if (event.participants.includes(user._id)) {
        throw new Error("User is already participating in the event");
      }
      event.participants.push(user._id);
      await event.save();
    } catch (error) {
      throw new Error("Error joining event");
    }
  }

  /**
   * Alle teilgenommenen Events abrufen ( Event Teilnehmer )
   */
  async getJoinedEvents(userID: string): Promise<eventsResource> {
    try {
      const events = await Event.find({ participants: userID }).exec();
      const eventsResult: eventsResource = {
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
          category: event.category.map((categoryId) => categoryId.toString()),
          chat: event.chat.toString(),
          participants: event.participants.map((participantId) =>
            participantId.toString()
          ),
        })),
      };
      return eventsResult;
    } catch (error) {
      throw new Error("Error getting events");
    }
  }

  /**
   * Teilnahme am Event absagen ( Event Teilnehmer )
   */
  async cancelEvent(userID: string, eventID: string): Promise<void> {
    try {
      const event = await Event.findById(eventID);
      if (!event) throw new Error("Event not found");
      const index = event.participants.findIndex((participant) => {
        return participant.equals(new Types.ObjectId(userID));
      });
      if (index === -1) {
        throw new Error("User is not participating in the event");
      }
      event.participants.splice(index, 1);
      await event.save();
    } catch (error) {
      throw new Error("Error canceling event");
    }
  }

  /**
   * Alle Teilnehmer vom Event abrufen ( Event Manager / Admin )
   */
  async getParticipants(
    eventID: string,
    creatorID: string
  ): Promise<usersResource> {
    try {
      const event = await Event.findById(eventID).exec();
      if (!event) throw new Error("Event not found");
      const creator = await User.findById(event.creator).exec();
      if (
        !creator ||
        (creator._id.toString() !== creatorID && !creator.isAdministrator)
      ) {
        throw new Error("Invalid authorization");
      }
      const participantIDs = event.participants;
      const participants = await User.find({
        _id: { $in: participantIDs },
      }).exec();
      const result: usersResource = {
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
    } catch (error) {
      throw new Error("Error getting participants");
    }
  }

  /**
   * Event bearbeiten ( Event Manager / Admin )
   */
  async updateEvent(
    eventID: string,
    eventResource: eventResource,
    userID: string
  ): Promise<eventResource> {
    const event = await Event.findById(eventID).exec();
    if (!event) throw new Error("Event not found");
    const creator = await User.findById(event.creator).exec();
    const user = await User.findById(userID).exec();
    if (
      !creator ||
      !user ||
      (creator._id.toString() !== userID && !user.isAdministrator)
    ) {
      throw new Error("Invalid authorization");
    }
    if (eventResource.name) event.name = eventResource.name;
    if (eventResource.description)
      event.description = eventResource.description;
    if (eventResource.price) event.price = eventResource.price;
    if (eventResource.date) event.date = eventResource.date;
    if (eventResource.address) event.address = eventResource.address;
    if (eventResource.thumbnail) event.thumbnail = eventResource.thumbnail;
    if (eventResource.hashtags) event.hashtags = eventResource.hashtags;
    if (eventResource.category)
      event.category = eventResource.category.map(
        (categoryId) => new Types.ObjectId(categoryId)
      );
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
      category: savedEvent.category.map((categoryId) => categoryId.toString()),
      chat: savedEvent.chat.toString(),
      participants: savedEvent.participants.map((participantId) =>
        participantId.toString()
      ),
    };
  }

  /**
   * Event löschen ( Event Manager / Admin )
   */
  async deleteEvent(eventID: string, userID: string): Promise<boolean> {
    try {
      const event = await Event.findById(eventID).exec();
      if (!event) throw new Error("Event not found");
      const creator = await User.findById(event.creator).exec();
      const user = await User.findById(userID).exec();
      if (
        !creator ||
        !user ||
        (creator._id.toString() !== userID && !user.isAdministrator)
      ) {
        throw new Error("Invalid authorization");
      }
      const result = await Event.deleteOne({ _id: eventID }).exec();
      return result.deletedCount == 1;
    } catch (error) {
      throw new Error("Error deleting event");
    }
  }
}

export default new EventService();
