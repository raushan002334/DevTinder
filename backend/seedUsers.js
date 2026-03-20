const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/user');
const connectDB = require('./src/config/database');

const MOCK_USERS = [
  {
    firstName: "Aarav",
    lastName: "Sharma",
    emailId: "aarav.sharma@example.com",
    password: "Password@123",
    age: 24,
    gender: "male",
    photoURL: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=500&auto=format&fit=crop",
    about: "Full stack developer specializing in React and Node.js. Love building scalable web apps.",
    skills: ["React", "Node.js", "MongoDB", "Tailwind"]
  },
  {
    firstName: "Ishani",
    lastName: "Verma",
    emailId: "ishani.v@example.com",
    password: "Password@123",
    age: 22,
    gender: "female",
    photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500&auto=format&fit=crop",
    about: "UI/UX enthusiast and frontend developer. I make things look pretty and functional.",
    skills: ["Figma", "React", "CSS", "TypeScript"]
  },
  {
    firstName: "Kabir",
    lastName: "Singh",
    emailId: "kabir.dev@example.com",
    password: "Password@123",
    age: 27,
    gender: "male",
    photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop",
    about: "Backend architect and Python wizard. Scaling systems is my passion.",
    skills: ["Python", "Django", "PostgreSQL", "AWS"]
  },
  {
    firstName: "Anika",
    lastName: "Gupta",
    emailId: "anika.g@example.com",
    password: "Password@123",
    age: 25,
    gender: "female",
    photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop",
    about: "Data Scientist by day, open source contributor by night. Let's talk AI.",
    skills: ["Python", "TensorFlow", "Scikit-Learn", "SQL"]
  },
  {
    firstName: "Rohan",
    lastName: "Mehta",
    emailId: "rohan.m@example.com",
    password: "Password@123",
    age: 23,
    gender: "male",
    photoURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=500&auto=format&fit=crop",
    about: "Mobile developer creating smooth experiences in Flutter and Swift.",
    skills: ["Flutter", "Dart", "Swift", "Firebase"]
  },
  {
    firstName: "Sara",
    lastName: "Khan",
    emailId: "sara.k@example.com",
    password: "Password@123",
    age: 24,
    gender: "female",
    photoURL: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=500&auto=format&fit=crop",
    about: "Clouds architect helping companies move to the edge. Serverless fan.",
    skills: ["AWS", "Terraform", "Docker", "Kubernetes"]
  },
  {
    firstName: "Vihaan",
    lastName: "Desai",
    emailId: "vihaan.d@example.com",
    password: "Password@123",
    age: 26,
    gender: "male",
    photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop",
    about: "Cybersecurity expert. Protecting the web one line of code at a time.",
    skills: ["Go", "Rust", "Penetration Testing", "Linux"]
  },
  {
    firstName: "Tanya",
    lastName: "Jain",
    emailId: "tanya.j@example.com",
    password: "Password@123",
    age: 21,
    gender: "female",
    photoURL: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=500&auto=format&fit=crop",
    about: "Junior dev excited about Web3 and Blockchain. Let's decentralize everything.",
    skills: ["Solidity", "Ether.js", "JavaScript", "React"]
  },
  {
    firstName: "Arjun",
    lastName: "Patel",
    emailId: "arjun.p@example.com",
    password: "Password@123",
    age: 28,
    gender: "male",
    photoURL: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=500&auto=format&fit=crop",
    about: "Principal engineer at a fintech startup. I enjoy mentoring and clean code.",
    skills: ["Java", "Spring Boot", "Kafka", "Microservices"]
  },
  {
    firstName: "Myra",
    lastName: "Reddy",
    emailId: "myra.r@example.com",
    password: "Password@123",
    age: 25,
    gender: "female",
    photoURL: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=500&auto=format&fit=crop",
    about: "Product manager with a technical heart. Bridge between business and code.",
    skills: ["Product Roadmap", "Agile", "SQL", "User Testing"]
  },
  {
    firstName: "Aditya",
    lastName: "Iyer",
    emailId: "aditya.i@example.com",
    password: "Password@123",
    age: 24,
    gender: "male",
    photoURL: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=500&auto=format&fit=crop",
    about: "Embedded systems engineer with hobby in Arduino and Raspberry Pi.",
    skills: ["C", "C++", "Electronics", "RTOS"]
  },
  {
    firstName: "Riya",
    lastName: "Kapoor",
    emailId: "riya.k@example.com",
    password: "Password@123",
    age: 23,
    gender: "female",
    photoURL: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=500&auto=format&fit=crop",
    about: "Creative technologist exploring AR/VR possibilities for the future.",
    skills: ["Unity", "Three.js", "C#", "Blender"]
  },
  {
    firstName: "Dev",
    lastName: "Malhotra",
    emailId: "dev.m@example.com",
    password: "Password@123",
    age: 26,
    gender: "male",
    photoURL: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=500&auto=format&fit=crop",
    about: "Performance engineer obsessed with making websites load in 0.1 seconds.",
    skills: ["Next.js", "Vercel", "Web Vitals", "GraphQL"]
  },
  {
    firstName: "Kiara",
    lastName: "Bose",
    emailId: "kiara.b@example.com",
    password: "Password@123",
    age: 24,
    gender: "female",
    photoURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500&auto=format&fit=crop",
    about: "Full stack dev with love for functional programming and Elixir.",
    skills: ["Elixir", "Phoenix", "Ruby on Rails", "PostgreSQL"]
  },
  {
    firstName: "Aryan",
    lastName: "Choudhary",
    emailId: "aryan.c@example.com",
    password: "Password@123",
    age: 25,
    gender: "male",
    photoURL: "https://images.unsplash.com/photo-1542178243-bc20204b7694?q=80&w=500&auto=format&fit=crop",
    about: "DevOps specialist automating everything in sight. Jenkins is my best friend.",
    skills: ["Jenkins", "GitLab CI", "Prometheus", "Azure"]
  },
  {
    firstName: "Zoya",
    lastName: "Ansari",
    emailId: "zoya.a@example.com",
    password: "Password@123",
    age: 22,
    gender: "female",
    photoURL: "https://images.unsplash.com/photo-148842177ece5-389fb172652?q=80&w=500&auto=format&fit=crop",
    about: "Frontend wizard conjuring animations with GSAP and Framer Motion.",
    skills: ["GSAP", "Framer Motion", "React", "Three.js"]
  },
  {
    firstName: "Samrat",
    lastName: "Yadav",
    emailId: "samrat.y@example.com",
    password: "Password@123",
    age: 29,
    gender: "male",
    photoURL: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=500&auto=format&fit=crop",
    about: "Tech lead at a major bank. Managing large scale legacy migrations.",
    skills: ["Mainframe", "Java", "Python", "Cloud Migration"]
  },
  {
    firstName: "Navya",
    lastName: "Kaur",
    emailId: "navya.k@example.com",
    password: "Password@123",
    age: 21,
    gender: "female",
    photoURL: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=500&auto=format&fit=crop",
    about: "CS student looking for interships. I love competitive programming.",
    skills: ["C++", "Algorithms", "Data Structures", "Python"]
  },
  {
    firstName: "Ranveer",
    lastName: "Bhasin",
    emailId: "ranveer.b@example.com",
    password: "Password@123",
    age: 27,
    gender: "male",
    photoURL: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=500&auto=format&fit=crop",
    about: "System admin turned SRE. I live in the terminal.",
    skills: ["Bash", "Linux", "Go", "Ansible"]
  },
  {
    firstName: "Nisha",
    lastName: "Dutta",
    emailId: "nisha.d@example.com",
    password: "Password@123",
    age: 25,
    gender: "female",
    photoURL: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=500&auto=format&fit=crop",
    about: "QA engineer with focus on automated testing and user reliability.",
    skills: ["Cypress", "Selenium", "Jest", "TDD"]
  }
];

const seedUsers = async () => {
  try {
    await connectDB();
    console.log("Database connected for seeding...");

    // CLEANUP: Force delete all mock users first to ensure we start fresh
    const cleanResult = await User.deleteMany({ emailId: { $regex: /example/i } });
    console.log(`Cleaned up ${cleanResult.deletedCount} legacy mock users.`);
    
    // Check for existing users
    const count = await User.countDocuments();
    console.log(`Remaining user count (your accounts): ${count}`);

    const salt = await bcrypt.genSalt(10);

    for (const userData of MOCK_USERS) {
      // Hash password before saving
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      const newUser = new User({
        ...userData,
        password: hashedPassword
      });
      await newUser.save();
      console.log(`Added: ${userData.firstName} ${userData.lastName}`);
    }

    console.log("Seeding completed successfully with HASHED passwords!");
    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

seedUsers();
