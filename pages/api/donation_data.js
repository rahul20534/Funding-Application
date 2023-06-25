import dbConnect from "@/utils/dbConnect";
import donation_data from "@/models/donation_data";

dbConnect();

const handler = async (req, res) => {
  const { method } = req;

  if (method === "POST") {
    console.log('POST req at /api/donation_data');
    try {
      const new_donation = await donation_data({
        name: req.body.name,
        email: req.body.email,
        amount: req.body.amount,
        phone: req.body.mobile,
        address: req.body.address,
        personType: req.body.persontype,
        pancard: req.body.pancard ? req.body.pancard : "",
        course: req.body.course ? req.body.course : "",
        rollno: req.body.rollno ? req.body.rollno : "",
        year: req.body.year ? req.body.year : "",
        category: req.body.category ? req.body.category : "",
        wardname: req.body.wardname ? req.body.wardname : "",
        companyname: req.body.companyname ? req.body.companyname : "",
        razorpay_order_id: req.body.razorpay_order_id,
        razorpay_payment_id: req.body.razorpay_payment_id,
        razorpay_signature: req.body.razorpay_signature ? req.body.razorpay_signature : "",
        remarks: req.body.remarks ? req.body.remarks : "",
      });
      await new_donation.save();
      return res.status(201).json({ success: true, data: new_donation });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
};

export default handler;