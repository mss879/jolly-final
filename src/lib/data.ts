/* Central content store for Jolly's Creamery.
   Venue list and contact details are sourced from jollyscreamery.com
   (Mar 2024 / Jun 2025 content). The cart line-up follows the client's
   "Jolly's on Wheels" brochure (Sept 2026); the flavours follow their
   "Our Flavours" sheet (2026). */

export const CONTACT = {
  phone: "+94 707 222 511",
  phoneHref: "tel:+94707222511",
  phone2: "+94 705 336 452",
  phone2Href: "tel:+94705336452",
  whatsappHref: "https://wa.me/94707222511",
  email: "eventsteam@creamndairy.com",
  emailHref: "mailto:eventsteam@creamndairy.com",
  facebook: "https://www.facebook.com/Jollyscreamery",
  instagram: "https://www.instagram.com/jollys_creamery/",
  tiktok: "https://www.tiktok.com/@jollyscreamery",
  linkedin: "https://www.linkedin.com/company/jollyscreamery/",
  tagline: "You're about to feel good",
};

export type Flavor = {
  slug: string;
  name: string;
  description: string;
  image: string;
  category: "Sorbet" | "Chocolate" | "Fruity" | "Classic" | "Seasonal";
  dairyFree?: boolean;
};

/* Order of the client's "Our Flavours" sheet (2026) — the first three also
   lead the Home flavour preview. Scoop photos are cut from that sheet. */
export const FLAVORS: Flavor[] = [
  {
    // Client: "Passion Fruit" without "Creamy"
    slug: "passion-fruit-sorbet",
    name: "Passion Fruit Sorbet",
    description: "Intensely fruity and refreshing, the passion fruit creamy sorbet is a tropical delight.",
    image: "/images/flavors/passion-fruit-sorbet.png",
    category: "Sorbet",
    dairyFree: true,
  },
  {
    slug: "wild-naarang-sorbet",
    name: "Wild Naarang Sorbet",
    description: "A delightful treat that delivers a vibrant burst of citrusy flavor with every spoonful",
    image: "/images/flavors/wild-naarang-sorbet.png",
    category: "Sorbet",
    dairyFree: true,
  },
  {
    slug: "jaffna-mango",
    name: "Jaffna Mango",
    description: "Floral, tart and sweet Jaffna Karutha Columban treat for the summer days",
    image: "/images/flavors/jaffna-mango.png",
    category: "Fruity",
  },
  {
    slug: "strawberry-cheesecake",
    name: "Strawberry Cheesecake",
    description: "A creamy and tangy dessert topped with luscious strawberry compote.",
    image: "/images/flavors/strawberry-cheesecake.png",
    category: "Fruity",
  },
  {
    slug: "blueberry",
    name: "Blueberry",
    description: "A delightful treat that delivers a vibrant burst of citrusy flavor with every spoonful",
    image: "/images/flavors/blueberry.png",
    category: "Fruity",
  },
  {
    slug: "bubblegum",
    name: "Bubblegum",
    description: "As the name says, a flavour that would make you feel like a kid again. It's a promise!",
    image: "/images/flavors/bubblegum.png",
    category: "Classic",
  },
  {
    slug: "coconut",
    name: "Coconut",
    description: "Versatile coconut milk and dairy, with creaminess and desiccated coconut texture.",
    image: "/images/flavors/coconut.png",
    category: "Classic",
  },
  {
    slug: "french-vanilla",
    name: "French Vanilla",
    description: "Floral vanilla and crème anglaise ice cream, a delightful blend that's extra creamy yet light",
    image: "/images/flavors/french-vanilla.png",
    category: "Classic",
  },
  {
    slug: "cookies-and-cream",
    name: "Cookies & Cream",
    description: "Silky smooth vanilla paired with crunchy cookie surprises. Indulgence in every bite.",
    image: "/images/flavors/cookies-and-cream.png",
    category: "Classic",
  },
  {
    slug: "salted-caramel-peanuts",
    name: "Salted Caramel & Peanuts",
    description: "A burnt sugar ice cream with a rich, velvety blend of creamy notes and a hint of salt",
    image: "/images/flavors/salted-caramel-peanuts.png",
    category: "Classic",
  },
  {
    slug: "milk-toffee",
    name: "Milk Toffee",
    description: "The buttery sweetness of traditional milk toffee with hints of caramelised sugar and condensed milk.",
    image: "/images/flavors/milk-toffee.png",
    category: "Classic",
  },
  {
    slug: "amber-coffee-caramel",
    name: "Amber Coffee & Caramel",
    description: "Rich caramel and aromatic amber coffee, a delicate yet creamy blend.",
    image: "/images/flavors/amber-coffee-caramel.png",
    category: "Classic",
  },
  {
    slug: "double-chocolate",
    name: "Double Chocolate",
    description: "A decadent cocoa delight that transforms each scoop into a moment of pure bliss.",
    image: "/images/flavors/double-chocolate.png",
    category: "Chocolate",
  },
  {
    slug: "swiss-chocolate",
    name: "Swiss Chocolate",
    description: "Swiss-inspired chocolate crafted with rich African cocoa and sweet cream",
    image: "/images/flavors/swiss-chocolate.png",
    category: "Chocolate",
  },
  {
    slug: "flavour-of-the-month",
    name: "Flavour of the Month",
    description: "A twist on unique and unconventional ingredients, offering a one-of-a-kind treat you won't want to miss.",
    image: "/images/flavors/flavour-of-the-month.png",
    category: "Seasonal",
  },
];

