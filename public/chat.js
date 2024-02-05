let groupId;
const socket = io(window.location.origin);
socket.on("group-message", (id, text) => {
    console.log(groupId, text, "Backend Se Lenge");
    let groupid = localStorage.getItem("groupid");
    if (groupid == id) {
        getChat(id);
    }
})
localStorage.removeItem("message");
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
        message, groupId
    }
    let arr = [];
    try {
        let token = localStorage.getItem("token");
        let res = await axios.post("http://localhost:3000/message", obj, { headers: { token: token } });
        arr.push(res.data.text);
        document.getElementById("message").value = "";
        socket.emit("new-group-message", groupId, res.data.text);
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
            if (arr[i].isImage) {
                let childEle = document.createElement("li");
                childEle.innerHTML = `<big><sup style="text-align: right;">You: </sup>
                <img src="${arr[i].url}" style="width:100%; height:150px; background-size:contain"></img> </big>`;
                childEle.className = "list-group-items";
                childEle.style.margin = "10px 0px 0px 350px"
                parentEle.appendChild(childEle);

            } else if (arr[i].isVideo) {
                let childEle = document.createElement("li");
                childEle.innerHTML = `<big><sup style="text-align: right;">You: </sup>
                <video src="${arr[i].url}" style="width:100%; height:150px; background-size:contain" controls></video> </big>`;
                childEle.style.margin = "10px 0px 0px 350px"
                childEle.className = "list-group-items";

                parentEle.appendChild(childEle);
            } else if (arr[i].isDocument) {
                let childEle = document.createElement("li");

                childEle.innerHTML = `<big><sup style="text-align: right;">You:</sup>
                <a href="${arr[i].url}" alt="Document">Tap Here</big>`;
                childEle.style.margin = "10px 0px 0px 350px"
                childEle.className = "list-group-items";


                parentEle.appendChild(childEle);
            } else {
                let childEle = document.createElement("li");
                childEle.innerHTML = `<big>you: ${arr[i].text} </big>`;

                childEle.className = "list-group-items";
                childEle.style.margin = "10px 0px 0px 350px"
                parentEle.appendChild(childEle);
            }

        } else {

            for (let j = 0; j < user_arr.length; j++) {
                if (user_arr[j].id == arr[i].userId) {
                    if (arr[i].isImage) {
                        let childEle = document.createElement("li");
                        childEle.innerHTML = `<big>${user_arr[j].name}: <img src="${arr[i].url}" style="width:100%; height:150px; background-size:contain"></img> </big>`;
                        childEle.className = "list-group-items";
                        childEle.style = "text-align:left; color:white";

                        parentEle.appendChild(childEle);
                    } else if (arr[i].isVideo) {
                        let childEle = document.createElement("li");
                        childEle.innerHTML = `<big>
                        <video  src="${arr[i].url}" style="width:100%; height:150px; background-size:contain" controls></video><sup style="text-align: right;">:${user_arr[j].name} </sup> </big>`;
                        childEle.className = "list-group-items";
                        childEle.style = "text-align:left; color:white";

                        parentEle.appendChild(childEle);
                    } else if (arr[i].isDocument) {
                        let childEle = document.createElement("li");
                        childEle.innerHTML = `<big><sup style="text-align: right;">${user_arr[j].name}</sup>
                        <a href="${arr[i].url}" alt="Document">Tap Here</big>`; childEle.className = "list-group-items";
                        childEle.style = "text-align:left; color:white";

                        parentEle.appendChild(childEle);
                    } else {
                        let childEle = document.createElement("li");
                        childEle.innerHTML = ` <big>${user_arr[j].name}: ${arr[i].text}  </big>`;
                        childEle.className = "list-group-items";
                        childEle.style = "text-align:left; color:white";
                        parentEle.appendChild(childEle);
                    }
                }
            }
        }
        i++;
    }
    ScrollToBottom();
}
getChat();

// function autoRefresh() {
//     let parentEle = document.getElementById("chats");
//     parentEle.innerHTML = "";
//     getChat();
//     ScrollToBottom();

