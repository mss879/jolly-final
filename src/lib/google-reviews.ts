import "server-only";
import { GOOGLE_RATING, REVIEWS } from "./data";

/* Live reviews from the client's Google Business listing — "Jolly's Creamery
   Corporate office", 17 Polhengoda Terrace, Colombo 5 (the listing the client
   shared, Oct 2026). Two ways in, set in .env.local / hosting (.env.example):

     FEATURABLE_WIDGET_ID    a free Featurable widget connected to the listing
                             (no Google billing). Featurable re-reads Google
                             about once a day; the free plan carries up to 15
                             reviews and asks for its "Powered by" credit.
     GOOGLE_PLACES_API_KEY   Google's own Places API (New) — needs billing on
                             the Google Cloud project; at most five reviews.
     GOOGLE_PLACE_ID         optional — only to point at a different listing

   The widget wins when both are set. Either answer is cached for six hours,
   so the source is called a few times a day rather than per visit. */

const REVALIDATE_SECONDS = 6 * 60 * 60;
const FIELDS = "rating,userRatingCount,reviews,googleMapsUri,googleMapsLinks";

export type ShownReview = {
  key: string;
  name: string;
  photo: string | null; // Google profile picture
  initial: string;
  accent: string; // avatar tint when there is no photo
  rating: number;
  when: string; // "2 months ago"
  text: string;
  href: string | null; // the review (or author) on Google
  subtitle: string | null;
};

export type GoogleReviews = {
  live: boolean; // false = the built-in placeholders, before Google is set up
  rating: string; // "4.9"
  count: number | null;
  reviews: ShownReview[];
  listingUrl: string; // the reviews on Google Maps
  writeReviewUrl: string;
  credit: { label: string; href: string } | null; // the widget provider, when it asks for one
};

type PlaceReview = {
  name?: string;
  rating?: number;
  relativePublishTimeDescription?: string;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  googleMapsUri?: string;
};

type Place = {
  rating?: number;
  userRatingCount?: number;
  reviews?: PlaceReview[];
  googleMapsUri?: string;
  googleMapsLinks?: { reviewsUri?: string; writeAReviewUri?: string };
};

const ACCENTS = ["#B98E2F", "#32004B", "#7A5C2E", "#58267A", "#A0552E", "#2E5A46"];
const PLACE_ID = process.env.GOOGLE_PLACE_ID || "ChIJiYSk3shb4joREBL9Bdq7NAI";
/* The listing on Google, for links before (or without) an answer from the API. */
const LISTING_URL = `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(PLACE_ID)}`;
const WRITE_REVIEW_URL = `https://search.google.com/local/writereview?placeid=${encodeURIComponent(PLACE_ID)}`;

/* Only Google's own URLs are ever linked or shown as images. */
function googleUrl(value: unknown) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && /(^|\.)(google\.com|googleusercontent\.com|goo\.gl)$/.test(url.hostname)
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function placeholders(): GoogleReviews {
  return {
    live: false,
    rating: GOOGLE_RATING.score,
    count: null,
    reviews: REVIEWS.map((r) => ({
      key: r.name,
      name: r.name,
      photo: null,
      initial: r.initial,
      accent: r.accent,
      rating: r.rating,
      when: r.timeAgo,
      text: r.text,
      href: null,
      subtitle: r.event,
    })),
    listingUrl: LISTING_URL,
    writeReviewUrl: WRITE_REVIEW_URL,
    credit: null,
  };
}

/* ─── Featurable widget ───────────────────────────────────────── */

const FEATURABLE_API = "https://api.featurable.com";
const FEATURABLE_CREDIT = { label: "Powered by Featurable", href: "https://featurable.com" };

/* Newer widgets answer on v2, older ones on v1 — the two shapes differ. */
type FeaturableV2 = {
  success?: boolean;
  widget?: {
    showBranding?: boolean;
    gbpLocationSummary?: { reviewsCount?: number; rating?: number; writeAReviewUri?: string };
    reviews?: {
      id?: string;
      author?: { name?: string | null; avatarUrl?: string | null; photoUrl?: string | null } | null;
      text?: string | null;
      originalText?: string | null;
      rating?: { value?: number; max?: number } | null;
      publishedAt?: string | null;
      url?: string | null;
    }[];
  };
};

