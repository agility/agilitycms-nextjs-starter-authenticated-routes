import { ImageField, ContentItem } from "@agility/nextjs"
import { IAuthor } from "./IAuthor"
import { ICategory } from "./ICategory"
import { ITag } from "./ITag"

export interface IPermission {
	name: string
}

export interface ISecureComponent {
	title: string
	content?: string
	permissions: ContentItem<IPermission>[]
}