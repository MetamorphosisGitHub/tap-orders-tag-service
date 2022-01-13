require('dotenv').config();
const express = require("express");

const subscriptionController = require('./api/subscriptions/infra/http/controllers/subscription');
const recurringOrderController = require('./api/order/infra/http/controllers/recurringOrder');

const app = express();

app.use(express.json({ extended: false }));

app.post("/subscription", subscriptionController.handle);
app.post("/order", recurringOrderController.handle);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Listen on port ${PORT}...`));