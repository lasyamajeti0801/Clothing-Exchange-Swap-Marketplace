import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed for ReWear...');

  // Clean existing records in correct foreign key order
  await prisma.adminLog.deleteMany();
  await prisma.report.deleteMany();
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.savedItem.deleteMany();
  await prisma.swapRequest.deleteMany();
  await prisma.clothingImage.deleteMany();
  await prisma.clothingItem.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Existing data wiped.');

  const defaultPasswordHash = await bcrypt.hash('Password@123', 10);
  const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);

  // 1. Create Admin & 20 Users
  const usersData = [
    {
      name: 'ReWear Admin',
      email: 'admin@rewear.org',
      password: adminPasswordHash,
      role: 'ADMIN',
      city: 'Hyderabad',
      state: 'Telangana',
      bio: 'Platform administrator ensuring fair swaps and sustainable community standards.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 5.0,
      swapCount: 15,
    },
    {
      name: 'Priya Sharma',
      email: 'priya@rewear.org',
      password: defaultPasswordHash,
      city: 'Hyderabad',
      state: 'Telangana',
      bio: 'Slow fashion advocate & vintage collector. Love swapping jackets & handloom kurtas!',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      rating: 4.9,
      swapCount: 8,
    },
    {
      name: 'Rahul Verma',
      email: 'rahul@rewear.org',
      password: defaultPasswordHash,
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      bio: 'Streetwear fan trying to build a zero-waste wardrobe. Hit me up for hoodies & denim.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 4.8,
      swapCount: 6,
    },
    {
      name: 'Ananya Patel',
      email: 'ananya@rewear.org',
      password: defaultPasswordHash,
      city: 'Mangalagiri',
      state: 'Andhra Pradesh',
      bio: 'Textile enthusiast living in the handloom capital. Swapping authentic sarees & kurtas.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      rating: 5.0,
      swapCount: 12,
    },
    {
      name: 'Rohan Mehta',
      email: 'rohan@rewear.org',
      password: defaultPasswordHash,
      city: 'Guntur',
      state: 'Andhra Pradesh',
      bio: 'Minimalist closet enthusiast. Only holding what sparks joy and swapping the rest.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      rating: 4.7,
      swapCount: 4,
    },
    {
      name: 'Sneha Reddy',
      email: 'sneha@rewear.org',
      password: defaultPasswordHash,
      city: 'Hyderabad',
      state: 'Telangana',
      bio: 'Sustainable lifestyle creator. Swapping designer occasion wear and summer dresses.',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      rating: 4.9,
      swapCount: 9,
    },
    {
      name: 'Vikram Joshi',
      email: 'vikram@rewear.org',
      password: defaultPasswordHash,
      city: 'Bengaluru',
      state: 'Karnataka',
      bio: 'Techie by day, thrift hunter on weekends. High quality flannels and jackets.',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      rating: 4.6,
      swapCount: 5,
    },
    {
      name: 'Kavita Nair',
      email: 'kavita@rewear.org',
      password: defaultPasswordHash,
      city: 'Chennai',
      state: 'Tamil Nadu',
      bio: 'Passionate about circular economy and handspun natural fabrics.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 4.9,
      swapCount: 7,
    },
    {
      name: 'Arjun Kapoor',
      email: 'arjun@rewear.org',
      password: defaultPasswordHash,
      city: 'Mumbai',
      state: 'Maharashtra',
      bio: 'Athletic wear & sneaker enthusiast. Looking to exchange premium sportswear.',
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      rating: 4.8,
      swapCount: 11,
    },
    {
      name: 'Pooja Iyer',
      email: 'pooja@rewear.org',
      password: defaultPasswordHash,
      city: 'Bengaluru',
      state: 'Karnataka',
      bio: 'Office wear, formal shirts, and silk dupattas ready for a new wardrobe!',
      avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      rating: 5.0,
      swapCount: 6,
    },
    {
      name: 'Aditya Singh',
      email: 'aditya@rewear.org',
      password: defaultPasswordHash,
      city: 'Delhi',
      state: 'Delhi',
      bio: 'Winter coats, leather jackets, and hoodies collector. Direct local swaps preferred.',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      rating: 4.7,
      swapCount: 3,
    },
    {
      name: 'Divya Rao',
      email: 'divya@rewear.org',
      password: defaultPasswordHash,
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      bio: 'Conscious consumer swapping festive ethnic sets and trendy evening tops.',
      avatarUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80',
      rating: 4.8,
      swapCount: 8,
    },
    {
      name: 'Neha Gupta',
      email: 'neha@rewear.org',
      password: defaultPasswordHash,
      city: 'Pune',
      state: 'Maharashtra',
      bio: 'Graphic designer into earthy aesthetic and breathable cotton clothes.',
      avatarUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&auto=format&fit=crop&q=80',
      rating: 4.9,
      swapCount: 5,
    },
    {
      name: 'Siddharth Menon',
      email: 'sid@rewear.org',
      password: defaultPasswordHash,
      city: 'Hyderabad',
      state: 'Telangana',
      bio: 'Swapping casual tees, denim, and semi-formal wear. Friendly & fast responses.',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      rating: 4.6,
      swapCount: 4,
    },
    {
      name: 'Ritu Deshmukh',
      email: 'ritu@rewear.org',
      password: defaultPasswordHash,
      city: 'Mumbai',
      state: 'Maharashtra',
      bio: 'Sustainable styling enthusiast. Swapping festive lehengas and cocktail dresses.',
      avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
      rating: 5.0,
      swapCount: 14,
    },
    {
      name: 'Sameer Khan',
      email: 'sameer@rewear.org',
      password: defaultPasswordHash,
      city: 'Delhi',
      state: 'Delhi',
      bio: 'Vintage denim lover and cycling gear collector. Always open to reasonable trades.',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      rating: 4.7,
      swapCount: 6,
    },
    {
      name: 'Meera Nambiar',
      email: 'meera@rewear.org',
      password: defaultPasswordHash,
      city: 'Chennai',
      state: 'Tamil Nadu',
      bio: 'Organic cotton, linen sets, and pastel palazzos looking for new homes!',
      avatarUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80',
      rating: 4.8,
      swapCount: 5,
    },
    {
      name: 'Varun Nair',
      email: 'varun@rewear.org',
      password: defaultPasswordHash,
      city: 'Hyderabad',
      state: 'Telangana',
      bio: 'Casual streetwear and gym attire. Clean condition guaranteed.',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      rating: 4.5,
      swapCount: 3,
    },
    {
      name: 'Tanvi Kulkarni',
      email: 'tanvi@rewear.org',
      password: defaultPasswordHash,
      city: 'Pune',
      state: 'Maharashtra',
      bio: 'Handmade and upcycled clothing creator. Love creative barter exchanges.',
      avatarUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
      rating: 4.9,
      swapCount: 10,
    },
    {
      name: 'Nikhil Malhotra',
      email: 'nikhil@rewear.org',
      password: defaultPasswordHash,
      city: 'Delhi',
      state: 'Delhi',
      bio: 'Men’s formal shirts, blazers, and chinos. Great condition, barely worn.',
      avatarUrl: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=150&auto=format&fit=crop&q=80',
      rating: 4.7,
      swapCount: 4,
    },
    {
      name: 'Deepa Sundaram',
      email: 'deepa@rewear.org',
      password: defaultPasswordHash,
      city: 'Bengaluru',
      state: 'Karnataka',
      bio: 'Traditional Kanjeevarams, Ikats, and hand block print kurtis.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      rating: 5.0,
      swapCount: 9,
    },
  ];

  const createdUsers = [];
  for (const u of usersData) {
    const user = await prisma.user.create({ data: u });
    createdUsers.push(user);
  }
  console.log(`✅ Created ${createdUsers.length} users (including Admin).`);

  const priya = createdUsers.find((u) => u.email === 'priya@rewear.org');
  const rahul = createdUsers.find((u) => u.email === 'rahul@rewear.org');
  const ananya = createdUsers.find((u) => u.email === 'ananya@rewear.org');
  const rohan = createdUsers.find((u) => u.email === 'rohan@rewear.org');
  const sneha = createdUsers.find((u) => u.email === 'sneha@rewear.org');
  const vikram = createdUsers.find((u) => u.email === 'vikram@rewear.org');

  // 2. Create 52 Realistic Clothing Items with High-Res Images
  const clothingSeedData = [
    // Priya's items
    {
      owner: priya,
      title: "Levi's Classic Sherpa Denim Trucker Jacket",
      description: "Timeless trucker jacket with soft fleece lining and copper buttons. Worn only a few times during winter trips. In mint condition.",
      category: 'Jackets',
      brand: "Levi's",
      size: 'M',
      color: 'Indigo Blue',
      material: 'Denim & Fleece',
      condition: 'LIKE_NEW',
      purchaseAge: '< 6 months',
      estimatedValue: 2400,
      originalPrice: 4999,
      exchangePreferences: 'Looking for a warm oversized hoodie or bomber jacket',
      city: 'Hyderabad',
      state: 'Telangana',
      images: [
        'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
      ],
    },
    {
      owner: priya,
      title: 'FabIndia Hand-Block Printed Chanderi Kurta',
      description: 'Elegant flared Chanderi silk-cotton kurta with zari detailing on the neckline. Perfect for festivals and daytime celebrations.',
      category: 'Kurtas',
      brand: 'FabIndia',
      size: 'S',
      color: 'Emerald Green',
      material: 'Chanderi Silk',
      condition: 'EXCELLENT',
      purchaseAge: '6-12 months',
      estimatedValue: 1450,
      originalPrice: 2890,
      exchangePreferences: 'Handloom sarees, cotton co-ord sets, or linen tops',
      city: 'Hyderabad',
      state: 'Telangana',
      images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'],
    },
    {
      owner: priya,
      title: 'Zara Flowy Tiered Midi Summer Dress',
      description: 'Airy viscose tiered dress with ruffle straps and square neckline. Super breathable for humid days.',
      category: 'Dresses',
      brand: 'Zara',
      size: 'M',
      color: 'Terracotta Floral',
      material: 'Viscose / Rayon',
      condition: 'LIKE_NEW',
      purchaseAge: '< 6 months',
      estimatedValue: 1600,
      originalPrice: 3290,
      exchangePreferences: 'Denim skirts or formal trousers',
      city: 'Hyderabad',
      state: 'Telangana',
      images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80'],
    },

    // Rahul's items
    {
      owner: rahul,
      title: 'H&M Heavyweight Oversized Cotton Hoodie',
      description: 'Boxy streetwear silhouette in 450 GSM French Terry cotton. Clean ribbed cuffs and kangaroo pouch. Minimalist staple.',
      category: 'Hoodies',
      brand: 'H&M',
      size: 'L',
      color: 'Sage Green',
      material: 'Organic Cotton',
      condition: 'EXCELLENT',
      purchaseAge: '6-12 months',
      estimatedValue: 1350,
      originalPrice: 2299,
      exchangePreferences: 'Denim trucker jacket, chore coats, or straight fit jeans',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      images: [
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&auto=format&fit=crop&q=80',
      ],
    },
    {
      owner: rahul,
      title: 'Uniqlo U Crew Neck Relaxed T-Shirt',
      description: 'Designed by Christophe Lemaire in Paris. Durable compact cotton jersey with a structured collar that never loses shape.',
      category: 'T-Shirts',
      brand: 'Uniqlo',
      size: 'L',
      color: 'Off White',
      material: 'Cotton',
      condition: 'NEW_WITH_TAGS',
      purchaseAge: '< 6 months',
      estimatedValue: 800,
      originalPrice: 1290,
      exchangePreferences: 'Sportswear or casual caps/tees',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80'],
    },
    {
      owner: rahul,
      title: "Levi's 511 Slim Fit Selvedge Jeans",
      description: 'Raw indigo Japanese selvedge denim. Beautiful honeycombs forming naturally. Authentic red selvedge line inside hem.',
      category: 'Jeans',
      brand: "Levi's",
      size: '32',
      color: 'Raw Indigo',
      material: 'Denim',
      condition: 'EXCELLENT',
      purchaseAge: '1-2 years',
      estimatedValue: 1850,
      originalPrice: 4200,
      exchangePreferences: 'Utility cargo pants, leather accessories, or light jackets',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      images: ['https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=80'],
    },

    // Ananya's items (Mangalagiri)
    {
      owner: ananya,
      title: 'Authentic Mangalagiri Handloom Pure Cotton Saree',
      description: 'Woven locally in Mangalagiri with 80s count pure combed cotton. Features a gleaming Nizam zari border and contrasting mustard pallu.',
      category: 'Sarees',
      brand: 'Mangalagiri Handlooms',
      size: 'Free Size',
      color: 'Royal Maroon & Gold',
      material: 'Organic Cotton',
      condition: 'NEW_WITH_TAGS',
      purchaseAge: '< 6 months',
      estimatedValue: 2600,
      originalPrice: 3800,
      exchangePreferences: 'Silk sarees, tussar silk stoles, or festive kurtas',
      city: 'Mangalagiri',
      state: 'Andhra Pradesh',
      images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80'],
    },
    {
      owner: ananya,
      title: 'Kalamkari Hand-Painted Cotton Anarkali Kurta',
      description: 'Traditional floral and peacock motifs rendered with natural vegetable dyes. Includes side pockets and cotton lining.',
      category: 'Kurtas',
      brand: 'Biba',
      size: 'M',
      color: 'Indigo & Madder Red',
      material: 'Cotton',
      condition: 'LIKE_NEW',
      purchaseAge: '6-12 months',
      estimatedValue: 1300,
      originalPrice: 2499,
      exchangePreferences: 'Kurtas in size M or flared skirts',
      city: 'Mangalagiri',
      state: 'Andhra Pradesh',
      images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80'],
    },

    // Rohan's items (Guntur)
    {
      owner: rohan,
      title: 'Allen Solly Slim Fit Wrinkle-Resistant Formal Shirt',
      description: '100% Egyptian giza cotton twill weave shirt. Crisp spread collar, mother of pearl buttons. Barely worn for one presentation.',
      category: 'Shirts',
      brand: 'Allen Solly',
      size: '40',
      color: 'Sky Blue',
      material: 'Cotton',
      condition: 'LIKE_NEW',
      purchaseAge: '< 6 months',
      estimatedValue: 1100,
      originalPrice: 2199,
      exchangePreferences: 'Linen casual shirts or polo t-shirts',
      city: 'Guntur',
      state: 'Andhra Pradesh',
      images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80'],
    },
    {
      owner: rohan,
      title: 'Zara Relaxed Fit Pleated Linen Trousers',
      description: 'Double pleated front trousers with an elasticated back waistband for pure comfort in hot climates.',
      category: 'Trousers',
      brand: 'Zara',
      size: '32',
      color: 'Natural Sand',
      material: 'Linen',
      condition: 'EXCELLENT',
      purchaseAge: '6-12 months',
      estimatedValue: 1400,
      originalPrice: 2990,
      exchangePreferences: 'Chinos or casual blazers',
      city: 'Guntur',
      state: 'Andhra Pradesh',
      images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80'],
    },

    // Sneha's items (Hyderabad)
    {
      owner: sneha,
      title: 'Mango Pastel Floral Wrap Maxi Dress',
      description: 'Romantic French-inspired wrap dress with delicate ruffle trims and self-tie waist belt. Worn once for a garden party.',
      category: 'Dresses',
      brand: 'Mango',
      size: 'S',
      color: 'Powder Blue',
      material: 'Viscose / Rayon',
      condition: 'LIKE_NEW',
      purchaseAge: '< 6 months',
      estimatedValue: 1950,
      originalPrice: 4590,
      exchangePreferences: 'Summer slip dresses or trench coats',
      city: 'Hyderabad',
      state: 'Telangana',
      images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80'],
    },
    {
      owner: sneha,
      title: 'Nike Dri-FIT High-Rise Training Leggings & Crop Top Set',
      description: 'Breathable compressive activewear set featuring moisture-wicking four-way stretch fabric with side phone pockets.',
      category: 'Sportswear',
      brand: 'Nike',
      size: 'S',
      color: 'Olive Green',
      material: 'Polyester',
      condition: 'EXCELLENT',
      purchaseAge: '6-12 months',
      estimatedValue: 1750,
      originalPrice: 3895,
      exchangePreferences: 'Running shoes or sports jackets',
      city: 'Hyderabad',
      state: 'Telangana',
      images: ['https://images.unsplash.com/photo-1518459031867-a89b744b5623?w=600&auto=format&fit=crop&q=80'],
    },

    // Vikram's items (Bengaluru)
    {
      owner: vikram,
      title: 'Nike Windrunner Lightweight Running Windbreaker',
      description: 'Iconic 26-degree chevron design windbreaker with mesh back vent and packable hood. Water-repellent finish.',
      category: 'Jackets',
      brand: 'Nike',
      size: 'L',
      color: 'Black & Cool Grey',
      material: 'Polyester',
      condition: 'LIKE_NEW',
      purchaseAge: '< 6 months',
      estimatedValue: 2100,
      originalPrice: 4495,
      exchangePreferences: 'Fleece pullovers, hoodies or hiking outerwear',
      city: 'Bengaluru',
      state: 'Karnataka',
      images: ['https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=80'],
    },
    {
      owner: vikram,
      title: 'Uniqlo Extra Fine Merino Wool Crew Neck Sweater',
      description: 'Made from 100% 19.5-micron ultra-soft merino wool. Resists pilling and provides warmth without bulk.',
      category: 'Sweaters',
      brand: 'Uniqlo',
      size: 'L',
      color: 'Charcoal Heather',
      material: 'Wool',
      condition: 'EXCELLENT',
      purchaseAge: '6-12 months',
      estimatedValue: 1250,
      originalPrice: 2490,
      exchangePreferences: 'Cardigans or casual shirts',
      city: 'Bengaluru',
      state: 'Karnataka',
      images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80'],
    },
  ];

  // Extend with 38 more realistic diverse clothing items across all users
  const brands = ['Zara', 'FabIndia', "Levi's", 'H&M', 'Uniqlo', 'Allen Solly', 'Nike', 'Mango', 'Marks & Spencer', 'Manyavar', 'Westside'];
  const categories = ['Kurtas', 'Sarees', 'Shirts', 'T-Shirts', 'Jeans', 'Trousers', 'Jackets', 'Hoodies', 'Sweaters', 'Dresses', 'Sportswear', 'Tops'];
  const conditions = ['NEW_WITH_TAGS', 'LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR'];
  const sizes = ['S', 'M', 'L', 'XL', 'Free Size'];
  const colors = ['Navy Blue', 'Forest Green', 'Rust Orange', 'Mustard Yellow', 'Classic Black', 'Maroon', 'Beige', 'White'];
  const materials = ['Organic Cotton', 'Linen', 'Denim', 'Pure Silk', 'Wool', 'Viscose / Rayon'];
  
  const sampleImages = [
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600&auto=format&fit=crop&q=80',
  ];

  for (let i = 0; i < 38; i++) {
    const randomUser = createdUsers[(i + 3) % createdUsers.length];
    const brand = brands[i % brands.length];
    const category = categories[i % categories.length];
    const condition = conditions[i % conditions.length];
    const size = sizes[i % sizes.length];
    const color = colors[i % colors.length];
    const material = materials[i % materials.length];
    const val = 600 + ((i * 70) % 2200);

    clothingSeedData.push({
      owner: randomUser,
      title: `${brand} ${color} ${category.slice(0, -1) || category}`,
      description: `Gently loved authentic ${brand} garment in ${condition.toLowerCase().replace('_', ' ')} condition. Clean seams, no defects. Stored in a pet-free, smoke-free home.`,
      category,
      brand,
      size,
      color,
      material,
      condition,
      purchaseAge: i % 2 === 0 ? '< 6 months' : '1-2 years',
      estimatedValue: Math.round(val / 50) * 50,
      originalPrice: Math.round((val * 1.8) / 100) * 100,
      exchangePreferences: `Open to trade for ${categories[(i + 3) % categories.length]} or similar values`,
      city: randomUser.city,
      state: randomUser.state,
      images: [sampleImages[i % sampleImages.length]],
    });
  }

  const createdItems = [];
  for (const item of clothingSeedData) {
    const created = await prisma.clothingItem.create({
      data: {
        title: item.title,
        description: item.description,
        category: item.category,
        brand: item.brand,
        size: item.size,
        color: item.color,
        material: item.material,
        condition: item.condition,
        purchaseAge: item.purchaseAge,
        estimatedValue: item.estimatedValue,
        originalPrice: item.originalPrice,
        exchangePreferences: item.exchangePreferences,
        city: item.city,
        state: item.state,
        ownerId: item.owner.id,
        status: 'ACTIVE',
        images: {
          create: item.images.map((url, idx) => ({
            url,
            isPrimary: idx === 0,
            order: idx,
          })),
        },
      },
    });
    createdItems.push(created);
  }
  console.log(`✅ Created ${createdItems.length} clothing listings with images.`);

  // 3. Create 32 Swap Requests spanning all states
  const priyaJacket = createdItems[0];
  const rahulHoodie = createdItems[3];
  const ananyaSaree = createdItems[6];
  const rohanShirt = createdItems[8];
  const snehaDress = createdItems[10];
  const vikramWindbreaker = createdItems[12];

  // Main active swap between Priya and Rahul for end-to-end testing!
  const mainSwap = await prisma.swapRequest.create({
    data: {
      senderId: rahul.id,
      receiverId: priya.id,
      offeredItemId: rahulHoodie.id,
      requestedItemId: priyaJacket.id,
      status: 'NEGOTIATING',
      message: "Hey Priya! Would love to swap my H&M heavy hoodie for your Levi's denim trucker jacket. What do you think?",
      exchangeMethod: 'LOCAL_MEETUP',
      messages: {
        create: [
          {
            senderId: rahul.id,
            content: "Hey Priya! Would love to swap my H&M heavy hoodie for your Levi's denim trucker jacket. What do you think?",
            messageType: 'TEXT',
          },
          {
            senderId: priya.id,
            content: "Hi Rahul! Your hoodie looks super cozy and in great condition. I would be happy to swap! Are you available to meet near Inorbit Mall this weekend?",
            messageType: 'TEXT',
          },
          {
            senderId: rahul.id,
            content: "Yes, Saturday afternoon works perfectly for me. Let's do it!",
            messageType: 'TEXT',
          },
        ],
      },
    },
  });

  // Completed Swap (Ananya & Sneha) with completed reviews
  const completedSwap = await prisma.swapRequest.create({
    data: {
      senderId: sneha.id,
      receiverId: ananya.id,
      offeredItemId: snehaDress.id,
      requestedItemId: ananyaSaree.id,
      status: 'COMPLETED',
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      exchangeMethod: 'SHIPPING',
      senderReady: true,
      receiverReady: true,
      deliveryDetails: 'Shipped via BlueDart tracking #BD982341. Received smoothly.',
      messages: {
        create: [
          {
            senderId: sneha.id,
            content: "Hello Ananya, I'm enchanted by this Mangalagiri saree. Would you like my Mango floral wrap dress?",
            messageType: 'TEXT',
          },
          {
            senderId: ananya.id,
            content: "The Mango dress is gorgeous! Yes, let's exchange via courier.",
            messageType: 'TEXT',
          },
          {
            senderId: sneha.id,
            content: "Package received today. The saree is even more stunning in person! Thank you so much for an honest swap.",
            messageType: 'TEXT',
          },
        ],
      },
    },
  });

  // Reviews for completed swap
  await prisma.review.createMany({
    data: [
      {
        swapId: completedSwap.id,
        reviewerId: sneha.id,
        revieweeId: ananya.id,
        rating: 5,
        comment: 'An absolute pleasure swapping with Ananya! The Mangalagiri saree was packaged beautifully with tags. Highly recommended swapper.',
      },
      {
        swapId: completedSwap.id,
        reviewerId: ananya.id,
        revieweeId: sneha.id,
        rating: 5,
        comment: 'Sneha was prompt, warm, and the dress is in pristine condition. Zero-waste fashion at its best!',
      },
    ],
  });

  // Additional swaps in various states
  const statuses = ['PENDING', 'ACCEPTED', 'SHIPPING', 'READY_FOR_EXCHANGE', 'REJECTED', 'DISPUTED', 'CANCELLED'];
  for (let i = 0; i < 30; i++) {
    const sId = createdUsers[(i + 1) % createdUsers.length].id;
    const rId = createdUsers[(i + 5) % createdUsers.length].id;
    const offItem = createdItems[(i + 5) % createdItems.length];
    const reqItem = createdItems[(i + 15) % createdItems.length];
    const status = statuses[i % statuses.length];

    if (offItem.id !== reqItem.id && sId !== rId) {
      await prisma.swapRequest.create({
        data: {
          senderId: sId,
          receiverId: rId,
          offeredItemId: offItem.id,
          requestedItemId: reqItem.id,
          status,
          message: `Hi, checking if you would like to swap your ${reqItem.title} with my ${offItem.title}.`,
          exchangeMethod: i % 2 === 0 ? 'LOCAL_MEETUP' : 'SHIPPING',
          messages: {
            create: [
              {
                senderId: sId,
                content: `Hi, checking if you would like to swap your ${reqItem.title} with my ${offItem.title}.`,
                messageType: 'TEXT',
              },
            ],
          },
        },
      });
    }
  }
  console.log('✅ Created 32+ swap requests with message threads and reviews.');

  // 4. Create 25 Saved Wishlist Items
  for (let i = 0; i < 25; i++) {
    const user = createdUsers[i % createdUsers.length];
    const item = createdItems[(i + 7) % createdItems.length];
    if (user.id !== item.ownerId) {
      await prisma.savedItem.upsert({
        where: { userId_clothingId: { userId: user.id, clothingId: item.id } },
        update: {},
        create: { userId: user.id, clothingId: item.id },
      });
    }
  }
  console.log('✅ Seeded wishlist saved items.');

  // 5. Create 15 Notifications
  const notifTypes = [
    { type: 'SWAP_REQUEST', title: 'New Swap Proposal! 👕⇄👕', msg: 'Rahul Verma wants to swap their hoodie for your denim jacket.', link: `/swaps?tab=incoming&id=${mainSwap.id}` },
    { type: 'SWAP_ACCEPTED', title: 'Swap Accepted! 🎉', msg: 'Your swap request for the Floral Dress was accepted.', link: `/swaps` },
    { type: 'MESSAGE', title: 'New message from Priya', msg: "Yes, Saturday afternoon works perfectly for me!", link: `/chat/${mainSwap.id}` },
    { type: 'SWAP_COMPLETED', title: 'Swap Completed! 🌱', msg: 'Congratulations on keeping clothes in circulation. Leave a review!', link: `/swaps` },
  ];

  for (let i = 0; i < 15; i++) {
    const u = createdUsers[i % 5];
    const n = notifTypes[i % notifTypes.length];
    await prisma.notification.create({
      data: {
        userId: u.id,
        type: n.type,
        title: n.title,
        message: n.msg,
        link: n.link,
        isRead: i > 5,
      },
    });
  }
  console.log('✅ Seeded user notifications.');

  // 6. Create 6 Reports & Disputes
  const reportReasons = [
    'MISLEADING_DESCRIPTION',
    'WRONG_CONDITION',
    'INAPPROPRIATE_CONTENT',
    'FRAUDULENT_BEHAVIOR',
  ];

  for (let i = 0; i < 6; i++) {
    await prisma.report.create({
      data: {
        reporterId: createdUsers[(i + 4) % createdUsers.length].id,
        reportedListingId: createdItems[(i + 10) % createdItems.length].id,
        reason: reportReasons[i % reportReasons.length],
        description: 'Listing condition claimed to be Like New but photos reveal slight frayed stitching near pocket.',
        status: i === 0 ? 'RESOLVED' : i === 1 ? 'UNDER_REVIEW' : 'OPEN',
        adminNotes: i === 0 ? 'Contacted seller to update condition description to GOOD.' : null,
      },
    });
  }
  console.log('✅ Seeded reports and dispute records.');

  console.log('🎉 ReWear database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
