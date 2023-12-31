import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Admin } from "@/models/Admin";
import { mongooseConnect } from "@/lib/mongoose";

const adminEmails = [
  "akhilpie3@gmail.com",
  "vemlara177@gmail.com",
  "yushra417@gmail.com",
  "kvelvada@gitam.in",
  "lvemuru@gitam.in",
];

async function isAdminEmail(email) {
  return true;
  mongooseConnect();
  return !!(await Admin.findOne({ email }));
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({ session, account, user }) => {
      if (await isAdminEmail(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!(await isAdminEmail(session?.user?.email))) {
    res.status(401);
    res.end();
    throw "not an Admin";
  }
}
