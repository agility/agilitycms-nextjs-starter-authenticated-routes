import { auth0 } from 'lib/auth0/auth0';

import { getContentList } from 'lib/cms/getContentList';
import { NextRequest, NextResponse } from 'next/server';
const jwt = require('jsonwebtoken');
export async function GET(request: NextRequest) {


    const session = await auth0.getSession();

    if (!session || !session.tokenSet.accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    const accessToken = session.tokenSet.accessToken;
    const decodedToken = jwt.decode(accessToken, { complete: true })
    const permissions = decodedToken.payload.permissions;

    let response: any = {};

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

    response = authorizedRoutes;
    return NextResponse.json([...response]);
}