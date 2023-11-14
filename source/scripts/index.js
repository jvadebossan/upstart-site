//BASE PAGES
login_page = document.getElementsByClassName('LOGIN')[0]
loading_page = document.getElementsByClassName('LOADING')[0]
error_page = document.getElementsByClassName('ERROR')[0]
error_text = document.getElementsByClassName('error_text')[0]

//MAIN PAGES
home_page = document.getElementsByClassName('DASHBOARD')[0]
logs_page = document.getElementsByClassName('LOGS')[0]
notify_page = document.getElementsByClassName('NOTIFICACOES')[0]
config_page = document.getElementsByClassName('CONFIGS')[0]


function get_date(){
    const today = new Date()
    const yyyy = today.getFullYear()
    let mm = today.getMonth() + 1
    let dd = today.getDate()

    if (dd < 10) dd = '0' + dd
    if (mm < 10) mm = '0' + mm

    return `${dd}${mm}${yyyy}`
}


function construct_home(obj){
    if (obj == 'Erro'){
        home_page.style.display = 'none'
        error_page.style.display = 'flex'
        error_text.innerHTML = '<a href="https://upstart-bot.netlify.app" class="lucro" style="text-decoration: none;">Erro na api. Clique para reiniciar.<a>'
    }
    else{
        document.getElementById('SALDO').innerText = `R$ ${String(obj.actual_bal)}`
        document.getElementById('REALIZADAS').innerText = `Realizadas: ${String(obj.created)}`
        document.getElementById('NAO_REALIZADAS').innerText = `Não realizadas: ${String(obj.not_created)}`
        document.getElementById('GRAFICO1').style = `--value:${String(Number(100/obj.total*obj.not_created))}`
        document.getElementById('GANHAS').innerText = `Entradas ganhas: ${String(obj.wins)}`
        document.getElementById('PERDIDAS').innerText = `Entradas perdidas: ${String(obj.losses)}`
        document.getElementById('GRAFICO2').style = `--value:${String(Number(100/obj.created*obj.losses))}`
        document.getElementById('LUCRO').innerText = `R$ ${String(obj.profit)}`
    }
}

function construct_logs(){
    let user = localStorage.getItem('user')
    fetch(`https://api-upstart.onrender.com/api/logs/${user}`).then(response => 
    response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(res => {
        console.log(res.data.logs)
        document.getElementsByClassName('logs_box')[0].innerHTML = res.data.logs
    }))
}

function construct_configs(){
    let user = localStorage.getItem('user')
    fetch(`https://api-upstart.onrender.com/api/configs/${user}`).then(response => 
    response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(res => {
        if(res.data.power == 'on'){
            document.getElementById('switch').setAttribute('checked', '')
        }
        else{
            document.getElementById('switch').removeAttribute('checked', '')
        }
        document.getElementsByClassName('entrada')[0].value = res.data.entry
        document.getElementsByClassName('stop_win')[1].value = res.data.stop_win
    }))
}

//config painel settings
function turn_on(){
    let user = localStorage.getItem('user')
    let checked = document.getElementById('switch').checked
    let value = ''
    if(checked == true){
        value = 'on'
    }else{
        value = 'off'
    }
    fetch(`https://api-upstart.onrender.com/api/set/power/${user}/${value}`).then(response => 
    response.json().then(data => ({
            data: data,
            status: response.status
        })
    ))
    
}
function set_entry(){
    let user = localStorage.getItem('user')
    let entry = document.getElementsByClassName('entrada')[0]
    fetch(`https://api-upstart.onrender.com/api/set/entry/${user}/${entry.value}`).then(response => 
    response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(res => {
        window.alert('salvo!')
    }))
}
function set_stop_win(){
    let user = localStorage.getItem('user')
    let stop = document.getElementsByClassName('stop_win')[1]
    fetch(`https://api-upstart.onrender.com/api/set/stop_win/${user}/${stop.value}`).then(response => 
    response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(res => {
        window.alert('salvo!')
    }))
}


function main(){
    login_page.style.display = 'none'
    home_page.style.display = 'flex'
    let user = localStorage.getItem('user')
    date = get_date()
    fetch(`https://api-upstart.onrender.com/api/data/${user}/${date}`).then(response => 
    response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(res => {
        construct_home(res.data)
        
    }))
    
}

function login () {
    user = document.getElementsByClassName('username')[0].value
    password = document.getElementsByClassName('password')[0].value
    fetch(`https://api-upstart.onrender.com/api/auth/${user}/${password}`).then(response => 
        response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(res => {
        if(res.data.status == 'authenticated'){
            localStorage.setItem('user', res.data.username);
            localStorage.setItem('pfp', res.data.pfp);
            let images = document.getElementsByClassName("pfp");
                for (let i = 0; i < images.length; i++) {
                images[i].src = res.data.pfp
            }
            main()
        }else{
            login_page.style.display = 'none'
            error_page.style.display = 'flex'
            error_text.innerHTML = '<a href="https://upstart-bot.netlify.app" class="lucro" style="text-decoration: none;">Login incorreto. Clique para tentar novamente.<a>'
    
        }
    }))
}

function keep_login(){
    if(localStorage.getItem('user')){
        let images = document.getElementsByClassName("pfp");
            for (let i = 0; i < images.length; i++) {
                images[i].src = localStorage.getItem('pfp')
            }
        main()
    }
}

function search() {
    let date = document.getElementById('DATA').value
    if (date == ''){
        date = get_date()
    }

    user = localStorage.getItem('user')
    home_page.style.display = 'none'
    loading_page.style.display = 'flex'
    fetch(`https://api-upstart.onrender.com/api/data/${user}/${date}`).then(response => 
    response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(res => {
        loading_page.style.display = 'none'
        home_page.style.display = 'flex'
        construct_home(res.data)
    }))
}

function logout(){
    localStorage.clear()
    window.location.reload();
}
document.getElementsByClassName('logout')[0].addEventListener('click', logout)


function go_home(){
    home_page.style.display = 'flex'
    logs_page.style.display = 'none'
    notify_page.style.display = 'none'
    config_page.style.display = 'none'
    main()
}

function go_logs(){
    home_page.style.display = 'none'
    logs_page.style.display = 'flex'
    notify_page.style.display = 'none'
    config_page.style.display = 'none'
    construct_logs()
    
}

function go_notify(){
    home_page.style.display = 'none'
    logs_page.style.display = 'none'
    notify_page.style.display = 'flex'
    config_page.style.display = 'none'
}

function go_config(){
    home_page.style.display = 'none'
    logs_page.style.display = 'none'
    notify_page.style.display = 'none'
    config_page.style.display = 'flex'
    construct_configs()
}