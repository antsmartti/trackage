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
      { id: "itella", title: "Itella", url: "https://itella.ee/eraklient/saadetise-jalgimine/?trackingCode=" },
      { id: "dpd", title: "DPD", url: "https://www.dpdgroup.com/ee/mydpd/my-parcels/track?lang=ee_ee&parcelNumber=" },
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
      itella: `https://itella.ee/eraklient/saadetise-jalgimine/?trackingCode=${selectedText}`,
      dpd: `https://www.dpdgroup.com/ee/mydpd/my-parcels/track?lang=ee_ee&parcelNumber=${selectedText}`,
      venipak: `https://www.venipak.com/tracking/?id=${selectedText}`
    };
  
    if (couriers[info.menuItemId]) {
      chrome.tabs.create({ url: couriers[info.menuItemId] });
    }
  });

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "trackPackageAuto",
    title: "Automatically identify courier",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "trackPackageAuto") {
    const trackingNumber = info.selectionText.trim();
    const courier = identifyCourier(trackingNumber);

    if (courier) {
      const trackingUrl = `${courier.url}${trackingNumber}`;
      chrome.tabs.create({ url: trackingUrl });
    } else {
      alert("Could not identify the courier service. Please select the correct service manually.");
    }
  }
});

function identifyCourier(trackingNumber) {
  // Define regex patterns for different couriers
  const couriers = [
    { id: "omniva", name: "Omniva", url: "https://minuold.omniva.ee/track/", pattern: /^[A-Z]{2}[0-9]{9}[A-Z]{2}$/i }, // Example: EE123456789EE
    { id: "itella", name: "Itella", url: "https://itella.ee/eraklient/saadetise-jalgimine/?trackingCode=", pattern: /^[A-Z]{2}[A-Z]{2}[0-9]{17}$/ }, // Example: JJFI63864910006517620
    { id: "dpd", name: "DPD", url: "https://www.dpdgroup.com/ee/mydpd/my-parcels/track?lang=ee_ee&parcelNumber=", pattern: /^[0-9]{14}$/ }, // Example: 01234567890123
    { id: "venipak", name: "Venipak", url: "https://www.venipak.com/tracking/?id=", pattern: /^[A-Z0-9]{8,12}$/i } // Example: ABCD123456
  ];

  // Try to match the tracking number against each courier's pattern
  for (const courier of couriers) {
    if (courier.pattern.test(trackingNumber)) {
      return courier;
    }
  }

  // If no match is found, return null
  return null;
}
