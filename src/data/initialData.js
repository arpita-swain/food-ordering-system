// Rich initial mock database for FoodieGo
export const INITIAL_CATEGORIES = [
  { id: 'cat-biryani', name: 'Biryani', icon: '🍱', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat-pizza', name: 'Pizza', icon: '🍕', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat-burgers', name: 'Burgers', icon: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat-chicken', name: 'Chicken', icon: '🍗', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat-indian', name: 'Indian', icon: '🍛', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat-chinese', name: 'Chinese', icon: '🍜', image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat-rolls', name: 'Rolls', icon: '🌯', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat-pasta', name: 'Pasta', icon: '🍝', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat-healthy', name: 'Healthy', icon: '🥗', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat-desserts', name: 'Desserts', icon: '🍰', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat-cafe', name: 'Cafe', icon: '☕', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat-beverages', name: 'Beverages', icon: '🥤', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&auto=format&fit=crop&q=80' }
];

export const INITIAL_RESTAURANTS = [
  {
    id: 'rest-1',
    name: 'Spice Garden Royal',
    tagline: 'Authentic Nawabi Biryani & North Indian Grills',
    rating: 4.6,
    ratingCount: '2.4K+',
    cuisines: ['Biryani', 'Indian', 'North Indian', 'Mughlai'],
    priceForTwo: 350,
    deliveryTime: '25-30 min',
    deliveryTimeMinutes: 28,
    distance: '2.4 km',
    distanceKm: 2.4,
    pureVeg: false,
    offer: '30% OFF up to ₹75',
    featured: true,
    isOpen: true,
    openingHours: '11:00 AM - 11:30 PM',
    address: 'Near Grand Mall, Main High Road, Dantan, West Bengal',
    lat: 21.9542,
    lng: 87.2721,
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
    categories: ['Recommended', 'Bestsellers', 'Biryani', 'Starters', 'Main Course', 'Breads', 'Beverages']
  },
  {
    id: 'rest-2',
    name: 'Burger Craft & Co.',
    tagline: 'Artisanal Smash Burgers & Crispy Loaded Fries',
    rating: 4.5,
    ratingCount: '1.8K+',
    cuisines: ['Burgers', 'Fast Food', 'Beverages', 'American'],
    priceForTwo: 280,
    deliveryTime: '20-25 min',
    deliveryTimeMinutes: 22,
    distance: '1.8 km',
    distanceKm: 1.8,
    pureVeg: false,
    offer: 'FLAT ₹100 OFF on ₹299',
    featured: true,
    isOpen: true,
    openingHours: '10:30 AM - 12:00 AM',
    address: 'Food Street Plaza, Sector 4, Dantan',
    lat: 21.9610,
    lng: 87.2680,
    coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1000&auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80',
    categories: ['Recommended', 'Bestsellers', 'Burgers', 'Starters', 'Sides', 'Beverages']
  },
  {
    id: 'rest-3',
    name: 'Green Leaf Pure Veg',
    tagline: '100% Satvik, Pure Vegetarian Feasts & South Indian',
    rating: 4.7,
    ratingCount: '3.1K+',
    cuisines: ['Indian', 'Healthy', 'South Indian', 'Chinese'],
    priceForTwo: 250,
    deliveryTime: '25-35 min',
    deliveryTimeMinutes: 30,
    distance: '3.1 km',
    distanceKm: 3.1,
    pureVeg: true,
    offer: '20% OFF on ₹200+',
    featured: true,
    isOpen: true,
    openingHours: '08:00 AM - 10:30 PM',
    address: 'Station Bypass Road, Dantan Bazar',
    lat: 21.9480,
    lng: 87.2790,
    coverImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1000&auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&auto=format&fit=crop&q=80',
    categories: ['Recommended', 'Bestsellers', 'South Indian', 'Main Course', 'Rice', 'Desserts']
  },
  {
    id: 'rest-4',
    name: 'Wok & Roll Asian Street',
    tagline: 'Dimsums, Hakka Noodles & Sizzling Manchurian',
    rating: 4.4,
    ratingCount: '1.2K+',
    cuisines: ['Chinese', 'Rolls', 'Asian', 'Noodles'],
    priceForTwo: 320,
    deliveryTime: '30-35 min',
    deliveryTimeMinutes: 32,
    distance: '2.9 km',
    distanceKm: 2.9,
    pureVeg: false,
    offer: 'FREE Delivery on ₹249',
    featured: false,
    isOpen: true,
    openingHours: '12:00 PM - 11:00 PM',
    address: 'Commercial Hub, Dantan North',
    lat: 21.9590,
    lng: 87.2750,
    coverImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1000&auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=200&auto=format&fit=crop&q=80',
    categories: ['Recommended', 'Bestsellers', 'Starters', 'Chinese', 'Rolls', 'Beverages']
  },
  {
    id: 'rest-5',
    name: 'La Pizzeria Woodfired',
    tagline: 'Neapolitan Sourdough Crust & Creamy Pastas',
    rating: 4.8,
    ratingCount: '4.5K+',
    cuisines: ['Pizza', 'Pasta', 'Italian', 'Desserts'],
    priceForTwo: 450,
    deliveryTime: '30-40 min',
    deliveryTimeMinutes: 35,
    distance: '4.2 km',
    distanceKm: 4.2,
    pureVeg: false,
    offer: '40% OFF up to ₹100',
    featured: true,
    isOpen: true,
    openingHours: '11:30 AM - 11:00 PM',
    address: 'City Center Mall Level 2, Dantan',
    lat: 21.9650,
    lng: 87.2600,
    coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&auto=format&fit=crop&q=80',
    categories: ['Recommended', 'Bestsellers', 'Pizza', 'Pasta', 'Desserts', 'Beverages']
  },
  {
    id: 'rest-6',
    name: 'Sweet Tooth Confectionery',
    tagline: 'Handcrafted Cakes, Pastries, Sundaes & Shakes',
    rating: 4.6,
    ratingCount: '980+',
    cuisines: ['Desserts', 'Cafe', 'Beverages'],
    priceForTwo: 220,
    deliveryTime: '15-20 min',
    deliveryTimeMinutes: 18,
    distance: '1.5 km',
    distanceKm: 1.5,
    pureVeg: true,
    offer: '20% OFF on Cakes',
    featured: false,
    isOpen: true,
    openingHours: '09:00 AM - 11:30 PM',
    address: 'College Road Crossing, Dantan',
    lat: 21.9510,
    lng: 87.2710,
    coverImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1000&auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=200&auto=format&fit=crop&q=80',
    categories: ['Recommended', 'Bestsellers', 'Desserts', 'Beverages']
  }
];

