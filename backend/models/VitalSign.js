const mongoose = require("mongoose");

const vitalSignsSchema = new mongoose.Schema({
  nurseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bodyTemperature: Number,
  heartRate: Number,
  bloodPressure: String,
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

module.exports = mongoose.model("VitalSigns", vitalSignsSchema);
