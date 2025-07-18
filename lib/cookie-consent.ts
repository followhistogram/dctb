import Cookies from "js-cookie"

export type ConsentPreferences = {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

const CONSENT_COOKIE_NAME = "cookie_consent"
const CONSENT_VERSION = "1.0" // Pro budoucí migrace

export const getConsent = (): ConsentPreferences | null => {
  const cookie = Cookies.get(CONSENT_COOKIE_NAME)
  if (cookie) {
    try {
      const data = JSON.parse(cookie)
      // Kontrola verze a struktury
      if (data.version === CONSENT_VERSION && data.preferences) {
        const preferences = data.preferences
        if (
          typeof preferences.necessary === "boolean" &&
          typeof preferences.analytics === "boolean" &&
          typeof preferences.marketing === "boolean"
        ) {
          return preferences
        }
      }
    } catch (e) {
      console.error("Chyba při parsování cookie souhlasu", e)
      // Pokud je cookie poškozená, odstraníme ji
      Cookies.remove(CONSENT_COOKIE_NAME)
      return null
    }
  }
  return null
}

export const setConsent = (preferences: ConsentPreferences) => {
  const data = {
    version: CONSENT_VERSION,
    preferences,
    timestamp: new Date().toISOString(),
  }

  // Souhlas se ukládá na 365 dní
  Cookies.set(CONSENT_COOKIE_NAME, JSON.stringify(data), {
    expires: 365,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  })
}

export const hasConsent = (): boolean => {
  return getConsent() !== null
}

export const hasAnalyticsConsent = (): boolean => {
  const consent = getConsent()
  return consent?.analytics === true
}

export const hasMarketingConsent = (): boolean => {
  const consent = getConsent()
  return consent?.marketing === true
}

export const clearConsent = () => {
  Cookies.remove(CONSENT_COOKIE_NAME)
}
