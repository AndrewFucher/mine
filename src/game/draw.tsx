import dirt from './images/dirt.png';
import player from './images/player.png';
import sky from './images/sky.png';

const dirtImage: HTMLImageElement = new Image();
dirtImage.src = dirt;
// tslint:disable-next-line:only-arrow-functions
dirtImage.onclick = function(event: any) {
    dirtImage.src = player;
}

const playerImage: HTMLImageElement = new Image();
playerImage.src = player;

const skyImage: HTMLImageElement = new Image();
skyImage.src = sky;

const tuple: any = {
    "dirt": dirtImage,
    "player": playerImage,
    "sky": skyImage
}

const sizeImage = [80, 80];

function draw(map: any[][], shift: number, canvas: CanvasRenderingContext2D) {

    canvas.fillRect(0, 0, sizeImage[1]*(map[0].length), sizeImage[0]*(map.length - 1));
    // tslint:disable-next-line:no-console
    // console.log(map)
    for(let i = 0; i < map.length; i++) {
        for(let j = 0; j < map[i].length; j++) {
            if (map[i][j] in tuple) {
              canvas.drawImage(tuple[map[i][j]], sizeImage[0]*j, sizeImage[1]*i - shift);
            }
        }
    }
}

export default draw;