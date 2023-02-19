

import { GameApp } from "/gameapp/gameapp.js";
import { AdminApp } from "/adminapp/adminapp.js";
import { read_default_settings } from "./api.js";



function clear_screen(){
    document.getElementById('content_div').innerHTML = ''
    document.getElementById('button_div').innerHTML = ''
}

export function run_gameapp(nBalls, nRedBalls, nReplications){
    clear_screen()
    const gameapp = new GameApp(nBalls, nRedBalls, nReplications);
}

function run_adminapp(){
    clear_screen()
    const adminapp = new AdminApp();
}


class App {
    constructor(){

        let text_div = document.getElementById('content_div')
        let button_div = document.getElementById('button_div') 

        let intro_text = document.createElement('p')
        intro_text.innerHTML = "Paina 'Pelaa' päästäksesi pelaamaan helmipeliä."

        let play_button = document.createElement('button')
        play_button.innerHTML = 'Pelaa'
        play_button.onclick = async function () {
            let {totalBalls, coloredBalls, nReplications} = await read_default_settings();
            run_gameapp(totalBalls, coloredBalls, nReplications)
        }

        let admin_button = document.createElement('button')
        admin_button.innerHTML = 'Admin'
        admin_button.onclick = run_adminapp
       
        text_div.appendChild(intro_text)
        button_div.appendChild(play_button)
        button_div.appendChild(admin_button)

    }
}

const main = new App();
