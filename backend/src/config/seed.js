const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../model/user.model");
const Post = require("../model/post.model");
const slugify = require("slugify");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB for seeding...");

    const adminEmail = "admin@tinne.in"; // You can change this
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin user already exists.");
    } else {
      const adminUser = await User.create({
        fullName: "System Admin",
        email: adminEmail,
        password: "AdminPassword123", // You should change this immediately after login
        phoneNo: "0000000000",
        role: "admin",
        addresses: [
          {
            address1: "Admin Office",
            state: "Tamil Nadu",
            district: "Perambalur",
            pincode: "621117",
            isPrimary: true
          }
        ]
      });

      console.log("Admin user created successfully!");
      console.log("Email: " + adminEmail);
      console.log("Password: AdminPassword123");
    }

    // --- SEED BLOG POSTS ---
    const existingPosts = await Post.countDocuments();
    if (existingPosts === 0) {
      console.log("Seeding initial blog posts...");
      const posts = [
        {
          title: "The Benefits of Traditional Millets",
          category: "Health",
          excerpt: "Discover why millets are becoming the new superfood for a healthy lifestyle.",
          content: "<p>Millets are a group of highly variable small-seeded grasses, widely grown around the world as cereal crops or grains for fodder and human food. They are rich in fiber and essential minerals.</p>",
          image: {
            url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
            public_id: "seed_post_1"
          },
          author: {
            name: "Tinne Team",
            avatar: "https://ui-avatars.com/api/?name=Tinne+Team&background=random"
          }
        },
        {
          title: "Traditional Spices from Grandma's Kitchen",
          category: "Heritage",
          excerpt: "The secret behind the unique aroma and flavor of our hand-picked spices.",
          content: "<p>Our spices are sourced directly from farmers who follow traditional practices, ensuring that the natural oils and nutrients are preserved.</p>",
          image: {
            url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800",
            public_id: "seed_post_2"
          },
          author: {
            name: "Tinne Team",
            avatar: "https://ui-avatars.com/api/?name=Tinne+Team&background=random"
          }
        }
      ];

      for (const p of posts) {
        await Post.create({
          ...p,
          slug: slugify(p.title, { lower: true, strict: true })
        });
      }
      console.log("Blog posts seeded successfully!");
    } else {
      console.log("Blog posts already exist.");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
