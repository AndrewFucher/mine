import * as React from 'react';
import * as ReactDOM from 'react-dom';
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

class Game extends React.Component<{}, {}> {

    public canv: any       // variable to acces canvas
    public ctx: CanvasRenderingContext2D // canvas where i draw
    public myRef: any // ref
    public windowSize: Size
    public sizeImage: number[]
    public shift: number
    public field: any[][]
    public layout: Layout
    public shiftSpeed: number
    public steps: number[][]
    public coeficient: number

    constructor(props: any) {
        super(props);
        this.myRef = React.createRef<HTMLCanvasElement>(); // ref to acces to canvas
        this.state = {};
        // visible part of game - how many blocks player can see at one moment
        this.layout = {
            columns: 7,
            raws: 12
        }

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

        this.steps = [];
    }

    // addField - adding new map to existing and updating shift -> setting to 0(zero)
    public addField() {

        this.field = Logic.createLevel(this.layout.columns, this.layout.raws, this.coeficient); // adding new map

        this.shift = 0;
    }

    public handleClick(x: any) {

        if (this.shiftSpeed === 0 && this.shift >= 0) {
            this.shiftSpeed = 1.5;
        }


        const time = Logic.clickHandle(
            x,
            this.field,
            (this.windowSize.width - this.sizeImage[0] * this.windowSize.coeficient * this.layout.columns) / 2,
            this.shift,
            this.layout,
            this.sizeImage = [80, 80],
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
            this.field = Logic.move(this.field, this.steps[0]);
            this.steps.shift();
        }
    }

    public update() {

        this.move()

        // adding new level
        if (this.shift >= this.layout.raws * this.coeficient * this.sizeImage[0]) {
            this.field = Logic.addingMap(this.field, this.layout.raws * this.coeficient, this.layout.columns);
            this.shift = 0;
        }

        // clearing canvas
        this.ctx.clearRect(0, 0, this.windowSize.width / this.windowSize.coeficient, this.windowSize.height / this.windowSize.coeficient);

        // drawing map on canvas
        draw(this.field, this.shift, this.ctx);

        // increasing shift -> moving map down -- if at least there was one click on CANVAS, not in window

        this.shift += this.shiftSpeed;

        window.requestAnimationFrame(() => this.update());
    }

    public componentDidMount() {
        this.canv = this.myRef.current;
        this.canv.focus();
        if (this.canv) {
            this.ctx = this.canv.getContext("2d");
        }

        this.ctx.scale(this.windowSize.coeficient, this.windowSize.coeficient);
        this.ctx.fillStyle = "#ffcc66";

        this.field = Logic.createLevel(this.layout.columns, this.layout.raws, this.coeficient);
        /* for(let i = 0; i < 5; i++) {
            this.field[i] = (new Array(this.columns)).fill("sky")
        }*/

        window.requestAnimationFrame(() => this.update());
    }

    public render() {
        return (
            <canvas width={window.innerWidth.toString()} height={window.innerHeight.toString()} style={{
                marginLeft: `${(window.innerWidth - this.sizeImage[0] * this.layout.columns * this.windowSize.coeficient) / 2}px`
            }}
            // tslint:disable-next-line:jsx-no-lambda
            onClick={(x) => this.handleClick(x)}
            ref={this.myRef}/>
        )
    }

}

function start_game() {
    ReactDOM.render(
        <Game />,
        document.getElementById('root') as HTMLElement
    );
}

export default start_game;