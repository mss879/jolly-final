# Mobile image audit

Updated 18 October 2026. Mobile image frames and section dimensions retain their original layout rules. Desktop images are untouched.

## Active images

| Placement | Mobile source | Fidelity |
| --- | --- | --- |
| Wedding hero | public/images/social/ig-bride-cart.jpg | Existing photograph; no synthesized cart or altered lettering. |
| 500 ml tubs hero | public/images/scenes/mobile/hero-tubs-500ml-mobile.webp | Built-in ImageGen portrait adaptation. |
| Home queue strip | public/images/scenes/scene-guests-queue.webp | Existing full source photo; mobile crop favors the cart and nearest guests. |
| About cart strip | public/images/carts/cart-lobby-cream.jpeg | Existing portrait photograph, fitted inside the same frame. |
| Brand Collaborations | public/images/scenes/mobile/hero-scoops-mobile.webp | Built-in ImageGen adaptation, inside the original 3:2 feature frame and 4:3 cards. |

The three generated cart variants from the first pass are superseded and were removed from public assets. In particular, the generated wedding image lost lettering from the badge. Existing cart photographs replace those drafts because generation alone cannot guarantee exact cart geometry or branding. Original photo files are reused directly, without image editing, stretching, mirrored parts or reconstructed branding.

Future cart imagery must preserve the approved source cart: bicycle/frame geometry and orientation, wheel count and proportions, fenders, saddle, body panels/vents, counter, canopy supports, light count and fittings, color/trim, flowers and the complete badge lettering. Use existing source photography when exact fidelity is required; do not publish a merely similar generated cart.

## Layout constraints

- Home hero: unchanged 100svh height with a 620px minimum.
- Home queue strip: unchanged 62vh mobile minimum; desktop 3:1.
- About strip: unchanged 72vh minimum. Only the image fit changes on phones, counteracting the existing zoom so the photographed bicycle fits; the frame stays fixed.
- Brand Collaborations feature: restored the original 3:2 frame on phones and desktop. The prior pass's 4:5 mobile override was removed from both the service list and detail page.
- Other service feature frames remain their original 4:5 or 3:2; teaser cards remain 4:3.
- No section padding, margins, grid spacing, typography, buttons or outer image sizing was changed by this correction.

Subsequent mobile refinements keep the same section sizes: the queue caption uses two fixed lines at 75% of its banner height, and hero controls below 768px use a single compact row (about 147×44px) with a smaller counter and three horizontal markers. Mobile slide targets remain 28×44px; desktop keeps its original counter, stacked markers and arrows. Browser checks at 320px, 390px, 640px and both sides of 768px verified layout and slide switching.

Variants switch below 768 CSS pixels; the existing Find Us At image keeps its original 1024px switch. Desktop source files, image positioning and overlays remain unchanged. Portrait file dimensions are independent of the rendered frame dimensions: the existing fixed frame controls layout.

Reviewed all 12 public routes: /, /about, /services, /services/weddings, /services/corporate, /services/private-parties, /services/brand-collaborations, /flavors, /reviews, /franchise, /reserve and /contact. Admin and internal preview pages are outside the customer-facing image audit.

## Verification

Section and aspect-ratio frame sizes were measured at actual 324px and 351px mobile widths and 1296px desktop, comparing the restored original layout before and after image source changes: 36 page views, 168 section measurements and 150 image-frame measurements, with zero differences. Additional production checks at 360px, 390px and 1440px confirmed the original hero height, 62vh/72vh banner sizes and 3:2 service frame, along with original desktop image selection. Browser measurement reports are saved with the preview screenshots. Production build (including TypeScript), ESLint and whitespace checks passed after this correction.

## Generation prompts and superseded cart drafts

### Wedding hero

Use case: compositing. Edit target: the supplied Jolly's wedding banner. Create a faithful PORTRAIT 1024x1792 mobile adaptation of exactly this scene, not a new campaign. Preserve the cream-and-gold bicycle ice cream cart, its purple Jolly's badge, three amber pendant lights, purple-capped host with glasses serving, bride in white on the right, basket of pale flowers, menu easel, nighttime garden ballroom and warm cinematic photo style. Remove the artificial blurred left margin. Recompose and extend vertically so the full cart, bicycle wheels, bride and canopy all fit comfortably inside the central 85% width, with realistic proportions. Place this entire scene in the LOWER 55% of the portrait; upper 45% should be a natural quiet softly lit cream drapery/ballroom area with low detail for existing website heading overlays. Do not bake any headline, CTA, UI, border or watermark into the image. Match the original people and cart as closely as possible; do not redesign equipment, uniform, branding or dress. Portrait image only.

Final wedding framing refinement (using the first portrait and original scene as references):

