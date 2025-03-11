# Agility CMS & Next.js Starter with Authenticated Routes using Auth0 and RBAC

This is sample Next.js starter site that uses Agility CMS and aims to be a foundation for building sites using Next.js and Agility CMS.

[New to Agility CMS? Sign up for a FREE account](https://agilitycms.com/free)
---

### Configuring Auth0

[New to Auth0? Sign up for FREE account](https://auth0.com/signup)


### Configure your API

You will need to add a Custom API with RBAC enabled

<img width="1511" alt="Screenshot 2025-03-11 at 6 06 44 PM" src="https://github.com/user-attachments/assets/a5ef7690-206e-4829-9405-6aeb8f024896" />

<img width="1002" alt="Screenshot 2025-03-11 at 6 06 54 PM" src="https://github.com/user-attachments/assets/6e5506ea-a944-4571-9141-112c11d535b7" />

This gets configured in `/lib/auth0/auth0.ts`

The audience is the identifier used when creating the Custom API

```
export const auth0 = new Auth0Client({
  authorizationParameters: {
    scope: "openid profile email offline_access",
    audience: "http://localhost:3000",
  },
});
```


#### Setup your user Roles
<img width="1425" alt="Screenshot 2025-03-11 at 6 06 11 PM" src="https://github.com/user-attachments/assets/5dad16d1-104d-464c-86e1-82682f0746cb" />

Don't forget to assign the Roles to your users. 

#### Attaching the Roles to your Token
You need to setup a Post-Login action
<img width="1509" alt="Screenshot 2025-03-11 at 6 07 16 PM" src="https://github.com/user-attachments/assets/4d8dc25e-a25f-4097-9817-5cca635ca042" />

```
/**
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'http://localhost:3000';
  if (event.authorization) {
    api.idToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
    api.accessToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
  }
} 
```
---
### Configuring your Agility Instance

This requires some parity with your user Roles. When creating a list of secure pages for a specific group, the content list should be prefixed with the Group. 


#### Create a list of Roles

The content model is quite simple. Just a text field named `Group`.
<img width="629" alt="Screenshot 2025-03-11 at 6 22 30 PM" src="https://github.com/user-attachments/assets/26a98917-9b97-4f04-a0f2-e1866beeadae" />

These should match your Auth0 Groups. They are also case sensitive. 
<img width="841" alt="Screenshot 2025-03-11 at 6 19 42 PM" src="https://github.com/user-attachments/assets/98ce5e6b-0617-43c1-acf9-7a0467a5b978" />


#### Create role based content lists (to be your pages)
By using dynamic pages, we can turn a content list into pages within your site. Before we can do that though, we first need to create the lists.

You are going to create 3 fields, Title (text), Content (RichText) and Security Group (Linked Content as a selectable list connected to the Auth0-Groups list)

<img width="695" alt="Screenshot 2025-03-11 at 6 23 52 PM" src="https://github.com/user-attachments/assets/2d5bbf62-00b2-4a62-8bad-37554d62798d" />

<img width="1244" alt="Screenshot 2025-03-11 at 6 24 14 PM" src="https://github.com/user-attachments/assets/c111ed25-d9af-4103-a58c-2e50f4fd7582" />


#### Create the content list from the model
Be sure to name the content list `{Role} Pages` this will create the reference name without spaces ex. `EMSPages` `FirePages`

<img width="1511" alt="Screenshot 2025-03-11 at 6 39 16 PM" src="https://github.com/user-attachments/assets/4868b944-1891-4d38-9491-85b76ea50357" />


#### Add secured content pages to your lists


Now that your models are setup, you can add pages to each role list

We also assign a security group to the page content for routing purposes. 

<img width="791" alt="Screenshot 2025-03-11 at 6 34 12 PM" src="https://github.com/user-attachments/assets/9f927066-b310-4f2d-b435-1fca9ca48612" />




#### Making your lists Dynamic Pages

The last step in the setup is to create dynamic pages from each of your role based lists.

Be sure to select `Secure Page on Website` so that the Next.js middleware knows to authenticate against the route. 

<img width="1511" alt="Screenshot 2025-03-11 at 6 31 53 PM" src="https://github.com/user-attachments/assets/624d23d3-417a-47e0-a615-a6b50028ab70" />



### Caching

There are 2 new env var settings that are used to control caching.

- `AGILITY_FETCH_CACHE_DURATION`

  - this setting sets the number of seconds that content items retrieved using the Agility Fetch SDK will be cached as objects.
  - Works best to use this with on-demand invalidation. If your hosting environment doesn't support this, set it to `0` to disable caching, or set it to a low value, like `10` seconds.

- `AGILITY_PATH_REVALIDATE_DURATION`
  - this value controls the `revalidate` export that will tell next.js how long to cache a particular path segment. Set this to a longer value if you are using on-demand revalidation, and a lower value if not, and if your users expect content changes to be reflected earlier.

Agility will NOT cache anything in preview mode :)

#### On Demand Revalidation

- If you are hosting your site on an environment that supports Next.js on-demand revalidation, then you should be using the `AGILITY_FETCH_CACHE_DURATION` value and actively caching items returned from the SDK.
- the revalidation endpoint example is located at `app/api/revalidate/route.ts` and will revalidate the items based on the tags that are used to cache those object.
- The `lib/cms-content` has examples of how to retrieve content while specifying the cache tags for it.

## Changes

This starter now relies on component based data-fetching.

## About This Starter

- Uses our [`@agility/nextjs`](https://www.npmjs.com/package/@agility/nextjs) package to make getting started with Agility CMS and Next.js easy
- Support for Next.js 15.0.3
- Connected to a sample Agility CMS Instance for sample content & pages
- Supports [`next/image`](https://nextjs.org/docs/api-reference/next/image) for image optimization using the `<Image />` component or the next.js `<Image />` component for images that aren't stored in Agility.
- Supports full [Page Management](https://help.agilitycms.com/hc/en-us/articles/360055805831)
- Supports Preview Mode
- Supports the `next/font` package
- Provides a functional structure that dynamically routes each page based on the request, loads Layout Models (Page Templates) dynamically, and also dynamically loads and renders appropriate Agility CMS Components (as React Server Components)
- Supports component level data fetching.

### Tailwind CSS

This starter uses [Tailwind CSS](https://tailwindcss.com/), a simple and lightweight utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.

### TypeScript

This starter is written in TypeScript, with ESLint.

## Getting Started

To start using the Agility CMS & Next.js Starter, [sign up](https://agilitycms.com/free) for a FREE account and create a new Instance using the Blog Template.

1. Clone this repository
2. Run `npm install` or `yarn install`
3. Rename the `.env.local.example` file to `.env.local`
4. Retrieve your `GUID`, `API Keys (Preview/Fetch)`, and `Security Key` from Agility CMS by going to [Settings > API Keys](https://manager.agilitycms.com/settings/apikeys).

[How to Retrieve your GUID and API Keys from Agility](https://help.agilitycms.com/hc/en-us/articles/360031919212-Retrieving-your-API-Key-s-Guid-and-API-URL-)

## Running the Site Locally

### Development Mode

When running your site in `development` mode, you will see the latest content in real-time from the CMS.

#### yarn

1. `yarn install`
2. `yarn dev`

This will launch the site in development mode, using your preview API key to pull in the latest content from Agility.

#### npm

1. `npm install`
2. `npm run dev`

### Production Mode

When running your site in `production` mode, you will see the published content from Agility.

#### yarn

1. `yarn build`
2. `yarn start`

#### npm

1. `npm run build`
2. `npm run start`

## Accessing Content

You can use the Agility Content Fetch SDK normally - either REST or GraphQL within server components.

## Deploying Your Site

The easiest way to deploy a Next.js website to production is to use [Vercel](https://vercel.com/) from the creators of Next.js, or [Netlify](https:netlify.com). Vercel and Netlify are all-in-one platforms - perfect for Next.js.

## Resources

### Agility CMS

- [Official site](https://agilitycms.com)
- [Documentation](https://agilitycms.com/docs)

### Next.js

- [Official site](https://nextjs.org/)
- [Documentation](https://nextjs.org/docs/getting-started)

### Vercel

- [Official site](https://vercel.com/)

### Netlify

- [Official site](https://netlify.com/)

### Tailwind CSS

- [Official site](http://tailwindcss.com/)
- [Documentation](http://tailwindcss.com/docs)

### Community

- [Official Slack](https://agilitycms.com/join-slack)
- [Blog](https://agilitycms.com/resources/posts)
- [GitHub](https://github.com/agility)

- [LinkedIn](https://www.linkedin.com/company/agilitycms)
- [X](https://x.com/agilitycms)
- [Facebook](https://www.facebook.com/AgilityCMS/)

## Feedback and Questions

If you have feedback or questions about this starter, please use the [Github Issues](https://github.com/agility/agilitycms-nextjs-starter/issues) on this repo, or join our [Community Slack Channel](https://agilitycms.com/join-slack).
