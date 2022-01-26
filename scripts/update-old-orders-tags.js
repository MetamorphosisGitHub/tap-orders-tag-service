require('dotenv/config');
const axios = require('axios')
const { v4: uuid } = require('uuid')
const { createItem, updateItem } = require('../config/db')
const shopify = require('../config/shopify')

const bold = axios.create({
    baseURL: 'https://ro.boldapps.net/api/third_party/v2/',
    headers: { 'BOLD-Authorization': `Bearer ${process.env.BOLD_AUTH_TOKEN}` }
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
        let order_numbers = [];
        let queryStr = ''
        let condition = true;

        while (condition) {
            const { data } = await bold.get(`subscriptions?shop=anxious-pet.myshopify.com${queryStr}`);

            if (data.subscriptions.length) {
                const sub_ars = data.subscriptions.map(s => {
                    for (const [i, order] of s.order_logs.entries()) {
                        if (i !== 0 && !isNaN(Number(order.shopify_order_num.replace('#', '')))) {
                            order_numbers.push(order.shopify_order_num.replace('#', ''))
                        }
                    }
                })
                queryStr = `&since_id=${data.subscriptions[data.subscriptions.length - 1].id}`;
            }
            condition = Boolean(data.subscriptions.length);
        }

        let sub_ars = order_numbers.flat().filter(n => n);
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

async function saveInDB(order_names, type) {
    for (const name of order_names) {
        await timer(600);
        const order = await getOrder(name);
        if (order) {
            await createItem(order.id, { 
                type: type,
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
            await shopify.order.update(order.id, { tags: `${order.tags.replace('recurring_order', 'sub-AR')}` });
            await updateItem(order.id, { status: 'updated' });
            console.log(`Order updated. ID: ${order.id}. ${order_names.length - i} orders left.`)
        } else {
            console.log(`Error updating order. Name: ${name}`);
        }
    }
}

async function main() {
    // const sub_ars = await getSubArs();
    // await updateTags(sub_ars);
}

main();