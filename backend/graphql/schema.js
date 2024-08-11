const { buildSchema } = require("graphql");
const User = require("../models/User");
const VitalSigns = require("../models/VitalSign");
const DailyInfo = require("../models/DailyInfo");
const Symptoms = require("../models/Symptoms");
const MotivationalTips = require("../models/MotivationalTips");


const schema = buildSchema(`
    type User {
        id: ID!
        email: String!
        name: String!
        gender: String!
        age: Int!
        roleId: String!
    }

    type VitalSigns {
        id: ID!
        nurseId: ID!
        patientId: ID!
        bodyTemperature: Float
        heartRate: Float
        bloodPressure: String
        respiratoryRate: Float
        createdAt: String
    }

    type DailyInfo {
        id: ID!
        patientId: ID!
        pulseRate: Float
        bloodPressure: String
        weight: Float
        temperature: Float
        respiratoryRate: Float
        createdAt: String
        recordedAt: String
    }

    type Symptoms {
        id: ID!
        patientId: ID!
        symptomsList: [String]
        createdAt: String
        recordedAt: String
    }

    type MotivationalTips {
      id: ID!
      nurseId: ID!
      patientId: ID!
      motivationalTips: String
      createdAt: String
  }

    type Query {
        users: [User]
        nurses: [User]
        patients: [User]
        getVitalSignsByNurseId(nurseId: String!): [VitalSigns]
        getDailyInfoByPatientId(patientId: String!): [DailyInfo]
        getSymptomsByPatientId(patientId: String!): [Symptoms]
        getPatientInfoById(patientId: String!): User
        getMotivationalTips(patientId: String!): [MotivationalTips]
        currentUser: User
    }

    type Mutation {
        recordVitalSigns(nurseId: String!, patientId: ID!, bodyTemperature: Float, heartRate: Float, bloodPressure: String, respiratoryRate: Float): VitalSigns
        recordDailyInfo(patientId: String!, pulseRate: Float, bloodPressure: String, weight: Float, temperature: Float, respiratoryRate: Float): DailyInfo
        recordSymptoms(patientId: String!, symptomsList: [String]!): Symptoms
        createMotivationalTips(nurseId: String!, patientId: ID!, motivationalTips: String): MotivationalTips
    }
`);

const root = {
  users: () => User.find(),
  nurses: () => User.find({ roleId: "nurse" }),
  patients: () => User.find({ roleId: "patient" }),
  getVitalSignsByNurseId: async ({nurseId}) => {
    const nurse = await User.findById(nurseId);
    if(!nurse) {
      throw new Error("Nurse not found");
    }
    const vitalSigns = await VitalSigns.find({ nurseId: nurse._id}).sort('createdAt');
    return vitalSigns;
  },
  getDailyInfoByPatientId: async ({ patientId }) => {
    const patient = await User.findById(patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }
    return await DailyInfo.find({ patientId: patient._id }).sort({
      createdAt: -1,
    });
  },
  getSymptomsByPatientId: async ({ patientId }) => {
    const patient = await User.findById(patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }
    return await Symptoms.find({ patientId: patient._id });
  },

  getMotivationalTips: async ({ patientId }) => {
    const patient = await User.findById(patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }
    return await MotivationalTips.find({ patientId: patient._id }).sort({
      createdAt: -1,
    });
  },

  getPatientInfoById: async ({patientId}) => {
    return await User.findById(patientId);
  },
  recordVitalSigns: async ({
    nurseId,
    patientId,
    bodyTemperature,
    heartRate,
    bloodPressure,
    respiratoryRate,
  }) => {
    const nurse = await User.findById(nurseId);
    if (!nurse) {
      throw new Error("Nurse not found");
    }

    const patient = await User.findById(patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }

    try {
      const newVitalSigns = new VitalSigns({
        nurseId: nurse._id,
        patientId: patient._id,
        bodyTemperature,
        heartRate,
        bloodPressure,
        respiratoryRate,
        createdAt: new Date(),
      });
      return await newVitalSigns.save();
    } catch (error) {
      throw new Error("Error saving vital signs");
    }
  },

  recordDailyInfo: async ({
    patientId,
    pulseRate,
    bloodPressure,
    weight,
    temperature,
    respiratoryRate,
  }) => {
    const patient = await User.findById(patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }
    //overwrite other data of same patient
    await DailyInfo.deleteMany({patientId: patient._id});
    try {
      const newDailyInfo = new DailyInfo({
        patientId: patient._id,
        pulseRate,
        bloodPressure,
        weight,
        temperature,
        respiratoryRate,
        recordedAt: new Date(),
      });
      return await newDailyInfo.save();
    } catch (error) {
      throw new Error("Error saving daily info");
    }
  },

  recordSymptoms: async ({ patientId, symptomsList }) => {
    // Find the patient by username
    const patient = await User.findById(patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }

    // Create a new Symptoms document using the patient's ID
    const newSymptoms = new Symptoms({
      patientId: patient._id,
      symptomsList,
      recordedAt: new Date(),
    });

    // Save and return the new Symptoms document
    return newSymptoms.save();
  },


  createMotivationalTips: async ({
    nurseId,
    patientId,
    motivationalTips,

  }) => {
    const nurse = await User.findById(nurseId);
    if (!nurse) {
      throw new Error("Nurse not found");
    }

    const patient = await User.findById(patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }

    try {
      const newMotivationalTips = new MotivationalTips({
        nurseId: nurse._id,
        patientId: patient._id,
        motivationalTips,
        createdAt: new Date(),
      });
      return await newMotivationalTips.save();
    } catch (error) {
      throw new Error("Error saving Motivational Tips");
    }
  },

  currentUser: (args, context) => {
    return context.req.session.user;
  },
};

module.exports = { schema, root };
