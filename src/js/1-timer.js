import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const input = document.querySelector("#datetime-picker");
const startButton = document.querySelector('[data-start]');
startButton.disabled = true; // Кнопка спочатку неактивна

let userSelectedDate; // Оголосити глобально

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        userSelectedDate = selectedDates[0]; // Присвоєння вибраної дати
        if (userSelectedDate < new Date()) {
            iziToast.error({
                title: 'Error',
                message: 'Please choose a date in the future',
            });
            startButton.disabled = true;
        } else {
            startButton.disabled = false;
        }
    },
};

flatpickr(input, options);

startButton.addEventListener('click', () => {
    startTimer(userSelectedDate);
    startButton.disabled = true;
    input.disabled = true; // Деактивувати інпут
});

function startTimer(endDate) {
    const timerId = setInterval(() => {
        const now = new Date();
        const timeLeft = endDate - now;

        if (timeLeft <= 0) {
            clearInterval(timerId);
            updateTimerDisplay(0, 0, 0, 0);
            return;
        }

        const { days, hours, minutes, seconds } = convertMs(timeLeft);
        updateTimerDisplay(days, hours, minutes, seconds);
    }, 1000);
}

function updateTimerDisplay(days, hours, minutes, seconds) {
    document.querySelector('[data-days]').textContent = addLeadingZero(days);
    document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
    document.querySelector('[data-minutes]').textContent = addLeadingZero(minutes);
    document.querySelector('[data-seconds]').textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}
