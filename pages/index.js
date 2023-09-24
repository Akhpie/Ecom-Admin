import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  console.log({ session });
  return (
    <Layout>
      <div className="text-cyan-900 flex justify-between">
        <h2 style={{ fontSize: "22px" }} className="capitalize">
          Hello There, {session?.user?.name}
        </h2>
        <div className="flex bg-cyan-800 text-white p-2 rounded-md gap-1">
          <img
            src={session?.user?.image}
            alt="image"
            className="w-6 h-6 rounded-md"
          />
          <div className="capitalize">{session?.user?.name}</div>
        </div>
      </div>
    </Layout>
  );
}
