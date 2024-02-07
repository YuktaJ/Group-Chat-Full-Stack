document.getElementById("login").addEventListener("submit", (event) => {
    loginPage(event);
});



async function loginPage(event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let obj = {
        email, password
    }
    try {
        let result = await axios.post("http://54.219.177.84:3000/login", obj);
        
        if (result.status === 201) {
            alert(result.data.message);
            localStorage.setItem('token', result.data.token);
            window.location.href = "./chat.html"
        }
    } catch (error) {
        document.body.innerHTML += `<div style="color: orange; text-align:center">${error.response.data.message}</div>`
    }
}