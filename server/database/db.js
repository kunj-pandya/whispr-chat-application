import mongoose from "mongoose";

export const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "MERN_WHISPR_CHAT_APP"
    }).then(() => {
        console.log("Connected to Databse.");
    }).catch((error) => {
        console.log(`Error connecting to databse: ${error.message || error}`);
    });
};
