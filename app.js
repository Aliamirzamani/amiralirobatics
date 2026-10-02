const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function show(id){$$('section').forEach(s=>s.classList.toggle('on',s.id===id));$$('nav button').forEach(b=>b.classList.toggle('on',b.dataset.s===id));scrollTo(0,0)}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2300)}
$$('nav button').forEach(b=>b.onclick=()=>show(b.dataset.s));
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g)show(g.dataset.go);const t=e.target.closest('[data-toast]');if(t)toast(t.dataset.toast)});
function pose(){$('#a1').setAttribute('transform',`translate(160 205) rotate(${$('#r1').value})`);$('#a2').setAttribute('transform',`translate(0 -78) rotate(${$('#r2').value})`);const o=8+$('#r3').value/100*14;$('#claw').setAttribute('d',`M${-o} -4 L${-o} -22 M${o} -4 L${o} -22 M${-o} -4 H${o}`)}
['r1','r2','r3'].forEach(i=>$('#'+i).oninput=pose);
$('#rst').onclick=()=>{$('#r1').value=0;$('#r2').value=0;$('#r3').value=50;pose()};
$('#chk').onclick=()=>{const ok=Math.abs($('#r1').value-40)<15&&$('#r3').value<30;$('#simst').textContent=ok?'کامل شد · ۵۰+ امتیاز':'دوباره امتحان کن';toast(ok?'آفرین! مکعب برداشته شد':'پایه را به راست بچرخان و گیره را ببند')};
const C=[['رباتیک مقدماتی','جلسه ۶ از ۱۰',60,'','کلاس آنلاین: پنجشنبه ۱۷:۰۰'],['برنامه‌نویسی آردوینو','جلسه ۲ از ۸',25,'b','جلسهٔ بعد: ۱۲ مهر باز می‌شود']];
$('#cs').innerHTML=C.map(c=>`<div class="card"><div class="ico ${c[3]}">🎓</div><h3>${c[0]}</h3><p>${c[1]}</p><div class="bar ${c[3]}"><i style="width:${c[2]}%"></i></div><div class="row"><span class="chip ${c[3]||''}">${c[4]}</span></div></div>`).join('');
const Q=[['مسیریاب ماهر','ربات را از مسیر پرپیچ‌وخم عبور بده',70,'p','🧭'],['تکلیف سنسور نور','فایل پروژه را بارگذاری کن · مهلت: ۳ روز',35,'b','📎'],['رقص ربات','یک برنامه ۱۰ بلوکی بنویس',10,'','💃']];
$('#qs').innerHTML=Q.map(q=>`<div class="card"><div class="ico ${q[3]}">${q[4]}</div><h3>${q[0]}</h3><p>${q[1]}</p><div class="bar ${q[3]}"><i style="width:${q[2]}%"></i></div><div class="row"><b>${q[2]}٪</b><button class="btn o" data-go="sim">ادامه</button></div></div>`).join('');
const K=[['کیت بازوی رباتیک','🦾','۱٬۲۸۰٬۰۰۰','hw','var(--gs)'],['کیت سنسورها','📡','۸۹۰٬۰۰۰','hw','var(--bs)'],['دوره آردوینو (ویدیو)','💻','۶۹۰٬۰۰۰','dg','var(--ps)'],['پکیج پروژه‌های مسیریاب','📦','۳۹۰٬۰۰۰','dg','#fff1c9']];
function kits(f){$('#kits').innerHTML=K.filter(k=>f=='all'||k[3]==f).map(k=>`<div class="card"><div class="kit" style="background:${k[4]}">${k[1]}</div><h3>${k[0]}</h3><p class="price">${k[2]} تومان</p><button class="btn p" data-toast="${k[0]} به سبد اضافه شد">افزودن به سبد</button></div>`).join('')}
kits('all');
$$('.tabs button').forEach(b=>b.onclick=()=>{$$('.tabs button').forEach(x=>x.classList.toggle('on',x===b));kits(b.dataset.f)});

