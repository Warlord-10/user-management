import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from 'bcrypt';
import dbConnect from "@/utils/mongodb";
import User from "@/models/User";

export const authOptions = {
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
        signOut: '/logout',
        error: '/login',
    },
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
        CredentialsProvider({
            credentials: {
                email: {},
                password: {}
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) return null;

                await dbConnect();
                const user = await User.findOne({ email: credentials?.email });

                if (!user) return null;

                const isValid = await compare(credentials?.password || "", user?.password);

                if (isValid) {
                    return user;
                }
                return null;
            }
        })
    ],

    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            // When the user is registering or signing in for the first time via google
            // Check if the user already exists in the database using the email address
            // If the user exists, return true to allow the sign in
            // If the user does not exist, create the user and then return true
            if (account.provider === "google") {
                await dbConnect();

                // Check if the user already exists in the database
                const userData = await User.findOne({ email: user.email })
                if (userData) {
                    return true;
                }

                // If the user does not exist, create the user
                // Since registering by google, the email is verified
                else {
                    const userData = await User.create({
                        name: user.name,
                        email: user.email,
                        emailVerified: true,
                    })
                    return true;
                }
            } else{
                return true;
            }
        },
        async jwt({ token, user, account }) {
            if(account) {
                await dbConnect();
                const userData = await User.findOne({ email: user.email })
                if(userData){
                    token._id = userData._id;
                    token.isSuperUser = userData?.isSuperUser;
                    token.isAdmin = userData?.isAdmin;
                }
            }
            return token;
        },
        async session({ session, token }) {
            session.user._id = token._id;
            session.isSuperUser = token?.isSuperUser;
            session.isAdmin = token?.isAdmin
            return session;
        }
    }
};