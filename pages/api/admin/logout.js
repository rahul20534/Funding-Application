import { serialize } from "cookie";

export default function handler(req, res) {

    if (req.method === 'POST') {
        // Process a POST request
        const { cookies } = req;

        const jwt = cookies.access_token;
      
        if (!jwt) {
          return res.json({ message: "Bro you are already not logged in..." });
        } else {
          const serialised = serialize("access_token", null, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: -1,
            path: "/",
          });
      
          res.setHeader("Set-Cookie", serialised);
      
          res.status(200).json({ message: "Successfuly logged out!" });
        }

    } else {
        res.status(400).json({ message: "Invalid Request" });
    }
    
}
