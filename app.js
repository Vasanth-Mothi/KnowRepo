const fallbackFeeds = [
  {source:"Auto Finance News",logo:"AF",logoClass:"logo-blue",time:"24 min ago",title:"Auto lending enters a new era of intelligent risk and personalized experiences",tags:["Auto finance","Market trends"],url:"https://www.autofinancenews.net/",engagement:92,interest:88,views:184,saves:32,shares:18},
  {source:"Toyota Financial Services",logo:"TFS",logoClass:"logo-red",time:"2 hours ago",title:"Toyota Financial Services expands digital retailing tools for dealer partners",tags:["Toyota Financial Services","Digital"],url:"https://www.toyotafinancial.com/",engagement:84,interest:81,views:161,saves:27,shares:14},
  {source:"Toyota Newsroom",logo:"T",logoClass:"logo-gold",time:"4 hours ago",title:"Toyota introduces the next generation of choice with new electrified offerings",tags:["Toyota offerings","Product"],url:"https://pressroom.toyota.com/",engagement:78,interest:76,views:143,saves:21,shares:11},
  {source:"Internal • Strategy",logo:"K",logoClass:"logo-purple",time:"Yesterday",title:"Q3 Auto Finance Market Outlook: Signals, scenarios and strategic implications",tags:["Internal","Research"],url:"#artifacts",engagement:96,interest:94,views:212,saves:46,shares:25},
  {source:"Internal • Experience",logo:"K",logoClass:"logo-purple",time:"Yesterday",title:"Dealer Experience 2.0 — discovery workshop readout",tags:["Internal","Customer experience"],url:"#artifacts",engagement:71,interest:68,views:119,saves:18,shares:9},
  {source:"Auto Finance News",logo:"AF",logoClass:"logo-blue",time:"Aug 29",title:"What falling rates could mean for auto finance portfolios",tags:["Auto finance","Economy"],url:"https://www.autofinancenews.net/",engagement:65,interest:62,views:96,saves:12,shares:6}
];

const feedList = document.querySelector("#feed-list");
const searchInput = document.querySelector("#search-input");
const sourceTabs = document.querySelectorAll(".source-tab");
const sortSelect = document.querySelector("#sort-select");
const interestList = document.querySelector("#interest-list");
const feedStatus = document.querySelector("#feed-status");
const coverageTabs = document.querySelectorAll(".coverage-tab");
let activeSource = "All";
let activeCoverage = "All";
let visibleCount = 4;
let feeds = [...fallbackFeeds];

const financeFallbacks = [
  {source:"Toyota Financial Services",logo:"TFS",logoClass:"logo-red",time:"Today",title:"Toyota Financial Services and Toyota Motor Credit: earnings and portfolio watch",tags:["TFS & subsidiaries","Financial reports"],url:"https://www.toyotafinancial.com/us/en/planning_tools/financial_information.html",engagement:86,interest:86,views:174,saves:31,shares:12},
  {source:"U.S. competitors",logo:"US",logoClass:"logo-purple",time:"Today",title:"GM Financial, Ford Credit and Ally: U.S. auto lender market update",tags:["US competitors","Market trends"],url:"https://news.google.com/search?q=US%20auto%20finance%20competitors",engagement:79,interest:79,views:151,saves:22,shares:10},
  {source:"TFS & subsidiaries",logo:"TFS",logoClass:"logo-red",time:"Yesterday",title:"Lexus Financial Services performance and captive lending signals",tags:["TFS & subsidiaries","Market trends"],url:"https://news.google.com/search?q=Lexus%20Financial%20Services",engagement:74,interest:74,views:126,saves:18,shares:8},
  {source:"Auto Finance News",logo:"AF",logoClass:"logo-blue",time:"Yesterday",title:"Auto finance quarterly report: delinquencies, rates and origination volume",tags:["Auto finance","Financial reports"],url:"https://www.autofinancenews.net/",engagement:83,interest:83,views:188,saves:29,shares:15}
];
feeds = [...financeFallbacks, ...feeds];

