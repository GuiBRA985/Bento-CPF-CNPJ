function demoTx(id,description,type,category,source,value,date){return{id:`demo_${id}`,description,type,category,source,value,date};}

function demoPreferences(){return structuredClone(defaultData.preferences);}

function demoCpfData(){
  const transactions=[];
  ['01','02','03','04','05','06','07','08','09'].forEach((m,i)=>{
    const d=`2026-${m}`;
    transactions.push(
      demoTx(`${m}_prolabore`,'Pró-labore da Valença Participações','income','Pró-labore','Itaú Personnalité',85000,`${d}-05`),
      demoTx(`${m}_aluguel`,'Aluguéis de imóveis comerciais','passive','Aluguel','BTG Banking',46500,`${d}-08`),
      demoTx(`${m}_dividendos`,'Dividendos e rendimentos','passive','Dividendos','BTG Investimentos',i%3===2?78500:42800,`${d}-15`),
      demoTx(`${m}_condominio`,'Condomínio Residencial Jardins','expense','Moradia','Débito automático',6850,`${d}-10`),
      demoTx(`${m}_luz`,'Energia elétrica da mansão','expense','Energia','Itaú Personnalité',2450+i*85,`${d}-12`),
      demoTx(`${m}_agua`,'Água e saneamento','expense','Água','Itaú Personnalité',780+i*22,`${d}-12`),
      demoTx(`${m}_mercado`,'Supermercado, empório e adega','expense','Supermercado','Visa Infinite',11800+i*370,`${d}-18`),
      demoTx(`${m}_restaurante`,'Restaurantes e gastronomia','expense','Restaurante','Amex Platinum',14200+i*460,`${d}-22`),
      demoTx(`${m}_equipe`,'Equipe doméstica e encargos','expense','Serviços domésticos','Itaú Personnalité',28500,`${d}-07`)
    );
  });
  transactions.push(
    demoTx('ipva1','IPVA 2026 • Porsche 911 Turbo S','expense','IPVA','Itaú Personnalité',28940,'2026-01-20'),
    demoTx('ipva2','IPVA 2026 • Range Rover','expense','IPVA','Itaú Personnalité',18460,'2026-02-18'),
    demoTx('iptu','IPTU 2026 • Mansão Jardins','expense','IPTU','Itaú Personnalité',14820,'2026-02-10'),
    demoTx('viagem','Viagem internacional • Mediterrâneo','expense','Viagens','Amex Platinum',186400,'2026-07-14'),
    demoTx('relogio','Relógio de coleção','expense','Bens pessoais','Visa Infinite',92400,'2026-08-09'),
    demoTx('seguro','Seguro anual da lancha','expense','Seguros','BTG Banking',38700,'2026-09-03'),
    demoTx('marina','Combustível e marina','expense','Transporte','Visa Infinite',12880,'2026-09-17'),
    demoTx('doacao','Doação ao Instituto Horizonte','expense','Doações','PIX',25000,'2026-09-21')
  );
  return normalizeState({demo:true,transactions,
    assets:[
      {id:'demo_a1',name:'Mansão Residencial Jardins',kind:'asset',category:'Imóvel',value:8500000,date:'2026-09-25'},
      {id:'demo_a2',name:'Fazenda Santa Aurora',kind:'asset',category:'Imóvel rural',value:4200000,date:'2026-09-25'},
      {id:'demo_a3',name:'Sala comercial corporativa',kind:'asset',category:'Imóvel',value:2350000,date:'2026-09-25'},
      {id:'demo_a4',name:'Porsche 911 Turbo S',kind:'asset',category:'Veículo',value:1550000,date:'2026-09-25'},
      {id:'demo_a5',name:'Range Rover Autobiography',kind:'asset',category:'Veículo',value:1180000,date:'2026-09-25'},
      {id:'demo_a6',name:'Lancha Intermarine 62',kind:'asset',category:'Embarcação',value:4900000,date:'2026-09-25'},
      {id:'demo_d1',name:'Financiamento da Fazenda',kind:'debt',category:'Financiamento',value:1380000,date:'2026-09-25'},
      {id:'demo_d2',name:'Fatura Amex Platinum',kind:'debt',category:'Cartão',value:76380,date:'2026-09-25'}],
    investments:[
      {id:'demo_i1',name:'Tesouro IPCA+ e títulos bancários',type:'Renda fixa',value:6200000,monthlyIncome:58900},
      {id:'demo_i2',name:'Carteira de ações brasileiras',type:'Ações',value:4750000,monthlyIncome:33250},
      {id:'demo_i3',name:'Fundos imobiliários',type:'Fundos imobiliários',value:3100000,monthlyIncome:27900},
      {id:'demo_i4',name:'Fundos globais e ETFs',type:'Outros',value:2850000,monthlyIncome:17100},
      {id:'demo_i5',name:'Bitcoin e ativos digitais',type:'Criptomoedas',value:1250000,monthlyIncome:0}],
    goals:[
      {id:'demo_g1',name:'Aumentar carteira internacional',target:5000000,current:2850000,deadline:'2027-12-31'},
      {id:'demo_g2',name:'Quitar financiamento da Fazenda',target:2400000,current:1020000,deadline:'2028-06-30'},
      {id:'demo_g3',name:'Fundo filantrópico familiar',target:1000000,current:425000,deadline:'2029-12-31'}],
    taxes:[
      {id:'demo_t1',name:'IPVA • Porsche 911 Turbo S',period:'2026-01',amount:28940,situation:'Pago',sphere:'Estadual',reason:'Somente organizar',status:'Não aplicável',evidence:'Comprovante fictício IPVA-2026-001',notes:'Valor demonstrativo.'},
      {id:'demo_t2',name:'IPVA • Range Rover',period:'2026-02',amount:18460,situation:'Pago',sphere:'Estadual',reason:'Somente organizar',status:'Não aplicável',evidence:'Comprovante fictício IPVA-2026-002',notes:'Valor demonstrativo.'},
      {id:'demo_t3',name:'IPTU • Mansão Jardins',period:'2026-09',amount:14820,situation:'Apurado',sphere:'Municipal',reason:'Somente organizar',status:'A verificar',evidence:'Parcela fictícia 9/10',notes:'Uma parcela mensal demonstrativa.'},
      {id:'demo_t4',name:'IRPF retido sobre rendimentos',period:'2026-08',amount:32750,situation:'Retido',sphere:'Federal',reason:'Conferir restituição do IRPF',status:'A verificar',evidence:'Informe fictício',notes:'Conferência demonstrativa; não representa crédito reconhecido.'}],
    accounts:[{name:'Itaú Personnalité',balance:682450},{name:'BTG Banking',balance:318700}],
    cards:[{name:'Amex Platinum',limit:350000,invoice:76380,due:'07/10'},{name:'Visa Infinite',limit:180000,invoice:42890,due:'12/10'}],
    obligations:[{name:'IPTU • Mansão',value:14820,due:'10/10',status:'Parcela 9/10'},{name:'Fatura Amex',value:76380,due:'07/10',status:'Aberta'},{name:'Fatura Visa',value:42890,due:'12/10',status:'Aberta'},{name:'Financiamento da Fazenda',value:36400,due:'15/10',status:'33/72'}],preferences:demoPreferences()});
}

