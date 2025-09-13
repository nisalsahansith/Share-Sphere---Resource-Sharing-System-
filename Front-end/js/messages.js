let stompClient = null;
let currentExchangeId = null;
let currentUser = localStorage.getItem("userId"); // logged-in userId
let receiverID = null;
let senderId = null;

// ------------------ WebSocket Setup ------------------
function connectWebSocket() {
    const socket = new SockJS("http://localhost:8080/ws-chat");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function () {
        console.log("✅ Connected to WebSocket");

        stompClient.subscribe("/topic/messages", function (messageOutput) {
            const message = JSON.parse(messageOutput.body);
            console.log("All messages", message)

            // Fallback: if exchangeId is null, build a composite ID
            let chatKey = message.exchangeId
                ? message.exchangeId
                : `${message.senderId}-${message.receiverId}`;

            // Add chat list item if not exists
            if ($(`.chat-item[data-chat='${chatKey}']`).length === 0) {
                const receiverId = message.senderId === currentUser
                    ? message.receiverId
                    : message.senderId;
                // addChatListItem(chatKey, receiverId);
            }

            // Render only if it's the active chat
            if (chatKey === currentExchangeId) {
                const type = message.senderId === currentUser ? "outgoing" : "incoming";
                renderMessage(message, type);
            } else {
                 const type = message.senderId === currentUser ? "outgoing" : "incoming";
                renderMessage(message, type);
             }
            
        });
    });
}


// ------------------ Fetch Username ------------------
function fetchUsername(userId, callback) {
    $.ajax({
        url: "http://localhost:8080/chat/getusername",
        type: "GET",
        headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
        data: { userId: userId },
        success: function(res) {
            const username = res.data || 'Unknown';
            callback(username);
        },
        error: function(err) {
            console.error("Failed to fetch username:", err);
            callback('Unknown');
        }
    });
}

// // ------------------ Add Chat List Item ------------------
function addChatListItem(exchangeId, receiverId) {
    console.log(receiverId)
    fetchUsername(receiverId, function(username) {
        if ($(`.chat-item[data-chat='${exchangeId}']`).length === 0) {
            $(".chat-list").append(`
                <li class="chat-item list-group-item" data-chat="${exchangeId}" data-receiver="${receiverId}">
                    ${username}
                </li>
            `);
        }
    });
}

// // ------------------ Update Chat Header ------------------
function updateChatHeader(receiverId) {
    fetchUsername(receiverId, function(username) {
        $("#chatHeader").text(username);
    });
}

// ------------------ Render Messages ------------------
function renderMessage(message, type) {
    let contentHtml = "";
    if (message.content) {
        contentHtml = `<p>${message.content}</p>`;
    } else if (message.fileUrl) {
        if (message.fileType && message.fileType.startsWith("image")) {
            contentHtml = `<img src="${message.fileUrl}" class="chat-image"/>`;
        } else {
            contentHtml = `<a href="${message.fileUrl}" target="_blank">Download File</a>`;
        }
    }

const senderHtml = type === "incoming"
    ? `<div class="message-sender fw-bold mb-1"></div>`
    : `<div class="message-sender fw-bold mb-1 text-end"></div>`;

    $("#chatBody").append(`
        <div class="message ${type}">
            ${senderHtml}
            ${contentHtml}
        </div>
    `);
    $("#chatBody").scrollTop($("#chatBody")[0].scrollHeight);
}

// ------------------ Load Chat History ------------------
function loadMessages(exchangeId) {
    $.ajax({
        url: "http://localhost:8080/chat/messages",
        type: "GET",
        data: { exchangeId: exchangeId },
        headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
        success: function (messages) {
            console.log(messages)
            $("#chatBody").empty();

            if (messages.length === 0) {
                $("#chatBody").append(`<p class="text-muted text-center mt-3">No conversation yet</p>`);
            } else {
                messages.forEach(m => {
                    const type = m.senderId === currentUser ? "outgoing" : "incoming";
                    renderMessage(m, type);
                });
            }

            $("#chatBody").scrollTop($("#chatBody")[0].scrollHeight);
        },
        error: function(err) {
            console.error("Failed to load messages:", err);
            $("#chatBody").html(`<p class="text-danger text-center mt-3">Unable to load chat messages</p>`);
        }
    });
}