type FeaturableV1 = {
  success?: boolean;
  totalReviewCount?: number;
  averageRating?: number;
  profileUrl?: string | null;
  config?: { showBranding?: boolean };
  reviews?: {
    reviewId?: string | null;
    reviewer?: { displayName?: string; profilePhotoUrl?: string; isAnonymous?: boolean };
    comment?: string;
    starRating?: number | string;
    createTime?: string | null;
  }[];
};

type RawReview = {
  id: string | null | undefined;
  name: string | null | undefined;
  photo: unknown;
  rating: unknown;
  text: string | null | undefined;
  date: string | null | undefined;
  href: unknown;
};

const STAR_WORDS: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

/* next/image only loads profile pictures from the host in next.config.ts. */
function profilePhoto(value: unknown) {
  const url = googleUrl(value);
  return url && new URL(url).hostname === "lh3.googleusercontent.com" ? url : null;
}

/* "2 months ago", the way Google words it, from the review's date. */
function timeAgo(iso: string | null | undefined) {
  const then = iso ? Date.parse(iso) : NaN;
  if (Number.isNaN(then)) return "";
  const days = Math.max(0, Math.floor((Date.now() - then) / 86_400_000));
  const fmt = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });
  if (days < 7) return fmt.format(-days, "day");
  if (days < 30) return fmt.format(-Math.floor(days / 7), "week");
  if (days < 365) return fmt.format(-Math.floor(days / 30), "month");
  return fmt.format(-Math.floor(days / 365), "year");
}

function shown(raw: RawReview[]): ShownReview[] {
  return raw.flatMap((r, i): ShownReview[] => {
    const text = (r.text ?? "").trim();
    const name = r.name?.trim() || "Google user";
    const rating = Math.round(typeof r.rating === "string" ? (STAR_WORDS[r.rating] ?? Number(r.rating)) : Number(r.rating));
    if (!text || !(rating >= 1 && rating <= 5)) return [];
    return [
      {
        key: r.id || `${name}-${i}`,
        name,
        photo: profilePhoto(r.photo),
        initial: name.charAt(0).toUpperCase(),
        accent: ACCENTS[i % ACCENTS.length],
        rating,
        when: timeAgo(r.date),
        text,
        href: googleUrl(r.href),
        subtitle: null,
      },
    ];
  });
}

async function featurable<T>(version: "v1" | "v2", widgetId: string): Promise<T | null> {
  const res = await fetch(`${FEATURABLE_API}/${version}/widgets/${encodeURIComponent(widgetId)}`, {
    next: { revalidate: REVALIDATE_SECONDS, tags: ["google-reviews"] },
  });
  if (!res.ok) return null;
  const body = (await res.json()) as T & { success?: boolean };
  return body.success ? body : null;
}

async function fromFeaturable(widgetId: string): Promise<GoogleReviews> {
  const failed: GoogleReviews = { ...placeholders(), live: true, count: null, reviews: [] };
  const summary = (rating: unknown, count: unknown) => ({
    rating: typeof rating === "number" && rating > 0 ? rating.toFixed(1) : GOOGLE_RATING.score,
    count: typeof count === "number" && count > 0 ? count : null,
  });

  try {
    const v2 = await featurable<FeaturableV2>("v2", widgetId);
    if (v2?.widget) {
      const w = v2.widget;
      return {
        live: true,
        ...summary(w.gbpLocationSummary?.rating, w.gbpLocationSummary?.reviewsCount),
        reviews: shown(
          (w.reviews ?? []).map((r) => ({
            id: r.id,
            name: r.author?.name,
            photo: r.author?.avatarUrl ?? r.author?.photoUrl,
            rating: r.rating?.value,
            text: r.text ?? r.originalText,
            date: r.publishedAt,
            href: r.url,
          })),
        ),
        listingUrl: LISTING_URL,
        writeReviewUrl: googleUrl(w.gbpLocationSummary?.writeAReviewUri) ?? WRITE_REVIEW_URL,
        credit: w.showBranding === false ? null : FEATURABLE_CREDIT,
      };
    }

    const v1 = await featurable<FeaturableV1>("v1", widgetId);
    if (v1) {
      return {
        live: true,
        ...summary(v1.averageRating, v1.totalReviewCount),
        reviews: shown(
          (v1.reviews ?? []).map((r) => ({
            id: r.reviewId,
            name: r.reviewer?.isAnonymous ? null : r.reviewer?.displayName,
            photo: r.reviewer?.profilePhotoUrl,
            rating: r.starRating,
            text: r.comment,
            date: r.createTime,
            href: null,
          })),
        ),
        listingUrl: googleUrl(v1.profileUrl) ?? LISTING_URL,
        writeReviewUrl: WRITE_REVIEW_URL,
        credit: v1.config?.showBranding === false ? null : FEATURABLE_CREDIT,
      };
    }

    console.error("[google-reviews] Featurable returned no widget — check FEATURABLE_WIDGET_ID");
    return failed;
  } catch (error) {
    console.error("[google-reviews]", error);
    return failed;
  }
}