export const INITIAL_FOOD_ITEMS = [
  // Spice Garden Royal (rest-1)
  {
    id: 'food-101',
    restaurantId: 'rest-1',
    name: 'Chicken Dum Biryani',
    category: 'Biryani',
    description: 'Fragrant aged basmati rice cooked with succulent bone-in chicken marinated in secret spices, served with fresh raita and salan.',
    price: 249,
    rating: 4.7,
    ratingCount: 1420,
    isVeg: false,
    isBestseller: true,
    isRecommended: true,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    customizations: {
      sizes: [
        { name: 'Regular (Serves 1)', price: 0 },
        { name: 'Large (Serves 2)', price: 110 }
      ],
      extras: [
        { name: 'Extra Boiled Egg', price: 20 },
        { name: 'Extra Chicken Piece', price: 70 },
        { name: 'Extra Raita & Salan', price: 25 }
      ]
    }
  },
  {
    id: 'food-102',
    restaurantId: 'rest-1',
    name: 'Mutton Awadhi Biryani',
    category: 'Biryani',
    description: 'Slow-dum cooked tender baby goat meat infused with saffron, rose petals, and whole spices.',
    price: 349,
    rating: 4.8,
    ratingCount: 890,
    isVeg: false,
    isBestseller: true,
    isRecommended: true,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80',
    customizations: {
      sizes: [
        { name: 'Regular', price: 0 },
        { name: 'Royal Handi (Serves 2)', price: 160 }
      ],
      extras: [
        { name: 'Extra Mutton Boti (2 pcs)', price: 110 },
        { name: 'Boiled Egg', price: 20 }
      ]
    }
  },
  {
    id: 'food-103',
    restaurantId: 'rest-1',
    name: 'Butter Chicken Masala',
    category: 'Main Course',
    description: 'Char-grilled tandoori chicken cooked in a rich, buttery tomato cream gravy with dried fenugreek.',
    price: 279,
    rating: 4.6,
    ratingCount: 650,
    isVeg: false,
    isBestseller: false,
    isRecommended: true,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80',
    customizations: {
      sizes: [
        { name: 'Half (4 pcs)', price: 0 },
        { name: 'Full (8 pcs)', price: 140 }
      ],
      extras: [
        { name: 'Extra Butter Cubes', price: 25 },
        { name: 'Cream Garnish', price: 20 }
      ]
    }
  },
  {
    id: 'food-104',
    restaurantId: 'rest-1',
    name: 'Paneer Butter Masala',
    category: 'Main Course',
    description: 'Cottage cheese cubes tossed in a creamy, velvety mild tomato cashew curry.',
    price: 229,
    rating: 4.5,
    ratingCount: 420,
    isVeg: true,
    isBestseller: true,
    isRecommended: false,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80',
    customizations: {
      sizes: [
        { name: 'Regular', price: 0 },
        { name: 'Family Pack', price: 120 }
      ],
      extras: [
        { name: 'Extra Paneer', price: 40 },
        { name: 'Extra Butter', price: 20 }
      ]
    }
  },
  {
    id: 'food-105',
    restaurantId: 'rest-1',
    name: 'Butter Garlic Naan',
    category: 'Breads',
    description: 'Leavened flatbread freshly baked in clay tandoor, coated with minced garlic and melted salted butter.',
    price: 49,
    rating: 4.7,
    ratingCount: 1100,
    isVeg: true,
    isBestseller: false,
    isRecommended: true,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
    customizations: {
      sizes: [
        { name: '1 Piece', price: 0 },
        { name: '2 Pieces Basket', price: 45 }
      ],
      extras: [
        { name: 'Cheese Stuffed', price: 35 }
      ]
    }
  },

  // Burger Craft & Co. (rest-2)
  {
    id: 'food-201',
    restaurantId: 'rest-2',
    name: 'The Boss Chicken Smash Burger',
    category: 'Burgers',
    description: 'Double crunchy spiced chicken patties, melted aged cheddar, caramelized onions, jalapeños, and secret sauce on brioche bun.',
    price: 199,
    rating: 4.8,
    ratingCount: 1850,
    isVeg: false,
    isBestseller: true,
    isRecommended: true,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    customizations: {
      sizes: [
        { name: 'Single Patty', price: 0 },
        { name: 'Double Patty Beast', price: 60 }
      ],
      extras: [
        { name: 'Add Melted Cheese Slice', price: 30 },
        { name: 'Extra Smoked Bacon/Ham', price: 50 },
        { name: 'Truffle Mayo Dip', price: 25 }
      ]
    }
  },
  {
    id: 'food-202',
    restaurantId: 'rest-2',
    name: 'Crispy Peri-Peri Paneer Burger',
    category: 'Burgers',
    description: 'Panko fried herbed cottage cheese block dusted with hot peri-peri spice and tangy dill pickles.',
    price: 169,
    rating: 4.5,
    ratingCount: 740,
    isVeg: true,
    isBestseller: false,
    isRecommended: true,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    customizations: {
      sizes: [
        { name: 'Regular', price: 0 },
        { name: 'Large with Fries Combo', price: 79 }
      ],
      extras: [
        { name: 'Extra Cheese', price: 30 },
        { name: 'Jalapeño Popper Slice', price: 25 }
      ]
    }
  },
  {
    id: 'food-203',
    restaurantId: 'rest-2',
    name: 'Loaded Cheesy Peri-Peri Fries',
    category: 'Starters',
    description: 'Golden crispy skin-on potato fries drenched in warm liquid cheddar and spicy African peri-peri dust.',
    price: 129,
    rating: 4.6,
    ratingCount: 920,
    isVeg: true,
    isBestseller: true,
    isRecommended: false,
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&auto=format&fit=crop&q=80',
    customizations: {
      sizes: [
        { name: 'Medium Tub', price: 0 },
        { name: 'Party Platter', price: 65 }
      ],
      extras: [
        { name: 'Add Shredded Bacon', price: 40 },
        { name: 'Extra Cheese Dip', price: 25 }
      ]
    }
  },

  // Green Leaf Pure Veg (rest-3)
  {
    id: 'food-301',
    restaurantId: 'rest-3',
    name: 'Crispy Ghee Podi Masala Dosa',
    category: 'South Indian',
    description: 'Golden paper-thin fermented crepe smeared with pure aromatic cow ghee and spicy gun powder, stuffed with spiced potato mash.',
    price: 139,
    rating: 4.9,
    ratingCount: 2200,
    isVeg: true,
    isBestseller: true,
    isRecommended: true,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    customizations: {
      sizes: [
        { name: 'Regular 1 Pc', price: 0 },
        { name: 'Jumbo Size', price: 40 }
      ],
      extras: [
        { name: 'Extra Coconut Chutney', price: 15 },
        { name: 'Extra Ghee Roast', price: 25 }
      ]
    }
  },
  {
    id: 'food-302',
    restaurantId: 'rest-3',
    name: 'Royal Satvik Thali Special',
    category: 'Main Course',
    description: 'Paneer Makhani, Dal Tadka, Seasonal Mix Veg, Jeera Rice, 2 Tawa Rotis, Sweet Gulab Jamun, Papad and Pickle.',
    price: 219,
    rating: 4.7,
    ratingCount: 1600,
    isVeg: true,
    isBestseller: true,
    isRecommended: true,
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80',
    customizations: {
      sizes: [
        { name: 'Standard Thali', price: 0 },
        { name: 'Deluxe (includes Raita & Extra Sweet)', price: 50 }
      ],
      extras: [
        { name: 'Extra Roti (2 pcs)', price: 25 }
      ]
    }
  },

  // La Pizzeria Woodfired (rest-5)
  {
    id: 'food-501',
    restaurantId: 'rest-5',
    name: 'Farmhouse Margherita Deluxe Pizza',
    category: 'Pizza',
    description: 'Woodfired Italian sourdough crust, San Marzano tomato sauce, fresh buffalo mozzarella, cherry tomatoes, and aromatic sweet basil.',
    price: 329,
    rating: 4.8,
    ratingCount: 1980,
    isVeg: true,
    isBestseller: true,
    isRecommended: true,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80',
    customizations: {
      sizes: [
        { name: 'Medium (10 inch)', price: 0 },
        { name: 'Large (12 inch)', price: 120 }
      ],
      extras: [
        { name: 'Cheese Burst Crust', price: 75 },
        { name: 'Extra Sun-dried Tomatoes', price: 35 },
        { name: 'Extra Olives & Jalapeños', price: 30 }
      ]
    }
  },
  {
    id: 'food-502',
    restaurantId: 'rest-5',
    name: 'Creamy Fettuccine Alfredo',
    category: 'Pasta',
    description: 'Fresh artisanal fettuccine tossed in a rich parmesan butter emulsion with mushrooms and garlic herb crumb.',
    price: 289,
    rating: 4.6,
    ratingCount: 840,
    isVeg: true,
    isBestseller: false,
    isRecommended: true,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600&auto=format&fit=crop&q=80',
    customizations: {
      sizes: [
        { name: 'Regular Portion', price: 0 },
        { name: 'Large Bowl + Garlic Bread', price: 70 }
      ],
      extras: [
        { name: 'Add Grilled Chicken Strips', price: 60 },
        { name: 'Extra Shaved Parmesan', price: 30 }
      ]
    }
  },

  // Sweet Tooth Confectionery (rest-6)
  {
    id: 'food-601',
    restaurantId: 'rest-6',
    name: 'Belgian Chocolate Truffle Pastry',
    category: 'Desserts',
    description: 'Dark Belgian chocolate ganache layered with moist cocoa sponge, topped with roasted hazelnut crunch.',
    price: 119,
    rating: 4.9,
    ratingCount: 1450,
    isVeg: true,
    isBestseller: true,
    isRecommended: true,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    customizations: {
      sizes: [
        { name: '1 Slice', price: 0 },
        { name: '2 Slices Box', price: 109 }
      ],
      extras: [
        { name: 'Vanilla Ice Cream Scoop', price: 35 }
      ]
    }
  }
];

