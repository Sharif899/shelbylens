import { useState, useEffect, useCallback } from "react";
import { ShelbyNodeClient } from "@shelby-protocol/sdk/node";
import { Account, Network } from "@aptos-labs/ts-sdk";
import type { BlobMetadata } from "@shelby-protocol/sdk";

// ─── Types ───────────────────────────────────────────────────────────────────

interface BlobDisplay extends BlobMetadata {
  expiresIn: string;
  expiryPercent: number;
  chunkHealth: ChunkHealth;
  sizeFormatted: string;
}

interface ChunkHealth {
  dataChunks: number;   // always 10 in Clay encoding
  parityChunks: number; // always 6 in Clay encoding
  total: number;
  confirmed: boolean;
}

interface DashboardConfig {
  accountAddress: string;
  network: Network;
  apiKey?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function formatExpiresIn(expirationMicros: number): {
  label: string;
  percent: number;
  urgent: boolean;
} {
  const nowMicros = Date.now() * 1000;
  const remainingMicros = expirationMicros - nowMicros;

  if (remainingMicros <= 0) {
    return { label: "Expired", percent: 0, urgent: true };
  }

  const remainingMs = remainingMicros / 1000;
  const hours = remainingMs / 3600_000;
  const days = hours / 24;

  let label: string;
  if (days >= 2) {
    label = `${Math.floor(days)}d remaining`;
  } else if (hours >= 1) {
    label = `${Math.floor(hours)}h remaining`;
  } else {
    label = `${Math.floor(remainingMs / 60_000)}m remaining`;
  }

  // Assume max blob life of 30 days for progress bar
  const maxLifeMicros = 30 * 24 * 3600 * 1_000_000;
  const percent = Math.min(100, Math.max(0, (remainingMicros / maxLifeMicros) * 100));

  return { label, percent, urgent: hours < 24 };
}

function derivedChunkHealth(meta: BlobMetadata): ChunkHealth {
  // Clay code: 10 data + 6 parity = 16 total per chunkset
  const dataChunks = meta.encoding?.erasure_k ?? 10;
  const parityChunks = (meta.encoding?.erasure_n ?? 16) - dataChunks;
  return {
    dataChunks,
    parityChunks,
    total: dataChunks + parityChunks,
    confirmed: meta.isWritten,
  };
}

function enrichBlob(meta: BlobMetadata): BlobDisplay {
  const { label, percent } = formatExpiresIn(meta.expirationMicros);
  return {
    ...meta,
    expiresIn: label,
    expiryPercent: percent,
    chunkHealth: derivedChunkHealth(meta),
    sizeFormatted: formatBytes(meta.size),
  };
}

// ─── Shelby client factory ────────────────────────────────────────────────────

function createClient(config: DashboardConfig): ShelbyNodeClient {
  return new ShelbyNodeClient({
    network: config.network,
    apiKey: config.apiKey,
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ChunkBar({ health }: { health: ChunkHealth }) {
  const chunks = Array.from({ length: health.total }, (_, i) => ({
    index: i,
    isParity: i >= health.dataChunks,
    isActive: health.confirmed,
  }));

  return (
    <div className="chunk-bar" title={`${health.dataChunks} data + ${health.parityChunks} parity chunks`}>
      {chunks.map((chunk) => (
        <div
          key={chunk.index}
          className={`chunk ${chunk.isParity ? "parity" : "data"} ${chunk.isActive ? "active" : "pending"}`}
        />
      ))}
    </div>
  );
}

function ExpiryBar({ percent, label, urgent }: { percent: number; label: string; urgent: boolean }) {
  return (
    <div className="expiry-bar-wrap">
      <div className="expiry-track">
        <div
          className={`expiry-fill ${urgent ? "urgent" : ""}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className={`expiry-label ${urgent ? "urgent" : ""}`}>{label}</span>
    </div>
  );
}

function BlobCard({ blob, onRefresh }: { blob: BlobDisplay; onRefresh: () => void }) {
  const shortName = blob.blobNameSuffix || blob.name;
  const shortMerkle = blob.blobMerkleRoot
    ? `${String(blob.blobMerkleRoot).slice(0, 6)}…${String(blob.blobMerkleRoot).slice(-4)}`
    : "—";

  return (
    <div className={`blob-card ${blob.isDeleted ? "deleted" : ""}`}>
      <div className="blob-card-header">
        <div className="blob-name-wrap">
          <span className="blob-icon">◈</span>
          <span className="blob-name" title={blob.name}>{shortName}</span>
        </div>
        <span className={`blob-status ${blob.isWritten ? "written" : "pending"}`}>
          {blob.isWritten ? "confirmed" : "pending"}
        </span>
      </div>

      <div className="blob-meta">
        <div className="meta-row">
          <span className="meta-label">Size</span>
          <span className="meta-value">{blob.sizeFormatted}</span>
        </div>
        <div className="meta-row">
          <span className="meta-label">Merkle root</span>
          <span className="meta-value mono">{shortMerkle}</span>
        </div>
        <div className="meta-row">
          <span className="meta-label">Encoding</span>
          <span className="meta-value">Clay {blob.chunkHealth.dataChunks}+{blob.chunkHealth.parityChunks}</span>
        </div>
      </div>

      <div className="blob-chunks-section">
        <span className="section-label">Chunk distribution</span>
        <ChunkBar health={blob.chunkHealth} />
        <div className="chunk-legend">
          <span className="legend-item data">data ({blob.chunkHealth.dataChunks})</span>
          <span className="legend-item parity">parity ({blob.chunkHealth.parityChunks})</span>
        </div>
      </div>

      <ExpiryBar
        percent={blob.expiryPercent}
        label={blob.expiresIn}
        urgent={blob.expiryPercent < 10}
      />
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function StorageDashboard({ config }: { config: DashboardConfig }) {
  const [blobs, setBlobs] = useState<BlobDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [polling, setPolling] = useState(true);

  const fetchBlobs = useCallback(async () => {
    try {
      const client = createClient(config);
      const raw = await client.coordination.getAccountBlobs({
        account: config.accountAddress,
      });
      const enriched = raw
        .filter((b) => !b.isDeleted)
        .map(enrichBlob)
        .sort((a, b) => b.expiryPercent - a.expiryPercent);

      setBlobs(enriched);
      setLastRefreshed(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch blobs");
    } finally {
      setLoading(false);
    }
  }, [config]);

  // Initial load
  useEffect(() => {
    fetchBlobs();
  }, [fetchBlobs]);

  // Poll every 30s
  useEffect(() => {
    if (!polling) return;
    const interval = setInterval(fetchBlobs, 30_000);
    return () => clearInterval(interval);
  }, [polling, fetchBlobs]);

  const totalSize = blobs.reduce((sum, b) => sum + b.size, 0);
  const confirmedCount = blobs.filter((b) => b.isWritten).length;
  const urgentCount = blobs.filter((b) => b.expiryPercent < 10 && b.expiryPercent > 0).length;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">Storage dashboard</h1>
          <span className="account-badge" title={config.accountAddress}>
            {config.accountAddress.slice(0, 6)}…{config.accountAddress.slice(-4)}
          </span>
        </div>
        <div className="header-right">
          <label className="poll-toggle">
            <input
              type="checkbox"
              checked={polling}
              onChange={(e) => setPolling(e.target.checked)}
            />
            <span>auto-refresh</span>
          </label>
          <button className="refresh-btn" onClick={fetchBlobs} disabled={loading}>
            {loading ? "refreshing…" : "↻ refresh"}
          </button>
        </div>
      </header>

      {lastRefreshed && (
        <p className="last-refreshed">
          Last updated {lastRefreshed.toLocaleTimeString()}
          {polling && " · polling every 30s"}
        </p>
      )}

      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="stats-grid">
        <StatCard label="Total blobs" value={blobs.length} />
        <StatCard label="Confirmed" value={confirmedCount} sub={`${blobs.length - confirmedCount} pending`} />
        <StatCard label="Total stored" value={formatBytes(totalSize)} />
        <StatCard label="Expiring soon" value={urgentCount} sub="< 10% lifetime left" />
      </div>

      {loading && blobs.length === 0 ? (
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Fetching blobs from Shelby network…</p>
        </div>
      ) : blobs.length === 0 ? (
        <div className="empty-state">
          <p>No blobs found for this account.</p>
          <p className="empty-sub">Upload something with <code>shelby upload</code> or the SDK to see it here.</p>
        </div>
      ) : (
        <div className="blobs-grid">
          {blobs.map((blob) => (
            <BlobCard key={blob.name} blob={blob} onRefresh={fetchBlobs} />
          ))}
        </div>
      )}

      <footer className="dashboard-footer">
        <a
          href={`https://explorer.shelby.xyz/testnet/account/${config.accountAddress}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Shelby Explorer ↗
        </a>
      </footer>
    </div>
  );
}
