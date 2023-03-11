let tg = window.Telegram.WebApp;

let div = document.getElementById("firs-div")
let link_viewer = document.createElement('div')
let host_line = document.createElement('p')
let q_line = document.createElement('p')

let url_text_wlh = window.location.href
let url_wlh = new URL(url_text_wlh)
host_line.innerText = "host name = " + url_wlh.host
console.log(url_wlh.host)

q_line.innerText = "query = " + url_wlh.search
console.log(url_wlh.search)

link_viewer.appendChild(host_line)
link_viewer.appendChild(q_line)
div.appendChild(link_viewer)