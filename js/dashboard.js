function renderDashboardMetrics(){
  const t=getTotals();
  renderDemoOverview();
  $('#incomeMetric').textContent=money(t.income);
  $('#expenseMetric').textContent=money(t.expense);
  $('#passiveMetric').textContent=money(t.passive);
  $('#balanceMetric').textContent=money(t.balance);
  $('#heroNetWorth').textContent=money(t.netWorth);
  $('#heroTrend').textContent=t.netWorth?'Patrimônio atualizado com seus registros':'Comece adicionando seus dados';
  $('#totalAssets').textContent=money(t.assets);
  $('#totalDebts').textContent=money(t.debts);
  $('#netWorthMetric').textContent=money(t.netWorth);
  const invested=state.investments.reduce((s,i)=>s+Number(i.value),0);
  const monthly=state.investments.reduce((s,i)=>s+Number(i.monthlyIncome||0),0);
  $('#investedTotal').textContent=money(invested);
  $('#passiveTotal').textContent=money(monthly);
  $('#yieldMetric').textContent=percent(invested?monthly/invested*100:0);

  const vrTransactions=state.transactions.filter(t=>(t.source||'').toLowerCase()==='vale-refeição' || (t.category||'').toLowerCase()==='vale-refeição');
  const vrCredits=vrTransactions.filter(t=>t.type==='income').reduce((s,t)=>s+Number(t.value),0);
  const vrExpenses=vrTransactions.filter(t=>t.type==='expense').reduce((s,t)=>s+Number(t.value),0);
  const vrBalance=vrCredits-vrExpenses;
  $('#vrBalance').textContent=money(vrBalance);
  $('#vrSummary').textContent=vrTransactions.length
    ? `${money(vrCredits)} recebidos • ${money(vrExpenses)} utilizados`
    : 'Registre o crédito como receita e as refeições como despesas usando “Vale-refeição”.';
}

function renderDemoOverview(){
  $('#demoNotice').style.display=state.demo?'flex':'none';
  const el=$('#demoOverview');
  if(!state.demo){el.innerHTML='';return;}
  const accounts=(state.accounts||[]).reduce((s,a)=>s+Number(a.balance),0);
  const invoices=(state.cards||[]).reduce((s,c)=>s+Number(c.invoice),0);
  const obligations=(state.obligations||[]).reduce((s,o)=>s+Number(o.value),0);
  el.innerHTML=`<article class="demo-panel"><span class="eyebrow">SALDOS DISPONÍVEIS</span><strong>${money(accounts)}</strong>${(state.accounts||[]).map(a=>`<div class="demo-line"><span>${escapeHtml(a.name)}</span><b>${money(a.balance)}</b></div>`).join('')}</article>
  <article class="demo-panel"><span class="eyebrow">CARTÕES DE CRÉDITO</span><strong>${money(invoices)}</strong>${(state.cards||[]).map(c=>`<div class="demo-line"><span>${escapeHtml(c.name)}<small>Limite ${money(c.limit)} • vence ${c.due}</small></span><b>${money(c.invoice)}</b></div>`).join('')||'<div class="demo-line"><span>Nenhum cartão nesta carteira</span></div>'}</article>
  <article class="demo-panel"><span class="eyebrow">COMPROMISSOS AGENDADOS</span><strong>${money(obligations)}</strong>${(state.obligations||[]).map(o=>`<div class="demo-line"><span>${escapeHtml(o.name)}<small>${escapeHtml(o.status)} • ${o.due}</small></span><b>${money(o.value)}</b></div>`).join('')}</article>`;
}
function renderHealth(){
  const t=getTotals();let score=0;
  if(state.transactions.length)score+=25;if(state.assets.length)score+=20;if(state.investments.length)score+=20;if(state.goals.length)score+=15;if(t.balance>0)score+=20;
  score=Math.min(100,score);
  $('#healthScore').textContent=score;$('#healthPercent').textContent=score+'%';
  $('#healthRing').style.background=`conic-gradient(var(--green) ${score*3.6}deg,#e7edf3 0deg)`;
  $('#healthMessage').textContent=score>=80?'Boa organização. Agora o jogo é constância, não milagre.':score>=50?'A base está montada. Continue alimentando os dados para enxergar padrões.':'Adicione receitas, despesas, patrimônio e metas para receber uma leitura inicial.';
}
function drawChart(){
  const canvas=$('#cashflowChart');if(!canvas)return;
  const ctx=canvas.getContext('2d'),ratio=devicePixelRatio||1,rect=canvas.getBoundingClientRect();
  canvas.width=rect.width*ratio;canvas.height=rect.height*ratio;ctx.scale(ratio,ratio);
  const w=rect.width,h=rect.height,months=Number($('#chartPeriod').value),data=[],now=new Date();
  for(let i=months-1;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);const key=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;const tx=state.transactions.filter(t=>monthKey(t.date)===key);data.push({label:d.toLocaleDateString('pt-BR',{month:'short'}).replace('.',''),income:tx.filter(t=>t.type!=='expense').reduce((s,t)=>s+Number(t.value),0),expense:tx.filter(t=>t.type==='expense').reduce((s,t)=>s+Number(t.value),0)})}
  const max=Math.max(100,...data.flatMap(d=>[d.income,d.expense])),pad={l:45,r:15,t:15,b:34},cw=w-pad.l-pad.r,ch=h-pad.t-pad.b;
  ctx.clearRect(0,0,w,h);ctx.strokeStyle='#e8edf2';ctx.lineWidth=1;ctx.font='11px Inter';ctx.fillStyle='#8c98a8';
  for(let i=0;i<=4;i++){const y=pad.t+ch*i/4;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();ctx.fillText(compactMoney(max*(1-i/4)),4,y+4)}
  const group=cw/data.length,bw=Math.min(20,group*.25);
  data.forEach((d,i)=>{const x=pad.l+i*group+group/2,hi=d.income/max*ch,he=d.expense/max*ch;bar(ctx,x-bw-2,pad.t+ch-hi,bw,hi,'#19b67a');bar(ctx,x+2,pad.t+ch-he,bw,he,'#e95c67');ctx.fillStyle='#7c8898';ctx.textAlign='center';ctx.fillText(d.label,x,h-10)});
  ctx.textAlign='left';
}
function bar(ctx,x,y,w,h,color){if(h<=0)return;ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,5);ctx.fill()}
function compactMoney(v){if(v>=1000000)return'R$ '+(v/1000000).toFixed(1)+' mi';if(v>=1000)return'R$ '+(v/1000).toFixed(0)+' mil';return'R$ '+v.toFixed(0)}
