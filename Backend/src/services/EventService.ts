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
  async getAllEvents() {}

  /**
   * Alle Events abrufen
   */
  async getEvents() {}

  /**
   * Events filtern / Event suchen
   */
  async searchEvents() {}

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
