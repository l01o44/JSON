
let ticketPurchases = [];
const purchasesInfo = createPurchasesInfo();
const getTicketPurchases = purchasesInfo.generateTicketPurchases;
const getStatistic = purchasesInfo.getFlightStatistic;

/**
 * При нажатии на кнопку "Рассчитать", выводится статистика в виде таблицы. Если данных нет, то выводится соответствующее сообщение
 **/

Ext.application({
    name: 'FlightApp',
    launch: function () {
        /**
         * При нажатии на кнопку "Сгенерировать", генерируется 200 JSON записей покупок билетов на 5 рейсов самолёта 
         * и 20 из записей выводятся в консоль
         **/
        const btnGenerate = Ext.get('btn-generate');
        btnGenerate.on('click', function() {
            ticketPurchases = getTicketPurchases();
            for (let i = 0; i < 20; i++) console.log(ticketPurchases[i])
            Ext.Msg.alert('Готово','Информация о 20 первых записях выведена в консоль.')
        });
        /**
         * При нажатии на кнопку "Рассчитать", выводится статистика в виде таблицы. Если данных нет, то выводится соответствующее сообщение
         **/
        const btnCalculate = Ext.get('btn-calculate');
        btnCalculate.on('click', function () {
            if (ticketPurchases.length === 0) {
                Ext.Msg.alert('Ошибка', 'Сгенерированных данных нет.');
            } else {
                let flights = getStatistic(ticketPurchases);
                let flightsArray = [];
                for (var key in flights) {
                    flightsArray.push({
                        flightNumber: key,
                        loadPercentage: flights[key].load,
                        baggagePercentage: flights[key].bag
                    });
                }
                const storeFlights = Ext.create('Ext.data.Store', {
                    fields: ['flightNumber', 'loadPercentage', 'baggagePercentage'],
                    data: flightsArray
                });
                const tableFlights = Ext.create('Ext.grid.Panel', {
                    title: 'Данные о рейсах',
                    store: storeFlights,
                    columns: [
                        { text: 'Номер рейса', dataIndex: 'flightNumber' },
                        { text: 'Загруженность, %', dataIndex: 'loadPercentage' },
                        { text: 'Процент мест с багажом, %', dataIndex: 'baggagePercentage' }
                    ],
                    height: 300,
                    width: 500
                });
                Ext.Msg.alert('Готово', 'Статистика выведена в таблицу.', function () {
                    let win = Ext.create('Ext.window.Window', {
                        
                        layout: 'fit',
                        items: [tableFlights]
                    });
                    win.show();
                });
            }
        });
        /**
         * При нажатии на кнопку "Скачать файл со сгенерированными записями", 200 JSON записей покупок билетов на 5 рейсов самолёта сохраняются в файл
         **/
        const btnDownload = Ext.get('btn-download');
        btnDownload.on('click', function() {
            const data = ticketPurchases;
            const filename = 'ticketPurchases.txt';
            saveDataToFile(data, filename)
            .then((result) => {
                Ext.Msg.alert('Готово', result);
            })
            .catch(error => {
                Ext.Msg.alert('Ошибка', error);;
            });
        });
    }
});

/**
 * Функция сохраняет данные в файл
 * @argument {Array} data - массив с данными (в нашем случае - с JSON записями)
 * @argument {text} fileName - название файла, в который сохраняются данные
 * @returns промис, который скачивает данные, если они есть, или выводит соответствующее сообщение, если данных еще нет
 **/

async function saveDataToFile(data, fileName) {
    return new Promise((resolve, reject) => {
        if (data.length > 0) {
            const blob = new Blob([data], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            resolve('Файл успешно сохранен.');
            setTimeout(() => {
                a.click();
            }, 0);
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 0);
        }
        else {
            reject('Сгенерированных данных нет');
        }
    });
}

/**
 * Объединила функции получения статистики и генерирования записей покупок под общую функцию в замыкание. 
 * Теперь они будут иметь доступ к переменным из внешней функции и сохранять свое состояние между вызовами
 **/

function createPurchasesInfo() {
    /**
     * Функция создает массив из 5 рейсов и их статистикой
     * @argument {Array} ticketPurchases - массив из 200 JSON записей
     * @return массив из 5 объектов-рейсов со статистикой
     **/

    function getFlightStatistic(ticketPurchases) {
        let flights = {};
        for (let ticket of ticketPurchases) {
            const transaction = JSON.parse(ticket);
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
     * @return purchases - массив из 200 JSON записей
     **/

    function generateTicketPurchases() {
        let purchases = [];
        let transaction;
        let flights = getFlights();
        for (let i = 0; i < 200; i++) {
            transaction = {
                UId: getUid(),
                flight: flights[getRandomNumber(0, 5)],
                passenger: getPassenger(), 
                baggage: ['yes', 'no'][getRandomNumber(0, 2)]
            };
            purchases.push(JSON.stringify(transaction));
        }
        return purchases;
    }
    return {getFlightStatistic, generateTicketPurchases}
}