import dbConnect from "@/utils/dbConnect";
import DonationData from "@/models/donation_data";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import middleware from "@/middle_auth/middleware";

dbConnect();

const handler = async (req, res) => {
    console.log('req at api/admin/donatins route');
    const session = await getServerSession(req, res, authOptions);
    if(!session)
        return res.status(401).json({ success: false, message: "Unauthorized"});

    const { method } = req;
    // console.log('req at api/admin/donatins route');
    // return res.status(200).json({ success: true, data: categories.map(category => category.toObject({getters: true})) });

    if(method === "GET"){
        try {
            const donations = await DonationData.find();
            console.log('donations', donations);
            return res.status(200).json({ success: true, data: donations });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
};

export default handler;