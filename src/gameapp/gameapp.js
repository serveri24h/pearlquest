import { GUI } from "/gameapp/gui.js";
import { Intro } from "/gameapp/stages/intro.js";
import { Game } from "/gameapp/stages/game.js";
import { Outro } from "/gameapp/stages/outro.js";

export class GameApp {
    constructor(totalBalls, coloredBalls, nReplications){

        console.log("TÄS", totalBalls, coloredBalls, nReplications)

        // GATHER DATA
        this.data = {   
            'N_total': totalBalls, 
            'N_colored_1': coloredBalls, 
            'N_colored_2': totalBalls-coloredBalls, 
            'correct_bag': new Array(nReplications), 
            'selected_bag': new Array(nReplications),
            'data': new Array(nReplications).fill("") 
        };

        // INIT GUI
        this.gui = new GUI(this);
        // INIT STAGES
        const intro = new Intro(this);
        this.game = new Game(this, nReplications);
        const outro = new Outro();
        this.stages = {0: intro, 1: this.game, 2: outro};
        this.current_stage = 0;
        intro.init_stage(this.gui);
        
    }

    async run_game() {
        const ball_value = await this.game.get_ball(this.gui);
        this.data['data'][this.game.rep]+=String(ball_value);
    }

    async make_selection_A(){
        this.data['correct_bag'][this.game.rep] = this.gui.selected_bag;
        this.data['selected_bag'][this.game.rep] = 0;
        this.game.make_selection(this.gui, this.data['selected_bag'][this.game.rep], this.data['correct_bag'][this.game.rep]);
    }

    async make_selection_B(){
        this.data['correct_bag'][this.game.rep] = this.gui.selected_bag;
        this.data['selected_bag'][this.game.rep] = 1;
        this.game.make_selection(this.gui, this.data['selected_bag'][this.game.rep], this.data['correct_bag'][this.game.rep]);
    }

    async run_program(){
        var s = this.stages[this.current_stage];
        s.forward(this.gui);
        if (s.is_finished && this.current_stage < Object.keys(this.stages).length-1) {
            await this.current_stage++;
            this.stages[this.current_stage].init_stage(this.gui,this.data);
        }
    }
}