const STORAGE_KEY='carteiraBentoDataV3';
const LEGACY_KEYS=['carteiraBentoDataV2','carteiraBentoDataV1'];
const defaultData={
  transactions:[],
  assets:[],
  investments:[],
  goals:[],
  taxes:[],
  demo:false,
  accounts:[],
  cards:[],
  obligations:[],
  preferences:{
    categories:{
      income:['Salário','Vale-refeição','Vale-alimentação','Freelance','Aluguel recebido','Outras receitas'],
      expense:['Restaurante','Supermercado','Moradia','Transporte','Saúde','Lazer','Assinaturas','Outras despesas'],
      passive:['Dividendos','Juros','Aluguel','Rendimentos']
    },
    sources:['Conta corrente','Dinheiro','Cartão de crédito','Vale-refeição','Vale-alimentação','PIX']
  }
};
let workspace=loadWorkspace();
let state=workspace.profiles.find(p=>p.id===workspace.activeId).data;
function emptyProfile(id='principal'){
  return {id,name:'Minha carteira',kind:'',occupation:'',regime:'',revenue:'',advanced:false,data:structuredClone(defaultData)};
}
function loadWorkspace(){
  const raw=localStorage.getItem('carteiraBentoWorkspaceV4');
  if(raw){
    try {return validateWorkspace(JSON.parse(raw));}
    catch {alert('Não foi possível ler os perfis. Os dados originais foram preservados. Exporte os dados antes de continuar.'); throw new Error('Perfis inválidos; gravação interrompida.');}
  }
  const profile=emptyProfile();profile.data=loadState();
  profile.advanced=Boolean(profile.data.assets.length||profile.data.investments.length||profile.data.goals.length);
  return {version:4,activeId:profile.id,profiles:[profile]};
}
function validateWorkspace(value){
  if(!value||value.version!==4||!Array.isArray(value.profiles)||!value.profiles.length)throw Error('Formato inválido');
  const ids=new Set();
  value.profiles.forEach(p=>{
    if(!p||typeof p.id!=='string'||!/^[a-zA-Z0-9_-]+$/.test(p.id)||ids.has(p.id)||typeof p.name!=='string'||!['','CPF','CNPJ'].includes(p.kind))throw Error('Perfil inválido');
    ids.add(p.id);p.data=normalizeState(p.data);
  });
  if(!ids.has(value.activeId))throw Error('Perfil ativo inválido');
  return value;
}
function activeProfile(){return workspace.profiles.find(p=>p.id===workspace.activeId);}
function persistWorkspace(){
  activeProfile().data=state;
  localStorage.setItem('carteiraBentoWorkspaceV4',JSON.stringify(workspace));
}
function selectProfile(id){
  if(!workspace.profiles.some(p=>p.id===id))return;
  persistWorkspace();workspace.activeId=id;state=activeProfile().data;persistWorkspace();
  switchSection('dashboard');renderAll();
}


function normalizeState(data){
  if(data!==null && data!==undefined){
    if(typeof data!=='object'||Array.isArray(data))throw Error('Dados inválidos');
    for(const key of ['transactions','assets','investments','goals']){
      if(!Array.isArray(data[key]))throw Error('Coleção inválida');
      data[key].forEach(item=>{
        if(!item||typeof item.id!=='string'||!/^[a-zA-Z0-9_-]+$/.test(item.id))throw Error('Registro inválido');
        const amount=key==='goals'?item.target:item.value;
        if(!Number.isFinite(Number(amount))||Number(amount)<0)throw Error('Valor inválido');
        if(key==='transactions'&&(!['income','expense','passive'].includes(item.type)||typeof item.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(item.date)))throw Error('Lançamento inválido');
      });
    }
  }
  const normalized={...structuredClone(defaultData),...(data||{})};
  normalized.preferences={
    ...structuredClone(defaultData.preferences),
    ...((data||{}).preferences||{})
  };
  normalized.preferences.categories={
    ...structuredClone(defaultData.preferences.categories),
    ...(normalized.preferences.categories||{})
  };
  normalized.transactions=(normalized.transactions||[]).map(t=>({
    source:t.source||'Conta corrente',
    ...t
  }));
  normalized.taxes=normalized.taxes||[];
  if(!Array.isArray(normalized.taxes))throw Error('Tributos inválidos');
  normalized.taxes.forEach(t=>{if(!t||typeof t.id!=='string'||!/^[a-zA-Z0-9_-]+$/.test(t.id)||!Number.isFinite(Number(t.amount))||Number(t.amount)<0)throw Error('Tributo inválido');});
  return normalized;
}

function loadState(){
  try{
    let raw=localStorage.getItem(STORAGE_KEY);
    if(!raw){
      for(const key of LEGACY_KEYS){
        raw=localStorage.getItem(key);
        if(raw) break;
      }
    }
    return normalizeState(raw?JSON.parse(raw):null);
  }catch{
    return structuredClone(defaultData);
  }
}
function saveState(){
  state=normalizeState(state);
  persistWorkspace();
  renderAll();
}
function resetState(){
  state=structuredClone(defaultData);
  saveState();
}
function exportBackup(){
  const blob=new Blob([JSON.stringify({...workspace,profiles:workspace.profiles.map(p=>p.id===workspace.activeId?{...p,data:state}:p)},null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download=`carteira-bento-backup-${today()}.json`;a.click();
  URL.revokeObjectURL(url);
}
function importBackup(file){
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const parsed=JSON.parse(reader.result);
      if(parsed.version===4){
        const incoming=validateWorkspace(parsed);
        if(!confirm('Restaurar todos os perfis deste backup? Os perfis atuais serão substituídos. Exporte um backup antes de continuar.'))return;
        localStorage.setItem('carteiraBentoAntesImportacao',JSON.stringify(workspace));
        workspace=incoming;state=activeProfile().data;
      }else{
        const incoming=normalizeState(parsed);
        if(!confirm('Importar este backup antigo como um perfil separado? Seus perfis atuais serão mantidos.'))return;
        const profile=emptyProfile(newId());profile.name='Carteira importada';profile.data=incoming;profile.advanced=true;
        workspace.profiles.push(profile);workspace.activeId=profile.id;state=profile.data;
      }
      saveState();
      showToast('Backup importado com sucesso.');
    }catch{
      alert('Arquivo de backup inválido.');
    }
  };
  reader.readAsText(file);
}
