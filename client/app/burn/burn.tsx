"use client";
import { Burn, CotFromUserToScript } from "@/components/transactions/burn";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/walletContext";
import { Input } from "@heroui/input";
import React, { useState } from "react";

export default function BurnPage() {
  const [WalletConnection] = useWallet();
  const [qty, setQty] = useState("0");

  async function BurnClient() {
    const result = await Burn(WalletConnection, BigInt(parseInt(qty)));
    console.log(result);
  }

  async function transferToken() {
    const result = await CotFromUserToScript(WalletConnection);
    console.log(result);
  }
  return (
    <div className="flex gap-2">
      <Input placeholder="Mint Quantity" value={qty} onValueChange={setQty} />
      <Button onClick={BurnClient}>Burn</Button>
      <Button onClick={transferToken}>transferToken</Button>
    </div>
  );
}
