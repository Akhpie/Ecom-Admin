// This is the entire layout for the admin portal

import Nav from "@/components/Nav";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Layout({ children }) {
  const bgColor = " bg-cyan-900 min-h-screen flex";
  const LogIn = " bg-white flex-grow mt-1 mr-2 mb-2 rounded-lg p-4";
  const { data: session } = useSession();
  // const [showNav, setShowNav] = useState(false);
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
    <div className="bg-bgGray min-h-screen">
      {/* <button className="mx-6 my-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button> */}
      <div>
        <div className={bgColor}>
          <Nav />
          <div className={LogIn}>{children}</div>
        </div>
      </div>
    </div>
  );
}
