import mongoose from "mongoose";

const category = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    }
});

export default mongoose.models.Category || mongoose.model("Category", category);