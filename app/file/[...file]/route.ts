import { auth0 } from 'lib/auth0/auth0';
import { getContentList } from 'lib/cms/getContentList';
import { NextRequest } from 'next/server';
const jwt = require('jsonwebtoken');
import { BlobServiceClient } from "@azure/storage-blob";

export async function GET(request: NextRequest) {

	const filename = request.nextUrl.pathname.substring("/file/".length)

	//the path that we need to authenticate
	const authPath = request.nextUrl.searchParams.get("auth")

	if (!authPath) {
		return new Response('Unauthorized', {
			status: 401,
		})
	}


	const session = await auth0.getSession();

	if (!session || !session.tokenSet.accessToken) {

		return new Response('Unauthorized', {
			status: 401,
		})
	}

	const accessToken = session.tokenSet.accessToken;
	const decodedToken = jwt.decode(accessToken, { complete: true })
	const permissions = decodedToken.payload.permissions;

	const routes = await getContentList({
		referenceName: `AuthedRoutes`, // you must have a corrisponding content list in agility
		locale: process.env.AGILITY_LOCALES || 'en-us',
	});

	const routePermissions = routes.items.map((item: any) => ({
		menuText: item.fields.menuText,
		url: item.fields.url,
		permissions: item.fields.permissionText?.split(',')
	}));

	const authorizedRoutes = routePermissions
		.filter((route: any) => route.permissions?.some((permission: any) => permissions.includes(permission)))
		.map((route: any) => ({
			menuText: route.menuText,
			url: route.url
		}));

	//make sure the auth path is in the list of authorized routes
	const isAuthorized = authorizedRoutes.some((route: any) => route.url === authPath)
	if (!isAuthorized) {
		return new Response('Unauthorized', {
			status: 401,
		})
	}

	const connStr = process.env.AZURE_STORAGE_CONNSTR
	const containerName = process.env.AZURE_STORAGE_CONTAINER


	if (!connStr || !containerName) {
		return new Response('Secure File Connection Not Set', {
			status: 400,
		})
	}

	//get the file from azure
	const blobServiceClient = BlobServiceClient.fromConnectionString(connStr)
	const containerClient = blobServiceClient.getContainerClient(containerName)
	const blob = containerClient.getBlobClient(filename)

	if (!await blob.exists()) {
		return new Response('File Not Found', {
			status: 404,
		})
	}
	const props = await blob.getProperties()

	const buffer = await blob.downloadToBuffer()

	return new Response(buffer, {
		headers: {
			'Content-Type': props.contentType || 'application/octet-stream',
			//'Content-Disposition': `attachment; filename="${filename}"`
		}
	})

}