import { mountLayout,getProducts,money,productImage,addToCart,toast,escapeHtml } from './store.js';
mountLayout();
const root=document.getElementById('product-detail'),id=new URLSearchParams(location.search).get('id');
try{
 const products=await getProducts(),p=products.find(x=>x.id===id&&x.status==='active');
 if(!p){root.innerHTML='<div class="empty-state">This product could not be found. <a class="text-link" href="shop.html">Back to shop →</a></div>'}
 else{
 document.title=`${p.name} — KinBo`;let qty=1;const sold=p.stock<=0;
 root.innerHTML=`<div class="detail-layout"><div class="detail-image">${productImage(p)}</div><div class="detail-info"><span class="eyebrow">${escapeHtml(p.category)}</span><h1>${escapeHtml(p.name)}</h1><div class="detail-price">${money(p.price)} ${p.oldPrice>p.price?`<span class="old-price">${money(p.oldPrice)}</span>`:''}</div><p class="detail-description">${escapeHtml(p.description)}</p><div class="detail-stock ${sold?'out':''}">${sold?'Currently out of stock':p.stock<=3?`Only ${p.stock} left in stock`:'In stock and ready to order'}</div><div class="quantity-control"><button id="minus" aria-label="Decrease quantity">−</button><span id="qty">1</span><button id="plus" aria-label="Increase quantity">+</button></div><div class="detail-actions"><button class="btn btn-primary" id="add-detail" ${sold?'disabled':''}>Add to cart →</button><a class="btn" style="background:var(--cream)" href="shop.html">Continue shopping</a></div><p class="detail-description" style="margin-top:24px">Delivery charge is calculated at checkout. Your order is confirmed after the shop replies to your WhatsApp message.</p></div></div>`;
 document.getElementById('minus').onclick=()=>{qty=Math.max(1,qty-1);document.getElementById('qty').textContent=qty};document.getElementById('plus').onclick=()=>{qty=Math.min(p.stock||1,qty+1);document.getElementById('qty').textContent=qty};document.getElementById('add-detail').onclick=()=>{const r=addToCart(p,qty);toast(r.message)};
 }
}catch(e){root.innerHTML='<div class="empty-state">Unable to load product details.</div>'}
