const sources = [
  { id: "afn", name: "Auto Finance News", url: "https://www.autofinancenews.net/feed/", tags: ["Auto finance", "Market trends"], kind: "News" },
  { id: "toyota", name: "Toyota Newsroom", url: "https://pressroom.toyota.com/feed/", tags: ["Toyota offerings"], kind: "News" },
  { id: "tfs", name: "TFS & subsidiaries", url: "https://news.google.com/rss/search?q=%22Toyota+Financial+Services%22", tags: ["TFS & subsidiaries", "Competitors"], kind: "Competitors" },
  { id: "competitors", name: "U.S. competitors", url: "https://news.google.com/rss/search?q=auto+finance+competitors", tags: ["US competitors", "Market trends"], kind: "Competitors" }
];

const cachedItems = [
  { id: "news-auto-lending", source: "Auto Finance News", title: "Auto lending enters a new era of intelligent risk and personalized experiences", url: "https://www.autofinancenews.net/", publishedAt: "2026-09-01T12:00:00.000Z", tags: ["Auto finance", "Market trends"], kind: "News", engagement: { views: 184, saves: 32, shares: 18 } },
  { id: "news-tfs-digital", source: "Toyota Financial Services", title: "Toyota Financial Services expands digital retailing tools for dealer partners", url: "https://www.toyotafinancial.com/", publishedAt: "2026-08-31T14:00:00.000Z", tags: ["Toyota Financial Services", "Digital"], kind: "News", engagement: { views: 161, saves: 27, shares: 14 } },
  { id: "news-ev-offerings", source: "Toyota Newsroom", title: "Toyota introduces the next generation of choice with new electrified offerings", url: "https://pressroom.toyota.com/", publishedAt: "2026-08-31T12:00:00.000Z", tags: ["Toyota offerings", "Product"], kind: "News", engagement: { views: 143, saves: 21, shares: 11 } },
  { id: "news-rate-impact", source: "Auto Finance News", title: "What falling rates could mean for auto finance portfolios", url: "https://www.autofinancenews.net/", publishedAt: "2026-08-29T12:00:00.000Z", tags: ["Auto finance", "Economy"], kind: "News", engagement: { views: 96, saves: 12, shares: 6 } },
  { id: "competitor-update", source: "U.S. competitors", title: "GM Financial, Ford Credit and Ally: U.S. auto lender market update", url: "https://news.google.com/", publishedAt: "2026-09-01T09:00:00.000Z", tags: ["US competitors", "Market trends"], kind: "Competitors", engagement: { views: 151, saves: 22, shares: 10 } },
  { id: "regulatory-watch", source: "Regulatory Monitor", title: "Consumer finance regulatory updates to watch this week", url: "https://www.consumerfinance.gov/newsroom/", publishedAt: "2026-09-01T08:00:00.000Z", tags: ["Regulatory updates"], kind: "Regulatory updates", engagement: { views: 88, saves: 14, shares: 7 } }
];

function getItems() {
  return cachedItems.map(item => ({ ...item, tags: [...item.tags], engagement: { ...item.engagement }, stale: true }));
}

function getStatus() {
  return { agent: "Agent_RSSNews", state: "cached", sources: sources.map(source => ({ ...source, state: "ready" })), updatedAt: new Date().toISOString() };
}

async function refresh() {
  return { items: getItems(), status: getStatus() };
}

module.exports = { getItems, getStatus, refresh, sources };