let button = document.createElement("button");

button.innerText = "Grab";
button.style.position = "fixed";
button.style.right = "4px";
button.style.top = "4px";
button.style.zIndex = 9999;

// …and register a listener for when that button is clicked
button.addEventListener("click", getPageProductInfo);
document.querySelector("body").appendChild(button);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("request", request);
  console.log("sender", sender);
  console.log("sendResponse", sendResponse);
});

// The body of this function will be execuetd as a content script inside the current page
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

// Build product view
function initProductView() {}
