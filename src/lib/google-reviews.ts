import "server-only";
import { GOOGLE_SNAPSHOT, SNAPSHOT_REVIEWS } from "./google-reviews-snapshot";

/* Reviews from the client's Google Business listing — "Jolly's Creamery
   Corporate office", 17 Polhengoda Terrace, Colombo 5 (the listing the client
   shared, Oct 2026). They are coded in, word for word, from a capture of the
   listing (google-reviews-snapshot.ts), with the reviewers' avatars and photos
   saved under public/images/reviews. Nothing is fetched from Google at run
   time. */

export type ShownReview = {
  key: string;
  name: string;
  photo: string | null; // the reviewer's profile picture
  initial: string;
  accent: string; // avatar tint when there is no photo
  rating: number;
  when: string; // "2 months ago"
  text: string;
  href: string | null; // the reviewer's reviews on Google
  subtitle: string | null;
  photos: { src: string; width: number; height: number }[]; // the reviewer's own photos
};

export type GoogleReviews = {
  rating: string; // "4.6"
  count: number;
  reviews: ShownReview[];
  listingUrl: string; // the reviews on Google Maps
  writeReviewUrl: string;
};

const ACCENTS = ["#B98E2F", "#32004B", "#7A5C2E", "#58267A", "#A0552E", "#2E5A46"];
const PLACE_ID = "ChIJiYSk3shb4joREBL9Bdq7NAI";
const LISTING_URL = `https://www.google.com/maps/place/?q=place_id:${PLACE_ID}`;
const WRITE_REVIEW_URL = `https://search.google.com/local/writereview?placeid=${PLACE_ID}`;

/* "2 months ago", the way Google words it, from the review's date. */
function timeAgo(iso: string) {
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return "";
  const days = Math.max(0, Math.floor((Date.now() - then) / 86_400_000));
  const fmt = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });
  if (days < 7) return fmt.format(-days, "day");
  if (days < 30) return fmt.format(-Math.floor(days / 7), "week");
  if (days < 365) return fmt.format(-Math.floor(days / 30), "month");
  return fmt.format(-Math.floor(days / 365), "year");
}

export async function getGoogleReviews(): Promise<GoogleReviews> {
  return {
    rating: GOOGLE_SNAPSHOT.rating,
    count: GOOGLE_SNAPSHOT.count,
    reviews: SNAPSHOT_REVIEWS.map((r, i) => ({
      key: r.id,
      name: r.name,
      photo: r.avatar,
      initial: r.name.charAt(0).toUpperCase(),
      accent: ACCENTS[i % ACCENTS.length],
      rating: r.rating,
      when: timeAgo(r.date),
      text: r.text,
      href: r.href,
      subtitle: r.localGuide ? "Local Guide" : null,
      photos: r.photos,
    })),
    listingUrl: LISTING_URL,
    writeReviewUrl: WRITE_REVIEW_URL,
  };
}

/* "155 Google reviews" */
export function reviewCountLabel(g: GoogleReviews) {
  return `${g.count.toLocaleString("en-GB")} Google review${g.count === 1 ? "" : "s"}`;
}

/* The homepage's few: five-star reviews about events and the cart come
   first (the business the homepage sells), the rest fill in after. */
export function featuredReviews(g: GoogleReviews, n = 3) {
  const aboutEvents = (r: ShownReview) =>
    r.rating === 5 && /\b(cart|event|wedding|party|birthday|celebration|function|guests)\b/i.test(r.text);
  return [...g.reviews.filter(aboutEvents), ...g.reviews.filter((r) => !aboutEvents(r))].slice(0, n);
}
