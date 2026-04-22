"use server";

import { Geo } from "@vercel/functions";
import ky from "ky";
import { headers } from "next/headers";
import { userAgent } from "next/server";

export async function getUserAgent() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const geo = await ky.get(`${baseUrl}/api/geo`).json<Geo>();
  const _headers = await headers();
  const _userAgent = userAgent({
    headers: _headers,
  });
  const { device } = _userAgent;
  const viewport = device.type || "desktop";
  return {
    userAgent: {
      ..._userAgent,
      device: { ..._userAgent.device, type: viewport },
    },
    geo,
  };
}
