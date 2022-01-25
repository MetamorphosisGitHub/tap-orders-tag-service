const db = require("../../../../../config/db");
const shopify = require('../../../../../config/shopify');

exports.handle = async (req, res) => {
  try {    
    let time = new Date(req.body.event_time);
    let shopify_customer_id = req.body.data.subscription.shopify_customer_id;

    time.setMinutes(time.getMinutes() - 2);

    const interval_items = await shopify.order.list({ 
      fields: 'id, name, email, total_price, tags, created_at',
      created_at_min: `${time}-06:00`
    });
    const order = interval_items.find(i => i.customer.id === shopify_customer_id);

    await shopify.order.update(order.id, { tags: 'first-AR' });
    // await createItem(order.id, { type: 'first-AR', order: order, status: 'updated' });

    res.status(200).send();
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
};
