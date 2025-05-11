// background.js
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({
      url: chrome.runtime.getURL("welcome.html"),
    });
  }
});
chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [],
    addRules: [],
  });
});

// Listen for changes in storage and update blocking rules
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.blockedSites) {
    updateBlockRules(changes.blockedSites.newValue || []);
  }
});

function updateBlockRules(sites) {
  const rules = sites.map((site, index) => ({
    id: index + 1,
    priority: 1,
    action: {
      type: "redirect",
      redirect: {
        extensionPath: "/blocked.html",
      },
    },
    condition: {
      urlFilter: `||${site}`,
      resourceTypes: ["main_frame"],
    },
  }));

  // Remove all existing rules and add the updated ones
  chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
    const removeIds = existingRules.map((rule) => rule.id);
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: removeIds,
      addRules: rules,
    });
  });
}
