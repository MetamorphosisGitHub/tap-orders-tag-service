const db = require("../../../../../config/db");
const shopify = require('../../../../../config/shopify');

// exports.getSubscription = async (req, res, next) => {
//   try {
//     const attr = ['teste'];
//     const item = await db.getItem(req.body.id, attr.join());

//     const a = item.Item.teste.data.subscription.shopify_customer_id;
//     const b = item.Item.teste.event_time;
//     console.log(a, b);

//     const interval_items = await shopify.order.list({ created_at_min: `${b}-06:00` });
//     const order = interval_items.find(i => i.customer.id === a);

//     const { id } = order;
//     const mnk = await shopify.order.update(id, { tags: 'TESTE_VICTOR' })
//     console.log(mnk);

//     // const a = item.Item.teste.M.event_time.S
//     // const a_date = new Date(a);
//     // const b = item.Item.teste.M.data.M.subscription.M.shopify_customer_id.N
//     // console.log(a_date.toISOString());
//     // console.log(b);
//     // const pp = '2022-01-13T04:45:12-08:00';
//     // console.log(item.Item.teste.M.event_time.S)
//     // console.log(item.Item.teste.M.data.M.subscription.M.shopify_customer_id.N);

//     /*
//       TEMPO NO BD (OBJETO DO BOLD): 2022-01-13 12:40:20-06:00
//       TEMPO NAS ORDERS DO SHOPIFIY: 2022-01-13T10:40:16-08:00
//       TEMPO AQUI NO BRASIL: 2022-01-13 15:46:16
//     */
//     res.json({
//         data: interval_items
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

exports.create = async (req, res) => {
  try {    
    let time = new Date(req.body.event_time);
    let shopify_customer_id = req.body.data.subscription.shopify_customer_id;

    time.setMinutes(time.getMinutes() - 2);

    const interval_items = await shopify.order.list({ created_at_min: `${time}-06:00` });
    const order = interval_items.find(i => i.customer.id === shopify_customer_id);

    await shopify.order.update(order.id, { tags: 'TESTE_VICTOR' })

    res.status(200).send();
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
};
