/**
 * При нажатии на кнопку "Сгенерировать", генерируется 200 JSON записей покупок билетов на 5 рейсов самолёта 
 * и 20 из записей выводятся в консоль
 **/

let newData = [];

document.getElementById("generate").addEventListener("click", () => {
    newData = getData();
    for (let i = 0; i < 20; i++) console.log(newData[i])
    document.getElementById("result").textContent = "Информация о 20 записях из 200 выведена в консоль.";
})

/**
 * При нажатии на кнопку "Рассчитать", выводится статистика. Если данных нет, то выводится соответствующее сообщение
 **/

document.getElementById("calculate").addEventListener("click", () => {
    
    if (newData.length == 0) {
        document.getElementById("result").textContent = "Сгенерированных данных нет.";
    }
    else {
        flights = getFlightStatistic(newData);
        document.getElementById("result").textContent = "Статистика выведена в консоль.";
        
        for (let key in flights) {
            console.log(`Рейс ${key}:
            Загруженность рейса по местам: ${flights[key].load} %
            Процент мест с багажом (относительно всех купленных мест этого рейса): ${flights[key].bag} %`);
        }
    }  
})

/**
 * Функция создает массив из 5 рейсов и их статистикой
 * @argument {Array} newData - массив из 200 JSON записей
 * @return массив из 5 объектов-рейсов со статистикой
 **/

function getFlightStatistic(newData) {
    let flights = {};

    for (elem of newData) {

        const transaction = JSON.parse(elem);

        let bag;
        if (transaction.baggage == "yes") bag = 1
        else bag = 0

        let number = transaction.flight.flightNumber;

        if (number in flights) {
            flights[number].count += 1;
            flights[number].bag += bag;
        }
        else {
            flights[number] = {
                count: 1,
                seats: transaction.flight.seats,
                bag: bag
            }
        }
    }

    for (let key in flights) {
        flights[key].load = Math.floor(flights[key].count * 100 / flights[key].seats);
        flights[key].bag = Math.floor(flights[key].bag * 100 / flights[key].count);
        delete flights[key].count;
        delete flights[key].seats;
    }

    return flights;
}

/**
 * Функция генерирует 200 JSON записей покупок билетов на 5 рейсов самолёта
 **/

function getData() {
    let mas = [];
    let transaction;
    let flights = getFlights();
    
    for (let i = 0; i < 200; i++) {
        transaction = {
            UId: getUid(),
            flight: flights[getRandomNumber(0, 5)],
            passenger: getPassenger(), 
            baggage: ['yes', 'no'][getRandomNumber(0, 2)]
        };
        mas.push(JSON.stringify(transaction));
    }

    return mas;
}


/**
 * Функция генерирует UId из 12 символов (цифр и букв латинского алфавита)
 **/

function getUid() {
    let uid = "";
    const bank = "1234567890QWERTYUIOPASDFGHJKLZXCVBNM";
    for (let i = 0; i < 12; i++) {
        uid += bank[getRandomNumber(0, 36)]
    }

    return uid;
}

/**
 * Функция создает массив из 5 сгенерированных рейсов
 **/

function getFlights() {
    let flights = [];
    let airplanes = getAirplanes()

    for (let i = 0; i < 5; i++) {

        flights.push({
            flightNumber: checkFlightNumber(flights, getFlightNumber()),
            flightTime: getTime(),
            airplane: 'Airplane' + String(airplanes[i].number),
            seats: airplanes[i].seats
        })
    }
    return flights;
}

/**
 * Функция для создания уникального массива самолет - количество мест
**/

function getAirplanes() {
    let airplanes = [];
    let seats = [70, 100, 250];
    let num;
    let flag;

    airplanes.push({
        number: getRandomNumber(1, 6),
        seats: seats[getRandomNumber(0, 3)]
    })

    
    while (airplanes.length != 5) {
        flag = 0;
        num = getRandomNumber(1, 6);
        for (elem of airplanes) {
            if (elem["number"] == num) flag = 1;
        }
        if (flag == 0) airplanes.push({
            number: num,
            seats: seats[getRandomNumber(0, 3)]
        })
    }
    return airplanes;
}

/**
 * Функция для проверки уникальности номера рейса
 * @argument {Array} flights - массив объектов-рейсов
 * @argument {string} num - новый сгенерированный номер рейса
 **/

function checkFlightNumber(flights, num) {
    let flag = 0;
    if (flights.length != 0) {
        for (elem of flights) {
            if (elem["flightNumber"] == num) flag = 1;
        }
        if (flag == 0) return num
        else return checkFlightNumber(flights, getFlightNumber())
    }
    else return num;   
}

/**
 * Функция генерирует пассажира
 **/

function getPassenger() {
    return {
        name: "Name" + getRandomNumber(1, 201),
        documetNumber: getRandomNumber(1000, 10000)
    };
}

/**
 * Функция генерирует случайное целое число в заданном диапазоне
 * @param {Number} min - нижняя граница
 * @param {Number} max - верхняя граница
 **/

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Функция генерирует номер рейса
 */

function getFlightNumber() {
    return "RGB-" + 
    getRandomNumber(0, 10) + getRandomNumber(0, 10) + getRandomNumber(0, 10) + "-" +
    getRandomNumber(0, 10) + getRandomNumber(0, 10);
}

/**
 * Функция генерирует время
 */

function getTime() {
    const hours = String(getRandomNumber(0, 3)) + String(getRandomNumber(0, 10));
    const minutes = String(getRandomNumber(0, 7)) + String(getRandomNumber(0, 10));
    return hours + ":" + minutes;
}


