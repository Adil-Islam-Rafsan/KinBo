# KinBo Store — Setup & Launch Guide

এই প্রজেক্টটি GitHub Pages/static hosting-এর জন্য তৈরি করা হয়েছে। এতে আলাদা HTML page, product JSON, image folder, cart এবং WhatsApp order-request checkout আছে।

## 1) প্রথমে যেগুলো অবশ্যই পরিবর্তন করবেন

### WhatsApp নম্বর
`js/config.js` ফাইলে:
```js
whatsappNumber: "8801XXXXXXXXX"
```
এখানে আপনার WhatsApp নম্বর country code-সহ লিখুন। বাংলাদেশের `+880` ব্যবহার করবেন, কিন্তু `+` ছাড়া। উদাহরণ: `88017XXXXXXXX`।

### Delivery charge
একই `js/config.js` ফাইলে:
```js
delivery: {
  dhaka: 70,
  outsideDhaka: 130
}
```
আপনার courier charge অনুযায়ী 70 এবং 130 পরিবর্তন করুন। এগুলো sample value।

## 2) নিজের Product যোগ করা

`data/products.json` ফাইলটি খুলুন। প্রতিটি product একটি object। নতুন product object যোগ করুন:

```json
{
  "id": "KB009",
  "name": "Your Product Name",
  "category": "Accessories",
  "price": 650,
  "oldPrice": 750,
  "description": "Write the real product details here.",
  "images": ["assets/products/KB009.jpg"],
  "emoji": "🛍️",
  "stock": 10,
  "status": "active",
  "featured": true,
  "badge": "NEW"
}
```

- প্রতিটি product-এর `id` আলাদা রাখবেন।
- `category` হিসেবে Accessories, Lifestyle, Tech, Home বা নিজের category ব্যবহার করতে পারবেন।
- `price` টাকা হিসেবে লিখবেন।
- `oldPrice` না থাকলে `0` দিন।
- `stock`-এ প্রকৃত quantity দিন।
- `status: "active"` হলে product দেখা যাবে। `status: "hidden"` করলে storefront-এ দেখা যাবে না।
- `stock: 0` হলে Sold Out দেখাবে এবং Add to Cart বন্ধ থাকবে।
- `featured: true` হলে Home page-এর Featured Finds-এ দেখাবে।

## 3) Product image যোগ করা

ছবিটি `assets/products/` folder-এ রাখুন। তারপর JSON-এ সঠিক filename দিন:
```json
"images": ["assets/products/KB009.jpg"]
```
ছবির filename ও JSON path হুবহু একই হতে হবে। JPG, PNG বা WebP ব্যবহার করুন। Product-এর পরিষ্কার, ভালো আলোতে তোলা ছবি ব্যবহার করুন।

## 4) Stockout / Restock

কোনো পণ্য শেষ হলে:
```json
"stock": 0
```
আবার stock এলে প্রকৃত সংখ্যা দিন, যেমন:
```json
"stock": 12
```
Product একেবারে লুকাতে চাইলে:
```json
"status": "hidden"
```

## 5) Pages

- `index.html` — Home
- `shop.html` — Product catalogue, category filters, sorting
- `product.html?id=KB001` — Product details
- `cart.html` — Cart management
- `checkout.html` — Customer details and WhatsApp order message
- `about.html` — About KinBo
- `contact.html` — Contact
- `policies.html` — Shipping and returns

## 6) GitHub Pages deploy

1. ZIP extract করুন।
2. সব ফাইল ও folder repository root-এ upload করুন (index.html root-এ থাকবে)।
3. GitHub repository → Settings → Pages → Deploy from branch → `main` / `root` নির্বাচন করুন।
4. Save করে deployment শেষ হওয়া পর্যন্ত অপেক্ষা করুন।
5. Live website-এ checkout test করুন।

## 7) গুরুত্বপূর্ণ সীমাবদ্ধতা

এটি static storefront। WhatsApp checkout customer-এর order message তৈরি করে এবং WhatsApp-এ পাঠানোর জন্য খোলে। Customer-কে WhatsApp-এ Send চাপতে হবে; তারপর shop-কে order confirm করতে হবে।

এই version-এ server-side order database, admin login/dashboard, automatic stock reservation, automated bKash/Nagad/card payment, order tracking বা automated email নেই। GitHub Pages একা এসব secure backend কাজ করতে পারে না।

**Launch-এর আগে অবশ্যই** WhatsApp number, real product names/photos/descriptions/prices/stock, delivery charges, payment instructions, contact details এবং store policies যাচাই করবেন। Sample catalog-এর তথ্য সরাসরি real products হিসেবে বিক্রি করবেন না।
