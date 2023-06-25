import MySelectInput from "@/components/MySelectInput";
import MyTextInput from "@/components/MyTextInput";
import { Form, Formik, useFormikContext } from "formik";
import { server } from "@/config/index";
import Image from "next/image";
import Script from "next/script";
import dbConnect from "@/utils/dbConnect";
import Category from "@/models/category";

function DetailCard({ name, imageUrl, description }) {
  return (
    <div className="card mb-5 pb-3">
      <div className=" card-header fs-1 fw-normal">
        <b>{name} </b>
      </div>
      <div className="p-1">
      <Image
        src={imageUrl}
        className="card-img-top"
        alt="topic pic"
        width={500}
        height={500}
      />
      </div>

      <hr></hr>

      <div className="p-2 pt-1"> {description} </div>
      
      
    </div>
  );
}

const personSpecificValidator = (values) => {
  const errors = {};

  if (values.persontype === "student") {
    if (!values.course) {
      errors.course = "Required";
    }
    if (!values.rollno) {
      errors.rollno = "Required";
    } else if (values.rollno <= 0) {
      errors.rollno = "Please enter a valid roll number";
    }
  } else if (values.persontype === "alumni") {
    if (!values.year) {
      errors.year = "Required";
    } else if (values.year <= 0) {
      errors.year = "Please enter a valid roll number";
    }
  } else if (values.persontype === "parent") {
    if (!values.wardname) {
      errors.wardname = "Required";
    }
    if (!values.course) {
      errors.course = "Required";
    }
    if (!values.year) {
      errors.year = "Required";
    } else if (values.year <= 0) {
      errors.year = "Please enter a valid roll number";
    }
  } else if (values.persontype === "professional") {
    if (!values.company) {
      errors.company = "Required";
    }
  } else if (values.persontype === "faculty") {
    if (!values.id) {
      errors.id = "Required";
    }
  } else if (values.persontype === "employee") {
    if (!values.id) {
      errors.id = "Required";
    }
  } else if (values.persontype === "others") {
    // add others specific fields
    if (!values.remarks) {
      errors.remarks = "Required";
    } else if (values.remarks.length >= 100) {
      errors.remarks = "Please enter < 100 characters";
    }
  } else {
    console.log("Invalid option");
  }

  return errors;
};

const validator = (values) => {
  const commonErrors = {};
  if (!values.name) {
    commonErrors.name = "Required";
  }

  if (!values.email) {
    commonErrors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    commonErrors.email = "Please enter a valid email address";
  }

  if (!values.mobile) {
    commonErrors.mobile = "Required";
  }

  if (!values.address) {
    commonErrors.address = "Required";
  }

  if (values.amount && values.amount >= 50000 && !values.pancard) {
    commonErrors.pancard = "Required";
  } else if (
    values.pancard &&
    !/[A-Za-z]{4}[0-9]{5}[A-Za-z]$/i.test(values.pancard)
  ) {
    commonErrors.pancard = "Enter a valid Pancard";
  }

  if (!values.amount) {
    commonErrors.amount = "Required";
  } else if (values.amount <= 0) {
    commonErrors.amount = "Please enter a positive amount";
  }

  // specific checks
  var specificErrors;
  if (values.persontype === "") {
    commonErrors.persontype = "Please select some designation";
  } else {
    specificErrors = personSpecificValidator(values);
  }

  const allerrors = { ...commonErrors, ...specificErrors };
  // console.log("allerrors = ", allerrors);

  return allerrors;
};

const PersonCustomFields = () => {
  const { values } = useFormikContext();
  // console.log(values);

  if (values.persontype === "") {
    return <></>;
  } else if (values.persontype === "student") {
    return (
      <>
        <MyTextInput
          label="Course Name (BTech/MTech/PHD)"
          name="course"
          type="text"
          placeholder="BTech"
        />

        <MyTextInput
          label="Roll No"
          name="rollno"
          type="number"
          placeholder="Enter roll no"
        />
      </>
    );
  } else if (values.persontype === "alumni") {
    return (
      <>
        <MyTextInput
          label="Year of Graduation"
          name="year"
          type="number"
          placeholder="2017"
        />
      </>
    );
  } else if (values.persontype === "parent") {
    return (
      <>
        <MyTextInput
          label="Ward Name"
          name="wardname"
          type="text"
          placeholder="Enter your ward name"
        />

        <MyTextInput
          label="Course Name (BTech/MTech/PHD)"
          name="course"
          type="text"
          placeholder="BTech"
        />

        <MyTextInput
          label="Year of Graduation"
          name="year"
          type="number"
          placeholder="2017"
        />
      </>
    );
  } else if (values.persontype === "professional") {
    return (
      <>
        <MyTextInput
          label="Company Name"
          name="company"
          type="text"
          placeholder="Google"
        />
      </>
    );
  } else if (values.persontype === "faculty") {
    return (
      <>
        <MyTextInput
          label="Faculty id"
          name="id"
          type="text"
          placeholder="Enter ID"
        />
      </>
    );
  } else if (values.persontype === "employee") {
    return (
      <>
        <MyTextInput
          label="Employee id"
          name="id"
          type="text"
          placeholder="Enter ID"
        />
      </>
    );
  } else if (values.persontype === "others") {
    return (
      <>
        <MyTextInput
          label="Remarks"
          name="remarks"
          type="text"
          placeholder="Remarks"
        />
      </>
    );
  } else {
    console.log("Invalid option in persontype");
  }
};

