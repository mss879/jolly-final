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
  email: "key.account@creamndairy.com",
  emailHref: "mailto:key.account@creamndairy.com",
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
    description: "Sharp, fragrant passion fruit, dairy-free and refreshing. The first to go in the heat.",
    image: "/images/flavors/passion-fruit-sorbet.png",
    category: "Sorbet",
    dairyFree: true,
  },
  {
    slug: "wild-naarang-sorbet",
    name: "Wild Naarang Sorbet",
    description: "Wild naarang, bright and citrusy. A burst of island orange in every spoonful.",
    image: "/images/flavors/wild-naarang-sorbet.png",
    category: "Sorbet",
    dairyFree: true,
  },
  {
    slug: "jaffna-mango",
    name: "Jaffna Mango",
    description: "Jaffna's Karutha Columban mango: floral, tart and sweet. The island in a scoop.",
    image: "/images/flavors/jaffna-mango.png",
    category: "Fruity",
  },
  {
    slug: "strawberry-cheesecake",
    name: "Strawberry Cheesecake",
    description: "Tangy cream-cheese ice cream folded with strawberry compote.",
    image: "/images/flavors/strawberry-cheesecake.png",
    category: "Fruity",
  },
  {
    slug: "blueberry",
    name: "Blueberry",
    description: "Blueberries, tart and creamy, made when the fruit is in season.",
    image: "/images/flavors/blueberry.png",
    category: "Fruity",
  },
  {
    slug: "bubblegum",
    name: "Bubblegum",
    description: "Blue, sweet and nostalgic. The flavour that makes grown-ups feel seven again.",
    image: "/images/flavors/bubblegum.png",
    category: "Classic",
  },
  {
    slug: "coconut",
    name: "Coconut",
    description: "Coconut milk and fresh cream, with a little desiccated coconut for texture.",
    image: "/images/flavors/coconut.png",
    category: "Classic",
  },
  {
    slug: "french-vanilla",
    name: "French Vanilla",
    description: "Floral vanilla and crème anglaise. Extra creamy, yet light.",
    image: "/images/flavors/french-vanilla.png",
    category: "Classic",
  },
  {
    slug: "cookies-and-cream",
    name: "Cookies & Cream",
    description: "Silky vanilla with crunchy cookie pieces. Indulgence in every bite.",
    image: "/images/flavors/cookies-and-cream.png",
    category: "Classic",
  },
  {
    slug: "salted-caramel-peanuts",
    name: "Salted Caramel & Peanuts",
    description: "Burnt-sugar caramel, roasted peanuts and a hint of salt. The grown-ups' favourite.",
    image: "/images/flavors/salted-caramel-peanuts.png",
    category: "Classic",
  },
  {
    slug: "milk-toffee",
    name: "Milk Toffee",
    description: "The buttery sweetness of milk toffee, with caramelised sugar and condensed milk.",
    image: "/images/flavors/milk-toffee.png",
    category: "Classic",
  },
  {
    slug: "amber-coffee-caramel",
    name: "Amber Coffee & Caramel",
    description: "Aromatic amber coffee and rich caramel. Delicate, yet creamy.",
    image: "/images/flavors/amber-coffee-caramel.png",
    category: "Classic",
  },
  {
    slug: "double-chocolate",
    name: "Double Chocolate",
    description: "Deep cocoa, twice over. Rich, smooth and unhurried.",
    image: "/images/flavors/double-chocolate.png",
    category: "Chocolate",
  },
  {
    slug: "swiss-chocolate",
    name: "Swiss Chocolate",
    description: "Swiss-style chocolate with African cocoa and sweet cream.",
    image: "/images/flavors/swiss-chocolate.png",
    category: "Chocolate",
  },
  {
    slug: "flavour-of-the-month",
    name: "Flavour of the Month",
    description:
      "A playful twist on rare, unexpected ingredients. A one-of-a-kind scoop that changes every month.",
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

export type Review = {
  name: string;
  initial: string;
  event: string;
  rating: number;
  timeAgo: string;
  text: string;
  accent: string; // avatar tint
};

/* ⚠️ PLACEHOLDER REVIEWS — replace with the client's real Google
   reviews (Google Business Profile → Reviews) before launch. The
   layout, rating maths and Google styling are production-ready. */
export const REVIEWS: Review[] = [
  {
    name: "Shenali Perera",
    initial: "S",
    event: "Wedding · Colombo",
    rating: 5,
    timeAgo: "2 months ago",
    text: "The cream and gold cart looked like it was designed for our wedding. Guests are still talking about the Jaffna Mango.",
    accent: "#B98E2F",
  },
  {
    name: "Dinesh Fernando",
    initial: "D",
    event: "Corporate Gala · Colombo",
    rating: 5,
    timeAgo: "3 weeks ago",
    text: "Arrived early, matched the ballroom, served 300 guests without a queue. Easy from booking to the last scoop.",
    accent: "#32004B",
  },
  {
    name: "Amaya Wickramasinghe",
    initial: "A",
    event: "Private Party · Colombo 07",
    rating: 5,
    timeAgo: "1 month ago",
    text: "Every detail considered: the flavours, the cart, the host. The salted caramel and peanuts went first.",
    accent: "#7A5C2E",
  },
  {
    name: "Ravi Jayawardena",
    initial: "R",
    event: "Brand Activation · Colombo",
    rating: 5,
    timeAgo: "2 months ago",
    text: "We booked the cart for a launch and it became the busiest corner of the room. The sorbets were a hit in the heat.",
    accent: "#58267A",
  },
  {
    name: "Natasha de Silva",
    initial: "N",
    event: "Beach Wedding · South Coast",
    rating: 5,
    timeAgo: "5 months ago",
    text: "They set up on the sand at golden hour. Passion fruit sorbet with that view. Our guests called it the highlight.",
    accent: "#A0552E",
  },
  {
    name: "Michael Peiris",
    initial: "M",
    event: "Anniversary · Colombo",
    rating: 5,
    timeAgo: "3 months ago",
    text: "Understated and done properly. A beautiful cart, a warm host, and a team that cared about the evening.",
    accent: "#2E5A46",
  },
];

/* The listing's own figures (4.5 from 149 reviews, 1 Oct 2026) — shown in the
   headline stats and wherever Google's live answer is not available. */
export const GOOGLE_RATING = {
  score: "4.5",
  count: "140+",
};

export type Service = {
  slug: string;
  title: string;
  blurb: string;
  description: string;
  image: string;
  imagePortrait?: boolean; // portrait photo → 4:5 frame on the Services page
  points: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "weddings",
    title: "Weddings",
    blurb: "The moment guests talk about on the way home.",
    description:
      "Your cart arrives styled to your palette, in Vanilla Cream, Bubblegum Blue or Ferrari Red, and our host scoops live between the vows and the dancing. Guests gather, photos happen, and dessert becomes a moment rather than a course.",
    // Real photo from the client's Instagram (16 Jun 2026) — see public/images/social/CREDITS.md
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
    blurb: "Launches, galas and conferences. A reason to gather between the speeches.",
    description:
      "Between the speeches and the networking, the cart is where people end up. We serve at scale without queues, and every scoop still comes with a word from our host.",
    // CLIENT PHOTO: swap for the blue cart + staff-uniform photo when received
    image: "/images/scenes/scene-corporate.jpg",
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
    blurb: "Birthdays, anniversaries and garden parties. The corner everyone drifts to.",
    description:
      "The cart arrives styled, chilled and ready, and becomes the centre of the party. Bubblegum for the children, salted caramel for the grown-ups, dairy-free sorbets for everyone, and it usually runs out before the cake.",
    image: "/images/scenes/scene-party.jpg",
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
    blurb: "Your brand on the cart, your flavour in the scoop.",
    description:
      "Put your brand on the most photographed corner of the room. We co-brand the cart and can develop a signature or limited-edition flavour. Launches, pop-ups and partner activations, content-ready from the first scoop.",
    // CLIENT PHOTO: replace with the G2 brand-collaboration photo when received
    image: "/images/scenes/hero-scoops.jpg",
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
    image: "/images/carts/cart-bubblegum-blue.jpg",
    alt: "Bubblegum Blue Jolly's cart with its host under string lights on a terrace",
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
    formImage: "/red-cart.png",
  },
];

