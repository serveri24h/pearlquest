import { BagImg } from "/gameapp/sprites.js";
import { Stage, turn_on_buttons } from "/gameapp/stages/tools.js";
import{ TXT00,TXT01,TXT02,TXT03 } from "/constants/constants.js";

export class Intro extends Stage {
    constructor(app){
        super();
        const bag1_spawn_location = [ -6*app.gui.h_reference, app.gui.center_point[1]-app.gui.h_reference*8]
        const bag2_spawn_location = [ app.gui.canvas.width, app.gui.center_point[1]-app.gui.h_reference*8]
        this.bag1 = new BagImg( bag1_spawn_location, app.gui.h_reference, '/static/img/bag.png', app.data.N_total, app.gui.bags[0].balls);    
        this.bag2 = new BagImg( bag2_spawn_location, app.gui.h_reference, '/static/img/bag.png', app.data.N_total, app.gui.bags[1].balls);
        this.step = 0;
    }

    init_stage(gui,data_dict){
        turn_on_buttons("btn_next", gui.buttons);
        gui.create_text_field(TXT00);
    }

    async anim1(gui){
        this.bag1.entry_anim([ gui.w_reference,0], gui.center_point[0]-gui.h_reference*7.25, true);
        this.bag2.entry_anim([-gui.w_reference,0], gui.center_point[0]+gui.h_reference*1.25, false);
        await this.sleep(0.5);
        this.bag1.reveal_balls();
        this.bag2.reveal_balls();
    }

    async anim2(ctx){
        this.bag1.show_content = false;
        this.bag2.show_content = false;
        this.bag1.exit_anim([0,-25]);
        this.bag2.exit_anim([0,-25]);
        await this.sleep(0.35);
        this.bag1.clear_img(ctx);
        this.bag2.clear_img(ctx);
        ctx.clearRect(0,0,1000,1000);
    }

    async forward(gui) {
        let ctx = gui.canvas.getContext('2d');
        gui.buttons.btn_next.disabled = true;
        if (this.step === 0) {
            gui.create_text_field(TXT01);
            await this.sleep(0.5);
        }
        else if (this.step === 1) {
            ctx.clearRect(0,0,1000,1000);
            await this.anim1(gui);
            gui.create_text_on_top(TXT02, gui.center_point[0], gui.canvas.height-2*gui.h_reference);
            await this.sleep(0.5);
        }
        else if (this.step === 2) {
            await this.anim2(ctx);
            gui.create_text_field(TXT03);
            this.is_finished = true;
            await this.sleep(0.5);
        } else {
            ctx.clearRect(0,0,1000,1000);
        }
        this.step++;
        gui.buttons.btn_next.disabled = false;
    }
}