// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ugmc', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Define MongoDB schemas and models (e.g., Patient, Encounter, Vitals)
const patientSchema = new mongoose.Schema({
  patientId: String,
  surname: String,
  othernames: String,
  gender: String,
  phoneNumber: String,
  residentialAddress: String,
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  }
});

const encounterSchema = new mongoose.Schema({
  patientId: String,
  dateAndTime: Date,
  encounterType: String
});

const vitalsSchema = new mongoose.Schema({
  patientId: String,
  bloodPressure: String,
  temperature: Number,
  pulse: Number,
  spO2: Number
});

const Patient = mongoose.model('Patient', patientSchema);
const Encounter = mongoose.model('Encounter', encounterSchema);
const Vitals = mongoose.model('Vitals', vitalsSchema);

// Define API routes

// Patient Registration
app.post('/api/patients/register', async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Encounter Management
app.post('/api/encounters/start', async (req, res) => {
  try {
    const encounter = new Encounter(req.body);
    await encounter.save();
    res.status(201).json(encounter);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Vitals Submission
app.post('/api/vitals/submit', async (req, res) => {
  try {
    const vitals = new Vitals(req.body);
    await vitals.save();
    res.status(201).json(vitals);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Patient List
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Patient Details
app.get('/api/patients/:patientId', async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.patientId });
    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
    } else {
      res.status(200).json(patient);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
