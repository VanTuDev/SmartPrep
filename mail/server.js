import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import { MONGO_URI } from './config.js';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Kết nối MongoDB
mongoose.connect(MONGO_URI)
   .then(() => {
      console.log("Database connected successfully.");
      app.listen(8080, () => {
         console.log("Server running on http://localhost:8080");
      });
   })
   .catch(error => {
      console.error("Database connection error:", error);
   });

// Routes
app.use('/api', userRoutes);
