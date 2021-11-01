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

chrome.runtime.onMessage.addListener(async function (params) {
  try {
    const headers = new Headers();
    const { images } = params;

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
        body: JSON.stringify({ product: params }),
      }
    );

    const data = await response.json();
    const { product } = data;
    await createProductImages(product.id, images);

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          cmd: "createProductDone",
        },
        (res) => console.log(res)
      );
    });
  } catch (error) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          cmd: "createProductError",
        },
        (res) => console.log(res)
      );
    });
  }
});

async function createProductImages(id, imgList) {
  return await Promise.all(
    imgList.map(async (item, index) => {
      const data = {
        image: {
          src: item.replace(".webp", ".jpg"),
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

// async function convertImagesToBase64(imgList) {
//   return await Promise.all(
//     imgList.map(async (d) => await fecthImageAsBase64(d))
//   );
// }

// async function fecthImageAsBase64(imgUrl) {
//   const imgBlob = await fetch(imgUrl, { mode: "no-cors" }).then((response) =>
//     response.blob()
//   );
//   const base64 = await blobToBase64(imgBlob);
//   return base64;
// }

// function blobToBase64(blob) {
//   return new Promise((resolve, _) => {
//     const reader = new FileReader();
//     reader.onloadend = () => resolve(reader.result);
//     reader.readAsDataURL(blob);
//   });
// }
