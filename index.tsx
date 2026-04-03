import React from "react";
import ReactDOM from "react-dom/client";
import { Network } from "@aptos-labs/ts-sdk";
import { StorageDashboard } from "./dashboard";
import "./styles.css";

// Load config from environment (set via .env or process.env)
const config = {
  accountAddress: process.env.SHELBY_ACCOUNT_ADDRESS ?? "",
  network: (process.env.SHELBY_NETWORK as Network) ?? Network.TESTNET,
  apiKey: process.env.SHELBY_API_KEY,
};

if (!config.accountAddress) {
  console.error(
    "[shelby-dashboard] SHELBY_ACCOUNT_ADDRESS is not set.\n" +
    "Copy .env.example to .env and fill in your account address."
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("No #root element found");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <StorageDashboard config={config} />
  </React.StrictMode>
);
