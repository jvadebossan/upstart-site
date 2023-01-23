login_page = document.getElementsByClassName('LOGIN')[0]
loading_page = document.getElementsByClassName('LOADING')[0]
error_page = document.getElementsByClassName('ERROR')[0]
error_text = document.getElementsByClassName('error_text')[0]
dashboard_page = document.getElementsByClassName('DASHBOARD')[0]

function get_date(){
    const today = new Date()
    const yyyy = today.getFullYear()
    let mm = today.getMonth() + 1
    let dd = today.getDate()

    if (dd < 10) dd = '0' + dd
    if (mm < 10) mm = '0' + mm

    return String(dd + mm + yyyy)
}


function construct_page(obj){
    if (obj == 'Erro'){
        dashboard_page.style.display = 'none'
        error_page.style.display = 'flex'
        error_text.innerHTML = '<a href="https://upstart-bot.netlify.app" class="lucro" style="text-decoration: none;">Erro na api. Clique para reiniciar.<a>'
    }
    else{
        console.log(String(Number(100/obj.total*obj.created)))
        document.getElementById('SALDO').innerText = `R$ ${String(obj.actual_bal)}`
        document.getElementById('REALIZADAS').innerText = `Realizadas: ${String(obj.created)}`
        document.getElementById('NAO_REALIZADAS').innerText = `Não realizadas: ${String(obj.not_created)}`
        document.getElementById('GRAFICO1').style = `--value:${String(Number(100/obj.total*obj.not_created))}`
        document.getElementById('GANHAS').innerText = `Entradas ganhas: ${String(obj.wins)}`
        document.getElementById('PERDIDAS').innerText = `Entradas perdidas: ${String(obj.losses)}`
        document.getElementById('GRAFICO2').style = `--value:${String(Number(100/obj.created*obj.loss))}`
        document.getElementById('LUCRO').innerText = `R$ ${String(obj.profit)}`
    }
}


function main(user){
    login_page.style.display = 'none'
    loading_page.style.display = 'flex'
    date = get_date()
    fetch(`https://api-upstart.squareweb.app/api/data/${user}/${date}`).then(response => 
    response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(res => {
        loading_page.style.display = 'none'
        dashboard_page.style.display = 'flex'
        construct_page(res.data)
        localStorage.setItem('user', user);
    }))
    
}

function login () {
    user = document.getElementsByClassName('username')[0].value
    password = document.getElementsByClassName('password')[0].value
    fetch(`https://api-upstart.squareweb.app/api/auth/${user}/${password}`).then(response => 
        response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(res => {
        if(res.data.status == 'authenticated'){
            main(user)
        }else{
            login_page.style.display = 'none'
            error_page.style.display = 'flex'
            error_text.innerHTML = '<a href="https://upstart-bot.netlify.app" class="lucro" style="text-decoration: none;">Login incorreto. Clique para tentar novamente.<a>'
    
        }
    }))
}

function search() {
    let date = document.getElementById('DATA').value
    if (date == ''){
        date = get_date()
    }

    user = localStorage.getItem('user')
    dashboard_page.style.display = 'none'
    loading_page.style.display = 'flex'
    fetch(`https://api-upstart.squareweb.app/api/data/${user}/${date}`).then(response => 
    response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(res => {
        loading_page.style.display = 'none'
        dashboard_page.style.display = 'flex'
        construct_page(res.data)
    }))
}

let date = document.getElementById('BUSCAR')
date.addEventListener('click', search)