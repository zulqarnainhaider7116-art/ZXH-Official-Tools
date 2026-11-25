import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://zxh-official-tools.pages.dev";
const siteName = "ZXH OFFICIAL TOOLKIT";
const ownerName = "ZULQARNAIN X HAIDER";
const description =
  "Explore ZXH OFFICIAL TOOLKIT by Zulqarnain X Haider: a free, mobile-friendly collection of 100+ online tools for developers, creators and everyday users. Discover AI utilities, web development tools, image and media utilities, SEO helpers, security resources, productivity tools, Islamic and Quran resources, and more — fast, accessible and easy to use.";

const keywords = [
  "ZXH Official", "ZXH Official Toolkit", "ZXH Official Tools", "Zulqarnain X Haider",
  "Zulqarnain Haider developer", "ZXH developer", "online tools", "free online tools",
  "100+ free tools", "all in one tools website", "web tools", "developer tools",
  "web development tools", "HTML CSS JavaScript tools", "TypeScript tools",
  "React tools", "Next.js tools", "AI tools", "AI utilities", "AI powered tools",
  "image tools", "image converter", "image compressor", "media tools",
  "video tools", "audio tools", "social media tools", "social media downloader",
  "SEO tools", "SEO checker", "meta tag generator", "JSON tools", "text tools",
  "PDF tools", "QR code tools", "productivity tools", "utility tools",
  "security tools", "cybersecurity utilities", "Islamic tools", "Quran tools",
  "mobile friendly tools", "free web applications", "PWA tools",
  "creative developer Pakistan", "frontend development", "full stack development",
  "UI UX design", "website design", "digital toolkit", "ZXH portfolio"
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": siteUrl + "/#website",
      "url": siteUrl + "/",
      "name": siteName,
      "alternateName": ["ZXH Official Tools", "ZXH Tools", "ZXH OFFICIAL"],
      "description": description,
      "inLanguage": ["en", "ur"],
      "publisher": { "@id": siteUrl + "/#organization" }
    },
    {
      "@type": "Organization",
      "@id": siteUrl + "/#organization",
      "name": "ZXH OFFICIAL",
      "alternateName": "ZXH Official",
      "url": siteUrl + "/",
      "logo": {
        "@type": "ImageObject",
        "url": siteUrl + "/assets/icon-512.png",
        "width": 512,
        "height": 512
      },
      "founder": { "@id": siteUrl + "/#person" },
      "sameAs": [
        "https://zxh-official-portfolio.pages.dev/",
        "https://mr-zxh-official.pages.dev/",
        "https://whatsapp.com/channel/0029Vb8XF2y1NCrQDWetrk1r",
        "https://chat.whatsapp.com/EKmQy6wjXZS4XfrD89qgva"
      ]
    },
    {
      "@type": "Person",
      "@id": siteUrl + "/#person",
      "name": ownerName,
      "alternateName": ["ZXH", "ZXH OFFICIAL", "Zulqarnain Haider"],
      "url": "https://zxh-official-portfolio.pages.dev/",
      "jobTitle": "Creative Developer, Designer and Digital Product Creator",
      "description": "Pakistani developer and digital product creator focused on building useful web applications, developer utilities, AI-powered tools, social media utilities, Islamic and Quran resources, security tools and responsive digital experiences.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Karachi",
        "addressCountry": "PK"
      },
      "knowsAbout": [
        "Full-stack web development", "Frontend development", "Website development",
        "React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS",
        "UI and UX design", "AI-powered tools and automations", "Web applications",
        "Progressive Web Apps", "Developer utilities", "SEO", "Digital product design",
        "Social media utilities", "Security tools", "Islamic and Quran applications"
      ],
      "sameAs": [
        "https://zxh-official-portfolio.pages.dev/",
        "https://mr-zxh-official.pages.dev/",
        "https://whatsapp.com/channel/0029Vb8XF2y1NCrQDWetrk1r"
      ]
    },
    {
      "@type": "WebPage",
      "@id": siteUrl + "/#webpage",
      "url": siteUrl + "/",
      "name": "ZXH OFFICIAL TOOLKIT — 100+ Free Online Tools",
      "description": description,
      "isPartOf": { "@id": siteUrl + "/#website" },
      "about": { "@id": siteUrl + "/#person" },
      "inLanguage": "en-PK",
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": siteUrl + "/assets/icon-512.png"
      }
    },
    {
      "@type": "ItemList",
      "@id": siteUrl + "/#projects",
      "name": "ZXH OFFICIAL Projects and Digital Work",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "ZXH OFFICIAL TOOLKIT",
          "url": siteUrl + "/",
          "description": "An all-in-one collection of free online tools and utilities."
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "ZXH OFFICIAL Portfolio",
          "url": "https://zxh-official-portfolio.pages.dev/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "ZXH OFFICIAL Web Portfolio",
          "url": "https://mr-zxh-official.pages.dev/"
        }
      ]
    }
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ZXH OFFICIAL TOOLKIT 🛠️ | 100+ Free Online Tools by Zulqarnain X Haider",
    template: "%s | ZXH OFFICIAL"
  },
  description,
  applicationName: siteName,
  authors: [{ name: ownerName, url: "https://zxh-official-portfolio.pages.dev/" }],
  creator: ownerName,
  publisher: "ZXH OFFICIAL",
  category: "technology",
  classification: "Free online tools, developer utilities, AI tools and digital productivity",
  keywords,
  referrer: "strict-origin-when-cross-origin",
  alternates: {
    canonical: "/",
    languages: { "en-PK": "/", "ur-PK": "/" }
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    alternateLocale: ["ur_PK"],
    siteName,
    title: "ZXH OFFICIAL TOOLKIT — 100+ Free Online Tools",
    description,
    url: "/",
    images: [{
      url: "/assets/icon-512.png",
      width: 512,
      height: 512,
      alt: "ZXH OFFICIAL TOOLKIT — Free Online Tools by Zulqarnain X Haider"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "ZXH OFFICIAL TOOLKIT — 100+ Free Online Tools",
    description,
    images: [{ url: "/assets/icon-512.png", alt: "ZXH OFFICIAL TOOLKIT" }]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  icons: {
    icon: [{ url: "/assets/icon-512.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/assets/icon-512.png", sizes: "512x512" }]
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "ZXH Tools",
    statusBarStyle: "default"
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff2d8d",
  colorScheme: "light"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&family=Plus+Jakarta+Sans:wght@400;600;800&family=Space+Grotesk:wght@400;600;700&family=Syne:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c")
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
