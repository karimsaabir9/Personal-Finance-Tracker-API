import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { limiter } from './middlewares/rateLimiter.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger.js';


import { logger } from "./middlewares/logger.js";
import { notFound } from "./middlewares/notfound.js";
import { errorHandler } from "./middlewares/errorHandler.js";


import userRoutes from "./routes/user.js"
import authRoutes from "./routes/auth.js"
import uploadRoutes from "./routes/upload.js"
import adminRoutes from "./routes/admin.js"
import transactionRoutes from "./routes/transaction.js"
import categoryRoutes from "./routes/category.js"

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

//using logger middleware
app.use(logger);

//Security headers
app.use(helmet());

//morgan
app.use(morgan('dev'));

//cors
app.use(cors());

//rate limiting
app.use(limiter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/upload", uploadRoutes);
app.use("/admin", adminRoutes);
app.use("/transactions", transactionRoutes);
app.use("/categories", categoryRoutes);



//error handling middleware
app.use(notFound);
app.use(errorHandler);

//connect to mongodb
const dbURI = process.env.NODE_ENV === 'development'
    ? (process.env.MONGO_URI_DEV || process.env.MONGO_URI)
    : (process.env.MONGO_URI_PRO || process.env.MONGO_URI || process.env.MONGO_URI_DEV);

mongoose.connect(dbURI)
    .then(() => console.log(`✅ MongoDB connected successfully to ${process.env.NODE_ENV === 'development' ? 'Local' : 'Cloud'} DB`))
    .catch(err => console.error('❌ Connection error:', err));



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});