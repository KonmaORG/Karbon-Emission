"use client";

import dynamic from "next/dynamic";
const Page = dynamic(() => import("./minter"), { ssr: false });

export default function MinterClient() {
  return <Page />;
}
