   let tg = window.Telegram.WebApp; //получаем объект webapp телеграмма

   tg.MainButton.text = "Main"; //изменяем текст кнопки

   let btnSH = document.getElementById("btnSH"); //получаем кнопку скрыть/показать
   let btnED = document.getElementById("btnED"); //получаем кнопку активировать/деактивировать
   let btnTS = document.getElementById("btnTS");
   let divUC = document.getElementById("user_card"); //получаем блок user_card
   let inpTS = document.getElementById("test_input");

   let profile = ((tg && tg.initData) ? tg.initData.user : null)

   btnTS.addEventListener('click', ()=> {
      console.log(inpTS.value)
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

   if (profile){
        let profile_block = document.createElement('p'); //создаем параграф
        profile_block.innerText =
        `first name: ${profile.first_name}
        last name: ${profile.last_name}
        user name: ${profile.username}
        lang: ${profile.language_code}
        id: ${profile.user.id}`;
        //выведем имя, "фамилию", через тире username и код языка
        divUC.appendChild(profile_block); //добавляем
   }