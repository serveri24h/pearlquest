

import { GUI } from "/scripts/gui.js";
import { Intro } from "/scripts/stages/intro.js";
import { Game } from "/scripts/stages/game.js";
import { Outro } from "/scripts/stages/outro.js";
import { COLORED_BALLS_IN_BAG1, COLORED_BALLS_IN_BAG2, N_BALLS_IN_BAG, TEST_REPLICATIONS } from "/scripts/constants.js";

class App {
    constructor(){
        // INIT GUI
        this.gui = new GUI(this);

        // INIT STAGES
        const intro = new Intro(this.gui,this.bags);
        this.game = new Game(this.gui);
        const outro = new Outro();
        this.stages = {0: intro, 1: this.game, 2: outro};
        this.current_stage = 0;
        intro.init_stage(this.gui);

        // GATHER DATA
        this.data = {   'N_total': N_BALLS_IN_BAG, 
                        'N_colored_1':COLORED_BALLS_IN_BAG1, 
                        'N_colored_2':COLORED_BALLS_IN_BAG2, 
                        'correct_bag': new Array(TEST_REPLICATIONS), 
                        'selected_bag': new Array(TEST_REPLICATIONS),
                        'data': new Array(TEST_REPLICATIONS).fill("") };
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

const main = new App();

