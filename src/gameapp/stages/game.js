import { Ball, BagImg } from "/gameapp/sprites.js";
import { Stage, turn_on_buttons } from "/gameapp/stages/tools.js";
import { TXT10, TXT11, TXT12, TXT13, TXT14, BALL_COLOR_0, BALL_COLOR_1} from "/constants/constants.js";

export class Game extends Stage {
    constructor(app, nReplications){
        super(app);
        // GENERAL VARIABLES AND SPRITES
        this.total_replications = nReplications
        this.drawn_balls = [];
        this.trials = 0;
        this.rep = 0;
        this.last_ball = NaN;
        this.bag_sprite = new BagImg( [app.gui.w_reference*2, app.gui.h_reference*8], app.gui.h_reference, '/static/img/bag.png');

        // COLORS
        this.color_mapping = {0: BALL_COLOR_0, 1: BALL_COLOR_1};
    }

    init_stage(gui, data_dict){
        turn_on_buttons("btn_next", gui.buttons);
        gui.create_text_field(TXT10);
    }

    async get_ball(gui) {
        // OBTAIN CONTEXT
        let ctx = gui.canvas.getContext('2d');

        // CLEAR PREVIOUS BALL
        if (this.last_ball){
            this.last_ball.clear_img(ctx);
        }

        // DISABLE BUTTONS
        gui.buttons.btn_new_ball.disabled = true;
        gui.buttons.btn_A.disabled = true,
        gui.buttons.btn_B.disabled = true;

        // DRAW NEW BALL 
        const ball_key = gui.bags[gui.selected_bag].pop_ball();
        const ball = new Ball(gui.w_reference*3,gui.h_reference*6,gui.h_reference,this.color_mapping[ball_key]);
        ball.draw(ctx);
        await ball.animate(ball.jump_condition.bind(ball),ball.jump_from_bag);
        ctx.fillStyle = this.text_color;
        ctx.fillRect(gui.canvas.width-gui.h_reference*(this.trials+2),25,10,10)
        this.trials += 1;
        //this.drawn_balls.push(1);
        this.last_ball=ball;
        await this.sleep(0.75);
        if (this.trials < 10) {
            gui.buttons.btn_new_ball.disabled = false;
        }
        gui.buttons.btn_A.disabled = false;
        gui.buttons.btn_B.disabled = false;

        return Promise.resolve(1).then(() => ball_key);
    }
    
    make_selection(gui, selected_id){
        this.selected_id = selected_id;  
        this.correct_id = gui.selected_bag;
        gui.create_text_on_top( [TXT12], gui.center_point[0]+75,gui.center_point[1]+75);
        turn_on_buttons("btn_next", gui.buttons);
    }

    async forward(gui){
        let ctx = gui.canvas.getContext('2d');
        if (this.step === 0) {
            this.trials = 0;
            await gui.setup_bags();
            ctx.clearRect(0,0,1000,1000);
            turn_on_buttons("btn_new_ball", gui.buttons);
            this.bag_sprite.draw(ctx);
            gui.create_text_on_top([TXT11[0]+'A'+TXT11[1]+String(gui.bag_content)+'%',TXT11[0]+'B'+TXT11[1]+String(100-gui.bag_content)+'%'],
                                            gui.center_point[0]+gui.w_reference*4,gui.center_point[1]+gui.h_reference*10);
            this.step++;
        }
        else if (this.step === 1) {
            gui.create_text_field([TXT13[0]+['A','B'][this.selected_id], TXT13[1]+['A','B'][this.correct_id]]);
            this.step++;
        } 
        else {
            ctx.clearRect(0,0,1000,1000);
            if (this.rep >= this.total_replications-1)
                this.is_finished = true;
            else{
                gui.create_text_field( [TXT14[0],TXT14[1],"","(Suoritettu"+parseInt(this.rep+1)+"/"+parseInt(this.total_replications)+")"]);
                this.step = 0;
                this.rep++;
            }
        }
    }
}