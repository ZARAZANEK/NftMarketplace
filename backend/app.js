import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import YAML from 'yamljs'
import swaggerUi from 'swagger-ui-express'
import path from "path";
import authRoutes from "./src/routes/auth.js"
import  productsRouter from "./src/routes/products.js"
dotenv.config()

const app = express()

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))
app.use(express.json())

app.use('/api/auth', authRoutes)

app.use("/api/products", productsRouter);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
