import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth0 } from "./auth0/auth0";
import { get } from "@vercel/edge-config";
const jwt = require("jsonwebtoken");

/*
* Check if the user has access to the route
* @param {NextRequest} request - the incoming request
* @param {string} url - the url to check (optional) - if this is not provided, the current request url will be used
* @returns {boolean} - true if the user has access, false if they do not
*/
export const checkRouteAccess = async (request: NextRequest, url?: string) => {

	const urlToCheck = url || request.nextUrl.pathname;

	const key = urlToCheck.replace(/\//g, "_");
	const authRoutePermissionStr = await get(key);

	const session = await auth0.getSession(request);

	if (session) {
		const decoded = jwt.decode(session.tokenSet.accessToken, {
			complete: true,
		});
		const userPermissions = decoded.payload.permissions as string[];

		if (!authRoutePermissionStr) {
			//don't need to do a lookup here
			return true
		}
		const routePermissions = `${authRoutePermissionStr}`.split(",");

		console.log("userPermissions", userPermissions);
		console.log("routePermissions", routePermissions);

		const hasAllPermissions = routePermissions.every((routePermission) => {
			return userPermissions.includes(routePermission);
		});

		if (hasAllPermissions) {
			//they have access
			return true
		} else {
			return false
		}
	}
}
