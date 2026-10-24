// Luxury stays: listing aur detail page dono yahin se data padhte hain.
// Naam, slug, price, rating aur reviews listing wale purane data se hain.
// distance, check-in/out, amenities, rooms aur policies sample content hai.
// Client se confirm karke badal dena.
//
// Route: /stay/luxury/<locationSlug>/<slug>

const luxuryStays = [
  {
    id: "lux-1",
    slug: "corbett-luxury-retreat",
    locationSlug: "dhikuli",
    name: "Corbett Luxury Retreat",
    location: "Dhikuli, Jim Corbett",
    image: "/stay/luxury-1.webp",
    images: ["/stay/luxury-1.webp"],

    description:
      "Premium luxury accommodation with elegant interiors, modern amenities and a refined jungle retreat experience.",

    price: 7499,
    rating: 4.7,
    reviews: 84,
    guests: "2 Guests",
    cancellation: "Free cancellation",

    distance: "3 km from Jim Corbett National Park",
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",

    amenities: [
      "Free WiFi",
      "Free Parking",
      "Swimming Pool",
      "Restaurant",
      "Room Service",
      "Garden",
    ],

    rooms: [
      {
        id: "lux-1-a",
        name: "Luxury Room",
        description:
          "An elegant room with modern comfort and views of the surrounding greenery.",
        price: 7499,
        guests: 2,
        size: "350 sq ft",
        bed: "King Bed",
        cancellation: "Free cancellation",
      },
      {
        id: "lux-1-b",
        name: "Luxury Suite",
        description:
          "A spacious suite with a separate sitting area, suited to longer stays.",
        price: 9999,
        guests: 3,
        size: "480 sq ft",
        bed: "King Bed",
        cancellation: "Free cancellation",
      },
    ],

    policies: {
      cancellation:
        "Cancellation terms depend on the dates and room plan. Our team confirms them with your quote.",
      payment: "Payment options are shared when your booking is confirmed.",
      parking: "Free parking is available for guests.",
    },
  },

  {
    id: "lux-2",
    slug: "the-forest-crown",
    locationSlug: "sitabani-road",
    name: "The Forest Crown",
    location: "Sitabani Road, Corbett",
    image: "/stay/luxury-2.webp",
    images: ["/stay/luxury-2.webp"],

    description:
      "A sophisticated luxury stay surrounded by nature, offering spacious rooms and a relaxing premium experience.",

    price: 8499,
    rating: 4.8,
    reviews: 96,
    guests: "2 Guests",
    cancellation: "Free cancellation",

    distance: "8 km from Jim Corbett National Park",
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",

    amenities: [
      "Free WiFi",
      "Free Parking",
      "Restaurant",
      "Room Service",
      "Garden",
    ],

    rooms: [
      {
        id: "lux-2-a",
        name: "Crown Room",
        description:
          "A spacious room with forest views and premium furnishings.",
        price: 8499,
        guests: 2,
        size: "380 sq ft",
        bed: "King Bed",
        cancellation: "Free cancellation",
      },
      {
        id: "lux-2-b",
        name: "Crown Suite",
        description:
          "A larger suite with a private sit-out, suited to families.",
        price: 11499,
        guests: 4,
        size: "520 sq ft",
        bed: "King Bed + Sofa Bed",
        cancellation: "Free cancellation",
      },
    ],

    policies: {
      cancellation:
        "Cancellation terms depend on the dates and room plan. Our team confirms them with your quote.",
      payment: "Payment options are shared when your booking is confirmed.",
      parking: "Free parking is available for guests.",
    },
  },

  {
    id: "lux-3",
    slug: "corbett-wilderness-resort",
    locationSlug: "dhela",
    name: "Corbett Wilderness Resort",
    location: "Dhela, Jim Corbett",
    image: "/stay/luxury-3.webp",
    images: ["/stay/luxury-3.webp"],

    description:
      "An upscale jungle retreat designed for travellers seeking comfort, privacy and a premium Corbett experience.",

    price: 9499,
    rating: 4.8,
    reviews: 108,
    guests: "2 Guests",
    cancellation: "Free cancellation",

    distance: "2 km from Dhela Zone",
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",

    amenities: [
      "Free WiFi",
      "Free Parking",
      "Swimming Pool",
      "Restaurant",
      "Room Service",
    ],

    rooms: [
      {
        id: "lux-3-a",
        name: "Wilderness Room",
        description:
          "A private room with a balcony and a quiet jungle setting.",
        price: 9499,
        guests: 2,
        size: "400 sq ft",
        bed: "King Bed",
        cancellation: "Free cancellation",
      },
      {
        id: "lux-3-b",
        name: "Wilderness Suite",
        description:
          "A suite with extra space and a separate living area.",
        price: 12999,
        guests: 4,
        size: "560 sq ft",
        bed: "King Bed + Sofa Bed",
        cancellation: "Free cancellation",
      },
    ],

    policies: {
      cancellation:
        "Cancellation terms depend on the dates and room plan. Our team confirms them with your quote.",
      payment: "Payment options are shared when your booking is confirmed.",
      parking: "Free parking is available for guests.",
    },
  },

  {
    id: "lux-4",
    slug: "riverside-luxury-resort",
    locationSlug: "ramnagar",
    name: "Riverside Luxury Resort",
    location: "Ramnagar, Uttarakhand",
    image: "/stay/luxury-4.webp",
    images: ["/stay/luxury-4.webp"],

    description:
      "An elegant riverside stay combining premium comfort, beautiful surroundings and exceptional hospitality.",

    price: 10999,
    rating: 4.9,
    reviews: 121,
    guests: "2 Guests",
    cancellation: "Free cancellation",

    distance: "5 km from Jim Corbett National Park",
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",

    amenities: [
      "Free WiFi",
      "Free Parking",
      "Swimming Pool",
      "Spa",
      "Restaurant",
      "Room Service",
      "Garden",
    ],

    rooms: [
      {
        id: "lux-4-a",
        name: "River View Room",
        description:
          "A premium room with a river-facing balcony.",
        price: 10999,
        guests: 2,
        size: "420 sq ft",
        bed: "King Bed",
        cancellation: "Free cancellation",
      },
      {
        id: "lux-4-b",
        name: "River View Suite",
        description:
          "Our largest suite with a living area and river views, ideal for special occasions.",
        price: 14999,
        guests: 4,
        size: "640 sq ft",
        bed: "King Bed + Sofa Bed",
        cancellation: "Free cancellation",
      },
    ],

    policies: {
      cancellation:
        "Cancellation terms depend on the dates and room plan. Our team confirms them with your quote.",
      payment: "Payment options are shared when your booking is confirmed.",
      parking: "Free parking is available for guests.",
    },
  },
];

export default luxuryStays;