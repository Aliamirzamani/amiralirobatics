const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function show(id){$$('section').forEach(s=>s.classList.toggle('on',s.id===id));$$('nav button').forEach(b=>b.classList.toggle('on',b.dataset.s===id));scrollTo(0,0)}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2300)}
$$('nav button').forEach(b=>b.onclick=()=>show(b.dataset.s));
$('#footerHelp').onclick=()=>tour(0);
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g)show(g.dataset.go);const t=e.target.closest('[data-toast]');if(t)toast(t.dataset.toast)});
const C=[['رباتیک مقدماتی','جلسه ۶ از ۱۰',60,'','کلاس آنلاین: پنجشنبه ۱۷:۰۰'],['برنامه‌نویسی آردوینو','جلسه ۲ از ۸',25,'b','جلسهٔ بعد: ۱۲ مهر باز می‌شود']];
$('#cs').innerHTML=C.map(c=>`<div class="card"><div class="ico ${c[3]}">🎓</div><h3>${c[0]}</h3><p>${c[1]}</p><div class="bar ${c[3]}"><i style="width:${c[2]}%"></i></div><div class="row"><span class="chip ${c[3]||''}">${c[4]}</span></div></div>`).join('');
const Q=[['مسیریاب ماهر','ربات را از مسیر پرپیچ‌وخم عبور بده',70,'p','🧭'],['تکلیف سنسور نور','فایل پروژه را بارگذاری کن · مهلت: ۳ روز',35,'b','📎'],['رقص ربات','یک برنامه ۱۰ بلوکی بنویس',10,'','💃']];
$('#qs').innerHTML=Q.map(q=>`<div class="card"><div class="ico ${q[3]}">${q[4]}</div><h3>${q[0]}</h3><p>${q[1]}</p><div class="bar ${q[3]}"><i style="width:${q[2]}%"></i></div><div class="row"><b>${q[2]}٪</b><a class="btn o" href="learner.html">ورود به فضای هنرجو</a></div></div>`).join('');
const K=[
 {id:'robot-arm',name:'کیت بازوی رباتیک',icon:'🦾',price:1280000,type:'hw',color:'var(--gs)'},
 {id:'sensors',name:'کیت سنسورها',icon:'📡',price:890000,type:'hw',color:'var(--bs)'},
 {id:'arduino-video',name:'دوره آردوینو (ویدیو)',icon:'💻',price:690000,type:'dg',color:'var(--ps)'},
 {id:'line-follower',name:'پکیج پروژه‌های مسیریاب',icon:'📦',price:390000,type:'dg',color:'#fff1c9'}
];
const money=n=>new Intl.NumberFormat('fa-IR').format(n)+' تومان';
let selectedFilter='all';
let cart=readCart();
function readCart(){try{const saved=JSON.parse(localStorage.getItem('amirali-cart')||'[]');return Array.isArray(saved)?saved.filter(item=>K.some(product=>product.id===item.id)&&Number.isInteger(item.qty)&&item.qty>0&&item.qty<=20):[]}catch{return []}}
function saveCart(){try{localStorage.setItem('amirali-cart',JSON.stringify(cart))}catch{}}
function renderCart(){const count=cart.reduce((sum,item)=>sum+item.qty,0),total=cart.reduce((sum,item)=>sum+item.qty*K.find(product=>product.id===item.id).price,0);$('#cartCount').textContent=FA(count);$('#cartBtn').setAttribute('aria-label',`سبد خرید، ${FA(count)} کالا`);$('#cartEmpty').hidden=count>0;$('#cartSummary').hidden=count===0;$('#cartItems').innerHTML=cart.map(item=>{const product=K.find(entry=>entry.id===item.id);return `<article class="cart-item"><div class="cart-item-icon">${product.icon}</div><div class="cart-item-info"><b>${product.name}</b><span>${money(product.price)}</span><div class="quantity"><button data-cart-action="dec" data-id="${product.id}" aria-label="کم‌کردن ${product.name}">−</button><span>${FA(item.qty)}</span><button data-cart-action="inc" data-id="${product.id}" aria-label="زیادکردن ${product.name}">+</button><button class="remove-item" data-cart-action="remove" data-id="${product.id}">حذف</button></div></div></article>`}).join('');$('#cartTotal').textContent=money(total)}
function addToCart(id){const item=cart.find(entry=>entry.id===id);if(item){if(item.qty>=20){toast('حداکثر ۲۰ عدد از هر کالا می‌توانی انتخاب کنی');return}item.qty++}else cart.push({id,qty:1});saveCart();renderCart();toast('کالا به سبد خرید اضافه شد')}
function kits(){const query=$('#shopSearch').value.trim().toLocaleLowerCase('fa');const matches=K.filter(product=>(selectedFilter==='all'||product.type===selectedFilter)&&product.name.toLocaleLowerCase('fa').includes(query));$('#kits').innerHTML=matches.length?matches.map(product=>`<article class="card product-card"><div class="kit" style="background:${product.color}">${product.icon}</div><h3>${product.name}</h3><p class="price">${money(product.price)}</p><button class="btn p" data-add="${product.id}">افزودن به سبد</button></article>`).join(''):'<div class="empty-search">چیزی پیدا نشد؛ عبارت دیگری جست‌وجو کن.</div>';$('#clearSearch').hidden=!query}
kits();renderCart();
$$('.tabs button').forEach(b=>b.onclick=()=>{$$('.tabs button').forEach(x=>x.classList.toggle('on',x===b));selectedFilter=b.dataset.f;kits()});
$('#shopSearch').oninput=kits;$('#clearSearch').onclick=()=>{$('#shopSearch').value='';kits();$('#shopSearch').focus()};
$('#kits').onclick=e=>{const button=e.target.closest('[data-add]');if(button)addToCart(button.dataset.add)};
$('#cartBtn').onclick=()=>{renderCart();$('#cartOverlay').classList.add('open');$('#cartOverlay').setAttribute('aria-hidden','false');$('#cartBtn').setAttribute('aria-expanded','true');$('#cartClose').focus()};
function closeCart(){$('#cartOverlay').classList.remove('open');$('#cartOverlay').setAttribute('aria-hidden','true');$('#cartBtn').setAttribute('aria-expanded','false');$('#cartBtn').focus()}
$('#cartClose').onclick=closeCart;$('#cartOverlay').onclick=e=>{if(e.target===$('#cartOverlay'))closeCart()};
$('#cartItems').onclick=e=>{const button=e.target.closest('[data-cart-action]');if(!button)return;const item=cart.find(entry=>entry.id===button.dataset.id);if(!item)return;if(button.dataset.cartAction==='inc'&&item.qty<20)item.qty++;if(button.dataset.cartAction==='dec')item.qty--;if(button.dataset.cartAction==='remove'||item.qty<=0)cart=cart.filter(entry=>entry.id!==button.dataset.id);saveCart();renderCart()};
$('#browseShop').onclick=()=>{closeCart();show('shop')};$('#checkoutBtn').onclick=()=>toast('پرداخت آنلاین هنوز فعال نشده است');
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#cartOverlay').classList.contains('open'))closeCart()});

