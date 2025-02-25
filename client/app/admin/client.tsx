"use client";

import dynamic from "next/dynamic";
const Page = dynamic(() => import("./admin"), { ssr: false });

export default function AdminClient() {
  return <Page />;
}
