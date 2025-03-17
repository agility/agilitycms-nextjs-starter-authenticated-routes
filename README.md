# Agility CMS & Next.js Starter with Authenticated Routes, Authenticated Components & Authenticated Files

This build is a little bit different than the main repo. It uses user permissions instead of token roles. 

This is sample Next.js starter site that uses Agility CMS and aims to be a foundation for building sites using Next.js and Agility CMS.

[New to Agility CMS? Sign up for a FREE account](https://agilitycms.com/free)
---

### Configuring Auth0

[New to Auth0? Sign up for FREE account](https://auth0.com/signup)


#### Configure your API

You will need to add a Custom API with RBAC enabled as well ensure that include permissions in the Access Token.

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

#### Add your permissions groups to your Custom API

<img width="1057" alt="Screenshot 2025-03-17 at 1 11 45 PM" src="https://github.com/user-attachments/assets/f7832308-d9cd-4275-98d7-ba6796a5b1cd" />


#### Add the permissions to your users

<img width="1238" alt="Screenshot 2025-03-17 at 1 13 44 PM" src="https://github.com/user-attachments/assets/68048de0-fa00-4c09-af37-e53b37cc19bb" />


---
### Configuring your Agility Instance

#### Create a list of permissions

<img width="1229" alt="Screenshot 2025-03-17 at 1 15 45 PM" src="https://github.com/user-attachments/assets/f835b6cd-05bd-415d-b566-9d7e7c018423" />

#### Create an authenticated routes list

<img width="1229" alt="Screenshot 2025-03-17 at 1 43 03 PM" src="https://github.com/user-attachments/assets/c585d13f-369d-4bb4-93ff-7db8d3d3d109" />

Your model should look something similar to this

<img width="1226" alt="Screenshot 2025-03-17 at 1 47 37 PM" src="https://github.com/user-attachments/assets/b69d1cf4-ed97-4727-806a-2b67fddd0b8a" />

Here is an example of how we link to the user permissions list

<img width="1317" alt="Screenshot 2025-03-17 at 1 41 06 PM" src="https://github.com/user-attachments/assets/eab3dddf-8bd2-4e00-9f8f-b453b58d6e56" />


#### You can also add permissions to Page Components to enforce only certain parts of the page requiring authenticated to be viewed instead of the entire route


<img width="1206" alt="Screenshot 2025-03-17 at 1 54 16 PM" src="https://github.com/user-attachments/assets/c1ab8467-2c94-46c8-b504-1ce05e9a747f" />

#### Lastly, this starter also includes an example of the Secure Files app which binds permissions to the routing permissions found in your Secured Routes lists

<img width="1210" alt="Screenshot 2025-03-17 at 1 56 13 PM" src="https://github.com/user-attachments/assets/e63b705f-cf8e-43d9-a20e-22e25bc8f073" />

#### To add the Secure Files app to your instance go to Settings > Apps
<img width="1212" alt="Screenshot 2025-03-17 at 1 57 56 PM" src="https://github.com/user-attachments/assets/82c04c9b-77d4-4799-a9aa-c8434c5105c3" />


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
