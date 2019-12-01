//-->array que armazena as cartas viradas
var flippedCards = [];
class jogo{

    constructor(){
        //array que armazenará os objetos com src e id de 1 a 8
		this.images = [];

        //variável contadora de acertos. ao chegar em 8 o jogo termina
        this.matches = 0;

        //estrutura de atribiução das imagens as cartas
	    for(var i = 0; i < 16; i++){
		//cria um objeto img com um src e um id
		    var img = {
			src: "img/" + i + ".jpg",
            id: i%8
			}
			//inserer o objeto criado no array
			this.images.push(img);
		}
		
		
		
		//embaralhamento do array de imagens
		this.images = this.randomSort(this.images);

    }
	
	giraCarta(){
		
	}
	
	//Manipula front e verso para rotacionar as cartas
	flipCard(){
		//-->verifica se o número de cartas clicadas é menor que 2
		if(flippedCards.length < 2){
			//pega as faces da carta clicada
			var faces = this.getElementsByClassName("face");

			//confere se a carta já está virada, impedindo que a mesma carta seja virada duas vezes
			if(faces[0].classList[2]){
				return;
			}
			

			//adiciona a classe fliped às faces da carta para que sejam viradas
			faces[0].classList.toggle("flipped");
			faces[1].classList.toggle("flipped");
			
			//-->adiciona a carta clicada ao array de cartas viradas
			flippedCards.push(this);

		//verifica se o número de cartas no array de cartas viradas é igual a 2
			if(flippedCards.length === 2){
				//compara o id das cartas viradas para ver se houve um acerto
				if(flippedCards[0].childNodes[3].id === flippedCards[1].childNodes[3].id){
					//em caso de acerto adiciona a classe match a todas as faces das duas cartas presentes no array de cartas viradas
					flippedCards[0].childNodes[1].classList.toggle("match");
					flippedCards[0].childNodes[3].classList.toggle("match");
					flippedCards[1].childNodes[1].classList.toggle("match");
					flippedCards[1].childNodes[3].classList.toggle("match");
					
					//chama a função que exibe a mensagem MATCH
					//console.log(this.matchCardsSign());
					
					//limpa o array de cartas viradas
					flippedCards = [];
					
					//soma um ao contador de acertos
					this.matches++;
					
					//verifica se o contador de acertos chegou a 8
					if(this.matches >= 8){
						//caso haja 8 acertos, chama a função que finaliza o jogo
						this.gameOver();
					}
				} 
			} 
		} else {
			//em caso haver duas cartas no array de cartas viradas (terceiro click) remove a classe flipped das cartas no array de cartas viradas
			flippedCards[0].childNodes[1].classList.toggle("flipped");
			flippedCards[0].childNodes[3].classList.toggle("flipped");
			flippedCards[1].childNodes[1].classList.toggle("flipped");
			flippedCards[1].childNodes[3].classList.toggle("flipped");
			
			//limpa o array de cartas viradas
			flippedCards = [];
		}
	}

	
	//função de inicialização do jogo
	startGame = () =>{
		//-->zera o array de cartas viradas
		flippedCards = [];

		//lista de elementos div com as classes front
		var frontFaces = document.getElementsByClassName("front");
		var backFaces = document.getElementsByClassName("back");

		//posicionamento das cartas
		for(var i = 0; i < 16; i++){
			//limpa as cartas marcadas
			backFaces[i].classList.remove("match","flipped");
			frontFaces[i].classList.remove("match","flipped");

			var carta = document.querySelector("#carta" + i);
			carta.style.left = (i % 8 === 0) ? 5 + "px" : (i % 8) * 165 + 5 + "px";
			carta.style.top = i < 8 ? 5 + "px" : 250 + "px";

			//adiciona às cartas o evento click chamando a função que vira as cartas
			carta.addEventListener("click",this.flipCard,false);

			//adiciona as imagens e IDs às cartas
			frontFaces[i].style.background = `url('${this.images[i].src}')`;
			frontFaces[i].setAttribute("id",this.images[i].id);
		}
		
	}

	//função que embaralha as cartas recebendo um array por parâmetro
	randomSort(antigo){
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


	//função que gera o sinal de MATCH
	static matchCardsSign() {
		console.log("hello"); 	
		alert("Acertou!!\n");
	}//fim da função que exibe mensagem de MATCH
	

	//função de fim do jogo
	gameOver(){
		alert("Acabou!!");
	}



}