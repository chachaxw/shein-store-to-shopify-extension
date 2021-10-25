// Shopify api url example like this:
// https://{apiKey}:{password}@chachaxw.myshopify.com/admin/api/2021-10/products.json
const shopifyConfig = {
  apiKey: "22a18f405e229470e8663e113053f40f",
  password: "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",
  sharedSecret: "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",
};

chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed");

  chrome.declarativeContent?.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: "us.shein.com", schemes: ["https"] },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content-script.js"],
  });
});

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  try {
    const { password } = shopifyConfig;
    const headers = new Headers();

    headers.append("X-Shopify-Access-Token", password);
    headers.append("Content-Type", "application/json");

    const response = await fetch(
      `https://chachaxw.myshopify.com/admin/api/2021-10/products.json`,
      {
        headers,
        method: "POST",
        mode: "no-cors",
        credentials: "same-origin",
        body: JSON.stringify(request),
      }
    );
    console.log("====================================");
    console.log(response);
    console.log("====================================");
    sendResponse(response);
  } catch (error) {
    sendResponse(error);
  }

  return true;
});
