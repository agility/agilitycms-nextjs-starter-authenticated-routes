/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		authInterrupts: true,
	},
	//output: "standalone", //this is only for next.js on Azure Static Web Apps...
	reactStrictMode: true,
	// swcMinify: true, //deprecated
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*.aglty.io',
			},
		],
	},
}

module.exports = nextConfig
