import { TextStyle } from '@pixi/text';

export namespace AppConstants {
    export const speed = {
        easy: 100,
        normal: 100,
        hard: 100
    };
    export const maxElementPool: number = 15;
    export const maxSkillPool: number = 15;
    export const maxNumberPool: number = 10;
    export const maxDropPoint: number = 450;
    export const timeDropSkill: number = 2000;
    export const maxMissedPoint: number = 20;
    export const backGroundName = {
        mainMenuBackGround: 'main-menu-back-ground',
        gamePlayBackGround : 'game-play-back-ground',
        gameOverBackGround : 'game-over-back-ground'
    };

    export const textStyle = {
        title: new TextStyle({
            fill: '#0798f2',
            fillGradientType: 1,
            fontSize: 50,
            fontStyle: 'oblique',
            fontWeight: '900',
            stroke: '#783b3b'
        }),
        normalText: new TextStyle({
            fill: '#d4ff00',
            fillGradientType: 1,
            fontFamily: 'Courier New',
            fontSize: 24,
            fontStyle: 'oblique',
            fontWeight: '900',
            stroke: '#783b3b'
        }),
        hardLevelText: new TextStyle({
            fill: '#ff0000',
            fillGradientType: 1,
            fontFamily: 'Courier New',
            fontSize: 24,
            fontStyle: 'oblique',
            fontWeight: '900',
            stroke: '#783b3b'
        }),
        finalScoreText: new TextStyle({
            fill: '#ff0000',
            fillGradientType: 1,
            fontFamily: 'Courier New',
            fontSize: 50,
            fontStyle: 'oblique',
            fontWeight: '900',
            stroke: '#783b3b'
        })
    };

    export const text = {
        invokedSuccess: 'Invoked:',
        invokedMissed: 'Missed:',
        title: 'Invoke The Elements',
        choseHardLevel: 'Please Chose Hard Level!!!',
        easyLevel: 'Easy',
        normalLevel: 'Normal',
        hardLevel: 'Hard',
        gameOver: 'GGEZ',
        playAgain: 'Play Again?',
        yourScore: 'Your Score:',
        playedWithLevel: 'Played With Level:'
    };

    export const eventName = {
        addToScene:  'add-to-scene',
        removeFromScene: 'remove-from-scene',
        displayScore: 'display-score',
        displayMainMenu: 'display-main-menu',
        displayGamePlay: 'display-game-play',
        displayGameOver: 'display-game-over',
        playGame: 'play-game',
        playAgain: 'play-again',
        setUpdateStatus: 'set-update-status'
    };

    export const skillName = {
        coldSnap: 'cold-snap',
        ghostWalk: 'ghost-walk',
        iceWall: 'ice-wall',
        EMP: 'E.M.P',
        tornado: 'tornado',
        alacrity: 'alacrity',
        sunStrike: 'sun-strike',
        forgeSpirit: 'forge-spirit',
        chaosMeteor: 'chaos-meteor',
        deafeningBlast: 'deafening-blast'
    };

    export const elementName = {
        quas: 'quas',
        wex: 'wex',
        exort: 'exort'
    };

    export const position = {
        skillPosition1: { x: 330, y: 0 },
        skillPosition2: { x: 130, y: -60 },
        skillPosition3: { x: 530, y: -80 },
        skillPosition4: { x: 230, y: 0 },
        skillPosition5: { x: 430, y: -60 },
        element1: { x: 130, y: 550 },
        element2: { x: 330, y: 550 },
        element3: { x: 530, y: 550 },
        displaySuccessScore: { x: 750, y: 60 },
        displayMissedScore: { x: 750, y: 160 },
        backGround: { x: 400, y: 300 },
        invokedSuccessText: { x: 680, y: 5 },
        invokedMissedText: { x: 680, y: 100 },
        titleText: { x: 130, y: 100 },
        hardLevelOptionText: { x: 230, y: 300 },
        easyText: { x: 200, y: 400 },
        normalText: { x: 355, y: 400 },
        hardText: { x: 530, y: 400 },
        scoreText: { x: 370, y: 230 },
        playAgainText: { x: 320, y: 400 },
        gameOverTitle: { x: 310, y: 100 },
        finalScoreText: { x: 320, y: 200 },
        playedWithLevelText: { x: 250, y: 300 }

    };

    export const keyboardEvent = {
        quas : 'q',
        wex: 'w',
        exort: 'e',
        invoke: 'r'
    };

    export const iconSize = {
        width: 60,
        height: 60,
        scoreWidth: 5,
        scoreHeight: 30
    };

    export const distance = {
        score: 20
    };
}