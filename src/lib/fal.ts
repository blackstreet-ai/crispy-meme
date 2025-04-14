import { fal } from "@fal-ai/client";

// Configure the fal client to use the proxy
fal.config({
  proxyUrl: "/api/fal/proxy",
});

export { fal };
