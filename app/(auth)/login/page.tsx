import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";
// login memang tidak perlu static

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="grid place-items-center h-screen">Loading...</div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
