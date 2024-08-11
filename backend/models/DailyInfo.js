const mongoose = require("mongoose");

const dailyInfoSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pulseRate: Number,
  bloodPressure: String,
  weight: Number,
  temperature: Number,
  respiratoryRate: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  recordedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DailyInfo", dailyInfoSchema);
