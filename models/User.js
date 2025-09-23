const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true, trim: true },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    location: { type: String },
    religion: {
      type: String,
      enum: ["Hindu", "Muslim", "Christian", "Sikh", "Other"],
    },
    language: {
      type: String,
      enum: ["Kannada", "Hindi", "English", "Telugu", "Tamil"],
    },
    preference: { type: String },
    requirements: { type: String },
    createdDate: { type: String }, // store in dd-MM-yyyy format
  },
  { timestamps: true }
);

// Auto-set createdDate before saving
userSchema.pre("save", function (next) {
  if (!this.createdDate) {
    const today = new Date();
    this.createdDate = today.toLocaleDateString("en-GB"); // dd/MM/yyyy
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
