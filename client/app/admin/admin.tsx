import ConfigDatumHolder from "@/components/transactions/configDatumHolder";
import Identification from "@/components/transactions/identificationnft";
import React from "react";

export default function BurnPage() {
  return (
    <div className="flex gap-2">
      <Identification />
      <ConfigDatumHolder />
    </div>
  );
}
