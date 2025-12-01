import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const lastActivity = request.cookies.get("lastActivity")?.value;

  const THIRTY_MINUTES = 20 * 60 * 1000; 

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // if (lastActivity && Date.now() - Number(lastActivity) > THIRTY_MINUTES) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }
  if (
  lastActivity &&
  Date.now() > Number(lastActivity) + THIRTY_MINUTES
) {
  return NextResponse.redirect(new URL("/", request.url));
}


  const response = NextResponse.next();

  // ✅ Refresh lastActivity if token is present
  // response.cookies.set("lastActivity", String(Date.now()), {
  //   path: "/",
  //   httpOnly: true, // safer
  //   secure: process.env.NODE_ENV === "production", // only secure in prod
  //   sameSite: "lax",
  // });

  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );

  return response;
}

export const config = {
  matcher: ["/pages/:path*"],
};