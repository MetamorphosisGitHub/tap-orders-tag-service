require('dotenv/config');
const axios = require('axios')
const { v4: uuid } = require('uuid')
const { createItem, updateItem } = require('../config/db')
const shopify = require('../config/shopify')

const bold = axios.create({
    baseURL: 'https://ro.boldapps.net/api/third_party/v2/',
    headers: { 'BOLD-Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJhbnhpb3VzLXBldC5teXNob3BpZnkuY29tIiwianRpIjoiZmlyc3QtYW5kLXN1Yi1hci1vcmRlcnMiLCJpYXQiOjE2NDMwMzAxMDMsImV4cCI6MTY0MzExNjUwMywidXNlclR5cGUiOiJhcGkifQ.YzAwqaCCFVSjOoXYHQGlJMGJo3UXMzO_0Cr-F_RdnYxDNaGJqqOSmnfdR2DoslOXCT2iBOHCAWmoo1K8m3Ud4g' }
})

async function getFirstArs() {
    try {
        let stack = [];
        let queryStr = ''
        let condition = true;

        while (condition) {
            const { data } = await bold.get(`subscriptions?shop=anxious-pet.myshopify.com${queryStr}`);

            if (data.subscriptions.length) {
                const first_ars = data.subscriptions
                    .map(s => s.order_logs[0].shopify_order_num.replace('#', ''));
                queryStr = `&since_id=${data.subscriptions[data.subscriptions.length - 1].id}`;
                stack.push(first_ars);
            }
            condition = Boolean(data.subscriptions.length);
        }

        let first_ars = stack.flat();
        return first_ars;

    } catch (err) {
        console.log(err);
    }
}

async function getSubArs() {
    try {
        let stack = [];
        let queryStr = ''
        let condition = true;

        while (condition) {
            const { data } = await bold.get(`subscriptions?shop=anxious-pet.myshopify.com${queryStr}`);

            if (data.subscriptions.length) {
                const sub_ars = data.subscriptions.map(s => {
                    for (const [i, order] of s.order_logs.entries()) {
                        if (i && !isNaN(order.shopify_order_num.replace('#', ''))) 
                            return order.shopify_order_num.replace('#', '');
                    }
                })
                
                queryStr = `&since_id=${data.subscriptions[data.subscriptions.length - 1].id}`;
                stack.push(sub_ars);
            }
            condition = Boolean(data.subscriptions.length);
        }

        let sub_ars = stack.flat().filter(n => n);
        return sub_ars;
    } catch (err) {
        console.log(err);
    }
}

async function getOrder(name) {
    const orders = await shopify.order.list({ 
        fields: 'id, name, email, total_price, tags, created_at',
        status: 'any', 
        name
    });
    return orders.find(o => o.name === `#${name}`);
}

async function timer(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
}

async function saveInDB(order_names) {
    for (const name of order_names) {
        await timer(600);
        const order = await getOrder(name);
        if (order) {
            await createItem(order.id, { 
                type: 'first-AR',
                order: order,
                status: 'pending'
            });
        }
    }
}

async function updateTags(order_names) {
    for (const [i, name] of order_names.entries()) {
        await timer(600);
        const order = await getOrder(name);
        if (order) {
            await timer(600);
            await shopify.order.update(order.id, {
                tags: `${order.tags.replace('recurring_order', 'first-AR')}` 
            });
            await updateItem(order.id, { status: 'updated' })
            console.log(`Order updated. ID: ${order.id}. ${order_names.length - i} orders left.`)
        }
    }
}

async function main() {
    const first_ars = await getFirstArs();
    await saveInDB(first_ars);
}

main();