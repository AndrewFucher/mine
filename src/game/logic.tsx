import createLevel from './LevelGeneration/levelGeneration';
import searchWay from './WaveSearch'; // algorithm to find the fastest way from one point to another

// tslint:disable-next-line:interface-name
interface Layout {
    columns: number;
    raws: number;
}

const tuple: any = {
    3: "bedrock",
    2: "player",
    1: "dirt",
    0: "none"
}

class Logic {

    /**
     * static checkLoose
     */
    public static checkLoose(map: any[][]) {
        
        let isIn: boolean = false;

        map.forEach(element => {
            element.forEach(x => {
                if (x === tuple[2]) {
                    isIn = true;
                }
            });
        });

        return isIn;

    }

    public static move(map: any[][], position: number[]) {

        let addingDepth: number = 0;

        if (map[position[0]][position[1]] !== tuple[3]) {
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
        }
    
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
    
    /**
     * createlevel
     */
    public static createLevel(coeficient: number, map?: any[][], raws: number = 0, columns: number = 0) {

        return createLevel(coeficient, columns, raws, map);
    
    }
    
    
}

export default Logic;