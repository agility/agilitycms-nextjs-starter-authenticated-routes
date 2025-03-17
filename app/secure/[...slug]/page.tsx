
import {getPageTemplate} from "components/agility-pages"
import {PageProps, getAgilityPage} from "lib/cms/getAgilityPage"
import {getAgilityContext} from "lib/cms/useAgilityContext"
import {Metadata, ResolvingMetadata} from "next"
import {resolveAgilityMetaData} from "lib/cms-content/resolveAgilityMetaData"
import NotFound from "./not-found"
import InlineError from "components/common/InlineError"
import {SitemapNode} from "lib/types/SitemapNode"
import {notFound} from "next/navigation"


export const dynamic = "force-dynamic"

/**
 * Generate metadata for this page
 */
export async function generateMetadata(
	props: PageProps,
	parent: ResolvingMetadata
  ): Promise<Metadata> {
	const { params } = props;  // Remove the 'await' here


	const securedParams = await params;
	
	
	console.log('Params', await params);

	const { locale, sitemap, isDevelopmentMode, isPreview } = await getAgilityContext();
	const agilityData = await getAgilityPage({ params });

	if (!agilityData.page) return {};
	return await resolveAgilityMetaData({
	  agilityData,
	  locale,
	  sitemap,
	  isDevelopmentMode,
	  isPreview,
	  parent,
	});
  }
  export default async function Page({ params }: PageProps) {

	const agilityData = await getAgilityPage({ params });
	if (!agilityData.page) notFound();

	const AgilityPageTemplate = getPageTemplate(agilityData.pageTemplateName || "");

	return (
	  <div data-agility-page={agilityData.page?.pageID} data-agility-dynamic-content={agilityData.sitemapNode.contentID}>
		{AgilityPageTemplate ? (
		  <AgilityPageTemplate {...agilityData} />
		) : (
		  <InlineError message={`No template found for page template name: ${agilityData.pageTemplateName}`} />
		)}
	  </div>
	);
  }
