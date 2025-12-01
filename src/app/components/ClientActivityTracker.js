"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { initActivityTracker } from "../utils/utils";
// import { initActivityTracker } from "@/utils/activity-tracker";

export default function ClientActivityTracker() {
  const router = useRouter();

  useEffect(() => {
    let logoutTimer;

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(() => {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "lastActivity=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.push("/"); // login page
      }, 15 * 60 * 1000); // 15 minutes
    };

    ["click", "keydown", "scroll"].forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer(); // start timer initially
    initActivityTracker(); // still update cookie for middleware backup

    return () => {
      ["click", "keydown", "scroll"].forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
      clearTimeout(logoutTimer);
    };
  }, [router]);

  return null;
}
