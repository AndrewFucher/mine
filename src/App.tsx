import * as React from 'react';
// import './App.css';
import Game from './game/game';
import Start from './StartGame/Start';

// tslint:disable-next-line:interface-name
interface State {
  isGame: boolean;
  depth?: number;
}

class App extends React.Component<{}, State> {

  constructor(props: any) {
    super(props);

    this.state = {
      isGame: false
    }

  }

  /**
   * onChange - game over or start game
   */
  public onChange = (depth?: number) => {

    this.setState({
      // tslint:disable-next-line:object-literal-shorthand
      depth: depth,
      isGame: !this.state.isGame
    })
    
  }

  public render() {

    if (this.state.isGame) {
      return (
        <Game onLose={this.onChange} />
      );
    } if (!this.state.isGame) {
      return (
        <Start onClick={this.onChange} depth={this.state.depth} />
      );
    } else {
      return;
    }
  }
}

export default App;
