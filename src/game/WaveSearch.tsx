function transformArray(map: any[][], finish: number[]) {

    // tslint:disable-next-line:prefer-const
    let mapTransformed: number[][] = new Array(map.length);
    let raw: number[];

    // tslint:disable-next-line:prefer-for-of
    for(let i = 0; i < map.length; i++) {
        raw = [];
        // tslint:disable-next-line:prefer-for-of
        for(let j = 0; j < map[i].length; j++) {
            if (map[i][j] === "player") {
                raw.push(-2);
                continue;
            } else if (map[i][j] === "dirt") {
                raw.push(-1);
                continue;
            } else {
                raw.push(0);
            }


        }
        mapTransformed[i] = raw;
    }


    mapTransformed[finish[0]][finish[1]] = -3;
    
    // -2 - start
    // -3 - finish
    
    return mapTransformed;
}

function recover(map: any[][], level: number) {

    // tslint:disable-next-line:prefer-const
    let steps: number[][] = []; // positions of way in the fastest way
    let currentPosition: number[] = []; // current position of way
    let flag: boolean = false;

    for(let i = 0; i < map.length; i++) {
        for(let j = 0; j < map[i].length; j++) {
            if (map[i][j] === -3) {
                currentPosition = [i, j];
                flag = true;
            }
        }
        if (flag) {
            break;
        }
    }

    for(let i = 1; i <= level; i++) {

        steps.push(currentPosition);

        if (currentPosition[1] + 1 < map[0].length) {
            if (map[currentPosition[0]][currentPosition[1] + 1] === level - i) {
                currentPosition = [currentPosition[0], currentPosition[1] + 1];
                continue;
            }
        }

        if (currentPosition[1] - 1 >= 0) {
            if (map[currentPosition[0]][currentPosition[1] - 1] === level - i) {
                currentPosition = [currentPosition[0], currentPosition[1] - 1];
                continue;
            }
        }

        if (currentPosition[0] + 1 < map.length) {
            if (map[currentPosition[0] + 1][currentPosition[1]] === level - i) {
                currentPosition = [currentPosition[0] + 1, currentPosition[1]];
                continue;
            }
        }

        if (currentPosition[0] - 1 >= 0) {    
            if (map[currentPosition[0] - 1][currentPosition[1]] === level - i) {
                currentPosition = [currentPosition[0] - 1, currentPosition[1]];
                continue;
            }
        }
    }


    return steps;
}

function search(map: any[][], level: number, flag: boolean, isFound: boolean): any {

    // -2 - start
    // -3 - finish

    let a: number;

    // search if there is still way to search finish
    // tslint:disable-next-line:prefer-for-of
    for(let i = 0; i < map.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for(let j = 0; j < map[i].length; j++) {
            if (level - 1 === map[i][j]) {
                flag = false;
                break;
            }
        }
        if (flag === false) {
            break;
        }
    }

    for(let i = 0; i < map.length; i++) {
        for(let j = 0; j < map[i].length; j++) {
            if (map[i][j] === 0 || map[i][j] === -3) {
                a = map[i][j];
                // if symbol not in the end(last raw) of map then we check
                if (i !== map.length - 1 && map[i][j] !== -1) {
                    if (map[i+1][j] === level - 1 || map[i+1][j] === -2) {
                        map[i][j] = level;
                    }
                }

                // if symbol not in the start(1 raw) of map then we check
                if (i !== 0 && map[i][j] !== -1) {
                    if (map[i-1][j] === level - 1 || map[i-1][j] === -2) {
                        map[i][j] = level;
                        
                    }
                }

                // if symbol not in the end of map then we check
                if (j !== map[0].length - 1 && map[i][j] !== -1) {
                    if (map[i][j+1] === level - 1 || map[i][j+1] === -2) {
                        map[i][j] = level;
                    }
                }

                // if symbol not in the end of map then we check
                if (j !== 0 && map[i][j] !== -1) {
                    if (map[i][j-1] === level - 1 || map[i][j-1] === -2) {
                        map[i][j] = level;
                    }
                }
                
                // if symbol is 'finish' then we return as finish
                if (a === -3 && map[i][j] === level) {
                    isFound = true;
                    flag = true;
                    map[i][j] = -3;
                }
            }
        }

    }

    if (flag) {
        return [map, level, isFound];
    }

    flag = true;

    return search(map, level + 1, flag, isFound);
}

function searchWay(map: any[][], press: number[]) {

    let level: number = 2;
    let steps: number[][] = [];
    let isFound: boolean;

    const time = search(transformArray(map, press), level, false, false);

    map = time[0];
    level = time[1];
    isFound = time[2];

    if (isFound) {
        steps = recover(map, level);
    }

    steps.reverse();

    return steps;
}

export default searchWay;