// ------------------ Send Text Message ------------------
$("#messageForm").submit(function(e) {
    // e.preventDefault();
    // const msg = $("#messageInput").val().trim();
    // console.log(senderId ,receiverID)
    // const receiverId = currentUser === receiverID ? senderId : receiverID;
    // console.log("CurrentUser",currentUser)

    // if (!msg) return;
    // console.log("MESSAGe",msg)

    // const message = { senderId: currentUser, receiverId: receiverId, exchangeId: currentExchangeId, content: msg };

    // $.ajax({
    //     url: "http://localhost:8080/chat/send",
    //     type: "POST",
    //     contentType: "application/json",
    //     headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
    //     data: JSON.stringify(message),
    //     success: function(savedMessage) {
    //         renderMessage(savedMessage, "outgoing");
    //         $("#messageInput").val("");

    // //          if (stompClient && stompClient.connected) {
    // //     stompClient.send("/app/chat.broadcast", {}, JSON.stringify(savedMessage));
    // // }
    //     },
    //     error: function(err) { console.error("Failed to send message:", err); }
    // });
    e.preventDefault();
    const msg = $("#messageInput").val().trim();
    if (!msg) return;

    // Determine receiverId
    const receiverId = currentUser === receiverID ? senderId : receiverID;

    const message = {
        senderId: currentUser,
        receiverId: receiverId,
        exchangeId: currentExchangeId,
        content: msg
    };

    if (stompClient && stompClient.connected) {
        // Send message to /app/chat.send
        stompClient.send("/app/chat.send", {}, JSON.stringify(message));

        // Render immediately for the sender
        // renderMessage(message, "outgoing");
        $("#messageInput").val("");
    } else {
        console.error("❌ WebSocket not connected!");
    }
});

$(".chat-item").on("click", function () {
    $(".chat-item").removeClass("active");
    $(this).addClass("active");

    let otherUserId = $(this).data("id");
    fetchUsername(otherUserId, function(username) {
        $("#chatHeader").text(username);
    });

    // Load this chat's conversation
    loadConversation(otherUserId);
});


// ------------------ Image/File Upload ------------------
$("#imageInput").on("change", function () {
    const file = this.files[0];
    if (!file || !currentExchangeId) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("senderId", currentUser);
    formData.append("receiverId", currentUser === providerId ? customerId : providerId);
    formData.append("exchangeId", currentExchangeId);

    $.ajax({
        url: "http://localhost:8080/chat/send-file",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(message) {
            renderMessage(message, "outgoing");
            stompClient.send("/app/chat.send", {}, JSON.stringify(message));
        }
    });
});

// ------------------ Location Sharing ------------------
$("#shareLocation").click(function () {
    if (!navigator.geolocation || !currentExchangeId) return alert("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(function(pos) {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const receiverId = currentUser === providerId ? customerId : providerId;

        const chatMessage = {
            senderId: currentUser,
            receiverId,
            exchangeId: currentExchangeId,
            content: `<a href="https://www.google.com/maps?q=${lat},${lng}" target="_blank"><i class="fas fa-map-marker-alt"></i> My Location</a>`
        };

        $.ajax({
            url: "http://localhost:8080/chat/send",
            type: "POST",
            contentType: "application/json",
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            data: JSON.stringify(chatMessage),
            success: function(savedMessage) {
                renderMessage(savedMessage, "outgoing");
                stompClient.send("/app/chat.send", {}, JSON.stringify(savedMessage));
            }
        });
    });
});