/* ─── Hero slides ─────────────────────────────────────────────── */

export type HeroSlide = {
  key: string;
  badge?: string; // small pill above the headline, e.g. "New" / "Coming Soon"
  line1: string;
  line2: string;
  copy: string;
  cta: { href: string; label: string };
  cta2: { href: string; label: string };
  image: string;
  alt: string;
  objectPos: string;
};

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
    alt: "A bride at the Vanilla Cream Jolly's cart at night, its host scooping under pendant lights",
    objectPos: "object-right",
  },
  {
    key: "flavours",
    line1: "Curated flavours",
    line2: "for special occasions",
    copy: "Fresh, seasonal ice creams and dairy-free creamy sorbets, somewhere between gelato and ice cream, chosen with you for the occasion.",
    cta: { href: "/flavors", label: "Explore Flavours" },
    cta2: CTA,
    image: "/images/scenes/hero-flavour-banner.jpg",
    alt: "Ice cream scoops in gold-rimmed porcelain coupes on cream silk",
    objectPos: "object-[70%_center]",
  },
  {
    key: "at-home",
    badge: "Coming Soon",
    // PLACEHOLDER — client is sending the tub-launch copy and a "tub moment" visual
    line1: "The same feeling,",
    line2: "soon at home",
    copy: "The scoops your guests queue for, soon in a 500 ml tub for your own sofa. Be the first to know.",
    cta: { href: "/reserve?type=at-home", label: "Be First to Know" },
    cta2: { href: "/flavors", label: "Explore Flavours" },
    // PLACEHOLDER image — swap for the client's lifestyle shot (people sharing a tub, brand colours)
    image: "/images/scenes/scene-party.jpg",
    alt: "Cups of pastel ice cream with gold spoons at a celebration",
    objectPos: "object-[60%_center]",
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
    t: "Every guest gets a scoop",
    c: "Ice creams and dairy-free sorbets, served live by our host, so nobody at the table is left out.",
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
