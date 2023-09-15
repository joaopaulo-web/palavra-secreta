//CSS
import './App.css'

//Components
import StartScreen from "./components/StartScreen.tsx";
import Game from "./components/Game.tsx";
import GameOver from "./components/GameOver.tsx";

//React
import {useCallback, useEffect, useState} from "react";

//Importa a lista de palavras disponíveis no jogo
// @ts-ignore
import {wordsList} from "./data/words.js"

// String com chave e valor que determina as fases do jogo.
const stages = [
    {id:1, name: "start"},
    {id:2, name: "game"},
    {id:3, name: "end"}
]

// Variável responsável por determinar o número de tentativas que o jogador tem.
const guessesQty = 3

function App() {

    // Inicia a variável da fase e seta o estágio inicial através do useState. Selecionando o primeiro item da string e seu nome.
    const [gameStage, setGameStage] = useState(stages[0].name)

    // Inicia a variável de palavras disponíveis no banco de dados fornecido.
    const [words] = useState(wordsList)

    // Inicia as variáveis de seleção de palavra e categoria através do use state vazio. Ainda iniciamos os set's de ambas as variáveis para poder ser usado futuramente.
    const [pickedWord, setPickedWord] = useState("")
    const [pickedCategory, setPickedCategory] = useState("")

    // Inicia a variável para a manipulação das letras. É iniciado como uma string vazia.
    const [letters, setLetters] = useState([])

    // Inicia como uma string vazia as variáveis de letras tentadas e de letras erradas.
    const [guessedLetters, setGuessedLetters] = useState([])
    const [wrongLetters, setWrongLetters] = useState([])

    // Atribuo a variável de tentativas para a quantidade de tentativas iniciada anteriormente. A variável score é iniciada como 0. As duas variáveis estão acompanhadas dos seus set's para uso futuro.
    const [guesses, setGuesses] = useState(guessesQty)
    const [score, setScore] = useState(0)

    //Função constante responsável por escolher a palavra e a categoria no início do jogo.
    const pickWordAndCategory = useCallback(() => {
        //Variável que vai receber a categoria randomizada. categories vai receber as chaves contidas em words que por sua vez está linkada ao state do banco de dados.
        const categories = Object.keys(words)

        //Variável final categoria. Nela fazemos o tratamento do número com o math.floor e multiplicamos pela quantidade de letras em categories.
        const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
        console.log(category)

        //randomiza a palavra
        const word = words[category][Math.floor(Math.random() * words[category].length)]
        console.log(word)

        return {word, category}
    },[words])

    // @ts-ignore
    const startGame = useCallback(() => {
        //escolher categoria e palavra
        // @ts-ignore
        const {word, category} = pickWordAndCategory()

        //Limpa todos os dados sempre que um jogo novo iniciar.
        clearLetterStates()

        //cria o array de letras
        let wordLetters = word.split("")
        // @ts-ignore
        wordLetters = wordLetters.map((l) => l.toLowerCase())
        console.log(word, category)
        console.log(wordLetters)

        //Fill states
        setPickedWord(word)
        setPickedCategory(category)
        setLetters(wordLetters)


        //Starta o game
        setGameStage( stages[1].name)
    },[pickWordAndCategory])

    // @ts-ignore
    const verifyLetter = (letter) => {
        //Processa e trata a letra que o usuário digitou
        const normalizedLetter = letter.toLowerCase()

        //checa se a letra ja foi utilizada
        // @ts-ignore
        if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
            return
        }

        // @ts-ignore
        if (letters.includes(normalizedLetter)){
            // @ts-ignore
            setGuessedLetters((actualGuessedLetters) => [
                ...actualGuessedLetters,normalizedLetter
            ]);
        }else{
            // @ts-ignore
            setWrongLetters((actualWrongLetters) => [
                ...actualWrongLetters,
                normalizedLetter
            ]);

            setGuesses((actualGuesses) => actualGuesses - 1)
        }

    }

    // Função responsável por limpar as letras acertadas e utilizadas.
    const clearLetterStates = () => {
        setGuessedLetters([])
        setWrongLetters([])
    }

    // Lógica que limpa todos os estados e determina o final do jogo.
    useEffect(() => {
        if (guesses <= 0){

            clearLetterStates()

            setGameStage(stages[2].name)
        }
    }, [guesses])

    //Lógica que checa se a palavra esta correta e adiciona 100 a pontuação do usuário.
    useEffect(() => {

        const uniqueLetters =[... new Set(letters)]

        if (guessedLetters.length === uniqueLetters.length) {
            setScore((actualScore) => actualScore += 100)

            startGame()
        }
    }, [guessedLetters, letters, startGame]);

    //Lógica que determina o recomeço do jogo. Zera o score, zera os guesses e seta o estágio do jogo para o inicial.
    const retry = () =>{
        setScore(0)
        setGuesses(guessesQty)

        //Volta para a tela inicial do game
        setGameStage(stages[0].name)
    }
    console.log(words)

  return (
    <>
        <div className="container">
            {/*Lógica para determinar qual tela mostrar*/}
            {gameStage === "start" && <StartScreen startGame={startGame} />}
            {/*Tela do jogo sendo passada todas as props necessárias para total funcionamento do jogo.*/}
            {gameStage === "game" && <Game
                verifyLetter={verifyLetter}
                pickedWord={pickedWord}
                pickedCategory={pickedCategory}
                letters={letters}
                guessedLetters = {guessedLetters}
                wrongLetters = {wrongLetters}
                guesses = {guesses}
                score ={score}/>}
            {/*Tela de fim de jogo mostrando o botão de recomeço e o score total do player.*/}
            {gameStage === "end" && <GameOver
                retry={retry}
                score={score}/>}
        </div>
    </>
  )
}

export default App
