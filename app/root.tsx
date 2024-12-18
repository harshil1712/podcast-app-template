import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/cloudflare";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        {/* <Player /> */}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {isRouteErrorResponse(error) ? (
          <>
            <h1 className="text-6xl font-bold text-gray-900 mb-4">
              {error.status}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {error.statusText || "Page not found"}
            </p>
            <p className="text-gray-500 mb-8">
              {error.data?.message ||
                "Sorry, we couldn't find the page you're looking for."}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-6xl font-bold text-gray-900 mb-4">Oops!</h1>
            <p className="text-xl text-gray-600 mb-8">Something went wrong</p>
            <p className="text-gray-500 mb-8">
              An unexpected error occurred. Please try again later.
            </p>
          </>
        )}
        <a
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Go back home
        </a>
      </div>
      <Scripts />
    </div>
  );
}

export default function App() {
  return <Outlet />;
}
