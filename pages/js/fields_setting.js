let tg = window.Telegram.WebApp;

let set_pan = document.getElementById('setting-panel')
let web_app_url = new URL(window.location.href)
let f_name = web_app_url.searchParams.get('fname')
let f_type = web_app_url.searchParams.get('ftype')
let apply = document.getElementById('apply')

let cache = []

apply.addEventListener('click',
    function sendData(){
        if(cache[cache.length - 1] == 'tmp'){
          cache.pop()
        }
        tg.sendData(f_name + ':' + String(cache))
    })

function create_item(){
    i = cache.length
    let item = document.createElement('div')
    item.setAttribute('id', 'val' + i)

    let input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.addEventListener('input', function (evt) {
             if (cache.length == 0){
                 cache.push(this.value)
             } else{
                 cache[cache.length - 1] = this.value
             }
         })
    input.setAttribute('id', 'text-input' + i)
    item.appendChild(input)
    set_pan.appendChild(item)
    return item
}

function add_btn(item){
    let btn = document.createElement('button')
    btn.textContent = "+"
    btn.addEventListener('click', function(){
        cache.push('tmp')
        let inp = item.getElementsByTagName('input')[0]
        let val_view = document.createElement('p')
        val_view.textContent = inp.value
        inp.replaceWith(val_view)
        Array.from(item.getElementsByTagName('button')).forEach(e => e.remove())
        add_btn(create_item())
    })
    item.appendChild(btn)
}

if (f_type == 'list')
    add_btn(create_item())
else
    create_item()
