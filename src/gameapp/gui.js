import { pick_random_idx } from '/gameapp/helpers.js'; 

class BagContainer {
    constructor(n_balls, n_colored_balls){
        // Balls and Keys
        this.n_balls = n_balls;
        this.n_colored_balls = n_colored_balls;
        this.reset_balls(); 
    }

    pop_ball(){
        let remove_id = Math.floor(Math.random()*this.balls.length);
        let x = this.balls.splice(remove_id,1)[0];
        this.removed_balls.push(x);
        return x;
    }

    reset_balls(){
        this.balls = Array(this.n_colored_balls).fill(1).concat(Array(this.n_balls-this.n_colored_balls).fill(0));
        this.removed_balls = [];
    }

}

export class GUI {
    constructor(app){
        // CANVAS
        this.canvas_setup();

        // BUTTONS
        this.button_setup(app);

        let nBalls = app.data.N_total
        let bag1Balls = app.data.N_colored_1
        let bag2Balls = app.data.N_colored_2
        // INIT BAGS
        this.bags = {   0: new BagContainer(nBalls,bag1Balls), 
                        1: new BagContainer(nBalls,bag2Balls)
                    };
        
        this.bag_content = Math.round(100*bag1Balls/nBalls);

    }

    canvas_setup(){
        // CANVAS ELEMENT AND DIMENSIONS
        const canvas_div = document.getElementById('content_div');
        const inner_div = document.createElement('div');
        this.canvas = document.createElement('canvas');
        inner_div.appendChild(this.canvas);
        canvas_div.appendChild(inner_div);
        this.canvas.height = window.innerHeight*3/4;
        this.canvas.width = Math.min( this.canvas.height*5/3, window.innerWidth*4/5 )
        this.h_reference = this.canvas.height/25;
        this.w_reference = this.canvas.width/25;
        console.log(this.canvas.width,this.canvas.height)
        this.center_point = [this.canvas.width/2, this.canvas.height/2]
        this.canvas.id = 'canvas';

        // CANVAS FONT
        this.text_style = this.w_reference.toString()+"px Arial";
        this.text_color = "#000000";
    }

    create_button(btn_name,btn_id,btn_fun,disabled){
        const inner_div = document.createElement('div');
        const btn = document.createElement('button');
        btn.innerText = btn_name;
        btn.id = btn_id;
        btn.style.fontSize = (this.h_reference).toString()+'px';
        btn.classList.add('button_template');
        btn.onclick = btn_fun;
        btn.disabled = disabled;
        inner_div.appendChild(btn);
        this.btn_div.appendChild(inner_div);
        return btn;
    }

    remove_button(btn_id){
        this.buttons[btn_id].parentElement.remove()
    }

    create_export_button(export_function){
        this.remove_button('btn_new_ball');
        this.remove_button('btn_A');
        this.remove_button('btn_B');
        const download_box = document.createElement('div');
        download_box.id = 'download_box';
        this.btn_div.appendChild(download_box);
        this.create_button("Export","btn_export",export_function);
    }

    button_setup(app) {
        this.btn_div = document.getElementById('button_div');
        this.buttons = {};
        const btn_names = ["Jatka", "Uusi Pallo", "Valitse A", "Valitse B"];
        const btn_ids = ["btn_next", "btn_new_ball", "btn_A", "btn_B"];
        const btn_funs = [  app.run_program.bind(app),
                            app.run_game.bind(app), 
                            app.make_selection_A.bind(app),
                            app.make_selection_B.bind(app)]

        const disabled = [false,true,true,true]
        for (let i = 0; i<4; i++){
            this.buttons[btn_ids[i]] = this.create_button(btn_names[i],btn_ids[i],btn_funs[i],disabled[i]);
        }
    } 

    render_rows_of_text(ctx,text,x,y){
        ctx.textAlign = "center"; 
        ctx.font = this.text_style;
        ctx.fillStyle = this.text_color;
        const n_rows = text.length;
        const row_locations = Array.from(new Array(n_rows),(val,index)=>index-3);
        for (let line = 0; line<text.length; line++){
            ctx.fillText(text[line], x, y+row_locations[line]*this.h_reference*2); 
        }

    }

    create_text_on_top(text, x, y){
        let ctx = this.canvas.getContext('2d');
        this.render_rows_of_text(ctx,text,x,y);
    }

    create_text_field(text){
        let ctx = this.canvas.getContext('2d');
        ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.render_rows_of_text(ctx,text,this.center_point[0],this.center_point[1]);
    }

    setup_bags(){
        this.selected_bag = pick_random_idx(2);
        this.bags[0].reset_balls();
        this.bags[1].reset_balls();
    }
}