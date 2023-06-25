import dbConnect from "@/utils/dbConnect";
import Category from "@/models/category";

dbConnect();

const handler = async (req, res) => {
  const { id } = req.query;
  const { method } = req;

  console.log(`GET request at /api/category/${req.query.id}`);
  if (method === "GET") {
    console.log(`GET request at /api/category/${req.query.id}`);
    try {
      const category = await Category.findById(id);
      return res
        .status(200)
        .json({ success: true, data: category.toObject({ getters: true }) });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
};

export default handler;