/* Partner venues — kept for reference only. The client prefers NOT to
   list venues publicly (some are franchise/hotel-run carts without a
   permanent server). Public copy uses FIND_US instead. */
export const VENUES = {
  "Hotels & Resorts": [
    "Shangri-La Colombo",
    "Hilton Colombo",
    "Marriott",
    "Sheraton",
    "Radisson Blu",
    "Taj Samudra",
    "Cinnamon Grand",
    "Cinnamon Lakeside",
    "Amaya Lake Dambulla",
    "Hikka Tranz",
    "Sheraton Kosgoda",
    "Radh Kandy",
  ],
  "Restaurants & Cafés": [
    "Café J",
    "COCO Kitchen",
    "Curry Club",
    "Okra",
    "Tea Bush Ramboda",
    "Yara Galle Fort",
    "Mia Mia Café",
    "PAINKILLER",
    "Cafe Lunka",
    "Spoons",
    "Loon Tao",
  ],
  "Attractions & Landmarks": [
    "Lotus Tower",
    "Excel World",
    "Ella Gap",
    "Art Gallery Unawatuna",
    "Nisaco Mall",
    "360 Polhena",
    "360 Udawalawa",
  ],
} as const;

export const ALL_VENUES = Object.values(VENUES).flat();

/* The listing's own figures (4.6 from 155 reviews, 16 Oct 2026, the same
   capture as src/lib/google-reviews-snapshot.ts) — shown in the headline
   stats and wherever Google's live answer is not available. */
export const GOOGLE_RATING = {
  score: "4.6",
  count: "155",
};

