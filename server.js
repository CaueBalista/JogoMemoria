const express = require('express');
const webApp = express()
const webServer = require('http').createServer(webApp)
const io = require('socket.io')(webServer)

const game = createGame();
var texto = "";
var endgame = false;
var total_players = 1;
var jogador_da_vez = 1;
var player1_points = 0;
var player2_points = 0;

webApp.use(express.static(__dirname));

webApp.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

webApp.get('/jogo', function(req, res) {
	var usuario = req.query.usuario;

	if (usuario === undefined) {
		res.sendFile(__dirname + '/index.html');
	} else {
		texto += usuario + "<entrou na sala>\n";
		res.sendFile(__dirname + '/jogo.html');
	}
});

webApp.get('/jogoSingle', function(req, res) {
	res.sendFile(__dirname + '/jogoSingle.html');
});

webApp.get('/regras', function(req, res){
	res.sendFile(__dirname + '/regras.html');
});

webApp.get('/sendtext', function(req, res) {
	var usuario = req.query.usuario;
	var msg = req.query.msg;

	texto += usuario + ": " + msg + "\n";
	res.send(texto);
});

webApp.get('/gettext', function (req, res) {
	res.send(texto);
});

webServer.listen(3000);

io.on('connection', function(socket){

	if (total_players < 3){
	
		socket.on('sendcard',  (carta) => {
			
			if (!endgame && carta.player === jogador_da_vez) {
				//eh recebido o id da carta clicada
				if(game.flippedCards.length < 2){
	
					//-->adiciona o id da carta clicada ao array de cartas viradas
					game.flippedCards.push(carta);
	
					//envio para os clients a carta que foi virada
					io.emit('flipcard', carta.idDiv);
	
					if (game.flippedCards.length === 2) {
						//como 2 cartas ja estao viradas, sao verificadas se sao iguais
						if (game.flippedCards[0].idCarta === game.flippedCards[1].idCarta) {
	
							game.flippedCards = [];
							game.matches++;
	
							if (jogador_da_vez == 1) player1_points++;
							else player2_points++;

							acerto();

							//emit de acerto
							io.emit('acerto', jogador_da_vez);							
							
							//verifica se o contador de acertos chegou a 8
							if(game.matches >= 8){
								endgame = true;
								//caso haja 8 acertos, o jogo acaba
								//emit de game over

								if (player1_points > player2_points) { //jogador 1 venceu
									io.emit('game-over', {Id: 1, Pontos: player1_points});
								} else if (player1_points < player2_points) { //jogador 2 venceu
									io.emit('game-over', {Id: 2, Pontos: player2_points});
								} else { //empate
									io.emit('game-over', {Id: 0, Pontos: player1_points});
								}
							}
						}
						else {
							if (jogador_da_vez == 1) jogador_da_vez = 2;
							else jogador_da_vez = 1;
						}

						sleep(5000);
						//limpa o array de cartas viradas
						game.flippedCards = [];
		
						io.emit('unflipcard');
					}
				}
			}
		})
	
		socket.emit('bootstrap', game);
		socket.emit('player', total_players);
		console.log("jogador " + total_players + " entrou");
		total_players++;
	}
	else {
		socket.emit('fail');
	}

	socket.on('closing', (player) => { //tratar a saida de um jogador

	})
})



function createGame(){
	console.log("--> Jogo iniciando");

	const game = {
		images: [],
		flippedCards: [],
		matches: 0,
		randomSort
	}

	//função que embaralha as cartas recebendo um array por parâmetro
	function randomSort(antigo){
		//cria um array vazio
		var novo = [];
		
		//executa o bloco de comandos enquanto o novo array não atingir o mesmo número de elementos do array passado por parâmetro
		while(novo.length !== antigo.length){
			//cria uma variável i recebendo um número aleatório entre 0 e o número de elementos do array -1
			var i = Math.floor(Math.random()*16);
			
			
			//verifica se o elemento indicado pelo índice i já existe no novo array
			if(novo.indexOf(antigo[i]) < 0){
				//caso o elemento não exista, ele é inserido
				novo.push(antigo[i]);
			}
		}
		
		//retorna o array novo, que agora possui todos os elementos do original porém organizados aleatóriamente
		return novo;
		
	}

	for(var i = 0; i < 16; i++){
		//cria um objeto img com um src e um id
		var img = {
			src: "img/" + i + ".jpg",
			id: i%8
		};
		
		//inserer o objeto criado no array
		game.images.push(img);
	}

	game.images = randomSort(game.images);

	return game;
}

function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
	  if ((new Date().getTime() - start) > milliseconds){
		break;
	  }
	}
}

function acerto(){
	if (jogador_da_vez === 1) {
		texto += "Player "+ jogador_da_vez + " acertou e esta com " + player1_points + "\n";
	}
	else texto += "Player "+ jogador_da_vez + " acertou e esta com " + player2_points + "\n";
	
}