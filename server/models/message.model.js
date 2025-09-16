import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        text: String,
        media: String
    }, { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
