import { Stage, turn_on_buttons } from "/gameapp/stages/tools.js";
import{ TXT20,TXT21 } from "/constants/constants.js";
import { dumpDump } from "/api.js";

export class Outro extends Stage {
    constructor(){
        super();
        this.step = 0;
    }

    init_stage(gui,data_dict){
        turn_on_buttons("btn_next", gui.buttons);
        gui.create_text_field(TXT20);
        gui.create_export_button(this.export_data.bind(this));
        this.data = data_dict;
    }

    async export_data(){
        await dumpDump(this.data);
    }

    async forward(gui) {
        console.log("RASD", this.data)
        gui.buttons.btn_next.disabled = true;
        if (this.step === 0) {
            gui.create_text_field(TXT21);
            await this.sleep(1);
            gui.buttons.btn_next.disabled = false;
            this.step++;
        }   
        else {
            this.is_finished = true;
            turn_on_buttons([], gui.buttons)
        }
    }
}