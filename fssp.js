const fetch = require('node-fetch'),
      HttpsProxyAgent = require('https-proxy-agent');

let firstname = 'Фамилия',
    secondname = 'Имя',
    lastname = 'Отчество',
    bithdate = 'dd.mm.yyyy',
    region = 66,
    token = 'YOUR_TOKEN'
;

let params = {
    "token": token,
    "firstname":firstname,
    "secondname":secondname,
    "lastname":lastname,
    "bithdate":bithdate,
    "region":region
}

let query = Object.keys(params)
.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
.join('&');

let urla = 'https://api-ip.fssprus.ru/api/v1.0/search/physical?' + query  
let urlb = 'https://api-ip.fssprus.ru/api/v1.0/result?'
let urlc = 'https://api-ip.fssprus.ru/api/v1.0/status?'

// отправить запрос по фл - получить task
fetch(urla, {
    method: "GET",
    agent:new HttpsProxyAgent('http://proxy.url:port'),
    headers : {
        "Content-Type": "application/json"
    }
})
.then(res => res.json())
.then(json => json.response.task)
.then(task => {
    fetchUntil(task);
})


// по таске дождаться готовности ответа
function fetchUntil(task) {
    fetch(urlc+'token='+token+'&task='+task, {
        method: "GET",
        agent:new HttpsProxyAgent('http://proxy.url.ru:port')
    }).then (res => res.json())
    .then(res => {
        // долбить пока не получу ответ
        if(res.response.status !== 0) {
            fetchUntil(task)
            // setTimeout(fetchUntil(task),2000)
        } else {
            get_res(task)
        }
    })
}


// для получения результата по готовому запросу
function get_res (json) {
    fetch(urlb+'token='+token+'&task='+json, {
        method: "GET",
        agent:new HttpsProxyAgent('http://proxy.url.ru:port'),
    }).then(res => res.json()).then(res => res.response.result)
      .then(res => res.forEach(element => {
            console.log(element.result)
      }))
}

