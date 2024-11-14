const modal = document.getElementById('modal');
const titulo = document.getElementById('titulo');
const descricao = document.getElementById('descricao');
const prioridade = document.getElementById('prioridade');
const vencimento = document.getElementById('vencimento');
const responsavel = document.getElementById('responsavel');
const adicionarTarefa = document.getElementById('adicionarTarefa');
const editarTarefa = document.getElementById('editarTarefa');
const botaoAdicionar = document.getElementById('btnAdicionar');
const botaoEditar = document.getElementById('btnEditar');
const idInput = document.getElementById('idInput');
const andamento = document.getElementById('andamento');

const coluna1 = document.getElementById('coluna1');

var tarefas = localStorage.getItem("tarefas");

var lista = tarefas ? JSON.parse(tarefas) : [];

gerarTarefa();

function abrirModal(id) {

    modal.style.display = "flex";

    if (id) {
        editarTarefa.style.display = "flex";

        adicionarTarefa.style.display = "none";

        botaoEditar.style.display = "flex";

        botaoAdicionar.style.display = "none";

        const index = lista.findIndex(function (tarefa) {
            return tarefa.id == id;
        });

        const tarefa = lista[index];

        idInput.value = tarefa.id;
        titulo.value = tarefa.titulo;
        descricao.value = tarefa.descricao
        prioridade.value = tarefa.prioridade
        vencimento.value = tarefa.vencimento
        responsavel.value = tarefa.responsavel
        andamento.value = tarefa.andamento
    }
    else {
        editarTarefa.style.display = "none";

        adicionarTarefa.style.display = "flex";

        botaoEditar.style.display = "none";

        botaoAdicionar.style.display = "flex";
    }
}

function fecharModal() {
    modal.style.display = "none";

    idInput.value = "";
    titulo.value = "";
    descricao.value = "";
    prioridade.value = "Alta";
    vencimento.value = "";
    responsavel.value = "";
    andamento.value = "coluna1";
}

function criarTarefa() {
    const tarefa = {
        id: Math.floor(Math.random() * 9999999),
        titulo: titulo.value,
        descricao: descricao.value,
        prioridade: prioridade.value,
        vencimento: vencimento.value,
        responsavel: responsavel.value,
        andamento: andamento.value
    };

    lista.push(tarefa);

    localStorage.setItem("tarefas", JSON.stringify(lista));

    gerarTarefa()
    fecharModal();
}

function atualizarTarefa() {
    const tarefa = {
        id: idInput.value,
        titulo: titulo.value,
        descricao: descricao.value,
        prioridade: prioridade.value,
        vencimento: vencimento.value,
        responsavel: responsavel.value,
        andamento: andamento.value
    };

    const index = lista.findIndex(function (tarefa) {
        return tarefa.id == idInput.value;
    });

    lista[index] = tarefa;

    localStorage.setItem("tarefas", JSON.stringify(lista));

    gerarTarefa();
    fecharModal();

}

function atualizarAndamento(id, coluna) {
    const index = lista.findIndex(function (tarefa) {
        return id == tarefa.id;
    });

    const tarefa = lista[index]
    tarefa.andamento = coluna

    lista[index] = tarefa;
}

function gerarTarefa() {

    resetarColunas();

    lista.forEach(function (tarefa) {

        const coluna = document.querySelector(`[data-column="${tarefa.andamento}"]`)

        const proximaVencimento = verificarVencimento(tarefa.vencimento);

        const card = `
            <div class="tarefa ${proximaVencimento ? (tarefa.andamento == "coluna3" ? '':(verificarVenceu(tarefa.vencimento)) ? 'venceu':'proxima-vencimento') : ''}" 
            id="${tarefa.id}"
            onclick="abrirModal(${tarefa.id})"
            draggable="true"
            ondragstart="dragstart_handler(event)"
            >
                <div class="info">
                    <b>Título</b>
                    <span class="titulo">${tarefa.titulo}</span>
                </div>

                <div class="info">
                    <b>Descrição</b>
                    <span class="descricao">${tarefa.descricao}</span>
                </div>
                
                <div class="info">
                    <b>Prioridade</b>
                    <span class="prioridade">${tarefa.prioridade}</span>
                </div>
                
                <div class="info">
                    <b>Vencimento</b>
                    <span class="vencimento">${tarefa.vencimento}</span>
                </div>
                
                <div class="info">
                    <b>Responsável</b>
                    <span class="responsavel">${tarefa.responsavel}</span>
                </div>
            </div>
            `

        coluna.innerHTML += card;
    }

    );
}

function resetarColunas() {
    document.querySelector('[data-column="coluna1"]').innerHTML = "";
    document.querySelector('[data-column="coluna2"]').innerHTML = "";
    document.querySelector('[data-column="coluna3"]').innerHTML = "";
}

function dragstart_handler(ev) {
    ev.dataTransfer.setData("data", ev.target.id);
    ev.dropEffect = "move";
}

function dragover_handler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}

function drop_handler(ev) {
    ev.preventDefault();
    const tarefa = ev.dataTransfer.getData("data");
    const coluna = ev.target.dataset.column;

    mudarAndamento(tarefa, coluna);

    console.log(ev);

    gerarTarefa();
    atualizarTarefa(tarefa, coluna);
}

function mudarAndamento(id, coluna) {
    if (id && coluna) {
        lista = lista.map((tarefa) => {
            if (id != tarefa.id)
                return tarefa;

            return {
                ...tarefa,
                andamento: coluna,
            };
        });
    };
}

function verificarVencimento(dataVencimento) {
    const atual = new Date();
    const dataVenc = new Date(dataVencimento);

    const diferenca = dataVenc - atual;
    const dias = Math.ceil(diferenca / (1000 * 60 * 60 * 24));

    return dias <= 3;
}

function verificarVenceu(dataVencimento) {
    const atual = new Date();
    const dataVenc = new Date(dataVencimento);

    const diferenca = dataVenc - atual;
    const dias = Math.ceil(diferenca / (1000 * 60 * 60 * 24));

    return dias < 0;
}