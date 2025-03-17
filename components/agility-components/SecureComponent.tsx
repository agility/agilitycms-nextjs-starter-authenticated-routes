import { UnloadedModuleProps } from "@agility/nextjs";
import { auth0 } from "lib/auth0/auth0";
import { getContentItem } from "lib/cms/getContentItem";
import { ISecureComponent } from "lib/types/ISecureComponent";
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
      <section className="relative px-8">
        <div className="max-w-2xl mx-auto my-12 md:mt-18 lg:mt-20">
          <h3 className="text-xl font-bold mb-2">
            Please log in to view this content.
          </h3>
        </div>
      </section>
    );
  }

  //get the permissions list
  const {
    fields: { title, content, permissions },
    contentID,
  } = await getContentItem<ISecureComponent>({
    contentID: module.contentid,
    languageCode,
  });

  const permissionStrings = permissions.map(p => p.fields.group);

  console.log("my permissions", userPermissions)
  console.log("secure component permissions", permissionStrings);

  const hasPermission = permissionStrings.every((routePermission) => {
    return userPermissions.includes(routePermission);
  });

  console.log("hasPermission", hasPermission);

  if (!hasPermission) {
    return (
      <section id={`${contentID}`} className="relative px-8" data-agility-component={contentID}>
        <div className="max-w-2xl mx-auto my-12 md:mt-18 lg:mt-20">
          <h3 className="text-xl font-bold mb-2">
            You are not authorized to view this content.
          </h3>
        </div>
      </section>


    );
  }

  return (
    <section id={`${contentID}`} className="relative px-8" data-agility-component={contentID}>
      <div className="max-w-2xl mx-auto my-12 md:mt-18 lg:mt-20">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div
          className="text-gray-700"
          dangerouslySetInnerHTML={{ __html: content || "" }}
        />
      </div>
    </section>
  );
}
