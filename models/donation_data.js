import mongoose from "mongoose";

const donationData = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  category: {
    type: String
    // required: true,
  },
  personType: {
    type: String,
    required: true,
  },
  pancard: {
    type: String,
  },
  course: {
    type: String,
  },
  rollno: {
    type: String,
  },
  year: {
    type: String,
  },
  wardname: {
    type: String,
  },
  companyname: {
    type: String,
  },
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
  },
  remarks: {
    type: String,
  },
});

export default mongoose.models.DonationData ||
  mongoose.model("DonationData", donationData);