export type Service = {
  slug: string;
  title: string;
  blurb: string;
  description: string;
  image: string;
  mobileImage?: string;
  imagePortrait?: boolean; // portrait photo → 4:5 frame on the Services page
  imagePosition?: string; // object-position class for cropped frames, e.g. "object-[50%_35%]"
  points: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "weddings",
    title: "Weddings",
    blurb: "Styled to your palette, the moment guests talk about on the way home.",
    description:
      "Your cart arrives styled to your palette, in Vanilla Cream, Bubblegum Blue or Ferrari Red, and our host scoops live between the vows and the dancing. Guests gather, photos happen, and dessert becomes a moment rather than a course.",
    // Real photo from the client's Instagram (16 Jun 2026) — see docs/image-credits.md
    image: "/images/social/ig-bride-cart.jpg",
    imagePortrait: true,
    points: [
      "Cart styling matched to your wedding palette",
      "Ice creams and dairy-free sorbets, chosen with you",
      "Served live by our uniformed host",
      "Indoor and outdoor, island-wide",
    ],
  },
  {
    slug: "corporate",
    title: "Corporate Events",
    blurb: "Launches, galas and conferences. The break everyone looks forward to.",
    description:
      "Between the speeches and the networking, the cart is where people end up. We serve at scale without queues, and every scoop still comes with a word from our host.",
    // Photo supplied by the client, 13 Oct 2026 (replaces scene-corporate-office.webp)
    image: "/images/scenes/scene-corporate-cheers.webp",
    points: [
      "High-volume service without queues",
      "Branded cups and signage on request",
      "Permanent carts at Shangri-La Colombo and Hilton Colombo",
      "Full set-up, service and pack-down handled",
    ],
  },
  {
    slug: "private-parties",
    title: "Private Parties",
    blurb: "Birthdays, anniversaries and garden parties. The corner everyone loves.",
    description:
      "The cart arrives styled, chilled and ready, and becomes the centre of the party. Bubblegum for the children, salted caramel for the grown-ups, dairy-free sorbets for everyone, and it usually runs out before the cake.",
    // Photo supplied by the client, 13 Oct 2026 (replaces scene-party.jpg).
    // Portrait: crop a little above centre so the parents' faces stay in.
    image: "/images/scenes/scene-private-party-family.webp",
    imagePortrait: true,
    imagePosition: "object-[50%_35%]",
    points: [
      "Flexible packages for 30–300 guests", // CLIENT: confirm guest range
      "Children's favourites and dairy-free sorbets",
      "Styled to your theme and venue",
      "Set-up, service and pack-down handled",
    ],
  },
  {
    slug: "brand-collaborations",
    title: "Brand Collaborations",
    blurb: "Your brand on the cart and a signature flavour in every scoop served.",
    description:
      "Put your brand on the most photographed corner of the room. We co-brand the cart and can develop a signature or limited-edition flavour. Launches, pop-ups and partner activations, content-ready from the first scoop.",
    // CLIENT PHOTO: replace with the G2 brand-collaboration photo when received
    image: "/images/scenes/hero-scoops.jpg",
    mobileImage: "/images/scenes/mobile/hero-scoops-mobile.webp",
    points: [
      "Co-branded cart styling and signage",
      "Custom or limited-edition flavour development",
      "Sampling, launches and pop-up activations",
      "Content-ready moments for social",
    ],
  },
];

/* Each service has its own page at /services/<slug>. */
export const serviceHref = (slug: string) => `/services/${slug}`;

/* How a booking runs — on the Services page and every service page. */
export const HOW_IT_WORKS = [
  ["Tell us about your event", "Date, venue, guest count and the feeling you want to create."],
  ["We style your cart", "Cart colour and flavour menu chosen with you, to match your palette."],
  ["We arrive and set the scene", "Fully chilled, fully staffed, before your first guest walks in."],
  ["Guests feel good", "Live scoops, a smiling host, and the room finds its mood."],
] as const;

/* ─── Brand constants ─────────────────────────────────────────── */

/* The smiley is part of the tagline wherever it is rendered (preloader,
   hero watermark, footer). Never put it inside <title>/metadata. */
export const SMILEY = "😊";

/* Single source for the primary call-to-action label. */
export const CTA = { label: "Reserve Your Event", href: "/reserve" } as const;

/* Location credibility — the client prefers two anchor names plus a count
   over a full venue list. (The announcement bar above the header was
   removed at the client's request, Sept 2026.) */
export const FIND_US = {
  anchors: ["Shangri-La Colombo", "Hilton Colombo"],
  line: "Find us at Shangri-La Colombo and Hilton Colombo, and at 30+ locations from Colombo down south.",
} as const;

