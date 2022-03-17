import express from "express";
import router from "./src/router.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config()

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(error => {
    console.log(error)
});


const app = express();

app.set('view engine', 'ejs')
app.set('views', 'src/views')
app.use(express.urlencoded({ extended: true }))
app.use(router);



const port = process.env.PORT || 3000
app.listen(port);

console.log("Kehityspalvelin on käynnistetty osoitteeseen: http://localhost:" + port)