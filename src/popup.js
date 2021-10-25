// Initialize button with users's prefered color
let addToShopify = document.getElementById("addToShopify");

// When the button is clicked, inject getPageProductInfo into current page
addToShopify.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  console.log("tab info", tab);

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getPageProductInfo,
  });
});

function getPageProductInfo() {
  console.log("Do something");
}
