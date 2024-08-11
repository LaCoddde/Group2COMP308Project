const mongoose = require("mongoose");

const symptomsSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  symptomsList: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  recordedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Symptoms", symptomsSchema);
