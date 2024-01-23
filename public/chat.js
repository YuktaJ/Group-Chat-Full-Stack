document.getElementById("Send").addEventListener("click", (event) => {
    SendChat(event);
});

async function SendChat(event) {
    const token = localStorage.getItem('token');
    let message = document.getElementById("message").value;
    let arr = [];
    try {
        let res = await axios.post("http://localhost:3000/message", { message: message }, { headers: { "Authorization": token } });
        arr.push(res.data.text);
        document.getElementById("message").value = "";
        chatOnScreen(arr);
    } catch (error) {
        console.log(error);
        alert("Error in sending message.");
    }
}

async function getChat() {
    let token = localStorage.getItem('token');
    try {
        let res = await axios.get("http://localhost:3000/message", { headers: { "Authorization": token } });
        chatOnScreen(res.data.message); //res.data.message gives an array.
    } catch (error) {
        console.log(error);
        alert("Unable to fetch chats.");
    }
}

function chatOnScreen(arr) {
    let parentEle = document.getElementById("chats");

    let i = 0;
    while (i < arr.length) {
        let childEle = document.createElement("ul");
        childEle.textContent = `${arr[i].text}`;
        childEle.className = "text-messages";
        childEle.style = "text-align:right";
        parentEle.appendChild(childEle);
        i++;
    }
}
getChat();

function autoRefresh() {
    let parentEle = document.getElementById("chats");
    parentEle.innerHTML = "";
    getChat();
}
setInterval(autoRefresh, 10000);