// ------------------ Switch Between Chats ------------------
// $(document).on("click", ".chat-item", function() {
//     $(".chat-item").removeClass("active");
//     $(this).addClass("active");

//     currentExchangeId = $(this).data("chat");
//     const receiverId = $(this).data("receiver");

//     updateChatHeader(receiverId);
//     loadMessages(currentExchangeId);
// });

// ------------------ Auto-load chat if coming from booking ------------------
$(document).ready(function () {
    const providerId = localStorage.getItem("chatProviderId");
    const customerId = localStorage.getItem("chatCustomerId");
    const exchangeId = localStorage.getItem("chatExchangeId");

    console.log("Provider:", providerId, "Customer:", customerId, "Exchange:", exchangeId);

    if (exchangeId) {
        currentExchangeId = exchangeId;
        $(".chat-item").removeClass("active");
        $(`.chat-item[data-chat='${exchangeId}']`).addClass("active");

        // decide who the receiver is (not the current logged-in user)
        const receiverId = (currentUser === providerId) ? customerId : providerId;

        updateChatHeader(receiverId);
        loadMessages(exchangeId);
    } else {
        updateChatHeader(providerId)
        loadConversation(providerId)
    }

    connectWebSocket();
});


// ------------------ Clear Temp Storage ------------------
window.addEventListener("beforeunload", function () {
    localStorage.removeItem("chatExchangeId");
    localStorage.removeItem("chatProviderId");
    localStorage.removeItem("chatCustomerId");
});

$(document).ready(function () {
    const loggedInUserId = localStorage.getItem("userId"); // from login

    // Load chat list
    $.ajax({
        url: "http://localhost:8080/chat/chat/list",
        method: "GET",
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        data: { userId: loggedInUserId },
        success: function (res) {
            if (res.code === 200) {
                renderChatList(res.data);
            }
        },
        error: function (err) {
            console.error("Failed to load chat list", err);
        }
    });
});

function renderChatList(chats) {
    let chatList = $("#chatList");
    chatList.empty();

    if (chats.length === 0) {
        chatList.append("<p>No conversations yet</p>");
        return;
    }

    chats.forEach(chat => {
        chatList.append(`
            <div class="chat-item" data-id="${chat.userId}">
                <strong>${chat.username}</strong><br>
                <small>${chat.lastMessage || ""}</small>
            </div>
        `);
    });

    // Add click event to load conversation
    $(".chat-item").on("click", function () {
        let otherUserId = $(this).data("id");
        loadConversation(otherUserId);
        fetchUsername(otherUserId, function(username) {
        $("#chatHeader").text(username);
        });
    });
}


function loadConversation(otherUserId) {
    const loggedInUserId = localStorage.getItem("userId");
    receiverID = otherUserId;
    senderId = loggedInUserId;

    $.ajax({
        url: "http://localhost:8080/chat/chat/conversation",
        method: "GET",
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        data: {
            senderId1: loggedInUserId,
            receiverId1: otherUserId,
            senderId2: otherUserId,
            receiverId2:loggedInUserId
        },
        success: function (res) {
            if (res.code === 200) {
                console.log(res)
                currentExchangeId = res.data.exchangeId;
                renderConversation(res.data);
            }
        },
        error: function (err) {
            console.error("Failed to load conversation", err);
        }
    });
}

function renderConversation(messages) {
    $("#chatBody").empty();   // 🔥 clear old conversation

    if (!messages || messages.length === 0) {
        $("#chatBody").append("<p class='text-muted text-center mt-3'>No conversation yet</p>");
        return;
    }

    messages.forEach(msg => {
        console.log(msg.content)
        const alignment = String(msg.senderId) === String(localStorage.getItem("userId"))
            ? "outgoing"
            : "incoming";
        renderMessage(msg, alignment);
    });

    // Auto scroll to bottom
    $("#chatBody").scrollTop($("#chatBody")[0].scrollHeight);
}

