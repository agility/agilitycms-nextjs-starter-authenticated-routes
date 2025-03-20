import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0/auth0";
import { getAgilityPage } from "lib/cms/getAgilityPage";
import { getContentList } from "lib/cms/getContentList";
import { get } from "@vercel/edge-config";
import { checkRouteAccess } from "lib/checkRouteAccess";
const jwt = require("jsonwebtoken");

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

  // Run Auth0 middleware first
  const authRes = await auth0.middleware(request);

  if (request.nextUrl.pathname.startsWith("/auth")) {
    return authRes;
  }

  if (request.nextUrl.pathname.startsWith("/assets")) {
    return NextResponse.next();
  }

  if (! await checkRouteAccess(request)) {
    //show a 403 error
    console.log("User does not have permission to access this route");
    return new Response("You do not have access to this page", { status: 403 });
  }


  /*****************************
   * *** AGILITY MIDDLEWARE ***
   * 1: Check if this is a preview request,
   * 2: Check if we are exiting preview
   * 3: Check if this is a direct to a dynamic page
   *    based on a content id
   *******************************/

  const previewQ = request.nextUrl.searchParams.get("AgilityPreview");
  let contentIDStr =
    (request.nextUrl.searchParams.get("ContentID") as string) || "";

  if (request.nextUrl.searchParams.has("agilitypreviewkey")) {
    //*** this is a preview request ***
    const agilityPreviewKey =
      request.nextUrl.searchParams.get("agilitypreviewkey") || "";
    //locale is also passed in the querystring on preview requests
    const locale = request.nextUrl.searchParams.get("lang");
    const slug = request.nextUrl.pathname;
    //valid preview key: we need to redirect to the correct url for preview
    let redirectUrl = `${request.nextUrl.protocol}//${request.nextUrl.host
      }/api/preview?locale=${locale}&ContentID=${contentIDStr}&slug=${encodeURIComponent(
        slug
      )}&agilitypreviewkey=${encodeURIComponent(agilityPreviewKey)}`;
    return NextResponse.rewrite(redirectUrl);
  } else if (previewQ === "0") {
    //*** exit preview
    const locale = request.nextUrl.searchParams.get("lang");

    //we need to redirect to the correct url for preview
    const slug = request.nextUrl.pathname;
    let redirectUrl = `${request.nextUrl.protocol}//${request.nextUrl.host
      }/api/preview/exit?locale=${locale}&ContentID=${contentIDStr}&slug=${encodeURIComponent(
        slug
      )}`;

    return NextResponse.redirect(redirectUrl);
  } else if (contentIDStr) {
    const contentID = parseInt(contentIDStr);
    if (!isNaN(contentID) && contentID > 0) {
      //*** this is a dynamic page request ***

      let dynredirectUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}/api/dynamic-redirect?ContentID=${contentID}`;
      return NextResponse.rewrite(dynredirectUrl);
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
