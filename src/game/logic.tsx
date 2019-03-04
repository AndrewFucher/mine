import searchWay from './WaveSearch'; // algorithm to find the fastest way from one point to another

// tslint:disable-next-line:interface-name
interface Layout {
    columns: number;
    raws: number;
}

const tuple: any = {
    1: "dirt",
    0: "none"
}

class Logic {

    public static move(map: any[][], position: number[]) {

        let addingDepth: number = 0;

        // tslint:disable-next-line:prefer-for-of
        for(let i = 0; i < map.length; i++) {
            for(let j = 0; j < map[i].length; j++) {
    
                if (map[i][j] === "player") {
                    map[i][j] = "none";
                    addingDepth = position[0] - i;
                    break;
                }
            }
        }
    
        map[position[0]][position[1]] = "player";
    
        return {map, addingDepth};
    }
    
    public static clickHandle(eventClick: any, map: any[][], shiftX: number, shiftY: number, layout: Layout, size: number[], coeficient: number) {
    
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
    
    public static addingMap(map: any[][], raws: number, columns: number) {
    
        let newArea: any[][] = new Array(raws);
    
        for(let i = 0; i < newArea.length; i++) {
            newArea[i] = (new Array(columns)).fill(1);
        }
        
        map.splice(0, raws);

        newArea = this.lightning(newArea);

        map = map.concat(newArea);
        
        return map;
    }
    
    public static createLevel(columns: number, raws: number, coeficient: number) {

        coeficient++;
        let newArea: any[][];
        let gameMap: any[][] = [];
        const sky: any[][] = new Array(5);

        for(let j = 0; j < coeficient; j++) {
            newArea = new Array(raws);
            for(let i = 0; i < newArea.length; i++) {
                newArea[i] = (new Array(columns)).fill(1);
            }

            newArea = this.lightning(newArea);
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

    public static refilling(map: any[][]) {

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

    public static lightning(map: any[][]): any[][] {
 
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

        return this.refilling(map);
    }
}

export default Logic;