
const timerRef = document.querySelector('.current-time')
const hourInput = document.getElementById('hour-input')
const minuteInput = document.getElementById('minute-input')
const activeAlarms = document.querySelector('.alarms-list')
const setAlarm = document.getElementById('set')
const clearAllButton = document.querySelector('.clear')
const alarmSound = new Audio('./alarm.mp3')

let alarmIndex = 0
let alarmsArray = []
let initialHour = 0
let initialMinute = 0

// Helper function to append a leading zero to single-digit values
// Função auxiliar para acrescentar um zero à esquerda a valores de um dígito

const appendZero = (value) => (value < 10 ? '0' + value : value)

// Function to display the time and trigger alarms
//Função para exibir a hora e acionar alarmes

const displayTimer = () => {
    const date = new Date()
    const currentTime = date.toLocaleTimeString('en-US', { hour12: false })
    timerRef.textContent = currentTime

    // Check if it's time to trigger alarms
    // Verifique se é hora de acionar alarmes

    alarmsArray.forEach((alarm) => {
        if (alarm.isActive && alarm.time === currentTime.slice(0, 5)){
            alarmSound.play()
        }
    })
}

// Function to create a new alarm - Função para criar um novo alarme

const createAlarm = (hour, minute) => {
    alarmIndex += 1

    // Create an alarm object - Crie um objeto de alarme
    const alarmObj = {
        id:`${alarmIndex}_${hour}_${minute}`,
        time: `${appendZero(hour)}:${appendZero(minute)}`,
        isActive: false
    }

    // And alarm to the array and create it's Ui representation
    // E alarme para a matriz e crie sua representação da interface do usuário
    alarmsArray.push(alarmObj)
    const alarmDiv = document.createElement('div')
    alarmDiv.className = 'alarm'
    alarmDiv.dataset.id = alarmObj.id
    alarmDiv.innerHTML = `<span>${alarmObj.time}</span>`   

    // Create a checkbox to active/desactivate the alarm
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.addEventListener('change', () => toggleAlarm(alarmObj))
    alarmDiv.appendChild(checkbox)

    // Create a delete button for the alarm
    const deleteButton = document.createElement('button')
    // Fontwasome
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"</i>`
    deleteButton.className = 'deleteButton'
    deleteButton.addEventListener('click', () => deleteAlarm(alarmObj))
    alarmDiv.appendChild(deleteButton)

    // Add the alarm ui to the list of active alarms
    activeAlarms.appendChild(alarmDiv)
}

// Function to toggle the alarm's acitive state
const toggleAlarm = (alarm) =>{
    alarm.isActive = !alarm.isActive
    if(alarm.isActive){
        const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false}).slice(0 ,5)
        if(alarm.time === currentTime){
            alarmSound.play()
        } 
        } else{
            alarmSound.pause()
    }
}

// Function to delete an alarm
const deleteAlarm = (alarm) => {
    const index = alarmsArray.indexOf(alarm)
    if(index > -1){
        alarmsArray.splice(index, 1)
        document.querySelector(`[data-id="${alarm.id}"]`).remove()

    }
}

// Event listener for clearning all alarms
clearAllButton.addEventListener('click', () =>{
    alarmsArray = [];
    activeAlarms.innerHTML = '';
})

// Event listener for setting a new alarm
setAlarm.addEventListener('click', () =>{
    // Parse the input values, default to 0 if empty or NaN
    let hour = parseInt(hourInput.value) || 0;
    let minute = parseInt(minuteInput.value) || 0;

    // Validate the inputs values
    if(hour < 0 || hour > 23 || minute < 0 || minute > 59){
        alert('Invalid hour or minute. Please enter values within the valid range!');
            return
    }

    // Check if an alarm with the same time already exists
    if(!alarmsArray.some(alarm => alarm.time === `${appendZero(hour)}:${appendZero(minute)}`)) {
        createAlarm(hour, minute);
    }

    // Clear input fields  -  Limpar campos de entrada
    [hourInput.value, minuteInput.value] = ["", ""];
})

// Initialize the timer and input fields  -  Inicialize o cronômetro e os campos de entrada
window.onload = () =>{
    setInterval(displayTimer, 1000)
    [hourInput.value, minuteInput.value] = ["", ""];
};