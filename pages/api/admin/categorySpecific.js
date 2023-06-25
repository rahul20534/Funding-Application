import dbConnect from "@/utils/dbConnect";
import category from "@/models/category";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

dbConnect();

const handler = async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    if(!session)
        return res.status(401).json({ success: false, message: "Unauthorized" })
        
    const { method } = req;
    console.log('req at api/admin/categogySpecific route');
    if(method === "PUT"){
        try {
            const updated_category = await category.findByIdAndUpdate(req.body.id, {$set: req.body}, {new: true});
            return res.status(200).json({ success: true, data: updated_category });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }else if(method === "DELETE"){
        try {
            await category.findByIdAndDelete(req.body.id);
            return res.status(200).json({ success: true, message: "Category deleted successfully" });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
};

export default handler