// }
// setInterval(autoRefresh, 10000);

function ScrollToBottom() {
    let parent = document.getElementById("chats");
    parent.scrollTop = parent.scrollHeight;
}

async function createGroup() {
    try {
        let res = await axios.get("http://localhost:3000/group-users");
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
        let res = await axios.post("http://localhost:3000/group-details", obj, { headers: { token: token } });

    } catch (error) {
        console.log(error)
    }
}

async function GroupsNames() {
    try {
        let token = localStorage.getItem("token");
        let res = await axios.get("http://localhost:3000/group-names", { headers: { token: token } });
        ShowGroupsOnScreen(res.data.groupnames, res.data.admins);
    } catch (error) {
        console.log(error);
    }
}
GroupsNames();

function ShowGroupsOnScreen(group_arr, admins) {
    let i = 0;
    while (i < group_arr.length) {
        let parentEle = document.getElementById("show-groups")
        let newGroupBtn = document.createElement("button");
        newGroupBtn.innerHTML = group_arr[i].name;
        let group_id = group_arr[i].id;
        let group_name = group_arr[i].name;
        newGroupBtn.addEventListener("click", (event) => {
            let parentEle = document.getElementById("group-member-details")
            parentEle.innerHTML = "";
            localStorage.setItem("groupid", group_id);
            GetGroupMembers(group_id);
            ShowGroups(group_id, group_name);
        })
        parentEle.appendChild(newGroupBtn);

        for (let i = 0; i < admins.length; i++) {
            if (admins[i].groupId == group_id) {

                let edit_btn = document.createElement("button");
                localStorage.setItem("groupid", group_id);
                edit_btn.innerHTML = "Edit";
                edit_btn.onclick = openForm;

                function openForm() {
                    document.getElementById("overlay").style.display = "flex";
                }
                document.getElementById("closeForm").addEventListener("click", () => {
                    document.getElementById("overlay").style.display = "none";
                })
                parentEle.appendChild(edit_btn);
            }
        }
        let br = document.createElement("br");
        parentEle.appendChild(br);
        i++;
    }

}

async function getEditDetails() {
    try {
        let id = localStorage.getItem("groupid");
        let res = await axios.get(`http://localhost:3000/edit_details?data=${id}`);
        showGroupMembers(res.data.adminUsers,
            res.data.groupUsers,
            res.data.otherUsers);
    } catch (error) {
        console.log(error);
    }
}
getEditDetails();