const rssSources = [
  {source:"Auto Finance News", url:"https://www.autofinancenews.net/feed/", tags:["Auto finance","Market trends"]},
  {source:"Toyota Newsroom", url:"https://pressroom.toyota.com/feed/", tags:["Toyota offerings"]},
  {source:"TFS & subsidiaries", url:"https://news.google.com/rss/search?q=%22Toyota+Financial+Services%22+OR+%22Lexus+Financial+Services%22+OR+%22Toyota+Motor+Credit%22&hl=en-US&gl=US&ceid=US:en", tags:["TFS & subsidiaries"]},
  {source:"U.S. competitors", url:"https://news.google.com/rss/search?q=%22GM+Financial%22+OR+%22Ford+Credit%22+OR+%22Honda+Financial+Services%22+OR+%22Ally+Financial%22+auto+finance&hl=en-US&gl=US&ceid=US:en", tags:["US competitors","Market trends"]}
];

function estimateInterest(item, index) {
  return Math.max(58, 88 - index * 7);
}

async function fetchRssSource(source) {
  const endpoint = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`;
  let items;
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`RSS JSON proxy returned ${response.status}`);
    const payload = await response.json();
    if (payload.status !== "ok" || !Array.isArray(payload.items)) throw new Error("RSS JSON proxy returned an invalid response");
    items = payload.items;
  } catch (jsonError) {
    const proxyEndpoint = `https://api.allorigins.win/raw?url=${encodeURIComponent(source.url)}`;
    const response = await fetch(proxyEndpoint);
    if (!response.ok) throw new Error(`${source.source} could not be loaded: ${jsonError.message}`);
    const xml = new DOMParser().parseFromString(await response.text(), "application/xml");
    if (xml.querySelector("parsererror")) throw new Error(`${source.source} returned invalid XML`);
    items = [...xml.querySelectorAll("item")].map(item => ({
      title: item.querySelector("title")?.textContent,
      link: item.querySelector("link")?.textContent,
      pubDate: item.querySelector("pubDate")?.textContent
    }));
    coverageTabs.forEach(tab => tab.addEventListener("click", () => {
      coverageTabs.forEach(item => item.classList.remove("active"));
      tab.classList.add("active");
      activeCoverage = tab.dataset.coverage;
      visibleCount = 4;
      renderFeeds();
    }));
  }
  return items.slice(0, 4).map((item, index) => ({
    source: source.source,
    logo: source.source === "Toyota Newsroom" ? "T" : source.source === "TFS & subsidiaries" ? "TFS" : source.source === "U.S. competitors" ? "US" : "AF",
    logoClass: source.source === "Toyota Newsroom" ? "logo-gold" : source.source === "TFS & subsidiaries" ? "logo-red" : source.source === "U.S. competitors" ? "logo-purple" : "logo-blue",
    time: item.pubDate ? new Date(item.pubDate).toLocaleDateString(undefined, {month:"short", day:"numeric"}) : "Recently",
    title: item.title || "Untitled feed item",
    tags: [...source.tags, "Live RSS"],
    url: item.link || source.url,
    engagement: estimateInterest(item, index),
    interest: estimateInterest(item, index),
    views: 0,
    saves: 0,
    shares: 0
  }));
}

async function loadLiveFeeds() {
  feedStatus.textContent = "Updating live feeds...";
  feedStatus.classList.remove("error");
  const results = await Promise.allSettled(rssSources.map(fetchRssSource));
  const liveFeeds = results.filter(result => result.status === "fulfilled").flatMap(result => result.value);
  if (liveFeeds.length) {
    feeds = [...liveFeeds, ...fallbackFeeds.filter(feed => feed.source.startsWith("Toyota Financial") || feed.source.startsWith("Internal"))];
    feedStatus.textContent = `Live RSS · updated ${new Date().toLocaleTimeString([], {hour:"numeric", minute:"2-digit"})}`;
    renderInterest();
    renderFeeds();
    return;
  }
  feedStatus.textContent = "Live feeds unavailable · showing cached items";
  feedStatus.classList.add("error");
  renderFeeds();
}

