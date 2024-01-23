document.getElementById("forgot").addEventListener("submit", (event) => {
    resetPassword(event);
});

async function resetPassword(event) {
    let email = document.getElementById("email").value;
    let obj = {
        email
    }
    try {
        let result = await axios.post("http://localhost:3000/resetpassword", obj);
    } catch (error) {
        alert("Incorrect Email id");
    }
}