import dbConnect from "@/utils/dbConnect";
import category from "@/models/category";
import multer from "multer";
import { createRouter } from "next-connect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

dbConnect();

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: function (req, file, callback) {
      callback(null, new Date().getTime() + "-" + file.originalname);
    },
  }),
});

const router = createRouter();

router
  .use(upload.single("imageUrl"))
  .patch(async (req, res, next) => {
    console.log(`patch request at api/admin/category/${req.query.id}`);
    const session = await getServerSession(req, res, authOptions);
    if (!session)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    console.log("file = ", req.file);
    console.log("body = ", req.body);

    const temp = {}
    
    if(req.file) temp.imageUrl = req.file.path;
    if(req.body.name) temp.name = req.body.name;
    if(req.body.description) temp.description = req.body.description;

    try {

      const updated_category = await category.findByIdAndUpdate(
        req.query.id,
        {
          $set: temp,},
        { new: true }
      );

      return res.status(201).json({ success: true, data: updated_category });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  })
  .delete(async (req, res, next) => {
    console.log(`delete request at api/admin/category/${req.query.id}`);
    const session = await getServerSession(req, res, authOptions);
    if (!session)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
      await category.findByIdAndDelete(req.query.id);
      return res
        .status(200)
        .json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  });

export default router.handler({
  onError: async (err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).end("Something broke!");
  },
  onNoMatch: async (req, res) => {
    return res.status(404).end("Page is not found");
  },
});
