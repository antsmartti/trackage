chrome.runtime.onInstalled.addListener(() => {
    // Create a parent context menu item
    chrome.contextMenus.create({
      id: "trackPackageParent",
      title: "Track this package with...",
      contexts: ["selection"]
    });
  
    // Create sub-menus for each courier
    const couriers = [
      { id: "omniva", title: "Omniva", url: "https://minuold.omniva.ee/track/" },
      { id: "itella", title: "Itella", url: "https://itella.ee/track?trackId=" },
      { id: "dpd", title: "DPD", url: "https://www.dpdgroup.com/ee/mydpd/my-parcels/incoming?parcelNumber=" },
      { id: "venipak", title: "Venipak", url: "https://www.venipak.com/tracking/?id=" }
    ];
  
    couriers.forEach(courier => {
      chrome.contextMenus.create({
        id: courier.id,
        parentId: "trackPackageParent",
        title: courier.title,
        contexts: ["selection"]
      });
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    const selectedText = info.selectionText.trim();
    const couriers = {
      omniva: `https://minuold.omniva.ee/track/${selectedText}`,
      itella: `https://itella.ee/track?trackId=${selectedText}`,
      dpd: `https://www.dpdgroup.com/ee/mydpd/my-parcels/incoming?parcelNumber=${selectedText}`,
      venipak: `https://www.venipak.com/tracking/?id=${selectedText}`
    };
  
    if (couriers[info.menuItemId]) {
      chrome.tabs.create({ url: couriers[info.menuItemId] });
    }
  });
  