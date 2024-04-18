# JSON
Сгенерировать массив случайных JSON записей и Собрать статистику по сгенерированным данным. Должно быть реализовано 2 кнопки "Сгенерировать" и "Расчитать" со следующей функциональностью:
1. При нажатии на кнопку "Сгенерировать" должно сгенерироваться 200 JSON записей покупок билетов на 5 рейсов самолёта, со свойствами:
   
- UId транзации покупки
- Рейс (массив из 5 рейсов) :
  - Номер рейса (RGB-XXX-XX, где Х – это случайное чило)
  - Время вылета (в рамках одно дня)
  - Самолёт (Airplane1, Airplane2 и т.д.)
  - Количество мест (70,100,250)
- Пассажир
  - Имя (Name1, Name2 и т.д.)
  - Номер документа пассажира (случайное 4-х значное число)
- С багажом или без

2. При нажатии на кнопку "Расчитать" должен производиться сбор статистики данных сгенерированных JSON (источником является уже собранный массив данных в п.1):
- Рейс
- Загруженность рейса по местам (% выкупленных мест от общего числа в самолёте)
- Процент купленных мест с багажом и без багажа
