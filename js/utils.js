const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const money=v=>Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const percent=v=>Number(v||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})+'%';
const today=()=>new Date().toISOString().split('T')[0];
const newId=()=>crypto.randomUUID?crypto.randomUUID():Date.now().toString(36);
const formatDate=v=>v?new Date(v+'T12:00:00').toLocaleDateString('pt-BR'):'';
const monthKey=date=>{const d=new Date(date+'T12:00:00');return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`};
const escapeHtml=(v='')=>String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const typeLabel=t=>t==='income'?'Receita':t==='expense'?'Despesa':'Renda passiva';

function showToast(message){
  const toast=$('#toast');
  toast.textContent=message;toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),2200);
}
function getTotals(){
  const currentMonth=monthKey(today());
  const monthTx=state.transactions.filter(t=>monthKey(t.date)===currentMonth);
  const income=monthTx.filter(t=>t.type!=='expense').reduce((s,t)=>s+Number(t.value),0);
  const expense=monthTx.filter(t=>t.type==='expense').reduce((s,t)=>s+Number(t.value),0);
  const passive=monthTx.filter(t=>t.type==='passive').reduce((s,t)=>s+Number(t.value),0)+state.investments.reduce((s,i)=>s+Number(i.monthlyIncome||0),0);
  const assets=state.assets.filter(a=>a.kind==='asset').reduce((s,a)=>s+Number(a.value),0)+state.investments.reduce((s,i)=>s+Number(i.value),0);
  const debts=state.assets.filter(a=>a.kind==='debt').reduce((s,a)=>s+Number(a.value),0);
  return {income,expense,passive,balance:income-expense,assets,debts,netWorth:assets-debts};
}
function removeItem(collection,itemId){
  if(!confirm('Excluir este registro?'))return;
  state[collection]=state[collection].filter(i=>i.id!==itemId);
  saveState();showToast('Registro excluído.');
}

