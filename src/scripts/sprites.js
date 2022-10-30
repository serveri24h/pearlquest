import {BALL_COLOR_0, BALL_COLOR_1, N_BALLS_IN_BAG} from '/scripts/constants.js';

class Ball {
    constructor(x,y,r,color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.stop_condition = y+2*r;
        this.color = color;
        this.direction = [600/r,-15];
        this.acceleration = [0,r/2,1.1];
    }

    move(){
        this.x += this.direction[0];
        this.y += this.direction[1];
    }

    draw(c){
        c.beginPath();
        c.arc(this.x+this.r, this.y, this.r, 0, 2 * Math.PI);
        c.stroke();
        c.fillStyle = this.color;
        c.fill();
    }

    jump_from_bag(){
        this.move();
        this.direction = [this.direction[0], this.direction[1]+this.acceleration[1]];
        this.r*=this.acceleration[2];
    }

    jump_condition(y){
        if (y<this.stop_condition) {
            return true;
        }
        return false;
    }

    clear_img(c) {
        c.clearRect(this.x-1,this.y-this.r-1,this.r*2+2,this.r*2+2);
    }

    animate(condition, move_function) {
        if (condition(this.y)) {
            const c = document.querySelector("#canvas").getContext('2d');
            this.clear_img(c);
            this.jump_from_bag();
            this.draw(c);
            window.requestAnimationFrame(this.animate.bind(this, condition, move_function));
        }
    }
}

class WebImg {
    constructor(x,y,w,h, img_src) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        const img = new Image();
        img.src = img_src;
        this.img = img;
    }

    draw(c) {
        c.drawImage(this.img,this.x,this.y, this.w, this.h);
    }

    clear_img(c) {
        c.clearRect(this.x-10,this.y-10,this.w+20,this.h+20);
    }

    move( direction) {
        this.x += direction[0];
        this.y += direction[1];
    }
}

class BagImg extends WebImg {
    constructor(position,ref_size,img_src,colors) {
        super(position[0],position[1],ref_size*6,ref_size*9,img_src); // RATIO = 2:3
        this.n_rows = 5;
        this.n_cols = 4;
        this.border_width = 5;
        this.radius = 2*ref_size/5;
        this.colors = colors; 
        this.box_offset = [1.3*ref_size,3.75*ref_size];
        this.show_content = false;
        this.fps = 60
    }

    draw_content(c) {
        let pos_x = this.x+this.box_offset[0];
        let pos_y = this.y+this.box_offset[1]; 
        for (let i = 0; i<this.n_rows; i++){
            for (let j = 0; j<this.n_cols; j++){
                c.beginPath();
                c.arc(pos_x+(j*2+1)*this.radius, pos_y+(i*2+1)*this.radius, this.radius, 0, 2 * Math.PI);
                c.stroke();
                if (this.colors[(i*this.n_cols+j)]===1){
                    c.fillStyle = BALL_COLOR_1;
                } else {
                    c.fillStyle = BALL_COLOR_0;
                }
                c.fill();
            }
        }
    }

    get_status() {
        return this.status
    }

    entry_condition(edge, smaller){
        if ( (smaller && this.x<edge) || (!smaller && this.x>edge) ) {
            return true;
        } else {
            return false;
        }
    }

    exit_condition(){
        if (this.y>-400){
            return true;
        } else {
            return false;
        }
    }

    draw(c) {
        super.draw(c);
        if (this.show_content){
            this.draw_content(c);
        }
    }

    animate(condition, position) {
        if (condition()) {
            var now = Date.now();
            if (now-this.then > 1000/this.fps) {
                this.then = now;
                const c = document.querySelector("#canvas").getContext('2d');
                this.clear_img(c);
                this.move(position);
                this.draw(c);
            }
            window.requestAnimationFrame(this.animate.bind(this, condition, position));
        }
    }

    entry_anim(position, edge, smaller) {
        this.then = Date.now();
        this.animate(this.entry_condition.bind(this,edge,smaller), position);
    }

    exit_anim(position) {
        this.then = Date.now();
        this.animate(this.exit_condition.bind(this), position);
    }

    reveal_balls() {
        this.show_content = true;
        const c = document.querySelector("#canvas").getContext('2d');
        this.clear_img(c);
        this.draw(c);
    }
}

export {Ball, BagImg};
