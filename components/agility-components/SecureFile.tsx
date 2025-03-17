import { renderHTML, Module, UnloadedModuleProps } from "@agility/nextjs"
import { getContentItem } from "lib/cms/getContentItem"

interface ISecureFile {
	secureFile: string
}

const SecureFile = async ({ module, languageCode, sitemapNode }: UnloadedModuleProps) => {
	const {
		fields: { secureFile },
		contentID,
	} = await getContentItem<ISecureFile>({
		contentID: module.contentid,
		languageCode,
	})

	const json = JSON.parse(secureFile)
	const secureFileName = json.name
	const label = json.label || secureFileName

	const url = '/file/' + secureFileName + '?auth=' + encodeURIComponent(sitemapNode.path)

	return (
		<section id={`${contentID}`} className="relative px-8" data-agility-component={contentID}>
			<div className="max-w-2xl mx-auto my-12 md:mt-18 lg:mt-20">
				<div>Download secure file: <a href={url} target="_blank" referrerPolicy="no-referrer" className="text-indigo-600 hover:underline">{label}</a></div>

			</div>
		</section>
	)
}

export default SecureFile
