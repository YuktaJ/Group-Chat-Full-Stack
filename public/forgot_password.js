document.getElementById("forgot").addEventListener("submit", (event) => {
    resetPassword(event);
});

async function resetPassword(event) {
    let email = document.getElementById("email").value;
    let obj = {
        email
    }
    try {
        let result = await axios.post("http://54.219.177.84:3000/reset-password", obj);
    } catch (error) {
        alert("Incorrect Email id");
    }
}