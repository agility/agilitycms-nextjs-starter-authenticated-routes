"use client"

// 'use client' marks this page as a Client Component
// https://beta.nextjs.org/docs/rendering/server-and-client-components

export default function Forbidden() {

	return (
		<section className="relative px-8">
			<div className="max-w-2xl mx-auto my-12 md:mt-18 lg:mt-20 prose prose-sm lg:prose-lg xl:prose-xl">
				<h1>Forbidden</h1>
				<p>You do not have access to that page.</p>
			</div>
		</section>
	)
}
