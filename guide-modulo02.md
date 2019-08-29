# Guia para desenvolvimento do backend

---

# Módulo 2

---

## 1. Configurando Multer

---

Multer é middleware que permite fazer uploads de arquivos através do `multipart/form-data`.

- A forma mais comum é mandar imagem junto com os dados.
- A outra forma é o upload isolado de arquivos.

```sh
yarn add multer
```

_instalando o multer_

1. Criar na raiz a pasta `/tmp/uploads`, essa será a pasta onde ficarão os arquivos "upados".
2. Criar arquivo de configuração do multer `config\multer.js`.

```javascript
export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'updloads'),
    filename: (req, file, cb) => {
      crypto: randomBytes(16, (err, res) => {
        if (err) return cb(err);
        return cb(null, res.toString('hex') + extname(file.originalname));
        //25b906d92bb4ac88.png
      });
    },
  }),
};
```

> Definir as configurações: destination e filename.

> destination: define a pasta onde os arquivos serão gravados

> filename: utilizar pacote crypto (node) para gerar um hexa randomico. Utilizar o hexa gerado como nome do arquivo e utilizar o extname para manter a extensão orignal do arquivo. O nome original do arquivo pode ser acessado através do atributo originalname.

3. Em routes importar o multerConfig, criar uma rota para uploads.

```javascript
import multer from 'multer';
import multerConfig from './config/mulkter';
...

const upload = multer(multerConfig)
routes.post('/files', upload.single('file'), FileController.store)

```

## Avatar do usuário

1. Criar um `FileController`, com método store.

```javascript
...
async store(req, res) {
  return res.json(req.file)
}
```

2.  Criar uma migrate para a tabela de arquivos `files`.

```sh
yarn sequelize migration:create --name=create-files
```

3. Definir os campos da tabela no arquivo da migrate e roda-la para criar a tabela.

```sh
yarn sequelize db:migrate
```

4.  Criar o model para `files`.
5.  No arquivo `src/database/index.js` inserir o model `files` no array de model
6.  No `FileController` modificar o método store.

```javascript
import File from '../models/File';
...
async store(req, res) {
 const {originalname: name, filename: path} = req.file;
 //salvar os dados do arquivo na tabela
 const file = await file.create({
   name,
   path,
 });
 return res.json(file);
```

### Vinculando a imagem ao usuário

Criar um relacionamento entre a tabela users e files.

1. Criando migrate para adcionar o novo campo na tabeça users

```sh
yarn sequelize migrate:create --name=add-avatar-field-to-users
```

2. migration com a nova coluna e a referência (fk)

> Tabela: users, Nova Coluna: avatar_id

```javascript
...
queryInterface.addColumn('users','avatar_id', {
  type: Sequelize.INTEGER,
  references: {model: 'files', key: 'id'},
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL',
  allowNull: true,
});
```

3. Rodar a migration

4. Incluir o associate no model `User`

```javascript
...
static associate(models) {
  this.belongsTo(models.File, {foreignKey: 'avatar_id'}, as: 'avatar');
}
```

5. chamar o método associate no `src/database/index.js`, acrescentando:

```javascript
...
  models
  .map(...)
  .map(model => model.associate && model.associate(this.connection.models));
```

## Listagem de prestadores de serviço

```javascript
...

  const providers = await User.findAll({
    where: {provider: true},
    attributes: ['id','name','email','avatar_id'],  //campos a serem retornados
    include: [{
      model: File,
      as: 'avatar',
      attributes: ['name', 'path', 'url']
    }] //tabelas, com definição de campos a serem adicionadas no retorno
  })
  ...
```

1. Criar campo url no model File

```javascript
...
url: {
  type: Sequelize.VIRTUAL,
  get() {
    return `http://localhost:3333/files/${this.path}`;
  }
}
```

> Com essa alteração a listagem de prestadores retorna a url da imagem. No entanto, a URL ainda não eastá acessível. E devemos então seguir a instrução abaixo:

2.  Em `app.js` adicionar um middleware para servir arquivos estáticos.

```javascript
...
this.server.use('/files', express.static(path.resolve(__dirname, )));


## Migration e model de agendamento

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
```
