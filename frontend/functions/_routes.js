// This file handles all routes in Cloudflare Pages
export async function onRequest(context) {
  // Get the request
  const request = context.request;
  // Get the URL from the request
  const url = new URL(request.url);

  // Check if the request is for an API route
  if (url.pathname.startsWith("/api/")) {
    // Handle API routes here or pass to other functions
    return new Response("API endpoint", { status: 404 });
  }

  // Check if the request is for a static asset
  const staticExtensions = [
    ".js",
    ".css",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".woff",
    ".woff2",
    ".ttf",
    ".eot",
  ];
  const isStaticAsset = staticExtensions.some((ext) =>
    url.pathname.endsWith(ext)
  );

  if (isStaticAsset) {
    // Let Cloudflare handle static assets
    return context.next();
  }

  // For all other routes, serve the index.html file
  // Cloudflare Pages will handle rewriting the response
  const response = await context.env.ASSETS.fetch(
    new Request(`${url.origin}/index.html`, request)
  );

  return response;
}
