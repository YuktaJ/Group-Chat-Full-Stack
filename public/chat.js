
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
let groupId;
async function SendChat(event) {

    let message = document.getElementById("message").value;

    let obj = {
        message, groupId
    }
    let arr = [];
    // let local_message = localStorage.setItem("message", message)
    try {
        let token = localStorage.getItem("token");
        let res = await axios.post("http://localhost:3000/message", obj, { headers: { token: token } });
        arr.push(res.data.text);
        document.getElementById("message").value = "";
        chatOnScreen(arr, res.data.userId);
    } catch (error) {
        console.log(error);
        alert("Error in sending message.");
    }
    ScrollToBottom();
}

async function getChat(id) {
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
        let res = await axios.get(`http://localhost:3000/message?lastId=${lastId}&groupId=${id}`, { headers: { token: token } });
        StoreMsgLocalStorage(res.data.message, res.data.users);

    } catch (error) {
        console.log(error);
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

async function createGroup() {
    try {
        let res = await axios.get("http://localhost:3000/groupusers");
        console.log(res.data.users);
        UsersOnScreen(res.data.users);
    } catch (error) {
        console.log(error);
    }
}
createGroup();

function UsersOnScreen(usersonscreenArr) {
    let parentEle = document.getElementById("checkbox-items");
    let token = localStorage.getItem("token");
    let parsed_token = parseJwt(token);
    let name = parsed_token.name;
    for (let i = 0; i < usersonscreenArr.length; i++) {
        if (usersonscreenArr[i].name != name) {
            let childele = document.createElement("input");
            childele.type = "checkbox";
            childele.value = usersonscreenArr[i].id;
            childele.className = "usersonscreen";

            let namelabel = document.createElement("label");
            namelabel.textContent = usersonscreenArr[i].name;

            parentEle.appendChild(childele);
            parentEle.appendChild(namelabel);
        }
    }
}

document.getElementById("createbtn").addEventListener("click", (event) => {
    CreateBtn(event);
})

async function CreateBtn(event) {
    try {
        event.preventDefault();
        let inputs = document.getElementsByClassName("usersonscreen");
        let arr = Array.from(inputs).filter(checkbox => checkbox.checked);
        let Ele = arr.map(elements => elements.value); //gives ids of the users
        let name = document.getElementById('group-name').value;
        let obj = {
            Ele, name
        }
        console.log(arr, Ele);
        let token = localStorage.getItem("token");
        let res = await axios.post("http://localhost:3000/groupdetails", obj, { headers: { token: token } });

    } catch (error) {
        console.log(error)
    }
}

async function GroupsNames() {
    try {
        let token = localStorage.getItem("token");
        let res = await axios.get("http://localhost:3000/groupnames", { headers: { token: token } });
        ShowGroupsOnScreen(res.data.groupnames);
    } catch (error) {
        console.log(error);
    }
}
GroupsNames();

function ShowGroupsOnScreen(group_arr) {
    let i = 0;
    while (i < group_arr.length) {
        let parentEle = document.getElementById("show-groups")
        let newGroupBtn = document.createElement("button");
        newGroupBtn.innerHTML = group_arr[i].name;
        let group_id = group_arr[i].id;
        newGroupBtn.addEventListener("click", (event) => {
            ShowGroups(group_id);
        })
        parentEle.appendChild(newGroupBtn);
        i++;
    }

}

function ShowGroups(id) {
    localStorage.removeItem("message")
    groupId = id;
    getChat(id);
}
