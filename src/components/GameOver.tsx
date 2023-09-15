import './GameOver.css'

// @ts-ignore
const GameOver = ({retry, score}) => {
    return(
        <div>
            <h1>Fim de jogo!</h1>
            <h2>A sua pontuação foi: <span>{score}</span></h2>
            <button onClick={retry}>Clique para jogar novamente</button>
        </div>
    )
}

export default GameOver