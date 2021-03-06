const Koa = require("koa");
const Router = require("koa-router");
const Shopify = require("shopify-api-node");
const cors = require("@koa/cors");
const koaBody = require("koa-body");

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 3000;

// Shopify api url example like this:
// https://{apiKey}:{password}@chachaxw.myshopify.com/admin/api/2021-10/products.json
const shopifyConfig = {
  shopName: "chachaxw",
  apiKey: "22a18f405e229470e8663e113053f40f",
  password: "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",
  sharedSecret: "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",
};

router.post("/shopify/products/create", async (ctx, next) => {
  try {
    const { body } = ctx.request;
    const { apiKey, shopName, password } = shopifyConfig;
    const shopify = new Shopify({
      apiKey,
      shopName,
      password,
    });
    const response = await shopify.product.create(JSON.parse(body));

    ctx.status = 200;
    ctx.body = response;
  } catch (err) {
    ctx.status = err.response.statusCode || 503;
    ctx.body = err.response.body || "Server Internal Error";
  }
});

app.use(cors());

app.use(koaBody());

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log(`[Koa] App is starting at port ${port}`);
});
