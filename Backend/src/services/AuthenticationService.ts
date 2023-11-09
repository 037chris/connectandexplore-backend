import { User } from "../model/UserModel";

/**
 * Prüft Email und Passwort, bei Erfolg wird die ID und der Name des Users zurückgegeben
 * und success ist true. Groß-/Kleinschreibung bei der E-Mail ist zu ignorieren.
 * Falls kein User mit gegebener EMail existiert oder das Passwort falsch ist, wird nur
 * success mit falsch zurückgegeben. Aus Sicherheitsgründen wird kein weiterer Hinweis gegeben.
 */
export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; id?: string; firstName?: string }> {
  email = email.toLowerCase();
  const user = await User.findOne({ email }).exec();
  if (user) {
    if (await user.isCorrectPassword(password)) {
      return { success: true, id: user.id, firstName: user.name.first };
    }
  }
  return { success: false };
}
