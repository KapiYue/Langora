// import * as crypto from "crypto";
const crypto = require("crypto");

function generateSignature(payload, secret) {
  const computedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return computedSignature;
}

const payload = {
    "eventType": "checkout.completed",
    "object": {
      "id": "ch_4gdjt1bnfIOOWZR7w1ifND",
      "object": "checkout",
      "request_id": "638c6e1d-c58e-4253-bb47-a4bd479f2b7a",
      "order": {
        "object": "order",
        "id": "ord_3TrpIhzNugfsdVj2qJFexT",
        "customer": "cust_2h6DGJmKZ3W7q8WNxGmdQF",
        "product": "prod_6mqaOuMS41HtRWSWdGnx2o",
        "amount": 1000,
        "currency": "USD",
        "sub_total": 1000,
        "tax_amount": 0,
        "amount_due": 1000,
        "amount_paid": 0,
        "status": "paid",
        "type": "recurring",
        "transaction": "tran_kwfPZkuXQOdZVGrsIe7Sb",
        "created_at": "2026-06-19T09:15:42.622Z",
        "updated_at": "2026-06-19T09:16:56.597Z",
        "mode": "test"
      },
      "product": {
        "id": "prod_6mqaOuMS41HtRWSWdGnx2o",
        "object": "product",
        "name": "Pro",
        "description": "Subs Pro Test",
        "price": 1000,
        "currency": "USD",
        "billing_type": "recurring",
        "billing_period": "every-month",
        "status": "active",
        "tax_mode": "exclusive",
        "tax_category": "digital-goods-service",
        "default_success_url": "https://localhost:3000/payment/success",
        "created_at": "2026-06-19T07:55:10.485Z",
        "updated_at": "2026-06-19T07:58:59.686Z",
        "mode": "test"
      },
      "units": 1,
      "success_url": "http://localhost:3000/payment/success",
      "customer": {
        "id": "cust_2h6DGJmKZ3W7q8WNxGmdQF",
        "object": "customer",
        "email": "ellnazhang520@gmail.com",
        "name": "hack",
        "metadata": {
          "userId": "c5ec8a9e-fe28-4c11-9f7a-c84ada2d3955",
          "paymentType": "subscription"
        },
        "country": "US",
        "created_at": "2026-02-11T11:41:51.863Z",
        "updated_at": "2026-06-19T09:16:56.925Z",
        "mode": "test"
      },
      "subscription": {
        "id": "sub_6dCPiMc9iszkDPqzqW88sU",
        "object": "subscription",
        "product": "prod_6mqaOuMS41HtRWSWdGnx2o",
        "customer": "cust_2h6DGJmKZ3W7q8WNxGmdQF",
        "collection_method": "charge_automatically",
        "status": "active",
        "current_period_start_date": "2026-06-19T09:16:49.000Z",
        "current_period_end_date": "2026-07-19T09:16:49.000Z",
        "canceled_at": null,
        "created_at": "2026-06-19T09:16:52.055Z",
        "updated_at": "2026-06-19T09:16:56.663Z",
        "metadata": {
          "userId": "c5ec8a9e-fe28-4c11-9f7a-c84ada2d3955",
          "paymentType": "subscription"
        },
        "mode": "test"
      },
      "status": "completed",
      "metadata": {
        "userId": "c5ec8a9e-fe28-4c11-9f7a-c84ada2d3955",
        "paymentType": "subscription"
      },
      "mode": "test"
    },
    "id": "evt_2ferWgI2Ti3r7zWGqLQHDZ",
    "created_at": 1781860617124
  }

const secret = "whsec_6YHH9R751EJCvgQ4sRMhRd";
const payloadString = JSON.stringify(payload, null, 2);

console.log(payloadString);

const response = generateSignature(payloadString, secret);

console.log(response);
