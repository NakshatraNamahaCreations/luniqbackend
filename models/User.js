const mongoose = require("mongoose");

// Counter schema for generating uniqueId
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 },
});
const Counter = mongoose.model("Counter", counterSchema);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    age: { type: Number, required: true, min: 0 },
    father: { type: String, required: true },
    mother: { type: String, required: true },
    place: { type: String, required: true },
    uniqueId: { type: String, unique: true }, // Auto-generated
   
   
    createdDate: { type: String }, // store in dd-MM-yyyy format
  },
  { timestamps: true }
);

// Generate auto uniqueId & createdDate before saving
userSchema.pre("save", async function (next) {
  if (!this.uniqueId) {
    const counter = await Counter.findOneAndUpdate(
      { name: "user_uniqueId" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    this.uniqueId = `KH0${counter.value}`;
  }

  if (!this.createdDate) {
    const today = new Date();
    this.createdDate = today.toLocaleDateString("en-GB"); // dd/MM/yyyy
  }

  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
