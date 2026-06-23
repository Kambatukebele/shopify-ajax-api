### Shopify AJAX API (YouTube Script)

**Intro Line:**

> "The Shopify Ajax API is a set of simple tools that helps your online store's theme do smart things without reloading the page."

---

#### FYI (Two Important Rules)

1. You can only use this API if your theme is hosted **by Shopify** itself.
2. You **cannot** use this API on a custom storefront you built outside Shopify.

---

#### What Can You Actually Build With This?

Here are three real-world examples:

- **Add products to the cart** and instantly update the little cart bubble number without refreshing.
- **Show "You may also like" recommendations** under a product.
- **Suggest products or collections** while a customer types into the search bar.

---

#### What You Need to Know First

Before using this API, you should be comfortable with:

- Basic JavaScript
- Promises – `.then()` and `.catch()`
- `async` / `await`

> "Don't worry if those sound scary. Just know you'll need them to handle 'waiting' for the API to respond."

---

#### Two Ways to Talk to the API

The Ajax API accepts only two types of HTTP requests:

| Request Type | What It Does                                                      |
| ------------ | ----------------------------------------------------------------- |
| **GET**      | Read data – like what's in the cart or product details            |
| **POST**     | Update data – like adding an item to the current shopping session |

---

#### Locale-Aware URLs (Smart Links for Different Countries)

**What does "locale-aware" mean?**

> It means your store can automatically create the right web address for customers based on their **language** and **country**.

# **The magic helper:**

---

What are we going to explore?

# 1. Cart API

# 2. Product API

# 3. Product Recommendations Cart API

# 4. Predictive Search API

---

## 1 Cart API:

The Cart API is used to interact with a cart during a customer's session. This guide shows how to use the Cart API to update cart line items, add cart attributes and notes, and generate shipping rates.

# Endpoints:

- Add to Cart: POST -> /{locale}/cart/add.js
- Get the Cart: GET -> /{locale}/cart.js
- Update Cart: POST -> /{locale}/cart/update.js
- Change Cart: POST -> /{locale}/cart/change.js
- Clear Cart: POST -> /{locale}/cart/clear.js

# ADD TO THE CART

async function AddToCart(id, quantity) {
try {
// Add to cart enpoints -> /add.js
const URL = localeAware + 'cart/add.js';

      const res = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              id: id,
              quantity: quantity,
              properties: {
                name: 'Kamba',
              },
            },
          ],
          note: 'Hello and welcome',
          attributes: {
            gift: 'yes',
          },
        }),
      });

      if (!res.ok) {
        const theError = await res.json();
        const status = await theError.status;
        const message = await theError.message;
        const description = await theError.description;
        throw new Error(`STATUS:${status} | MESSAGE: ${message} | DESCRIPTION: ${description}`);
      }

      const data = await res.json();
    } catch (error) {
      console.log(`NETWORK ERROR: ${error}`);
    }

}

_-> FormData constructor and target the desired add-to-cart form_
let addToCartForm = document.querySelector('form[action$="/cart/add"]');
let formData = new FormData(addToCartForm)
_-> Response_

- The response for a successful POST request is a JSON object of the line items associated with the added items.

- If an added item was already in the cart, then the quantity is equal to the new quantity for that cart line item. However, if the same items have differing prices, properties, or selling plans, then they'll be split into their own line items.

_-> Error Responses: Refer to shopify documentation: https://shopify.dev/docs/api/ajax/reference/cart_

- if the specified quantity for an item exceeds the available stock (e.g attempting to add 20 items when only 10 are available), the cart will instead add the maximum available quantity. The error returned in JSON format is as follows:

_-> Add line item properties:_

- The properties of the line item.

- You can add, or allow customers to add, custom information to a line item with line item properties.

- Line item properties consist of a name and value pair. They can be captured with the following methods:

_->Add a selling plan:_

# GET THE CART

async function getCart() {
try {
const URL = localeAware + 'cart.js';
const res = await fetch(URL);
if (!res.ok) {
const theError = await res.json();
const status = await theError.status;
const message = await theError.message;
const description = await theError.description;
throw new Error(`STATUS:${status} | MESSAGE: ${message} | DESCRIPTION: ${description}`);
}
const data = res.json();
console.log(data);
} catch (error) {
console.log(error);
}
}

# UPDATE THE CART

async function updateCart(id, quantity) {
try {
let updates = {
id: quantity,
};
console.log(updates);
const URL = localeAware + 'cart/update.js';
const response = await fetch(URL, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({ updates }),
});
if (!response.ok) {
let errorData = await response.json();
const description = await errorData.description;
throw new Error(`Oppssss!!!!: ${description}`);
}
const data = await response.json();
// console.log(response);
console.log(data);
} catch (error) {
console.error(error);
}
}

Use the POST /{locale}/cart/update.js endpoint to update the cart's line item quantities, note, or attributes. You can submit a serialized cart form, or submit separate updates to a cart's line items, note, or attributes.

Update line item quantities
To update line item quantities, you can make a POST request with an updates object. The updates object must contain key-value pairs where the value is the desired quantity, and the key is one of the following:

- The line item's variant_id
- The line item's key

A cart can have multiple line items that share the same variant_id. For example, when variants have different line item properties, or automatic
discounts
create variants at different prices. Because of this, it's recommended to use the line item key to ensure that you're only changing the intended line item.

The line item key is not persistent for the lifetime of a line item, it changes as characteristics of the line item change. This includes, but is not limited to, properties and discount applications.

Note
If you use the variant ID, then the key can be either an integer or a string. However, if you use the line item key, then the key needs to be a string.

The following POST request yields the same result:

# CHANGE THE CART

async function changeCart(id, quantity) {
try {
const URL = localeAware + 'cart/change.js';
const res = await fetch(URL, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({
line: id,
quantity: quantity,
}),
});
if (!res.ok) {
let errorData = await res.json();
const description = await errorData.description;
throw new Error(`Ooppps!!! ${description}`);
}
const data = await res.json();
return data;
} catch (error) {
console.error(error);
}
}

# CLEAR THE CART

async function clearCart() {
const URL = localeAware + 'cart/clear.js';
const res = fetch(URL, {
method: 'POST',
});
return res;
}

---

Section Rendering --------------

- You can use the Section Rendering API to request the HTML markup for theme sectons using an AJAX request. This can allow you to update page content without reloading the entire oage by fetching and dynamically replacing only certain elements.

- You can use the sections query parameter to render up to five sections, identified by their section ids. The response is a JSON object that includes pairs for each ID and its corresponding rendered HTML.

- The sections parameter can be a comma-separated list of IDs or an array.
