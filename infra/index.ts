import * as pulumi from "@pulumi/pulumi";
import * as cloudflare from "@pulumi/cloudflare";
import * as path from "node:path";
import { z } from "zod";

const config = new pulumi.Config();

const configSchema = z.object({
  cloudflareAccountId: z.string().trim().min(1),
  cloudflareZoneId: z.string().trim().min(1),
  webHostname: z.string().trim().min(1),
  originHostname: z.string().trim().min(1),
  routePattern: z.string().trim().min(1).optional(),
});

const infraConfig = configSchema.parse({
  cloudflareAccountId: config.get("cloudflareAccountId"),
  cloudflareZoneId: config.get("cloudflareZoneId"),
  webHostname: config.get("webHostname"),
  originHostname: config.get("originHostname"),
  routePattern: config.get("routePattern"),
});

const routePattern = infraConfig.routePattern ?? `${infraConfig.webHostname}/*`;

const workerContent = `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};`;

const worker = new cloudflare.WorkersScript("web", {
  accountId: infraConfig.cloudflareAccountId,
  scriptName: "web",
  content: workerContent,
  compatibilityDate: "2026-08-01",
  compatibilityFlags: ["nodejs_compat"],
  assets: {
    directory: path.resolve("../web/dist"),
    config: {
      notFoundHandling: "single-page-application",
    },
  },
});

const route = new cloudflare.WorkersRoute("web", {
  zoneId: infraConfig.cloudflareZoneId,
  pattern: routePattern,
  script: worker.scriptName,
});

export const scriptName = worker.scriptName;
export const hostname = infraConfig.webHostname;
export const activeRoute = route.pattern;
