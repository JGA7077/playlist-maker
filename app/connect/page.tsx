import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getConnectedUser } from "@/lib/session";
import ConnectForm from "./ConnectForm";

export default async function ConnectPage() {
  const user = await getConnectedUser();
  if (user) {
    redirect("/create");
  }
  return (
    <Suspense fallback={null}>
      <ConnectForm />
    </Suspense>
  );
}
