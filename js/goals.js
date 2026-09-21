function openGoal(){
  openModal({
    title:'Criar meta financeira',
    fields:[
      {name:'name',label:'Nome da meta',placeholder:'Ex.: Reserva de emergência',full:true},
      {name:'target',label:'Valor desejado',type:'number',step:'0.01'},
      {name:'current',label:'Valor atual',type:'number',step:'0.01',value:'0'},
      {name:'deadline',label:'Prazo',type:'date',required:false,full:true}
    ],
    onSubmit:d=>{state.goals.push({...d,id:newId(),target:Number(d.target),current:Number(d.current)});saveState();showToast('Meta criada.');}
  });
}
function renderGoals(){
  const grid=$('#goalsGrid');
  if(!state.goals.length){grid.innerHTML='<div class="empty-state">Crie uma meta: reserva de emergência, viagem, casa ou independência financeira.</div>';return;}
  grid.innerHTML=state.goals.map(g=>{const p=Math.min(100,(Number(g.current)/Number(g.target))*100||0);return `<article class="data-card">
    <div class="card-top"><div><p>META FINANCEIRA</p><h3>${escapeHtml(g.name)}</h3></div><button class="delete-btn" onclick="removeItem('goals','${g.id}')">×</button></div>
    <p>${money(g.current)} de ${money(g.target)}</p>
    <div class="goal-progress"><div class="progress"><span style="width:${p}%"></span></div></div>
    <div class="meta"><span>${p.toFixed(0)}% concluído</span><span>${g.deadline?formatDate(g.deadline):'Sem prazo'}</span></div>
  </article>`}).join('');
}

