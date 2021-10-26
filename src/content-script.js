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

// The body of this function will be executed as a content script inside the current page
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
      return item.querySelector("span").firstChild.innerText;
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

  // Get the product color list from current page
  const productColorNodeList = productInfoWrapper.querySelectorAll(
    ".product-intro__color-select .product-intro__color-item span"
  );
  const productInfoColorList = Array.prototype.slice
    .call(productColorNodeList)
    .map((item) => {
      return item.innerText;
    });

  // Get the product description html from current page
  const productInfoDesc = productInfoWrapper.querySelector(
    ".product-intro__description .product-intro__description-table"
  ).innerHTML;

  const productWrapper = document.querySelector(".product-wrapper");
  const productInfo = {
    title: productInfoTitle,
    images: formatImgList,
    sku: productInfoSku,
    price: productInfoPrice,
    bodyHtml: productInfoTitle,
    sizeList: productInfoSizeList,
    colorList: productInfoColorList,
  };

  if (!productWrapper) {
    initProductInfo(productInfo);
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
  initSaveButton(productInfo);
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
      const span = document.createElement("span");
      span.innerText = item;
      colorContainer.appendChild(span);
    });
  } else {
    label.innerText = "Color: -";
  }

  colorContainer.classList.add("product-color");
  container.appendChild(colorContainer);
}

// Build save button
function initSaveButton(productInfo) {
  const container = document.querySelector(".product-wrapper");
  const saveButton = document.createElement("button");

  saveButton.innerText = "Save to Shopify";
  saveButton.classList.add("save-button");
  saveButton.addEventListener("click", () => saveProduct(productInfo));
  container.appendChild(saveButton);
}

async function saveProduct(productInfo) {
  const saveButton = document.querySelector(".save-button");

  // Add loading state to saveButton;
  saveButton.innerText = "Saving...";
  saveButton.disabled = true;

  const { title, images, sizeList, bodyHtml, colorList } = productInfo;

  let options = [];

  if (sizeList.length) {
    options.push({ name: "Size", values: sizeList });
  }

  if (colorList.length) {
    options.push({ name: "Color", values: colorList });
  }

  const data = {
    title,
    images,
    options,
    body_html: bodyHtml,
    variants: generateVariants(productInfo),
  };

  try {
    const response = await fetch(
      `http://localhost:3000/shopify/products/create`,
      {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(data),
      }
    );

    if (response.type === "opaque" || response.ok) {
      saveButton.innerText = "Saved";
      setTimeout(() => closeContainer(), 3000);
    } else {
      saveButton.innerText = "Try Again!";
      saveButton.disabled = false;
    }
  } catch (error) {
    saveButton.innerText = "Try Again!";
    saveButton.disabled = false;
  }
}

function generateVariants(productInfo) {
  let variants = [];
  const { title, sku, price, sizeList, colorList } = productInfo;

  if (sizeList.length) {
    sizeList.forEach((e) => {
      let variant = {
        title,
        sku: getSku(sku),
        price: getPrice(price),
        option1: e,
      };

      if (colorList.length) {
        colorList.forEach((d) => {
          variant = { ...variant, option2: d };
        });
      }

      variants.push(variant);
    });
  }

  return variants;
}

function getPrice(price) {
  return price.split("$")[1];
}

function getSku(sku) {
  return sku.split(":")[1].trim();
}
