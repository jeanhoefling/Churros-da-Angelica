# Churros da Angélica - Sistema de Gestão de Pedidos e Vendas

##  Observações:

Este projeto é uma evolução do que foi utilizado como projeto final do CS50 - Introduction to Computer Science. Ainda pretendo fazer outras evoluções no projeto, como uma interface de admin, prepará-lo para futuro deploy, integração com api's de pagamento, etc... 
A versão utilizada para o curso CS50x está no repositório https://github.com/jeanhoefling/Churros-da-Angelica-CS50, onde não utilizei IA para gerar código, com o objetivo de desenvolver minhas habilidades.

---

#### Descrição:

Este projeto foi desenvolvido com o objetivo de facilitar a organização dos pedidos de uma pequena venda de churros, inspirado diretamente no trabalho da minha mãe. Antes do sistema, os pedidos eram anotados manualmente em papel, o que causava dificuldades de organização, perda de informações e falta de controle sobre vendas e histórico.

O sistema foi criado como uma aplicação web simples, permitindo centralizar o gerenciamento de pedidos e gerar relatórios de vendas de forma automatizada.

---

## Funcionalidades principais

A aplicação permite que o usuário crie novos pedidos através de um formulário na página de inserção de pedidos. Cada pedido contém informações como nome do cliente, número de WhatsApp, quantidade de produtos (churros tradicional, recheado e mini), observações adicionais e o valor total calculado automaticamente.

Após criados, os pedidos são armazenados em um banco de dados SQLite e podem ser visualizados na página de pedidos. Nessa página é possível acompanhar todos os pedidos em andamento, ver há quanto tempo foram feitos e também concluir ou cancelar pedidos.

Além disso, existe uma página de vendas que funciona como um painel de controle. Nela é possível filtrar vendas por intervalo de datas e visualizar métricas como faturamento total, número de pedidos, ticket médio e quantidade total de produtos vendidos. Também há um gráfico de evolução de vendas e uma seção que mostra os produtos mais vendidos.

---

## Estrutura do projeto

O projeto foi organizado da seguinte forma:

### app.py
Arquivo principal da aplicação Flask. Contém todas as rotas do sistema, conexão com o banco de dados SQLite e lógica principal de criação, listagem, atualização e remoção de pedidos.

---

### churros.db
Banco de dados SQLite responsável por armazenar todas as informações dos pedidos, incluindo dados do cliente, produtos, valores, status e data do pedido.

---

### templates/
Contém todos os arquivos HTML da aplicação:

- **index.html** → Página inicial do sistema
- **pedidos.html** → Página onde são exibidos os pedidos em andamento
- **inserir-pedido.html** → Formulário para criação de novos pedidos
- **vendas.html** → Página de relatórios e análise de vendas
- **menu.html** → Componente reutilizável de menu presente em todas as páginas
- **footer.html** → Componente reutilizável de rodapé

---

### static/
Contém arquivos estáticos da aplicação:

- **css global** → Estilos gerais do site
- **js/** → Scripts JavaScript específicos de cada página (como lógica de pedidos e gráficos)
- **assets/** → Imagens utilizadas no sistema (ícones, imagens de churros, etc.)

---

## Decisões de design

O sistema foi desenvolvido com foco em simplicidade e uso real por uma pequena empresa familiar. Por isso, não foram implementados sistemas de login ou autenticação, já que o objetivo atual é apenas uso interno por uma única pessoa.

A aplicação foi estruturada para ser leve e fácil de manter, utilizando Flask no backend e SQLite como banco de dados, evitando complexidade desnecessária.

No frontend, foi utilizado JavaScript para melhorar a interatividade, especialmente na renderização dinâmica dos pedidos e na geração de gráficos na página de vendas.

---

## Possíveis melhorias futuras

O projeto foi pensado de forma que possa evoluir para uma plataforma completa de pedidos online, onde clientes possam fazer pedidos diretamente pelo site. Para isso, seriam necessários sistemas de autenticação, controle de usuários e possivelmente integração com pagamentos online.

Essas funcionalidades não foram implementadas nesta versão por estarem fora do escopo atual de aprendizado, mas são consideradas evoluções naturais do projeto.
