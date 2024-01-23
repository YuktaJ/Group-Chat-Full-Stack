document.getElementById("Send").addEventListener("click", (event) => {
    SendChat(event);
});

async function SendChat(event) {
    let token = localStorage.getItem('token');
    let message = document.getElementById("message").value;
    try {
        let res = await axios.post("http://localhost:3000/message", { message: message }, { headers: { "Authorization": token } });
    } catch (error) {
        console.log(error);
        alert("Error in sending message.");
    }
}