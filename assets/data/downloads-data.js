(function (root) {
  const locales = [
    { code: "en", label: "English", dir: "ltr" },
    { code: "ru", label: "Русский", dir: "ltr" },
    { code: "es", label: "Español", dir: "ltr" },
    { code: "fr", label: "Française", dir: "ltr" },
    { code: "de", label: "Deutsche", dir: "ltr" },
    { code: "ua", label: "Українська", dir: "ltr" },
    { code: "pt", label: "Portuguese", dir: "ltr" },
    { code: "fa", label: "فارسی", dir: "rtl" },
    { code: "ar", label: "عربى", dir: "rtl" },
    { code: "jp", label: "日本語", dir: "ltr" },
    { code: "zh", label: "中国", dir: "ltr" },
    { code: "sv", label: "Svenska", dir: "ltr" },
    { code: "fi", label: "Suomalainen", dir: "ltr" },
    { code: "no", label: "Norsk", dir: "ltr" },
    { code: "ko", label: "한국어", dir: "ltr" },
  ];

  const labels = {
    en: {
      service: "VPN Service",
      download: "VPN Download",
      choosePlatform: "Choose Your Platform",
      benefits: "Benefits:",
      downloadsTitle: "VPN Unlimited Downloads",
      downloadsLead: "Get VPN Unlimited apps and extensions for every supported platform.",
      viewPlatform: "View downloads",
      ratingLabel: "Rating",
      language: "Language",
    },
  };

  const navigation = [
    {
      title: "Desktop/Laptop",
      titleLink: "desktop",
      items: [
        { slug: "macos", label: "macOS", icon: "macos" },
        { slug: "windows", label: "Windows", icon: "windows" },
        { slug: "linux", label: "Linux", icon: "linux" },
      ],
    },
    {
      title: "Mobile",
      titleLink: "mobile",
      items: [
        { slug: "ios", label: "iOS", icon: "ios" },
        { slug: "android", label: "Android", icon: "android" },
        { slug: "windows-phone", label: "Windows Phone", icon: "windows" },
      ],
    },
    {
      title: "Browsers",
      titleLink: "browsers",
      items: [
        { slug: "chrome", label: "Chrome", icon: "chrome" },
        { slug: "firefox", label: "Firefox", icon: "firefox" },
        { slug: "opera", label: "Opera", icon: "opera" },
        { slug: "edge", label: "Edge", icon: "edge" },
      ],
    },
    {
      title: "Online TV",
      titleLink: "online-tv",
      items: [
        { slug: "apple-tv", label: "Apple TV", icon: "ios" },
        { slug: "amazon-fire-tv", label: "Amazon Fire", icon: "android" },
        { externalPath: "https://www.vpnunlimited.com/help/manuals/how-to-use-on-roku", label: "Roku", icon: "android" },
        { externalPath: "https://www.vpnunlimited.com/help/manuals/how-to-use-on-chromecast", label: "Google Chromecast", icon: "chrome" },
        { externalPath: "https://www.vpnunlimited.com/help/manuals/openvpn-for-kodi", label: "Kodi", icon: "android" },
      ],
    },
    {
      title: "Manual Configuration",
      titleLink: "manual-configuration",
      items: [
        { externalPath: "https://www.vpnunlimited.com/help/manuals/vpn-routers", label: "Routers", icon: "linux" },
        { externalPath: "https://www.vpnunlimited.com/help/manuals/synology-openvpn-setup", label: "NAS", icon: "linux" },
      ],
    },
    {
      title: "Telegram Bot",
      titleLink: "telegram-bot",
      items: [
        { slug: "telegram-bot", label: "VPN Unlimited Bot", icon: "telegram" },
      ],
    },
  ];

  const sharedBenefits = [
    "Secure Data Encryption",
    "Easy to use on your device",
    "Access to 3000 Servers Worldwide",
    "30-day money-back guarantee",
  ];

  const pages = {
    windows: {
      group: "desktop",
      title: "VPN for Windows",
      seoTitle: "Download Windows VPN for PC",
      description: "Download VPN Unlimited for Windows and protect your online privacy on Windows 10, Windows 11, and ARM-compatible devices.",
      image: "windows_18923.webp",
      imageAlt: "VPN Unlimited Windows app",
      compatibility: "Windows 10 (64-bit) or Windows 11",
      note: "Windows 11 and ARM compatible",
      rating: "4.8",
      icon: "win.svg",
      primaryLinks: [
        {
          label: "Get it on Microsoft",
          href: "https://www.microsoft.com/p/vpn-unlimited-secure-private-internet-connection-for-anonymous-web-surfing/9nrqblr605rg?activetab=pivot:overviewtab",
          type: "store",
          store: "microsoft",
        },
        {
          label: "Download from Website",
          href: "https://www.vpnunlimited.com/api/keepsolid/vpn-download?platform=windows",
          type: "direct",
          verified: "official-downloads-page",
        },
      ],
      benefits: [
        "Secure Data Encryption",
        "Easy to Use with Windows 11",
        "Access to 3000 Servers Worldwide",
        "30-day money-back guarantee",
      ],
      manuals: [
        {
          label: "Other / Previous versions",
          href: "https://www.vpnunlimited.com/help/manuals/how-to-use-on-windows",
        },
      ],
      contentTitle: "Why use Windows VPN",
      contentImage: "test-image_3070.svg",
      sections: [
        {
          title: "Instantly Mask Your True IP Address on Windows",
          body: "Connect to one of over 3,000 servers across the globe with our KeepSolid VPN Unlimited Windows app and immediately mask your genuine IP address and physical location. Going forward, sites and services will only detect the secure, virtual IP of your chosen VPN Unlimited server - ensuring complete privacy and digital anonymity on your Windows PC.",
        },
        {
          title: "Lock Down Your Web Traffic with Advanced AES-256 Encryption",
          body: "VPN Unlimited for Windows utilizes the industry-standard AES-256 encryption protocol to safeguard every bit of your sensitive browsing data. With this robust encryption in place, no third party or malicious actor can intercept your Windows web traffic. Download the trusted VPN solution for Windows and enjoy airtight protection against invasive surveillance and digital cyber threats.",
        },
        {
          title: "Activate the Kill Switch for Uninterrupted Security",
          body: "Our built-in Kill Switch feature is designed to keep your data secure, even if your VPN connection drops unexpectedly. If KeepSolid VPN Unlimited loses connection, Kill Switch will instantly suspend your device's internet access until the encrypted tunnel is reestablished - preventing any possibility of unprotected traffic exposure. Enjoy steadfast protection crafted for true peace of mind.",
        },
        {
          title: "Stream Global Content Libraries from Any Location",
          body: "With a selection of dedicated streaming servers, KeepSolid VPN Unlimited empowers you to unlock and enjoy top-tier online content libraries, including those from Hulu, BBC iPlayer, ESPN+, and Max. Download KeepSolid VPN Unlimited on your Windows PC and confidently stream must-see shows, sporting events, and acclaimed series - regardless of where you are in the world.",
        },
      ],
      howTo: {
        title: "Install a VPN for Windows in Three Easy Steps",
        note: "To learn how to download a standalone version of VPN Unlimited on macOS, please refer to our {{manuals}}. Choose MacBook as your platform and follow the steps given in the installation wizard. If you need any help, please check our {{faq}} or {{support}} - real people will answer your questions, not AI.",
        noteLinks: {
          manuals: { label: "Manuals", href: "https://www.vpnunlimited.com/help/manuals/how-to-use-on-windows" },
          faq: { label: "FAQ", href: "https://www.vpnunlimited.com/help/faq" },
          support: { label: "contact our Support team", href: "https://www.vpnunlimited.com/help/contact-support" },
        },
        storeLabel: "Windows 11",
        steps: [
          {
            title: "Download VPN for PC on Windows",
            icon: "icon_install_3113.svg",
            body: "",
          },
          {
            title: "Choose a VPN Unlimited server",
            icon: "icon_server_3111.svg",
            body: "",
          },
          {
            title: "Enjoy secure browsing",
            icon: "icon_brows_3112.svg",
            body: "",
          },
        ],
      },
      features: [
        {
          title: "256-bit Data Encryption",
          body: "Use the highest encryption level in the industry to secure your private data from hackers, snoopers and governments.",
          icon: "1_3106.svg",
          tone: "rose",
        },
        {
          title: "KeepSolid Wise technology",
          body: "Try additional level of encryption and obfuscation for your extended privacy and unlimited web access.",
          icon: "2_3109.svg",
          tone: "blue",
        },
        {
          title: "3000+ Servers in 80+ Locations",
          body: "No matter where you are or where you travel to, VPN Unlimited will connect you to your favorite content.",
          icon: "3_3105.svg",
          tone: "green",
        },
        {
          title: "Unlimited Devices",
          body: "VPN Unlimited allows you to pay once and use it on all your devices. So, whether it's your laptop, tablet, mobile, or PC, you can enjoy true freedom on every device.",
          icon: "4_3107.svg",
          tone: "purple",
        },
        {
          title: "Ultimate Speed & No Data Limit",
          body: "Download, browse, stream or share, VPN Unlimited users are free to do whatever they want!",
          icon: "rocket_15835.webp",
          tone: "mint",
        },
        {
          title: "Additional service",
          body: "Protect your online activities with our special extras: Team and Lifetime VPN subscription, Personal Server/IP options, and additional device slots.",
          icon: "key_15837.webp",
          tone: "yellow",
        },
      ],
      trial: {
        title: "Check VPN Unlimited with a trial.",
        subtitle: "7 day trial.",
        body: "Download VPN Unlimited on your Windows PC. And if it's your first time using our VPN for Desktop, you'll also get access to all the features of VPN Unlimited for Windows with a 7-day trial. Do check it out!",
        secondaryTitle: "No credit card required",
        secondaryBody: "You don't have to provide us any credit card information to get the VPN trial. After you've completed the VPN software download, all you need to do is create your KeepSolid ID. And you're all set to enjoy the top-notch VPN protection and online privacy!",
      },
      faq: [
        {
          question: "What is a Microsoft Windows VPN client?",
          answer: "VPN stands for a Virtual Private Network. The primary goal of VPN software is to encrypt your traffic on Windows and ensure online privacy. With a desktop VPN app, you are shielded from monitoring, bolster your protection against cyber threats, and enjoy borderless internet!",
        },
        {
          question: "What is a good VPN for Windows desktop?",
          answer: "A good Windows VPN should combine strong AES-256 encryption, stable native apps, a wide network of servers around the world, and transparent privacy controls. VPN Unlimited for Windows ticks all these boxes: it offers a built-in Kill Switch, dedicated streaming servers, optimal-server selection, and a strict no-logs policy, so you can browse, stream, and work online without leaving a trace.",
        },
        {
          question: "How to get and set up VPN on desktop computer?",
          answer: "Download VPN Unlimited for Windows from the Microsoft Store or directly from our website using the buttons above. Run the installer and follow the on-screen steps. Once the app is installed, launch it, sign in with your KeepSolid ID (or create one in seconds), pick a server location, and click Start — your desktop traffic is now encrypted and routed through the VPN tunnel.",
        },
        {
          question: "How do I use a VPN on Windows?",
          answer: "Open the VPN Unlimited app on your Windows PC and choose a server — either by region from the map, by ping from the list of optimal servers, or by special-purpose category (streaming, torrenting, additional security). Press Start to connect: from that moment your IP is masked, your traffic is encrypted, and your real location stays private. To disconnect, press Stop or quit the app.",
        },
      ],
    },
    macos: {
      group: "desktop",
      title: "Download VPN for Mac",
      seoTitle: "VPN for Mac - Download and Setup",
      description: "Download VPN Unlimited for macOS and protect your MacBook, iMac, Mac mini, or Mac Pro.",
      image: "macos_18921.webp",
      imageAlt: "VPN Unlimited macOS app",
      compatibility: "macOS Mojave 10.14 or later",
      note: "Mac App Store and standalone versions available",
      rating: "4.6",
      icon: "mac.svg",
      primaryLinks: [
        {
          label: "Download on the Mac App Store",
          href: "https://apps.apple.com/app/vpn-unlimited-simple-secure/id727593140",
          type: "store",
          store: "apple",
        },
        {
          label: "Download Standalone Version",
          href: "https://www.vpnunlimited.com/api/keepsolid/vpn-download?platform=mac",
          type: "direct",
          verified: "official-downloads-page",
        },
      ],
      benefits: [
        "Strong Protection and Unlimited Online Access",
        "Intuitive and User-Friendly VPN for Mac",
        "Thousands of Servers in 80+ Locations",
      ],
      sections: [
        {
          title: "VPN Unlimited - Your Personal VPN for MacBook, Mac Pro, Mac Mini",
          body: "Secure your Mac on public Wi-Fi, encrypt traffic, and browse without location limits.",
        },
      ],
    },
    linux: {
      group: "desktop",
      title: "Download VPN for Linux",
      seoTitle: "Download VPN for Linux",
      description: "Use VPN Unlimited on Linux for secure browsing and private access.",
      image: "download-best-vpn-for-linux_17417.webp",
      imageAlt: "VPN Unlimited Linux",
      compatibility: "Linux distributions supported by VPN Unlimited",
      note: "Manual package options are available on the official download page",
      rating: "4.7",
      icon: "linux.svg",
      primaryLinks: [
        { label: "Debian 64bit", href: "https://www.vpnunlimited.com/api/keepsolid/vpn-download?platform=linux-new", type: "direct", verified: "official-downloads-page" },
        { label: "Ubuntu / Debian / Mint 64bit", href: "https://www.vpnunlimited.com/api/keepsolid/vpn-download?platform=linux-mint", type: "direct", verified: "official-downloads-page" },
      ],
      benefits: sharedBenefits,
      sections: [
        { title: "VPN for Linux", body: "Protect your Linux workstation with encrypted VPN access and worldwide server locations." },
      ],
    },
    ios: {
      group: "mobile",
      title: "VPN for iOS",
      seoTitle: "Download VPN for iOS",
      description: "Download VPN Unlimited for iPhone and iPad.",
      image: "ios_18924.webp",
      imageAlt: "VPN Unlimited iOS app",
      compatibility: "iPhone and iPad",
      note: "Available on the App Store",
      rating: "4.6",
      icon: "apple.svg",
      primaryLinks: [
        { label: "Download on the App Store", href: "https://apps.apple.com/app/apple-store/id694633015?ct=downloads-site-ios&mt=8", type: "store", store: "apple", verified: "official-downloads-page" },
      ],
      benefits: sharedBenefits,
      sections: [
        { title: "VPN for iPhone and iPad", body: "Secure mobile browsing and protect your traffic on public networks." },
      ],
    },
    android: {
      group: "mobile",
      title: "VPN for Android",
      seoTitle: "Download VPN for Android",
      description: "Download VPN Unlimited for Android phones and tablets.",
      image: "android_18925.webp",
      imageAlt: "VPN Unlimited Android app",
      compatibility: "Android phones and tablets",
      note: "Available on Google Play",
      rating: "4.5",
      icon: "andriod.svg",
      primaryLinks: [
        { label: "VPN apk Download", href: "https://www.vpnunlimited.com/api/keepsolid/vpn-download?platform=android", type: "direct", store: "google", verified: "official-downloads-page" },
        { label: "Google-free APK file", href: "https://www.vpnunlimited.com/api/keepsolid/vpn-download?platform=android-nogs", type: "direct", verified: "official-downloads-page" },
      ],
      benefits: sharedBenefits,
      sections: [
        { title: "VPN for Android", body: "Protect your Android traffic with VPN Unlimited and browse securely wherever you are." },
      ],
    },
    "windows-phone": {
      group: "mobile",
      title: "VPN for Windows Phone",
      seoTitle: "VPN Unlimited for Windows Phone",
      description: "View VPN Unlimited setup information for Windows Phone and continue browsing supported downloads.",
      image: "windows-phone-main_2106.webp",
      imageAlt: "VPN Unlimited for Windows Phone",
      compatibility: "Windows Phone",
      note: "Windows Phone setup information",
      rating: "4.8",
      icon: "win.svg",
      primaryLinks: [
        { label: "View manual", href: "https://www.vpnunlimited.com/help/manuals/how-to-use-on-windows", type: "direct", verified: "official-downloads-page" },
      ],
      benefits: sharedBenefits,
      sections: [
        { title: "VPN Unlimited for Windows Phone", body: "This static downloads page keeps Windows Phone navigation inside the standalone site and points you to the available setup information when you need legacy device details." },
      ],
      showOtherPlatforms: true,
    },
    chrome: {
      group: "browsers",
      title: "VPN for Chrome",
      seoTitle: "Chrome VPN Extension",
      description: "Install the VPN Unlimited extension for Google Chrome.",
      image: "browser_18926.webp",
      imageAlt: "VPN Unlimited Chrome extension",
      compatibility: "Google Chrome",
      note: "Browser extension",
      rating: "4.6",
      icon: "chrome.svg",
      primaryLinks: [
        { label: "Open Chrome Web Store", href: "https://chrome.google.com/webstore/detail/vpn-unlimited-free-unbloc/mpcaainmfjjigeicjnlkdfajbioopjko", type: "store", verified: "official-downloads-page" },
      ],
      benefits: sharedBenefits,
      sections: [
        { title: "Chrome VPN Extension", body: "Add VPN Unlimited to Chrome for quick browser privacy controls." },
      ],
    },
    firefox: {
      group: "browsers",
      title: "VPN for Firefox",
      seoTitle: "Firefox VPN Extension",
      description: "Install the VPN Unlimited extension for Mozilla Firefox.",
      image: "browser_18926.webp",
      imageAlt: "VPN Unlimited Firefox extension",
      compatibility: "Mozilla Firefox",
      note: "Browser extension",
      rating: "4.5",
      icon: "firefox.svg",
      primaryLinks: [
        { label: "Open Firefox Add-ons", href: "https://addons.mozilla.org/en-US/firefox/addon/vpn-unlimited-secure-proxy/?src=external-website", type: "store", verified: "official-downloads-page" },
      ],
      benefits: sharedBenefits,
      sections: [
        { title: "Firefox VPN Extension", body: "Use VPN Unlimited with Firefox for browser-level privacy." },
      ],
    },
    opera: {
      group: "browsers",
      title: "VPN for Opera",
      seoTitle: "Opera VPN Extension",
      description: "Install VPN Unlimited for Opera.",
      image: "browser_18926.webp",
      imageAlt: "VPN Unlimited Opera extension",
      compatibility: "Opera browser",
      note: "Browser extension",
      rating: "4.5",
      icon: "opera.svg",
      primaryLinks: [
        { label: "Download Opera Extension", href: "https://www.vpnunlimited.com/api/keepsolid/vpn-download?platform=opera", type: "direct", verified: "official-downloads-page" },
      ],
      benefits: sharedBenefits,
      sections: [
        { title: "Opera VPN Extension", body: "Use VPN Unlimited in Opera for protected browser access." },
      ],
    },
    edge: {
      group: "browsers",
      title: "VPN for Edge",
      seoTitle: "Microsoft Edge VPN Extension",
      description: "Install VPN Unlimited for Microsoft Edge.",
      image: "browser_18926.webp",
      imageAlt: "VPN Unlimited Edge extension",
      compatibility: "Microsoft Edge",
      note: "Browser extension",
      rating: "4.5",
      icon: "edge.svg",
      primaryLinks: [
        { label: "Open Edge Add-ons", href: "https://microsoftedge.microsoft.com/addons/detail/efjpcfdfbddknjbfjhbamlmmbpkgejfi", type: "store", verified: "official-downloads-page" },
      ],
      benefits: sharedBenefits,
      sections: [
        { title: "Edge VPN Extension", body: "Protect your Edge browsing with VPN Unlimited." },
      ],
    },
    "apple-tv": {
      group: "online-tv",
      title: "VPN for Apple TV",
      seoTitle: "VPN for Apple TV",
      description: "Set up VPN Unlimited for Apple TV.",
      image: "vpn-for-apple-tv_3149.webp",
      imageAlt: "VPN Unlimited Apple TV",
      compatibility: "Apple TV",
      note: "Streaming device setup",
      rating: "4.5",
      icon: "apple.svg",
      primaryLinks: [
        { label: "View manual", href: "https://www.vpnunlimited.com/help/manuals/apple-tv", type: "direct", verified: "official-downloads-page" },
      ],
      benefits: sharedBenefits,
      sections: [
        { title: "VPN for Apple TV", body: "Use VPN Unlimited setup guidance for streaming on Apple TV." },
      ],
    },
    "amazon-fire-tv": {
      group: "online-tv",
      title: "VPN for Amazon Fire TV",
      seoTitle: "VPN for Amazon Fire TV",
      description: "Set up VPN Unlimited for Amazon Fire TV.",
      image: "android-downloads_16401.webp",
      imageAlt: "VPN Unlimited Amazon Fire TV",
      compatibility: "Amazon Fire TV",
      note: "Streaming device setup",
      rating: "4.5",
      icon: "andriod.svg",
      primaryLinks: [
        { label: "Open Amazon Appstore", href: "https://www.amazon.com/KeepSolid-VPN-Unlimited-Private-Internet/dp/B00MHNQK84/ref=sr_1_2?crid=3VLTN8V58VW2F&keywords=VPN+unlimited&qid=1651569923&sprefix=vpn+unlimite%2Caps%2C197&sr=8-2", type: "store", verified: "official-downloads-page" },
      ],
      benefits: sharedBenefits,
      sections: [
        { title: "VPN for Amazon Fire TV", body: "Follow VPN Unlimited setup instructions for Amazon Fire TV." },
      ],
    },
    "telegram-bot": {
      group: "telegram-bot",
      title: "VPN Unlimited Telegram Bot",
      seoTitle: "VPN Unlimited Telegram Bot",
      description: "Use VPN Unlimited Telegram Bot for XRay protocol access.",
      image: "tg-vpnu-main-banner_18797.webp",
      imageAlt: "VPN Unlimited Telegram Bot",
      compatibility: "Telegram",
      note: "Telegram-based access option",
      rating: "4.5",
      icon: "telegram.svg",
      primaryLinks: [
        { label: "Open Telegram Bot", href: "https://t.me/keepsolid_vpnunlimited_bot", type: "store", verified: "official-downloads-page" },
      ],
      benefits: sharedBenefits,
      sections: [
        { title: "Telegram Bot", body: "Use the Telegram Bot access option with VPN Unlimited." },
      ],
    },
  };

  const otherPlatforms = {
    title: "Get VPN Unlimited for Other Platforms",
    lead: "Download VPN app for other platforms, as well as Windows. Fast, secure, and Unlimited!",
    stores: [
      {
        type: "store",
        store: "apple",
        variant: "ios",
        label: "App Store",
        href: "https://apps.apple.com/app/apple-store/id694633015?ct=downloads-site-ios&mt=8",
      },
      {
        type: "store",
        store: "apple",
        variant: "mac",
        label: "Mac App Store",
        href: "https://apps.apple.com/app/id727593140?ct=downloads-site-macos&mt=12",
      },
      {
        type: "store",
        store: "google",
        variant: "play",
        label: "Get it on Google Play",
        href: "https://play.google.com/store/apps/details?id=com.simplexsolutionsinc.vpn_unlimited&referrer=utm_source%3Ddownloads-site",
      },
    ],
    trustBadges: [
      { label: "Granted 7-day trial", icon: "check" },
      { label: "30-day money-back guarantee", icon: "shield" },
    ],
  };

  root.DOWNLOADS_DATA = {
    version: "2026-05-12",
    locales,
    defaultLocale: "en",
    labels,
    navigation,
    pages,
    otherPlatforms,
  };
})(typeof window !== "undefined" ? window : globalThis);
