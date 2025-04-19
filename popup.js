const siteInput = document.getElementById("siteInput");

siteInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    blockBtn.click();
  }
});

const blockBtn = document.getElementById("blockBtn");
const showBtn = document.getElementById("showBtn");
const siteList = document.getElementById("siteList");
const status = document.getElementById("status");

blockBtn.addEventListener("click", () => {
  const site = siteInput.value.trim();

  if (!site) {
    status.textContent = "Enter a site.";
    return;
  }

  chrome.storage.local.get({ blockedSites: [] }, (data) => {
    if (chrome.runtime.lastError) {
      status.textContent = "Error accessing storage.";
      return;
    }

    const updatedSites = [...new Set([...data.blockedSites, site])];
    chrome.storage.local.set({ blockedSites: updatedSites }, () => {
      if (chrome.runtime.lastError) {
        status.textContent = "Failed to save site.";
      } else {
        status.textContent = "";
        siteInput.value = "";
        loadSites(); // refresh the list
      }
    });
  });
});

let isVisible = false;

showBtn.addEventListener("click", () => {
  isVisible = !isVisible;
  siteList.style.display = isVisible ? "block" : "none";
  showBtn.textContent = isVisible ? "hide sites" : "show sites";

  if (isVisible) {
    loadSites();
  }
});

function loadSites() {
  siteList.innerHTML = "";
  status.textContent = "";

  chrome.storage.local.get({ blockedSites: [] }, (data) => {
    if (chrome.runtime.lastError) {
      status.textContent = "Failed to load blocked sites.";
      return;
    }

    if (!data.blockedSites.length) {
      status.textContent = "No blocked sites.";
      return;
    }

    data.blockedSites.forEach((site) => {
      const li = document.createElement("li");
      li.textContent = site;
      siteList.appendChild(li);
    });
  });
}
