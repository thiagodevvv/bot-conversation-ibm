/// Lets go use "  ; "

require('dotenv').config();

const cors = require('cors')
const express = require('express');
const app = express();
const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const PORT =  8000;

app.use(cors());
app.use(express.json());

app.post('/', (req,res) => {
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
})
app.listen(PORT, () => console.log(`Server started in port::: ${PORT}`));




