const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const mongoose = require('../config/db');
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/User');


async function newUser(req,res) {

    const newUser = {
        nome: req.body.nome,
        saldo: req.body.saldo,
        limite_emprestimo: req.body.limite_emprestimo,
        extrato: [],
        emprestimo_abertos: {},
        fatura_atual: 0
    }
    try {
        const data = await User.create(newUser);
        if(data._id) return res.status(200).send(data);
    }catch(err) {
        console.log(`Erro ao criar usuário:: ${err}`);
    }
}

async function getSaldo(req,res) {
    const user = req.params.id
    try {
        const conn = await mongoose.connection
        const saldo = await conn.collection('users').findOne({_id: new ObjectId(user)})
        console.log(saldo.saldo)
        return res.status(200).send({
            saldo: saldo.saldo
        })
    }catch(err) {
        console.log(`Erro ao pegar saldo:::: ${err}`)
    }
}

async function conversationBot(req,res) {
    const assistant = new AssistantV2({
        version: '2021-06-14',
        authenticator: new IamAuthenticator({
          apikey: process.env.IBM_API_KEY,
        }),
        serviceUrl: process.env.SERVICE_URL,
        disableSslVerification: true,
      });
      assistant.createSession({
          assistantId: process.env.ASSISTANT_ID
      }).then(data => {
          console.log(JSON.stringify(data.result.session_id));
          assistant.message({
              assistantId: process.env.ASSISTANT_ID,
              sessionId: data.result.session_id,
            //   input: {
            //       'message_type': 'text',
            //       'text': `${req.body.text}`
            //   }
          }).then((data) =>  {
              return res.send(data.result);
          }).catch(err => {
              console.log(`Erro ao mandar/receber mensagem::: ${err}`);
          })
      }).catch(err => {
          console.log(`Erro ao criar sessão: ${err}`);
      })
}


module.exports = {
    newUser,
    conversationBot,
    getSaldo
}