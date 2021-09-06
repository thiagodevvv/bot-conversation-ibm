const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const mongoose = require('../config/db');
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/User');


async function newUser(req,res) {
    const saldo = req.body.saldo
    const limiteEmpres = req.body.limite_emprestimo
    const fatura = 120542
    const moedaBRL = saldo.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    const EmprestimoMoedaBBRL = limiteEmpres.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})

    const newUser = {
        nome: req.body.nome,
        saldo: moedaBRL,
        limite_emprestimo: EmprestimoMoedaBBRL,
        extrato: [],
        emprestimo_abertos: {},
        fatura_atual: fatura.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    }
    try {
        const data = await User.create(newUser);
        if(data._id) return res.status(200).send(data);
    }catch(err) {
        console.log(`Erro ao criar usuário:: ${err}`);
    }
}

async function getDataUser(req,res) {
    const user = req.body.id
    try {
        const conn = await mongoose.connection
        const data = await conn.collection('users').findOne({_id: new ObjectId(user)})
        return res.status(200).send({
            data: data
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
              input: {
                  'message_type': 'text',
                  'text': `${req.body.text}`,
              },
              context: {
                  global: {
                      system: {
                        turn_count: 1,
                        user_id: `${req.body.id}`
                      }
                  }
              }
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
    getDataUser
}