function showGroupMembers(admins, members, users) {
    let group_admins = document.getElementById("group_edit_admins");
    let group_members = document.getElementById("group_edit_members");
    let group_otherusers = document.getElementById("group_edit_otherusers");
    let token = localStorage.getItem("token");
    let parsedToken = parseJwt(token);
    let removeAdminBtn = document.createElement("button");
    removeAdminBtn.innerHTML = "Remove Admin"
    let removeUserBtn = document.createElement("button");
    removeUserBtn.innerHTML = "Remove User"
    let addAdminBtn = document.createElement("button");
    addAdminBtn.innerHTML = "Add as Admin"
    let addUserBtn = document.createElement("button");
    addUserBtn.innerHTML = "Add User"


    for (let i = 0; i < admins.length; i++) {
        if (parsedToken.id != admins[i].id) {
            let group_admin = document.createElement("h5");
            group_admin.innerHTML = admins[i].name;
            group_admin.appendChild(removeAdminBtn);
            let adminid = admins[i].id;
            removeAdminBtn.addEventListener("click", (event) => {
                removeAdmin(event, adminid);
            });
            group_admins.appendChild(group_admin);
        }
    }
    for (let j = 0; j < members.length; j++) {
        let id = members[j].id;
        let group_member = document.createElement("h5");
        group_member.innerHTML = members[j].name;
        group_member.appendChild(addAdminBtn);
        group_member.appendChild(removeUserBtn);
        addAdminBtn.addEventListener("click", (event) => {
            addAdmin(event, id);
        })
        removeUserBtn.addEventListener("click", (event) => {
            removeUser(event, id);
        })
        group_members.appendChild(group_member);

    }

    for (let k = 0; k < users.length; k++) {
        let id = users[k].id;
        let group_user = document.createElement("h5");
        group_user.innerHTML = users[k].name;
        group_user.appendChild(addUserBtn);
        addUserBtn.addEventListener("click", (event) => {
            addToGroup(event, id);
        })
        group_otherusers.appendChild(group_user);
    }

}
async function removeAdmin(event, id) {
    try {
        let groupid = localStorage.getItem("groupid");
        let res = await axios.post("http://localhost:3000/remove-admin", {
            groupid, id
        })
        if (res.status == 200) {
            alert(res.data.message);
            window.location.href = "./chat.html"
        }
    } catch (error) {
        console.log(error)
    }
}
async function addAdmin(event, id) {
    try {
        let groupid = localStorage.getItem("groupid");
        let res = await axios.post("http://localhost:3000/add-admin", {
            groupid, id
        })
        if (res.status == 200) {
            alert(res.data.message);
            window.location.href = "./chat.html"
        }
    } catch (error) {
        console.log(error)
    }
}
async function removeUser(event, id) {
    try {
        let groupid = localStorage.getItem("groupid");
        let res = await axios.post("http://localhost:3000/remove-user", {
            groupid, id
        })
        if (res.status == 200) {
            alert(res.data.message);
            window.location.href = "./chat.html"
        }
    } catch (error) {
        console.log(error)
    }
}
async function addToGroup(event, id) {
    try {
        let groupid = localStorage.getItem("groupid");
        let res = await axios.post("http://localhost:3000/add-user", {
            groupid, id
        })
        if (res.status == 200) {
            alert(res.data.message);
            window.location.href = "./chat.html"
        }

    } catch (error) {
        console.log(error)
    }
}
async function GetGroupMembers(id) {
    let res = await axios.get(`http://localhost:3000/group-members?groupid=${id}`);
    console.log(res.data.groupMembers)
    let parentEle = document.getElementById("group-member-details");
    let members = res.data.groupMembers;


    for (let i = 0; i < members.length; i++) {
        let h4 = document.createElement("h4");
        h4.innerHTML = members[i].name;
        parentEle.appendChild(h4);
    }
}

function ShowGroups(id, name) {
    localStorage.removeItem("message");
    let parentEle = document.getElementById("group-name-chat");
    document.getElementById("chats").innerHTML = "";
    parentEle.innerHTML = "GROUP-NAME:" + name;
    groupId = id;
    getChat(id);
}

document.getElementById("share_input").addEventListener("change", (event) => {
    shareFiles(event);
});

async function shareFiles(event) {
    event.preventDefault();
    const formData = new FormData();
    let fileInput = document.getElementById("share_input");
    const fileType = fileInput.files[0].type;

    formData.append("file", fileInput.files[0]);

    const token = localStorage.getItem("token");
    let parsedToken = parseJwt(token);
    let userName = parsedToken.name;
    let groupid = localStorage.getItem("groupid");
    try {
        const response = await axios.post(
            `http://localhost:3000/upload-files?groupid=${groupid}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    token: token,
                },
            }
        );
        let arr = [];
        arr.push(response.data.result);
        let user_arr = [];
        user_arr.push(parsedToken);
        if (fileType.startsWith("image/")) {
            // Handle image upload
            chatOnScreen(arr, user_arr);
            socket.emit("new-group-message", groupid, response.data.result, userName);
        } else if (fileType.startsWith("video/")) {
            // Handle video upload
            chatOnScreen(arr, user_arr);
            socket.emit("new-group-message", groupid, response.data.result, userName);
            // Implement your video handling code here
        } else {
            // Handle document upload
            chatOnScreen(arr, user_arr);
            socket.emit("new-group-message", groupid, response.data.result, userName);
            // Implement your document handling code here
        }
    }
    catch (error) {
        console.log(error);
    }
}