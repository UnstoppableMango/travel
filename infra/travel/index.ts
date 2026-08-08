import * as pulumi from "@pulumi/pulumi";
import * as cloudflare from "@pulumi/cloudflare";

const config = new pulumi.Config();

const accountId = config.require("cloudflareAccountId");
const zoneId = config.require("cloudflareZoneId");
const webHostname = config.require("webHostname");
const originHostname = config.require("originHostname");
const workerScriptName = config.get("workerScriptName") ?? "travel-web";
const routePattern = config.get("routePattern") ?? `${webHostname}/*`;

const worker = new cloudflare.WorkersScript("web-worker", {
  accountId,
  scriptName: workerScriptName,
  content: `export default {
  async fetch(request) {
    const url = new URL(request.url);
    url.hostname = "${originHostname}";
    return fetch(new Request(url.toString(), request));
  }
};`,
  compatibilityDate: "2026-08-01",
  compatibilityFlags: ["nodejs_compat"],
});

const route = new cloudflare.WorkersRoute("web-worker-route", {
  zoneId,
  pattern: routePattern,
  script: worker.scriptName,
});

export const scriptName = worker.scriptName;
export const hostname = webHostname;
export const activeRoute = route.pattern;