const P=n=>String(n).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
function FA(n){return String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d])}
const st={name:'',phone:'',qi:0,ans:[],lvl:null,plan:null};
const FLOW=['signup','quiz','result','plans'];
const _show=show;
show=function(id){document.body.classList.toggle('flow',FLOW.includes(id));_show(id)};
$$('.stp').forEach(o=>{const n=+o.dataset.n;o.innerHTML=['ثبت‌نام','آزمون','نتیجه','پلن'].map((t,i)=>`<li class="${i<n?'done':i==n?'on':''}">${t}</li>`).join('')});
$('#goQuiz').onclick=()=>{const n=$('#fn').value.trim(),p=P($('#ph').value.trim()).replace(/[\s-]/g,'');let ok=true;
 $('#e1').textContent=n.length<2?'نام را وارد کن (حداقل ۲ حرف).':'';$('#fn').classList.toggle('bad',n.length<2);if(n.length<2)ok=false;
 const pv=/^09\d{9}$/.test(p);$('#e2').textContent=pv?'':'شماره باید ۱۱ رقم و با ۰۹ شروع شود.';$('#ph').classList.toggle('bad',!pv);if(!pv)ok=false;
 if(!ok)return;st.name=n;st.phone=p;$$('.nm').forEach(e=>e.textContent=n.split(' ')[0]);st.qi=0;st.ans=[];drawQ();show('quiz')};
