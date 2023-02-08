   let tg = window.Telegram.WebApp; //получаем объект webapp телеграмма

   tg.MainButton.text = "Main"; //изменяем текст кнопки

   let btnSH = document.getElementById("btnSH"); //получаем кнопку скрыть/показать
   let btnED = document.getElementById("btnED"); //получаем кнопку активировать/деактивировать
   let btnTS = document.getElementById("btnTS");
   let divUC = document.getElementById("user_card"); //получаем блок user_card
   let inpTS = document.getElementByID("test_input")

   btnTS.addEventListener('click', ()=> {
      tg.sendData(inpTS.value)
   })

   btnSH.addEventListener('click', function(){ //вешаем событие на нажатие html-кнопки
      console.log("show button")
      if (tg.MainButton.isVisible){ //если кнопка показана
         tg.MainButton.hide() //скрываем кнопку
         btnSH.textContent = "SHOW MAIN"
      }
      else{
         tg.MainButton.show()
         btnSH.textContent = "HIDE MAIN"
      }
   });

   btnED.addEventListener('click', function(){ //вешаем событие на нажатие html-кнопки
      console.log("enable button")
      if (tg.MainButton.isActive){ //если кнопка показана
         tg.MainButton.setParams({"color": "#E0FFFF"}); //меняем цвет
         tg.MainButton.disable() //деактивируем кнопку
         btnED.textContent = "ENABLE MAIN"
      }
      else{
         tg.MainButton.setParams({"color": "#143F6B"}); //меняем цвет
         tg.MainButton.enable() //активируем кнопку
         btnED.textContent = "DISABLE MAIN"
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
   //выведем имя, "фамилию", через тире username и код языка
   divUC.appendChild(profName); //добавляем

   let userid = document.createElement('p'); //создаем еще параграф
   userid.innerText = `${tg.initDataUnsafe.user.id}`; //показываем user_id
   divUC.appendChild(userid); //добавляем


//   работает только в attachment menu
    let pic = document.createElement('img'); //создаем img
    pic.src = tg.initDataUnsafe.user.photo_url; //задаём src
    divUC.appendChild(pic); //добавляем элемент в карточку