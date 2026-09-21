function openInvestment(){
  openModal({
    title:'Adicionar investimento',
    fields:[
      {name:'name',label:'Nome do investimento',placeholder:'Ex.: MXRF11, Tesouro Selic',full:true},
      {name:'type',label:'Tipo',type:'select',options:[{value:'Ações',label:'Ações'},{value:'Fundos imobiliários',label:'Fundos imobiliários'},{value:'Renda fixa',label:'Renda fixa'},{value:'Criptomoedas',label:'Criptomoedas'},{value:'Outros',label:'Outros'}]},
      {name:'value',label:'Valor atual',type:'number',step:'0.01'},
      {name:'monthlyIncome',label:'Renda mensal estimada',type:'number',step:'0.01',required:false,value:'0'}
    ],
    onSubmit:d=>{state.investments.push({...d,id:newId(),value:Number(d.value),monthlyIncome:Number(d.monthlyIncome||0)});saveState();showToast('Investimento adicionado.');}
  });
}
function renderInvestments(){
  const grid=$('#investmentsGrid');
  if(!state.investments.length){grid.innerHTML='<div class="empty-state">Adicione ações, FIIs, renda fixa, cripto ou outros investimentos.</div>';return;}
  grid.innerHTML=state.investments.map(i=>`<article class="data-card">
    <div class="card-top"><div><p>${escapeHtml(i.type)}</p><h3>${escapeHtml(i.name)}</h3></div><button class="delete-btn" onclick="removeItem('investments','${i.id}')">×</button></div>
    <p>Valor atual</p><strong>${money(i.value)}</strong>
    <div class="meta"><span>Renda mensal: ${money(i.monthlyIncome||0)}</span><span>${percent(i.value?i.monthlyIncome/i.value*100:0)}</span></div>
  </article>`).join('');
}

