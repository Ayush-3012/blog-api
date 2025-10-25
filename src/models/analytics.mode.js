import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
    postId: {

    },
    views: {
        type: Number,
        default: 0
    },
    uniqueVisitors: {
        
    }
}, {timestamps: true})