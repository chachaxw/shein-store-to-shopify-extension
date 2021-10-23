chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("request", request);
  console.log("sender", sender);
  console.log("sendResponse", sendResponse);
});

initGrabButton();
initContainerView();

function initGrabButton() {
  const grabButton = document.createElement("button");

  grabButton.innerText = "Grab";
  grabButton.classList.add("grab-button");

  // …and register a listener for when that button is clicked
  grabButton.addEventListener("click", getPageProductInfo);
  document.querySelector("body").appendChild(grabButton);
}

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
  const formatImgList = Array.from(new Set(productImgList));

  const productColorNodeList = productInfoWrapper.querySelectorAll(
    ".product-intro__color-choose .product-intro__color-radio img"
  );
  const productColorList = Array.prototype.slice
    .call(productColorNodeList)
    .map((item) => {
      return item.src;
    });

  console.log(
    formatImgList,
    productInfoTitle,
    productInfoSku,
    productInfoPrice,
    productInfoSizeList,
    productColorList
  );

  showContainer();
  initProductInfoTitle(productInfoTitle);
  initProductImg(formatImgList);
  initSaveButton();
}

// Build container view
function initContainerView() {
  const container = document.createElement("div");
  const cancelButton = document.createElement("button");

  cancelButton.innerText = "Close";
  cancelButton.classList.add("cancel-button");
  cancelButton.addEventListener("click", closeContainer);

  container.appendChild(cancelButton);
  container.classList.add("shopify-container");
  document.body.appendChild(container);
}

// make container visible
function showContainer() {
  const container = document.querySelector(".shopify-container");
  container.style.right = "0";
}

// make container hidden
function closeContainer() {
  const container = document.querySelector(".shopify-container");
  container.style.right = "-250px";
}

function initProductInfoTitle(productInfoTitle) {
  const container = document.querySelector(".shopify-container");
  const title = document.createElement("div");

  title.innerText = productInfoTitle;
  title.classList.add("product-title");
  container.appendChild(title);
}

function initProductImg(productImgList) {
  const container = document.querySelector(".shopify-container");
  const imgContainer = document.createElement("div");

  productImgList.map((item) => {
    const img = document.createElement("img");
    img.src = item;
    imgContainer.appendChild(img);
  });

  imgContainer.classList.add("product-img");
  container.appendChild(imgContainer);
}

function initProductInfoSize(productInfoSize) {
  const container = document.querySelector(".shopify-container");
  const size = document.createElement("div");

  size.classList.add("product-size");
  container.appendChild(title);
}

// Build container view
function initSaveButton() {
  const saveButton = document.createElement("button");

  saveButton.innerText = "Save";
  saveButton.classList.add("save-button");
  saveButton.addEventListener("click", saveProduct);

  container.appendChild(saveButton);
}

function saveProduct() {
  console.log("保存");
}
