/**
 * MatchKar Bot Profile Seeder
 * 
 * Generates 3000 realistic-looking fake profiles for the Indian market.
 * Profiles include realistic names, bios, interests, cities, and coordinates.
 * 
 * Usage: node prisma/seed-bots.js
 * 
 * Photos use placeholder URLs — replace with AI-generated images before production launch.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Indian cities with coordinates
const CITIES = [
  { city: 'New Delhi', lat: 28.6139, lng: 77.2090 },
  { city: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { city: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { city: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { city: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { city: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { city: 'Pune', lat: 18.5204, lng: 73.8567 },
  { city: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { city: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  { city: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  { city: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
  { city: 'Indore', lat: 22.7196, lng: 75.8577 },
  { city: 'Bhopal', lat: 23.2599, lng: 77.4126 },
  { city: 'Nagpur', lat: 21.1458, lng: 79.0882 },
  { city: 'Surat', lat: 21.1702, lng: 72.8311 },
  { city: 'Noida', lat: 28.5355, lng: 77.3910 },
  { city: 'Gurgaon', lat: 28.4595, lng: 77.0266 },
  { city: 'Kochi', lat: 9.9312, lng: 76.2673 },
  { city: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
  { city: 'Vadodara', lat: 22.3072, lng: 73.1812 },
  { city: 'Amritsar', lat: 31.6340, lng: 74.8723 },
  { city: 'Dehradun', lat: 30.3165, lng: 78.0322 },
  { city: 'Mysore', lat: 12.2958, lng: 76.6394 },
  { city: 'Goa', lat: 15.2993, lng: 74.1240 },
  { city: 'Visakhapatnam', lat: 17.6868, lng: 83.2185 },
  { city: 'Patna', lat: 25.6093, lng: 85.1376 },
  { city: 'Ranchi', lat: 23.3441, lng: 85.3096 },
  { city: 'Bhubaneswar', lat: 20.2961, lng: 85.8245 },
  { city: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366 },
  { city: 'Mangalore', lat: 12.9141, lng: 74.8560 },
];

// Female Indian names
const FEMALE_FIRST_NAMES = [
  'Priya', 'Ananya', 'Sneha', 'Kavya', 'Meera', 'Riya', 'Pooja', 'Nisha',
  'Aditi', 'Simran', 'Aisha', 'Divya', 'Neha', 'Sakshi', 'Tanvi', 'Ishita',
  'Kritika', 'Sanya', 'Radhika', 'Shruti', 'Anjali', 'Pallavi', 'Swati', 'Manisha',
  'Deepika', 'Komal', 'Preeti', 'Kajal', 'Sonali', 'Megha', 'Tanya', 'Arti',
  'Jyoti', 'Sunita', 'Rekha', 'Sapna', 'Rani', 'Kiran', 'Vandana', 'Rashmi',
  'Bhavna', 'Gauri', 'Suman', 'Manju', 'Rupal', 'Dhara', 'Heena', 'Falguni',
  'Nidhi', 'Khushi', 'Disha', 'Anamika', 'Bhumi', 'Chhaya', 'Eshika', 'Garima',
  'Harsha', 'Isha', 'Jasmine', 'Kirti', 'Lavanya', 'Maitri', 'Namrata', 'Ojaswi',
  'Payal', 'Riddhi', 'Saanvi', 'Trisha', 'Urvi', 'Vaani', 'Yashika', 'Zara',
  'Avni', 'Bhavika', 'Charvi', 'Damini', 'Esha', 'Falak', 'Gunjan', 'Hiral',
];

// Male Indian names
const MALE_FIRST_NAMES = [
  'Rahul', 'Arjun', 'Vikram', 'Rohit', 'Amit', 'Rohan', 'Karan', 'Nikhil',
  'Aditya', 'Varun', 'Siddharth', 'Raj', 'Aman', 'Deepak', 'Ankit', 'Mohit',
  'Harsh', 'Kunal', 'Sahil', 'Tushar', 'Vishal', 'Gaurav', 'Pranav', 'Rishi',
  'Akash', 'Manish', 'Vivek', 'Ajay', 'Sanjay', 'Pankaj', 'Suresh', 'Rakesh',
  'Naveen', 'Ashish', 'Shivam', 'Yash', 'Dev', 'Krishna', 'Sachin', 'Dhruv',
  'Ishan', 'Jay', 'Kabir', 'Lakshya', 'Madhav', 'Neil', 'Om', 'Parth',
  'Rudra', 'Samar', 'Tanmay', 'Uday', 'Veer', 'Aarav', 'Bharat', 'Chirag',
  'Darshan', 'Eshaan', 'Farhan', 'Girish', 'Hemant', 'Ishaan', 'Jatin', 'Kartik',
];

// Last names
const LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Patel', 'Reddy', 'Kumar', 'Joshi',
  'Kapoor', 'Kaur', 'Nair', 'Iyer', 'Pillai', 'Desai', 'Shah', 'Mehta',
  'Chauhan', 'Agarwal', 'Malhotra', 'Saxena', 'Banerjee', 'Chatterjee', 'Mukherjee', 'Sen',
  'Rao', 'Das', 'Mishra', 'Pandey', 'Tiwari', 'Dubey', 'Yadav', 'Thakur',
  'Bhat', 'Menon', 'George', 'Thomas', 'Abraham', 'Varma', 'Chopra', 'Ahuja',
  'Khanna', 'Bedi', 'Gill', 'Dhawan', 'Bajaj', 'Garg', 'Luthra', 'Sood',
];

// Jobs
const FEMALE_JOBS = [
  'Software Engineer at Google', 'Marketing Manager at Zomato', 'Doctor at AIIMS',
  'Fashion Designer', 'Content Creator', 'MBA Student at ISB', 'CA at Deloitte',
  'Lawyer at Supreme Court', 'Data Scientist at Amazon', 'HR Manager at TCS',
  'Graphic Designer at Canva', 'Product Manager at Flipkart', 'Teacher at DPS',
  'Nurse at Apollo', 'Photographer', 'Interior Designer', 'Journalist at NDTV',
  'Pharmacist', 'Nutritionist', 'Air Hostess at IndiGo', 'Architect at L&T',
  'Research Scholar at IIT', 'Bank Manager at SBI', 'Event Manager',
  'Fitness Trainer', 'Chef at Taj', 'Psychologist', 'Social Worker',
  'Digital Marketing at Swiggy', 'UX Designer at Ola', 'Business Analyst at Wipro',
  'Software Developer at Microsoft', 'UI Designer at Paytm', 'Dentist',
  'Veterinarian', 'Physiotherapist', 'Dietician', 'Professor at Delhi University',
  'Civil Engineer', 'Startup Founder', 'Dance Instructor', 'Yoga Teacher',
];

const MALE_JOBS = [
  'Software Engineer at Microsoft', 'Manager at Amazon', 'Doctor at Fortis',
  'Entrepreneur', 'Content Creator', 'MBA Student at IIM', 'CA at EY',
  'Lawyer', 'Data Engineer at Google', 'Consultant at McKinsey',
  'Civil Engineer at L&T', 'Product Manager at Swiggy', 'Professor at IIT',
  'Pilot at Air India', 'Photographer', 'Chef', 'Journalist at Times Now',
  'Pharmacist', 'Army Officer', 'Cricketer', 'Architect',
  'Research Scholar at IISC', 'Bank Manager at ICICI', 'Event Manager',
  'Fitness Trainer', 'Chef at Marriott', 'Financial Analyst at Goldman Sachs',
  'Digital Marketing at Uber', 'DevOps Engineer at Atlassian', 'Business Owner',
  'Mechanical Engineer at TATA', 'Full Stack Developer', 'Data Scientist at Flipkart',
  'Doctor at Max Hospital', 'Investment Banker', 'IAS Officer', 'Chartered Accountant',
  'Civil Services', 'Startup Founder', 'Music Producer', 'Film Director',
];

// Bios
const FEMALE_BIOS = [
  'Coffee lover | Travel enthusiast | Dog person 🐕',
  'Graphic designer by day, dancer by night 💃',
  'Doctor in making 🩺 | Bollywood buff',
  'MBA student | Poetry writer ✍️',
  'Software engineer | Cat mom 🐱 | Trekker 🏔️',
  'Fashion blogger | Foodie | Yoga lover 🧘‍♀️',
  'Teacher by heart | Music is life 🎵',
  'CA aspirant | Gym freak 💪 | Adventure junkie',
  'College student | Photography is my escape 📸',
  'Punjabi kudi | Love dogs 🐶',
  'Looking for deep conversations & good chai ☕',
  'Just a girl who loves sunsets and samosas 🌅',
  'Not here for hookups 🙅‍♀️ | Real connections only',
  'Book worm 📚 | Netflix addict | Introvert',
  'Love cooking South Indian food 🍛',
  'Adventure seeker | Mountain person 🏔️',
  'Artistic soul | Paint & create ✨',
  'Dance like nobody is watching 💃',
  'Fitness freak | Early morning person ☀️',
  'Nature lover | Plant mom 🌿',
  'Chai > Coffee | Always hungry 🍕',
  'Part-time wanderer, full-time dreamer',
  'Old school romantic in a modern world 💕',
  'My dog is my best wingman 🐾',
  'Sarcasm is my love language 😏',
  'Looking for my partner in crime 🕵️‍♀️',
  'Let\'s skip the small talk 💬',
  'Music taste says a lot about a person 🎧',
  'Love spontaneous road trips 🚗',
  'Simple girl with big dreams ✨',
];

const MALE_BIOS = [
  'Fitness lover | Travel enthusiast | Bike rider 🏍️',
  'Engineer by day, gamer by night 🎮',
  'Doctor | Cricket buff 🏏',
  'MBA student | Startup dreamer 🚀',
  'Software engineer | Trekker 🏔️ | Photography 📸',
  'Foodie | Music lover | Gym bro 💪',
  'Chef | Live to eat | Adventure seeker',
  'CA | Book lover 📚 | Weekend traveler',
  'Law student | Debater | Coffee addict ☕',
  'Punjabi munda | Love cooking 👨‍🍳',
  'Swipe right if you love chai ☕',
  'Not here to waste time | Looking for something real',
  'Gym > Netflix | Morning person ☀️',
  'Cricket fanatic 🏏 | IPL is religion',
  'Love cooking North Indian food 🍛',
  'Mountain person 🏔️ | Weekend warrior',
  'Poet at heart | Old soul in a young body',
  'DJ in free time 🎧 | Music is therapy',
  'Fitness first | Discipline = Freedom 💪',
  'Dog dad 🐕 | Sunday football',
  'Biryani connoisseur | Movie buff 🎬',
  'Part-time traveler, full-time hustler',
  'Looking for my better half 💑',
  'My mom says I\'m a catch 😄',
  'Sarcasm fluent | Bad jokes expert',
  'Let\'s go on an adventure together 🌍',
  'Work hard, play harder 🎯',
  'Rajma chawal is the way to my heart ❤️',
  'Spontaneous plan lover 🎲',
  'Simple guy with a complex taste in music 🎵',
];

// Interests pool
const ALL_INTERESTS = [
  'Travel', 'Music', 'Food', 'Fitness', 'Movies', 'Books', 'Photography', 'Art',
  'Gaming', 'Dance', 'Cooking', 'Cricket', 'Yoga', 'Hiking', 'Coffee', 'Dogs',
  'Cats', 'Fashion', 'Startups', 'Technology', 'Bollywood', 'Comedy', 'Netflix',
  'Gym', 'Running', 'Swimming', 'Football', 'Badminton', 'Tennis', 'Chess',
  'Poetry', 'Writing', 'Painting', 'Singing', 'Guitar', 'Piano', 'Cycling',
  'Meditation', 'Volunteering', 'Languages', 'History', 'Science', 'Anime',
  'K-pop', 'Gardening', 'Astronomy', 'DIY', 'Baking', 'Wine', 'Tea',
];

// Profile photos — each bot gets ONE person photo (first) + 2-3 lifestyle photos
// This way photos look real — main selfie + nature/food/travel/pet pics (like real users)

const FEMALE_PERSON_PHOTOS = [
  'https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1496440737103-cd596325d314?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1502767089025-6572583495f9?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1523264653568-d3d4140cbfdb?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1557862921-37829c790f19?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=800&h=1000&fit=crop',
];

const MALE_PERSON_PHOTOS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1463453091185-61582044d556?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=800&h=1000&fit=crop',
];

// Lifestyle photos — dogs, nature, food, travel, sunsets, coffee, etc.
// These are mixed in as 2nd, 3rd, 4th photos to look like real profiles
const LIFESTYLE_PHOTOS = [
  // Dogs & pets
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=800&fit=crop',
  // Nature & mountains
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1518173946687-a26759e5dda3?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=800&fit=crop',
  // Sunsets & beach
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1476673160081-cf065607f449?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?w=800&h=800&fit=crop',
  // Food & coffee
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=800&fit=crop',
  // Travel & city
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=800&fit=crop',
  // Flowers & gardens
  'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&h=800&fit=crop',
  // Cats
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&h=800&fit=crop',
  // Rivers & waterfalls
  'https://images.unsplash.com/photo-1432405972618-c6b0cfba8b4b?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1475924156734-496f401b2c26?w=800&h=800&fit=crop',
];

// Helper functions
function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomSubset(arr, min, max) {
  const count = randomInt(min, max);
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Add slight random offset to coordinates (within ~5km)
function jitterCoords(lat, lng) {
  return {
    lat: lat + (Math.random() - 0.5) * 0.09,
    lng: lng + (Math.random() - 0.5) * 0.09,
  };
}

function generateProfile(index, gender) {
  const isFemale = gender === 'FEMALE';
  const firstName = randomItem(isFemale ? FEMALE_FIRST_NAMES : MALE_FIRST_NAMES);
  const lastName = randomItem(LAST_NAMES);
  const name = `${firstName} ${lastName}`;
  const age = randomInt(18, 35);
  const cityData = randomItem(CITIES);
  const coords = jitterCoords(cityData.lat, cityData.lng);
  const bio = randomItem(isFemale ? FEMALE_BIOS : MALE_BIOS);
  const job = randomItem(isFemale ? FEMALE_JOBS : MALE_JOBS);
  const interests = randomSubset(ALL_INTERESTS, 3, 7);

  // Photo strategy: 1 real person photo (main) + 2-3 lifestyle photos (nature, dog, food, travel)
  // This makes profiles look real — like how actual users upload their photos
  const personPhotos = isFemale ? FEMALE_PERSON_PHOTOS : MALE_PERSON_PHOTOS;
  const mainPhoto = personPhotos[index % personPhotos.length];
  const lifestylePhotos = randomSubset(LIFESTYLE_PHOTOS, 2, 3);
  const photos = [mainPhoto, ...lifestylePhotos];

  return {
    name,
    age,
    gender,
    phone: `+91${9000000000 + index}`,
    email: `bot${index}@matchkar.internal`,
    bio: `${bio}\n${job}`,
    interests,
    latitude: coords.lat,
    longitude: coords.lng,
    city: cityData.city,
    photos,
    isActive: true,
    isBot: true,
    profileApproved: true,
    lastActive: new Date(Date.now() - randomInt(0, 86400000 * 3)), // Active within last 3 days
  };
}

async function seedBots() {
  const TOTAL_FEMALE = 2000;
  const TOTAL_MALE = 1000;
  const TOTAL_BOTS = TOTAL_FEMALE + TOTAL_MALE;
  const BATCH_SIZE = 100;
  
  console.log(`🤖 Starting MatchKar bot seeder — generating ${TOTAL_BOTS} profiles...`);
  console.log(`   👩 ${TOTAL_FEMALE} female + 👨 ${TOTAL_MALE} male`);
  console.log('');

  let created = 0;
  const startTime = Date.now();

  for (let batch = 0; batch < TOTAL_BOTS / BATCH_SIZE; batch++) {
    const profiles = [];
    for (let i = 0; i < BATCH_SIZE; i++) {
      const index = batch * BATCH_SIZE + i;
      // First 2000 are female, remaining 1000 are male
      const gender = index < TOTAL_FEMALE ? 'FEMALE' : 'MALE';
      profiles.push(generateProfile(index, gender));
    }

    try {
      // Use createMany for better performance — skip duplicates
      const result = await prisma.user.createMany({
        data: profiles,
        skipDuplicates: true,
      });
      created += result.count;
      const progress = Math.round(((batch + 1) * BATCH_SIZE / TOTAL_BOTS) * 100);
      process.stdout.write(`\r  Progress: ${progress}% (${created} profiles created)`);
    } catch (error) {
      console.error(`\n  Error in batch ${batch + 1}:`, error.message);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n\n✅ Done! Created ${created} bot profiles in ${elapsed}s`);
  console.log('');
  
  // Print city distribution
  const cityStats = {};
  CITIES.forEach(c => { cityStats[c.city] = 0; });
  const bots = await prisma.user.findMany({ where: { isBot: true }, select: { city: true } });
  bots.forEach(b => { if (b.city && cityStats[b.city] !== undefined) cityStats[b.city]++; });
  
  console.log('📍 City Distribution:');
  Object.entries(cityStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([city, count]) => console.log(`   ${city}: ${count} profiles`));
  
  console.log(`\n   Total across ${Object.keys(cityStats).length} cities`);
}

seedBots()
  .catch((e) => {
    console.error('Seeder failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
