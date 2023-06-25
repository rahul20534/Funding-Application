import { sign } from "jsonwebtoken";
import { compare, genSaltSync, hashSync } from "bcrypt";
import { serialize } from "cookie";

export default async function handler(req, res) {
    console.log('login request at api/admin/login');

    if (req.method === 'POST') {
      // Process a POST request
        const salt = genSaltSync(10);
        const hash = hashSync(process.env.password, salt);
        
        // console.log(hash);
        const secret = process.env.secret;
        if(req.body.username === "admin" ) {
            const isPasswordCorrect = await compare(
                req.body.password,
                hash
            );
            
            if(isPasswordCorrect){
                const token = sign(
                    {
                      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
                      username: req.body.username,
                      isAdmin: true
                    },
                    secret
                );
            
                const serialised = serialize("access_token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    sameSite: "strict",
                    maxAge: 60 * 60 * 24 * 30,
                    path: "/",
                });

                res.setHeader("Set-Cookie", serialised);
                // Cookie.set('access_token', userToken);
                res.status(200).json({message: "Login Successful"});
            }else{
                res.status(401).json({message: "Invalid Credentials"});
            }
        }
    } else {
        res.status(400).json({message: "Invalid Request"});
    }
}