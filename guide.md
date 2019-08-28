# Guia para desenvolvimento do backend

---

## #Módulo 1

## Iniciando o projeto

1. Criar pasta do projeto
2. yarn init para criar o projeto
3. instalar o express (servidor)
4. Criar pasta scr para manter no código da aplicação
5. Dentro da pasta src o app.js, server.js, router.js

## Arquivo App

Arquivo app implementar em classes.

- 1. Importar o express (com require), criar a classe app, no constructor, definir a variavel server recebendo o expresss. Criar métodos middlwares e routes.
- 2.  metodo middlerware, aplicar o user no server para utlizar o middlewere express.json.
- 3.  metodo routes: importar o arquivo routes e seta-lo como middleware no métodos routes.
- 4.  incluir a chamada dos métodos middleware e routes no constructor da classe app.
- 5.  exportar a variavel server da classe app(module.exports)

## Arquivo server.js

- 1.  importar a classe app
- 2.  chamar o metodo listen do app passando a numero da porta como parametro (3333).

(separar o server do app ajuda nos testes unitários, pois nesse caso não inicia o servidor).

## Arquivo routes.js

- 1.  Importar o Router do express.
- 2. Inicializar o router na const routes(new Router()).
- 3. Exportar routes.

## Nodemon e Sucrase

Sucrase para usar o ES6 e nodemon para live reload.

- 1. adicionar as dependencias: sucrase e nodemon.
- 2. Alterar em todos os arquivos os requires por imports.
- 3. Substituir o module.exports por export default.
- 4. comando sucrase-node executa em es6.
- 5. no package adcionar o scripts de dev: nodemon src/server.js
- 6. criar arquivo de configuração do nodemon (nodemon.json), com um objeto, propriedade execMap.js = sucrase-node.

##Configurando o docker

Utilizar o docker para instanciar container com um server do postegres.

```sh
docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```

Utilizar o postbird para gerenciar o banco de dados do postgres.

## ESLint, Prettier & EditorConfig

```sh
yarn add eslint -D
yarn eslint --init
```

Adicionar no vscode a extensão eslint.

### Eslint

## 1. Configurando Multer

---

Multer é middleware que permite fazer uploads de arquivos através do `multipart/form-data`.

- Criar arquivo de configuração do multer `confif\multer.js`.
- definir as configurações: destination e filename.
- destination: define a pasta onde os arquivos serão gravados
- filename: instalar o pacote crypto paara gerar um hexa randomico. Utilizar o hexa gerado como nome do arquivo e utlizar o extname para manter a extensão orignal do arquivo. O nome original do arquivo pode ser acessado através do atributo originalname.

Avatar do usuário
Listagem de prestadores de serviço
Migration e model de agendamento
Agendamento de serviço
Validações de agendamento
Listando agendamentos do usuário
Aplicando paginação
Listando agenda do prestador
Configurando MongoDB
Notificando novos agendamentos
Listando notificações do usuário
Marcar notificações como lidas
Cancelamento de agendamento
Configurando Nodemailer
Configurando templates de e-mail
Configurando fila com Redis
Monitorando falhas na fila
Listando horários disponíveis
Campos virtuais no agendamento
Tratamento de exceções
Variáveis ambiente
