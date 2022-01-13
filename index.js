require('dotenv').config();
const express = require("express");

const subscriptionController = require('./api/subscriptions/infra/http/controllers/subscription');

const app = express();

app.use(express.json({ extended: false }));

// app.get("/subscription", subscriptionController.getSubscription);
app.post("/subscription", subscriptionController.create);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Listen on port ${PORT}...`));