class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    validarDados() {
        for(let i in this) {
           if(this[i] == undefined || this[i] == '' || this[i] == null) {
               return false;
           }
        }
        return true;
    }
}

class Db {

    constructor() {
        let id = localStorage.getItem('id');

        if(id === null) {
            localStorage.setItem('id', 0)
        }
    }


    getProximoId() {
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1;
    }


    salvar(d) {
        let id = this.getProximoId();
        localStorage.setItem(id, JSON.stringify(d));
        localStorage.setItem('id', id);
    }

    recuperarTodosRegistros() {

        // Array com as despesas
        let despesas = Array();

        let id = localStorage.getItem('id');

        // Recuperando todas as despesas cadastradas
        for(let i = 1; i <= id; i++) {
            // Recuperar e inserir a despesa no array
            let despesa = JSON.parse(localStorage.getItem(i));

            // Existe a possibilidade de haver índices removidos
            if(despesa === null) {
                continue;
            }

            despesas.push(despesa);
        }
        return despesas;
    }
}


let db = new Db();


function cadastrarDespesa() {
    let ano         = document.getElementById('ano');
    let mes         = document.getElementById('mes');
    let dia         = document.getElementById('dia');
    let tipo        = document.getElementById('tipo');
    let descricao   = document.getElementById('descricao');
    let valor       = document.getElementById('valor');

    // console.log(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value);

    let despesa = new Despesa(
        ano.value, 
        mes.value, 
        dia.value, 
        tipo.value, 
        descricao.value, 
        valor.value
    )

    if(despesa.validarDados()) {
        document.getElementById('titulo_modal').innerHTML = 'Registro inserido com sucesso!';
        document.getElementById('titulo_modal_div').className = 'modal-header text-success';
        document.getElementById('conteudo_modal').innerHTML = 'Despesa foi cadastrada com sucesso!';
        document.getElementById('botao').innerHTML = 'Voltar';
        document.getElementById('botao').className = 'btn btn-success';
        db.salvar(despesa);

        // Alerta de sucesso
        $('#modalRegistraDespesa').modal('show');
    } else {
        document.getElementById('titulo_modal').innerHTML = 'Erro na inclusão do registro!';
        document.getElementById('titulo_modal_div').className = 'modal-header text-danger';
        document.getElementById('conteudo_modal').innerHTML = 'Erro ao cadastrar a despesa!';
        document.getElementById('botao').innerHTML = 'Voltar';
        document.getElementById('botao').className = 'btn btn-danger';
        
        // Alerta de erro
        $('#modalRegistraDespesa').modal('show');
    }
}

function carregaListaDespesas() {
    let despesas = Array();
    despesas = db.recuperarTodosRegistros();

    console.log(despesas);
}