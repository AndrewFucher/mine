const maxStones = 6;
const maxBedrocks = 6;

const tuple: any = {
    3: "bedrock",
    2: "player",
    1: "dirt",
    0: "none"
}

function addingMap(coeficient: number, raws: number, columns: number) {

    // tslint:disable-next-line:no-console
    console.log(maxStones)

    coeficient++; // to make a field 24x7, so that player couldn't see white line int the end
    let newArea: any[][];
    let gameMap: any[][] = [];
    const sky: any[][] = new Array(5);

    for(let j = 0; j < coeficient; j++) {
        newArea = new Array(raws);
        for(let i = 0; i < newArea.length; i++) {
            newArea[i] = (new Array(columns)).fill(1);
        }

        newArea = lightning(newArea);
        newArea = addBedrock(newArea, columns, raws);
        newArea = addStone(newArea, columns, raws);

        gameMap = gameMap.concat(newArea);
    }

    // the sky above us
    for(let i = 0; i < 5; i++) {
        sky[i] = (new Array(columns)).fill("sky")
    }
    gameMap[0] = (new Array(columns)).fill("sky"); 
    gameMap[0][0] = "player" // setting player
    gameMap = sky.concat(gameMap);
    
    return gameMap;
}

function createLevel(coeficient: number, columns: number, raws: number, map?: any[][]) {

    if (map) {
        let newArea: any[][] = new Array(raws);

        for(let i = 0; i < newArea.length; i++) {
            newArea[i] = (new Array(columns)).fill(1);
        }
        
        map.splice(0, raws);

        newArea = lightning(newArea);
        newArea = addBedrock(newArea, columns, raws);
        newArea = addStone(newArea, columns, raws);

        map = map.concat(newArea);
        
        return map;
    } else {
        return addingMap(coeficient, columns, raws);
    }
}

function refilling(map: any[][]) {

    // tslint:disable-next-line:prefer-for-of
    for(let i = 0; i < map.length; i++) {
        for(let j = 0; j < map[i].length; j++) {
            if (map[i][j] % 1 !== 0) {
                map[i][j] = tuple[1];
            } else {
                map[i][j] = tuple[0];
            }
        }
    }

    return map;

}

// adds stones to game
function addStone(map: any[][], columns: number, raws: number) {

    return map;
}

// adds bedrock(cant be destroyed) to game
function addBedrock(map: any[][], columns: number, raws: number) {

    const countBedrocks = Math.floor(Math.random() * maxBedrocks);
    
    for(let currentBedrock = 0; currentBedrock < countBedrocks; currentBedrock++) {
        let currentBedrockPosition: number = Math.floor(Math.random() * columns * raws - 27);

        // tslint:disable-next-line:prefer-for-of
        for(let i = 0; i < map.length; i++) {
            if (currentBedrockPosition) {
                for(let j = 0; j < map[i].length; j++) {
                    if (map[i][j] === tuple[1]) {
                        currentBedrockPosition--;
                    }
                    if (currentBedrockPosition === 0) {
                        map[i][j] = tuple[3];
                        break;
                    }
                }
            } else {
                break;
            }
        }

    }

    return map;
}

function lightning(map: any[][]): any[][] {

    let weight: number = Math.random() * Math.floor(Math.random() * 23 + 4);

    // tslint:disable-next-line:prefer-for-of
    for(let i = 0; i < map.length; i++) {
        for(let j = 0; j < map[i].length; j++) {
            
            if (map[i][j] === 1) {
                map[i][j] = Math.random();
            } else {
                map[i][j] = 0
            };

        }
    }

    const startCoords = [Math.floor(Math.random() * map.length + 1), Math.floor(Math.random() * map[0].length)];

    if (startCoords[0] === 0) {
        startCoords[0]++;
    } else if (startCoords[0] === map.length) {
        startCoords[0]--;
    }

    map[startCoords[0]][startCoords[1]] = 0;

    while(weight > 0) {
        let minWeightCell: number[] = [];
        let minWeightValue: number = 100;
        for(let i = 1; i < map.length; i++) {
            for(let j = 0; j < map[i].length; j++) {
                if (map[i][j] === 0 || map[i][j] === -3) {
                    // if symbol not in the end(last raw) of map, then we check
                    if (i !== map.length - 1) {
                        if (map[i+1][j] !== 0 && map[i+1][j] < minWeightValue) {
                            minWeightCell = [i+1, j];
                            minWeightValue = map[i+1][j];
                        }
                    }
    
                    // if symbol not in the start(1 raw) of map, then we check
                    if (i !== 0 && map[i][j] !== -1) {
                        if (map[i-1][j] !== 0 && map[i-1][j] < minWeightValue) {
                            minWeightCell = [i-1, j];
                            minWeightValue = map[i-1][j];
                        }
                    }
    
                    // if symbol not in the end of map, then we check
                    if (j !== map[0].length - 1) {
                        if (map[i][j+1] !== 0 && map[i][j+1] < minWeightValue) {
                            minWeightCell = [i, j+1];
                            minWeightValue = map[i][j+1];
                        }
                    }
    
                    // if symbol not in the end of map, then we check
                    if (j !== 0) {
                        if (map[i][j-1] !== 0 && map[i][j-1] < minWeightValue) {
                            minWeightCell = [i, j-1];
                            minWeightValue = map[i][j-1];
                        }
                    }
                }
            }
        }

        weight -= minWeightValue;
        map[minWeightCell[0]][minWeightCell[1]] = 0;

    }

    return refilling(map);
}

export default createLevel;