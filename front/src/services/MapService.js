import store from '../store';

const service = {
  of: (element, center = [59.935986, 30.361271], zoom = 13) => {
    // eslint-disable-next-line no-undef
    return new ymaps.Map(element, {
      center,
      zoom
    })
  },

  renderRoute: (element, route) => {
    // eslint-disable-next-line no-undef
    ymaps.ready(async () => {
      const yMap = service.of(element)
      // eslint-disable-next-line no-undef
      const yRoute = await ymaps.route(route, {
        // Тип маршрутизации - пешеходная маршрутизация.
        routingMode: 'pedestrian',
        // Чтобы весь маршрут был виден сразу
        mapStateAutoApply: true
      })
      yMap.geoObjects.add(yRoute)
    })
  },
  getCoord: (element) => {
    ymaps.ready(async () => {
      const yMap = service.of(element)
      var myPlacemark
      // Слушаем клик на карте.
      yMap.events.add('click', function (e) {
        var coords = e.get('coords');
        // Если метка уже создана – просто передвигаем ее.
        if (myPlacemark) {
          myPlacemark.geometry.setCoordinates(coords);
        }
        // Если нет – создаем.
        else {
          myPlacemark = createPlacemark(coords);
          yMap.geoObjects.add(myPlacemark);
          // Слушаем событие окончания перетаскивания на метке.
          myPlacemark.events.add('dragend', function () {
            getAddress(myPlacemark.geometry.getCoordinates());
          });
        }
        getAddress(coords);
        store.commit('getCoord', coords)
      });

      // Создание метки.
      function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {
          iconCaption: 'поиск...'
        }, {
          preset: 'islands#violetDotIconWithCaption',
          draggable: true
        });
      }

      // Определяем адрес по координатам (обратное геокодирование).
      function getAddress(coords) {
        myPlacemark.properties.set('iconCaption', 'поиск...');
        ymaps.geocode(coords).then(function (res) {
          var firstGeoObject = res.geoObjects.get(0);

          myPlacemark.properties
            .set({
              // Формируем строку с данными об объекте.
              iconCaption: [
                // Название населенного пункта или вышестоящее административно-территориальное образование.
                firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
              ].filter(Boolean).join(', '),
              // В качестве контента балуна задаем строку с адресом объекта.
              balloonContent: firstGeoObject.getAddressLine()
            });
        });
      }
    })
  }
}


export default service
