# Download Link Audit

Last checked: 2026-05-11.

Source policy: only official VPN Unlimited pages and official store URLs are acceptable sources. Do not invent hidden installer URLs.

## Confirmed From Official VPN Unlimited Pages

- Windows:
  - `https://www.vpnunlimited.com/api/keepsolid/vpn-download?platform=windows`
  - Source: `https://www.vpnunlimited.com/downloads/windows`
- macOS:
  - `https://www.vpnunlimited.com/api/keepsolid/vpn-download?platform=mac`
  - Additional official older-version endpoints exist on the source page:
    - `https://www.vpnunlimited.com/api/keepsolid/vpn-download?platform=mac-old-14`
    - `https://www.vpnunlimited.com/api/keepsolid/vpn-download?platform=mac-old-11`
    - `https://www.vpnunlimited.com/api/keepsolid/vpn-download?platform=mac-old`
  - Source: `https://www.vpnunlimited.com/downloads/macos`
- Linux:
  - `https://www.vpnunlimited.com/api/keepsolid/vpn-download?platform=linux-new`
  - `https://www.vpnunlimited.com/api/keepsolid/vpn-download?platform=linux-mint`
  - Source: `https://www.vpnunlimited.com/downloads/linux`
- Android:
  - `https://www.vpnunlimited.com/api/keepsolid/vpn-download?platform=android`
  - `https://www.vpnunlimited.com/api/keepsolid/vpn-download?platform=android-nogs`
  - Source: `https://www.vpnunlimited.com/downloads/android`
- iOS:
  - `https://apps.apple.com/app/apple-store/id694633015?ct=downloads-site-ios&mt=8`
  - Source: `https://www.vpnunlimited.com/downloads/ios`
- Chrome:
  - `https://chrome.google.com/webstore/detail/vpn-unlimited-free-unbloc/mpcaainmfjjigeicjnlkdfajbioopjko`
  - Source: `https://www.vpnunlimited.com/downloads/chrome`
- Firefox:
  - `https://addons.mozilla.org/en-US/firefox/addon/vpn-unlimited-secure-proxy/?src=external-website`
  - Source: `https://www.vpnunlimited.com/downloads/firefox`
- Opera:
  - `https://www.vpnunlimited.com/api/keepsolid/vpn-download?platform=opera`
  - Source: `https://www.vpnunlimited.com/downloads/opera`
- Edge:
  - `https://microsoftedge.microsoft.com/addons/detail/efjpcfdfbddknjbfjhbamlmmbpkgejfi`
  - Source: `https://www.vpnunlimited.com/downloads/edge`
- Apple TV:
  - `https://www.vpnunlimited.com/help/manuals/apple-tv`
  - Source: `https://www.vpnunlimited.com/downloads/apple-tv`
- Amazon Fire TV:
  - `https://www.amazon.com/KeepSolid-VPN-Unlimited-Private-Internet/dp/B00MHNQK84/ref=sr_1_2?crid=3VLTN8V58VW2F&keywords=VPN+unlimited&qid=1651569923&sprefix=vpn+unlimite%2Caps%2C197&sr=8-2`
  - Source: `https://www.vpnunlimited.com/downloads/amazon-fire-tv`
- Telegram Bot:
  - `https://t.me/keepsolid_vpnunlimited_bot`
  - Source: `https://www.vpnunlimited.com/downloads/telegram-bot`

## Confirmed From Current Repository Code

- Microsoft Store Windows app:
  - `https://www.microsoft.com/p/vpn-unlimited-secure-private-internet-connection-for-anonymous-web-surfing/9nrqblr605rg?activetab=pivot:overviewtab`
  - Source: `apps/vpnunlimited/nuxt4/components/downloads/StoreButtons.vue`

## Notes

Some official download buttons route through `https://www.vpnunlimited.com/api/keepsolid/vpn-download?platform=...` and return binary content or redirects. The static mini project should link to those public endpoints instead of guessing final CDN file URLs.
