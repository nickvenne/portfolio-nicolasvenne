import { basehub } from ".basehub";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import * as React from "react";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { MainDock } from "~/components/Dock";
import { NotFound } from "~/components/NotFound";
import CanvasCursor from "~/components/ui/canvas-cursor";
import { ShootingStars } from "~/components/ui/shooting-stars";
import { Spotlight } from "~/components/ui/spotlight";
import { StarsBackground } from "~/components/ui/stars-background";
import { PostHogScript } from "~/components/PostHogProvider";
import appCss from "~/styles/app.css?url";
import { seo } from "~/utils/seo";


const getResumeFile = createServerFn({ method: "GET" }).handler(async () => {
  const data = await basehub().query({
    index: {
      resume: {
        url: true,
      },
    },
  });
  return data;
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Nicolas Venne",
        description: `Nicolas Venne - Software Engineer`,
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "icon",
        sizes: "96x96",
        href: "/favicon-96x96.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
    ],
    // Explicitly tell TanStack Router that you don't want external scripts during SSR
    noScriptTags: true,
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
  loader: async () => getResumeFile(),
  
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const data = Route.useLoaderData();
  return (
    <html className="dark">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ 
          __html: `
            // Create a temporary placeholder for PostHog to prevent errors during hydration
            window.posthog = window.posthog || { 
              __loaded: false, 
              people: {}, 
              // Create empty functions for common methods to avoid runtime errors
              capture: function(){}, 
              identify: function(){},
              init: function(){}
            };
          `
        }} />
      </head>
        <body className="min-h-[100dvh] flex flex-col">
          <Spotlight />
          <CanvasCursor />
          <ShootingStars />
          <StarsBackground />
          {children}
          <MainDock resumeUrl={data?.index?.resume?.url} />
          <TanStackRouterDevtools position="bottom-right" />
          <Scripts />
          <div id="posthog-container">
            <PostHogScript />
          </div>
        </body>
    </html>
  );
}
