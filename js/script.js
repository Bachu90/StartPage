//DOM Elements

const date = document.getElementById('date');
const weather = document.getElementById('weather');
const city = document.getElementById('city');
const geolocation = document.querySelector('.geolocation');
const time = document.getElementById('time');
const greeting = document.getElementById('greeting');
const name = document.getElementById('name');
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

    function show(json) {
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
        city.innerHTML = json.name;
        weather.innerHTML = `, ${Math.round(json.main.temp)}&deg;C <i
        class="wi wi-${dayTime}-${condition}"></i>`;
    }

    if (localStorage.getItem('city')) {
        //weather by user city
        fetch(`http://api.openweathermap.org/data/2.5/weather?q=${localStorage.getItem('city')}&units=metric&appid=a0ed7e214efe205f9c5d3c16e45a29dc`)
            .then(data => data.json())
            .then(json => show(json))
            .catch(err => console.log(err));
        geolocation.classList.remove('hidden');
    } else {
        //weather by geolocation
        navigator.geolocation.getCurrentPosition(pos => {
            const crd = pos.coords;
            fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&units=metric&appid=a0ed7e214efe205f9c5d3c16e45a29dc`).then(res => res.json()).then(json => show(json)).catch(err => console.log(err));
        }, err => {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }, options);
        geolocation.classList.add('hidden');
    }
}

//Edit weather city
function cityEdit(e) {
    localStorage.setItem('city', e.target.innerText);
    showWeather();
}

city.addEventListener('click', (e) => {
    e.target.innerText = ' ';
});

city.addEventListener('blur', cityEdit);
city.addEventListener('keydown', e => {
    if (e.which === 13 || e.keyCode === 13) {
        e.target.blur();
    }
})

//Get city from geolocation
geolocation.addEventListener('click', () => {
    localStorage.removeItem('city');
    showWeather();
})

//Show current time
function showTime() {
    const now = new Date();
    const am_pm = now.getHours() < 12 ? 'AM' : 'PM';
    const dayTime = now.getHours() < 12 ? 'Good Morning, ' : now.getHours() < 18 ? 'Good Afternoon, ' : ' Good Evening, ';
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

//Show user name
function showUserName() {
    const username = localStorage.getItem('name');
    if (username) {
        name.innerText = username;
    } else {
        name.innerText = "[enter name]";
    }
}

//Edit user name
function nameEdit(e) {
    localStorage.setItem('name', e.target.innerText);
    showUserName();
}

name.addEventListener('click', (e) => {
    e.target.innerText = ' ';
});

name.addEventListener('blur', nameEdit);
name.addEventListener('keydown', e => {
    if (e.which === 13 || e.keyCode === 13) {
        e.target.blur();
    }
})

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

//Load Background

function loadBackground() {
    let background;
    const now = new Date();
    if (now.getHours() == localStorage.getItem('backgroundLoadTime')) {
        document.body.style.backgroundImage = `url(${JSON.parse(localStorage.getItem('background')).urls.full})`;
        document.getElementById('image-source').innerHTML = `Photo by <a href="${JSON.parse(localStorage.getItem('background')).links.html}" target="_blank">${JSON.parse(localStorage.getItem('background')).user.name}</a>`;
    } else {
        fetch('https://api.unsplash.com/photos/random?query=nature&client_id=38d6391d753e502dc227517e6c362a05623c3686fb40c7f1168e30ee1a95ed4d')
            .then(data => data.json())
            .then(json => {
                localStorage.setItem('background', JSON.stringify(json));
                localStorage.setItem('backgroundLoadTime', now.getHours());
                document.body.style.backgroundImage = `url(${JSON.parse(localStorage.getItem('background')).urls.full})`;
                document.getElementById('image-source').innerHTML = `Photo by <a href="${JSON.parse(localStorage.getItem('background')).links.html}" target="_blank">${JSON.parse(localStorage.getItem('background')).user.name}</a>`;
            })
    }

}

//Run
showDate();
showWeather();
showTime();
showUserName();
showQuote();
loadBackground();