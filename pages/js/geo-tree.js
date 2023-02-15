var URL_API="https://api.geotree.ru/address.php?";
function page_loaded() {
  myIcon = L.icon({ //параметры отображения маркера
    iconUrl: "https://files.geotree.ru/leaflet/markers/blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, 0]
  });
  let center={lon: 37.6231, lat: 55.7525};
  map = L.map("map", {closePopupOnClick:false} ).setView(center, 12); //установить центр карты и масштаб
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; <a href='https://openstreetmap.org/copyright'>OpenStreetMap contributors</a>"
  }).addTo(map);
  marker=L.marker(center, {icon: myIcon}).addTo(map); //установка маркера в центр карты
  popup=marker.bindPopup("").openPopup(); //добавление попапа к маркеру
  autocomplete_init(); //инициализация модуля Autocomplete
  map.on("moveend", map_onmoveend); //обработка события "завершение движение карты"
  map_onmoveend();
}

//Обработчик события завершения перемещения карты
function map_onmoveend() {
  autocomplete_set_source(); //установить URL для получения подсказок (учиытывая новые координаты центра карты)
  let center=map.getCenter();
  var url=URL_API+"limit=1&lon="+center.lng+"&lat="+center.lat; //URL для получения информации о ближайшем объекте
  jQuery.get(url)
  .done(function(data) {
    let item=data[0]; //ближайший найденный объект
    let value=item.value; //полное наименование
	$("#address").val(value);
    let geopoint=item_geopoint(item); //получение координат найденного объекта
    marker.setLatLng(geopoint).bindPopup(value); //перемещение маркера
  })
}

//Иницилизация параметров автозаполнения
function autocomplete_init() {
  $("#address").autocomplete({
    minLength: 0, //минимальное количество символов для отображения подсказок
    delay: 0, //задержка отображения подсказок
    select: autocomplete_select, //обработчик события выбора подсказки
	appendTo: "#info" //для корректной работы в полноэкранном режиме
  });
}


//Обработчик события выбора подсказки
function autocomplete_select(event, ui) {
  let geopoint=item_geopoint(ui.item); //координаты найденного объекта
  map.flyTo(geopoint); //перемещение карты
}

//Получение координат найденного объекта, в зависимости от его типа
function item_geopoint(item) {
  //в предоставленных подсказках могут быть адреса (type="address") и населённые пункты (type="place")
  if (item.type=="address") {
    return item.geo_inside;
  } else if (item.type=="place") {
    let level_info=item.levels[item.level];
    return level_info.geo_inside;
  }
}

function autocomplete_set_source() {
  //функция устанавливающая URL для получения подсказок
  let center=map.getCenter();
  //URL формируется из API ключа и координат центра карты
  $("#address").autocomplete("option", "source", URL_API+"lon="+center.lng+"&lat="+center.lat);
}
