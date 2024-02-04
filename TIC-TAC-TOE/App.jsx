import './App.css';
import { useState , useEffect } from 'react';
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [XIsNext, setXisNext] = useState(true);
  const [roundsWon,setroundsWon] = useState({player1:0,player2:0});
  const [roundNo,setroundNo] = useState(1);

  function handleClick(i) {
    const nextSquares = squares.slice();
    if(squares[i] || calculateWinner(squares)){
      return;
    }
    if(XIsNext){
    nextSquares[i] = 'X';
    }
    else{
    nextSquares[i] = '0';
    }
    setSquares(nextSquares);
    setXisNext(!XIsNext);
  }

  function handleRoundClick(){
    setroundNo(roundNo+1);
  }
  function resetGame(){
    setSquares(Array(9).fill(null));
    setXisNext(true);
    setroundsWon({player1:0,player2:0});
    setroundNo(1);
  }
  useEffect(()=>{
    setSquares(Array(9).fill(null));
    setXisNext(null);
    winner=null;
  },[roundNo])

  let winner = calculateWinner(squares);
  let status;
  useEffect(()=>{
  if(winner){
    if(winner === 'X'){
      setroundsWon({...roundsWon,player1:roundsWon.player1+1});
    }
    else{
      setroundsWon({...roundsWon,player2:roundsWon.player2+1});
    }
  }
  },[winner])
    
  if (winner) {
    status = winner === 'X' ? `Winner is Player 1 ` : `Winner is Player 2`;
  } 
    else if (squares.every((square) => square)) {
    status = "draw";}
  else {
    status = `Next Move: ${XIsNext ? 'Player 1 (X)' : 'Player 2 (O)'}`;
  }
  

  return (
      <div className="MainBoard">
        <div className="Game-info">
            <div className="User-Profile">
            <div className="Profiles">
                <img src="https://icons.iconarchive.com/icons/iconarchive/incognito-animals/512/Bear-Avatar-icon.png"></img>
                <p>Player 1</p>
                <button>X</button>
            </div>
            <button className='Heading'>Rounds Won {roundsWon.player1}</button>
            </div>
            <div className='RoundInfo'>
            <div className="Rounds"><p>Round {roundNo}</p></div>
            <button className='Heading' onClick={resetGame}>Reset</button>
            </div>
            <div className="User-Profile">
            <div className="Profiles">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3DFasEmjz6QE0cjr6yvnmuEAEWkBSBphxvxukNQ8YilEwzLAGhFcb0lxM6wx1rrVrSb4&usqp=CAU"></img>
              <p>Player 2</p>
              <button>O</button>
            
            

            </div>
            <button className='Heading'>Rounds Won {roundsWon.player2}</button>
            </div>
        </div>
        <div className="GameBoard">
            <div className="board-row">
              <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
              <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
              <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className="board-row">
              <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
              <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
              <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="board-row">
              <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
              <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
              <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
        </div>
        <div className='NextMove'>
            <div className="Heading">{status}</div>
        {(winner || status==="draw")&& (<button className='Heading' onClick={handleRoundClick}> Next Round </button>)}
        </div>
    </div>
  );
}

function calculateWinner(squares){
  const lines=[
    [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,6,8],[0,4,8],[2,4,6]
  ]
  for(let i=0;i<lines.length;i++){
    const[a,b,c]=lines[i]
    if(squares[a]&&squares[b]===squares[a]&&squares[c]===squares[a]){
      return squares[a]
    }
  }
    return null;
}
