const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sampleUsers = [
  {
    name: 'Priya Sharma',
    age: 24,
    gender: 'FEMALE',
    bio: 'Coffee lover | Travel enthusiast | Dog person 🐕',
    photos: ['https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=400'],
    interests: ['Travel', 'Photography', 'Coffee', 'Dogs', 'Music'],
    latitude: 28.6139,
    longitude: 77.2090,
    city: 'New Delhi',
    phone: '+919876543210',
    isActive: true,
    profileApproved: true,
  },
  {
    name: 'Rahul Verma',
    age: 27,
    gender: 'MALE',
    bio: 'Startup founder | Fitness freak | Foodie | Looking for something real',
    photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
    interests: ['Fitness', 'Startups', 'Food', 'Movies', 'Cricket'],
    latitude: 28.6200,
    longitude: 77.2100,
    city: 'New Delhi',
    phone: '+919876543211',
    isActive: true,
    profileApproved: true,
  },
  {
    name: 'Ananya Gupta',
    age: 23,
    gender: 'FEMALE',
    bio: 'Graphic designer by day, dancer by night 💃 Swipe right if you love art',
    photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'],
    interests: ['Art', 'Dance', 'Design', 'Netflix', 'Yoga'],
    latitude: 28.6300,
    longitude: 77.2200,
    city: 'New Delhi',
    phone: '+919876543212',
    isActive: true,
    profileApproved: true,
  },
  {
    name: 'Arjun Singh',
    age: 26,
    gender: 'MALE',
    bio: 'Software engineer | Guitarist | Chai > Coffee ☕',
    photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'],
    interests: ['Coding', 'Guitar', 'Chai', 'Hiking', 'Books'],
    latitude: 26.9124,
    longitude: 75.7873,
    city: 'Jaipur',
    phone: '+919876543213',
    isActive: true,
    profileApproved: true,
  },
  {
    name: 'Sneha Patel',
    age: 25,
    gender: 'FEMALE',
    bio: 'Doctor in making | Love cooking | Bollywood movie buff',
    photos: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400'],
    interests: ['Medical', 'Cooking', 'Bollywood', 'Reading', 'Travel'],
    latitude: 19.0760,
    longitude: 72.8777,
    city: 'Mumbai',
    phone: '+919876543214',
    isActive: true,
    profileApproved: true,
  },
  {
    name: 'Vikram Malhotra',
    age: 28,
    gender: 'MALE',
    bio: 'Photographer | Adventure seeker | Let\'s explore the world together',
    photos: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'],
    interests: ['Photography', 'Adventure', 'Travel', 'Bikes', 'Mountains'],
    latitude: 12.9716,
    longitude: 77.5946,
    city: 'Bangalore',
    phone: '+919876543215',
    isActive: true,
    profileApproved: true,
  },
  {
    name: 'Kavya Reddy',
    age: 22,
    gender: 'FEMALE',
    bio: 'MBA student | Poetry writer | Old Bollywood songs lover',
    photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'],
    interests: ['Poetry', 'Business', 'Music', 'Writing', 'Fashion'],
    latitude: 17.3850,
    longitude: 78.4867,
    city: 'Hyderabad',
    phone: '+919876543216',
    isActive: true,
    profileApproved: true,
  },
  {
    name: 'Rohit Kapoor',
    age: 29,
    gender: 'MALE',
    bio: 'CA by profession | Stand-up comedy fan | Biryani lover',
    photos: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400'],
    interests: ['Finance', 'Comedy', 'Food', 'Cricket', 'Gaming'],
    latitude: 28.5355,
    longitude: 77.3910,
    city: 'Noida',
    phone: '+919876543217',
    isActive: true,
    profileApproved: true,
  },
  {
    name: 'Admin User',
    age: 30,
    gender: 'MALE',
    bio: 'App Administrator',
    photos: [],
    interests: [],
    latitude: 28.6139,
    longitude: 77.2090,
    city: 'New Delhi',
    phone: '+919999999999',
    email: 'admin@sparkdating.com',
    isActive: true,
    isAdmin: true,
    profileApproved: true,
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  for (const userData of sampleUsers) {
    await prisma.user.upsert({
      where: { phone: userData.phone },
      update: userData,
      create: userData,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${sampleUsers.length} users`);
  console.log('Admin login: +919999999999');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
