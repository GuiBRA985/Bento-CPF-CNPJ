function renderAll(){
  renderDashboardMetrics();renderHealth();renderRecentTransactions();renderTransactions();
  renderAssets();renderInvestments();renderGoals();renderAssetSummary();
  renderProfiles();renderTaxes();
  requestAnimationFrame(drawChart);
}

document.addEventListener('DOMContentLoaded',()=>{
  $$('.nav-item').forEach(btn=>btn.addEventListener('click',()=>switchSection(btn.dataset.section)));
  $$('[data-section-jump]').forEach(btn=>btn.addEventListener('click',()=>switchSection(btn.dataset.sectionJump)));
  $('#menuBtn').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
  $('#closeModal').onclick=closeModal;
  $('#modalBackdrop').addEventListener('click',e=>{if(e.target.id==='modalBackdrop')closeModal()});

  $('#newEntryBtn').onclick=openTransaction;
  $('#newEntryBtn2').onclick=openTransaction;
  $('#newAssetBtn').onclick=openAsset;
  $('#newInvestmentBtn').onclick=openInvestment;
  $('#newGoalBtn').onclick=openGoal;

  $('#transactionFilter').onchange=renderTransactions;
  $('#chartPeriod').onchange=drawChart;

  $('#clearBtn').onclick=()=>{if(confirm('Apagar os registros somente da carteira em uso? Os outros perfis serão mantidos. Exporte um backup antes de continuar.')){resetState();showToast('Todos os dados foram apagados.')}};
  $('#exportBtn').onclick=()=>{exportBackup();showToast('Backup exportado.')};
  $('#importInput').onchange=e=>{if(e.target.files[0])importBackup(e.target.files[0])};

  initProfiles();

  window.addEventListener('resize',()=>{if(currentSection==='dashboard')drawChart()});
  renderAll();
});

