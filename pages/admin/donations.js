import React from "react";
import { getSession } from "next-auth/react";
import { server } from "@/config";
import AdminLayout from "@/components/AdminLayout";
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";
import dbConnect from "@/utils/dbConnect";
import DonationData from "@/models/donation_data";

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"


const DonationItem = ({ index, donation }) => {
  return (
    <tr>
      <th scope="row"> {index + 1} </th>
      <td> {donation.name} </td>
      <td> {donation.email} </td>
      <td> {donation.phone} </td>
      <td> {donation.amount} </td>
      <td> {donation.category} </td>
      <td> {donation.razorpay_order_id} </td>
      <td> {donation.razorpay_payment_id} </td>
      <td> {donation.razorpay_signature} </td>
    </tr>
  );
};

const ViewDonations = ({ session, donations }) => {
  // console.log("donations = ", donations);
  // if(!donations) return <h1> No donations yet </h1>

  return (
    <div className="mx-3 table-responsive">
      <table className="table table-success table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Phone</th>
            <th scope="col">Amount</th>
            <th scope="col">Category </th>
            <th scope="col">Razorpay Order Id</th>
            <th scope="col">Razorpay Payment Id</th>
            <th scope="col">Razorpay Signature </th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation, index) => (
            <DonationItem
              key={donation.id}
              index={index}
              donation={donation}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);
  console.log("session in admin donations page = ", session);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  var donations;
  try {
    await dbConnect();
    donations = await DonationData.find();
    donations = donations.map(donation => donation.toObject({getters: true}))
    // console.log("donations", donations);
  } catch (error) {
    console.log(error);
  }

  // const res = await fetch(`${server}/api/admin/donations`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Cookie: req.headers.cookie,
  //   },
  // });

  // const { data: donations } = await res.json();
  // // console.log("donations = ", await res.json());
  console.log("donations inside getserversideprops = ", donations);
  return {
    props: {
      session: JSON.parse(JSON.stringify(donations)),
      donations: donations ? JSON.parse(JSON.stringify(donations)) : [],
    },
  };
}

export default ViewDonations;

ViewDonations.getLayout = function getLayout(page) {
  return (
    <>
      <SessionProvider session={page.props.session}>
        <AdminLayout>{page}</AdminLayout>
      </SessionProvider>
    </>
  );
};
