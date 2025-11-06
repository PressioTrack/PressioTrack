import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes";
import medicaoRoutes from "./routes/medicaoRoutes"
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/pressiotrack", authRoutes);
app.use('/pressiotrack', medicaoRoutes);
app.listen(PORT, ()=>{
    console.log("Servidor rodando na porta " + PORT)
});