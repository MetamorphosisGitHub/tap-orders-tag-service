const express = require("express");
const router = express.Router();

/**
 * GET product list.
 *
 * @return product list | empty.
 */
const test = []

router.post("/", async (req, res) => {
  try {
    const signature = req.headers['x-bold-signature'];
    const timestamp = req.headers['timestamp'];

    const obj = { signature, timestamp, payload: req.body };

    test.push(obj);


    res.json({
      status: 200,
      message: test,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;