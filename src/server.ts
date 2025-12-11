import "dotenv/config";
import app from "./app";
import {connectPrisma} from "./config/prisma.config";
import { connectDB } from "./config/mongo.config";


const PORT = process.env.PORT || 3000;

connectDB();
// connectPrisma();


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 

