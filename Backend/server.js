import "dotenv/config";
import app from "./src/app.js";
import { connectionToDB } from "./src/config/database.js";
connectionToDB()
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})