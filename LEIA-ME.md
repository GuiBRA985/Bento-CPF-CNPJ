# Carteira Bento — CPF e CNPJ

Atualização da versão existente em GuiBRA985/Bento-Carteira, preparada em 21/09/2026.

## Publicação

1. Na carteira atual, use **Exportar backup** e guarde o JSON antes da atualização.
2. Extraia o ZIP e envie o conteúdo desta pasta para a raiz do repositório Bento-Carteira. Preserve outros arquivos existentes. Os arquivos modificados são index.html, css/style.css, js/storage.js, js/ui.js e js/app.js; js/profiles.js é novo. Os demais arquivos do app são cópias da versão consultada.
3. Mantenha o CNAME com carteira.bento.host. Aguarde a publicação do GitHub Pages e atualize a página.
4. No mesmo navegador e endereço, os registros antigos aparecem na carteira principal. Escolha CPF ou CNPJ para identificá-la. O armazenamento antigo V3/V2/V1 permanece intacto.
5. Adicione outras carteiras pelo menu. Cada perfil tem lançamentos, patrimônio, investimentos, metas e tributos próprios.

## Funcionamento

- Modo demonstração com dois perfis fictícios: CPF milionário e sua holding CNPJ, com histórico desde 01/01/2026.

- Entrada por CPF (CLT, autônomo, ambos, aposentado ou outra situação) ou CNPJ (faturamento mensal de referência e regime informado).
- O faturamento cadastral não cria lançamentos e não determina automaticamente o regime.
- Modo simples inicial; o botão **Mostrar todas as funções** apresenta patrimônio, investimentos e metas. Perfis migrados que já têm esses dados começam com as funções completas visíveis.
- **Meus tributos** registra valor, período, situação, esfera, motivo da conferência, referências documentais e status. Permite atualizar o acompanhamento.
- Orientações de recuperação são condicionadas às respostas do usuário e à esfera do tributo. Não representam reconhecimento de crédito. Os requisitos e prazos são conferidos no serviço oficial.
- Registros de tributos não alteram o saldo, inclusive quando marcados como recebidos. Registre o pagamento ou recebimento efetivo uma única vez em Lançamentos.
- Exportação inclui todos os perfis. Importação de backup V4 substitui os perfis após confirmação; uma cópia anterior fica na chave carteiraBentoAntesImportacao. Backup antigo é importado como novo perfil separado.
- **Apagar dados** apaga os registros apenas da carteira selecionada.

## Limites desta entrega

Esta é a primeira adaptação funcional da carteira existente. Os dados continuam locais, no navegador; não há autenticação nem sincronização entre dispositivos. Os perfis não são contas autenticadas e não exigem os números de CPF/CNPJ nesta etapa.

Não há cálculo tributário automático, verificação de enquadramento, importação de documentos fiscais, leitura de dados da Receita, envio de declaração/pedido ou consulta automática de status. Base de cálculo e alíquota podem ser anotadas manualmente. Transferências entre perfis ainda não têm conciliação automática. Não há consolidação de patrimônio entre CPF e CNPJ, para evitar somar indiscriminadamente valores de naturezas distintas.

## Fontes

Educação financeira exclusivamente com referências Sebrae, links na seção Aprender com o Sebrae. Não há uso do PDF UTFinova como fonte do conteúdo educativo.

Procedimentos fiscais: serviço oficial Obter restituição, ressarcimento ou reembolso de tributos federais e página PER/DCOMP Web da Receita Federal, consultados em 21/09/2026. Cada registro aponta o canal aplicável à conferência; as fontes são públicas, sem vínculo ou endosso institucional.

Cálculos e critérios tributários por período, regime e atividade devem ser implementados em etapas posteriores com fonte normativa, memória de cálculo e testes próprios.

## Verificação realizada

Passaram os testes automatizados de migração V3, persistência V4, isolamento dos perfis, exclusão por perfil, rejeição de formatos inválidos e sintaxe JavaScript. Em DOM simulado, passaram cadastro CPF/CNPJ, lançamento de receita, registro e atualização de tributos sem alteração do saldo, alternância de carteiras e modo avançado. A inspeção visual em navegador real, inclusive mobile, ficou pendente por indisponibilidade do navegador de teste.
