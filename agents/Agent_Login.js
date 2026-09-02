const profile = {
  id: "alex-rivera",
  name: "Alex Rivera",
  initials: "AR",
  role: "Research & Strategy",
  lastLogin: "2026-09-01T16:20:00.000Z",
  visitsLast7Days: 5,
  preferences: {
    topics: ["Auto finance", "Toyota Financial Services", "Toyota offerings", "Internal"],
    newsTypes: ["News", "Competitors", "Regulatory updates"]
  }
};

function getProfile() {
  return { ...profile, preferences: { ...profile.preferences } };
}

module.exports = { getProfile };