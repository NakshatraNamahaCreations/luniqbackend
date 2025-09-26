const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    service: { type: String, required: true, trim: true },   // ✅ New field
    clientName: { type: String, required: true, trim: true },
    patientName: { type: String, trim: true },               // ✅ New field
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
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
    remarks: { type: String },                               // ✅ New field
    informedPackage: { type: String },                       // ✅ New field
    uniqueId: { type: String, unique: true }, 
    createdDate: { type: String }, // store in dd-MM-yyyy format
  },
  { timestamps: true }
);

// Auto-set uniqueId & createdDate before saving
userSchema.pre("save", async function (next) {
  try {
    if (this.isNew && !this.uniqueId) {
      const lastUser = await mongoose.model("User").findOne().sort({ createdAt: -1 });

      let newNumber = 1;
      if (lastUser && lastUser.uniqueId) {
        const lastNum = parseInt(lastUser.uniqueId.replace("LU", ""), 10);
        if (!isNaN(lastNum)) newNumber = lastNum + 1;
      }

      this.uniqueId = `LU${String(newNumber).padStart(3, "0")}`;
    }

    if (!this.createdDate) {
      const today = new Date();
      this.createdDate = today.toLocaleDateString("en-GB"); // dd/MM/yyyy
    }

    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
