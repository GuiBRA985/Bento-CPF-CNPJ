const officialRecovery='https://www.gov.br/pt-br/servicos/obter-restituicao-ressarcimento-ou-reembolso-de-tributos-federais';
const officialPerdcomp='https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/restituicao-ressarcimento-reembolso-e-compensacao/perdcomp/perdcomp-web/perdcomp-web';
function initProfiles(){
  $('#profileSelect').onchange=e=>selectProfile(e.target.value);
  $('#addProfileBtn').onclick=()=>openProfile('',true);
  $('#editProfileBtn').onclick=()=>openProfile(activeProfile().kind,false);
  $('#setupCpf').onclick=()=>openProfile('CPF',false);
  $('#setupCnpj').onclick=()=>openProfile('CNPJ',false);
  $('#advancedBtn').onclick=()=>{activeProfile().advanced=!activeProfile().advanced;saveState();switchSection('dashboard');};
  $('#newTaxBtn').onclick=()=>openTax();
}
function renderProfiles(){
  const p=activeProfile();
  $('#profileSelect').replaceChildren(...workspace.profiles.map(item=>{
    const option=document.createElement('option');option.value=item.id;option.textContent=`${item.kind||'Perfil pendente'} · ${item.name}`;return option;
  }));
  $('#profileSelect').value=p.id;
  $('#setupPanel').hidden=Boolean(p.kind);
  $('#profileSummary').textContent=p.kind?`${p.name} · ${p.kind} · ${p.kind==='CPF'?p.occupation:p.regime} · Registros separados por carteira`:'';
  document.body.classList.toggle('simple',!p.advanced);
  for(const section of ['assets','investments','goals'])$(`.nav-item[data-section="${section}"]`).hidden=!p.advanced;
  $('#advancedBtn').textContent=p.advanced?'Voltar ao modo simples':'Mostrar todas as funções';
  $('.benefit-strip').hidden=p.kind==='CNPJ'||!['CLT','CLT e autônomo'].includes(p.occupation);
  $('.brand span').textContent=p.kind==='CNPJ'?'Finanças da empresa':'Finanças pessoais';
  if(!p.advanced&&['assets','investments','goals'].includes(currentSection))switchSection('dashboard');
}
function openProfile(kind='',isNew=false){
  const old=isNew?emptyProfile(newId()):activeProfile();
  const dialog=document.createElement('dialog');dialog.className='profile-dialog';
  dialog.innerHTML=`<form><h2>${isNew?'Adicionar carteira':'Seu perfil'}</h2>
    <p>Comece pelo básico. Você pode complementar depois. Esta carteira terá registros próprios.</p>
    <div class="form-field"><label for="kind">O que deseja controlar?</label><select id="kind" name="kind" required><option value="">Escolha</option><option value="CPF">Meu CPF</option><option value="CNPJ">Meu CNPJ</option></select></div>
    <div class="form-field"><label for="profileName">Nome da carteira</label><input id="profileName" name="name" maxlength="80" required placeholder="Ex.: Minha vida financeira ou nome da empresa"></div>
    <div id="cpfFields" hidden><div class="form-field"><label for="occupation">Sua situação</label><select id="occupation" name="occupation"><option>CLT</option><option>Autônomo</option><option>CLT e autônomo</option><option>Aposentado</option><option>Outra situação</option></select></div></div>
    <div id="cnpjFields" hidden><div class="form-field"><label for="revenue">Faturamento mensal de referência (opcional)</label><input id="revenue" name="revenue" type="number" min="0" step="0.01" placeholder="Pode variar de mês para mês"></div>
    <div class="form-field"><label for="regime">Regime / enquadramento informado</label><select id="regime" name="regime"><option>Não sei informar</option><option>MEI / SIMEI</option><option>Simples Nacional</option><option>Lucro Presumido</option><option>Lucro Real</option><option>Outro</option></select></div><p>O faturamento de referência não cria uma receita nem define automaticamente o regime. O enquadramento será confirmado pelos documentos da empresa.</p></div>
    <div class="form-actions"><button type="button" class="ghost" id="cancelProfile">Cancelar</button><button class="primary">Começar</button></div></form>`;
  document.body.append(dialog);
  const form=dialog.querySelector('form');
  form.elements.kind.value=kind||old.kind;
  form.elements.name.value=isNew?'':old.name;
  form.elements.occupation.value=old.occupation||'CLT';form.elements.regime.value=old.regime||'Não sei informar';form.elements.revenue.value=old.revenue||'';
  // Existing data keeps its owner type; create another profile to change CPF/CNPJ.
  if(old.kind&&!isNew)form.elements.kind.disabled=true;
  const update=()=>{const cpf=form.elements.kind.value==='CPF',cnpj=form.elements.kind.value==='CNPJ';dialog.querySelector('#cpfFields').hidden=!cpf;dialog.querySelector('#cnpjFields').hidden=!cnpj;form.elements.occupation.disabled=!cpf;form.elements.regime.disabled=!cnpj;form.elements.revenue.disabled=!cnpj;};
  form.elements.kind.onchange=update;update();
  dialog.querySelector('#cancelProfile').onclick=()=>dialog.close();dialog.onclose=()=>dialog.remove();
  form.onsubmit=e=>{
    e.preventDefault();const chosen=form.elements.kind.value;const name=form.elements.name.value.trim();if(!chosen||!name)return;
    persistWorkspace();
    Object.assign(old,{name,kind:chosen,occupation:chosen==='CPF'?form.elements.occupation.value:'',regime:chosen==='CNPJ'?form.elements.regime.value:'',revenue:chosen==='CNPJ'?form.elements.revenue.value:''});
    if(isNew){workspace.profiles.push(old);workspace.activeId=old.id;state=old.data;}
    saveState();dialog.close();switchSection('dashboard');showToast('Perfil salvo. Seus registros estão separados.');
  };
  dialog.showModal();
}
function openTax(record){
  const options=values=>values.map(value=>({value,label:value}));
  openModal({title:record?'Atualizar conferência do tributo':'Registrar tributo',fields:[
    {name:'name',label:'Tributo ou contribuição',full:true,placeholder:'Ex.: IRPF, DARF, DAS'},
    {name:'period',label:'Período de apuração',type:'month'},
    {name:'amount',label:'Valor informado',type:'number',step:'0.01'},
    {name:'situation',label:'Situação do valor',type:'select',options:options(['Apurado','Retido','Pago'])},
    {name:'sphere',label:'Órgão responsável',type:'select',options:options(['Federal','Estadual','Municipal','Não sei informar'])},
    {name:'reason',label:'O que deseja conferir?',type:'select',options:options(['Somente organizar','Possível pagamento em duplicidade','Possível pagamento a maior','Conferir restituição do IRPF','Outro crédito a verificar']),full:true},
    {name:'status',label:'Acompanhamento informado por você',type:'select',options:options(['A verificar','Em análise','Solicitado','Aprovado','Recebido','Não aplicável'])},
    {name:'evidence',label:'Referência do comprovante / protocolo (opcional)',required:false,full:true},
    {name:'notes',label:'Base de cálculo, alíquota e observações (opcional)',required:false,full:true}
  ],onSubmit:d=>{
    const item={...d,id:record?record.id:newId(),amount:Number(d.amount)};
    if(record)state.taxes=state.taxes.map(t=>t.id===record.id?item:t);else state.taxes.push(item);
    saveState();showToast('Conferência salva. O saldo não foi alterado.');
  }});
  if(record)for(const [key,value] of Object.entries(record)){const input=$('#dynamicForm').elements[key];if(input)input.value=value;}
}
function taxRoute(t,profile){
  if(t.reason==='Somente organizar')return {text:'Registro de conferência. Nenhuma possibilidade de recuperação indicada.',url:null};
  if(t.sphere!=='Federal')return {text:'Confirme o órgão responsável e consulte as regras da Secretaria de Fazenda estadual ou municipal. Esta versão não avalia esses créditos.',url:null};
  if(t.reason==='Conferir restituição do IRPF')return profile.kind==='CPF'?{text:'Confira a declaração de IRPF, os informes e as retenções. A declaração apura o resultado; uma retenção isolada não comprova restituição.',url:officialRecovery}:{text:'A restituição de IRPF deve ser conferida na carteira CPF do titular. Este registro está em um CNPJ.',url:officialRecovery};
  if(t.reason==='Possível pagamento em duplicidade'||t.reason==='Possível pagamento a maior')return {text:'Compare guias, comprovantes e apuração do período. Se houver valor indevido, confirme o procedimento específico do tributo no serviço oficial. A indicação depende da sua informação e não comprova direito a crédito.',url:officialRecovery};
  return {text:profile.kind==='CNPJ'?'Confirme com os documentos e o contador a origem do crédito e as regras aplicáveis ao regime informado. O PER/DCOMP não atende todos os tipos de crédito.':'Identifique a origem do possível crédito e o procedimento oficial aplicável. Ainda não há elementos para confirmar valor recuperável.',url:profile.kind==='CNPJ'?officialPerdcomp:officialRecovery};
}
function renderTaxes(){
  const p=activeProfile();
  $('#taxRoutes').innerHTML=`<article class="panel"><p class="eyebrow">${escapeHtml(p.kind||'PERFIL PENDENTE')}</p><h3>Conferir antes de solicitar</h3><p>${p.kind==='CNPJ'?'O regime, o tributo, o período e a origem do crédito determinam a análise. Informe esses dados no registro e reúna a documentação.':p.kind==='CPF'?'Para o IRPF, confira a declaração, os rendimentos e as retenções. Para outros pagamentos, identifique o procedimento específico do tributo.':'Complete seu perfil CPF ou CNPJ para contextualizar as orientações.'}</p><a href="${officialRecovery}" target="_blank" rel="noopener noreferrer">Consultar o procedimento na Receita Federal</a><p>Fonte oficial consultada em 21/09/2026. Prazos e requisitos devem ser confirmados para cada pedido.</p></article>`;
  $('#taxRecords').innerHTML=state.taxes.length?state.taxes.map(t=>{
    const route=taxRoute(t,p);
    return `<article class="panel"><p class="eyebrow">${escapeHtml(t.status)} · ${escapeHtml(t.sphere)}</p><h3>${escapeHtml(t.name)}</h3><strong>${money(t.amount)}</strong><p>${escapeHtml(t.period)} · ${escapeHtml(t.situation)}<br>${escapeHtml(t.reason)}</p><p>${escapeHtml(t.notes||'')}</p><p>Documento/protocolo: ${escapeHtml(t.evidence||'Não informado')}</p><p>${route.text}</p>${route.url?`<a href="${route.url}" target="_blank" rel="noopener noreferrer">Ver requisitos e canal oficial</a>`:''}<div class="form-actions"><button class="ghost" data-edit-tax="${t.id}">Atualizar</button><button class="ghost" data-remove-tax="${t.id}">Excluir</button></div></article>`;
  }).join(''):'<div class="empty-state">Nenhum tributo registrado. Adicione uma apuração, retenção ou pagamento para começar a conferência.</div>';
  $$('[data-edit-tax]').forEach(b=>b.onclick=()=>openTax(state.taxes.find(t=>t.id===b.dataset.editTax)));
  $$('[data-remove-tax]').forEach(b=>b.onclick=()=>removeItem('taxes',b.dataset.removeTax));
}
