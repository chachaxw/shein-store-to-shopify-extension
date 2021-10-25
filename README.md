# shein-store-to-shopify-extension

A Chrome extension with syncing Shein products to Shopify function

## Shopify Login Config

username: chachazw@gmail.com
apiKey: 22a18f405e229470e8663e113053f40f
password: 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

## Node Server Start

run: `npm install` and `npm start`

## How to use extension?

1. Open Chrome browser and access `chrome://extensions/`;
2. Make sure Developer mode switched on;
3. Click the `Load unpacked` button and select the extension folder;
4. Try to access [example product page](https://us.shein.com/V-neck-Crop-Tee-p-2163330-cat-1738.html?scici=productDetail~~RecommendList~~RS_own,RJ_NoFaultTolerant~~Customers%20Also%20Viewed~~SPcProductDetailCustomersAlsoViewedList~~0)
5. And Finally, click the `Grab` button on the top right corner on the page and click the `Save to Shopify` button;

## How to check if you grabbed the product successfully?

Open browser and access link `https://22a18f405e229470e8663e113053f40f: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@chachaxw.myshopify.com/admin/api/2021-10/products.json`, and check the products length if changed.
