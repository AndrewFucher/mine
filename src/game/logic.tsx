import searchWay from './WaveSearch'; // algorithm to find the fastest way from one point to another

// tslint:disable-next-line:interface-name
interface Layout {
    columns: number;
    raws: number;
}

export function move(map: any[][], position: number[]) {
    // tslint:disable-next-line:prefer-for-of
    for(let i = 0; i < map.length; i++) {
        for(let j = 0; j < map[i].length; j++) {

            if (map[i][j] === "player") {
                map[i][j] = "none";
                break;
            }

        }
    }

    map[position[0]][position[1]] = "player";

    return map;
}

export function clickHandle(eventClick: any, map: any[][], shiftX: number, shiftY: number, layout: Layout, size: number[], coeficient: number) {

    let steps: number[][] = [];

    const mouseX = Math.round(eventClick.clientX - shiftX);
    const mouseY = Math.round(eventClick.clientY + shiftY * coeficient);

    if (layout.columns * size[0] * coeficient >= mouseX) {

        const cellX = Math.floor(mouseX / (size[0] * coeficient));
        const cellY = Math.floor(mouseY / (size[1] * coeficient));

        steps = searchWay(map, [cellY, cellX]);
    }
    return [map, steps];
}

export function addingMap(map: any[][], raws: number, columns: number) {

    const newArea: any[][] = new Array(raws);

    for(let i = 0; i < newArea.length; i++) {
        newArea[i] = (new Array(columns)).fill("dirt");
    }
    
    map.splice(0, raws);
    map = map.concat(newArea);
    
    return map;
}

export function createLevel(columns: number, raws: number) {
    let gameMap: any[][] = new Array(raws * 4);
    const sky: any[][] = new Array(5);
    for(let i = 0; i < gameMap.length; i++) {
        gameMap[i] = (new Array(columns)).fill("dirt");
    }

    // the sky above us

    for(let i = 0; i < 5; i++) {
        sky[i] = (new Array(columns)).fill("sky")
    }

    gameMap[0] = (new Array(columns)).fill("sky"); 
    gameMap[0][0] = "player" // setting player

    gameMap = sky.concat(gameMap);

    // tslint:disable-next-line:no-console
    console.log(sky, gameMap);
    return gameMap;
}