const initialValues = {
  name: "",
  email: "",
  mobile: "",
  address: "",
  persontype: "",
  pancard: "",
  amount: "",
  course: "",
  rollno: "",
  year: "",
  wardname: "",
  company: "",
  id: "",
  remarks: "",
};


const MyForm = ({ name }) => {
  const handleSubmit = async (values, response) => {
    // values.category = name;
    console.log("handle submit function called");
    console.log(values);
    console.log(response);

    const donation_data = {...values, ...response};
    console.log(donation_data);

    donation_data.category = name;

    try{
      const response = await fetch(`/api/donation_data`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(donation_data)
      })
      const {data} = await response.json()
      console.log(data);
    }catch(err){
      console.log('error occurred: ', err);
    }
  };

  const displayRazorpay = async (values) => {
    console.log("amount in browser = ", values.amount);
    console.log("server = ", server);
    const response = await fetch(`${server}/api/razorpay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: values.amount,
      }),
    });
    const { id} = await response.json();
    console.log("id = ", id);
    // console.log("currency = ", currency);
    // console.log("amount = ", amount);
    // return;

    const options = {
      key: process.env.RAZORPAY_KEY_ID,
      currency: "INR",
      amount: (values.amount * 100).toString(),
      order_id: id,
      name: "Donation",
      description: "Thank you for nothing. Please give us some money",
      handler: async function (response) {
        console.log("response received from razorpay = ", response);
        handleSubmit(values, response);
        // alert(response.razorpay_payment_id)
        // alert(response.razorpay_order_id)
        // alert(response.razorpay_signature)
      },
      prefill: {
        name: values.name,
        email: values.email,
        phone_number: values.mobile,
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

    paymentObject.on("payment.failed", function (response) {
      alert("Payment Failed. PLease try again.");
    });
  };

  return (
    <div className="card">
      <div className="card-body">
        <Formik
          initialValues={initialValues}
          validate={validator}
          onSubmit={displayRazorpay}
        >
          <Form>
            <MyTextInput
              label="Name"
              name="name"
              type="text"
              placeholder="Your Name"
            />
            <MyTextInput
              label="Email"
              name="email"
              type="email"
              placeholder="youremail"
            />
            {/* TODO: Ask if they want this in country code separate format -> should be doable using some library */}
            <MyTextInput
              label="Mobile"
              name="mobile"
              type="text"
              placeholder="000 000 0000"
            />

            <MyTextInput
              label="Address"
              name="address"
              type="text"
              placeholder="New Delhi"
            />

            <MySelectInput label="Person Type" name="persontype">
              <option value="">Select your designation: </option>
              <option value="student">Student</option>
              <option value="alumni">Alumni</option>
              {/* <option value="parent">Parent</option> */}
              {/* <option value="professional">Industry Professional</option> */}
              {/* <option value="faculty">Faculty</option> */}
              <option value="employee">Employee</option>
              <option value="others">Others</option>
            </MySelectInput>

            <PersonCustomFields />

            <MyTextInput
              label="PAN Card Detail (Please share in order to claim tax benefit under 80 G of Income Tax Act, 1961)"
              name="pancard"
              type="text"
              placeholder="ABCD12345E"
            />

            <MyTextInput
              label="Amount (INR)"
              name="amount"
              type="number"
              placeholder="Enter some amount"
            />

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

export default function Payment({ name, imageUrl, description }) {
  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="container row">
        <div className="col-lg-12 col-xxl-6">
          <DetailCard name={name} imageUrl={imageUrl} description={description}/>
        </div>
        <div className="col-lg-12 col-xxl-6">
          <MyForm name={name} />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {

  var category;
  try {
    await dbConnect();
    category = await Category.findById(context.params.categoryId);
    console.log("category inside payment page = ", category);
    // category = await resp.json();
    category = category.toObject({getters: true})
    console.log("category = ", category);
  } catch (error) {
    console.log(error);
  }
  

  // const res = await fetch(
  //   `${server}/api/category/${context.params.categoryId}`
  // );

  // const { data } = await res.json();
  // const {name, imageUrl, description } = data;
  
  const {name, imageUrl, description } = category;
  const isImageLocal = imageUrl.slice(0, 6) === "public";
  const newImage = imageUrl.replaceAll("\\", "/");
  const image = isImageLocal ? newImage.slice(6) : newImage;

  return {
    props: {
      name,
      imageUrl: image,
      description
      // title,
    },
  };
}