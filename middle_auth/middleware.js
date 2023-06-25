import { verify } from "jsonwebtoken"; 

export default function middleware(req) {
    // if (request.nextUrl.pathname.startsWith('/about')) {
    //     // This logic is only applied to /about
    //   }
    
    const {cookies} = req;

    const jwt = cookies.access_token;
    const url  = req.url;
    
    if(url.includes("admin") && !url.includes("login")){

        try {
            const verified = verify(jwt, process.env.secret);
            req.user = verified;
            
            if(!verified.isAdmin){
                return false;
            }

            return true;

        } catch (error) {
            return false;
        }
    }
};