import * as React from 'react';
import draw from './draw';
import './game.css';
import Logic from './logic';

// 1850 - width, 1010 - height

// tslint:disable-next-line:interface-name
interface Size {
    width: number;
    height: number;
    coeficient: number;
}

// tslint:disable-next-line:interface-name
interface Layout {
    columns: number;
    raws: number;
}

// tslint:disable-next-line:interface-name
interface Props {
    onLose?: (depth?: number) => void;
}

// tslint:disable-next-line:interface-name
interface State {
    isGame: boolean
}

class Game extends React.Component<Props, State> {

    public canv: any       // variable to acces canvas
    public ctx: CanvasRenderingContext2D // canvas where i draw
    public myRef: React.RefObject<HTMLCanvasElement> // ref
    public windowSize: Size
    public sizeImage: number[]
    public shift: number
    public field: any[][]
    public layout: Layout
    public shiftSpeed: number
    public steps: number[][]
    public coeficient: number
    private depth: number
    private renderID: number

    constructor(props: any) {
        super(props);

        this.state = {
            isGame: true
        }

        this.myRef = React.createRef<HTMLCanvasElement>(); // ref to acces to canvas

        // visible part of game - how many blocks player can see at one moment
        this.layout = {
            columns: 7,
            raws: 12
        }

        // how deep player is
        this.depth = 0;

        this.coeficient = 1;

        this.sizeImage = [80, 80];

        // setting future sizes of game window
        // Math.min(window.innerWidth / (this.sizeImage[0] * this.columns), window.innerHeight / (this.sizeImage[1] * this.raws))
        this.windowSize = {
            coeficient: Math.min(window.innerWidth / (this.sizeImage[0] * this.layout.columns), window.innerHeight / (this.sizeImage[1] * this.layout.raws)),
            height: window.innerHeight,
            width: window.innerWidth
        }

        // shift - moving map( field where we play ) up
        this.shift = 0;
        this.shiftSpeed = 0;

        // steps is value with coords how to move for player to finish(place wear someone press)
        this.steps = [];

    }

    public gameEnd() {

        this.setState({
            isGame: false
        })

        window.cancelAnimationFrame(this.renderID);
        if (this.props.onLose) {
            this.props.onLose(this.depth);
        }

    }

    // addField - adding new map(deleting old) to existing and updating shift -> setting to 0(zero)
    public addField() {

        this.field = Logic.createLevel(this.layout.columns, this.layout.raws, this.coeficient); // adding new map

        this.shift = 0;
    }

    // when player click or touch screen game's player moves to this position
    public handleClick(x: any) {

        if (this.shiftSpeed === 0 && this.shift >= 0) {
            this.shiftSpeed = 1.5;
        }

        // I do not know how to actually call this constant. So, I choose "time" beacuse I like it. Here we are getting all data to move player
        const time = Logic.clickHandle(
            x,
            this.field,
            (this.windowSize.width - this.sizeImage[0] * this.windowSize.coeficient * this.layout.columns) / 2,
            this.shift,
            this.layout,
            this.sizeImage,
            this.windowSize.coeficient
        );

        this.field = time[0];
        this.steps = time[1];

    }

    /**
     * move
     */
    public move() {
        if (this.steps.length !== 0) {
            // // tslint:disable-next-line:no-console
            // console.log(this.steps);
            // // tslint:disable-next-line:no-console
            // console.log(this.field)
            const time = Logic.move(this.field, this.steps[0]);
            this.field = time.map;
            this.depth += time.addingDepth;
            this.steps.shift();
        }
    }

    public update() {

        this.move();

        if (!Logic.checkLoose(this.field)) {
            this.gameEnd();
        }

        // adding new level
        if (this.shift >= this.layout.raws * this.coeficient * this.sizeImage[0]) {
            this.field = Logic.addingMap(this.field, this.layout.raws * this.coeficient, this.layout.columns);
            this.shift = 0;
        }

        // clearing canvas
        this.ctx.clearRect(0, 0, this.windowSize.width / this.windowSize.coeficient, this.windowSize.height / this.windowSize.coeficient);

        // drawing map on canvas
        draw(this.field,
             this.shift,
             this.depth,
             [this.canv.width / this.windowSize.coeficient, this.canv.height / this.windowSize.coeficient],
             this.ctx
        );

        // increasing shift -> moving map down -- if at least there was one click on CANVAS, not in window

        this.shift += this.shiftSpeed;

        if (this.state.isGame) {
            this.renderID = window.requestAnimationFrame(() => this.update());
        }
    }

    public componentDidMount() {
        this.canv = this.myRef.current;
        this.canv.focus();
        if (this.canv) {
            this.ctx = this.canv.getContext("2d");
        }

        // setting default values
        this.ctx.font = "30px Comic Sans MS";
        this.ctx.textAlign = "end";
        this.ctx.textAlign = "right";
        this.ctx.scale(this.windowSize.coeficient, this.windowSize.coeficient); // scale
        this.ctx.fillStyle = "#ffcc66";                                         // background color

        this.field = Logic.createLevel(this.layout.columns, this.layout.raws, this.coeficient);
        /* for(let i = 0; i < 5; i++) {
            this.field[i] = (new Array(this.columns)).fill("sky")
        }*/

        this.renderID = window.requestAnimationFrame(() => this.update());
    }

    public render() {
        return (
            <canvas width={(this.layout.columns * this.sizeImage[1] * this.windowSize.coeficient).toString()} height={window.innerHeight.toString()} style={{
                marginLeft: `${(window.innerWidth - this.sizeImage[0] * this.layout.columns * this.windowSize.coeficient) / 2}px`,
                marginRight: `${(window.innerWidth - this.sizeImage[0] * this.layout.columns * this.windowSize.coeficient) / 2}px`,
            }}
            // tslint:disable-next-line:jsx-no-lambda
            onClick={(x) => this.handleClick(x)}
            ref={this.myRef}/>
        )
    }

}

export default Game;