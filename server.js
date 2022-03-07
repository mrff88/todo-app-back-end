import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';

/**
 * Mongoose
 */

// Connect to db
const dbConnection = process.env.DB_STRING_CONNECTION;
await mongoose.connect(dbConnection);

// Listener to connection error
mongoose.connection.on('error', function (e) {
  console.error('ERROR: ', e);
});

/**
 * Express
 */
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Launch server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('-Iniatialized server-');
});
