let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const eventName = document.querySelector('.eventName')
const eventPlace = document.querySelector('.eventPlace')
const eventTime = document.querySelector('.eventTime')
const warn = document.querySelector('.warn')
const inputConfirm = document.querySelector('.inputSave')

function openModal(date) {
    clicked = date;

    const eventForDay = events.find(e => e.date === clicked);

    if (eventForDay) {
        document.getElementById('eventText').innerText = eventForDay.title;
        deleteEventModal.style.display = 'block';

    } else {
        newEventModal.style.display = 'block';
    }

    backDrop.style.display = 'block';
};


function load() {
    const dt = new Date();

    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();
    dt.getMonth() < 9 ? eventTime.value = `${year}-0${month + 1}-${day}` : eventTime.value = `${year}-${month + 1}-${day}`
    // dt.getMonth() === 10 ? console.log('chuj') : console.log('teraz nie jest 10');

    console.log(dt.getMonth());
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });

    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    document.getElementById('monthDisplay').innerText =
        `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

    calendar.innerHTML = '';

    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        const dayString = `${month + 1}/${i - paddingDays}/${year}`;

        if (i > paddingDays) {
            daySquare.innerText = i - paddingDays;
            const eventForDay = events.find(e => e.date === dayString);

            if (i - paddingDays === day && nav === 0) {
                daySquare.id = 'currentDay';
            }

            if (eventForDay) {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                daySquare.appendChild(eventDiv);
            }

            daySquare.addEventListener('click', () => openModal(dayString));

        } else {
            daySquare.classList.add('padding');
        }


        calendar.appendChild(daySquare);
    }

    // console.log(paddingDays);
}

function closeModal() {
    eventTitleInput.classList.remove('error');
    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.value = '';
    clicked = null;
    load();
};

function saveEvent() {
    if (eventTitleInput.value) {
        eventTitleInput.classList.remove('error');

        events.push({
            date: clicked,
            title: eventTitleInput.value,
        });

        localStorage.setItem('events', JSON.stringify(events));
        closeModal();
    } else {
        eventTitleInput.classList.add('error');
    }
};

function deleteEvent() {
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
};

function addEventByInput() {
    inputName = eventName.value;
    inputPlace = eventPlace.value;
    inputTime = eventTime.value;

    const myDate = inputTime.split('-')
    const mapDate = myDate.map(x => parseInt(x));
    const DATE_TO_JSON = `${mapDate[1]}/${mapDate[2]}/${mapDate[0]}`

    if (inputName != '' && inputPlace != '') {
        warn.textContent = ""

        events.push({
            date: DATE_TO_JSON,
            title: inputName + ' ' + inputPlace,
        });
        load()

        localStorage.setItem('events', JSON.stringify(events));
    } else {
        warn.textContent = "Uzupełnij wszystkie pola!!!"
    }

}
function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        load();
    });

    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        load();
    });

    document.getElementById('saveButton').addEventListener('click', saveEvent);
    document.getElementById('cancelButton').addEventListener('click', closeModal);
    document.getElementById('deleteButton').addEventListener('click', deleteEvent);
    document.getElementById('closeButton').addEventListener('click', closeModal);
    inputConfirm.addEventListener('click', addEventByInput)
}

initButtons();
load();