const P=n=>String(n).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const FA=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
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
{n:'برنز',i:'🥉',c:'#f3d9c2',p:'۴۹۰٬۰۰۰',s:'آموزش ویدیویی',f:['آموزش ویدیویی کامل','ماموریت‌ها و شبیه‌ساز','گزارش ماهانه برای والدین']},
{n:'نقره',i:'🥈',c:'#e3e8f0',p:'۹۹۰٬۰۰۰',s:'ویدیو + ۲ جلسهٔ آنلاین',f:['آموزش ویدیویی کامل','۲ جلسهٔ آنلاین آموزش و رفع اشکال','ماموریت‌ها و شبیه‌ساز','گزارش هفتگی برای والدین']},
{n:'طلا',i:'🥇',c:'#ffe9a8',p:'۱٬۷۹۰٬۰۰۰',s:'ویدیو + ۴ جلسهٔ آنلاین',f:['آموزش ویدیویی کامل','۴ جلسهٔ آنلاین آموزش و رفع اشکال','ماموریت‌ها و شبیه‌ساز','گزارش هفتگی برای والدین']}];
function drawPlans(){$('#pg').innerHTML=PL.map((p,i)=>`<div class="card plan ${st.lvl===i?'rec':''}">${st.lvl===i?'<span class="chip p">پیشنهاد ما برای تو</span>':''}<div class="row" style="justify-content:flex-start;gap:12px"><div class="medal" style="background:${p.c};margin:0">${p.i}</div><h3 style="font-size:20px">پلن ${p.n}</h3></div><p class="big" style="font-size:28px;margin:6px 0 0">${p.p} <small style="font-size:13px;font-weight:400">تومان / ماه</small></p><ul>${p.f.map(x=>`<li>${x}</li>`).join('')}</ul><button class="btn ${st.lvl===i?'p':'o'}" data-pick="${i}" style="width:100%">انتخاب پلن ${p.n}</button></div>`).join('')}
drawPlans();
const _s2=show;show=function(id){if(id==='plans')drawPlans();_s2(id)};
$('#pg').onclick=e=>{const b=e.target.closest('[data-pick]');if(!b)return;st.plan=+b.dataset.pick;$('#pl').textContent=PL[st.plan].n+' '+PL[st.plan].i;
 if(st.lvl!==null){$('#lv').textContent=LV[st.lvl].n+' '+LV[st.lvl].i;$('#mineBtn').textContent='تغییر پلن';$('#mineBtn').dataset.go='plans'}
 show('quest');toast('پلن '+PL[st.plan].n+' فعال شد');if(!localStorage_ok('seen'))setTimeout(()=>tour(0),600)};
$('#result').addEventListener('click',()=>{if(st.lvl!==null){$('#lv').textContent=LV[st.lvl].n+' '+LV[st.lvl].i;$('#mineBtn').textContent='تغییر پلن';$('#mineBtn').dataset.go='plans'}});
function localStorage_ok(k){try{if(localStorage.getItem(k))return true;localStorage.setItem(k,1)}catch(e){}return false}
const TS=[['🧭','نوار پایین: بخش‌های اصلی','با پنج دکمهٔ پایین صفحه بین خانه، شبیه‌ساز، دوره‌ها، والدین و فروشگاه جابه‌جا شو.'],['🕹️','شبیه‌ساز: لغزنده‌ها','لغزنده‌ها ربات را حرکت می‌دهند. بعد «بررسی حرکت» را بزن تا امتیاز بگیری.'],['🎓','دوره‌ها: ادامه بده','هر دوره و تکلیف دکمهٔ «ادامه» دارد. با دکمهٔ «تغییر پلن» پلن‌ات را عوض کن.'],['❓','دکمهٔ ؟ بالای صفحه','هر وقت گیج شدی، این دکمه راهنما را دوباره باز می‌کند.']];
let ti=0;function tour(i){ti=i;const t=TS[i];$('#tI').textContent=t[0];$('#tT').textContent=t[1];$('#tD').textContent=t[2];$('#tS').textContent=`${FA(i+1)} از ${FA(TS.length)}`;$('#tN').textContent=i==TS.length-1?'فهمیدم':'بعدی';$('#tour').classList.add('on');$('#tN').focus()}
$('#tN').onclick=()=>ti<TS.length-1?tour(ti+1):$('#tour').classList.remove('on');
$('#tX').onclick=()=>$('#tour').classList.remove('on');$('#helpBtn').onclick=()=>tour(0);
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#tour').classList.remove('on')});
$('#hp').innerHTML=PL.map(p=>`<div class="card hp" data-go="signup"><div class="medal" style="background:${p.c}">${p.i}</div><h3>پلن ${p.n}</h3><p class="price" style="margin:0">${p.p} تومان / ماه</p><p style="margin:4px 0 0">${p.s}</p></div>`).join('');
