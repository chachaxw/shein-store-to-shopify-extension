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
    const headers = new Headers();
    const { images, title } = request;

    headers.append(
      "X-Shopify-Access-Token",
      "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"
    );
    headers.append("Content-Type", "application/json");

    const response = await fetch(
      `https://chachaxw.myshopify.com/admin/api/2021-10/products.json`,
      {
        headers,
        method: "POST",
        body: JSON.stringify({ product: request }),
      }
    );

    const data = await response.json();
    const { product } = data;
    await createProductImages(product.id, title, images);

    sendResponse(response);
  } catch (error) {
    sendResponse(error);
  }

  return true;
});

async function createProductImages(id, title, imgList) {
  const base64Images = await convertImagesToBase64(imgList);

  return await Promise.all(
    base64Images.map(async (item, index) => {
      const data = {
        image: {
          position: index,
          attachment: item,
          filename: `${title}-${index}`,
        },
      };

      return await fetch(
        `https://chachaxw.myshopify.com/admin/api/2021-10/products/${id}/images.json`,
        {
          headers: {
            "X-Shopify-Access-Token": "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",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
    })
  );
}

async function convertImagesToBase64(imgList) {
  return await Promise.all(
    imgList.map(async (d) => await fecthImageAsBase64(d))
  );
}

async function fecthImageAsBase64(imgUrl) {
  const imgBlob = await fetch(imgUrl, { mode: "no-cors" }).then((response) =>
    response.blob()
  );
  const base64 = await blobToBase64(imgBlob);
  return base64.substring(base64.indexOf(",") + 1);
}

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}
