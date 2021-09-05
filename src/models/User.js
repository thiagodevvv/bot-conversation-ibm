const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, {useUnifiedTopology: true , useNewUrlParser: true });


const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
        
    },
    saldo: {
        type: Number,
        required: true
    },
    limite_emprestimo: {
        type: Number,
        required: true
    },
    extrato: {
        type: [],
        required: true
    },
    emprestimo_abertos: {
        type: Object,
        required: true
    },
    fatura_atual: {
        type: Number,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model("user", UserSchema);