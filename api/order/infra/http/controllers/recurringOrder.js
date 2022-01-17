const db = require("../../../../../config/db");

const stack = []  
exports.handle = async (req, res) => {
  try {
      stack.push(req.body);

        // const { purchase_date, last_ship_date } = req.body.data.subscription;
        // const isFirstRecurringOrder = purchase_date === last_ship_date;
        // if (isFirstRecurringOrder) res.status(202).send();

        // let time = new Date(req.body.event_time);
        // let shopify_customer_id = req.body.data.subscription.shopify_customer_id;
    
        // time.setMinutes(time.getMinutes() - 2);
    
        // const interval_items = await shopify.order.list({ created_at_min: `${time}-06:00` });
        // const order = interval_items.find(i => i.customer.id === shopify_customer_id);
    
        // await shopify.order.update(order.id, { tags: 'sub-AR' })
    
        res.status(200).json(stack);
      } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
      }
  };