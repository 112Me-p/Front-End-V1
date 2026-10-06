(()=>{
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const MENU=[
    {id:'rice-boiled',cat:'rice',no:'01',name:'ข้าวมันไก่ต้ม',desc:'ไก่ต้มเนื้อนุ่ม ข้าวมันหอม เสิร์ฟพร้อมน้ำราดสิงคโปร์',kicker:'SIGNATURE RICE',options:[{id:'normal',label:'ธรรมดา',price:50},{id:'special',label:'พิเศษ',price:60}]},
    {id:'rice-fried',cat:'rice',no:'02',name:'ข้าวไก่ทอด',desc:'ไก่ทอดกรอบด้านนอก เนื้อยังฉ่ำ กินกับข้าวมันและน้ำราด',kicker:'CRISPY',options:[{id:'normal',label:'ธรรมดา',price:50},{id:'special',label:'พิเศษ',price:60}]},
    {id:'rice-offal',cat:'rice',no:'03',name:'ข้าวมันเครื่องใน',desc:'เครื่องในและข้าวมัน สำหรับคนชอบรสและสัมผัสที่เข้มขึ้น',kicker:'HOUSE FAVORITE',options:[{id:'normal',label:'ธรรมดา',price:50},{id:'special',label:'พิเศษ',price:60}]},
    {id:'chicken-boiled',cat:'chicken',no:'04',name:'ไก่สิงคโปร์ตอน',desc:'ไก่ตอนสับเป็นจาน เหมาะแชร์ เพิ่มข้าวมันแยกได้ภายหลัง',kicker:'SHARE PLATE',options:[{id:'s',label:'S',price:80},{id:'m',label:'M',price:100},{id:'l',label:'L',price:120}]},
    {id:'chicken-fried',cat:'chicken',no:'05',name:'ไก่ทอดตอน',desc:'ไก่ทอดสับเป็นจาน กรอบ หอม เหมาะกินร่วมกัน',kicker:'CRISPY SHARE',options:[{id:'s',label:'S',price:70},{id:'m',label:'M',price:90},{id:'l',label:'L',price:110}]}
  ];
  const state={filter:'all',cart:JSON.parse(localStorage.getItem('kubban-cart')||'[]'),active:MENU[0]};
  function money(n){return `฿${n.toLocaleString('th-TH')}`}
  function renderMenu(){
    const root=$('#menuList'); const items=MENU.filter(m=>state.filter==='all'||m.cat===state.filter);
    root.innerHTML=items.map(m=>`<article class="menu-item ${state.active.id===m.id?'is-active':''}" data-item="${m.id}"><div class="menu-no">${m.no}</div><div class="menu-copy"><strong>${m.name}</strong><p>${m.desc}</p></div><div class="option-row">${m.options.map(o=>`<button class="option-btn" data-add="${m.id}" data-option="${o.id}">${o.label}<b>${money(o.price)}</b></button>`).join('')}</div></article>`).join('');
    $$('[data-item]',root).forEach(el=>el.addEventListener('mouseenter',()=>setVisual(el.dataset.item)));
    $$('[data-add]',root).forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();addItem(btn.dataset.add,btn.dataset.option)}));
  }
  function setVisual(id){
    const m=MENU.find(x=>x.id===id); if(!m)return; state.active=m;
    $('#visualKicker').textContent=m.kicker; $('#visualName').textContent=m.name; $('#visualDesc').textContent=m.desc; $('#visualPrice').textContent=money(Math.min(...m.options.map(o=>o.price)));
    renderMenu();
  }
  function addItem(id,optId,qty=1){
    const m=MENU.find(x=>x.id===id),o=m?.options.find(x=>x.id===optId);if(!m||!o)return;
    const key=`${id}:${optId}`,existing=state.cart.find(x=>x.key===key); if(existing)existing.qty+=qty;else state.cart.push({key,id,optId,qty}); persist(); showToast(`เพิ่ม ${m.name} ${o.label} แล้ว`);
  }
  function preset(type){
    if(type==='solo')addItem('rice-boiled','normal');
    if(type==='hungry')addItem('rice-boiled','special');
    if(type==='fried')addItem('rice-fried','special');
    if(type==='two'){addItem('chicken-boiled','m');showToast('เพิ่มไก่สิงคโปร์ M แล้ว — เพิ่มข้าวมันแยกได้ภายหลัง');}
    openCart();
  }
  function lineData(item){const m=MENU.find(x=>x.id===item.id),o=m.options.find(x=>x.id===item.optId);return {m,o,total:o.price*item.qty}}
  function persist(){localStorage.setItem('kubban-cart',JSON.stringify(state.cart));renderCart()}
  function renderCart(){
    const root=$('#cartItems'),empty=$('#cartEmpty'); let qty=0,total=0;
    root.innerHTML=state.cart.map(item=>{const {m,o,total:sub}=lineData(item);qty+=item.qty;total+=sub;return `<div class="cart-line"><div><strong>${m.name}</strong><small>${o.label} · ${money(o.price)}</small><button class="remove" data-remove="${item.key}">ลบรายการ</button></div><div class="qty"><button data-qty="${item.key}" data-delta="-1">−</button><b>${item.qty}</b><button data-qty="${item.key}" data-delta="1">+</button></div></div>`}).join('');
    empty.style.display=state.cart.length?'none':'flex'; $('#summaryQty').textContent=`${qty} รายการ`;$('#summaryTotal').textContent=money(total);$('#cartCountTop').textContent=qty;$('#cartCountMobile').textContent=qty;$('#cartTotalMobile').textContent=money(total);
    $$('[data-qty]',root).forEach(b=>b.addEventListener('click',()=>changeQty(b.dataset.qty,Number(b.dataset.delta))));$$('[data-remove]',root).forEach(b=>b.addEventListener('click',()=>removeItem(b.dataset.remove)));
  }
  function changeQty(key,d){const i=state.cart.find(x=>x.key===key);if(!i)return;i.qty+=d;if(i.qty<=0)state.cart=state.cart.filter(x=>x.key!==key);persist()}
  function removeItem(key){state.cart=state.cart.filter(x=>x.key!==key);persist()}
  function orderText(){
    if(!state.cart.length)return 'ยังไม่มีรายการสั่งซื้อ'; let total=0;
    const lines=state.cart.map((item,i)=>{const {m,o,total:sub}=lineData(item);total+=sub;return `${i+1}. ${m.name} (${o.label}) x${item.qty} = ${money(sub)}`});
    const note=$('#orderNote').value.trim(); return `ออเดอร์ “กลับบ้านข้าวมันไก่”\n${lines.join('\n')}\nรวม ${money(total)}${note?`\nหมายเหตุ: ${note}`:''}`;
  }
  function openCart(){$('#cartDrawer').classList.add('open');$('#drawerBackdrop').classList.add('show');$('#cartDrawer').setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
  function closeCart(){$('#cartDrawer').classList.remove('open');$('#drawerBackdrop').classList.remove('show');$('#cartDrawer').setAttribute('aria-hidden','true');document.body.style.overflow=''}
  function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>t.classList.remove('show'),1900)}
  function bind(){
    $$('[data-scroll]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.scroll)?.scrollIntoView({behavior:'smooth'})));
    $$('.menu-filter button').forEach(b=>b.addEventListener('click',()=>{state.filter=b.dataset.filter;$$('.menu-filter button').forEach(x=>x.classList.toggle('is-active',x===b));renderMenu()}));
    $$('.quick-card').forEach(b=>b.addEventListener('click',()=>preset(b.dataset.preset)));
    $$('[data-add]').forEach(b=>b.addEventListener('click',()=>addItem(b.dataset.add,b.dataset.option)));
    ['#openCartTop','#openCartBottom','#mobileCart','#quickOrderTop'].forEach(s=>$(s)?.addEventListener('click',openCart));
    $('#closeCart').addEventListener('click',closeCart);$('#drawerBackdrop').addEventListener('click',closeCart);
    $('#copyOrder').addEventListener('click',()=>{const txt=orderText();navigator.clipboard?.writeText(txt).then(()=>showToast('คัดลอกออเดอร์แล้ว')).catch(()=>prompt('คัดลอกข้อความนี้',txt))});
    $('#lineOrder').addEventListener('click',()=>{if(!state.cart.length){showToast('เลือกเมนูก่อน');return;}const txt=orderText();window.open(`https://line.me/R/msg/text/?${encodeURIComponent(txt)}`,'_blank')});
    $('#copyMenuLink').addEventListener('click',()=>navigator.clipboard?.writeText(location.href).then(()=>showToast('คัดลอกลิงก์แล้ว')));
    $('#sauceRange').addEventListener('input',e=>{const v=Number(e.target.value);$('#sauceValue').textContent=v+'%';$('#sauceTint').style.opacity=(.12+v/150).toFixed(2);});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCart()});
  }
  function init(){renderMenu();renderCart();bind();if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{})}
  document.addEventListener('DOMContentLoaded',init);
})();
