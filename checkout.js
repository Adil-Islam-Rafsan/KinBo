import { STORE } from './config.js';
import { mountLayout, getProducts, getCart, saveCart, money, toast } from './store.js';

mountLayout();
const root = document.getElementById('checkout-root');

try {
  const products = await getProducts();
  let cart = getCart();

  let items = Object.entries(cart)
    .map(([id, q]) => ({ p: products.find(x => x.id === id), q: Number(q) }))
    .filter(x => x.p && x.p.status === 'active' && x.p.stock > 0 && x.q > 0);

  items.forEach(x => x.q = Math.min(x.q, x.p.stock));
  cart = Object.fromEntries(items.map(x => [x.p.id, x.q]));
  saveCart(cart);

  if (!items.length) {
    root.innerHTML = '<div class="empty-state">Your cart is empty. <a class="text-link" href="shop.html">Shop now →</a></div>';
  } else {
    const subtotal = items.reduce((s, x) => s + x.p.price * x.q, 0);

    root.innerHTML = `
      <form id="checkout-form" class="checkout-layout">
        <section class="form-card">
          <h2>Customer & delivery information</h2>
          <div class="form-grid">
            <div class="field">
              <label for="full-name">Full name *</label>
              <input id="full-name" name="full-name" required maxlength="80" autocomplete="name">
            </div>
            <div class="field">
              <label for="phone">Mobile number *</label>
              <input id="phone" name="phone" required type="tel" maxlength="20" placeholder="01XXXXXXXXX" autocomplete="tel">
            </div>
            <div class="field">
              <label for="district">District / city *</label>
              <input id="district" name="district" required maxlength="60" placeholder="e.g. Dhaka">
            </div>
            <div class="field">
              <label for="area">Area / thana *</label>
              <input id="area" name="area" required maxlength="80" placeholder="e.g. Mirpur">
            </div>
            <div class="field full">
              <label for="address">Full delivery address *</label>
              <textarea id="address" name="address" required maxlength="350" placeholder="House, road, area and any helpful delivery directions"></textarea>
            </div>
            <div class="field full">
              <label>Delivery zone *</label>
              <div class="radio-list">
                <label class="radio-option"><input type="radio" name="zone" value="dhaka" checked> Inside Dhaka — ${money(STORE.delivery.dhaka)}</label>
                <label class="radio-option"><input type="radio" name="zone" value="outside"> Outside Dhaka — ${money(STORE.delivery.outsideDhaka)}</label>
              </div>
            </div>
            <div class="field full">
              <label>Payment method *</label>
              <div class="radio-list">
                <label class="radio-option"><input type="radio" name="payment" value="Cash on Delivery" checked> Cash on Delivery</label>
                <label class="radio-option"><input type="radio" name="payment" value="bKash / Nagad (confirm with shop)"> bKash / Nagad — confirm payment details with the shop</label>
              </div>
            </div>
            <div class="field full">
              <label for="note">Order note (optional)</label>
              <textarea id="note" name="note" maxlength="250" placeholder="Colour preference, landmark, or other notes"></textarea>
            </div>
          </div>
        </section>

        <aside class="order-summary">
          <h2>Your order</h2>
          ${items.map(x => `<div class="order-item"><span>${x.p.name} × ${x.q}</span><b>${money(x.p.price * x.q)}</b></div>`).join('')}
          <div class="summary-line"><span>Subtotal</span><b>${money(subtotal)}</b></div>
          <div class="summary-line"><span>Delivery</span><b id="delivery-fee">${money(STORE.delivery.dhaka)}</b></div>
          <div class="summary-line summary-total"><span>Total</span><b id="grand-total">${money(subtotal + STORE.delivery.dhaka)}</b></div>
          <div class="checkout-warning">Your order details will be prepared in WhatsApp. After WhatsApp opens, press Send to submit your order request. KinBo will confirm availability and delivery with you.</div>
          <button class="btn btn-primary" type="submit">Confirm order on WhatsApp →</button>
          <p class="summary-help">This starter checkout does not take online payments or store orders in a database. Do not advertise automated payment or order tracking until a backend is connected.</p>
        </aside>
      </form>
    `;

    root.querySelectorAll('[name="zone"]').forEach(input => {
      input.onchange = () => {
        const fee = input.value === 'dhaka' ? STORE.delivery.dhaka : STORE.delivery.outsideDhaka;
        document.getElementById('delivery-fee').textContent = money(fee);
        document.getElementById('grand-total').textContent = money(subtotal + fee);
      };
    });

    document.getElementById('checkout-form').onsubmit = e => {
      e.preventDefault();
      const form = e.currentTarget;

      if (!form.reportValidity()) return;

      const phone = document.getElementById('phone').value.trim();
      if (!/^\+?[0-9\s()-]{8,20}$/.test(phone)) {
        toast('Please enter a valid mobile number');
        return;
      }

      const data = new FormData(form);
      const zone = data.get('zone');
      const fee = zone === 'dhaka' ? STORE.delivery.dhaka : STORE.delivery.outsideDhaka;
      const total = subtotal + fee;

      const lines = items.map(x => `• ${x.p.name} (${x.p.id}) x ${x.q} = ${money(x.p.price * x.q)}`).join('\n');

      const msg = `*NEW ORDER — KINBO*

*Customer:* ${data.get('full-name')}
*Phone:* ${data.get('phone')}
*District:* ${data.get('district')}
*Area:* ${data.get('area')}
*Address:* ${data.get('address')}

*Items*
${lines}

Subtotal: ${money(subtotal)}
Delivery: ${money(fee)}
*TOTAL: ${money(total)}*
Payment: ${data.get('payment')}
Note: ${data.get('note') || 'None'}

Please confirm stock and delivery.`;

      const number = STORE.whatsappNumber.replace(/\D/g, '');
      if (number.length < 10 || number.includes('XXXXXXXX')) {
        toast('Set your real WhatsApp number in config.js first.');
        return;
      }

      window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, '_blank');
    };
  }
} catch (err) {
  console.error(err);
  root.innerHTML = '<div class="empty-state">Checkout could not be loaded. Please try again.</div>';
}
