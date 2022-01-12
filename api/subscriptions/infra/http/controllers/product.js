// const { Shopify } = require('@shopify/shopify-api')
const shopify = require('../../../../config/shopify')

const express = require("express");
const router = express.Router();

const test = []

router.post("/", async (req, res) => {
  try {
    const client = new Shopify.Clients.Rest('anxious-pet.myshopify.com', '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')
    const data = await client.get({ path: 'customers '});

    res.json({
      status: 200,
      message: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;