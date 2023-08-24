// This is the entire layout for the admin portal

import Nav from "@/components/Nav";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Layout({ children }) {
  const bgColor = " bg-cyan-900 min-h-screen flex";
  const LogIn = " bg-white flex-grow mt-1 mr-2 mb-2 rounded-lg p-4";
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className={"bg-cyan-900 w-screen h-screen flex items-center"}>
        <div className="text-center w-full">
          <div>
            <h1 className="text-white">Admin portal</h1>
          </div>
          <button
            onClick={() => signIn("google")}
            className={"bg-white p-2 px-4 rounded-lg"}
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={bgColor}>
      <Nav />
      <div className={LogIn}>{children}</div>
    </div>
  );
}
