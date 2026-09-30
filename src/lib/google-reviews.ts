import "server-only";
import { GOOGLE_RATING, REVIEWS } from "./data";

/* Live reviews from the client's Google Business listing, through the
   Places API (New). Set in .env.local / hosting (see .env.example):
     GOOGLE_PLACES_API_KEY   server-only key, restricted to the Places API
     GOOGLE_PLACE_ID         the listing's Place ID
   Google returns the overall rating, the review count and at most five
   reviews, chosen by Google ("most relevant"). The answer is cached for six
   hours, so the API is called a few times a day rather than per visit. */

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
const SEARCH_URL = "https://www.google.com/search?q=Jolly%27s+Creamery+reviews";

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
    listingUrl: SEARCH_URL,
    writeReviewUrl: SEARCH_URL,
  };
}

export const googleReviewsConfigured = Boolean(process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACE_ID);

/* Never throws. Before the key is set, the placeholder reviews stand in so
   the pages can be previewed. Once it is set, a failed call shows no review
   cards (never the placeholders) until Google answers again. */
export async function getGoogleReviews(): Promise<GoogleReviews> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return placeholders();

  const failed: GoogleReviews = { ...placeholders(), live: true, count: null, reviews: [] };

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`, {
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
      googleUrl(place.googleMapsLinks?.reviewsUri) ?? googleUrl(place.googleMapsUri) ?? SEARCH_URL;
    return {
      live: true,
      rating: typeof place.rating === "number" ? place.rating.toFixed(1) : GOOGLE_RATING.score,
      count: typeof place.userRatingCount === "number" ? place.userRatingCount : null,
      reviews,
      listingUrl,
      writeReviewUrl: googleUrl(place.googleMapsLinks?.writeAReviewUri) ?? listingUrl,
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
