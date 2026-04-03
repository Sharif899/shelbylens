/* ─── Reset & Base ─────────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --color-bg: #f9f9f8;
  --color-surface: #ffffff;
  --color-border: rgba(0, 0, 0, 0.08);
  --color-border-strong: rgba(0, 0, 0, 0.14);
  --color-text-primary: #1a1a18;
  --color-text-secondary: #666660;
  --color-text-tertiary: #999993;
  --color-data: #185FA5;
  --color-data-light: #E6F1FB;
  --color-parity: #0F6E56;
  --color-parity-light: #E1F5EE;
  --color-confirmed: #3B6D11;
  --color-confirmed-light: #EAF3DE;
  --color-pending: #854F0B;
  --color-pending-light: #FAEEDA;
  --color-urgent: #A32D2D;
  --color-urgent-light: #FCEBEB;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 15px;
  color: var(--color-text-primary);
  background: var(--color-bg);
  line-height: 1.5;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #111110;
    --color-surface: #1c1c1a;
    --color-border: rgba(255, 255, 255, 0.08);
    --color-border-strong: rgba(255, 255, 255, 0.14);
    --color-text-primary: #f0efe8;
    --color-text-secondary: #999993;
    --color-text-tertiary: #66665f;
    --color-data: #85B7EB;
    --color-data-light: #0C447C;
    --color-parity: #5DCAA5;
    --color-parity-light: #085041;
    --color-confirmed: #97C459;
    --color-confirmed-light: #27500A;
    --color-pending: #EF9F27;
    --color-pending-light: #633806;
    --color-urgent: #F09595;
    --color-urgent-light: #791F1F;
  }
}

/* ─── Layout ────────────────────────────────────────────────────────────────── */
.dashboard {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

/* ─── Header ────────────────────────────────────────────────────────────────── */
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 0.4rem;
}

.header-left { display: flex; align-items: center; gap: 12px; }

.dashboard-title {
  font-size: 22px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.account-badge {
  font-size: 12px;
  font-family: monospace;
  background: var(--color-surface);
  border: 0.5px solid var(--color-border-strong);
  border-radius: 20px;
  padding: 3px 10px;
  color: var(--color-text-secondary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.poll-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-secondary);
  cursor: pointer;
  user-select: none;
}

.refresh-btn {
  font-size: 13px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: var(--radius-md);
  border: 0.5px solid var(--color-border-strong);
  background: var(--color-surface);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background 0.15s;
}
.refresh-btn:hover { background: var(--color-bg); }
.refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.last-refreshed {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-bottom: 1.5rem;
}

/* ─── Error banner ──────────────────────────────────────────────────────────── */
.error-banner {
  background: var(--color-urgent-light);
  color: var(--color-urgent);
  border: 0.5px solid var(--color-urgent);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  font-size: 13px;
  margin-bottom: 1.5rem;
}

/* ─── Stat cards ────────────────────────────────────────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--color-surface);
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.stat-value {
  font-size: 24px;
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.2;
}
.stat-sub {
  font-size: 12px;
  color: var(--color-text-secondary);
}

/* ─── Blob grid ─────────────────────────────────────────────────────────────── */
.blobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 14px;
}

/* ─── Blob card ─────────────────────────────────────────────────────────────── */
.blob-card {
  background: var(--color-surface);
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: border-color 0.15s;
}
.blob-card:hover { border-color: var(--color-border-strong); }
.blob-card.deleted { opacity: 0.5; }

.blob-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.blob-name-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.blob-icon {
  font-size: 14px;
  color: var(--color-data);
  flex-shrink: 0;
}

.blob-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.blob-status {
  font-size: 11px;
  font-weight: 500;
  padding: 3px 9px;
  border-radius: 20px;
  flex-shrink: 0;
}
.blob-status.written {
  background: var(--color-confirmed-light);
  color: var(--color-confirmed);
}
.blob-status.pending {
  background: var(--color-pending-light);
  color: var(--color-pending);
}

/* ─── Blob meta table ────────────────────────────────────────────────────────── */
.blob-meta { display: flex; flex-direction: column; gap: 6px; }

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  font-size: 13px;
}
.meta-label { color: var(--color-text-secondary); flex-shrink: 0; }
.meta-value { color: var(--color-text-primary); text-align: right; }
.meta-value.mono { font-family: monospace; font-size: 12px; }

/* ─── Chunk bar ─────────────────────────────────────────────────────────────── */
.blob-chunks-section { display: flex; flex-direction: column; gap: 6px; }

.section-label {
  font-size: 11px;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.chunk-bar {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
}

.chunk {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  transition: opacity 0.2s;
}

.chunk.data.active    { background: var(--color-data); }
.chunk.data.pending   { background: var(--color-data-light); border: 0.5px solid var(--color-data); }
.chunk.parity.active  { background: var(--color-parity); }
.chunk.parity.pending { background: var(--color-parity-light); border: 0.5px solid var(--color-parity); }

.chunk-legend {
  display: flex;
  gap: 12px;
}

.legend-item {
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.legend-item::before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 2px;
}
.legend-item.data { color: var(--color-data); }
.legend-item.data::before { background: var(--color-data); }
.legend-item.parity { color: var(--color-parity); }
.legend-item.parity::before { background: var(--color-parity); }

/* ─── Expiry bar ─────────────────────────────────────────────────────────────── */
.expiry-bar-wrap {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.expiry-track {
  height: 4px;
  background: var(--color-border);
  border-radius: 2px;
  overflow: hidden;
}

.expiry-fill {
  height: 100%;
  background: var(--color-parity);
  border-radius: 2px;
  transition: width 0.3s ease;
}
.expiry-fill.urgent { background: var(--color-urgent); }

.expiry-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}
.expiry-label.urgent { color: var(--color-urgent); }

/* ─── Loading / Empty ────────────────────────────────────────────────────────── */
.loading-state, .empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--color-text-secondary);
}

.loading-spinner {
  width: 28px;
  height: 28px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-data);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

.empty-sub {
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin-top: 6px;
}
.empty-sub code {
  font-family: monospace;
  background: var(--color-border);
  padding: 1px 5px;
  border-radius: 4px;
}

/* ─── Footer ─────────────────────────────────────────────────────────────────── */
.dashboard-footer {
  margin-top: 3rem;
  text-align: center;
}
.dashboard-footer a {
  font-size: 13px;
  color: var(--color-text-tertiary);
  text-decoration: none;
}
.dashboard-footer a:hover { color: var(--color-data); }
