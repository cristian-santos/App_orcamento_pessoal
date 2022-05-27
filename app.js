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

            despesa.id = i;
            despesas.push(despesa);
        }
        return despesas;
    }

    pesquisar(despesa) {
        let despesasFiltradas = Array();
        despesasFiltradas = this.recuperarTodosRegistros();
        
        // Ano
        if(despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);
        }

        // Mês
        if(despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes);
        }

        // Dia
        if(despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);
        }

        // Tipo
        if(despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);
        }

        // Descrição
        if(despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);
        }

        // Valor
        if(despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);
        }

        return despesasFiltradas;
    }

    remover(id) {
        localStorage.removeItem(id);
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

        // Limpando os inputs após inserir dados
        for(let i in despesa) {
            document.getElementById(i).value = '';
        }
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

function carregaListaDespesas(despesas = Array(), filter = false) {
    if(despesas.length == 0 && filter == false) {
        despesas = db.recuperarTodosRegistros();
    }

    // Selecionamos o tbody
    let listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = '';
    
    despesas.forEach(function(d){

        // Criando as linhas (tr)
        let linha = listaDespesas.insertRow();

        // Criar as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
        
        // exibindo o nome do tipo em vez do id
        switch(d.tipo) {
            case '1': d.tipo = 'Alimentação';
                break;
            case '2': d.tipo = 'Educação';
                break;
            case '3': d.tipo = 'Lazer';
                break;
            case '4': d.tipo = 'Saúde';
                break;
            case '5': d.tipo = 'Transporte';
                break;
        }
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;

        // botão excluir despesa
        let botao = document.createElement("Button");
        botao.className = 'btn btn-danger';
        botao.innerHTML = '<i class="fas fa-times"></i>';
        botao.id = `id_despesa_${d.id}`;
        botao.onclick = function() {
            let id = this.id.replace('id_despesa_', '');
            db.remover(id);
            window.location.reload();
        }

        linha.insertCell(4).append(botao);
        console.log(d);
    })
}


function pesquisarDespesa() {
   let ano = document.getElementById('ano').value
   let mes = document.getElementById('mes').value
   let dia = document.getElementById('dia').value
   let tipo = document.getElementById('tipo').value
   let descricao = document.getElementById('descricao').value
   let valor = document.getElementById('valor').value

   let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

   let despesas = db.pesquisar(despesa);

   carregaListaDespesas(despesas, true);

}