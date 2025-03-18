import { auth0 } from 'lib/auth0/auth0';
import { getContentList } from 'lib/cms/getContentList';
import { NextRequest } from 'next/server';
const jwt = require('jsonwebtoken');
import { BlobServiceClient } from "@azure/storage-blob";
import {
	GetObjectCommand,
	S3Client,
	S3ClientConfig,

} from '@aws-sdk/client-s3';

import {
	getSignedUrl,
	S3RequestPresigner,
} from "@aws-sdk/s3-request-presigner";

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
	/**
	 * Generate a signed URL for the file using AWS
	 */

	const bucketName = process.env.AWS_S3_BUCKET_NAME || ""
	const region = process.env.AWS_S3_REGION || ""
	const accessKeyId = process.env.AWS_S3_ACCESS_ID || ""
	const secretAccessKey = process.env.AWS_S3_SECRET_KEY || ''

	const s3Config: S3ClientConfig = {
		credentials: {
			accessKeyId,
			secretAccessKey,
		},
		region,
	};

	const s3Client = new S3Client(s3Config);
	const command = new GetObjectCommand({ Bucket: bucketName, Key: filename });
	const signedUrlRes = await getSignedUrl(s3Client, command, { expiresIn: 10 });

	//redirect to the signed URL
	return Response.redirect(signedUrlRes, 302)


	/****
	 * BELOW IS FOR AZURE STORAGE
	 */
	// const connStr = process.env.AZURE_STORAGE_CONNSTR
	// const containerName = process.env.AZURE_STORAGE_CONTAINER


	// if (!connStr || !containerName) {
	// 	return new Response('Secure File Connection Not Set', {
	// 		status: 400,
	// 	})
	// }

	// //get the file from azure
	// const blobServiceClient = BlobServiceClient.fromConnectionString(connStr)
	// const containerClient = blobServiceClient.getContainerClient(containerName)
	// const blob = containerClient.getBlobClient(filename)

	// if (!await blob.exists()) {
	// 	return new Response('File Not Found', {
	// 		status: 404,
	// 	})
	// }
	// const props = await blob.getProperties()

	// const buffer = await blob.downloadToBuffer()

	// return new Response(buffer, {
	// 	headers: {
	// 		'Content-Type': props.contentType || 'application/octet-stream',
	// 		//'Content-Disposition': `attachment; filename="${filename}"`
	// 	}
	// })

}