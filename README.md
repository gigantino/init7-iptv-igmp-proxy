# init7-iptv-igmp-proxy

Dynamic proxy between [Init7 IPTV (TV7)](https://www.init7.net/en/support/faq/TV7-Voraussetzungen/) and your current IGMP network configuration, to ensure streaming across all devices.
This exists because the endpoints provided by Init7 ([xspf](https://api.init7.net/tvchannels.xspf) and [m3u](https://api.init7.net/tvchannels.m3u)) are connecting directly with the UDP protocol (which works only if you are connected with your LAN in most scenarios).

## Usage

If you aren't planning on self-hosting, you can simply use the following endpoint:

```
https://init7.ggtn.ch/?host=[your-proxy-ip]&protocol=[your-protocol (http/https)]&type=[your-file-format (xspf/m3u)]
```

Once you do that, simply go to `VLC > Open Network`, paste the URL and click on "open". That should do the job! :)
If you are planning on self-hosting it, simply clone this repository and deploy it on Cloudflare Workers. The process is super straight forward and free of charge, but if you are still confused have a look at this [quickstart](https://developers.cloudflare.com/workers/get-started/quickstarts/).

## License

This project is licensed under the MIT License