/* Venue logos on the "Find Us At" hero slide, in the order of the client's
   banner (13 Oct 2026). Cut out of that banner onto a transparent ground:
   every file is the same 324×272 box, so the logos keep the relative sizes
   the banner gave them. */
export type PartnerLogo = { name: string; src: string };

export const PARTNER_LOGOS: PartnerLogo[] = [
  { name: "Shangri-La Colombo", src: "/images/partners/shangri-la-colombo.png" },
  { name: "Taj Samudra Colombo", src: "/images/partners/taj-samudra.png" },
  { name: "Hilton Colombo", src: "/images/partners/hilton-colombo.png" },
  { name: "Tito's", src: "/images/partners/titos.png" },
  { name: "Sheraton Colombo", src: "/images/partners/sheraton-colombo.png" },
  { name: "Ramada by Wyndham Colombo", src: "/images/partners/ramada-colombo.png" },
  { name: "Marriott Resort Weligama Bay", src: "/images/partners/marriott-weligama-bay.png" },
  { name: "Cinnamon Lakeside Colombo", src: "/images/partners/cinnamon-lakeside.png" },
];

/* Headline stats — no flavour counts (client: "a very basic way of promoting"). */
export const STATS = [
  ["32", "Partner locations"],
  [`${GOOGLE_RATING.score}★`, "Google rating"],
  ["3", "Cart colours"],
] as const;

/* Floating badge on the Home statement image. 500+ is from the client's own
   Instagram bio ("500+ Events Covered"). CLIENT: confirm before launch. */
export const BADGE_STAT = ["500+", "Events served"] as const;

/* Footer brand line. */
export const BRAND_BLURB =
  "Styled ice cream carts with a live host. Feel-good moments at weddings, corporate events and private parties across Sri Lanka.";

/* The client's own words, from their 16 June 2026 Instagram post — used as
   the About-page pull-quote. */
export const IG_QUOTE = {
  text: "People don't gather around an ice cream cart for the ice cream alone. They gather because it feels easy.",
  source: "@jollys_creamery, June 2026",
};

/* ─── Carts ───────────────────────────────────────────────────── */

export type CartKey = "cream" | "bubblegum-blue" | "ferrari-red";
export type Cart = {
  key: CartKey;
  name: string;
  swatch: string; // hex for the colour picker
  image: string;
  alt: string;
  copy: string;
  occasion: string; // where it suits best, shown beside the colour in the reserve form
  formImage: string; // the reserve form's preview, each cart in a marble hotel lobby
  formAlt?: string; // when the form photo isn't the usual cart-with-a-bicycle shot
};

/* Names and photos from the client's brochure. Order = order on the site and
   in the booking form (the first is preselected). The photos are AI renders
   with the generator's corner mark cropped out — swap in real shoots when
   the client has them. */
export const CARTS: Cart[] = [
  {
    key: "cream",
    name: "Vanilla Cream",
    swatch: "#F1E6C4",
    image: "/images/carts/cart-cream.jpg",
    alt: "Vanilla Cream Jolly's cart with a vintage bicycle, parasol and glowing lights in an evening garden",
    copy: "Vanilla cream and gold under glowing lights, at home in wedding halls, gardens and five-star lobbies.",
    occasion: "Weddings and ballrooms",
    // Lobby photo supplied by the client, 1 Oct 2026
    formImage: "/images/carts/form-vanilla-cream.webp",
  },
  {
    key: "bubblegum-blue",
    name: "Bubblegum Blue",
    swatch: "#5CB8C9",
    // Photo supplied by the client, 5 Oct 2026
    image: "/images/carts/cart-bubblegum-blue-lobby.webp",
    alt: "Bubblegum Blue Jolly's cart with a blue bicycle and flower basket under the arches of a hotel lobby",
    copy: "A playful blue with a vintage bicycle, made for garden parties, terraces and relaxed celebrations.",
    occasion: "Gardens and parties",
    formImage: "/blue-cart.png",
  },
  {
    key: "ferrari-red",
    name: "Ferrari Red",
    swatch: "#C0141F",
    // Photo supplied by the client, 1 Oct 2026
    image: "/images/carts/cart-ferrari-red-ballroom.webp",
    alt: "Ferrari Red Jolly's cart with a red bicycle and flower basket in a curtained hotel ballroom",
    copy: "A bold statement piece for galas, festive seasons and grand celebrations.",
    occasion: "Galas and grand celebrations",
    // Photo supplied by the client, 16 Oct 2026 (the same shot as the hero's
    // phone background, kept as its own file)
    formImage: "/images/carts/form-ferrari-red.webp",
    formAlt: "Ferrari Red Jolly's cart with three pendant lights in a hotel lobby",
  },
];

