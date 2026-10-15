import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { CalendarEvent } from '../types/calendar';

// Initialize Firebase App safely (singleton)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// OAuth Scopes according to workspace-integration skill
export const CALENDAR_SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
];

const provider = new GoogleAuthProvider();
// Request Calendar events scope
CALENDAR_SCOPES.forEach((scope) => provider.addScope(scope));
provider.setCustomParameters({
  prompt: 'select_account',
});

// Flag to indicate if we are in the middle of a sign-in flow
let isSigningIn = false;
// Cache the access token in memory (CRITICAL: Do NOT store in localStorage or sessionStorage)
let cachedAccessToken: string | null = null;

// Synced event record
export interface SyncedCalendarRecord {
  eventId: string;
  googleEventId: string;
  title: string;
  dateStr: string;
  syncedAt: string;
  htmlLink?: string;
}

const STORAGE_SYNC_KEY = 'azamgarh_google_calendar_synced_events';

// Load synced events mapping from storage
export const getSyncedEventsMap = (): Record<string, SyncedCalendarRecord> => {
  try {
    const raw = localStorage.getItem(STORAGE_SYNC_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

export const saveSyncedEventRecord = (record: SyncedCalendarRecord) => {
  try {
    const current = getSyncedEventsMap();
    current[record.eventId] = record;
    localStorage.setItem(STORAGE_SYNC_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn('Failed to save synced record in local storage:', err);
  }
};

export const removeSyncedEventRecord = (eventId: string) => {
  try {
    const current = getSyncedEventsMap();
    delete current[eventId];
    localStorage.setItem(STORAGE_SYNC_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn('Failed to remove synced record from local storage:', err);
  }
};

// Initialize auth state listener. Call this on app load.
export const initCalendarAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Must be called from a button click or user interaction
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Google खाता से एक्सेस टोकन प्राप्त नहीं हो सका');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign In error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Helper to format date strings for Google Calendar API
const formatAllDayEventDate = (year: number, month: number, day: number) => {
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  const startDateStr = `${year}-${mm}-${dd}`;

  // Next day for end date (Google Calendar all-day event end date is exclusive)
  const nextDate = new Date(Date.UTC(year, month - 1, day + 1));
  const nextY = nextDate.getUTCFullYear();
  const nextM = String(nextDate.getUTCMonth() + 1).padStart(2, '0');
  const nextD = String(nextDate.getUTCDate()).padStart(2, '0');
  const endDateStr = `${nextY}-${nextM}-${nextD}`;

  return { startDateStr, endDateStr };
};

// Create Google Calendar Event
export const addFestivalToGoogleCalendar = async (
  event: CalendarEvent,
  token: string
): Promise<SyncedCalendarRecord> => {
  const { startDateStr, endDateStr } = formatAllDayEventDate(event.year, event.month, event.day);

  const eventSummary = `🚩 ${event.titleHindi} (${event.titleEng}) - आजमगढ़ पंचांग`;
  
  const descriptionParts: string[] = [
    `📅 ${event.fullDateHindi}`,
    `पंचांग: ${event.hinduMonth} मास, ${event.paksha} पक्ष, ${event.tithi}`,
  ];

  if (event.subText) {
    descriptionParts.push(`विशेष: ${event.subText}`);
  }
  if (event.descriptionHindi) {
    descriptionParts.push(`\nविवरण:\n${event.descriptionHindi}`);
  }
  if (event.vidhiHindi) {
    descriptionParts.push(`\nपूजा एवं व्रत विधि:\n${event.vidhiHindi}`);
  }
  if (event.muhuratTime) {
    descriptionParts.push(`\nशुभ मुहूर्त:\n${event.muhuratTime}`);
  }

  descriptionParts.push(
    `\n📍 स्थान: आजमगढ़, उत्तर प्रदेश`,
    `🪔 स्रोत: श्री आजमगढ़ वैदिक पंचांग एवं हिंदू कैलेंडर`
  );

  const requestBody = {
    summary: eventSummary,
    description: descriptionParts.join('\n'),
    location: 'आजमगढ़, उत्तर प्रदेश (Azamgarh, UP)',
    start: {
      date: startDateStr,
      timeZone: 'Asia/Kolkata',
    },
    end: {
      date: endDateStr,
      timeZone: 'Asia/Kolkata',
    },
    transparency: 'transparent', // shows as free so it doesn't block work meetings
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 1440 }, // 1 day before
        { method: 'popup', minutes: 180 },  // 3 hours before
      ],
    },
    extendedProperties: {
      private: {
        azamgarh_festival_id: event.id,
        source: 'azamgarh_panchang_app',
      },
    },
  };

  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || `HTTP ${response.status}: इवेंट जोड़ने में विफलता`;
    throw new Error(message);
  }

  const result = await response.json();
  const record: SyncedCalendarRecord = {
    eventId: event.id,
    googleEventId: result.id,
    title: event.titleHindi,
    dateStr: startDateStr,
    syncedAt: new Date().toISOString(),
    htmlLink: result.htmlLink,
  };

  saveSyncedEventRecord(record);
  return record;
};

// Delete Google Calendar Event
export const removeFestivalFromGoogleCalendar = async (
  eventId: string,
  googleEventId: string,
  token: string
): Promise<void> => {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(googleEventId)}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // If 204 (No Content) or 404 (already deleted in Google Calendar), clean up local record
  if (response.ok || response.status === 404 || response.status === 410) {
    removeSyncedEventRecord(eventId);
    return;
  }

  const errorData = await response.json().catch(() => ({}));
  const message = errorData.error?.message || `HTTP ${response.status}: इवेंट हटाने में विफलता`;
  throw new Error(message);
};
