import { UnloadedModuleProps } from "@agility/nextjs";
import { auth0 } from "lib/auth0/auth0";
import { getContentItem } from "lib/cms/getContentItem";
const jwt = require("jsonwebtoken");

export default async function SecureComponent({
  module,
  languageCode,
}: UnloadedModuleProps) {
  //   const { user, isLoading, error } = useUser();
  let userPermissions: string[] = [];
  const session = await auth0.getSession();
  if (session) {
    const decoded = jwt.decode(session.tokenSet.accessToken, {
      complete: true,
    });
    userPermissions = decoded.payload.permissions;
  } else {
    return (
      <div className="p-4 bg-white shadow-md rounded-md max-w-screen-xl mx-auto">
        <h3 className="text-xl font-bold mb-2">
          Please log in to view this content.
        </h3>
      </div>
    );
  }

  const {
    fields: { title, content, permissions },
    contentID,
  } = await getContentItem<any>({
    contentID: module.contentid,
    languageCode,
  });

  if (
    !permissions.some((permission: string) =>
      userPermissions.includes(permission)
    )
  ) {
    return (
      <div className="p-4 bg-white shadow-md rounded-md max-w-screen-xl mx-auto">
        <h3 className="text-xl font-bold mb-2">
          You are not authorized to view this content.
        </h3>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-md max-w-screen-xl mx-auto">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div
        className="text-gray-700"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
