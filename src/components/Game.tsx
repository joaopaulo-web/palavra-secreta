import './Game.css'
import {useState, useRef} from "react";

// @ts-ignore
const Game = ({verifyLetter, pickedWord,pickedCategory,letters,guessedLetters,wrongLetters,guesses,score}) => {

    const [letter, setLetter] = useState("")
    const letterInputRef = useRef(null)
    // @ts-ignore
    //Trata as informações que chegam do form input do jogo.
    const handleSubmit = (e) => {
        //não permite que o formulário seja enviado sem estar preenchido.
        e.preventDefault()
        //Trata a informação que chega do formulário.
        verifyLetter(letter)
        setLetter("")

        // @ts-ignore
        letterInputRef.current.focus()
    }
    return (
        <div className="game">
            <p className="points">
                <span>Pontuação: {score}</span>
            </p>
            <h1>Adivinhe a palavra</h1>
            <h3 className="tip">
                Dica sobre a palavra: <span>{pickedCategory}</span>
            </h3>
            <p>Você ainda tem {guesses} tentativas(s).</p>
            <div className="wordContainer">
                {letters.map((letter, i) => (
                    guessedLetters.includes(letter) ? (
                        <span key={i} className="letter">{letter}</span>
                    ) : (
                        <span key={i} className="blankSquare"></span>
                    )
                ))}
            </div>
            <div className="letterContainer">
                <p>Tente adivinhar uma letra da palavra</p>
                <form onSubmit={handleSubmit}>
                    <input type="text"
                           name="letter"
                           maxLength="1"
                           required
                           onChange={(e) => setLetter((e.target.value))}
                           value={letter}
                           ref = {letterInputRef}/>
                    <button>Jogar!</button>
                </form>
            </div>
            <div className="wrongLettersContainer">
                <p>Letras já utilizadas: </p>
                {wrongLetters.map((letter,i) => (
                    <span key={i}>{letter}, </span>
                ))}
            </div>
        </div>
    )
}

export default Game