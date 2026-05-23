import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";
import sitemap from "astro-sitemap";
import compress from "astro-compress";

export default defineConfig({
  site: "https://namematransporters.co.ke",
  
  trailingSlash: "never",
  output: "static",
  
  integrations: [
    tailwind(), 
    robotsTxt(), 
    sitemap({
      filter: (page) => 
        !page.includes('/thank-you') && 
        !page.includes('/404') &&
        !page.includes('/admin'),
      changefreq: {
        '/': 'daily',
        '/services': 'weekly',
        '/about': 'monthly',
        '/contact': 'monthly',
        '/quote': 'weekly',
        '/fleet': 'monthly',
      },
      priority: {
        '/': 1.0,
        '/services': 0.9,
        '/about': 0.8,
        '/quote': 0.8,
        '/fleet': 0.7,
        '/contact': 0.7,
      },
    }), 
    compress()
  ],

  build: {
    inlineStylesheets: "auto",
    assets: "_assets",
  },

  compressHTML: true,

  server: {
    headers: {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
      "Cache-Control": "public, max-age=0, must-revalidate",

      // CSP
      "Content-Security-Policy": `
        default-src 'self';
        script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://use.fontawesome.com https://www.google.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://use.fontawesome.com;
        font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com https://use.fontawesome.com;
        img-src 'self' data: https: blob:;
        connect-src 'self';
        frame-src https://www.google.com;
        frame-ancestors 'none';
        base-uri 'self';
        form-action 'self';
      `
        .replace(/\s+/g, " ")
        .trim(),

      "X-Powered-By": "Astro",
    },
  },

  vite: {
    build: {
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["tailwindcss"],
          },
        },
      },
    },
    server: {
      headers: {
        "X-Content-Type-Options": "nosniff",
      },
    },
  },
});