function renderInterest() {
  interestList.innerHTML = [...feeds].sort((a, b) => b.interest - a.interest).slice(0, 4).map((feed, index) => `
    <article class="interest-item">
      <span class="interest-rank">${String(index + 1).padStart(2, "0")}</span>
      <div class="interest-copy"><div class="feed-meta"><b>${feed.source}</b></div><h3><a href="${feed.url}" target="_blank" rel="noreferrer">${feed.title}</a></h3><div class="interest-metrics"><span>${feed.views} views</span><span>${feed.saves} saves</span><span>${feed.shares} shares</span></div></div>
      <div class="interest-score"><strong>${feed.interest}</strong><span>interest</span><div class="interest-bar"><i style="width:${feed.interest}%"></i></div></div>
    </article>`).join("");
}

function renderFeeds() {
  const query = searchInput.value.trim().toLowerCase();
  let results = feeds.filter(feed => {
    const matchesSource = activeSource === "All" || feed.source.includes(activeSource);
    const matchesCoverage = activeCoverage === "All" || feed.tags.includes(activeCoverage);
    const searchable = `${feed.title} ${feed.source} ${feed.tags.join(" ")}`.toLowerCase();
    return matchesSource && matchesCoverage && searchable.includes(query);
  });
  if (sortSelect.value === "popular") results = results.sort((a, b) => b.engagement - a.engagement);
  feedList.innerHTML = results.slice(0, visibleCount).map(feed => `
    <article class="feed-item">
      <div class="feed-logo ${feed.logoClass}">${feed.logo}</div>
      <div>
        <div class="feed-meta"><b>${feed.source}</b> · ${feed.time}</div>
        <h3><a href="${feed.url}" target="_blank" rel="noreferrer">${feed.title}</a></h3>
        <div class="feed-tags">${feed.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}</div>
      </div>
      <button class="feed-action" aria-label="Save ${feed.title}" data-title="${feed.title}">☆</button>
    </article>`).join("") || `<div class="empty-state">No intelligence matches “${searchInput.value}”. Try a different keyword.</div>`;
  document.querySelector("#load-more").style.display = visibleCount < results.length ? "block" : "none";
  document.querySelectorAll(".feed-action").forEach(button => button.addEventListener("click", () => {
    button.classList.toggle("saved");
    button.textContent = button.classList.contains("saved") ? "★" : "☆";
    showToast(button.classList.contains("saved") ? "Saved to your knowledge shelf" : "Removed from saved items");
  }));
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

searchInput.addEventListener("input", () => { visibleCount = 4; renderFeeds(); });
sortSelect.addEventListener("change", renderFeeds);
sourceTabs.forEach(tab => tab.addEventListener("click", () => {
  sourceTabs.forEach(item => item.classList.remove("active"));
  tab.classList.add("active");
  activeSource = tab.dataset.source;
  visibleCount = 4;
  renderFeeds();
}));
document.querySelectorAll(".topic-chip").forEach(chip => chip.addEventListener("click", () => {
  searchInput.value = chip.dataset.filter;
  activeSource = "All";
  activeCoverage = "All";
  sourceTabs.forEach(item => item.classList.toggle("active", item.dataset.source === "All"));
  coverageTabs.forEach(item => item.classList.toggle("active", item.dataset.coverage === "All"));
  renderFeeds();
  document.querySelector("#feeds").scrollIntoView({behavior:"smooth", block:"start"});
}));
document.querySelector("#load-more").addEventListener("click", () => { visibleCount += 4; renderFeeds(); });
document.querySelector("#refresh-btn").addEventListener("click", event => {
  event.currentTarget.querySelector("span").style.display = "inline-block";
  showToast("Refreshing live RSS feeds...");
  loadLiveFeeds().then(() => showToast(feedStatus.classList.contains("error") ? "Could not reach live feeds" : "Live feeds are up to date"));
});
document.querySelector("#digest-btn").addEventListener("click", () => showToast("Your personalized digest is being prepared"));
renderInterest();
renderFeeds();
loadLiveFeeds();
