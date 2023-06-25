// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

import { useEffect } from "react";
import Layout from "@/components/Layout";
import {SessionProvider} from 'next-auth/react'
import { getSession } from "next-auth/react";


export default function App({ Component, pageProps: {session, ...pageProps} }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  if(Component.getLayout){
    return Component.getLayout(<Component {...pageProps} />)
  }

  return (
    <SessionProvider session={session} >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
