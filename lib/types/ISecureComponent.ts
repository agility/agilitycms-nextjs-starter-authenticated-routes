import { ContentItem } from "@agility/nextjs"

export interface IPermission {
	group: string
}

export interface ISecureComponent {
	title: string
	content?: string
	permissions: ContentItem<IPermission>[]
}