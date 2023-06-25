import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { server } from "@/config/index";
import { compare, genSaltSync, hashSync } from "bcrypt";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      id: "credentials-login",
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const { username, password } = credentials;

        const salt = genSaltSync(10);
        const hash = hashSync(process.env.password, salt);
        
        if (username === "admin") {
          const isPasswordCorrect = await compare(password, hash);

          if (isPasswordCorrect) {
            return {
              user: { id: "admin", name: "admin", email: "admin@gmail.com" },
              message: 'login successful',
            };
          } else {
            return null;
          }
        }else{
          return null;
        }
      },
    }),
  ],
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
