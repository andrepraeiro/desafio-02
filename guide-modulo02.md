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
import multerConfig from './config/multer';
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
yarn sequelize migration:create --name=add-avatar-field-to-users
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
this.server.use('/files',express.static(
    path.resolve(__dirname, '..', 'tmp', 'uploads' )
  )
);
```

## Validações de agendamento

Utilizar a biblioteca date-fns para métodos de manipulação de data e hora.

```sh
yarn add date-fns
```

## Aplicando paginação

Aplicar limit e offset no findAll do model.

## Configurando MongoDB

Criar o container do mongodb

```sh
docker run --name mongobarber -p 27017:27017 -d -t mongo
```

Instalar o ORM do mongo

```sh
yarn add mongoose
```

Em `src/database/index` configurar o mongoose.

```javascript
import mongoose from 'mongoose';
...
constructor() {
  ...
  this.mongo();
}
...
mongo() {
  this.mongoConnection = mongoose.connect(
    'mongodb://localhost:27017/gobarber',
    { useNewUrlParser: true, useFindAndModify: true}
  );
}
```

## Notificando novos agendamentos

- Enviar notificação para o prestador de serviço.
- Schemas do mongo

1. Cria em `app` a pasta `schemas` e dentro dela o arquivo `Notification.js`.

```javascript
import mongoose from 'mongoose';
const NotificationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: Number,
      required: true,
    },
    read: {
      type: boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model('Notification', NotificationSchema);
```

2. no método store do AppointmentController.

```javascript
...
await Notification.create({
  content: 'Novo agendamento de Cliente #1 para o dia xx de xxxx à 99:99h',
  user: provier_id,
});

```

## Marcar notificações como lidas

Usar método do model findByIdAndUpdate

## Configurando Nodemailer

Enviar email ao cancelar um agendamento

```
yarn add nodemailer
```

1. criar config mail.

```javascript
export default {
  host: '',
  port: '',
  secure: false,
  auth: {
    user: '',
    pass: '',
  },
  default: {
    from: 'Equipe GoBarber <noreply@gobarber.com>',
  },
};
```

Ambiente de email pago
Amazon SES, Mailgun, SparkPost, Mandril (mailchip)

Mailtrap (ambiente de email para dev)

2. Criar pasta `src/lib`, e criar arquivo `mail.js`

```javascript
...
import nodemailer
...

this.transporter = nodemailer.createTransport({
  host, port, secure, auth: auth.user? auth : null,
});
```

3. método sendMail

```javascript
return this.transporter.sendMail({
  ...mailConfig.default,
  ...message,
});
```

4. utilizando o sendMail

```javascript
...
await Mail.sendMail({
  to: `${appointment.provider.name}<${appointment.provider.email}>`,
  subject: 'Agendamento Cancelado',
  text: 'Cancelamento realizado',
})
```

## Configurando templates de e-mail

Template engine - Handlebars

```sh
yarn add express-handlebars nodemailer-express-handlebars
```

1. Criar pastas `src/app/views/emails`
2. Dentro de `src/app/views/emails`, criar `/layouts` e `/partials`
3. Dentro de `src/app/views/emails`, criar cancellation.hbs
4. Dentro de `src/app/views/emails/layouts`, criar default.hbs

> default.hbs

```
<div
  style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #222; max-width: 600px">
  {{{ body }}}
  {{> footer }}
</div>
```

> src/app/views/emails/partials/footer.hbs

```
<br />
Equipe GoBarber
```

> src/app/views/emails/partials/cancellation.hbs

```
<strong> Olá, {{provider}}</strong>

<p>Houve um cancelamento de horário, confira os detalhes abaixo:</p>
<p>
  <strong>Cliente: </strong> {{ user }} <br />
  <strong>Data/hora: </strong> {{ date }} <br />
  <br />
  <small>
    O horário está novamente disponível para novos agendamentos.
  </small>
</p>

```

5. Em `src/lib/mail.js`

```javascript
...
import hbs from 'nodemailer-express-handlebars';
import exphbs from 'express-handlebars';
...
 constructor() {
   ...
    this.configureTemplate();
    ...
 }

 configureTemplate() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    this.transporter.use(
      'compile',
      hbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }
```

## Configurando fila com Redis

Utilizar o sistema de filas para melhorar o desempenho.

Da forma atual o envio de emails está lenvando muito tempo. A ideia é deixar essa responsabilidade com as filas (brackground jobs), que são serviços que rodam em segundo plano.

1. Para isso vamos usar o Redis, que é um banco não relacional, sem schema, apenas chave-valor.

> Criando uma instância do Redis em um docker container

```sh
docker run --name redisbarber -p 6379:6379 -d  -t redis:alpine
```

2. Instalar o Bee Queue, biblioteca de controle de filas.

```sh
yarn add bee-queue
```

3. Criar `src/config/redis.js`

```javascript
{
  host:'127.0.0.1',
  port:6379,
}
```

4. Criar `src/lib/queue.js`

```javascript
import Bee from 'bee-queue';
...
const jobs = [CancellationMail];
...

constructor() {
  this.queues = {};
  ths.init();
}

init() {
  jobs.forEach(({key, handle}) => {
    this.queues[key] = {
      bee: new Bee(key, {
        redis:redisConfig,
      }),
      handle,
    }
  });
}

add(queue, job) {
  return this.queues[queue].bee.createJob(job).save();
}

processQueue() {
  jobs.forEach(job => {
    const {bee, handle} = this.queues[job, key];
    bee.process(handle);
  })
}

```

5. Criar `src/app/jobs/CancellationMail.js`

```javascript
class CancellationMail
...
get key() {
  return 'CancellationMail'
}

async handle(data) {
  Mail.send({
    ...
  });
}
```

> A ideia é uma fila para cada background job

6. Em `AppointmentController` substituir o código de envio de email por:

```javascript
...

await Queue.add(CancellationMail.key, {
  appointment
})

...
```

7. Criar `src\queue.js`

```javascript
import Queue from './lib/Queue';

Queue.processQueue();
```

8. No `package.json` adicionar novo script

```json
"scripts": {

  "queue": "nodemon src/queue.js"
}
```

## Monitorando falhas na fila

1. Em `src/lib/queue.js`

```javascript
...

processQueue() {
  ...
  bee.on('failed', this.handleFailure).process(handle);
  ...
}

...

handleFailure(job, err) {
  console.log(`Queue ${job.queue.name}: FAILED`, err);
}
```

## Tratamento de exceções

1. abrir uma conta no <https://sentry.io>
2. seguir instruções do site.

## Variáveis ambiente

1. Configurar variáveis de ambiente
