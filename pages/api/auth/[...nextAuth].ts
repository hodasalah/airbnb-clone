import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { AuthOptions } from 'next-auth';
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials';
import Prisma from "@/app/libs/prismadb";
import NextAuth from 'next-auth/next';
import bcrypt from "bcrypt"
export const authOptions:AuthOptions={
  adapter: PrismaAdapter(Prisma),
  providers:[
    GithubProvider({
      clientId:process.env.GITHUB_ID as string,
      clientSecret:process.env.GITHUB_SECRET as string
    }),
    GoogleProvider({
      clientId:process.env.GOOGLE_ID as string,
      clientSecret:process.env.GOOGLE_SECRET as string
    }),
    CredentialsProvider({
      name:"credentials",
      credentials:{
        email:{label:"email",type:"text"},
        password:{label:"password",type:"password"}
      },
      async authorize (credentials){
        if(!credentials?.email || !credentials?.password){
          throw new Error("Invalid credentials")
        }
        const user=await Prisma.user.findUnique({
          where:{
            email:credentials.email
          }
        }) 
        if(!user || !user?.hashedPassword){
          throw new Error("Invalid credentials")
        }
        const isCorrectPassword= await  bcrypt.compare(credentials.password,user.hashedPassword)

        if(!isCorrectPassword){
          throw new Error("Invalid Password")
        }
        return user
      }
      
    })
  ],
  pages:{
    signIn:"/"
  },
  debug:process.env.NODE_ENV === "development",
  session:{
    strategy:"jwt",
  },
  secret:process.env.NEXTAUTH_SECRET

}
export default NextAuth(authOptions)