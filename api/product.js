const express = require("express");
const router = express.Router();

/**
 * GET product list.
 *
 * @return product list | empty.
 */
router.post("/", async (req, res) => {
  try {
    const msg = req.body.message;

    res.json({
      status: 200,
      message: `${msg} + yeah`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;