# Guia para o continuar o desenvolvimento do backend

---

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
