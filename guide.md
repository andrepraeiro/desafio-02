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

## Configurando o docker

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

## Sequelize

- Criar dentro de src a pasta config para guardar os arquivos de configuração.

- Na pasta config criar o arquivo database.js

- Criar dentro de src a pasta database e dentro desta a pasta migrations

- Criar dentro de src a pasta app e dentro desta as pasta controllers e models

- instalar o sequelize e sequelize-cli

```sh
yarn add sequelize
yarn add sequelize-cli -D
```

- criar na raiz o arquivo sequelizerc. Esse arquivo configura as pastas de exportação.

```javascript
const { resolve } = require('path');

module.exports = {
  config: resolve(__dirname, 'src', 'config', 'database.js'),
  'models-path': resolve(__dirname, 'src', 'app', 'models'),
  'migrations-path': resolve(__dirname, 'src', 'database', 'migrations'),
  'seeders-path': resolve(__dirname, 'src', 'database', 'seeds'),
};
```

- Configurar o database.js

```javascript
module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'meetapp',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
```

## Migration de usuários

Utilizar o sequelize-cli para gerar as migrations

```sh
yarn sequelize migration:create --name create-users
```

O comando via gerar o arquivo da migration na pasta src/database/migrations.

```javascript
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('users');
  },
};
```

Executar o comando abaixo para gerar as tabelas no banco.

```sh
yarn sequelize db:migrate
```

## Model de usuário

- Criar na pasta model User.js.

## Criando loader de model

- Criar index.js na pasta database. Esse arquivo faz conexão com o banco de dados e carrega os dados nos models.

- Os models devem ser adicionados no array model, para que o mesmo seja registrado.

```javascript
import Sequelize from 'sequelize';

import DatabaseConfig from '../config/database';

import Users from '../app/models/User';

const models = [Users];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(DatabaseConfig);
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
```

- adicionar um import do database no app.js (sem const)

- Como teste adicionar em routes um rota get que executa o método create do model User. Como resultado esse método cadastra dados na tabela user.

## Cadastro de usuários

- 1. Criar UserController na pasta controller

- 2. Adicionar método store e o comando para cadastrar usuários pelo model.

```javascript
const user = await User.create(req.body);
```

- 3. importar o UserController na routes

- 4. Criar a rota post no resource users, linkando o método store do UserController.

```javascript
routes.post('/users', USerController.store);
```

- 5. Testar o post no insomnia.

6. Incluir validação no UserController se usuário já existe (através do email).

## Gerando hash da senha

Ao acadastrar o usuário deve enviar a senha, e a aplicação gerar o hash referente a senha enviada.

Para isso, devemos instalar a extensão `bcrypt.js`.

```sh
yarn add bcryptjs
```

- Para usá-lo, deve realizar um import do bcrypr no model. - Criar um campo virtual para a password.
- adicionar um hook `beforeSave` no model para gerar o hash da password.

```javascript
this.addHook('beforeSave', (user) => {
  if (user.password){
    user.password_hash = await bcrypt.hash(user.password, 8)
  }
});
```

- 8 representa a quantidade de rounds da criptografia.

* acrescentar o método `checkPassword`, onde recebendo uma senha deve comparar se é correspondente ao hash.

```javascript
checkPassword(password) {
  return bcrypt.compare(password, this.password_hash);
}
```

## Autenticação JWT

- Criar um controller `SessionController` com método store, para gerenciar sessões.
- adicionar uma nova extensão `jsonwebtoken`

```sh
yarn add jsonwebtoken
```

- importar o jwt no `SessionController`
- consultar pelo email se o usuário exsite
- se não existir retornar que o usuário não existe
- verificar se a senha é válida utilizando o método checkPassword do user model. Se a senha for inválida retornar que a senha não bate.
- Se passou por tudo e não retornou nada inválido, retornar os dados do user (id, name, email) e adicionar o token.

```javascript
token: jwt.sign({ id }, secret);
expiresIn: '7d';
```

- definir os dados do token (secret e expiresIn) em um arquivo de configuração `config/auth.js`.

## Middleware de autenticação

- Adicionar um método update no `UserController`.
- Adicionar em routes uma rota de update de usuários. `PUT /users`.
- Atualmente essa rota está desprotegida e não exige autenticação.
- Adicionar um middleware de autenticação

### Promisify

Utilizar o promisify para transformar chamadas callback em assícronas;

- Criar em app uma pasta middleware e uma arquivo auth.js, com o seguinte formato:

```javascript
import {promisify} from 'util'
export default (req, res, next) => {
  const authHeader = req.headers.authorization;
  ...
  const decoded = await promisify(jwt.verify)(token, authConfig.secret);
  //adiciona na req o id do usuário autenticado
  req.UserId = decoded.id
  return next();
};
```

- importar o auth middleware no router.
- adicionar o use o middler acima das rotas que precisam ser autenticadas. (qualquer rota abaixo desse use será autenticada);

```javascript
routes.use(authMiddleware);
```

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
