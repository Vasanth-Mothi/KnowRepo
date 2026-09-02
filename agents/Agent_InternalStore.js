const artifacts = [
  { id: "artifact-ev-playbook", title: "EV Incentive Playbook", summary: "A practical guide to incentive structures and dealer conversations.", lineItems: ["Federal and state incentive changes", "Dealer conversation prompts", "Customer eligibility checklist"], updatedAt: "2026-08-30T10:00:00.000Z", tags: ["Internal", "Regulatory updates"], kind: "Internal artifacts", engagement: { views: 42, saves: 8, shares: 2 } },
  { id: "artifact-dealer-experience", title: "Dealer Experience 2.0", summary: "Discovery workshop readout for a simpler dealer journey.", lineItems: ["Discovery friction points", "Priority experience principles", "Next research questions"], updatedAt: "2026-08-29T10:00:00.000Z", tags: ["Internal", "Customer experience"], kind: "Internal artifacts", engagement: { views: 36, saves: 5, shares: 3 } },
  { id: "artifact-market-outlook", title: "Q3 Auto Finance Market Outlook", summary: "Signals, scenarios, and strategic implications for the quarter.", lineItems: ["Portfolio performance signals", "Rate and delinquency scenarios", "Strategic implications"], updatedAt: "2026-08-28T10:00:00.000Z", tags: ["Internal", "Research"], kind: "Internal artifacts", engagement: { views: 29, saves: 11, shares: 4 } }
];

const savedIds = new Set(["artifact-market-outlook"]);

function getArtifacts() { return artifacts.map(item => ({ ...item, lineItems: [...item.lineItems], engagement: { ...item.engagement }, saved: savedIds.has(item.id) })); }
function getSaved() { return [...savedIds]; }
function setSaved(id, saved) { if (!artifacts.some(item => item.id === id)) return false; saved ? savedIds.add(id) : savedIds.delete(id); return true; }
function recordEvent(id, type) { const item = artifacts.find(candidate => candidate.id === id); if (item && item.engagement[type] !== undefined) item.engagement[type] += 1; }

module.exports = { getArtifacts, getSaved, setSaved, recordEvent };