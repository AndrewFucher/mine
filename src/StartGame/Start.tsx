import * as React from 'react';
import './Start.css';

// tslint:disable-next-line:interface-name
interface Props{
    onClick?: () => void;
    depth?: number;
}

class Start extends React.Component<Props, {}> {

    constructor(props: any) {
        super(props);
    }

    /**
     * onClick
     */
    public onClick = () => {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

  public render() {
    
    if (!this.props.depth) {
        return (
            <div id="window" className="window">
                <div className="start_button">
                <button className="start"
                // tslint:disable-next-line:jsx-no-lambda
                onClick={this.onClick}>START</button>
                </div>
            </div>
        );
    } else {
        return (
            <div className="window">
                <div className="start_button">
                    <button className="start"
                    // tslint:disable-next-line:jsx-no-lambda
                    onClick={this.onClick}>START</button>
                </div>
                <div className="depth">
                    <p>Depth: {this.props.depth}</p>
                </div>
            </div>
        );
    }
  }
}

export default Start;
