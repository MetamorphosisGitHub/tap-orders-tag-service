const express = require("express");
const app = express();

const product = require("./api/subscriptions/infra/http/controllers/product");

app.use(express.json({ extended: false }));

app.use("/teste", product);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));