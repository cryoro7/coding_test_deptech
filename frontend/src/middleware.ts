import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isLogin = false;
  if (!isLogin) {
    console.log("belum login");
  }
}

export const config = {
  matcher: ["/pegawai/:path*", "/cuti/:path*"],
};
