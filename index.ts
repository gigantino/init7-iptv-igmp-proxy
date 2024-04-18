export default {
	async fetch(request: Request): Promise<Response> {
		const reqUrl = new URL(request.url);
		const reqParams = new URLSearchParams(reqUrl.search);

		const host = reqParams.get("host");
		if (!host) return new Response('The "host" parameter is missing.', { status: 400 });

		const protocol = reqParams.get("protocol");
		if (!protocol)
			return new Response('The "protocol" parameter is missing.', {
				status: 400,
			});
		if (protocol !== "http" && protocol !== "https") {
			return new Response('The only supported protocols are "http" and "https"', { status: 400 });
		}

		const type = reqParams.get("type");
		if (!type)
			return new Response('The "type" parameter is missing.', {
				status: 400,
			});
		if (type !== "xspf" && type !== "m3u") {
			return new Response('The only supported types are "m3u" and "xspf"', { status: 400 });
		}

		const tvChannelsReq = await fetch(`https://api.init7.net/tvchannels.${type}`).catch((e) => {
			console.error(e);
		});
		if (!tvChannelsReq || !tvChannelsReq.ok)
			return new Response("Internal server error.", { status: 500 });
		const fileBody = await tvChannelsReq.text().catch((e) => {
			console.error(e);
		});
		if (!fileBody) return new Response("Internal server error.", { status: 500 });

		const exportedFileType = type === "xspf" ? "application/xspf+xml" : "text/plain";

		const blob = new Blob(
			[
				replaceUdpLinks({
					fileBody,
					host,
					protocol,
				}),
			],
			{ type: exportedFileType },
		);

		return new Response(blob, {
			headers: {
				"Content-Type": exportedFileType,
				"Content-Disposition": `attachment; filename="Proxied-TV-Channels.${type}"`,
			},
		});
	},
};

const replaceUdpLinks = ({
	fileBody,
	host,
	protocol,
}: {
	fileBody: string;
	host: string;
	protocol: "http" | "https";
}) => {
	const pattern = /udp:\/\/@(\d+\.\d+\.\d+\.\d+:\d+)/g;
	const replacement = `${protocol}://${host}/udp/$1`;
	return fileBody.replace(pattern, replacement);
};
