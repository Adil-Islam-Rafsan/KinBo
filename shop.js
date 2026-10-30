import { mountLayout,getProducts,productCard,bindAddButtons } from './store.js';
mountLayout();
const root=document.getElementById('shop-products'),filters=document.getElementById('category-filters'),count=document.getElementById('shop-count'),sort=document.getElementById('sort-products');
let all=[],category=new URLSearchParams(location.search).get('category')||'All',query=new URLSearchParams(location.search).get('q')||'';
function render(){
 let list=all.filter(p=>p.status==='active'&&(category==='All'||p.category===category)&&(`${p.name} ${p.category} ${p.description}`).toLowerCase().includes(query.toLowerCase()));
 if(sort.value==='price-low')list.sort((a,b)=>a.price-b.price);if(sort.value==='price-high')list.sort((a,b)=>b.price-a.price);if(sort.value==='name')list.sort((a,b)=>a.name.localeCompare(b.name));
 count.textContent=`Showing ${list.length} product${list.length===1?'':'s'}`;
 root.innerHTML=list.length?list.map(productCard).join(''):'<div class="empty-state">No products found. Try another category or search.</div>';bindAddButtons(root);
 filters.querySelectorAll('[data-category]').forEach(b=>b.classList.toggle('active',b.dataset.category===category));
}
try{all=await getProducts();const cats=['All',...new Set(all.map(p=>p.category))];filters.innerHTML=cats.map(c=>`<button class="filter-pill" data-category="${c}">${c==='All'?'All products':c}</button>`).join('');filters.onclick=e=>{const b=e.target.closest('[data-category]');if(!b)return;category=b.dataset.category;render()};sort.onchange=render;render();}catch(e){root.innerHTML='<div class="empty-state">Could not load products. Check data/products.json.</div>'}