function demoCnpjData(){
  const transactions=[];
  ['01','02','03','04','05','06','07','08','09'].forEach((m,i)=>{const d=`2026-${m}`;transactions.push(
    demoTx(`c${m}_fat`,'Faturamento mensal da holding','income','Receita empresarial','Itaú Empresas',520000+i*18500,`${d}-05`),
    demoTx(`c${m}_folha`,'Folha e encargos administrativos','expense','Folha de pagamento','Itaú Empresas',68500,`${d}-07`),
    demoTx(`c${m}_forn`,'Fornecedores e serviços especializados','expense','Fornecedores','Itaú Empresas',94000+i*2200,`${d}-12`),
    demoTx(`c${m}_imp`,'Tributos provisionados','expense','Impostos','Itaú Empresas',78500+i*2500,`${d}-20`),
    demoTx(`c${m}_lucro`,'Distribuição de lucros ao sócio','expense','Distribuição de lucros','Itaú Empresas',i%3===0?120000:65000,`${d}-25`)
  );});
  return normalizeState({demo:true,transactions,assets:[
    {id:'demo_ca1',name:'Caixa e disponibilidades',kind:'asset',category:'Conta empresarial',value:1245800,date:'2026-09-25'},
    {id:'demo_ca2',name:'Participações societárias',kind:'asset',category:'Participações',value:7200000,date:'2026-09-25'},
    {id:'demo_cd1',name:'Obrigações com fornecedores',kind:'debt',category:'Fornecedores',value:284000,date:'2026-09-25'}],investments:[],goals:[{id:'demo_cg1',name:'Caixa para novas aquisições',target:3000000,current:1245800,deadline:'2027-12-31'}],taxes:[
    {id:'demo_ct1',name:'IRPJ/CSLL • apuração trimestral',period:'2026-09',amount:186400,situation:'Apurado',sphere:'Federal',reason:'Somente organizar',status:'A verificar',evidence:'Memória fictícia 3º trimestre',notes:'Lucro Presumido informado pelo perfil. Valores apenas demonstrativos.'},
    {id:'demo_ct2',name:'ISS sobre serviços',period:'2026-09',amount:26400,situation:'Apurado',sphere:'Municipal',reason:'Somente organizar',status:'A verificar',evidence:'Guia fictícia',notes:'Valor demonstrativo.'}],accounts:[{name:'Itaú Empresas',balance:1245800}],cards:[],obligations:[{name:'IRPJ/CSLL trimestral',value:186400,due:'30/10',status:'Agendado'},{name:'Fornecedores',value:94000,due:'05/10',status:'Agendado'}],preferences:demoPreferences()});
}

function createDemoWorkspace(){return{version:4,activeId:'demo_cpf',profiles:[
  {id:'demo_cpf',name:'Augusto Valença • Demonstração',kind:'CPF',occupation:'Autônomo',regime:'',revenue:'',advanced:true,data:demoCpfData()},
  {id:'demo_cnpj',name:'Valença Participações Ltda.',kind:'CNPJ',occupation:'',regime:'Lucro Presumido',revenue:'650000',advanced:true,data:demoCnpjData()}
]};}

function loadDemoWorkspace(){workspace=createDemoWorkspace();state=workspace.profiles[0].data;localStorage.setItem('carteiraBentoWorkspaceV4',JSON.stringify(workspace));renderAll();switchSection('dashboard');}
