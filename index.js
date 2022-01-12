const express = require("express");
require('dotenv').config();

const app = express();

const db = require('./api/config/db')

// const product = require("./api/subscriptions/infra/http/controllers/product");
// const shopify = require('./api/config/shopify')

app.use(express.json({ extended: false }));

app.post("/teste", async (req, res) => {
    // console.log(req.body);
    await db.deleteItem('teste');
    res.json({
        message: 'a'
    });
});

app.get("/teste", async (req, res) => {
    // console.log(req.body);
    const a = await db.getItem('teste');
    res.json({
        data: a
    });
});


const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));