const QZ=[
['کدام قطعه مثل «چشم» ربات کار می‌کند؟',['سنسور','موتور','باتری','نمی‌دانم'],0],
['موتور در ربات چه کاری انجام می‌دهد؟',['می‌بیند','حرکت ایجاد می‌کند','فکر می‌کند','نمی‌دانم'],1],
['به دستور «این کار را ۵ بار تکرار کن» در برنامه‌نویسی چه می‌گویند؟',['شرط','متغیر','حلقه','نمی‌دانم'],2],
['«اگر مانع بود، بپیچ» نمونهٔ کدام مفهوم است؟',['شرط','حلقه','تابع','نمی‌دانم'],0],
['برد آردوینو در ربات چه نقشی دارد؟',['بدنه','مغز و کنترل‌کننده','چرخ','نمی‌دانم'],1],
['ربات مسیریاب برای دنبال‌کردن خط سیاه از چه سنسوری استفاده می‌کند؟',['فاصله‌سنج صوتی','سنسور دما','سنسور نور یا مادون قرمز','نمی‌دانم'],2]];
function drawQ(){const q=QZ[st.qi],a=st.ans[st.qi];$('#qn').textContent=`سؤال ${FA(st.qi+1)} از ${FA(QZ.length)}`;$('#qb').style.width=(st.qi/QZ.length*100)+'%';$('#qt').textContent=q[0];
 $('#qo').innerHTML=q[1].map((o,i)=>`<button class="opt ${a===i?'sel':''}" role="radio" aria-checked="${a===i}" data-i="${i}">${o}</button>`).join('');
 $('#qnext').disabled=a===undefined;$('#qnext').textContent=st.qi==QZ.length-1?'دیدن نتیجه':'بعدی';$('#qback').style.visibility=st.qi?'visible':'hidden'}
$('#qo').onclick=e=>{const b=e.target.closest('.opt');if(!b)return;st.ans[st.qi]=+b.dataset.i;drawQ()};
$('#qback').onclick=()=>{st.qi--;drawQ()};
$('#qnext').onclick=()=>{if(st.qi<QZ.length-1){st.qi++;drawQ();return}
 const sc=st.ans.filter((a,i)=>a===QZ[i][2]).length;st.lvl=sc<=2?0:sc<=4?1:2;const L=LV[st.lvl];
 $('#rI').textContent=L.i;$('#rL').textContent='سطح '+L.n;$('#rS').textContent=`${FA(sc)} از ${FA(QZ.length)}`;$('#rD').textContent=L.d;$('#rP').textContent='پلن '+PL[st.lvl].n+' '+PL[st.lvl].i;show('result')};
const LV=[{n:'مبتدی',i:'🌱',d:'با مفاهیم پایه شروع می‌کنیم: قطعات، سنسور و اولین برنامه.'},{n:'متوسط',i:'🚀',d:'پایه را داری. وقت ساخت پروژه و برنامه‌نویسی شرط و حلقه است.'},{n:'پیشرفته',i:'🏆',d:'عالی! سراغ پروژه‌های سخت و مسابقه می‌رویم.'}];
const PL=[
{n:'برنز',i:'🥉',c:'#f3d9c2',p:'۴۹۰٬۰۰۰',s:'آموزش ویدیویی',f:['آموزش ویدیویی کامل','تمرین‌ها و ماموریت‌های آموزشی','گزارش ماهانه برای والدین']},
{n:'نقره',i:'🥈',c:'#e3e8f0',p:'۹۹۰٬۰۰۰',s:'ویدیو + ۲ جلسهٔ آنلاین',f:['آموزش ویدیویی کامل','۲ جلسهٔ آنلاین آموزش و رفع اشکال','تمرین‌ها و ماموریت‌های آموزشی','گزارش هفتگی برای والدین']},
{n:'طلا',i:'🥇',c:'#ffe9a8',p:'۱٬۷۹۰٬۰۰۰',s:'ویدیو + ۴ جلسهٔ آنلاین',f:['آموزش ویدیویی کامل','۴ جلسهٔ آنلاین آموزش و رفع اشکال','تمرین‌ها و ماموریت‌های آموزشی','گزارش هفتگی برای والدین']}];
function drawPlans(){$('#pg').innerHTML=PL.map((p,i)=>`<div class="card plan ${st.lvl===i?'rec':''}">${st.lvl===i?'<span class="chip p">پیشنهاد ما برای تو</span>':''}<div class="row" style="justify-content:flex-start;gap:12px"><div class="medal" style="background:${p.c};margin:0">${p.i}</div><h3 style="font-size:20px">پلن ${p.n}</h3></div><p class="big" style="font-size:28px;margin:6px 0 0">${p.p} <small style="font-size:13px;font-weight:400">تومان / ماه</small></p><ul>${p.f.map(x=>`<li>${x}</li>`).join('')}</ul><button class="btn ${st.lvl===i?'p':'o'}" data-pick="${i}" style="width:100%">انتخاب پلن ${p.n}</button></div>`).join('')}
drawPlans();
const _s2=show;show=function(id){if(id==='plans')drawPlans();_s2(id)};
$('#pg').onclick=e=>{const b=e.target.closest('[data-pick]');if(!b)return;st.plan=+b.dataset.pick;$('#pl').textContent=PL[st.plan].n+' '+PL[st.plan].i;
 if(st.lvl!==null){$('#lv').textContent=LV[st.lvl].n+' '+LV[st.lvl].i;$('#mineBtn').textContent='تغییر پلن';$('#mineBtn').dataset.go='plans'}
 show('plans');toast('پلن انتخاب شد؛ برای فعال‌سازی باید پرداخت آنلاین راه‌اندازی شود')};
