import { NextResponse, type NextRequest } from "next/server";

function requestAdminAuth() {
  return new Response("Autenticación requerida", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Rituo Admin", charset="UTF-8"',
    },
  });
}

function isValidAdminSession(request: NextRequest) {
  const adminUser = process.env.RITUO_ADMIN_USER;
  const adminPassword = process.env.RITUO_ADMIN_PASSWORD;

  if (!adminUser || !adminPassword) {
    return process.env.NODE_ENV !== "production";
  }

  const authorization = request.headers.get("authorization");

  if (!authorization) {
    return false;
  }

  const [scheme, encodedCredentials] = authorization.split(" ");

  if (scheme !== "Basic" || !encodedCredentials) {
    return false;
  }

  try {
    const decodedCredentials = atob(encodedCredentials);
    const separatorIndex = decodedCredentials.indexOf(":");

    if (separatorIndex < 0) {
      return false;
    }

    const username = decodedCredentials.slice(0, separatorIndex);
    const password = decodedCredentials.slice(separatorIndex + 1);

    return username === adminUser && password === adminPassword;
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  if (!isValidAdminSession(request)) {
    return requestAdminAuth();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/rituo-admin/:path*"],
};
