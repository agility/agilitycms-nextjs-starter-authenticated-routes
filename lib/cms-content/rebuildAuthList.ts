import agility, { ApiClientInstance } from '@agility/content-fetch'




export const rebuildAuthList = async () => {

	const apiKey = process.env.AGILITY_API_FETCH_KEY

	const agilitySDK = agility.getApi({
		guid: process.env.AGILITY_GUID,
		apiKey,
		isPreview: false
	});

	//don't cache the redirections with nextjs cache - we are gonna do that manually...
	agilitySDK.config.fetchConfig = {
		next: {
			revalidate: 0,
		},
	}

	const routes = await agilitySDK.getContentList({
		referenceName: "AuthedRoutes",
		languageCode: "en-us",
	});

	const items = routes.items.map((item: any) => {
		return {
			"operation": "upsert",
			"key": item.fields.url.replaceAll("/", "_"),
			"value": item.fields.permissionText
		}
	})


	//push this to the edge config
	const edgeConfigId = `ecfg_wst0frv6xffd1jvik9l74killt5e`
	const teamID = `team_UNpzObkeavoCnysUgOZYDJAm`
	const your_vercel_api_token_here = process.env.VERCEL_API_TOKEN
	const url = `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items?teamId=${teamID}`;
	console.log("TOKEN", your_vercel_api_token_here)
	console.log("Updating edge config with new auth list", items)

	const updateEdgeConfig = await fetch(
		url,
		{
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${your_vercel_api_token_here}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ items })
		})

	const resJson = await updateEdgeConfig.json()

	console.log("Edge Config Updated", updateEdgeConfig.status, resJson)
}