$('#result').addEventListener('click',()=>{if(st.lvl!==null){$('#lv').textContent=LV[st.lvl].n+' '+LV[st.lvl].i;$('#mineBtn').textContent='تغییر پلن';$('#mineBtn').dataset.go='plans'}});
function localStorage_ok(k){try{if(localStorage.getItem(k))return true;localStorage.setItem(k,1)}catch(e){}return false}
const TS=[['🧭','منوی بخش‌ها','از منوی بالا به خانه، دوره‌ها، مقاله‌ها و پروژه‌ها برو؛ درباره و تماس هم در یک بخش هستند.'],['🛒','سبد خرید','در فروشگاه کالاها را اضافه کن، تعدادشان را تغییر بده و جمع قیمت را ببین.'],['🔍','جست‌وجوی فروشگاه','نام کیت یا دوره را جست‌وجو کن یا دسته‌بندی را فیلتر کن.'],['ⓘ','راهنما و اطلاعات','هر وقت لازم داشتی، از دکمهٔ راهنما یا پیوند فوتر استفاده کن.']];
let ti=0;function tour(i){ti=i;const t=TS[i];$('#tI').textContent=t[0];$('#tT').textContent=t[1];$('#tD').textContent=t[2];$('#tS').textContent=`${FA(i+1)} از ${FA(TS.length)}`;$('#tN').textContent=i==TS.length-1?'فهمیدم':'بعدی';$('#tour').classList.add('on');$('#tN').focus()}
$('#tN').onclick=()=>ti<TS.length-1?tour(ti+1):$('#tour').classList.remove('on');
$('#tX').onclick=()=>$('#tour').classList.remove('on');$('#helpBtn').onclick=()=>tour(0);
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#tour').classList.remove('on')});
$('#hp').innerHTML=PL.map(p=>`<div class="card hp" data-go="signup"><div class="medal" style="background:${p.c}">${p.i}</div><h3>پلن ${p.n}</h3><p class="price" style="margin:0">${p.p} تومان / ماه</p><p style="margin:4px 0 0">${p.s}</p></div>`).join('');

async function loadPublishedCourses(){
 try{
  const response=await fetch('/api/courses',{cache:'no-store'});
  if(!response.ok)return;
  const {courses=[]}=await response.json();
  if(!courses.length)return;
  const courseCards=courses.map(course=>`<article class="card course-card"><div class="ico b">⚙️</div><span class="chip b">${escapeCourseText(course.level||'مقدماتی')}</span><h2>${escapeCourseText(course.title)}</h2><p>${escapeCourseText(course.description||'اطلاعات بیشتر به‌زودی اضافه می‌شود.')}</p></article>`).join('');
  $('#publicCourses').innerHTML=courseCards;
  $('#courseCatalog').innerHTML=courseCards;
  $('#publicCourseBlock').hidden=false;
 }catch{}
}
function escapeCourseText(value){return String(value).replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]))}
loadPublishedCourses();
