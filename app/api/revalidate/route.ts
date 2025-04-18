import { rebuildAuthList } from "lib/cms-content/rebuildAuthList";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

interface IRevalidateRequest {
	state: string,
	instanceGuid: string
	languageCode: string
	referenceName?: string
	contentID?: number
	contentVersionID?: number
	pageID?: number
	pageVersionID?: number
	changeDateUTC: string
}

export async function POST(req: NextRequest) {

	//parse the body
	const data = await req.json() as IRevalidateRequest


	//only process publish events
	if (data.state === "Published" || data.state === "Unpublished" || data.state === "Deleted") {

		//revalidate the correct tags based on what changed
		if (data.referenceName) {
			//content item change
			if (data.referenceName === "authedroutes") {
				//kick off a rebuild to rebuild the list of authed routes
				await rebuildAuthList()
			}
			const itemTag = `agility-content-${data.referenceName}-${data.languageCode}`
			const listTag = `agility-content-${data.contentID}-${data.languageCode}`
			revalidateTag(itemTag)
			revalidateTag(listTag)
			console.log("Revalidating content tags:", itemTag, listTag)
		} else if (data.pageID !== undefined && data.pageID > 0) {
			//page change
			const pageTag = `agility-page-${data.pageID}-${data.languageCode}`
			revalidateTag(pageTag)


			//also revalidate the sitemaps
			const sitemapTagFlat = `agility-sitemap-flat-${data.languageCode}`
			const sitemapTagNested = `agility-sitemap-nested-${data.languageCode}`
			revalidateTag(sitemapTagFlat)
			revalidateTag(sitemapTagNested)

			console.log("Revalidating page and sitemap tags:", pageTag, sitemapTagFlat, sitemapTagNested)
		}
	}

	return NextResponse.json({ message: "OK" }, { status: 200 });


}