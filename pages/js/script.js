var webApp = window.Telegram.WebApp
var mainBut = webApp.MainButton
var inputCarType = document.getElementById("carTypeInput")
mainBut.text = "Send data"
mainBut.isVisible = true
mainBut.isActive = true
mainBut.show()
mainBut.enable()

mainBut.onClick(webApp.sendData("test"))