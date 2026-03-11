const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../model/user.model");
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
      process.exit(0);
    }

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
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
