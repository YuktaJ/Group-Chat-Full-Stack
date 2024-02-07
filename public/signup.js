document.getElementById("signup").addEventListener('submit', (event) => {
    signupPage(event);
})

function signupPage(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let phone = document.getElementById("phone").value;

    let obj = {
        name, email, phone, password
    }

    StoreObj(obj);
}

async function StoreObj(obj) {
    try {
        let signup = await axios.post("http://54.219.177.84:3000/signup", obj);
        if (signup.status === 201) {
            alert(`${signup.data.message}`);
            window.location.href = './login.html';
        }
    } catch (error) {
        document.body.innerHTML += `<div style="color: orange; text-align:center">${error.response.data.message}</div>`;
    }
}

