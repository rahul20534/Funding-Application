import React, {useState} from "react";
import { getSession } from "next-auth/react";
import { Form, Formik } from "formik";
import MyTextInput from "@/components/MyTextInput";
import Image from "next/image";
import { server } from "@/config";
import { useRouter } from 'next/navigation';
import AdminLayout from "@/components/AdminLayout";

import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"



const initialValues = {
  name: "",
  description: "",
};

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

const AddCategoryPage = ({ session }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState();
  const { push } = useRouter();

  const handleSubmit = async (values) => {
    console.log("handle submit function called");
    console.log(values);

    console.log(values.name);
    console.log(values.description);

    const form = new FormData();
    form.append('name', values.name);
    form.append('description', values.description);
    form.append('imageUrl', selectedFile);
    console.log(form);

    try{
      const result = await fetch(`${server}/api/admin/addCategory`, {
        method: 'POST',
        body: form,
      });
      const res = await result.json();
      console.log(res);
      push('/admin')

    }catch(err){
      console.log("error occured: ", err);
    }

    console.log(res);
  };

  const handleImage = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file)
    console.log(file);

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      console.log(event.target.result);
      setSelectedImage(event.target.result);
    }
    fileReader.readAsDataURL(file)
  }

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
              placeholder="Enter Name of the category"
            />

            <MyTextInput
              label="Description"
              name="description"
              type="text"
              placeholder="Enter Description of the category"
            />

            <div className="col-md-10 ms-5 mt-3 ">
              <input type="file" className="form-control" onChange={handleImage} />
            </div>

            <div className="col-md-10 ms-5 my-2">
              {selectedImage && <Image src={selectedImage} alt="" width={300} height={300} />}
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

  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
    },
  };
}

export default AddCategoryPage;

AddCategoryPage.getLayout = function getLayout(page) {
  return (
    <>
    <SessionProvider session={page.props.session}>
      <AdminLayout>
        {page}  
      </AdminLayout>
    </SessionProvider>
    </>
  );
};