"use client";

import { useRouter } from "next/navigation";
import { authClient } from "../../../lib/auth-client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        background: "transparent",
        border: "1px solid #444",
        borderRadius: "8px",
        padding: "10px 20px",
        color: "#fff",
        cursor: "pointer",
      }}
    >
      Sign out
    </button>
  );
}
