import { asset, Head } from "$fresh/runtime.ts";
import { defineApp } from "$fresh/server.ts";
import Theme from "../sections/Theme/Theme.tsx";
import { Context } from "@deco/deco";

export default defineApp(async (_req, ctx) => {
  const revision = await Context.active().release?.revision();
  return (
    <>
      {/* Include default fonts and css vars */}
      <Theme colorScheme="any" />

      {/* Include Icons and manifest */}
      <Head>
        {/* Enable View Transitions API */}
        <meta name="view-transition" content="same-origin" />

        {/* Tailwind v3 CSS file */}
        <link
          href={asset(`/styles.css?revision=${revision}`)}
          rel="stylesheet"
        />

        <style
          dangerouslySetInnerHTML={{
            __html: `
    /* SuisseBP */
    
    @font-face {
      font-family: "VTEX Trust";
      src: url(${asset("/VTEXTrust-Black.woff2")}) format('woff2');
      font-weight: 900;
      font-style: normal;
      font-display: swap;
    }
    
    @font-face {
      font-family: "VTEX Trust";
      src: url(${asset("/VTEXTrust-BlackItalic.woff2")}) format('woff2');
      font-weight: 900;
      font-style: italic;
      font-display: swap;
    }
    
    @font-face {
      font-family: "VTEX Trust";
      src: url(${asset("/VTEXTrust-Bold.woff2")}) format('woff2');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }
    
    @font-face {
      font-family: "VTEX Trust";
      src: url(${asset("/VTEXTrust-BoldItalic.woff2")}) format('woff2');
      font-weight: 700;
      font-style: italic;
      font-display: swap;
    }
    
    @font-face {
      font-family: "VTEX Trust";
      src: url(${asset("/VTEXTrust-Italic.woff2")}) format('woff2');
      font-weight: 400;
      font-style: italic;
      font-display: swap;
    }
      
    /* SuisseIntl */
    @font-face {
      font-family: "VTEX Trust";
      src: url(${asset("/VTEXTrust-Light.woff2")}) format('woff2');
      font-weight: 300;
      font-style: normal;
      font-display: swap;
    }
    
    
    @font-face {
      font-family: "VTEX Trust";
      src: url(${asset("/VTEXTrust-LightItalic.woff2")}) format('woff2');
      font-weight: 300;
      font-style: italic;
      font-display: swap;
    }
    
    @font-face {
      font-family: "VTEX Trust";
      src: url(${asset("/VTEXTrust-Medium.woff2")}) format('woff2');
      font-weight: 500;
      font-style: normal;
      font-display: swap;
    }
    
    @font-face {
      font-family: "VTEX Trust";
      src: url(${asset("/VTEXTrust-MediumItalic.woff2")}) format('woff2');
      font-weight: 500;
      font-style: italic;
      font-display: swap;
    }
    
    @font-face {
      font-family: "VTEX Trust";
      src: url(${asset("/VTEXTrust-Regular.woff2")}) format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    
    @font-face {
      font-family: "VTEX Trust";
      src: url(${asset("/VTEXTrust-Thin.woff2")}) format('woff2');
      font-weight: 100;
      font-style: normal;
      font-display: swap;
    }
    
    @font-face {
      font-family: "VTEX Trust";
      src: url(${asset("/VTEXTrust-ThinItalic.woff2")}) format('woff2');
      font-weight: 100;
      font-style: italic;
      font-display: swap;
    }
    `,
          }}
        >
        </style>

        {/* Web Manifest */}
        <link rel="manifest" href={asset("/site.webmanifest")} />
      </Head>

      {/* Rest of Preact tree */}
      <ctx.Component />
    </>
  );
});
