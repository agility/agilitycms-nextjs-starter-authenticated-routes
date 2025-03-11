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
    const decodedToken = jwt.decode(accessToken,  { complete: true })
    const authorizedRoles = decodedToken.payload['http://localhost:3000/roles'];

    let response: any = {};
    await Promise.all(authorizedRoles.map(async (role: string) => {
        const list = await getContentList({
            referenceName: `${role}Pages`, // you must have a corrisponding content list in agility
            locale: process.env.AGILITY_LOCALES || 'en-us',
        });
        response[role] = list;
    }));

    // Your secure logic here
    return NextResponse.json({ ...response });
}