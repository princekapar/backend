// require('dotenv').config()
import 'dotenv/config'
import connectDB from "./db/index.js";







connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port : ${process.env.PORT}`)
        })
        app.on("error", (error) => {
            console.log("Error", error)
            throw error
        })
    })
    .catch(() => {
    console.log("MONGO_DB connection failed  !!!",console.error
    )
})








// import express from "express";
// const app = express();


// (async () => {
//     try {
        
//         mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", (error) => {
//             console.log("Error connecting to MongoDB:", error);
//             throw error;
//         })

//         app.listen(process.env.PORT, () => {
//            console.log(`App is listerning on port ${process.env.PORT}`)
//        })
        

//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//     }
// })()