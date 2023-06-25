import Link from "next/link";
import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="text-center text-lg-start text-dark mb-0"
      style={{backgroundColor: "#ECEFF1", position: "relative", bottom: "0", width: "100%"}}
    >
      {/* <section
        className="d-flex justify-content-start p-4 text-white"
        style={{backgroundColor: "#21D192"}}
      >
        <div className="me-3">
          <span>Get connected with us on social networks:</span>
        </div>

        <div>
          <Link href="#" className="text-white me-4">
            <FaFacebookF />
          </Link>
          <Link href="#" className="text-white me-4">
            <FaTwitter />
          </Link>
          <Link href="#" className="text-white me-4">
          <FaInstagram />
          </Link>
          <Link href="#" className="text-white me-4">
            <FaLinkedin />
          </Link>
        </div>
      </section> */}

      <div className="text-center p-3" style={{backgroundColor: "rgba(1, 1.9, 3, 0.2)"}}>
        Developed by <Link href="https://github.com/V15hnu24">Vishnu Vardhan</Link> and <Link href="https://github.com/rahul20534">Rahul</Link> @ IIIT-Delhi
        <hr></hr>
        {/* <br></br> */}
        © 2023 Copyright. All rights reserved.
      </div>
    </footer>
  );
}