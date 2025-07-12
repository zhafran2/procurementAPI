import { NextRequest, NextResponse } from "next/server";

import * as jose from "jose";
import { ObjectId } from "mongodb";

import { JOSEError } from "jose/errors";
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route needs protection
  if (
    pathname.startsWith("/api/vendor") ||
    pathname.startsWith("/api/product")
  ) {
    const access_token = request.cookies.get("token")?.value;

    if (!access_token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
      const { payload } = await jose.jwtVerify<{
        _id: ObjectId;
        email: string;
      }>(access_token, secret);

      // Add user info to request headers for use in API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", payload._id as unknown as string);
      requestHeaders.set("x-user-email", payload.email);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (err: unknown) {
      if (err instanceof JOSEError) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
      } else {
        return Response.json(
          { message: "Internal Server Error" },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/vendor/:path*", "/api/product/:path*"],
};
