import dbConnect from "@/utils/dbConnect";
import Category from "@/models/category";

dbConnect();


// get all categories
const handler = async (req, res) => {
    const { method } = req;

    if(method === "GET"){
        console.log('GET request for all categories')
        try {
            const categories = await Category.find();
            console.log(categories);
            return res.status(200).json({ success: true, data: categories.map(category => category.toObject({getters: true})) });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
};

export default handler