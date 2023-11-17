import { eventResource, eventsResource } from "../Resources";
import { Event, IEvent } from "../model/EventModel";

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
  async joinEvent() {}

  /**
   * Alle teilgenommenen Events abrufen ( Event Teilnehmer )
   */
  async getJoinedEvents() {}

  /**
   * Teilnahme am Event absagen ( Event Teilnehmer )
   */
  async cancelEvent() {}

  /**
   * Alle Teilnehmer vom Event abrufen ( Event Manager / Admin )
   */
  async getParticipants() {}

  /**
   * Event bearbeiten ( Event Manager / Admin )
   */
  async updateEvent() {}

  /**
   * Event löschen ( Event Manager / Admin )
   */
  async deleteEvent() {}
}

export default new EventService();