/* ─── Hero slides ─────────────────────────────────────────────── */

export type HeroSlide = {
  key: string;
  image: string;
  // Portrait art direction. Existing venue art switches at 1024px;
  // other phone variants opt into 768px to preserve tablet/desktop art.
  mobileImage?: string;
  mobileBreakpoint?: number;
  alt: string;
  objectPos: string;
} & (
  | {
      imageOnly?: false;
      badge?: string; // small pill above the headline, e.g. "New" / "Coming Soon"
      line1: string;
      line2: string;
      copy: string;
      cta: { href: string; label: string };
      cta2: { href: string; label: string };
    }
  // A finished banner with its own lettering: shown whole, with no headline,
  // buttons, cream veil or slow zoom over it.
  | { imageOnly: true }
  // A photo with a heading and venue logos, in white tiles, coded over it.
  | { imageOnly?: false; heading: string; logos: PartnerLogo[] }
);

/* Array order = display order. To promote a launch or an offer, move its
   slide to index 0 — it becomes the first (preloaded) slide. */
export const HERO_SLIDES: HeroSlide[] = [
  {
    key: "moments",
    // CLIENT: pick one — alternatives are in the Copy Rationale doc
    //   "Creating feel-good moments / at every event" · "Your event is about to / feel good" · "The moment / everyone remembers"
    line1: "The happiest corner",
    line2: "of your event",
    copy: "One styled cart, one host, live scoops, and your wedding, corporate event or party ends on its happiest note.",
    cta: CTA,
    cta2: { href: "/services", label: "Explore Services" },
    // Wedding hero supplied 1 Oct 2026 (replaces public/jollys-wedding-hero.png).
    // The photo is 4:3, so the file adds a blurred margin on the left — hidden
    // under the cream veil — to seat the cart to the right of the headline.
    image: "/images/scenes/hero-wedding-evening-wide.webp",
    // Use the existing photograph: cart construction and badge must stay exact.
    mobileImage: "/images/social/ig-bride-cart.jpg",
    mobileBreakpoint: 768,
    alt: "A bride at the Vanilla Cream Jolly's cart at night, its host scooping under pendant lights",
    objectPos: "object-center md:object-right",
  },
  {
    key: "find-us",
    heading: "Find Us At",
    logos: PARTNER_LOGOS,
    // Backgrounds supplied by the client, 15 Oct 2026. The logos and heading
    // are coded on top (they used to be baked into hero-find-us-at.webp).
    image: "/images/scenes/hero-find-us-desktop.webp",
    mobileImage: "/images/scenes/hero-find-us-mobile.webp",
    alt: "A red Jolly's cart with pendant lights beside Café Kai in a hotel lobby",
    objectPos: "object-right",
  },
  {
    key: "at-home",
    badge: "Coming Soon",
    // 500 ml tubs, 5 Oct 2026
    line1: "Feel good at home,",
    line2: "500 ml at a time",
    copy: "The scoops your guests queue for, soon in 500 ml tubs for your own freezer. Fresh, seasonal and ready when you are.",
    cta: { href: "/reserve?type=at-home", label: "Be First to Know" },
    cta2: { href: "/flavors", label: "Explore Flavours" },
    // Tub visual supplied by the client, 5 Oct 2026
    image: "/images/scenes/hero-tubs-500ml.webp",
    mobileImage: "/images/scenes/mobile/hero-tubs-500ml-mobile.webp",
    mobileBreakpoint: 768,
    alt: "Jolly's 500 ml tubs of Double Chocolate and Passion Fruit Sorbet, lids off, on a marble counter",
    objectPos: "object-center",
  },
];

