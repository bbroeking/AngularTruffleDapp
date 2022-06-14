import movesData from "./movesData";
import typeColors from "./typeColors";

export interface EtherealSVG {
    hp: number,
    attack: number,
    defense: number,
    spattack: number,
    spdefense: number,
    speed: number,
    typeOne: string,
    typeTwo: string,
    moveOne: string,
    moveOneType: string,
    moveTwo: string,
    moveTwoType: string,
    moveThree: string,
    moveThreeType: string,
    moveFour: string,
    moveFourType: string
}

export class Ethereal {
    etherealSvg: EtherealSVG;
    currentStats: { hp: number; attack: number; defense: number; spAtk: number; spDef: number; speed: number; moves: { [x: string]: any; }; types: any[]; };
    fullHealth: number;
    statChanges: { attack: number; defense: number; spAtk: number; spDef: number; speed: number; };
    // currentStats: 
    constructor(ethereal: EtherealSVG){
        this.etherealSvg = ethereal;
        const parsedEthereal = this.parseSvg(ethereal);

        this.currentStats = Object.assign({}, parsedEthereal);
        this.currentStats['hp'] = 141 + 2 * this.currentStats['hp']; // the hp stat is different than the amount of hp they have
        this.fullHealth = this.currentStats['hp'];
        this.statChanges = {
            attack: 0,
            defense: 0,
            spAtk: 0,
            spDef: 0,
            speed: 0,
        }
    }

    parseSvg(ethereal: EtherealSVG) {
        return {
            hp: ethereal.hp,
            attack: ethereal.attack,
            defense: ethereal.defense,
            spAtk: ethereal.spattack,
            spDef: ethereal.spdefense,
            speed: ethereal.speed,
            moves: {
                [ethereal.moveOne]: movesData[ethereal.moveOne],
                [ethereal.moveTwo]: movesData[ethereal.moveTwo],
                [ethereal.moveThree]: movesData[ethereal.moveThree],
                [ethereal.moveFour]: movesData[ethereal.moveFour],
            },
            types: [typeColors[ethereal.typeOne], typeColors[ethereal.typeTwo]]
        };
    }

    resetStats(){ // stats are reset when a pokemon switches out
        this.statChanges = {
            attack: 0,
            defense: 0,
            spAtk: 0,
            spDef: 0,
            speed: 0,
        }
        let hp = this.currentStats['hp'];
        this.currentStats = Object.assign({}, this.parseSvg(this.etherealSvg));
        this.currentStats['hp'] = hp;
    }
}