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
        let signup = await axios.post("http://localhost:3000/signup", obj);
    } catch (error) {
        alert(`${error.response.data.error}`);
    }
}

