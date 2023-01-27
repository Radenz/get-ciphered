import { alphaUpperCaseOf } from "./utils/char";
import { ModulusMatrix } from "./utils/math";

type Rotor = [string, string, string];
type Position = [number, number, number];
class Enigma {
	private rotor: Rotor;
	private position: Position;
	private tick1: number;
	private tick2: number;
	private plugboard: string;

	// constructor(){}
	constructor(
		private readonly rotor1: string,
		private readonly rotor2: string,
		private readonly rotor3: string,
		private readonly pl: string,
        private readonly reflector:string
	) {
		this.rotor = [rotor1, rotor2, rotor3];
		this.position = [0, 0, 0];
		this.plugboard = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var source = pl.replace(" ", "");
        for (let i = 0; i < source.length; i += 2) {
			var a = this.plugboard.replace(source[i], "0").replace(source[i +1],"1")
            this.plugboard = a.replace("1",source[i]).replace("0",source[i + 1])
        }
        this.reflector = reflector;
        
	}

	encrypt(source: string): string {
		const encrypted = [];
		for (let i = 0; i < source.length; i++) {
			var code = source.charCodeAt(i);
            code =  this.plugboard.charCodeAt((code - 65) % 26);
			// left to right rotor encrpt
			for (let j = 0; j < 3; j++) {
				code = this.rotor[j].charCodeAt((code - 65 + this.position[j]) % 26);
                console.log(String.fromCharCode(code));
			}

			// reflector
            code = this.reflector.charCodeAt(code-65);
            
            console.log("reflect" + String.fromCharCode(code));
            //right to left rotor
            for (let j = 2; j >=0; j--) {

                if (j!=2){
                    code =(code % 26) + 65;
                }
                
                code = (this.rotor[j].indexOf(String.fromCharCode(code)) - this.position[j]+26) %26;
                console.log(code);
            }
			encrypted.push(code+65);
			this.spinrotor();
		}
		return String.fromCharCode(...encrypted);
	}

    decrypt(source:string){
        return this.encrypt(source);
    }
	/*
    Every letters, the first rotor will make one tick
    Every 26th tick of the first rotor, the second one will make one tick
    Every 26th tick of the second rotor, the third one will make one tick
    */
	spinrotor() {
		this.position[0] = (this.position[0] + 1) % 26;
        this.tick1++;
		if (this.tick1 == 26) {
			this.position[1] = (this.position[1] + 1) % 26;
			this.tick2 += 1;
			this.tick1 = 0;
		}
		if (this.tick2 == 26) {
			this.position[2] = (this.position[2] + 1) % 26;
            this.tick2 =0;
		}
	}
    
}
export { Enigma };
