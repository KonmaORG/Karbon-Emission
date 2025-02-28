"use client";

import dynamic from "next/dynamic";
const Page = dynamic(() => import("./burn"), { ssr: false });

export default function BurnClient() {
  return <Page />;
}
