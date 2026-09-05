const BADGE_TEXT = "TAB";
const ENABLED_TITLE = "Use site zoom for this tab";
const DISABLED_TITLE = "Use separate zoom for this tab";

function storageKey(tabId) {
  return `tab-${tabId}`;
}

async function isSelected(tabId) {
  const key = storageKey(tabId);
  const result = await chrome.storage.session.get(key);
  return result[key] === true;
}

async function setActionState(tabId, selected) {
  await chrome.action.setBadgeText({
    tabId,
    text: selected ? BADGE_TEXT : ""
  });
  await chrome.action.setTitle({
    tabId,
    title: selected ? ENABLED_TITLE : DISABLED_TITLE
  });

  if (selected) {
    await chrome.action.setBadgeBackgroundColor({
      tabId,
      color: "#2563eb"
    });
  }
}

async function enablePerTabZoom(tabId) {
  await chrome.tabs.setZoomSettings(tabId, {
    mode: "automatic",
    scope: "per-tab"
  });
}

async function disablePerTabZoom(tabId) {
  await chrome.tabs.setZoomSettings(tabId, {
    mode: "automatic",
    scope: "per-origin"
  });
}

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id === undefined) {
    return;
  }

  const tabId = tab.id;
  const key = storageKey(tabId);
  const selected = await isSelected(tabId);

  if (selected) {
    await chrome.storage.session.remove(key);
    await setActionState(tabId, false);

    try {
      await disablePerTabZoom(tabId);
    } catch {
      // Chrome has already restored site zoom after a restricted-page navigation.
    }
    return;
  }

  try {
    await enablePerTabZoom(tabId);
    await chrome.storage.session.set({ [key]: true });
    await setActionState(tabId, true);
  } catch (error) {
    await chrome.action.setTitle({
      tabId,
      title: `Separate zoom is unavailable on this page: ${error.message}`
    });
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  const navigationChanged =
    changeInfo.status === "loading" || changeInfo.status === "complete";

  if (!navigationChanged || !(await isSelected(tabId))) {
    return;
  }

  try {
    await enablePerTabZoom(tabId);
    await setActionState(tabId, true);
  } catch {
    // Chrome blocks zoom controls on pages such as chrome://settings.
  }
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  await chrome.storage.session.remove(storageKey(tabId));
});
