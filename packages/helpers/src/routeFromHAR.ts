import type { BrowserContext, Page, Request, Route } from "playwright";
import type { Entry, HARFile, Header } from "./har";
import type { HeadersArray } from "./playwright-types";

type ContextOrPage = BrowserContext | Page;

const redirectStatus = [301, 302, 303, 307, 308];

const handle = (
  _har: HARFile,
  notFoundAction: string
): ((route: Route, request: Request) => void) => {
  return async (route) => {
    const request = route.request();

    const response = await lookup(
      _har,
      request.url(),
      request.method(),
      await request.headersArray(),
      request.postDataBuffer() || undefined,
      request.isNavigationRequest()
    );

    if (response.action === "redirect") {
      await (route as any)._redirectNavigationRequest(response.redirectURL!);
      return;
    }

    if (response.action === "fulfill") {
      await route.fulfill({
        status: response.status,
        headers: Object.fromEntries(
          response.headers!.map((h) => [h.name, h.value])
        ),
        body: response.body!,
      });
      return;
    }

    if (response.action === "error")
      console.log("api", "HAR: " + response.message!);

    if (notFoundAction === "abort") {
      await route.abort();
      return;
    }

    await route.fallback();
  };
};

const lookup = async (
  _har: HARFile,
  url: string,
  method: string,
  headers: HeadersArray,
  postData: Buffer | undefined,
  isNavigationRequest: boolean
): Promise<{
  action: "error" | "redirect" | "fulfill" | "noentry";
  message?: string;
  redirectURL?: string;
  status?: number;
  headers?: HeadersArray;
  body?: Buffer;
}> => {
  let entry;
  try {
    entry = await harFindResponse(_har, url, method, headers, postData);
  } catch (e) {
    if (!(e instanceof Error))
      return { action: "error", message: "HAR error: Unknown Error" };
    return { action: "error", message: "HAR error: " + e.message };
  }

  if (!entry) return { action: "noentry" };

  // If navigation is being redirected, restart it with the final url to ensure the document's url changes.
  if (entry.request.url !== url && isNavigationRequest)
    return { action: "redirect", redirectURL: entry.request.url };

  const response = entry.response;
  try {
    const buffer = await loadContent(response.content);
    return {
      action: "fulfill",
      status: response.status,
      headers: response.headers,
      body: buffer,
    };
  } catch (e) {
    if (!(e instanceof Error))
      return { action: "error", message: "Unknown Error" };
    return { action: "error", message: e.message };
  }
};

const routeFromHAR = async (
  target: ContextOrPage,
  _har: HARFile,
  url: string = "**/*",
  abortNotFound: boolean = false
) => {
  await target.route(url, handle(_har, abortNotFound ? "abort" : ""));
};

const harFindResponse = async (
  _har: HARFile,
  url: string,
  method: string,
  headers: HeadersArray,
  postData: Buffer | undefined
) => {
  const harLog = _har.log;
  const visited = new Set<Entry>();
  while (true) {
    const entries: Entry[] = [];
    for (const candidate of harLog.entries) {
      if (candidate.request.url !== url || candidate.request.method !== method)
        continue;
      if (method === "POST" && postData && candidate.request.postData) {
        const buffer = await loadContent(candidate.request.postData);
        if (!buffer.equals(postData)) continue;
      }
      entries.push(candidate);
    }

    if (!entries.length) return;

    let entry = entries[0];

    // Disambiguate using headers - then one with most matching headers wins.
    if (entries.length > 1) {
      const list: { candidate: Entry; matchingHeaders: number }[] = [];
      for (const candidate of entries) {
        const matchingHeaders = countMatchingHeaders(
          candidate.request.headers,
          headers
        );
        list.push({ candidate, matchingHeaders });
      }
      list.sort((a, b) => b.matchingHeaders - a.matchingHeaders);
      entry = list[0].candidate;
    }

    if (visited.has(entry)) throw new Error(`Found redirect cycle for ${url}`);

    visited.add(entry);

    // Follow redirects.
    const locationHeader = entry.response.headers.find(
      (h) => h.name.toLowerCase() === "location"
    );
    if (redirectStatus.includes(entry.response.status) && locationHeader) {
      const locationURL = new URL(locationHeader.value, url);
      url = locationURL.toString();
      if (
        ((entry.response.status === 301 || entry.response.status === 302) &&
          method === "POST") ||
        (entry.response.status === 303 && !["GET", "HEAD"].includes(method))
      ) {
        // HTTP-redirect fetch step 13 (https://fetch.spec.whatwg.org/#http-redirect-fetch)
        method = "GET";
      }
      continue;
    }

    return entry;
  }
};

const loadContent = async (content: {
  text?: string;
  encoding?: string;
  _file?: string;
}): Promise<Buffer> => {
  const file = content._file;
  let buffer: Buffer;
  if (file) {
    // TODO: check when playwright uses this
    throw new Error("Unsupported File entry");
  } else {
    buffer = Buffer.from(
      content.text || "",
      content.encoding === "base64" ? "base64" : "utf-8"
    );
  }
  return buffer;
};

function countMatchingHeaders(
  harHeaders: Header[],
  headers: HeadersArray
): number {
  const set = new Set(headers.map((h) => h.name.toLowerCase() + ":" + h.value));
  let matches = 0;
  for (const h of harHeaders) {
    if (set.has(h.name.toLowerCase() + ":" + h.value)) ++matches;
  }
  return matches;
}

export default routeFromHAR;