export const INITIAL_COUPONS = [
  {
    code: 'SAVE50',
    discountType: 'fixed',
    discountAmount: 50,
    minOrder: 199,
    maxDiscount: 50,
    description: 'Get ₹50 OFF on orders above ₹199',
    badge: 'Popular',
    expiry: 'Valid till 31 Oct 2026'
  },
  {
    code: 'FOODIE100',
    discountType: 'fixed',
    discountAmount: 100,
    minOrder: 399,
    maxDiscount: 100,
    description: 'Save ₹100 instantly on grand feasts above ₹399',
    badge: 'Super Saver',
    expiry: 'Valid till 15 Nov 2026'
  },
  {
    code: 'TASTY20',
    discountType: 'percent',
    discountPercent: 20,
    minOrder: 249,
    maxDiscount: 80,
    description: '20% OFF up to ₹80 on all restaurants',
    badge: 'Festive',
    expiry: 'Valid till 30 Dec 2026'
  },
  {
    code: 'FIRSTORDER',
    discountType: 'percent',
    discountPercent: 30,
    minOrder: 149,
    maxDiscount: 120,
    description: 'Special 30% discount for your inaugural order',
    badge: 'New User',
    expiry: 'Never expires'
  }
];

export const INITIAL_ADDRESSES = [
  {
    id: 'addr-1',
    type: 'Home',
    name: 'Arpit Sinha',
    phone: '+91 98765 43210',
    house: 'Flat 4B, Sunrise Enclave',
    street: 'Station Road, Near Post Office',
    landmark: 'Opposite State Bank',
    city: 'Dantan',
    state: 'West Bengal',
    pincode: '721426',
    lat: 21.9540,
    lng: 87.2720,
    isDefault: true
  },
  {
    id: 'addr-2',
    type: 'Work',
    name: 'Arpit Sinha',
    phone: '+91 98765 43210',
    house: 'Tech Hub Floor 3',
    street: 'IT Park Bypass, Sector 5',
    landmark: 'Near City Gate',
    city: 'Dantan',
    state: 'West Bengal',
    pincode: '721426',
    lat: 21.9620,
    lng: 87.2650,
    isDefault: false
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'FG10254',
    date: '2026-10-05T18:30:00Z',
    restaurantId: 'rest-1',
    restaurantName: 'Spice Garden Royal',
    restaurantAddress: 'Near Grand Mall, Main High Road, Dantan',
    status: 'Delivered', // 'Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'
    items: [
      { id: 'food-101', name: 'Chicken Dum Biryani', price: 249, quantity: 2, size: 'Regular (Serves 1)', extras: ['Extra Boiled Egg'] }
    ],
    pricing: {
      subtotal: 518,
      deliveryFee: 0,
      taxes: 25.9,
      discount: 50,
      grandTotal: 493.9
    },
    payment: {
      method: 'UPI',
      status: 'Paid',
      transactionId: 'TXN_UPI_98231'
    },
    deliveryAddress: {
      name: 'Arpit Sinha',
      type: 'Home',
      addressLine: 'Flat 4B, Sunrise Enclave, Station Road, Dantan, West Bengal'
    },
    deliveryPartner: {
      name: 'Rajesh Kumar',
      phone: '+91 98111 22334',
      rating: 4.9,
      vehicle: 'Hero Splendor (WB-34-AB-1290)'
    },
    estimatedDeliveryTime: 'Delivered in 24 mins',
    trackingSteps: [
      { label: 'Order Placed', time: '06:30 PM', done: true },
      { label: 'Restaurant Confirmed', time: '06:32 PM', done: true },
      { label: 'Food Prepared', time: '06:44 PM', done: true },
      { label: 'Out for Delivery', time: '06:46 PM', done: true },
      { label: 'Delivered', time: '06:54 PM', done: true }
    ],
    rating: {
      restaurant: 5,
      food: 5,
      review: 'Awesome biryani! The chicken was super juicy and aroma was amazing.'
    }
  }
];

export const INITIAL_USERS = [
  {
    id: 'user-1',
    name: 'Arpit Sinha',
    email: 'arpit@foodiego.com',
    phone: '+91 98765 43210',
    role: 'Customer', // 'Customer', 'Delivery Partner', 'Admin'
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    ordersCount: 14,
    status: 'Active'
  },
  {
    id: 'user-2',
    name: 'Rajesh Kumar (Partner)',
    email: 'rajesh.rider@foodiego.com',
    phone: '+91 98111 22334',
    role: 'Delivery Partner',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    ordersCount: 842,
    status: 'Active'
  },
  {
    id: 'user-3',
    name: 'Admin Supervisor',
    email: 'admin@foodiego.com',
    phone: '+91 90000 00001',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    ordersCount: 0,
    status: 'Active'
  }
];
