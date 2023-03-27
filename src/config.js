
//файл с настройками для снекбаров.
//содержит номер типа события, текст, который хотим отобразить на снеке и строгость(цвет) сообщения
/*{
    1: {notificationText: 'Тут могла бы быть ваша реклама', severity: 'success' },
    2: {notificationText: 'Или тут', severity: 'warning' },
  }
*/
//error: красный, warning: оранжевый, info: синий, success: зеленый
export const ALERTS_CONFIG = {
    17: {notificationText: 'Шлагбаум не разблокировался', severity: 'error'},
    22: {notificationText: 'Терминал не включился', severity: 'warning'},
    23: {notificationText: 'Терминал не отключился', severity: 'warning'},
    35: {notificationText: 'Шлагбаум ранее был закрыт', severity: 'warning'},
    63: {notificationText: 'Значение бесплатного времени на выезд увеличено (затор)', severity: 'info'},
    64: {notificationText: 'Не удалось увеличить значение бесплатного времени на выезд (затор)', severity: 'error'},
}