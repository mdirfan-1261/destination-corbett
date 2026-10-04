const resorts = [
  {
    id: "1",
    slug: "corbett-forest-resort",
    locationSlug: "dhikuli",
    name: "Corbett Forest Resort",
    location: "Dhikuli, Jim Corbett",
    image: "/stay/resort-1.jpg",

    description:
      "A peaceful forest resort surrounded by nature, perfect for families and weekend getaways.",

    rating: 4.3,
    reviews: 42,
    distance: "3.5 km from Jim Corbett National Park",

    checkIn: "1:00 PM",
    checkOut: "11:00 AM",

    images: [
      "/stay/resort-1.jpg",
    ],

    amenities: [
      "Free WiFi",
      "Free Parking",
      "Swimming Pool",
      "Air Conditioning",
      "Restaurant",
      "Room Service",
    ],

    rooms: [
      {
        id: "101",
        name: "Deluxe Room",
        description:
          "A comfortable room designed for a relaxing stay surrounded by nature.",
        price: 4999,
        guests: 3,
        size: "320 sq ft",
        bed: "King Bed",
        cancellation: "Free cancellation",
      },
      {
        id: "102",
        name: "Premium Room",
        description:
          "A spacious premium room suitable for families and longer stays.",
        price: 6499,
        guests: 4,
        size: "400 sq ft",
        bed: "King Bed",
        cancellation: "Free cancellation",
      },
    ],

    policies: {
      cancellation:
        "Cancellation policy will be updated according to the property booking rules.",
      payment:
        "Payment options will be shown during the booking process.",
      parking: "Free parking is available for guests.",
    },
  },

  {
    id: "2",
    slug: "riverside-retreat",
    locationSlug: "ramnagar",
    name: "Riverside Retreat",
    location: "Ramnagar, Jim Corbett",
    image: "/stay/resort-2.jpg",

    description:
      "Enjoy a relaxing stay with beautiful surroundings and a peaceful riverside atmosphere.",

    rating: 4.2,
    reviews: 35,
    distance: "5 km from Jim Corbett National Park",

    checkIn: "1:00 PM",
    checkOut: "11:00 AM",

    images: [
      "/stay/resort-2.jpg",
    ],

    amenities: [
      "Free WiFi",
      "Free Parking",
      "Swimming Pool",
      "Restaurant",
      "Room Service",
    ],

    rooms: [
      {
        id: "201",
        name: "Deluxe Room",
        description:
          "Comfortable accommodation with modern facilities and peaceful surroundings.",
        price: 4499,
        guests: 3,
        size: "300 sq ft",
        bed: "King Bed",
        cancellation: "Free cancellation",
      },
      {
        id: "202",
        name: "Family Room",
        description:
          "Spacious room suitable for families travelling together.",
        price: 5999,
        guests: 4,
        size: "420 sq ft",
        bed: "King Bed + Sofa Bed",
        cancellation: "Free cancellation",
      },
    ],

    policies: {
      cancellation:
        "Cancellation policy will be updated according to the property booking rules.",
      payment:
        "Payment options will be shown during the booking process.",
      parking: "Free parking is available for guests.",
    },
  },

  {
    id: "3",
    slug: "jungle-view-resort",
    locationSlug: "sitabani",
    name: "Jungle View Resort",
    location: "Sitabani, Jim Corbett",
    image: "/stay/resort-3.jpg",

    description:
      "Experience nature, comfort and adventure with a beautiful jungle view.",

    rating: 4.4,
    reviews: 38,
    distance: "8 km from Jim Corbett National Park",

    checkIn: "1:00 PM",
    checkOut: "11:00 AM",

    images: [
      "/stay/resort-3.jpg",
    ],

    amenities: [
      "Free WiFi",
      "Free Parking",
      "Restaurant",
      "Room Service",
      "Garden",
    ],

    rooms: [
      {
        id: "301",
        name: "Jungle View Room",
        description:
          "Enjoy a comfortable stay with beautiful natural surroundings.",
        price: 4799,
        guests: 3,
        size: "320 sq ft",
        bed: "King Bed",
        cancellation: "Free cancellation",
      },
      {
        id: "302",
        name: "Premium Jungle Room",
        description:
          "A spacious room offering extra comfort for families.",
        price: 6299,
        guests: 4,
        size: "400 sq ft",
        bed: "King Bed",
        cancellation: "Free cancellation",
      },
    ],

    policies: {
      cancellation:
        "Cancellation policy will be updated according to the property booking rules.",
      payment:
        "Payment options will be shown during the booking process.",
      parking: "Free parking is available for guests.",
    },
  },

  {
    id: "4",
    slug: "corbett-nature-stay",
    locationSlug: "dhangari",
    name: "Corbett Nature Stay",
    location: "Dhangari, Jim Corbett",
    image: "/stay/resort-4.jpg",

    description:
      "Comfortable rooms, peaceful surroundings and easy access to Jim Corbett attractions.",

    rating: 4.1,
    reviews: 29,
    distance: "4 km from Jim Corbett National Park",

    checkIn: "1:00 PM",
    checkOut: "11:00 AM",

    images: [
      "/stay/resort-4.jpg",
    ],

    amenities: [
      "Free WiFi",
      "Free Parking",
      "Restaurant",
      "Garden",
      "Room Service",
    ],

    rooms: [
      {
        id: "401",
        name: "Standard Room",
        description:
          "A comfortable room for couples and small families.",
        price: 3999,
        guests: 2,
        size: "280 sq ft",
        bed: "Queen Bed",
        cancellation: "Free cancellation",
      },
      {
        id: "402",
        name: "Deluxe Room",
        description:
          "A larger room with additional space and comfort.",
        price: 5199,
        guests: 3,
        size: "340 sq ft",
        bed: "King Bed",
        cancellation: "Free cancellation",
      },
    ],

    policies: {
      cancellation:
        "Cancellation policy will be updated according to the property booking rules.",
      payment:
        "Payment options will be shown during the booking process.",
      parking: "Free parking is available for guests.",
    },
  },

  {
    id: "5",
    slug: "wildlife-retreat",
    locationSlug: "mohokand",
    name: "Wildlife Retreat",
    location: "Mohokand, Jim Corbett",
    image: "/stay/resort-5.jpg",

    description:
      "A comfortable retreat for travellers looking for a relaxing wildlife experience.",

    rating: 4.3,
    reviews: 31,
    distance: "6 km from Jim Corbett National Park",

    checkIn: "1:00 PM",
    checkOut: "11:00 AM",

    images: [
      "/stay/resort-5.jpg",
    ],

    amenities: [
      "Free WiFi",
      "Free Parking",
      "Swimming Pool",
      "Restaurant",
      "Room Service",
    ],

    rooms: [
      {
        id: "501",
        name: "Deluxe Room",
        description:
          "Comfortable accommodation with essential modern facilities.",
        price: 4599,
        guests: 3,
        size: "310 sq ft",
        bed: "King Bed",
        cancellation: "Free cancellation",
      },
      {
        id: "502",
        name: "Family Suite",
        description:
          "Spacious accommodation designed for families.",
        price: 6799,
        guests: 4,
        size: "450 sq ft",
        bed: "King Bed + Sofa Bed",
        cancellation: "Free cancellation",
      },
    ],

    policies: {
      cancellation:
        "Cancellation policy will be updated according to the property booking rules.",
      payment:
        "Payment options will be shown during the booking process.",
      parking: "Free parking is available for guests.",
    },
  },

  {
    id: "6",
    slug: "green-valley-resort",
    locationSlug: "ramnagar",
    name: "Green Valley Resort",
    location: "Ramnagar, Jim Corbett",
    image: "/stay/resort-6.jpg",

    description:
      "A beautiful nature stay offering comfort, greenery and a memorable Corbett experience.",

    rating: 4.5,
    reviews: 46,
    distance: "5.5 km from Jim Corbett National Park",

    checkIn: "1:00 PM",
    checkOut: "11:00 AM",

    images: [
      "/stay/resort-6.jpg",
    ],

    amenities: [
      "Free WiFi",
      "Free Parking",
      "Swimming Pool",
      "Restaurant",
      "Garden",
      "Room Service",
    ],

    rooms: [
      {
        id: "601",
        name: "Deluxe Room",
        description:
          "A comfortable room surrounded by greenery and peaceful surroundings.",
        price: 4899,
        guests: 3,
        size: "320 sq ft",
        bed: "King Bed",
        cancellation: "Free cancellation",
      },
      {
        id: "602",
        name: "Luxury Suite",
        description:
          "A spacious suite designed for a more comfortable stay.",
        price: 6999,
        guests: 4,
        size: "480 sq ft",
        bed: "King Bed",
        cancellation: "Free cancellation",
      },
    ],

    policies: {
      cancellation:
        "Cancellation policy will be updated according to the property booking rules.",
      payment:
        "Payment options will be shown during the booking process.",
      parking: "Free parking is available for guests.",
    },
  },
];

export default resorts;