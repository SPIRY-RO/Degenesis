// Degenesis Backend Structure

// Folder Structure
// degenesis-backend/
// ├── server.js          # Main server file
// ├── package.json       # Node.js dependencies
// ├── config/
// │   └── database.js    # MongoDB connection
// ├── models/
// │   └── confession.js  # Mongoose model for confessions
// ├── routes/
// │   └── api.js         # API routes for handling confessions
// └── utils/
//     └── blessings.js   # Generates sarcastic blessings

// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { PublicKey, Connection } = require('@solana/web3.js');

// Server Configuration
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database Setup (MongoDB)
mongoose.connect('mongodb://localhost:27017/degenesis', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const confessionSchema = new mongoose.Schema({
  txid: String,
  confession: String,
  blessing: String,
  timestamp: Date
});

const Confession = mongoose.model('Confession', confessionSchema);

// Solana Blockchain Connection
const connection = new Connection('https://api.mainnet-beta.solana.com');
const programID = new PublicKey('YOUR_PROGRAM_ID');

// API Endpoints
app.post('/confess', async (req, res) => {
  const { txid, confession } = req.body;
  const newConfession = new Confession({
    txid,
    confession,
    blessing: generateBlessing(),
    timestamp: new Date()
  });
  await newConfession.save();
  res.json({ status: 'success', message: 'Confession recorded' });
});

app.get('/confessions', async (req, res) => {
  const confessions = await Confession.find().sort({ timestamp: -1 }).limit(100);
  res.json(confessions);
});

function generateBlessing() {
  const blessings = [
    'May your wallet always be heavy.',
    'Blessed be the degenerate who dares.',
    'The blockchain forgives, the market does not.',
    'Your sins are as permanent as your losses.'
  ];
  return blessings[Math.floor(Math.random() * blessings.length)];
}

// Server Listening
app.listen(3000, () => {
  console.log('Degenesis backend running on port 3000');
});
