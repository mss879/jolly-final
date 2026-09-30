import { SUPABASE_URL } from "./supabase/config";

/* Recent-event photos live in a public Storage bucket, so each one has a
   stable URL. Shared by the Reviews page and the admin editor. Paths are
   "<event id>/<photo id>.jpg". */

export const EVENT_PHOTO_BUCKET = "event-photos";
export const EVENT_PHOTO_PATH = /^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(jpg|png|webp)$/;
export const MAX_EVENT_PHOTOS = 24;

export function eventPhotoUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${EVENT_PHOTO_BUCKET}/${path
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}
