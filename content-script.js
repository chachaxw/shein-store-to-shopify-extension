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
  const productInfoColorList = Array.prototype.slice
    .call(productColorNodeList)
    .map((item) => {
      return item.src;
    });

  const saveButton = document.querySelector(".save-button");
  const productWrapper = document.querySelector(".product-wrapper");
  const productInfo = {
    title: productInfoTitle,
    images: formatImgList,
    sku: productInfoSku,
    price: productInfoPrice,
    sizeList: productInfoSizeList,
    colorList: productInfoColorList,
  };

  console.log(productInfo);

  if (!productWrapper) {
    initProductInfo(productInfo);
  }

  if (!saveButton) {
    initSaveButton();
  }

  showContainer();
}

// Build container view
function initContainerView() {
  const container = document.createElement("div");
  const cancelButton = document.createElement("button");

  cancelButton.innerText = "Cancel";
  cancelButton.classList.add("cancel-button");
  cancelButton.addEventListener("click", closeContainer);

  container.appendChild(cancelButton);
  container.classList.add("shopify-container");
  document.body.appendChild(container);
}

// Make container visible
function showContainer() {
  const container = document.querySelector(".shopify-container");
  container.style.right = "0";
}

// Make container hidden
function closeContainer() {
  const container = document.querySelector(".shopify-container");
  const productWrapper = document.querySelector(".product-wrapper");
  container.style.right = "-250px";
  container.removeChild(productWrapper);
}

// Build Product info view
function initProductInfo(productInfo) {
  const container = document.querySelector(".shopify-container");
  const productWrapper = document.createElement("div");
  const { title, images, sku, price, sizeList, colorList } = productInfo;

  // Append product wrapper to shopify container
  productWrapper.classList.add("product-wrapper");
  container.appendChild(productWrapper);

  initProductInfoTitle(title);
  initProductInfoImg(images);
  initProductInfoSku(sku);
  initProductInfoPrice(price);
  initProductInfoSize(sizeList);
  initProductInfoColor(colorList);
}

function initProductInfoTitle(productInfoTitle) {
  const container = document.querySelector(".product-wrapper");
  const title = document.createElement("div");

  title.innerText = productInfoTitle;
  title.classList.add("product-title");
  container.appendChild(title);
}

function initProductInfoSku(productInfoSku) {
  const container = document.querySelector(".product-wrapper");
  const text = document.createElement("div");

  text.innerText = productInfoSku;
  text.style.marginBottom = "8px";
  container.appendChild(text);
}

function initProductInfoPrice(productInfoPrice) {
  const container = document.querySelector(".product-wrapper");
  const text = document.createElement("div");

  text.innerText = `Price: ${productInfoPrice}`;
  text.style.marginBottom = "8px";
  container.appendChild(text);
}

function initProductInfoImg(productImgList) {
  const container = document.querySelector(".product-wrapper");
  const imgContainer = document.createElement("div");

  productImgList.map((item) => {
    const img = document.createElement("img");
    img.src = item;
    imgContainer.appendChild(img);
  });

  imgContainer.classList.add("product-img");
  container.appendChild(imgContainer);
}

function initProductInfoSize(productInfoSizeList) {
  const container = document.querySelector(".product-wrapper");
  const sizeContainer = document.createElement("div");
  const label = document.createElement("span");

  label.innerText = "Size:";
  sizeContainer.appendChild(label);

  if (productInfoSizeList.length) {
    productInfoSizeList.map((item) => {
      const span = document.createElement("span");
      span.innerText = item;
      sizeContainer.appendChild(span);
    });
  } else {
    label.innerText = "Size: -";
  }

  sizeContainer.classList.add("product-size");
  container.appendChild(sizeContainer);
}

function initProductInfoColor(productInfoColorList) {
  const container = document.querySelector(".product-wrapper");
  const colorContainer = document.createElement("div");
  const label = document.createElement("span");

  label.innerText = "Color:";
  colorContainer.appendChild(label);

  if (productInfoColorList.length) {
    productInfoColorList.map((item) => {
      const img = document.createElement("img");
      img.src = item;
      colorContainer.appendChild(img);
    });
  } else {
    label.innerText = "Color: -";
  }

  colorContainer.classList.add("product-color");
  container.appendChild(colorContainer);
}

// Build save button
function initSaveButton() {
  const container = document.querySelector(".product-wrapper");
  const saveButton = document.createElement("button");

  saveButton.innerText = "Save to Shopify";
  saveButton.classList.add("save-button");
  saveButton.addEventListener("click", saveProduct);

  container.appendChild(saveButton);
}

function saveProduct() {
  console.log("保存");
}
