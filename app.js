import { mountLayout,getProducts,productCard,bindAddButtons } from './store.js';
mountLayout();
const root=document.getElementById('featured-products');
if(root){try{const products=await getProducts();const featured=products.filter(p=>p.status==='active'&&p.featured).slice(0,4);root.innerHTML=featured.length?featured.map(productCard).join(''):'<div class="empty-state">New products are coming soon.</div>';bindAddButtons(root)}catch(e){root.innerHTML='<div class="empty-state">Products could not be loaded. Check data/products.json.</div>'}}
