import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const role = (req.auth as { user?: { role?: string } } | null)?.user?.role;
  if (role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
