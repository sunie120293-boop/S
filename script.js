
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>우리 반 1인 1역할</title>
<style>
:root{--p:#7558d2;--bg:#f7f7ff;--line:#e5e2f3;--ink:#28304a}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 Arial,'Malgun Gothic',sans-serif}
header{background:linear-gradient(120deg,#7052ca,#aa91ec);color:white;padding:23px max(18px,calc((100% - 1100px)/2)) 0}
h1{margin:0 0 4px;font-size:28px}
header p{margin:0 0 18px}
.tabs{display:flex;flex-wrap:wrap;gap:6px}
.tabs button{border:0;background:#ffffff32;color:white;border-radius:10px 10px 0 0;padding:12px;font-weight:bold}
.tabs button.active{background:var(--bg);color:#6047b4}
main{max-width:1100px;padding:20px 14px 60px;margin:auto}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:15px}
.stat,.panel,.role{background:white;border:1px solid var(--line);border-radius:16px;padding:17px}
.stat b{display:block;font-size:26px;color:var(--p)}
.stat small{color:#6b7390}
.panel{margin-bottom:15px}
h2{margin:0 0 12px}
h3{margin:8px 0 4px}
.muted{color:#69728a;font-size:14px}
.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.emoji{font-size:34px}
.role p{margin:5px 0;color:#69728a;font-size:13px;min-height:38px}
.role small{font-weight:bold;color:#5d52a1}
.row{display:flex;gap:9px;flex-wrap:wrap;align-items:center;margin:10px 0}
.field{display:flex;flex-direction:column;gap:4px;margin:10px 0}
.field label{font-weight:bold;font-size:14px}
input,select,textarea{width:100%;padding:10px;border:1px solid #d9d8ea;border-radius:9px;font:inherit;background:white}
textarea{resize:vertical}
.btn{border:0;border-radius:10px;padding:10px 15px;background:var(--p);color:white;font:inherit;font-weight:bold;cursor:pointer}
.btn.alt{background:#eae4ff;color:#5740ac}
.btn.red{background:#fbe6e9;color:#a6294c}
.btn:disabled{opacity:.5;cursor:default}
.btn:hover:not(:disabled){filter:brightness(.95)}
.editing{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.edit{padding:12px;border:1px solid var(--line);border-radius:12px;background:#fdfcff}
.edit .inputs{display:grid;grid-template-columns:66px 1fr 85px;gap:6px}
.edit .inputs input:first-child{text-align:center;font-size:25px}
.edit .inputs input:last-child{max-width:85px}
.edit textarea{margin-top:6px}
.edit .row{margin:6px 0}
.scroll{overflow-x:auto}
table{width:100%;border-collapse:collapse;min-width:510px}
th,td{padding:10px;border-bottom:1px solid #e9e7f1;text-align:left}
th{background:#f0edfb}
.hint{background:#f0edff;padding:12px;border-radius:9px;color:#51419a;font-size:14px;margin:12px 0}
.hide{display:none}
#message{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#34304a;color:white;padding:12px 22px;border-radius:12px;display:none;z-index:9}
@media(max-width:730px){
.grid{grid-template-columns:repeat(2,minmax(0,1fr))}
.stats{grid-template-columns:repeat(2,1fr)}
.editing{grid-template-columns:1fr}
h1{font-size:23px}
.tabs button{padding:9px;font-size:13px}
}
@media print{
header,.stats,.controls,.btn,.hint{display:none!important}
.panel{border:0}
body{background:white}
}
</style>
</head>
<body>
<header>
<h1>🌈 우리 반 1인 1역할</h1>
<p id="subtitle">우리 반의 행복한 역할 나누기</p>
<div class="tabs">
<button data-tab="roles">🏡 역할 보기</button>
<button data-tab="wishes">💌 희망 신청</button>
<button data-tab="results">🏅 배정 결과</button>
<button data-tab="settings">⚙️ 설정 관리</button>
</div>
</header>
<main>
<div class="stats" id="stats"></div>
<div id="screen"></div>
</main>
<div id="message" role="status"></div>
<input class="hide" type="file" id="upload" accept=".json,application/json">

<script id="initial-data" type="application/json">
{
"className":"2학년 6반",
"termName":"2학기",
"students":[
"1번 학생","2번 학생","3번 학생","4번 학생",
"5번 학생","6번 학생","7번 학생","8번 학생",
"9번 학생","10번 학생","11번 학생","12번 학생",
"13번 학생","14번 학생","15번 학생","16번 학생",
"17번 학생","18번 학생","19번 학생","20번 학생",
"21번 학생","22번 학생","23번 학생","24번 학생"
],
"roles":[
["🧽","칠판 지우미","칠판을 깨끗이 닦아요."],
["📚","도서 사서","학급 책을 정리해요."],
["🍽️","급식 도우미","급식 시간을 도와요."],
["♻️","분리수거 지킴이","재활용품을 분리해요."],
["🪟","창문 지킴이","환기를 도와요."],
["💡","전등 지킴이","전등을 관리해요."],
["🔋","에너지 지킴이","에너지를 아껴요."],
["⏰","시간 알리미","활동 시간을 알려요."],
["📒","알림장 도우미","알림장을 확인해요."],
["📅","달력 관리","오늘 날짜를 알려요."],
["☀️","날씨 알리미","날씨를 알려요."],
["🎒","준비물 도우미","준비물을 확인해요."],
["💖","칭찬 천사","친구를 칭찬해요."],
["🪑","책상 정리 지킴이","책상을 정리해요."],
["🧹","교실 청소 도우미","교실 청소를 도와요."],
["🔎","분실물 지킴이","분실물을 정리해요."],
["🪴","식물 돌보미","식물을 돌봐요."],
["⚽","체육 도우미","체육 도구를 정리해요."],
["🎨","미술 도우미","미술 재료를 정리해요."],
["🎵","음악 도우미","음악 시간을 도와요."],
["📰","학급 기자","학급 소식을 전해요."],
["💻","디지털 도우미","태블릿을 정리해요."],
["🙋","인사 도우미","밝게 인사해요."],
["✉️","우편 전달 도우미","안내장을 전달해요."]
],
"wishes":{},
"results":{}
}
</script>

<script>
'use strict';
(()=>{
const KEY='class_role_helper_copy_v1';
const OLD_KEY='class_role_helper_single_v1';
const LEGACY_KEY='class_role_wishes_state_2026_v6';
const $=id=>document.getElementById(id);
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({
'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));
const defaults=JSON.parse($('initial-data').textContent);

function format(v){
 const d=v&&typeof v==='object'?v:{};
 return {
 className:d.className||'우리 반',
 termName:d.termName||'1학기',
 students:[...new Set(
 (Array.isArray(d.students)?d.students:[])
 .map(x=>typeof x==='string'?x:x?.name||'')
 .map(x=>x.trim()).filter(Boolean)
 )],
 roles:(Array.isArray(d.roles)?d.roles:[]).map((r,i)=>
 Array.isArray(r)
 ?{id:'r'+(i+1),emoji:r[0],title:r[1],desc:r[2],capacity:1}
 :{
 id:String(r.id??'r'+(i+1)),
 emoji:String(r.emoji??r.icon??'⭐'),
 title:String(r.title??r.name??''),
 desc:String(r.desc??r.description??''),
 capacity:Math.max(0,Number(r.capacity??1)||0)
 }),
 wishes:d.wishes&&typeof d.wishes==='object'?d.wishes:{},
 results:d.results&&typeof d.results==='object'?d.results:{}
 };
}

let data;
try{
 data=format(
 JSON.parse(
 localStorage.getItem(KEY)||
 localStorage.getItem(OLD_KEY)||
 localStorage.getItem(LEGACY_KEY)||
 'null'
 )||defaults
 );
}catch{
 data=format(defaults);
}

let tab='roles',student='';
function save(){
 try{
 localStorage.setItem(KEY,JSON.stringify(data));
 }catch{
 alert('브라우저 저장 실패. JSON 백업을 사용해 주세요.');
 }
}
function msg(s){
 let a=$('message');
 a.textContent=s;
 a.style.display='block';
 clearTimeout(msg.timer);
 msg.timer=setTimeout(()=>a.style.display='none',2600);
}
const byId=id=>data.roles.find(r=>r.id===id);
const options=(v='',blank=true)=>`
${blank?'<option value="">선택하세요</option>':''}
${data.roles.map(r=>`
<option value="${E(r.id)}" ${r.id===v?'selected':''}>
${E(r.emoji)} ${E(r.title)}
</option>`).join('')}`;

const count=id=>Object.values(data.results)
 .filter(x=>x===id).length;

function render(){
 document.querySelectorAll('[data-tab]').forEach(b=>
 b.classList.toggle('active',b.dataset.tab===tab)
 );
 $('subtitle').textContent=
 `${data.className} · ${data.termName} · 행복한 역할 나누기`;
 $('stats').innerHTML=`
 <div class="stat"><small>학생 수</small><b>${data.students.length}명</b></div>
 <div class="stat"><small>역할 수</small><b>${data.roles.length}개</b></div>
 <div class="stat"><small>신청 완료</small><b>${
 Object.keys(data.wishes).filter(n=>
 data.wishes[n]?.length&&data.students.includes(n)).length
 }명</b></div>
 <div class="stat"><small>배정 완료</small><b>${
 Object.keys(data.results).filter(n=>
 data.results[n]&&data.students.includes(n)).length
 }명</b></div>`;
 $('screen').innerHTML=
 tab==='roles'?rolesPage():
 tab==='wishes'?wishesPage():
 tab==='results'?resultsPage():settingsPage();
}

function rolesPage(){
 return `<section class="panel">
 <h2>🏡 우리 반 역할</h2>
 <p class="muted">역할에 맞는 아이콘을 다시 배치했어요.
 정원과 설명은 설정에서 수정할 수 있습니다.</p>
 <div class="grid">
 ${data.roles.map(r=>`
 <article class="role">
 <div class="emoji">${E(r.emoji)}</div>
 <h3>${E(r.title)}</h3>
 <p>${E(r.desc)}</p>
 <small>정원 ${r.capacity}명</small>
 </article>`).join('')}
 </div></section>`;
}

function wishesPage(){
 let ws=data.wishes[student]||[];
 return `<section class="panel">
 <h2>💌 희망 역할 신청</h2>
 <p class="muted">이 기기에 신청이 저장됩니다.
 다른 기기와 실시간 동기화되지는 않아요.</p>
 <div style="max-width:520px">
 <div class="field"><label>학생 선택</label>
 <select id="student">
 <option value="">이름을 선택하세요</option>
 ${data.students.map(n=>`
 <option ${n===student?'selected':''} value="${E(n)}">
 ${E(n)}</option>`).join('')}
 </select></div>
 ${[0,1,2].map(i=>`
 <div class="field">
 <label>${i+1}지망</label>
 <select id="wish${i}">${options(ws[i]||'')}</select>
 </div>`).join('')}
 <div class="row">
 <button class="btn" data-action="saveWish">💜 희망 저장</button>
 <button class="btn alt" data-action="deleteWish">신청 삭제</button>
 </div></div></section>
 <section class="panel">
 <h2>신청 현황</h2>
 <p class="muted">${data.students.map(n=>
 `${E(n)} ${data.wishes[n]?.length?'✅':'▫️'}`
 ).join('　')}</p>
 </section>`;
}

function resultsPage(){
 return `<section class="panel">
 <h2>🏅 역할 배정 결과</h2>
 <div class="row controls">
 <button class="btn" data-action="assign">🎲 자동 배정</button>
 <button class="btn alt" data-action="csv">CSV 저장</button>
 <button class="btn alt" data-action="print">인쇄</button>
 <button class="btn red" data-action="clearResult">결과 삭제</button>
 </div>
 <p class="hint">1~3지망부터 추첨 배정한 뒤
 남은 학생에게 빈 역할을 배정합니다.
 역할별 정원을 넘기지 않습니다.
 배정 결과에서 직접 수정할 수도 있습니다.</p>
 <div class="scroll">
 <table>
 <thead><tr>
 <th>번호</th><th>학생</th>
 <th>배정 역할(수정 가능)</th><th>지망 순위</th>
 </tr></thead>
 <tbody>
 ${data.students.map((n,i)=>{
 const id=data.results[n]||'';
 const w=data.wishes[n]||[];
 const rank=w.indexOf(id);
 return `<tr>
 <td>${i+1}</td><td>${E(n)}</td>
 <td><select class="assignment" data-name="${E(n)}">
 ${options(id)}</select></td>
 <td>${id?(rank>=0?`${rank+1}지망`:'기타 배정'):'미배정'}</td>
 </tr>`;
 }).join('')}
 </tbody></table></div></section>`;
}

function settingsPage(){
 return `<section class="panel">
 <h2>⚙️ 학급 기본 정보</h2>
 <div class="field"><label>학급 이름</label>
 <input id="className" value="${E(data.className)}"></div>
 <div class="field"><label>학기</label>
 <input id="termName" value="${E(data.termName)}"></div>
 <button class="btn" data-action="saveInfo">학급 정보 저장</button>
 </section>

 <section class="panel">
 <h2>👧 학생 명단</h2>
 <p class="muted">한 줄에 학생 한 명을 입력하세요.</p>
 <textarea id="students" rows="9">${E(data.students.join('\n'))}</textarea>
 <div class="row">
 <button class="btn" data-action="saveStudents">학생 명단 저장</button>
 </div></section>

 <section class="panel">
 <h2>🎨 역할별 아이콘·정원 편집</h2>
 <div class="row">
 <button class="btn alt" data-action="recommend">
 ✨ 역할별 아이콘 자동 재배치</button>
 <button class="btn alt" data-action="addRole">+ 역할 추가</button>
 <button class="btn" data-action="saveRoles">💾 역할 저장</button>
 </div>
 <div class="editing" id="editroles">
 ${data.roles.map((r,i)=>`
 <div class="edit" data-id="${E(r.id)}">
 <b>${i+1}. 역할</b>
 <div class="inputs">
 <input data-field="emoji" aria-label="아이콘" value="${E(r.emoji)}">
 <input data-field="title" aria-label="역할명" value="${E(r.title)}">
 <input data-field="capacity" aria-label="정원"
 type="number" min="0" max="99" value="${r.capacity}">
 </div>
 <textarea data-field="desc" rows="2"
 aria-label="역할 설명">${E(r.desc)}</textarea>
 <div class="row">
 <button class="btn alt" data-action="up" data-id="${E(r.id)}">↑</button>
 <button class="btn alt" data-action="down" data-id="${E(r.id)}">↓</button>
 <button class="btn red" data-action="deleteRole" data-id="${E(r.id)}">
 삭제</button>
 </div></div>`).join('')}
 </div></section>

 <section class="panel">
 <h2>💾 설정 보관·기본값 지정</h2>
 <p class="hint">현재 설정을 기본값으로 하려면
 아래 버튼으로 새로운 index.html을 저장한 다음
 깃허브 파일을 교체하세요.
 학생 실명을 공개 저장소에 올리지 마세요.</p>
 <div class="row">
 <button class="btn" data-action="saveHTML">
 📦 현재 설정을 기본값으로 한 index.html 다운로드</button>
 <button class="btn alt" data-action="backup">JSON 백업</button>
 <button class="btn alt" data-action="load">JSON 불러오기</button>
 <button class="btn red" data-action="reset">초기화</button>
 </div></section>`;
}

function readRoles(){
 const nodes=[...document.querySelectorAll('.edit')];
 if(!nodes.length)return;
 data.roles=nodes.map(node=>{
 const val=k=>node.querySelector(`[data-field="${k}"]`).value.trim();
 return {
 id:node.dataset.id,
 emoji:val('emoji')||'⭐',
 title:val('title')||'새 역할',
 desc:val('desc'),
 capacity:Math.max(0,Math.min(99,Number(val('capacity'))||0))
 };
 });
 clean();
}

function clean(){
 const ids=new Set(data.roles.map(r=>r.id));
 for(const n in data.wishes)
 data.wishes[n]=(data.wishes[n]||[]).filter(id=>ids.has(id));
 for(const n in data.results)
 if(!ids.has(data.results[n]))delete data.results[n];
}

function icon(t,old){
 const x=t.replace(/\s/g,'');
 const pairs=[
 [/칠판/,'🧽'],[/청소/,'🧹'],
 [/도서|책|독서/,'📚'],[/급식|식판/,'🍽️'],
 [/분리|재활용/,'♻️'],[/창문|환기/,'🪟'],
 [/전등|불/,'💡'],[/에너지|전기/,'🔋'],
 [/시간/,'⏰'],[/알림장/,'📒'],
 [/달력|날짜/,'📅'],[/날씨/,'☀️'],
 [/준비물/,'🎒'],[/칭찬/,'💖'],
 [/책상|의자/,'🪑'],[/분실/,'🔎'],
 [/식물|화분/,'🪴'],[/체육|운동/,'⚽'],
 [/미술|그림/,'🎨'],[/음악|노래/,'🎵'],
 [/기자|소식/,'📰'],[/디지털|컴퓨터|태블릿/,'💻'],
 [/인사/,'🙋'],[/우편|전달/,'✉️']
 ];
 return pairs.find(p=>p[0].test(x))?.[1]||old||'⭐';
}

function shuffled(a){
 a=[...a];
 for(let i=a.length-1;i>0;i--){
 const j=Math.floor(Math.random()*(i+1));
 [a[i],a[j]]=[a[j],a[i]];
 }
 return a;
}

function assign(){
 if(Object.keys(data.results).length &&
 !confirm('기존 배정 결과를 다시 만들까요?'))return;
 const remain=Object.fromEntries(
 data.roles.map(r=>[r.id,r.capacity])
 );
 const out={};
 for(let tier=0;tier<3;tier++)
 for(const name of shuffled(data.students.filter(n=>!out[n]))){
 const id=(data.wishes[name]||[])[tier];
 if(id&&remain[id]>0){
 out[name]=id;
 remain[id]--;
 }
 }
 for(const name of shuffled(data.students.filter(n=>!out[n]))){
 const open=data.roles.filter(r=>remain[r.id]>0);
 if(!open.length)break;
 const chosen=open[Math.floor(Math.random()*open.length)];
 out[name]=chosen.id;
 remain[chosen.id]--;
 }
 data.results=out;
 save();render();msg('배정을 완료했어요.');
}

function download(name,content,type){
 const u=URL.createObjectURL(new Blob([content],{type}));
 const a=document.createElement('a');
 a.href=u;
 a.download=name;
 a.click();
 setTimeout(()=>URL.revokeObjectURL(u),1500);
}

function csv(){
 const cell=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
 const rows=[
 ['번호','학생','역할','지망 순위'],
 ...data.students.map((n,i)=>{
 const id=data.results[n]||'';
 const rank=(data.wishes[n]||[]).indexOf(id);
 return [i+1,n,byId(id)?.title||'미배정',
 id?(rank>=0?rank+1+'지망':'기타'):''];
 })
 ];
 download('우리반_역할배정.csv',
 '\ufeff'+rows.map(r=>r.map(cell).join(',')).join('\r\n'),
 'text/csv;charset=utf-8');
}

function saveHTML(){
 if(!confirm('현재 학생 명단이 새 HTML 파일에 포함됩니다. 공개 깃허브에 학생 실명을 올리지 않도록 확인하셨나요?'))return;
 const s=$('initial-data'),old=s.textContent;
 s.textContent=JSON.stringify({...data,wishes:{},results:{}})
 .replace(/</g,'\\u003c');
 const html='<!DOCTYPE html>\n'+document.documentElement.outerHTML;
 s.textContent=old;
 download('index.html',html,'text/html;charset=utf-8');
 msg('새 기본값으로 만든 index.html을 저장했습니다.');
}

document.addEventListener('click',e=>{
 const b=e.target.closest('button');
 if(!b)return;
 if(b.dataset.tab){
 tab=b.dataset.tab;
 render();
 return;
 }
 const a=b.dataset.action;
 if(!a)return;

 if(a==='saveWish'){
 const name=$('student').value;
 if(!name)return msg('학생을 선택하세요.');
 const list=[0,1,2].map(i=>$('wish'+i).value).filter(Boolean);
 if(!list.length)return msg('1지망을 선택하세요.');
 if(new Set(list).size!==list.length)
 return msg('같은 역할을 여러 번 선택할 수 없어요.');
 data.wishes[name]=list;
 save();render();
 return msg('희망 신청을 저장했어요.');
 }
 if(a==='deleteWish'){
 if(student&&confirm('신청을 삭제할까요?')){
 delete data.wishes[student];save();render();
 }
 return;
 }
 if(a==='assign')return assign();
 if(a==='csv')return csv();
 if(a==='print')return print();
 if(a==='clearResult'){
 if(confirm('배정 결과를 지울까요?')){
 data.results={};save();render();
 }
 return;
 }
 if(a==='saveInfo'){
 data.className=$('className').value.trim()||'우리 반';
 data.termName=$('termName').value.trim()||'학기';
 save();render();return msg('학급 정보를 저장했어요.');
 }
 if(a==='saveStudents'){
 const names=$('students').value.split(/\r?\n/)
 .map(x=>x.trim()).filter(Boolean);
 if(new Set(names).size!==names.length)
 return msg('학생 이름이 중복되었습니다.');
 data.students=names;
 for(const n in data.wishes)
 if(!names.includes(n))delete data.wishes[n];
 for(const n in data.results)
 if(!names.includes(n))delete data.results[n];
 save();render();return msg('학생 명단을 저장했어요.');
 }
 if(['saveRoles','recommend','addRole',
 'up','down','deleteRole'].includes(a)){
 readRoles();
 if(a==='recommend')
 data.roles.forEach(r=>r.emoji=icon(r.title,r.emoji));
 if(a==='addRole')
 data.roles.push({
 id:'r'+Date.now(),emoji:'⭐',
 title:'새 역할',desc:'',capacity:1
 });
 const i=data.roles.findIndex(r=>r.id===b.dataset.id);
 if(a==='up'&&i>0)
 [data.roles[i-1],data.roles[i]]=[data.roles[i],data.roles[i-1]];
 if(a==='down'&&i>=0&&i<data.roles.length-1)
 [data.roles[i+1],data.roles[i]]=[data.roles[i],data.roles[i+1]];
 if(a==='deleteRole'&&i>=0&&confirm('역할을 삭제할까요?'))
 data.roles.splice(i,1);
 clean();save();render();
 if(a==='saveRoles')msg('역할과 아이콘을 저장했어요.');
 return;
 }
 if(a==='backup'){
 download('역할배정_백업.json',JSON.stringify(data,null,2),
 'application/json');
 return;
 }
 if(a==='load')return $('upload').click();
 if(a==='saveHTML')return saveHTML();
 if(a==='reset'&&confirm('현재 기기에 저장된 설정과 결과를 모두 초기화할까요?')){
 data=format(defaults);
 save();render();msg('초기화했습니다.');
 }
});

document.addEventListener('change',e=>{
 if(e.target.id==='student'){
 student=e.target.value;
 render();
 return;
 }
 if(e.target.classList.contains('assignment')){
 const n=e.target.dataset.name,
 id=e.target.value,
 old=data.results[n]||'';
 if(id!==old&&id&&count(id)>=(byId(id)?.capacity||0)){
 render();
 return msg('해당 역할의 정원이 찼습니다.');
 }
 if(id)data.results[n]=id;
 else delete data.results[n];
 save();render();
 msg('배정 결과를 수정했어요.');
 }
});

$('upload').addEventListener('change',async e=>{
 const file=e.target.files[0];
 if(!file)return;
 try{
 const parsed=JSON.parse(await file.text());
 if(!Array.isArray(parsed.students)||!Array.isArray(parsed.roles))
 throw Error('형식');
 if(confirm('현재 설정을 백업 파일로 교체할까요?')){
 data=format(parsed);
 save();render();
 msg('백업을 불러왔어요.');
 }
 }catch{
 alert('올바른 JSON 백업 파일이 아닙니다.');
 }
 e.target.value='';
});

if('serviceWorker' in navigator)
navigator.serviceWorker.getRegistrations()
.then(rs=>rs.forEach(r=>r.unregister()))
.catch(()=>{});
render();
})();
</script>
</body>
</html>
