const siteInput = document.getElementById("siteInput");
const blockBtn = document.getElementById("blockBtn");
const showBtn = document.getElementById("showBtn");
const siteList = document.getElementById("siteList");
const status = document.getElementById("status");
const tempMessage = document.getElementById("tempMessage");

// Press Enter in site input triggers block
siteInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    blockBtn.click();
  }
});

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
        siteInput.value = "";
        loadSites();

        // Show temporary success message
        tempMessage.textContent = "Site blocked";
        tempMessage.style.display = "block";
        setTimeout(() => {
          tempMessage.style.display = "none";
        }, 2000);
      }
    });
  });
});

let isVisible = false;

showBtn.addEventListener("click", () => {
  isVisible = !isVisible;
  siteList.style.display = isVisible ? "block" : "none";
  showBtn.textContent = isVisible ? "Hide Sites" : "Show Sites";

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
