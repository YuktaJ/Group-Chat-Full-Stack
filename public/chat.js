document.getElementById("Send").addEventListener("click", (event) => {
    SendChat(event);
});
function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );

    return JSON.parse(jsonPayload);
}

async function SendChat(event) {

    let message = document.getElementById("message").value;
    let obj = {
        message
    }
    let arr = [];
    // let local_message = localStorage.setItem("message", message)
    try {
        let token = localStorage.getItem("token");
        let res = await axios.post("http://localhost:3000/message", obj, { headers: { "token": token } });
        arr.push(res.data.text);
        document.getElementById("message").value = "";
        chatOnScreen(arr, res.data.userId);
    } catch (error) {
        console.log(error);
        alert("Error in sending message.");
    }
    ScrollToBottom();
}

async function getChat() {
    let token = localStorage.getItem('token');
    let totalMsg = localStorage.getItem('message');
    totalMsg = JSON.parse(totalMsg);
    console.log(totalMsg, "Totmsg");
    let lastId;
    if (!totalMsg) {
        lastId = 0;
    } else {
        if (totalMsg.length === 0) {
            lastId = 0;
        } else {
            lastId = totalMsg[totalMsg.length - 1].id;

        }
    }
    console.log(lastId, "Last Id")

    try {
        let res = await axios.get(`http://localhost:3000/message?lastId=${lastId}`, { headers: { "token": token } });
        StoreMsgLocalStorage(res.data.message, res.data.users);

    } catch (error) {
        console.log(error);
        alert("Unable to fetch chats.");
    }
}

function StoreMsgLocalStorage(message_arr, user_arr) {
    let oldMsg = JSON.parse(localStorage.getItem("message"));
    if (oldMsg) {
        let new_arr = oldMsg.concat(message_arr);
        let stringify_arr = JSON.stringify(new_arr);
        localStorage.setItem("message", stringify_arr);
    } else {
        let stringify_msg = JSON.stringify(message_arr);
        localStorage.setItem("message", stringify_msg);
    }
    let messages = JSON.parse(localStorage.getItem("message"));
    if (!messages) {
        console.log("No chats available");
    } else {
        chatOnScreen(messages, user_arr);
    }
}

function chatOnScreen(arr, user_arr) {
    let parentEle = document.getElementById("chats");
    let token = localStorage.getItem("token");
    let parsed_token = parseJwt(token);

    let id = parsed_token.id;
    let i = 0;
    while (i < arr.length) {
        if (arr[i].userId === id) {
            let childEle = document.createElement("ul");
            childEle.textContent = `you: ${arr[i].text} `;
            childEle.className = "text-messages";
            childEle.style = "text-align:right";
            parentEle.appendChild(childEle);
        } else {
            for (let j = 0; j < user_arr.length; j++) {
                if (user_arr[j].id === arr[i].userId) {
                    let childEle = document.createElement("ul");
                    childEle.textContent = `${user_arr[j].name}: ${arr[i].text} `;
                    childEle.className = "text-messages";
                    childEle.style = "text-align:right";
                    parentEle.appendChild(childEle);
                }
            }
        }
        i++;
    }
    ScrollToBottom();
}
getChat();

function autoRefresh() {
    let parentEle = document.getElementById("chats");
    parentEle.innerHTML = "";
    getChat();
    ScrollToBottom();

}
setInterval(autoRefresh, 10000);

function ScrollToBottom() {
    let parent = document.getElementById("chats");
    parent.scrollTop = parent.scrollHeight;
}