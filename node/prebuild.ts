import { rebuildAuthList } from "lib/cms-content/rebuildAuthList"

require("dotenv").config({
	path: `.env.local`,
})

const doWork = async () => {

	console.log("Agility Website => Prebuild Started")
	// *** rebuild the auth lookup ***
	await rebuildAuthList()


	console.log("Agility Website => Prebuild Complete")

}


doWork()