/**
 * Вынесла все "вспомогательные" функции в отдельный скрипт
 */ 

/**
 * Функция генерирует UId
 * @return uid - 36-значный код
 **/

function getUid() {
    let uid = self.crypto.randomUUID();
    return uid;
}

/**
 * Функция создает массив из 5 сгенерированных рейсов
 * @return массив из 5 объектов с информацией о рейсах
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
 * @return массив с 5 уникальными самолетами
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
        for (let airplane of airplanes) {
            if (airplane["number"] == num) { 
                flag = 1;
                break;
            }
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
 * @param {Array} flights - массив объектов-рейсов
 * @param {string} num - новый сгенерированный номер рейса
 **/

function checkFlightNumber(flights, num) {
    let flag = 0;
    if (flights.length != 0) {
        for (let flight of flights) {
            if (flight["flightNumber"] == num) {
                flag = 1;
                break;
            }
        }
        if (flag == 0) return num
        else return checkFlightNumber(flights, getFlightNumber())
    }
    else return num;   
}

/**
 * Функция генерирует пассажира
 * @return объект с информацией о пассажире
 **/

function getPassenger() {
    return {
        name: "Name" + getRandomNumber(1, 201),
        documentNumber: getRandomNumber(1000, 10000)
    };
}

/**
 * Функция генерирует случайное целое число в заданном диапазоне
 * @param {Number} min - нижняя граница
 * @param {Number} max - верхняя граница
 * @return случайное целое число
 **/

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Функция генерирует номер рейса
 * @return случайный номер рейса
 */

function getFlightNumber() {
    return "RGB-" + 
    getRandomNumber(0, 10) + getRandomNumber(0, 10) + getRandomNumber(0, 10) + "-" +
    getRandomNumber(0, 10) + getRandomNumber(0, 10);
}

/**
 * Функция генерирует время
 * @return случайное время
 */

function getTime() {
    const hours1 = String(getRandomNumber(0, 3));
    const hours2 = (hours1 == "2") ? String(getRandomNumber(0, 4)) : String(getRandomNumber(0, 10));
    const minutes = String(getRandomNumber(0, 6)) + String(getRandomNumber(0, 10));
    return hours1 + hours2 + ":" + minutes;
}
