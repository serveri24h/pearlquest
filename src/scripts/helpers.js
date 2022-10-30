const { invoke } = window.__TAURI__.tauri;




export function range(start, end) {
    return Array(end - start).fill().map((_, idx) => start + idx)
}

function get_timestamp(){
    const d = new Date
    var time_stamp = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()
                                +'-'+d.getHours()+':'+d.getMinutes()+',';
    return time_stamp;
}

export async function datadump(data_dict){
    await invoke("datadump", { data: data_dict });
}

export function sum_of_list(l){
    let s = 0;
    for (let i = 0; i<l.length; i++){
        s+=l[i];
    }
    return s;
}

export function pick_random_idx(n_range){
    return Math.floor(Math.random()*n_range);
}

export class BagContainer {
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