/* ─── Why an ice cream cart — three reasons ───────────────────── */

export const REASONS = [
  {
    n: "01",
    t: "It sets the mood",
    c: "The cart arrives and the room lifts. Guests gather, phones come out, and the party finds its rhythm.",
  },
  {
    n: "02",
    t: "Themed to your décor",
    c: "Vanilla Cream, Bubblegum Blue or Ferrari Red: a cart colour that sits naturally with your palette, florals and venue.",
  },
  {
    n: "03",
    t: "It brings guests together",
    c: "More than dessert, the cart becomes a natural gathering point where guests meet, connect and share a moment.",
  },
] as const;

/* ─── Enquiry form ────────────────────────────────────────────── */

export const EVENT_TYPES = [
  "Wedding",
  "Corporate Event",
  "Private Party",
  "Brand Collaboration",
  "Franchise / Venue Enquiry",
  "Jolly's at Home (tubs)",
  "Other",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

/* `?type=` query values (service slugs plus a few extras) → form option. */
export const EVENT_TYPE_PARAM: Record<string, EventType> = {
  weddings: "Wedding",
  corporate: "Corporate Event",
  "private-parties": "Private Party",
  "brand-collaborations": "Brand Collaboration",
  franchise: "Franchise / Venue Enquiry",
  "at-home": "Jolly's at Home (tubs)",
};

/* ─── Franchise & venue partnerships (footer-only page) ───────── */

// CLIENT: confirm commercial terms and wording before launch
export const FRANCHISE = {
  kicker: "Franchise & Venue Partnerships",
  intro:
    "Thirty-two hotels, cafés and attractions host a Jolly's cart, from Shangri-La Colombo and Hilton Colombo down the south coast. Each one is placed, stocked and looked after by our team.",
  points: [
    "32 active locations, Colombo to down south",
    "Cart colour matched to your property",
    "Stock, staffing and maintenance by our team",
    "Revenue-share and rental models",
  ],
  models: [
    {
      t: "Revenue-share",
      c: "We place, stock and service the cart at your venue; you earn a share of every scoop with no upfront cost.",
    },
    {
      t: "Rental",
      c: "A fixed monthly rental for a branded, fully serviced Jolly's cart. Ideal for hotels and attractions that want a permanent feature.",
    },
  ],
} as const;

/* ─── Navigation ──────────────────────────────────────────────── */

export type NavItem = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

/* Order agreed with the client: Home → Reviews → About →
   Services (dropdown) → Flavours → Contact. Franchise lives in the footer. */
export const NAV: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
  {
    href: "/services",
    label: "Services",
    // CLIENT: exact service names + one-line descriptions to follow
    children: SERVICES.map((s) => ({ href: serviceHref(s.slug), label: s.title })),
  },
  { href: "/flavors", label: "Flavours" },
  { href: "/contact", label: "Contact" },
];

/* Footer is a multi-column layout: one list per column. */
export const FOOTER_LINKS = {
  Explore: [
    { href: "/", label: "Home" },
    { href: "/about", label: "Our Story" },
    { href: "/reviews", label: "Reviews" },
    { href: "/flavors", label: "Flavours" },
    { href: "/reserve", label: "Reserve Your Event" },
    { href: "/contact", label: "Contact" },
  ],
  Services: [
    ...SERVICES.map((s) => ({ href: serviceHref(s.slug), label: s.title })),
    { href: "/franchise", label: "Franchise & Venues" },
  ],
};
