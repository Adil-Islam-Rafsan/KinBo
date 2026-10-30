import { STORE } from './config.js';
let cachedProducts = null;
export async function getProducts(){
  if(cachedProducts) return cachedProducts;
  const response = await fetch('data/products.json');
  if(!response.ok) throw new Error('Could not load data/products.json');
  cachedProducts = await response.json();
  return cachedProducts;
}
export const money = value => `${STORE.currency}${Number(value||0).toLocaleString('en-BD')}`;
export const getCart = () => { try{return JSON.parse(localStorage.getItem('kinbo_cart')||'{}')}catch{return {}} };
export const saveCart = cart => { localStorage.setItem('kinbo_cart',JSON.stringify(cart)); updateCartCount(); };
export function updateCartCount(){
  const count = Object.values(getCart()).reduce((a,b)=>a+Number(b),0);
  document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=count);
}
export function addToCart(product, quantity=1){
  const cart=getCart(), current=Number(cart[product.id]||0);
  if(product.stock<=0) return {ok:false,message:'This product is currently out of stock.'};
  if(current+quantity>product.stock) return {ok:false,message:`Only ${product.stock} available.`};
  cart[product.id]=current+quantity;saveCart(cart);return {ok:true,message:'Added to your cart 🧡'};
}
export function toast(message){
  let el=document.querySelector('.toast');
  if(!el){el=document.createElement('div');el.className='toast';document.body.append(el)}
  el.textContent=message;el.classList.add('show');clearTimeout(window.__kinboToast);
  window.__kinboToast=setTimeout(()=>el.classList.remove('show'),2200);
}
export function productImage(product, extra=''){
  const src=product.images?.[0];
  return src ? `<img class="${extra}" src="${src}" alt="${escapeHtml(product.name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="product-placeholder" style="display:${src?'none':'grid'}">${product.emoji||'🛍️'}</span>` : `<span class="product-placeholder">${product.emoji||'🛍️'}</span>`;
}
export function escapeHtml(value=''){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export function productCard(p){
 const sold=p.stock<=0, low=p.stock>0&&p.stock<=STORE.lowStockThreshold;
 return `<article class="product-card"><a href="product.html?id=${encodeURIComponent(p.id)}"><div class="product-image">${p.badge?`<span class="product-badge ${sold?'sold':''}">${sold?'SOLD OUT':escapeHtml(p.badge)}</span>`:sold?'<span class="product-badge sold">SOLD OUT</span>':''}${productImage(p)}</div></a><div class="product-info"><div class="product-category">${escapeHtml(p.category)}</div><a href="product.html?id=${encodeURIComponent(p.id)}"><h3 class="product-name">${escapeHtml(p.name)}</h3></a><div class="product-bottom"><div><span class="product-price">${money(p.price)}</span>${p.oldPrice>p.price?`<span class="old-price">${money(p.oldPrice)}</span>`:''}</div><button class="add-btn" data-add="${escapeHtml(p.id)}" aria-label="Add ${escapeHtml(p.name)} to cart" ${sold?'disabled':''}>${sold?'×':'+'}</button></div><div class="stock-note ${sold?'out':''}">${sold?'Currently unavailable':low?`Only ${p.stock} left`:'In stock'}</div></div></article>`;
}
export function mountLayout(){
 const header=document.getElementById('site-header');
 if(header) header.innerHTML=`<div class="announcement">✨ A little something for your everyday — welcome to KinBo</div><header class="site-header"><nav class="nav container"><a class="logo" href="index.html">Kin<span>Bo</span>.</a><div class="nav-links"><a href="index.html">Home</a><a href="shop.html">Shop</a><a href="about.html">Our story</a><a href="contact.html">Contact</a></div><div class="nav-spacer"></div><label class="nav-search"><input id="global-search" type="search" placeholder="Search products…" aria-label="Search products"></label><a class="cart-link" href="cart.html">🛒 Cart <b data-cart-count>0</b></a><button class="mobile-menu" id="mobile-menu" aria-label="Open menu">☰</button></nav><div class="mobile-nav container" id="mobile-nav"><a href="index.html">Home</a><a href="shop.html">Shop</a><a href="about.html">Our story</a><a href="contact.html">Contact</a></div></header>`;
 const footer=document.getElementById('site-footer');
 if(footer) footer.innerHTML=`<footer class="site-footer"><div class="container"><div class="footer-grid"><div class="footer-brand"><a class="logo" href="index.html">Kin<span>Bo</span>.</a><p>Thoughtfully picked everyday finds. A simple, welcoming place to discover products you’ll love.</p></div><div class="footer-col"><b>Explore</b><a href="shop.html">All products</a><a href="about.html">About KinBo</a><a href="contact.html">Contact us</a></div><div class="footer-col"><b>Customer care</b><a href="policies.html">Shipping & returns</a><a href="cart.html">Your shopping cart</a><a data-whatsapp-link href="#">WhatsApp support</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} KinBo. All rights reserved.</span><span>Made for better everyday shopping.</span></div></div></footer>`;
 const menu=document.getElementById('mobile-menu');
 if(menu) menu.onclick=()=>document.getElementById('mobile-nav').classList.toggle('open');
 const search=document.getElementById('global-search');
 if(search) search.addEventListener('keydown',e=>{if(e.key==='Enter')location.href=`shop.html?q=${encodeURIComponent(search.value)}`});
 updateCartCount();
 document.querySelectorAll('[data-whatsapp-link]').forEach(a=>a.href=`https://wa.me/${STORE.whatsappNumber.replace(/\D/g,'')}`);
}
export function bindAddButtons(root=document){
 root.querySelectorAll('[data-add]').forEach(btn=>btn.addEventListener('click',async e=>{
   const id=e.currentTarget.dataset.add,products=await getProducts(),p=products.find(x=>x.id===id);
   if(!p)return;const result=addToCart(p);toast(result.message);
 }));
}
