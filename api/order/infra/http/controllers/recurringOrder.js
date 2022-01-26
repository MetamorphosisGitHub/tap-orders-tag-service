const { createItem } = require('../../../../../config/db');
const shopify = require('../../../../../config/shopify');

exports.handle = async (req, res) => {
  try {
    const { purchase_date, last_ship_date } = req.body.data.subscription;
    const isFirstRecurringOrder = purchase_date === last_ship_date;
    if (isFirstRecurringOrder) {
      res.status(202).send();
    }

    let time = new Date(req.body.event_time);
    let shopify_customer_id = req.body.data.subscription.shopify_customer_id;

    time.setMinutes(time.getMinutes() - 2);

    const interval_items = await shopify.order.list({ 
      fields: 'id, name, email, total_price, tags, customer, created_at',
      created_at_min: `${time}-06:00`
    });
    const order = interval_items.find(i => i.customer.id === shopify_customer_id);

    await shopify.order.update(order.id, { tags: 'sub-AR' });
    await createItem(order.id, { type: 'sub-AR', order: order, status: 'updated' });
    res.status(200).send();
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
};