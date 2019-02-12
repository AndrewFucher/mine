import * as React from 'react';
import './App.css';
import game_start from './game/game';

class App extends React.Component {

  public startGame() {
    game_start();
  }

  public render() {
    return (
      <div id="window" className="window">
        <div className="start_button">
          <button className="start"
          // tslint:disable-next-line:jsx-no-lambda
          onClick={() => this.startGame()}>START</button>
        </div>
      </div>
    );
  }
}

export default App;
