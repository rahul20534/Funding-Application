import dbConnect from "@/utils/dbConnect";
import category from "@/models/category";
import multer from "multer";
import { createRouter } from "next-connect";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

import { Uplaod } from "@/s3";

dbConnect();

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, callback) {
      callback(null, new Date().getTime() + "-" + file.originalname);
    },
  }),
});

const router = createRouter();

router.use(upload.single("imageUrl")).post(async (req, res, next) => {
  const session = await getServerSession(req, res, authOptions);
  if(!session)
    return res.status(401).json({ success: false, message: "Unauthorized" })
  
  const { method } = req;

  console.log("file = ", req.file);
  console.log("body = ", req.body);

  console.log("file name:" + req.file.filename);

  const s3Upload = await Uplaod(req.file);

  console.log("s3Upload = ", s3Upload);

  if (method === "POST") {
    try {
      const new_category = await category({
        name: req.body.name,
        imageUrl: s3Upload.Location,
        description: req.body.description,
      });

      await new_category.save();
      return res.status(201).json({ success: true, data: new_category });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  //   return res.status(201).json({ body: req.body, file: req.file });
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
