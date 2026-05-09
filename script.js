let exercises = [];
let goals = [];

const exerciseList = document.getElementById("exerciseList");
const goalList = document.getElementById("goalList");

const currentExercise =
    document.getElementById("currentExercise");

const timer =
    document.getElementById("timer");

const percentage =
    document.getElementById("percentage");

/* ------------------ */
/* GUARDAR DATOS */
/* ------------------ */

function saveData() {

    const data = {
        exercises,
        goals,
        name: document.getElementById("name").value,
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

function loadData() {

    const saved =
        localStorage.getItem("obsidianData");

    if (!saved) return;

    const data = JSON.parse(saved);

    exercises = data.exercises || [];
    goals = data.goals || [];

    document.getElementById("name").value =
        data.name || "";

    document.getElementById("motivation").value =
        data.motivation || "";

    document.getElementById("purpose").value =
        data.purpose || "";

    renderExercises();
    renderGoals();
}

/* ------------------ */
/* METAS */
/* ------------------ */

function addGoal() {

    const input =
        document.getElementById("goalInput");

    const text = input.value.trim();

    if (text === "") return;

    goals.push(text);

    input.value = "";

    renderGoals();
    saveData();
}

function renderGoals() {

    goalList.innerHTML = "";

    goals.forEach((goal, index) => {

        const li =
            document.createElement("li");

        li.innerHTML = `
            ${goal}
            <button onclick="removeGoal(${index})">
                ❌
            </button>
        `;

        goalList.appendChild(li);
    });
}

function removeGoal(index) {

    goals.splice(index, 1);

    renderGoals();
    saveData();
}

/* ------------------ */
/* EJERCICIOS */
/* ------------------ */

function addExercise() {

    const name =
        document.getElementById("exerciseName")
        .value
        .trim();

    const time =
        document.getElementById("exerciseTime")
        .value;

    if (name === "" || time === "")
        return;

    exercises.push({
        name,
        time: Number(time),
        done: false
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

function renderExercises() {

    exerciseList.innerHTML = "";

    exercises.forEach((exercise, index) => {

        const div =
            document.createElement("div");

        div.classList.add(
            "exercise-card"
        );

        if (exercise.done) {
            div.classList.add("done");
        }

        div.innerHTML = `
            <div>
                <h3>${exercise.name}</h3>
                <p>
                    ${exercise.time}
                    min
                </p>
            </div>

            <div>
                <button onclick="
                    completeExercise(${index})
                ">
                    ✅
                </button>

                <button onclick="
                    deleteExercise(${index})
                ">
                    ❌
                </button>
            </div>
        `;

        exerciseList.appendChild(div);
    });
}

function deleteExercise(index) {

    exercises.splice(index, 1);

    renderExercises();
    updateProgress();
    saveData();
}

function completeExercise(index) {

    exercises[index].done =
        !exercises[index].done;

    renderExercises();
    updateProgress();
    saveData();
}

/* ------------------ */
/* TEMPORIZADOR */
/* ------------------ */

let currentIndex = 0;
let countdown;
let seconds = 0;

function startWorkout() {

    if (exercises.length === 0)
        return;

    currentIndex = 0;

    startExercise();
}

function startExercise() {

    if (
        currentIndex >=
        exercises.length
    ) {

        currentExercise.innerText =
            "Rutina completada 🔥";

        timer.innerText = "00:00";

        return;
    }

    const exercise =
        exercises[currentIndex];

    currentExercise.innerText =
        exercise.name;

    seconds =
        exercise.time * 60;

    clearInterval(countdown);

    countdown =
        setInterval(() => {

            const min =
                Math.floor(
                    seconds / 60
                );

            const sec =
                seconds % 60;

            timer.innerText =
                `${String(min)
                    .padStart(2, "0")}
                :
                ${String(sec)
                    .padStart(2, "0")}`;

            seconds--;

            if (seconds < 0) {

                beep();

                exercises[
                    currentIndex
                ].done = true;

                currentIndex++;

                renderExercises();
                updateProgress();
                saveData();

                startExercise();
            }

        }, 1000);
}

function beep() {

    const audio =
        new Audio(
            "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
        );

    audio.play();
}

/* ------------------ */
/* CALENDARIO */
/* ------------------ */

function createCalendar() {

    const grid =
        document.getElementById(
            "calendarGrid"
        );

    grid.innerHTML = "";

    for (
        let i = 1;
        i <= 30;
        i++
    ) {

        const day =
            document.createElement(
                "div"
            );

        day.classList.add(
            "day"
        );

        day.innerText = i;

        day.addEventListener(
            "click",
            () => {

                if (
                    day.classList.contains(
                        "green"
                    )
                ) {

                    day.classList.remove(
                        "green"
                    );

                    day.classList.add(
                        "red"
                    );

                } else if (
                    day.classList.contains(
                        "red"
                    )
                ) {

                    day.classList.remove(
                        "red"
                    );

                } else {

                    day.classList.add(
                        "green"
                    );
                }
            }
        );

        grid.appendChild(day);
    }
}

/* ------------------ */
/* PROGRESO */
/* ------------------ */

function updateProgress() {

    const done =
        exercises.filter(
            e => e.done
        ).length;

    const total =
        exercises.length;

    const progress =
        total === 0
        ? 0
        : Math.round(
            (done / total) * 100
        );

    percentage.innerText =
        progress + "%";

    chart.data.datasets[0].data = [
        done,
        total - done
    ];

    chart.update();
}

/* ------------------ */
/* GRAFICA */
/* ------------------ */

const ctx =
    document
    .getElementById(
        "progressChart"
    );

const chart =
    new Chart(ctx, {
        type: "doughnut",

        data: {
            labels: [
                "Completado",
                "Faltante"
            ],

            datasets: [{
                data: [0, 100]
            }]
        },

        options: {
            responsive: true
        }
    });

/* ------------------ */
/* INICIAR */
/* ------------------ */

loadData();
createCalendar();
updateProgress();
