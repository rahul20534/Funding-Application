import React, { useState } from "react";
import { useSession, getSession } from "next-auth/react";
import Link from "next/link";
import { server } from "@/config";
import { MdDeleteForever, MdEdit } from "react-icons/md";

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"


import dbConnect from "@/utils/dbConnect";
import Category from "@/models/category";

import { signIn, signOut, SessionProvider } from "next-auth/react";
import AdminLayout from "@/components/AdminLayout";

const CategoryItem = ({ id, category, setError }) => {
  const [deleting, setDeleting] = useState(false);

  const onDeleteHandler = async (id) => {
    // const response = await fetch(`${}`)
    console.log("delete function clicked for category", id);
    try {
      setDeleting(true);
      setError(null);
      const response = await fetch(`${server}/api/admin/category/${id}`, {
        method: "DELETE",
      });

      const res = await response.json();
      console.log(res);
      setDeleting(false);
      setError(null);

      if (res.success) {
        alert("category deleted successfully");
        // Refresh the page
        window.location.reload();
        console.log("category deleted successfully");
      } else {
        console.log("error occured");
      }
    } catch (err) {
      setDeleting(false);
      setError(err);
      console.log("error occured", err);
    }
  };

  return (
    <>
      <li
        className="list-group-item d-flex col justify-content-between border-secondary"
        key={id}
      >
        <div className="flex-column col">
          <div className="d-flex col">
            <span className="fw-bold col px-3 mr-auto mt-2">
              {category.name}
            </span>
            <div className="mr-auto">
              <Link
                className="btn btn-danger mx-3"
                href={`editCategory/${category.id}`}
              >
                <MdEdit />
              </Link>
              <button
                className="btn btn-danger"
                onClick={() => onDeleteHandler(category.id)}
                disabled={deleting}
              >
                <MdDeleteForever />
              </button>
            </div>
          </div>
        </div>
      </li>
    </>
  );
};

const AdminPage = ({ session, categories }) => {
  const [error, setError] = useState(null);

  return (
    <div className="d-grid gap-4 mx-5 col">
      <div className="row">
        <ul className="list-group row">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              id={category.id}
              category={category}
              setError={setError}
            />
          ))}
        </ul>
      </div>

      {error && (
        <div className="row fw-bold alert alert-danger">
          Some Error Occured. Try again.
        </div>
      )}

      <div className="row">
        <Link href={`/admin/addCategory`} className="btn btn-success">
          Add New Category
        </Link>
      </div>
    </div>
  );
};

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);
  console.log("session in admin page = ", session);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  var categories;
  try {
    await dbConnect();
    categories = await Category.find();
    categories = categories.map((category) => category.toObject({ getters: true }));
    // console.log("categories inside admin/home = ", categories);
  } catch (error) {
    console.log(error);
  }

  console.log("categories inside getserversideprops = ", categories);
  // const res = await fetch(`${server}/api/category`);
  // const { data: categories } = await res.json();

  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
      categories: JSON.parse(JSON.stringify(categories))? JSON.parse(JSON.stringify(categories)) : null,
    },
  };
}

export default AdminPage;

AdminPage.getLayout = function getLayout(page) {
  return (
    <>
      <SessionProvider session={page.props.session}>
        <AdminLayout>{page}</AdminLayout>
      </SessionProvider>
    </>
  );
};
