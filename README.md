# ◈ Shelby Storage Dashboard

> **Live proof-of-storage.** See every blob your account holds on the Shelby network — chunk health, Merkle roots, expiry countdowns, and network confirmation status — updating in real time.

![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Shelby SDK](https://img.shields.io/badge/Shelby_SDK-latest-1D9E75?style=flat-square)
![Aptos](https://img.shields.io/badge/Aptos-Testnet-00B4D8?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## What this is

Decentralized storage is invisible by default. You upload a file, pay on-chain, and trust the network holds it. This dashboard makes it **visible**.

For every blob stored under your Aptos account, the dashboard shows:

- **Chunk distribution** — 10 data chunks + 6 parity chunks per chunkset (Clay erasure code), colour-coded and live
- **Confirmation status** — whether the blob has been fully acknowledged by the storage providers
- **Merkle root** — the cryptographic fingerprint that lets you verify your data hasn't changed
- **Expiry countdown** — a live progress bar showing remaining storage lifetime (paid at upload time)
- **Total stored / confirmed / urgent counts** — across all blobs at a glance

This is the *"show don't tell"* demo for Shelby. It is also a useful operational tool for any app that writes blobs and needs to monitor them.

---

## How it works

```
Your browser  ──►  ShelbyNodeClient  ──►  coordination.getAccountBlobs()
                                     ──►  Aptos L1 (blob metadata, Merkle roots, expiry)
                   Polls every 30s
```

The Shelby SDK's `ShelbyBlobClient` (accessed via `client.coordination`) queries the Aptos blockchain directly for blob metadata. No backend server is needed — the dashboard is a pure client-side React app.

Key SDK calls used:

| Call | What it returns |
|---|---|
| `client.coordination.getAccountBlobs({ account })` | All `BlobMetadata[]` for the account |
| `BlobMetadata.blobMerkleRoot` | Cryptographic integrity proof |
| `BlobMetadata.isWritten` | Whether storage providers have confirmed |
| `BlobMetadata.expirationMicros` | When the blob expires (paid at upload) |
| `BlobMetadata.encoding` | Clay code params: `erasure_n`, `erasure_k` |

---

## System requirements

- Node.js v22 or later
- npm / pnpm / yarn / bun
- A Shelby testnet account with blobs uploaded
- (Optional) An Aptos Labs API key to avoid rate limits

---

## Quickstart

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/shelby-storage-dashboard
cd shelby-storage-dashboard
npm install
```

### 2. Configure your environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
SHELBY_ACCOUNT_ADDRESS=0xYOUR_ACCOUNT_ADDRESS
SHELBY_NETWORK=TESTNET
SHELBY_API_KEY=aptoslabs_XXXX   # optional but recommended
```

Your account address is the hex Aptos address that you used to upload blobs.
You can find it with:

```bash
shelby account list
```

### 3. Upload some blobs (if you haven't already)

```bash
# Fund your account first
shelby faucet --network testnet

# Upload a file
shelby upload ./myfile.pdf docs/myfile.pdf -e "in 7 days" --assume-yes
```

### 4. Run the dashboard

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Project structure

```
shelby-storage-dashboard/
├── src/
│   ├── index.tsx        # React entry point, reads .env config
│   ├── dashboard.tsx    # Main dashboard component + all sub-components
│   └── styles.css       # Full design system (light + dark mode)
├── index.html           # HTML shell
├── vite.config.ts       # Vite config (envPrefix: "SHELBY_")
├── tsconfig.json        # Strict TypeScript
├── .env.example         # Environment variable template
└── package.json
```

### Key components

**`StorageDashboard`** — top-level component. Initialises the Shelby client, polls `getAccountBlobs`, enriches raw `BlobMetadata` with display-ready fields, renders stats + blob grid.

**`BlobCard`** — one card per blob. Shows name, confirmation status, size, Merkle root, chunk bar, and expiry bar.

**`ChunkBar`** — renders 16 coloured squares (10 blue data + 6 green parity). Filled when confirmed, outlined when pending. Hover for tooltip.

**`ExpiryBar`** — thin progress bar driven by `expirationMicros`. Turns red when < 10% lifetime remains.

**`StatCard`** — summary metric (total blobs, confirmed count, total bytes stored, expiring soon).

---

## Understanding the chunk bar

```
■ ■ ■ ■ ■ ■ ■ ■ ■ ■  □ □ □ □ □ □
└──────── data ────────┘ └─ parity ─┘
     10 chunks               6 chunks
```

Shelby uses [Clay Codes](https://www.usenix.org/system/files/conference/fast18/fast18-vajha.pdf) for erasure coding. Each chunkset (10 MB of user data) is encoded into 16 × 1 MB chunks:

- **10 data chunks** — the original data, split across 10 storage providers
- **6 parity chunks** — recovery data, enough to survive loss of any 6 of the 16 chunks

Any 10 of 16 chunks are sufficient to reconstruct the original data. The Clay repair algorithm can recover a lost chunk by reading a small portion from each of many nodes — up to 4x more bandwidth-efficient than standard Reed-Solomon.

When a blob is fully confirmed (`isWritten: true`), all 16 chunks are solid. When pending, they render as outlines.

---

## Understanding the Merkle root

Every blob has a `blobMerkleRoot` — a hash tree root computed from the commitments of all its erasure-coded chunks. This is written to the Aptos blockchain at upload time, before any data reaches storage providers.

This means:

1. **Integrity** — you can verify at any time that what the network holds matches what you uploaded
2. **Proof of origin** — the Aptos transaction that registered the blob is permanent, timestamped, and tied to your account address
3. **Tamper evidence** — any modification to any chunk would invalidate the Merkle root

The dashboard shows a shortened form of the root (first 6 + last 4 characters). The full value is on the Shelby Explorer.

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `SHELBY_ACCOUNT_ADDRESS` | Yes | Aptos account hex address (`0x...`) |
| `SHELBY_NETWORK` | Yes | `TESTNET`, `MAINNET`, or `SHELBYNET` |
| `SHELBY_API_KEY` | No | Aptos Labs API key (avoids rate limits) |

All variables must be prefixed with `SHELBY_` — Vite's `envPrefix` setting ensures no other environment variables leak into the browser bundle.

---

## Production build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the build locally
```

The build is a fully static site. Deploy to any static host: Vercel, Netlify, Cloudflare Pages, or serve from your own Shelby-stored blob (meta!).

---

## Extending this project

Some ideas for what to build next on top of this:

**One-click re-pin** — add a button to extend a blob's expiry. Call `client.upload()` with the same blob name and a new `expirationMicros`. Because blob names are idempotent within an account namespace, this extends storage without creating a duplicate.

**Download + verify** — add a download button that calls `client.download({ account, blobName })`, then verifies the response against the `blobMerkleRoot` shown in the card.

**Multi-account view** — accept a comma-separated list of account addresses in `.env` and render a tabbed dashboard per account.

**Placement group map** — the Shelby protocol assigns each blob to a placement group of 16 storage providers. A future SDK release will expose which SPs hold which chunks — visualise this as a world map.

**Alert on expiry** — poll the dashboard server-side and send a webhook/email when any blob's remaining lifetime drops below a threshold.

---

## Resources

- [Shelby Protocol docs](https://docs.shelby.xyz)
- [TypeScript SDK reference](https://docs.shelby.xyz/sdks/typescript)
- [Node.js SDK specifications](https://docs.shelby.xyz/sdks/typescript/node/specifications)
- [Architecture overview](https://docs.shelby.xyz/protocol/architecture/overview)
- [Shelby Explorer (testnet)](https://explorer.shelby.xyz/testnet)
- [Shelby Discord](https://discord.com/invite/shelbyserves)
- [Shelby quickstart repo](https://github.com/shelby/shelby-quickstart)

---

## License

MIT — see [LICENSE](./LICENSE)

---

Built on [Shelby Protocol](https://shelby.xyz) · Coordination by [Aptos](https://aptos.dev) · Storage by [Jump Trading Group](https://jumpcrypto.com)
