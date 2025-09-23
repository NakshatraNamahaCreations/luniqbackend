// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     clientName: { type: String, required: true, trim: true },
//     phoneNumber: {
//       type: String,
//       required: true,
//       unique: true,
//       match: [/^\d{10}$/, "Phone number must be 10 digits"],
//     },
//     location: { type: String },
//     religion: {
//       type: String,
//       enum: ["Hindu", "Muslim", "Christian", "Sikh", "Other"],
//     },
//     language: {
//       type: String,
//       enum: ["Kannada", "Hindi", "English", "Telugu", "Tamil"],
//     },
//     preference: { type: String },
//     requirements: { type: String },
//     createdDate: { type: String }, // store in dd-MM-yyyy format
//   },
//   { timestamps: true }
// );

// // Auto-set createdDate before saving
// userSchema.pre("save", function (next) {
//   if (!this.createdDate) {
//     const today = new Date();
//     this.createdDate = today.toLocaleDateString("en-GB"); // dd/MM/yyyy
//   }
//   next();
// });

// const User = mongoose.model("User", userSchema);
// module.exports = User;
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
    uniqueId: { type: String, unique: true }, // ✅ auto-generated (LU001 etc.)
    createdDate: { type: String }, // store in dd-MM-yyyy format
  },
  { timestamps: true }
);

// Auto-set uniqueId & createdDate before saving
userSchema.pre("save", async function (next) {
  try {
    // Generate uniqueId only for new users
    if (this.isNew && !this.uniqueId) {
      const lastUser = await mongoose.model("User").findOne().sort({ createdAt: -1 });

      let newNumber = 1;
      if (lastUser && lastUser.uniqueId) {
        const lastNum = parseInt(lastUser.uniqueId.replace("LU", ""), 10);
        if (!isNaN(lastNum)) newNumber = lastNum + 1;
      }

      this.uniqueId = `LU${String(newNumber).padStart(3, "0")}`; // LU001, LU002...
    }

    // Generate createdDate if not already set
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
