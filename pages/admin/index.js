import React, { useState } from "react";
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";


const AdminPage = ({}) => {
  const { data: session } = useSession();

  return (
    <>
      
      <section className=" py-3 pt-3 " style={{width: "100%", height: "400px", background: "white"}}>
        <div className="container-fluid pt-3">
          <h1 style={{textAlign:"center", fontFamily: "sans", fontSize: "200px"}}>Welcome Admin</h1>
        </div>
          
      </section>
    </>
  );
};

export async function getServerSideProps({ req }) {
  return {
    props: {},
  };
}

export default AdminPage;

AdminPage.getLayout = function getLayout(page) {
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