const db = require("../../../../../config/db");

exports.handle = async (req, res) => {
    try {
        const now = Date.now();
        const data = await db.createItem(now, { recurring: req.body });
        res.json({ data })
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
  };