Use case: compositing. Image 1 is the portrait edit target, image 2 is the original scene reference for identity. Create a revised portrait mobile wedding photo with ONLY a framing change: pull the camera substantially farther back so the entire original cream-and-gold bicycle cart, both wheels, canopy, bride, host, flower basket and menu easel form ONE COMPACT scene in the lower half. The entire group MUST fit between x=23% and x=77% of the image, with no important element outside that central 54% horizontal safe area. Top of canopy at y=53%, floor/wheel bottoms and dress hem at y=85%. Fill surrounding margins naturally with the same ballroom, garden and drapery, not blur. Upper half quiet drapery. Preserve original people's identities, uniform, bride's dress, purple Jolly's badge, exactly three amber bulbs and original realistic warm evening lighting. This image will be cropped horizontally by a tall narrow phone hero and slowly zoomed; broad safety margins are mandatory. No added text, no UI, no watermark. Output portrait 9:16.

### Tubs hero

Use case: compositing. Edit target: the supplied Jolly's 500ml tubs desktop photograph. Make a faithful PORTRAIT 1024x1792 mobile adaptation, matching the cream marble with gold veins, burgundy tubs with cream typography, yellow passion fruit sorbet with seeds, chocolate ice cream textures, circular cream labels and lids. Recompose the arrangement vertically, retaining a mix of closed tubs, open tubs and a tipped tub with lids, no new products. The UPPER 40% should be quiet natural cream marble with very few details for existing website headline overlays. Arrange the recognizable tubs in the lower 60%, fully within the central 85% width so neither flavor is cropped on narrow phones. Preserve exact prominent label text 'Double Chocolate', 'Passion Fruit Sorbet', 'JOLLY’S CREAMERY' and 'You’re about to feel good'. Keep packaging design, scale and photographic lighting consistent with reference. Do not add any marketing headline, UI, border or watermark. Portrait image only.

### Lobby queue

Use case: compositing. Edit target: supplied wide Jolly's lobby queue photo. Make a faithful PORTRAIT 1024x1536 mobile photograph of the same scene, compactly recomposed rather than center cropped. Preserve the bright cream marble/glass hotel lobby, white and gold bicycle ice cream cart with purple Jolly's badge, three pendant bulbs, basket of pale flowers, white-shirted host in purple cap and guests wearing the original formal navy, cream and pale blue outfits. Frame the entire cart canopy, cart body and bicycle in the upper/middle left, host serving woman in navy, with a short queue of original guests receding diagonally toward the lower right. Show the cart clearly instead of only backs of guests. Pull the camera back enough that cart and queue both fit inside central 85% width with breathing room at top and bottom. Maintain original realistic photo style, people, clothing and daylight. No added headline, UI, border or watermark. Same scene and brand, portrait composition only.

### About cart

Use case: compositing. Edit target: supplied Jolly's white-and-gold cart in luxury hotel lobby banner. Make a faithful PORTRAIT 1024x1536 mobile adaptation of the exact same cart and lobby. Preserve the white bicycle cart's illuminated purple JOLLY’S CREAMERY badge, square white canopy and gold posts, white orchids in metal pots, gold wheel fenders, brown saddle, cream marble columns, ornate gilded capitals, balcony rail and golden late afternoon sun. Recompose by pulling camera back and extending lobby vertically: the WHOLE cart, canopy, bicycle and both wheels must fit inside central 75% width in the LOWER HALF of the portrait, leaving upper half natural quiet cream marble architecture for existing website text. Keep cart proportions, orientation and branding consistent with original. No people or extra objects, no added headline, UI, border or watermark. Match the original realistic luxury product photo exactly as closely as possible. Portrait image only.

Final About framing refinement (using the first portrait as reference):

Use case: compositing. Edit target: this portrait mobile Jolly's cart photograph. Change ONLY framing: zoom the camera out a little and move the COMPLETE cart, bicycle, canopy and both wheels LEFT so their combined bounding box is centered horizontally at 50% of the image, fully contained between 20% and 80% of image width. The cart assembly should remain in the lower half, top of canopy at 52% image height, wheels no lower than 88% image height. Preserve every cart detail, purple Jolly's badge, white orchids, marble and gilded hotel architecture, light and photo realism. Extend the same natural lobby where needed. No text or extra objects, no styling change. This safe center framing is essential because mobile background cover and parallax will crop 15% on each side. Portrait 2:3 image.

### Brand Collaborations scoops

Use case: compositing. Edit target: supplied photo of three ice cream scoops in cream gold-rimmed footed bowls on ivory satin. Create a faithful PORTRAIT 1024x1280 mobile adaptation of the same photograph. Preserve exactly three bowls: vanilla with crossed vanilla pods at rear left, chocolate at rear right and yellow passion fruit with black seeds in front center; antique gold spoon and scattered vanilla pods in foreground; same ivory satin, golden light and realistic food-photo styling. Arrange all three bowls compactly as a triangle in the CENTRAL 70% WIDTH and CENTRAL 55% HEIGHT, with generous clean satin margins on every side, so a center crop to a 4:3 card still retains all three entire bowls and scoops. No bowl or scoop cut off. Do not add tubs, text, branding, headline, extra scoops or watermark. Recompose and extend, do not stretch. Portrait 4:5 image only.
