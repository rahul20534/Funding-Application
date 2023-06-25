import { useRouter } from "next/navigation";
import { server } from "@/config/index";
import Image from "next/image";
import { Form, Formik } from "formik";
import MyTextInput from "@/components/MyTextInput";
import { getSession } from "next-auth/react";
import { useState } from "react";
import dbConnect from "@/utils/dbConnect";
import Category from "@/models/category";

import AdminLayout from "@/components/AdminLayout";

import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"


const validator = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = "Required";
  }
  if (!values.description) {
    errors.description = "Required";
  }
  return errors;
};

const EditCategoryPage = ({ session, name, description, id }) => {
  const [selectedImage, setSelectedImage] = useState();
  const [selectedFile, setSelectedFile] = useState();
  const { push } = useRouter();

  const handleSubmit = async (values) => {
    console.log("handle submit function called");

    const form = new FormData();
    form.append("name", values.name);
    form.append("description", values.description);
    form.append("imageUrl", selectedFile);
    form.append("id", id);
    // console.log(form);

    try {
      const result = await fetch(`${server}/api/admin/category/${id}`, {
        method: "PATCH",
        body: form,
      });
      const res = await result.json();
      console.log(res);
      push("/admin");
    } catch (err) {
      console.log("error occured: ", err);
    }
  };

  const handleImage = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log(file);

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      console.log(event.target.result);
      setSelectedImage(event.target.result);
    };
    fileReader.readAsDataURL(file);
  };

  const initialValues = {
    name: name,
    description: description,
  };

  return (
    <div className="card">
      <div className="card-body">
        <Formik
          initialValues={initialValues}
          validate={validator}
          onSubmit={handleSubmit}
        >
          <Form>
            <MyTextInput
              label="Category Name"
              name="name"
              type="text"
              placeholder="Give for Alumni Legacy"
            />

            <MyTextInput
              label="Description"
              name="description"
              type="text"
              placeholder="Enter Description of the category"
            />

            <div className="col-md-10 ms-5 mt-3 ">
              <input
                type="file"
                className="form-control"
                onChange={handleImage}
              />
            </div>

            <div className="col-md-10 ms-5 my-2">
              {selectedImage && (
                <Image src={selectedImage} alt="" width={300} height={300} />
              )}
            </div>

            {/* TODO: If you have time, then disable button if there are errors */}
            <div className="col-12 ms-5 mt-3">
              <button type="submit" className="btn btn-success">
                Submit
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export async function getServerSideProps({ req, res, params }) {
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

  var category;
  try {
    await dbConnect();
    category = await Category.findById(params.id);
    category = category.toObject({getters: true});
  } catch (error) {
    console.log(error);
  }

  // const res = await fetch(`${server}/api/category/${params.id}`);
  // const { data: category } = await res.json();
  const { name, description, id } = category;

  return {
    props: {
      name,
      description,
      id,
    },
  };
}

export default EditCategoryPage;

EditCategoryPage.getLayout = function getLayout(page) {
  return (
    <>
      <SessionProvider session={page.props.session}>
        <AdminLayout>{page}</AdminLayout>
      </SessionProvider>
    </>
  );
};
