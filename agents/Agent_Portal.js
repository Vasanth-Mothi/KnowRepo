const Login = require("./Agent_Login");
const RSSNews = require("./Agent_RSSNews");
const InternalStore = require("./Agent_InternalStore");

function getPortal() {
  const profile = Login.getProfile();
  const items = [...RSSNews.getItems(), ...InternalStore.getArtifacts()];
  const counts = items.reduce((result, item) => { result[item.kind] = (result[item.kind] || 0) + 1; return result; }, {});
  const engagement = items.reduce((total, item) => total + item.engagement.views + item.engagement.saves + item.engagement.shares, 0);
  return {
    profile,
    items,
    trending: [...items].sort((a, b) => (b.engagement.views + b.engagement.saves * 2) - (a.engagement.views + a.engagement.saves * 2)).slice(0, 4),
    counts: { News: counts.News || 0, "Points of view": counts["Points of view"] || 0, Competitors: counts.Competitors || 0, "Regulatory updates": counts["Regulatory updates"] || 0, "Internal artifacts": counts["Internal artifacts"] || 0, "Engagement and saved items": InternalStore.getSaved().length },
    metrics: { newThisWeek: items.length, topicsActive: profile.preferences.topics.length, engagement: Math.min(100, Math.round(engagement / 10)), knowledgeBase: InternalStore.getArtifacts().length + 139 },
    saved: InternalStore.getSaved(),
    health: { login: "ready", rssNews: RSSNews.getStatus(), internalStore: "ready", portal: "ready", generatedAt: new Date().toISOString() }
  };
}

module.exports = { getPortal };