/* ─── Google Places API ───────────────────────────────────────── */

export const googleReviewsConfigured = Boolean(process.env.FEATURABLE_WIDGET_ID || process.env.GOOGLE_PLACES_API_KEY);

/* Never throws. Before a source is set, the placeholder reviews stand in so
   the pages can be previewed. Once one is set, a failed call shows no review
   cards (never the placeholders) until it answers again. */
export async function getGoogleReviews(): Promise<GoogleReviews> {
  const widgetId = process.env.FEATURABLE_WIDGET_ID?.trim();
  if (widgetId) return fromFeaturable(widgetId);

  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return placeholders();

  const failed: GoogleReviews = { ...placeholders(), live: true, count: null, reviews: [] };

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(PLACE_ID)}?languageCode=en`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": FIELDS },
      next: { revalidate: REVALIDATE_SECONDS, tags: ["google-reviews"] },
    });
    if (!res.ok) {
      console.error(`[google-reviews] Places API ${res.status}: ${(await res.text()).slice(0, 300)}`);
      return failed;
    }
    const place = (await res.json()) as Place;

    const reviews = (place.reviews ?? []).flatMap((r, i): ShownReview[] => {
      const text = (r.text?.text ?? r.originalText?.text ?? "").trim();
      const name = r.authorAttribution?.displayName?.trim() || "Google user";
      const rating = Math.round(Number(r.rating));
      if (!text || !(rating >= 1 && rating <= 5)) return [];
      return [
        {
          key: r.name ?? `${name}-${i}`,
          name,
          photo: googleUrl(r.authorAttribution?.photoUri),
          initial: name.charAt(0).toUpperCase(),
          accent: ACCENTS[i % ACCENTS.length],
          rating,
          when: r.relativePublishTimeDescription ?? "",
          text,
          href: googleUrl(r.googleMapsUri) ?? googleUrl(r.authorAttribution?.uri),
          subtitle: null,
        },
      ];
    });

    const listingUrl =
      googleUrl(place.googleMapsLinks?.reviewsUri) ?? googleUrl(place.googleMapsUri) ?? LISTING_URL;
    return {
      live: true,
      rating: typeof place.rating === "number" ? place.rating.toFixed(1) : GOOGLE_RATING.score,
      count: typeof place.userRatingCount === "number" ? place.userRatingCount : null,
      reviews,
      listingUrl,
      writeReviewUrl: googleUrl(place.googleMapsLinks?.writeAReviewUri) ?? WRITE_REVIEW_URL,
      credit: null,
    };
  } catch (error) {
    console.error("[google-reviews]", error);
    return failed;
  }
}

/* "120+ Google reviews" before Google is connected, the real count after. */
export function reviewCountLabel(g: GoogleReviews) {
  if (g.count !== null) return `${g.count.toLocaleString("en-GB")} Google review${g.count === 1 ? "" : "s"}`;
  return g.live ? "Google reviews" : `${GOOGLE_RATING.count} Google reviews`;
}
