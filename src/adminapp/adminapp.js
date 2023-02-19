import { run_gameapp } from "/main.js"
import { read_default_settings } from "/api.js"

export class AdminApp {
    constructor(){
        this.setupDisplay();
        this.setupButtons();
    }

    setupButtons(){
        // Buttons
        this.buttonDiv = document.getElementById('button_div');
        
        let saveButton = document.createElement('button');
        saveButton.innerHTML = 'Tallena';
        saveButton.onclick = this.saveSettings;

        let playButton = document.createElement('button');
        playButton.innerHTML = 'Pelaa';
        playButton.onclick = this.rungame_with_values

        this.buttonDiv.appendChild(playButton)
        this.buttonDiv.appendChild(saveButton)
    }

    rungame_with_values () {
        let totalBalls = parseInt(document.getElementById('totalBalls').value);
        let coloredBalls = parseInt(document.getElementById('coloredBalls').value);
        let nReplications = parseInt(document.getElementById('nReplications').value);
        run_gameapp(totalBalls,coloredBalls,nReplications);
    }

    async setupDisplay() {
        let {totalBalls, coloredBalls, nReplications} = await read_default_settings();
        
        // Get Div
        let contentDiv = document.getElementById('content_div');
        
        // HTML1
        let helpText1 = document.createElement('p');
        helpText1.innerHTML = "Valitse pallojen jakauma:";
        contentDiv.appendChild(helpText1);

        // Create the first input element with label "N balls"
        const nBallsLabel = document.createElement("label");
        nBallsLabel.innerHTML = "Palloja yhteensä: ";
        const nBallsInput = document.createElement("input");
        nBallsInput.setAttribute("type", "number");
        nBallsInput.setAttribute("min", "10");
        nBallsInput.setAttribute("max", "200");
        nBallsInput.setAttribute("required", "true");
        nBallsInput.value = totalBalls;
        nBallsInput.id = 'totalBalls'
        nBallsLabel.appendChild(nBallsInput);

        // Create the second input element with label "N red balls"
        const nRedBallsLabel = document.createElement("label");
        nRedBallsLabel.innerHTML = "Värin 1 pallojen lukumäärä: ";
        const nRedBallsInput = document.createElement("input");
        nRedBallsInput.setAttribute("type", "number");
        nRedBallsInput.setAttribute("min", "0");
        nRedBallsInput.setAttribute("required", "true");
        nRedBallsInput.setAttribute("max", nBallsInput.value);
        nRedBallsInput.value = coloredBalls;
        nRedBallsInput.id = 'coloredBalls'
        nRedBallsLabel.appendChild(nRedBallsInput);

        // Create the third input element with label "N blue balls"
        const nBlueBallsLabel = document.createElement("label");
        nBlueBallsLabel.innerHTML = "Värin 2 pallojen lukumäärä: ";
        const nBlueBallsInput = document.createElement("input");
        nBlueBallsInput.setAttribute("type", "text");
        nBlueBallsInput.setAttribute("readonly", "true");
        nBlueBallsLabel.appendChild(nBlueBallsInput);

        let countBlueBalls = function () {
            nRedBallsInput.setAttribute("max", nBallsInput.value);
            nBlueBallsInput.value = nBallsInput.value - nRedBallsInput.value;
        }
        countBlueBalls()

        // Add event listener to update the max value of the second input element based on the value of the first input element
        nBallsInput.addEventListener("change", function () {
            if (parseInt(nBallsInput.value) > nBallsInput.max) {
                nBallsInput.value = nBallsInput.max;
            }
            if (parseInt(nBallsInput.value) < parseInt(nRedBallsInput.value)) {
                nRedBallsInput.value = nBallsInput.value
            }
            countBlueBalls();
        });

        nRedBallsInput.addEventListener("change", function () {
            if (parseInt(nRedBallsInput.value) > nRedBallsInput.max) {
                nRedBallsInput.value = nRedBallsInput.max-10;
            }
            this.coloredBalls = parseInt(nRedBallsInput.value);
            console.log(this.coloredBalls)
            countBlueBalls();
        });

        // Add the input elements to the document
        const form = document.createElement("form");
        form.appendChild(nBallsLabel);
        form.appendChild(nRedBallsLabel);
        form.appendChild(nBlueBallsLabel);
        contentDiv.appendChild(form);

        // HTML2
        let helpText2 = document.createElement('p');
        helpText2.innerHTML = "Valitse toistojen määrä:";
        contentDiv.appendChild(helpText2);

        //
        const nRepsLabel = document.createElement("label");
        nRepsLabel.innerHTML = "Toistoja: ";
        const nRepsInput = document.createElement("input");
        nRepsInput.setAttribute("type", "number");
        nRepsInput.setAttribute("min", "1");
        nRepsInput.setAttribute("required", "true");
        nRepsInput.value = nReplications;
        nRepsInput.id = 'nReplications'
        nRepsLabel.appendChild(nRepsInput);
        contentDiv.appendChild(nRepsLabel);
    }

    saveSettings(){
        console.log("implemente")
    }
}