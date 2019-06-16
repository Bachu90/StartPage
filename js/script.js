//DOM Elements

const date = document.getElementById('date');
const weather = document.getElementById('weather');
const time = document.getElementById('time');
const greeting = document.getElementById('greeting');
const formInput = document.getElementById('query');
const quoteText = document.getElementById('text');
const quoteAuthor = document.getElementById('author');


// Show current date
function showDate() {
    const today = new Date();
    let day = today.toDateString().split(" ")[0];

    switch (day) {
        case 'Sun':
            day = 'Sunday';
            break;
        case 'Mon':
            day = 'Monday';
            break;
        case 'Tue':
            day = 'Tuesday';
            break;
        case 'Wed':
            day = 'Wednesday';
            break;
        case 'Thu':
            day = 'Thursday';
            break;
        case 'Fri':
            day = 'Friday';
            break;
        case 'Sat':
            day = 'Saturday';
            break;
    }


    date.innerHTML = `${day}, ${today.toDateString().split(" ").filter((item, index) => index !== 0).join(" ")}`;

}

//Show current weather
function showWeather() {
    const dayTime = new Date().getHours() < 18 ? 'day' : 'night';

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(pos => {
        const crd = pos.coords;
        fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&units=metric&appid=a0ed7e214efe205f9c5d3c16e45a29dc`).then(res => res.json()).then(json => {

            let condition;
            switch (json.weather[0].main) {
                case 'Clear':
                    condition = dayTime === 'day' ? 'sunny' : 'clear';
                    break;
                case 'Clouds':
                    condition = 'cloudy';
                    break;
                case 'Rain':
                    condition = 'rain';
                    break;
                case 'Snow':
                    condition = 'snow';
                    break;
                case 'Thunderstorm':
                    condition = 'thunderstorm';
                    break;
                default:
                    condition = null;
                    break;
            }
            weather.innerHTML = `${json.name}, ${Math.round(json.main.temp)}&deg;C <i
            class="wi wi-${dayTime}-${condition}"></i>`;
        });
    }, err => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }, options);
}

//Show current time
function showTime() {
    const now = new Date();
    const am_pm = now.getHours() < 12 ? 'AM' : 'PM';
    const dayTime = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 18 ? 'Good Afternoon' : ' Good Evening';
    const newTime = `${now.getHours() % 12 || now.getHours()}:${now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()} ${am_pm}`;

    if (time.innerHTML !== newTime) {
        time.innerHTML = newTime;
        if (greeting.innerHTML !== dayTime) {
            greeting.innerHTML = dayTime;
        }
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            showDate();
        }
    }

    setTimeout(showTime, 1000);
}

//Manage input 'not-empty' class

formInput.addEventListener('input', e => {
    if (e.target.value !== '') {
        e.target.className = 'not-empty';
    } else {
        e.target.className = '';
    }
})

//Show random quote
function showQuote() {
    fetch("https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json")
        .then(response => response.json())
        .then(json => {
            const index = Math.floor(Math.random() * json.quotes.length);
            quoteText.innerText = json.quotes[index].quote;
            quoteAuthor.innerText = json.quotes[index].author;
        });
}

//Run
showDate();
showWeather();
showTime();
showQuote();