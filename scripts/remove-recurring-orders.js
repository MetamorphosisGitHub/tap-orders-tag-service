require('dotenv/config');
const shopify = require('../config/shopify')

async function getOrders() {
    try {
        const items = await shopify.order.list({
            created_at_min: `2022-01-18T00:00:00-08:00`,
            status: 'any'
        });

        
        const res = items
                .filter(i => i.tags.includes('recurring_order'))
                .map(i => shopify.order.update(i.id, { 
                    tags: `${i.tags.replace('recurring_order', 'sub-AR')}` 
                }))
        
        Promise.all(res).then(y => {
            console.log(y);
        });

    } catch (err) {
        console.log(err);
    }
}

getOrders();