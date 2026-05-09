 let exercises = [];
let goals = [];

const exerciseList =
document.getElementById("exerciseList");

const goalList =
document.getElementById("goalList");

const currentExercise =
document.getElementById("currentExercise");

const timer =
document.getElementById("timer");

const percentage =
document.getElementById("percentage");

/* GUARDAR DATOS */

function saveData(){

    const data = {
        exercises,
        goals,
        name:
        document.getElementById("name").value,

        motivation:
        document.getElementById("motivation").value,

        purpose:
        document.getElementById("purpose").value
    };

    localStorage.setItem(
        "obsidianData",
        JSON.stringify(data)
    );
}

/* CARGAR DATOS */

function loadData(){

    const saved =
    localStorage.getItem("obsidianData");

    if(!saved) return;

    const data =
    JSON.parse(saved);

    exercises =
    data.exercises || [];

    goals =
    data.goals || [];

    document.getElementById("name").value =
    data.name || "";

    document.getElementById("motivation").value =
    data.motivation || "";

    document.getElementById("purpose").value =
    data.purpose || "";

    renderExercises();
    renderGoals();
    updateProgress();
}

/* METAS */

function addGoal(){

    const input =
    document.getElementById("goalInput");

    const value =
    input.value.trim();

    if(value === "") return;

    goals.push(value);

    input.value = "";

    renderGoals();
    saveData();
}

function renderGoals(){

    goalList.innerHTML = "";

    goals.forEach((goal,index)=>{

        const li =
        document.createElement("li");

        li.style.marginBottom = "10px";

        li.innerHTML = `
            ${goal}
            <button onclick="deleteGoal(${index})">
            ❌
            </button>
        `;

        goalList.appendChild(li);
    });
}

function deleteGoal(index){

    goals.splice(index,1);

    renderGoals();
    saveData();
}

/* EJERCICIOS */

function addExercise(){

    const name =
    document.getElementById("exerciseName")
    .value.trim();

    const time =
    document.getElementById("exerciseTime")
    .value;

    if(name === "" || time === "")
    return;

    exercises.push({
        name,
        time:Number(time),
        completed:false
    });

    document.getElementById(
        "exerciseName"
    ).value = "";

    document.getElementById(
        "exerciseTime"
    ).value = "";

    renderExercises();
    updateProgress();
    saveData();
}

function renderExercises(){

    exerciseList.innerHTML = "";

    exercises.forEach((exercise,index)=>{

        const card =
        document.createElement("div");

        card.className =
        "exercise-card";

        card.innerHTML = `
            <div>
                <h3>
                    ${exercise.name}
                </h3>

                <p>
                    ${exercise.time}
                    min
                </p>
            </div>

            <div>

                <button
                onclick="
                completeExercise(${index})
                ">
                ✅
                </button>

                <button
                onclick="
                deleteExercise(${index})
                ">
                ❌
                </button>

            </div>
        `;

        if(exercise.completed){
            card.style.border =
            "2px solid lime";
        }

        exerciseList.appendChild(card);
    });
}

function deleteExercise(index){

    exercises.splice(index,1);

    renderExercises();
    updateProgress();
    saveData();
}

function completeExercise(index){

    exercises[index].completed =
    !exercises[index].completed;

    renderExercises();
    updateProgress();
    saveData();
}

/* TEMPORIZADOR */

let currentIndex = 0;
let seconds = 0;
let interval;

function startWorkout(){

    if(exercises.length === 0){
        alert(
        "Agrega ejercicios primero"
        );
        return;
    }

    currentIndex = 0;

    startExercise();
}

function startExercise(){

    if(currentIndex >= exercises.length){

        currentExercise.innerText =
        "Rutina completada 🔥";

        timer.innerText =
        "00:00";

        return;
    }

    const exercise =
    exercises[currentIndex];

    currentExercise.innerText =
    exercise.name;

    seconds =
    exercise.time * 60;

    clearInterval(interval);

    interval =
    setInterval(()=>{

        const mins =
        Math.floor(seconds / 60);

        const secs =
        seconds % 60;

        timer.innerText =
        `${String(mins)
        .padStart(2,"0")}:${String(secs)
        .padStart(2,"0")}`;

        seconds--;

        if(seconds < 0){

            playSound();

            exercises[currentIndex]
            .completed = true;

            currentIndex++;

            renderExercises();
            updateProgress();
            saveData();

            startExercise();
        }

    },1000);
}

/* SONIDO */

function playSound(){

    const audio =
    new Audio(
    "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
    );

    audio.play();
}

/* CALENDARIO */

function createCalendar(){

    const calendar =
    document.getElementById(
    "calendarGrid"
    );

    calendar.innerHTML = "";

    for(let i=1;i<=30;i++){

        const day =
        document.createElement(
        "div"
        );

        day.className = "day";

        day.innerText = i;

        day.onclick = ()=>{

            if(day.classList.contains(
            "green")){

                day.classList.remove(
                "green"
                );

                day.classList.add(
                "red"
                );

            }

            else if(day.classList.contains(
            "red")){

                day.classList.remove(
                "red"
                );

            }

            else{

                day.classList.add(
                "green"
                );
            }
        };

        calendar.appendChild(day);
    }
}

/* PROGRESO */

function updateProgress(){

    const completed =
    exercises.filter(
    ex => ex.completed
    ).length;

    const total =
    exercises.length;

    const progress =
    total === 0
    ? 0
    : Math.round(
    (completed / total) * 100
    );

    percentage.innerText =
    progress + "%";

    chart.data.datasets[0]
    .data = [
        completed,
        total - completed
    ];

    chart.update();
}

/* GRAFICA */

const ctx =
document.getElementById(
"progressChart"
);

const chart =
new Chart(ctx,{

    type:"doughnut",

    data:{
        labels:[
            "Hecho",
            "Falta"
        ],

        datasets:[{
            data:[0,100]
        }]
    },

    options:{
        responsive:true,
        cutout:"70%"
    }
});

/* INICIAR */

loadData();
createCalendar();
updateProgress();
