let username="";

entrarChat();

function entrarChat() {
    username = prompt("qual seu nome de usuario?");
    const usuario = {name: username};
    const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", usuario);
    promessa.then(aceitarLogin);
    promessa.catch(negarLogin);
}

function negarLogin(erro){
    if(erro.response.status === 400){
        alert("Tente outro nome, pois este já está sendo usado");
        entrarChat();
    }
}

function aceitarLogin(){
    atualizarMensagens();
    setInterval(atualizarMensagens, 3000);
    avisarServidor();
    setInterval(avisarServidor, 5000);
}

function atualizarMensagens(){
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages");
    promessa.then(mostrarMensagens);
}

function mostrarMensagens(resposta){
    const mensagensChat = document.querySelector(".chat");
    mensagensChat.innerHTML = "";
    for(let i = 0; i<resposta.data.length; i++){
        if(resposta.data[i].type === 'status'){
            mensagensChat.innerHTML += `
            <li class="movimentacao-sala">
                <span class='tempo'>(${resposta.data[i].time})</span> <span class='nome-usuarios'>${resposta.data[i].from}</span> <span>${resposta.data[i].text}</span> 
            </li>
                `;
            }else if ( resposta.data[i].to === username && resposta.data[i].type === 'private_message' ){
                mensagensChat.innerHTML += `
                <li class="privada">
                    <span class='tempo'>(${resposta.data[i].time})</span> <span class='nome-usuarios'>${resposta.data[i].from}</span> reservadamente para <span class='nome-usuarios'>${resposta.data[i].to}</span>: <span>${resposta.data[i].text}</span>
                </li>
                `;
            }else{
                mensagensChat.innerHTML += `
                <li>
                    <span class='tempo'>(${resposta.data[i].time})</span> <span class='nome-usuarios'>${resposta.data[i].from}</span> para <span class='nome-usuarios'>${resposta.data[i].to}:</span> <span>${resposta.data[i].text}</span>
                </li>
                `;
            }
    }  
    
}

function avisarServidor(){
    const promessa = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status', {name:username});
    promessa.catch(recarregarPagina);
}
function recarregarPagina(){
    window.location.reload();
}
function enviarMensagem(){
    const inputEnviar = document.querySelector(".input-chat");
    const textoInput = document.querySelector(".input-chat").value;
    const mensagem = {
        from: username,
        to: "Todos",
        text: textoInput,
        type: "message"
    }
    const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", mensagem);
    promessa.then(atualizarMensagens);
    promessa.catch(recarregarPagina);
    resetarInput(inputEnviar);
}

function resetarInput(inputEnviar){
    document.querySelector(".input-chat").value = "";
    inputEnviar.setAttribute("placeholder","");
}

