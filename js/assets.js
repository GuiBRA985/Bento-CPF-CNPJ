function openAsset(){
  openModal({
    title:'Adicionar ao patrimônio',
    fields:[
      {name:'name',label:'Nome',placeholder:'Ex.: Conta corrente, carro...',full:true},
      {name:'kind',label:'Classificação',type:'select',options:[{value:'asset',label:'Bem ou ativo'},{value:'debt',label:'Dívida'}]},
      {name:'category',label:'Categoria',placeholder:'Ex.: Imóvel, veículo'},
      {name:'value',label:'Valor atual',type:'number',step:'0.01'},
      {name:'date',label:'Data de referência',type:'date',value:today()}
    ],
    onSubmit:d=>{state.assets.push({...d,id:newId(),value:Number(d.value)});saveState();showToast('Patrimônio atualizado.');}
  });
}
function renderAssets(){
  const grid=$('#assetsGrid');
  if(!state.assets.length){grid.innerHTML='<div class="empty-state">Adicione contas, imóveis, veículos, bens ou dívidas.</div>';return;}
  grid.innerHTML=state.assets.map(a=>`<article class="data-card">
    <div class="card-top"><div><p>${a.kind==='debt'?'DÍVIDA':'ATIVO'}</p><h3>${escapeHtml(a.name)}</h3></div><button class="delete-btn" onclick="removeItem('assets','${a.id}')">×</button></div>
    <p>${escapeHtml(a.category)}</p><strong>${money(a.value)}</strong>
    <div class="meta"><span>${a.kind==='debt'?'Passivo':'Patrimônio'}</span><span>${formatDate(a.date)}</span></div>
  </article>`).join('');
}
function renderAssetSummary(){
  const el=$('#assetSummary'),cats={};
  state.assets.filter(a=>a.kind==='asset').forEach(a=>cats[a.category]=(cats[a.category]||0)+Number(a.value));
  state.investments.forEach(i=>cats['Investimentos']=(cats['Investimentos']||0)+Number(i.value));
  const total=Object.values(cats).reduce((s,v)=>s+v,0);
  const entries=Object.entries(cats).sort((a,b)=>b[1]-a[1]).slice(0,5);
  if(!entries.length){el.innerHTML='<div class="empty-state">Sem patrimônio cadastrado.</div>';return;}
  el.innerHTML=entries.map(([name,value])=>`<div class="asset-row">
    <div class="asset-top"><span>${escapeHtml(name)}</span><strong>${money(value)}</strong></div>
    <div class="progress"><span style="width:${total?value/total*100:0}%"></span></div>
  </div>`).join('');
}

