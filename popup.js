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

// The body of this function will be executed as a content script inside the
// current page
function getPageProductInfo() {
  const productInfoWrapper = document.querySelector(".product-intro__info");
  const productInfoTitle = productInfoWrapper.querySelector(
    ".product-intro__head-name"
  ).innerText;
  const productInfoSku = productInfoWrapper.querySelector(
    ".product-intro__head-sku"
  ).innerText;
  const productInfoPrice = productInfoWrapper.querySelector(
    ".product-intro__head-price .from"
  ).innerText;

  // Get the product size list from current page
  const sizeNodeList = productInfoWrapper.querySelectorAll(
    ".product-intro__size-radio"
  );
  const productInfoSizeList = Array.prototype.slice
    .call(sizeNodeList)
    .map((item) => {
      return item.querySelector(".product-intro__size-radio-inner").innerText;
    });

  // Get the product img list from current page
  const productImgSwiperSlides = document.querySelectorAll(
    ".product-intro__main .swiper-wrapper .swiper-slide"
  );
  const productImgList = Array.prototype.slice
    .call(productImgSwiperSlides)
    .map((item) => {
      return item.firstChild.src;
    });

  const productColorNodeList = productInfoWrapper.querySelectorAll(
    ".product-intro__color-choose .product-intro__color-radio img"
  );
  const productColorList = Array.prototype.slice
    .call(productColorNodeList)
    .map((item) => {
      return item.src;
    });

  console.log(
    Array.from(new Set(productImgList)),
    productInfoTitle,
    productInfoSku,
    productInfoPrice,
    productInfoSizeList,
    productColorList
  );
}
