export function turn_on_buttons(keys, buttons){
    for (let [key, value] of Object.entries(buttons)){
        if (keys.includes(key)){
            value.disabled = false
        } else {
            value.disabled = true
        }
    }
}

export class Stage {
    constructor(){
        this.is_finished = false;
        this.step = 0;
    }

    async sleep(seconds){
        return new Promise(resolve=>setTimeout(resolve,seconds*1000))
    }

    async init_stage(){};

    async forward(){};
}