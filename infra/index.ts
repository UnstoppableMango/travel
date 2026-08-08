import * as pulumi from "@pulumi/pulumi";
import * as cloudflare from "@pulumi/cloudflare";
import * as path from "node:path";
import { z } from "zod";

const config = new pulumi.Config();

const configSchema = z.object({
  cloudflareAccountId: z.string().trim().min(1),
  cloudflareZoneId: z.string().trim().min(1),
  webHostname: z.string().trim().min(1),
  workerScriptName: z.string().trim().min(1).default("travel-web"),
  routePattern: z.string().trim().min(1).optional(),
});

const infraConfig = configSchema.parse({
  cloudflareAccountId: config.get("cloudflareAccountId"),
  cloudflareZoneId: config.get("cloudflareZoneId"),
  webHostname: config.get("webHostname"),
  workerScriptName: config.get("workerScriptName"),
  routePattern: config.get("routePattern"),
});

const routePattern = infraConfig.routePattern ?? `${infraConfig.webHostname}/*`;

const workerContent = `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};`;

const worker = new cloudflare.WorkersScript("web-worker", {
  accountId: infraConfig.cloudflareAccountId,
  scriptName: infraConfig.workerScriptName,
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

const route = new cloudflare.WorkersRoute("web-worker-route", {
  zoneId: infraConfig.cloudflareZoneId,
  pattern: routePattern,
  script: worker.scriptName,
});

export const scriptName = worker.scriptName;
export const hostname = infraConfig.webHostname;
export const activeRoute = route.pattern;
