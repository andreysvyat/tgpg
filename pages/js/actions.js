   let tg = window.Telegram.WebApp; //получаем объект webapp телеграма

   // tg.expand(); //расширяем на все окно

   tg.MainButton.text = "Main"; //изменяем текст кнопки

   let btnSH = document.getElementById("btnSH"); //получаем кнопку скрыть/показать
   let btnED = document.getElementById("btnED"); //получаем кнопку активировать/деактивировать
   let btnTS = document.getElementById("btnTS");
   let usercard = document.getElementById("usercard"); //получаем блок usercard

   btnTS.addEventListener('click', ()=> {
      tg.sendData("test")
   })

   btnSH.addEventListener('click', function(){ //вешаем событие на нажатие html-кнопки
      console.log("show button")
      if (tg.MainButton.isVisible){ //если кнопка показана
         tg.MainButton.hide() //скрываем кнопку
      }
      else{
         tg.MainButton.show()
      }
   });

   btnED.addEventListener('click', function(){ //вешаем событие на нажатие html-кнопки
      console.log("enable button")
      if (tg.MainButton.isActive){ //если кнопка показана
         tg.MainButton.setParams({"color": "#E0FFFF"}); //меняем цвет
         tg.MainButton.disable() //скрываем кнопку
      }
      else{
         tg.MainButton.setParams({"color": "#143F6B"}); //меняем цвет
         tg.MainButton.enable()
      }
   });

   Telegram.WebApp.onEvent('mainButtonClicked', function(){
      tg.sendData("some string that we need to send");
      //при клике на основную кнопку отправляем данные в строковом виде
   });

   let profName = document.createElement('p'); //создаем параграф
   profName.innerText = `${tg.initDataUnsafe.user.first_name}
   ${tg.initDataUnsafe.user.last_name}
   ${tg.initDataUnsafe.user.username} (${tg.initDataUnsafe.user.language_code})`;
   //выдем имя, "фамилию", через тире username и код языка
   usercard.appendChild(profName); //добавляем

   let userid = document.createElement('p'); //создаем еще параграф
   userid.innerText = `${tg.initDataUnsafe.user.id}`; //показываем user_id
   usercard.appendChild(userid); //добавляем


   //работает только в attachment menu
   // let pic = document.createElement('img'); //создаем img
   // pic.src = tg.initDataUnsafe.user.photo_url; //задаём src
   // usercard.appendChild(pic); //добавляем элемент в карточку