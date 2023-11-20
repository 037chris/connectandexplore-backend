import { Types } from "mongoose";
import { eventResource, eventsResource, usersResource } from "../Resources";
import { Event, IEvent } from "../model/EventModel";
import { User } from "../model/UserModel";

export class EventService {
  /**
   * Event erstellen
   */
  async createEvent(event: any) {
    if (!event || typeof event !== "object") {
      throw new Error("Invalid event data");
    }
    try {
      const newEvent = await Event.create(event);
      newEvent.save();
      return newEvent;
    } catch (error) {
      throw new Error("Event creation failed");
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
      if (!event) throw new Error(`Event with id ${eventID} not found`);
      const index = event.participants.findIndex((participant) => {
        const userObjecId = new Types.ObjectId(userID);
        return participant.equals(userObjecId);
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
      if (!event) throw new Error(`Event with id ${eventID} not found`);
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
  async updateEvent() {}

  /**
   * Event löschen ( Event Manager / Admin )
   */
  async deleteEvent(eventID: string, creatorID: string): Promise<boolean> {
    try {
      const event = await Event.findById(eventID).exec();
      if (!event) throw new Error(`Event with id ${eventID} not found`);
      const creator = await User.findById(event.creator).exec();
      if (
        !creator ||
        (creator._id.toString() !== creatorID && !creator.isAdministrator)
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
