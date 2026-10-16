/* Google reviews of "Jolly's Creamery Corporate office" (the listing the client
   shared), captured 16 Oct 2026: all 155 of them, star-only ratings included, in
   Google's "most relevant" order, unedited. Avatars and review photos are saved
   under public/images/reviews. Dates are worked back from Google's "5 months ago",
   so they are accurate to the month. Generated from the capture; to refresh,
   capture the listing again rather than editing by hand. */

export type SnapshotReview = {
  id: string;
  name: string;
  localGuide: boolean;
  avatar: string | null;
  rating: number;
  date: string; // ISO, approximate
  text: string; // empty for a star-only rating
  photos: { src: string; width: number; height: number }[];
  href: string | null; // the reviewer's reviews on Google
};

/* The listing's own totals on the capture date, all ratings included. */
export const GOOGLE_SNAPSHOT = { rating: "4.6", count: 155, capturedAt: "2026-10-16" } as const;

export const SNAPSHOT_REVIEWS: SnapshotReview[] = [
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2t4MWNtOUhRekF5WkVWUVptNUdPSGM0ZGpSSlEyYxAB",
    "name": "Mahesha Alwis",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/mahesha-alwis.webp",
    "rating": 5,
    "date": "2026-05-16",
    "text": "Absolutely loved Jolly’s ice cream cart at my son’s birthday! Great variety, friendly service, and it was a huge hit with all guests. Highly recommend!",
    "photos": [
      {
        "src": "/images/reviews/photos/mahesha-alwis-1.webp",
        "width": 1050,
        "height": 1400
      },
      {
        "src": "/images/reviews/photos/mahesha-alwis-2.webp",
        "width": 1050,
        "height": 1400
      }
    ],
    "href": "https://www.google.com/maps/contrib/108404738132085822928/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT25kcVFtUjFabTlmY2paeFp6SlpTVFJoV1ROb2JGRRAB",
    "name": "Aqeelah lahir",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/aqeelah-lahir.webp",
    "rating": 5,
    "date": "2026-08-16",
    "text": "I'm glad we decided to set up this cute ice cream truck from jolley's creamery for my mehendi and nikah function. It was such a cute addition and everyone went absolute bonkers with it. Without a hesitation i could recommend this place. From the beginning till the end they assisted me with all my inquiries and requests. Especially Bisandi was really accommodating and friendly throughout the process. I also got a taste testing session with them to select the flavours of the ice cream we wanted and I absolutely enjoyed most of their flavours 😊 😘. I might definitely keep coming back for other parties too. Thank you much ❤️",
    "photos": [
      {
        "src": "/images/reviews/photos/aqeelah-lahir-1.webp",
        "width": 1050,
        "height": 1400
      }
    ],
    "href": "https://www.google.com/maps/contrib/114736048805523568660/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT210S1VtMVdiekJsV1hFeFpYUkZlazFKUWtkUWVrRRAB",
    "name": "Rajanthie Jayasinghe",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/rajanthie-jayasinghe.webp",
    "rating": 5,
    "date": "2026-06-16",
    "text": "Placed an order for 4 tubs of ice cream and withina couple of hours they were delivered to my doorstep. Order was handled by a very attentive lady by the name Bisandi who took all the information required in one go. Even asked if I needed change money to send thru the delivery person. The goodies were transported in a well secure freezer box and delivered with complimentary cups and spoons as well. The delivery person too was very pleasent and courteous. Thank you for the smooth and prompt service.Milk toffee, Amber coffee caramel and Strawberry cheesecake are the three flavours I ordered. They taste fresh and homely, soft and creamy, and the best comfort food for any weather or occassion, and time or place. Will definitely order again.Good job Fazir.",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/108843653459740653882/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2taWlNVa3RiRWRPZFdKVk9HZFNiMjFxVG01U1dGRRAB",
    "name": "Oshi Kush",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/oshi-kush.webp",
    "rating": 5,
    "date": "2026-06-16",
    "text": "Wonderful service by Bisandi from Jolly Cream! The ice cart was super well organized and everything was done on time. The ice creams tasted really great—thank you for making my small one’s birthday even better.",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/112869656104818950413/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT21KMWEzUkxXRUZGYm14Q2RVMWtRV2cyUW05RGRIYxAB",
    "name": "Erosha Fernando",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/erosha-fernando.webp",
    "rating": 5,
    "date": "2026-04-16",
    "text": "We had Jolly’s at our office අවුරුදු පොල this year and it was a great experience. With the hot weather and all the activities, their ice cream was a real crowd favourite. The flavours were unique and everyone enjoyed them. Definitely value for money and a great addition to our event.",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/115588325719411371614/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2pGRFYxUjZUa3hKTUVwd05GZDBaWFJvTlVKV09IYxAB",
    "name": "Ganith Heshan",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/ganith-heshan.webp",
    "rating": 5,
    "date": "2026-06-16",
    "text": "A huge thank you to Jolly’s Ice Cream for being part of our celebration ❤️ One of the best choices we made!Super friendly team, amazing customer service, always on time, and most importantly the ice cream was absolutely delicious ✨ Our guests loved it too. Thank you for making our day extra sweet and special!",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/111412250763087789639/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUNiX3Rld1pnEAE",
    "name": "Corina Mihailescu",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/corina-mihailescu.webp",
    "rating": 5,
    "date": "2024-10-16",
    "text": "One of the best ice-cream I had! Lovley texture and taste. Not too sweet, not too sour,  perfectly balanced. Personally I loved the mandarin flavor sorbetto and kids liked the passion fruit flavor. The Swiss chocolate ice-cream is one of a kind. Super quality, just like Italian Gelatto. Really recommend it!Food: 5/5  |  Service: 5/5Recommended dishes",
    "photos": [
      {
        "src": "/images/reviews/photos/corina-mihailescu-1.webp",
        "width": 1400,
        "height": 631
      },
      {
        "src": "/images/reviews/photos/corina-mihailescu-2.webp",
        "width": 1400,
        "height": 631
      },
      {
        "src": "/images/reviews/photos/corina-mihailescu-3.webp",
        "width": 631,
        "height": 1400
      }
    ],
    "href": "https://www.google.com/maps/contrib/114599876911938571643/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2xKcVRHdzVkVVkwZGs5RlRVSmpjblF3TWpFNFZtYxAB",
    "name": "Amaya Fonseka",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/amaya-fonseka.webp",
    "rating": 5,
    "date": "2026-05-16",
    "text": "Very good service provided by the team Jolly’s creamery. Bisandi was very helpful answering all my questions and directing me properly. Ice creams are very tasty too",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/100807146933073833839/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT21WbVowbFNjRkpSVGxKUVpqSk1lVlJSZGxScFdsRRAB",
    "name": "Vimalya Devadas",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/vimalya-devadas.webp",
    "rating": 4,
    "date": "2026-05-16",
    "text": "Loved the jaffna mango!\nNot the best ice cream ive had, but still pretty good.\nBooked their cart for my event! Very good service, punctual and highly responsive on whatsapp",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/100002047669192418447/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2sxQ09GZFJNbVl4YjJWUmFVeFNjRU5oVkhaQlZIYxAB",
    "name": "Lishan dewmika",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/lishan-dewmika.webp",
    "rating": 5,
    "date": "2026-07-16",
    "text": "I am try to every ice crem flavour and i very like to passion fruit ice cream falour and , iam enjoy it. Mr.chanitha is suppprort to well me. ❤️🇱🇰",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/111766742360873748698/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT201QmFHUXhVMHBJV0RaM05VaEhMVXAxUlZscWExRRAB",
    "name": "Kushel R",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/kushel-r.webp",
    "rating": 5,
    "date": "2026-01-16",
    "text": "Great addition to our wedding! My partner and I were keen on getting an ice cream cart on our special day. We came across Jolly's on social media and saw that they've done weddings in the past. I immediately contact Mr.Ijaz who was not only very communicative but quite friendly throughout the whole process. He organised a tasting session for us and with the help of his friendly staff and suggestions we were able to finalised 8 flavours.1. Passion fruit creamy sorbet2. Salted caramel and peanuts3. Strawberry cheesecake4. Butterscotch5. Double chocolate (Recommend)6. Blueberry7. Jaffna Mango (Recommend)8. Kiri Toffee (Flavour of the month + recommend)Unfortunately we don't have photos at the moment, since the hotel only allowed us to keep the cart in the buffet area and not the hall itself. I recommend any couples planning to hire a cart to have it in the hall for better vibes. Our ice cream server was very friendly and professional. We heard many compliments from our guests that they loved the ice cream and that they went for seconds. The carts come in 3 colours (red, blue & white) we chose white to match our theme. Our package included complimentary cones which was a nice touch.We would like to thank the whole team and Mr.Ijaz for providing us with an amazing service and would love to see this at more weddings!",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/106735526359038461569/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2xwV1JtbEhlR1pUT1ZsRFJVRjBSMXBwVURORGRWRRAB",
    "name": "kenneth Nicholas de Zilva",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/kenneth-nicholas-de-zilva.webp",
    "rating": 5,
    "date": "2026-01-16",
    "text": "Excellent Service and Rarely a vendor is on Time but Jolly's were spot on time and the Ice Cream the flavors we choose were so tasty and would recommend Jollys for other events as well",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/112103837101044014749/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUMwdmFqQlNnEAE",
    "name": "Dale Andre Jayaweera",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/dale-andre-jayaweera.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "Lovely place for a ice cream, the homemade ice cream has a lot of flavor, personally loved the cinnamon flavour. Very creamy and very reasonable for the price and not forgetting the generous portion size.",
    "photos": [
      {
        "src": "/images/reviews/photos/dale-andre-jayaweera-1.webp",
        "width": 787,
        "height": 1400
      },
      {
        "src": "/images/reviews/photos/dale-andre-jayaweera-2.webp",
        "width": 787,
        "height": 1400
      },
      {
        "src": "/images/reviews/photos/dale-andre-jayaweera-3.webp",
        "width": 1400,
        "height": 788
      }
    ],
    "href": "https://www.google.com/maps/contrib/110809151458039129681/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2pOMlRHUlhZVnB3VjAxcFNURkZVV041TjFaaVJWRRAB",
    "name": "Ganisha De Silva",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/ganisha-de-silva.webp",
    "rating": 5,
    "date": "2026-04-16",
    "text": "Very friendly service and delicious ice cream. I tried the passion sorbet. Loved it!",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/111201462139044631405/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2s0dFpGZGpMVVpxUm1WblV6WXhPRkZUVGxGSU1tYxAB",
    "name": "Dilani Gomis",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/dilani-gomis.webp",
    "rating": 5,
    "date": "2026-03-16",
    "text": "Lovely experience with Jollys ice cream. Everyone enjoyed and tried all the flavors and still couldn't say which is the best. Thank you...",
    "photos": [
      {
        "src": "/images/reviews/photos/dilani-gomis-1.webp",
        "width": 1050,
        "height": 1400
      }
    ],
    "href": "https://www.google.com/maps/contrib/101049073538772499630/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUMwM083c1dBEAE",
    "name": "Steve De Rozairo",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/steve-de-rozairo.webp",
    "rating": 1,
    "date": "2019-10-16",
    "text": "Disappointed! Bought two 500ml tubs in Tin kiri n butterscotch. Very small servings, poor quality and taste. Expected much much more for the premium price that is charged. Would not try again or recommend to anyone else either! Hopefully there is an improvement in the future.",
    "photos": [
      {
        "src": "/images/reviews/photos/steve-de-rozairo-1.webp",
        "width": 960,
        "height": 1280
      }
    ],
    "href": "https://www.google.com/maps/contrib/113444735059405085147/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnTUNJc0txMmR3EAE",
    "name": "Ruchie Silva",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/ruchie-silva.webp",
    "rating": 5,
    "date": "2025-10-16",
    "text": "Jolly’s Ice Cream Cart is an absolute delight! The variety of flavors is amazing. The presentation is excellent, and the service is exceptional—friendly and prompt. It was a hit at our event, and everyone loved it! If you’re looking for a fun and delicious treat for any occasion, I highly recommend Jolly’s On Wheels.Thank you for making our day extra sweet!",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/108278996270350246165/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURlMjh2UmFnEAE",
    "name": "Jayagar Angelus Vibagar",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/jayagar-angelus-vibagar.webp",
    "rating": 5,
    "date": "2023-10-16",
    "text": "We had milo and caramel panikaju icecream with chocolate and badaam topings. It was very delicious and waiting to taste other flavours. There are seats for four. Friendly service.",
    "photos": [
      {
        "src": "/images/reviews/photos/jayagar-angelus-vibagar-1.webp",
        "width": 1050,
        "height": 1400
      }
    ],
    "href": "https://www.google.com/maps/contrib/113037710935612406336/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUNPcGUtUXRBRRAB",
    "name": "Dimagi Perera (tharu)",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/dimagi-perera-tharu.webp",
    "rating": 5,
    "date": "2022-10-16",
    "text": "Lovely Place. Friendly Staff. Different types of ice creams 🍦\n\nEnjoyed well. Highly Recommended!",
    "photos": [
      {
        "src": "/images/reviews/photos/dimagi-perera-tharu-1.webp",
        "width": 1050,
        "height": 1400
      }
    ],
    "href": "https://www.google.com/maps/contrib/102385214449901086208/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURNc19tQ1VREAE",
    "name": "Lasitha Panditaratna",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/lasitha-panditaratna.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "It was a fantastic experience... Best service ever... Friendly and patiently waited till we decided what we want..... No rush.. Yha is for the service",
    "photos": [
      {
        "src": "/images/reviews/photos/lasitha-panditaratna-1.webp",
        "width": 1400,
        "height": 1050
      },
      {
        "src": "/images/reviews/photos/lasitha-panditaratna-2.webp",
        "width": 1400,
        "height": 1050
      },
      {
        "src": "/images/reviews/photos/lasitha-panditaratna-3.webp",
        "width": 1400,
        "height": 1050
      }
    ],
    "href": "https://www.google.com/maps/contrib/111374355374384897613/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2t0dVRqSm1ZVXRwVGsxS1YxTkRNSFpGYjNwSmQxRRAB",
    "name": "HA",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/ha.webp",
    "rating": 5,
    "date": "2026-08-16",
    "text": "Perfect ice cream, smooth and delicious ✨",
    "photos": [
      {
        "src": "/images/reviews/photos/ha-1.webp",
        "width": 1050,
        "height": 1400
      }
    ],
    "href": "https://www.google.com/maps/contrib/102447951908081602752/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT21ndGJtTTFWMU10Y2toTmJtNWlkbDl6V2t4RWVuYxAB",
    "name": "Domenic Delorenzo",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/domenic-delorenzo.webp",
    "rating": 5,
    "date": "2026-09-16",
    "text": "Great ice cream. Nice people",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/105147208944236629804/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURrbWJyWGpBRRAB",
    "name": "Azam BM",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/azam-bm.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "Excellent ice cream and service. Some locally inspired flavours you probably won't find anywhere else.",
    "photos": [
      {
        "src": "/images/reviews/photos/azam-bm-1.webp",
        "width": 1400,
        "height": 1050
      }
    ],
    "href": "https://www.google.com/maps/contrib/113476406062961008944/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUNzbFktNU13EAE",
    "name": "Fazal Fausz",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/fazal-fausz.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "Awesome local flavours, naran, bubblegum, kiri Kopi.. loving it..",
    "photos": [
      {
        "src": "/images/reviews/photos/fazal-fausz-1.webp",
        "width": 1400,
        "height": 1050
      },
      {
        "src": "/images/reviews/photos/fazal-fausz-2.webp",
        "width": 1400,
        "height": 1050
      },
      {
        "src": "/images/reviews/photos/fazal-fausz-3.webp",
        "width": 1050,
        "height": 1400
      },
      {
        "src": "/images/reviews/photos/fazal-fausz-4.webp",
        "width": 1400,
        "height": 1050
      },
      {
        "src": "/images/reviews/photos/fazal-fausz-5.webp",
        "width": 1400,
        "height": 1169
      }
    ],
    "href": "https://www.google.com/maps/contrib/110076273258871175524/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VOVExoOUN3azYtOGlRRRAB",
    "name": "Heather Clarke",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/heather-clarke.webp",
    "rating": 5,
    "date": "2025-10-16",
    "text": "Excellent SriLankan ice cream, from Jolley's creamery, wherever find a ' bike ' selling the delicious flavours, I cannot resist! Thoroughly recommended.",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/112852471202513395411/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUMwaE5HVzRnRRAB",
    "name": "Kaalameriyan",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/kaalameriyan.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "Love love Jolly's Ice cream, my personal favorite is the tin kiri ice cream",
    "photos": [
      {
        "src": "/images/reviews/photos/kaalameriyan-1.webp",
        "width": 1050,
        "height": 1400
      },
      {
        "src": "/images/reviews/photos/kaalameriyan-2.webp",
        "width": 1050,
        "height": 1400
      }
    ],
    "href": "https://www.google.com/maps/contrib/103812314664543475977/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUQwMHJUMV9RRRAB",
    "name": "Danura Jayakody",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/danura-jayakody.webp",
    "rating": 4,
    "date": "2020-10-16",
    "text": "They serve home made ice-cream with a large range of choices. Recommend sundaes. But both time I went they haven't had Russian Berry sundae. The place is lovely and clean.",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/109112995152399346840/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUNVM3UzWVF3EAE",
    "name": "RV",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/rv.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "This place have homemade ice-cream with innovative and diverse flavors which will certainly make you feel bad for yourself for not finding out about this place ANY EARLIER! The owner is in his prime of creativity and living his passion for creating a new franchise. The chilled ambiance of this place is complementary to their potpourri of flavors of ice-cream.Jolly's Ice cream should be definitely one of your go to places if you're around Colombo. Hands down!",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/105586063361322012610/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUMwbHJLM3p3RRAB",
    "name": "Ayesha Rashid",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/ayesha-rashid.webp",
    "rating": 2,
    "date": "2019-10-16",
    "text": "Very small portion, smaller than a regukar ice cream scoop, but prices were on the expensive side. Rs. 200 for regular flavors and Rs. 260 for mint for some reason. Flavors were good but ice cream was not frozen enough, it was a slurry even when the server scooped it out.\nDisappointed!",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/109838351380558459171/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VLTGprS092cDZ1Q0F3EAE",
    "name": "Kathleen Thornell",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/kathleen-thornell.webp",
    "rating": 5,
    "date": "2025-10-16",
    "text": "The young man that served us was wonderful, explained all the favourites of the ice cream. He was totally amazing thankyou",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/103243659063716952182/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURzb0xPdGlRRRAB",
    "name": "Abdul Wahid",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/abdul-wahid.webp",
    "rating": 4,
    "date": "2020-10-16",
    "text": "Awesome experience!! Try it out and feel the difference",
    "photos": [
      {
        "src": "/images/reviews/photos/abdul-wahid-1.webp",
        "width": 1400,
        "height": 1050
      },
      {
        "src": "/images/reviews/photos/abdul-wahid-2.webp",
        "width": 1400,
        "height": 1050
      },
      {
        "src": "/images/reviews/photos/abdul-wahid-3.webp",
        "width": 1400,
        "height": 1050
      },
      {
        "src": "/images/reviews/photos/abdul-wahid-4.webp",
        "width": 1400,
        "height": 1050
      },
      {
        "src": "/images/reviews/photos/abdul-wahid-5.webp",
        "width": 1050,
        "height": 1400
      },
      {
        "src": "/images/reviews/photos/abdul-wahid-6.webp",
        "width": 1400,
        "height": 1050
      }
    ],
    "href": "https://www.google.com/maps/contrib/107688505439747485291/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURDdVBqVTlRRRAB",
    "name": "Mayuran Gunalasingam",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/mayuran-gunalasingam.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "I love jolly icecream my personal favorite cinnamon flavor",
    "photos": [
      {
        "src": "/images/reviews/photos/mayuran-gunalasingam-1.webp",
        "width": 1400,
        "height": 1050
      },
      {
        "src": "/images/reviews/photos/mayuran-gunalasingam-2.webp",
        "width": 1400,
        "height": 1050
      }
    ],
    "href": "https://www.google.com/maps/contrib/106666058953691445579/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURZbG9XS2ZREAE",
    "name": "Ali Jinnah",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/ali-jinnah.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "A bit pricy @ approx. Rs. 150-200 per scoops and 450 for the milkshakes but the unique flavours  and high quality ice-cream makes it worth while.A definite must try.",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/111648984750454024340/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUNFc09HV3p3RRAB",
    "name": "Orchard MotherCare",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/orchard-mothercare.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "Lovely new flavours that honestly says Srilanka.. loved the tinkiri icecream.. sent me back to the time I used to lick the empty milkmaid tins..\nSince they give you tasters..try out the new flavours..\nWatch out though.. You might miss it as there's no board..",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/103158490235559938289/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUMwbjdPTllBEAE",
    "name": "Sammani Rambukwella",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/sammani-rambukwella.webp",
    "rating": 4,
    "date": "2019-10-16",
    "text": "This place got Innovative flavours of ice cream which taste good. Quite pricey. Friendly and polite service.",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/110832569767550380771/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURNeXBhMXZnRRAB",
    "name": "dark5un",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/dark5un.webp",
    "rating": 4,
    "date": "2020-10-16",
    "text": "Love the flavors there and the staff are really friendly too! Just wish they had a bit more offerings & was closer to work.",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/114182833555360980128/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURoMy1DcUVBEAE",
    "name": "Tanuk Hapangama",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/tanuk-hapangama.webp",
    "rating": 2,
    "date": "2023-10-16",
    "text": "Very pricey, and not much products available in the menu, like earlier. Food is good but is not worth for the price at all.",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/100190635950713879074/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUNYOXVLNUhREAE",
    "name": "Shahtaj Noor",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/shahtaj-noor.webp",
    "rating": 4,
    "date": "2025-10-16",
    "text": "Not exceptional but good. Liked the nut and salted caramel flavour.Food: 4/5  |  Service: 4/5  |  Atmosphere: 4/5",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/106240315640834442047/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT21Gdk5tVmpWVlpDV2kxdVgyc3diMnN3WlVsc1JHYxAB",
    "name": "Maheshi Ranasinghe",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/maheshi-ranasinghe.webp",
    "rating": 5,
    "date": "2026-04-16",
    "text": "Very supportive and good service.",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/100518618811421574429/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUM0Mk9LU0ZnEAE",
    "name": "Farhan Fahumy",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/farhan-fahumy.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "Best place for ice cream and milk shake 👌",
    "photos": [
      {
        "src": "/images/reviews/photos/farhan-fahumy-1.webp",
        "width": 1400,
        "height": 788
      }
    ],
    "href": "https://www.google.com/maps/contrib/102891075668284045509/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUNDNWJQLTlRRRAB",
    "name": "mohamed shamil",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/mohamed-shamil.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "They have some good flavours for a very reasonable rate. Very good quality of service as well.",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/105549733217526012539/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURaNGJick13EAE",
    "name": "Jay",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/jay.webp",
    "rating": 5,
    "date": "2023-10-16",
    "text": "Delicious ice cream at the Movepixk hotel. Dilshan was extremely courteous and welcoming!",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/111199079738977824292/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURZbXZDeXpBRRAB",
    "name": "Stephen Satchithanandakumar",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/stephen-satchithanandakumar.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "Man so worth it. Will go again. Ask for a taste test before selecting an ice cream.",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/115519553885815863470/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUM4cUplUmVnEAE",
    "name": "Shavindra Fernando",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/shavindra-fernando.webp",
    "rating": 4,
    "date": "2020-10-16",
    "text": "Great place and value for money ice cream. only disadvantage i see less parking space",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/109528176567742285934/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUNZOElLQnd3RRAB",
    "name": "Naseef Bakir",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/naseef-bakir.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "Unique Sri Lankan flavours with a nice interior setting. Ideal place for children.",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/117073933618443645153/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURDbXZhYm9nRRAB",
    "name": "nafeez nusri",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/nafeez-nusri.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "They have some unique flavours. And also light ice-cream. I love it",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/113157373798099395253/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURDcnJ1aGVBEAE",
    "name": "Vajira Abeyasekara",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/vajira-abeyasekara.webp",
    "rating": 1,
    "date": "2020-10-16",
    "text": "Ice Cream & the service was good.. but the \"ROASTED CASHEW NUT\" ice cream contained only \"PEA NUTS\"... this is cheating the customer...",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/113591950032324406978/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2pWSkxWRnpaWFpmYUV0Q09VWk1RMk5JU0ZCT1ZIYxAB",
    "name": "dimuthu iddagoda",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/dimuthu-iddagoda.webp",
    "rating": 5,
    "date": "2026-04-16",
    "text": "Best!",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/101955015793764488333/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUM0bE1uYXBnRRAB",
    "name": "Shehan Joseph",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/shehan-joseph.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "Amazing flavors and good customer service. Different concept of ice cream sandwich",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/118129888331534699102/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUNodVl5SXR3RRAB",
    "name": "Anupama Ranasinghe",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/anupama-ranasinghe.webp",
    "rating": 5,
    "date": "2023-10-16",
    "text": "Yummy ice cream and friendly staff",
    "photos": [
      {
        "src": "/images/reviews/photos/anupama-ranasinghe-1.webp",
        "width": 787,
        "height": 1400
      }
    ],
    "href": "https://www.google.com/maps/contrib/103659813098431054343/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURVbTRPY2NBEAE",
    "name": "thavarajah haritha",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/thavarajah-haritha.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "Best handmade ice cream,we can get more flavours here",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/100373249054407099391/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURzaEtIV0VREAE",
    "name": "Zareek Zuhair",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/zareek-zuhair.webp",
    "rating": 4,
    "date": "2020-10-16",
    "text": "Ice cream tasted splendid. But no ambience and the air conditioning was not working",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/102977422404054925554/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURzLWJySXFnRRAB",
    "name": "Prashant Malhotra",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/prashant-malhotra.webp",
    "rating": 4,
    "date": "2020-10-16",
    "text": "Was extremely hyped, so i went there. A few flavors were definitely nice and a few the other extreme.",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/102242635268097710353/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUMwNjhXejBnRRAB",
    "name": "Udara Fernando",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/udara-fernando.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "Great ice cream shop with so many flavors try it guys",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/100165021825488815766/reviews"
  },
  {
    "id": "ChRDSUhNMG9nS0VJQ0FnSURlNWM4bxAB",
    "name": "pradeepan",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/pradeepan.webp",
    "rating": 5,
    "date": "2022-10-16",
    "text": "One of the best ice-cream in Colombo and friendly staff.",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/104426761635443361231/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUNlci1EYWp3RRAB",
    "name": "Tharushi Rathnasiri",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/tharushi-rathnasiri.webp",
    "rating": 5,
    "date": "2022-10-16",
    "text": "Highly recommend & appreciate! Awsome survive and all are the better tastes 🤩🤟",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/117436436913400328148/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUMwLTVlWUV3EAE",
    "name": "Vishwanath Athuraliya",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/vishwanath-athuraliya.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "Loved the flavours. Specifically the coconut and Swiss chocolate",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/110775137511702111275/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUNjOEt1YUlnEAE",
    "name": "Sripriyan Tharumarethinam",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/sripriyan-tharumarethinam.webp",
    "rating": 4,
    "date": "2020-10-16",
    "text": "Reasonable price. Not much quality. Awesome interior design",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/108372429995370147357/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUNjNVlYekxREAE",
    "name": "Ramesh Ramchand Budhrani",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/ramesh-ramchand-budhrani.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "A really nice experience...great ice cream...",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/108912601272590033601/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUQ4cDU2WjlnRRAB",
    "name": "Anas Badurdeen",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/anas-badurdeen.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "Best and better than carnival and Rio service is great too",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/115993650406351798417/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURDbHRXUnR3RRAB",
    "name": "A Malik",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/a-malik.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "Best ice cream zone and frindly employees..",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/118335671045709329882/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURDOWNTeHJ3RRAB",
    "name": "Anuk De Silva",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/anuk-de-silva.webp",
    "rating": 4,
    "date": "2020-10-16",
    "text": "Decent portion and good ice cream",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/101510756406329821199/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUNzMEtuV21nRRAB",
    "name": "Anuradha Amarakoon",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/anuradha-amarakoon.webp",
    "rating": 4,
    "date": "2020-10-16",
    "text": "Good.",
    "photos": [
      {
        "src": "/images/reviews/photos/anuradha-amarakoon-1.webp",
        "width": 1400,
        "height": 788
      }
    ],
    "href": "https://www.google.com/maps/contrib/108634872484512916730/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURzX00yUnB3RRAB",
    "name": "Mustapha Akbarally",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/mustapha-akbarally.webp",
    "rating": 3,
    "date": "2020-10-16",
    "text": "Average homemade ice cream. Lacks refinement.",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/100736757494095529807/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURrNjRySWdBRRAB",
    "name": "Dan",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/dan.webp",
    "rating": 1,
    "date": "2019-10-16",
    "text": "They were closed earlier than expected on Friday.",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/105617779279347237561/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURZenNlY1lnEAE",
    "name": "Ash",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/ash.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "Great service, and also the taste. ✌️",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/104866387195042037379/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURNOVlUMjdnRRAB",
    "name": "Shechem Sumanthiran",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/shechem-sumanthiran.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "Amazing ice-cream. Try the ice-cream sandwiches!",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/108062505137656907534/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURTdW8yejJ3RRAB",
    "name": "DormXboy Dboy",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/dormxboy-dboy.webp",
    "rating": 4,
    "date": "2021-10-16",
    "text": "Best Ice cream place in Marine Drive",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/112087290062532434769/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURZLVpfUXdnRRAB",
    "name": "High Lally",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/high-lally.webp",
    "rating": 5,
    "date": "2023-10-16",
    "text": "When ice cream, creativity and passion meets.",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/104044788242842616841/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUNzLW9Eb0d3EAE",
    "name": "Rian Jay",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/rian-jay.webp",
    "rating": 3,
    "date": "2020-10-16",
    "text": "Not exactly sure it's a good place.",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/107499449051243583069/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUNZOFBMcDBRRRAB",
    "name": "Rozni Ilyas",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/rozni-ilyas.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "Tastes Original and worth the visit",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/118252750235507762664/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUMwLUxMSlVnEAE",
    "name": "Mathew",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/mathew.webp",
    "rating": 4,
    "date": "2019-10-16",
    "text": "It was good but bit expensive",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/106290902572230841334/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUM0MFpUVzBRRRAB",
    "name": "mohd aiyaz",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/mohd-aiyaz.webp",
    "rating": 4,
    "date": "2019-10-16",
    "text": "Nice unusual flavors",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/107721776921102108346/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUM0Mk5MNjN3RRAB",
    "name": "Mohamed Zifan",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/mohamed-zifan.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "Good taste, Good service 👌🏼",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/113111779876080476186/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUQ4djlQY3dBRRAB",
    "name": "Mithun Dilantha Deva-Adithiya",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/mithun-dilantha-deva-adithiya.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "One of the best places!",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/106145769084180862532/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUM4dHBxenhnRRAB",
    "name": "balasuriya krishantha gayan",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/balasuriya-krishantha-gayan.webp",
    "rating": 2,
    "date": "2020-10-16",
    "text": "👍🏻👍🏻",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/115958486608176844134/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUNodDlfWlVBEAE",
    "name": "Serendib Bathware",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/serendib-bathware.webp",
    "rating": 5,
    "date": "2023-10-16",
    "text": "Great service",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/115699576879306685340/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUNDNTZqVXVRRRAB",
    "name": "Rifath Mohideen",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/rifath-mohideen.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "Really tasty",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/107330334987183861175/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUNDcUpEdUVBEAE",
    "name": "Chandana Rupasinghe",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/chandana-rupasinghe.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "Nice place",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/113982104903076435608/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUM4dkszMWNBEAE",
    "name": "Ishar Fernando",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/ishar-fernando.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "As always.",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/115603978571377523308/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURDOUkzYktnEAE",
    "name": "Azees Aflar",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/azees-aflar.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "Super .....",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/113480911470087693599/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT25KWE5uRmhjbGxpYzNwd2RGYzNlRUpTVmxWNFdGRRAB",
    "name": "Bimali Weerasekara",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/bimali-weerasekara.webp",
    "rating": 5,
    "date": "2026-10-14",
    "text": "Delicious ice cream! 🍦🤍 Everyone loved all the flavors and the ice cream cart was a lovely addition to our twins’ first birthday celebration. Thank you for being a part of our special day! ✨",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/105035733172006932264/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT25oSk0wWlhUV0ZDY2xKUkxVZGhTVGt5ZFd0Q1RXYxAB",
    "name": "Benali Anjali Chamodhya",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/benali-anjali-chamodhya.webp",
    "rating": 5,
    "date": "2026-10-14",
    "text": "Very testy",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/109787274567090218493/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT25CNVUyaFFhV3hzUlUxTFlYUXhORVZSTVdGUE5XYxAB",
    "name": "minto",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/minto.webp",
    "rating": 5,
    "date": "2026-10-13",
    "text": "so good",
    "photos": [
      {
        "src": "/images/reviews/photos/minto-1.webp",
        "width": 1050,
        "height": 1400
      },
      {
        "src": "/images/reviews/photos/minto-2.webp",
        "width": 645,
        "height": 1400
      }
    ],
    "href": "https://www.google.com/maps/contrib/116286003881948870217/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT25WUGIybzVhVE5GZFVJek9HOVFVRzF1ZVZsV1NYYxAB",
    "name": "Miriam M.",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/miriam-m.webp",
    "rating": 5,
    "date": "2026-10-09",
    "text": "Great Ice cream and super friendly service - we are looking foward to come back!",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/105715351535192192494/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT201RWRUTnpWR04xYUVaUVUwUklSa1pyWVhGdGJsRRAB",
    "name": "Philipp Baier",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/philipp-baier.webp",
    "rating": 5,
    "date": "2026-10-09",
    "text": "Very tasty, homemade icecream. Friendly and gentle owner. We will come back soon",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/112825902622863322696/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT21GR04zSm5jbkozVGxoWU4yMUtUbTVXWDA0MlIwRRAB",
    "name": "Debs Edirisinghe",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/debs-edirisinghe.webp",
    "rating": 5,
    "date": "2026-09-25",
    "text": "Absolutely amazing service loved the ice cream and loved the touch it brought to our event! Thank you ever so much… Senesa was absolutely amazing. Thank you for your hard work…",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/106236293941775357906/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2xsVFYycEZjakZOT1hZM1dtRmhNWFpyVG5wQ1lsRRAB",
    "name": "Donna Dembecki",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/donna-dembecki.webp",
    "rating": 5,
    "date": "2026-09-25",
    "text": "What an amazing experience, best ice cream EVER!!! and all the staff are incredible, especially Seneca , she is absolutely delightful!!!",
    "photos": [
      {
        "src": "/images/reviews/photos/donna-dembecki-1.webp",
        "width": 1050,
        "height": 1400
      },
      {
        "src": "/images/reviews/photos/donna-dembecki-2.webp",
        "width": 1050,
        "height": 1400
      }
    ],
    "href": "https://www.google.com/maps/contrib/101920917976621224496/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2pGNVRtUk9abGh1UjB4MlRsUnVOSEZ2Y1RGT01FRRAB",
    "name": "Michael Fourie",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/michael-fourie.webp",
    "rating": 5,
    "date": "2026-09-16",
    "text": "Amazing customer service by Senesa and the CEO Fazir who not only managed to help me with a last minute request, but also went out of their way to create a customized flavor for our event.I can not recommend these guys enough. Thank you Senesa and Fazir",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/105498226020096361230/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2kxTmVtMXNSRWs0V0VWVFdXeDZlRFkxUVdwZlZFRRAB",
    "name": "Divahar Selvaraj",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/divahar-selvaraj.webp",
    "rating": 1,
    "date": "2026-09-16",
    "text": "Bought a strawberry cheese cake, the flavour has changed and getting a burnt or some chemical taste in. As a jolly’s customer I am concerned about your end products",
    "photos": [
      {
        "src": "/images/reviews/photos/divahar-selvaraj-1.webp",
        "width": 1050,
        "height": 1400
      }
    ],
    "href": "https://www.google.com/maps/contrib/106965976086858722835/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2tOcGFFSkhPRGxNUlVGT2JscGFVRFJmU0VWTVJsRRAB",
    "name": "Jessica White",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/jessica-white.webp",
    "rating": 5,
    "date": "2026-09-16",
    "text": "Delicious!",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/107278325409477862223/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2xGRFExUTBibk4yV1hwQlZVRkthbVp6WlVkd1pFRRAB",
    "name": "Chanika Perera",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/chanika-perera.webp",
    "rating": 5,
    "date": "2026-09-16",
    "text": "They did such a wonderful job at my little ones birthday party. The ice cream was absolutely amazing and everyone loved it. The whole set up looked so beautiful!",
    "photos": [
      {
        "src": "/images/reviews/photos/chanika-perera-1.webp",
        "width": 1050,
        "height": 1400
      }
    ],
    "href": "https://www.google.com/maps/contrib/106218066478470693474/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT20wd1N6VlRRVVJSWTBoQmVYaE1ZM0YyUlVOaGVrRRAB",
    "name": "melmel",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/melmel.webp",
    "rating": 5,
    "date": "2026-08-16",
    "text": "Wonderful experience with Jollys at my registration. The coordinating team headed by Bisandi were so sweet and easy to work with. The guests absolutely loved it and I myself had two scoops haha They were also on time and set up exactly as instructed. Will definitely go with Jollys again for our reception!",
    "photos": [
      {
        "src": "/images/reviews/photos/melmel-1.webp",
        "width": 1038,
        "height": 1400
      }
    ],
    "href": "https://www.google.com/maps/contrib/110256595932951729710/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2tsdGRVSkZRa2cwTldSc2JVOVVNMlZhZGw5T2IzYxAB",
    "name": "Pahikaran Sribalarajah",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/pahikaran-sribalarajah.webp",
    "rating": 5,
    "date": "2026-08-16",
    "text": "Very good service and delicious ice cream",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/104606888584524685992/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2poS2NIWTRlVmRaWDBOdVZFeE5hR1V3Y0hoSVltYxAB",
    "name": "Vihan",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/vihan.webp",
    "rating": 5,
    "date": "2026-08-16",
    "text": "Tried Ceylon Coconut Ice cream which was suggested by Aravin at event",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/110387015351946690912/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT25sZlgxVjZZVUpsTWs5UlRrWkRiMXBOTUVReWVHYxAB",
    "name": "Andrea Perera",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/andrea-perera.webp",
    "rating": 5,
    "date": "2026-08-16",
    "text": "Hi Bisandi,Thank you so much for being a part of our wedding! We know it’s been a couple of weeks, but we finally had the chance to properly sit down and say thank you.We had the pleasure of having your ice cream service at our wedding, and it was truly one of the highlights of the evening! The ice cream cart was absolutely beautiful and added such a charming and special touch to our celebration. It looked so cute, elegant, and perfectly suited the atmosphere of our wedding.The ice cream itself was delicious, and the unique range of flavours was such a wonderful surprise for our guests. Everyone had such a great time trying the different flavours, and we received so many lovely comments from our family and friends about how much they enjoyed it.Thank you for being a part of our special day and for bringing so much joy to our celebration. A special thank you to Bisandi, who coordinated with us throughout the process and helped bring our vision to life from carefully selecting the flavours to choosing the perfect ice cream cart that complemented our wedding beautifully.The presentation, service, and delicious ice cream exceeded our expectations. Our guests absolutely loved the experience, and the unique flavours created such a fun and memorable moment for everyone. We truly appreciate the care and attention to detail you put into making our day even more special and would highly recommend you to anyone looking for a beautiful, fun, and unforgettable addition to their event!",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/113277892841658125991/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2paaGFIbE5jVXBGTW1SU2MzSk1jRUV0Tm5Bd1NHYxAB",
    "name": "Bayomi Freeloin",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/bayomi-freeloin.webp",
    "rating": 5,
    "date": "2026-08-16",
    "text": "Tried the passion fruit sorbet in a cafe and had to get some more! Luckily was able to get a tub delivered with great customer service from Bisandi on whatsapp! Also great to see not too high in sugar or fat!",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/103004188626876898527/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT20xM2ExbHlPVXc1VG5wU1MwSlViMUpOVlVGV2QyYxAB",
    "name": "Sajini de Silva",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/sajini-de-silva.webp",
    "rating": 5,
    "date": "2026-08-16",
    "text": "It is always an absolute pleasure working with Jolly's Ice Cream!From start to finish, their team is incredibly professional, friendly, and a joy to work with. They are always punctual with their setup, and what I appreciate most is the care they take to ensure every single guest is served and leaves with an ice cream in hand.Their selection of flavours is fantastic, offering something for everyone, and the quality of their ice cream is simply delicious. It's always a crowd favourite at every event!I wholeheartedly recommend Jolly's Ice Cream to anyone planning a wedding or special celebration. You can book them with complete confidence—you will not be disappointed. They have an amazing team, outstanding service, and some of the best ice cream around.Thank you, Jolly's Ice Cream, for always going above and beyond to make every event that little bit sweeter!",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/110409552546149317383/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2psaWVrcE5aRmRQTlZsMVoydEtkVmgzT1dWNGVtYxAB",
    "name": "Shubhangi Bansal",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/shubhangi-bansal.webp",
    "rating": 5,
    "date": "2026-07-16",
    "text": "Amazing ice creams service",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/107728721273011097049/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURZdTR6M3FRRRAB",
    "name": "Sebaratus",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/sebaratus.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "Great ice cream and friendly management. They said it opened two months ago.",
    "photos": [
      {
        "src": "/images/reviews/photos/sebaratus-1.webp",
        "width": 1400,
        "height": 1050
      },
      {
        "src": "/images/reviews/photos/sebaratus-2.webp",
        "width": 1400,
        "height": 1050
      },
      {
        "src": "/images/reviews/photos/sebaratus-3.webp",
        "width": 1050,
        "height": 1400
      }
    ],
    "href": "https://www.google.com/maps/contrib/106163956760129757329/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUM0MkxMVV93RRAB",
    "name": "Mohamed Azarudeen (AJA)",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/mohamed-azarudeen-aja.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "",
    "photos": [
      {
        "src": "/images/reviews/photos/mohamed-azarudeen-aja-1.webp",
        "width": 1400,
        "height": 1050
      },
      {
        "src": "/images/reviews/photos/mohamed-azarudeen-aja-2.webp",
        "width": 1400,
        "height": 1050
      }
    ],
    "href": "https://www.google.com/maps/contrib/113852526697480887247/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURrcmUzZEJ3EAE",
    "name": "irshan zats",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/irshan-zats.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "",
    "photos": [
      {
        "src": "/images/reviews/photos/irshan-zats-1.webp",
        "width": 1050,
        "height": 1400
      }
    ],
    "href": "https://www.google.com/maps/contrib/108072318748442498294/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUNkNjhtMzZBRRAB",
    "name": "සැරිසරන්නෙකි මම",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/guest.webp",
    "rating": 3,
    "date": "2024-10-16",
    "text": "Food: 3/5  |  Service: 5/5  |  Atmosphere: 5/5",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/116479195371498779695/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2w5R2J6WjFjVFp6UnpjM1draFdVWGg1Um5oUk9VRRAB",
    "name": "yasmine maiza",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/yasmine-maiza.webp",
    "rating": 5,
    "date": "2026-10-14",
    "text": "A wonderful and kind person, and his ice cream is amazing.\nI highly recommend stopping by, especially at night, for a peaceful experience. ❤️❤️",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/116167350553477165587/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT21reGNtVmlXRVp1VFU1bGJ6TlZURFU0YmtveVVIYxAB",
    "name": "Humaid A Saeed AL ALI",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/humaid-a-saeed-al-ali.webp",
    "rating": 5,
    "date": "2026-08-16",
    "text": "Beautiful ice cream slices and the taste is absolutely delicious.\nExcellent service from the staff.",
    "photos": [
      {
        "src": "/images/reviews/photos/humaid-a-saeed-al-ali-1.webp",
        "width": 1050,
        "height": 1400
      }
    ],
    "href": "https://www.google.com/maps/contrib/105914705515189533932/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2w5RldYVmFVRjh4UkdsM2JUWkNRbEUzTVRGMk4wRRAB",
    "name": "pooja M",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/pooja-m.webp",
    "rating": 5,
    "date": "2026-07-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/115358724856753303976/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2s1eE1XOUdjbWRNVkRaSE1qTTRTVnBqVVRkeVowRRAB",
    "name": "Mayantha D Liyanage",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/mayantha-d-liyanage.webp",
    "rating": 5,
    "date": "2026-05-16",
    "text": "",
    "photos": [
      {
        "src": "/images/reviews/photos/mayantha-d-liyanage-1.webp",
        "width": 1054,
        "height": 1400
      }
    ],
    "href": "https://www.google.com/maps/contrib/116822370697229016656/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT25neVVrbFdNMnRhV2tSVE0wNDJRMVpzZDBGaFlsRRAB",
    "name": "Manasseh Jeyaraj",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/manasseh-jeyaraj.webp",
    "rating": 5,
    "date": "2026-04-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/105104489431715347660/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2xWRmVGbEtkMGxSTW1STlNrZEthSHBXZDFsSVdsRRAB",
    "name": "Akhila Seneviratne",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/akhila-seneviratne.webp",
    "rating": 5,
    "date": "2026-03-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/106990050787786011600/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2xKbVFreEhVV2x3ZDJOQ2NFZEtRbWN6ZG5GV1FVRRAB",
    "name": "Subodha Perera",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/subodha-perera.webp",
    "rating": 5,
    "date": "2026-03-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/109353035360182372281/reviews"
  },
  {
    "id": "Ci9DQUlRQUNvZENodHljRjlvT2s1RVMyUndNMWxIVFRaVWRIWklTV2RSYVZsaGVWRRAB",
    "name": "Kavindi Ranasinghe",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/kavindi-ranasinghe.webp",
    "rating": 5,
    "date": "2025-12-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/105038325669119100799/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURabGU2WmV3EAE",
    "name": "Kasun Anupama Gamage",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/kasun-anupama-gamage.webp",
    "rating": 5,
    "date": "2023-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/105451288660944421581/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUNlaWNxZXdBRRAB",
    "name": "Nawran Nasir",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/nawran-nasir.webp",
    "rating": 4,
    "date": "2022-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/107792913872733619854/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUR1bzc2a0xREAE",
    "name": "Sahan Jayawardene",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/sahan-jayawardene.webp",
    "rating": 5,
    "date": "2022-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/107563375015847577822/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUNpa01TUWhnRRAB",
    "name": "Firnaz Mohammed",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/firnaz-mohammed.webp",
    "rating": 5,
    "date": "2021-10-16",
    "text": "",
    "photos": [
      {
        "src": "/images/reviews/photos/firnaz-mohammed-1.webp",
        "width": 1400,
        "height": 1050
      }
    ],
    "href": "https://www.google.com/maps/contrib/104635976749964644436/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURDdWUycDBBRRAB",
    "name": "Malinda De Silva",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/malinda-de-silva.webp",
    "rating": 4,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/114802036548811395002/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURDMHVUMmZREAE",
    "name": "Nibras Nizam",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/nibras-nizam.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/115614985679370727588/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURDekxqYkxBEAE",
    "name": "Harsha",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/harsha.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/105897874600137134677/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUNDdzZpa3N3RRAB",
    "name": "Binu Narangoda",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/binu-narangoda.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/114013173880294093439/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUNDOXJPSkVBEAE",
    "name": "ethan nicholas",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/ethan-nicholas.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/106502283803221288846/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUNDeXBPVFFBEAE",
    "name": "Alison",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/alison.webp",
    "rating": 4,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/100740711210871336996/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUNDMk51N0RBEAE",
    "name": "Yakoob Nowfer",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/yakoob-nowfer.webp",
    "rating": 3,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/106920571835100468431/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUNDZ1BIbTRRRRAB",
    "name": "Hingston Lovell",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/hingston-lovell.webp",
    "rating": 4,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/109438580958635290701/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUQ4eF9EcWFnEAE",
    "name": "Ashen Kumarasena",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/ashen-kumarasena.webp",
    "rating": 4,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/117953766781480980478/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUQ4NjZlN0lREAE",
    "name": "Jehan Peiris",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/jehan-peiris.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/106401445172412915238/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUQ4elpxSXd3RRAB",
    "name": "chamitha meththaka",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/chamitha-meththaka.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/107470463453491252841/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUM4MnNxN0RREAE",
    "name": "Supun Fernando",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/supun-fernando.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/106888026268837919912/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUM4M043Z1JREAE",
    "name": "idris mhmd",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/idris-mhmd.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/113035650858463358958/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURjNGNuUlhREAE",
    "name": "Chanika Ranasinghe",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/chanika-ranasinghe.webp",
    "rating": 4,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/113100870813225362417/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURjNGZIRWRREAE",
    "name": "Krishantha Mark",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/krishantha-mark.webp",
    "rating": 4,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/112619210309877978699/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURjOElPcm9RRRAB",
    "name": "Vajira JAYAKODI",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/vajira-jayakodi.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/108386935844561677425/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURzMnM3LUFnEAE",
    "name": "Thomas Piratheep",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/thomas-piratheep.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/111446466974896714531/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURzMG9xeF9RRRAB",
    "name": "ram ramakrishna",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/ram-ramakrishna.webp",
    "rating": 2,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/111841552181764238878/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURzd3FEM2RBEAE",
    "name": "Preethi rao k",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/preethi-rao-k.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/112383370507559664572/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUNzaV9LOVF3EAE",
    "name": "Jayani",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/jayani.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/113646865269694192924/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURNdDgyTkN3EAE",
    "name": "Rushana Haleed",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/rushana-haleed.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/114028549231098348958/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURNcDhqcjh3RRAB",
    "name": "Hameez Azad",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/hameez-azad.webp",
    "rating": 4,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/102323943851028818045/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURNNWJyMW5RRRAB",
    "name": "Balakantha Sarma",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/balakantha-sarma.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/112208657146153924406/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURNd2VlVTR3RRAB",
    "name": "Shabith Shamdeen",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/shabith-shamdeen.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/116739393970674489674/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURNdXN6WjFnRRAB",
    "name": "Raid Boss TM",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/raid-boss-tm.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/118444137895364837204/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUQwdlo2ZDNBRRAB",
    "name": "Thuwan Arshad",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/thuwan-arshad.webp",
    "rating": 5,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/115528639796451145697/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUQweHVmLXF3RRAB",
    "name": "Menuka Gunawardana",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/menuka-gunawardana.webp",
    "rating": 3,
    "date": "2020-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/110104792380418681332/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURVN2VxOVBBEAE",
    "name": "fazlan thahir",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/fazlan-thahir.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/100672717699449382793/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURVbGNtNlpBEAE",
    "name": "Jabir Aslam",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/jabir-aslam.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/107754697417560587750/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURVbFltSGlRRRAB",
    "name": "MFM Hisham",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/mfm-hisham.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/104780914692763106487/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUNVM3EyVG5nRRAB",
    "name": "Rukshan Periyapperuma",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/rukshan-periyapperuma.webp",
    "rating": 4,
    "date": "2019-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/109332466583378407541/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUM0a2FHMHZ3RRAB",
    "name": "Ruminda Herat Gunaratne",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/ruminda-herat-gunaratne.webp",
    "rating": 4,
    "date": "2019-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/111835463331717159545/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUM0aUl6c3Z3RRAB",
    "name": "Mahishka Samarasinghe",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/mahishka-samarasinghe.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/102841738366788469913/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURZdTRqQXBnRRAB",
    "name": "Niyasha Silva",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/niyasha-silva.webp",
    "rating": 4,
    "date": "2019-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/103242769039716338881/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURZdzhMellREAE",
    "name": "Nitesh Ratnagopal",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/nitesh-ratnagopal.webp",
    "rating": 3,
    "date": "2019-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/118282329157980724999/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSURZenVxVnRRRRAB",
    "name": "Ramesh Thiruchelvam",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/ramesh-thiruchelvam.webp",
    "rating": 4,
    "date": "2019-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/103605021353100983436/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURZbHZiZkJ3EAE",
    "name": "Preveen Rodrigo (P3ricles)",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/preveen-rodrigo-p3ricles.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/112145825437414596051/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSURZaHJTUERnEAE",
    "name": "Jhinogiga Nadesh",
    "localGuide": true,
    "avatar": "/images/reviews/avatars/jhinogiga-nadesh.webp",
    "rating": 4,
    "date": "2019-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/103349248584701464096/reviews"
  },
  {
    "id": "ChZDSUhNMG9nS0VJQ0FnSUNZbk5Ycld3EAE",
    "name": "Rizvi Nalawansha",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/rizvi-nalawansha.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/114287022637226224240/reviews"
  },
  {
    "id": "ChdDSUhNMG9nS0VJQ0FnSUNZOEpMLW1nRRAB",
    "name": "Fawarz Abuthahir",
    "localGuide": false,
    "avatar": "/images/reviews/avatars/fawarz-abuthahir.webp",
    "rating": 5,
    "date": "2019-10-16",
    "text": "",
    "photos": [],
    "href": "https://www.google.com/maps/contrib/115334202082300283280/reviews"
  }
];
