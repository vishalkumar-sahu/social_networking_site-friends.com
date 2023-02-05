const io = require("socket.io")(2003,{
    cors:{
        origin : "http://localhost:3000"
    },
    pingTimeout: 60000
});

let users = [];

const addUser = (userId, socketId) =>{
    if(!users.some((user) => user?.userId === userId )){
        if(userId){
            users.push({userId, socketId});
        }
        
    }
    // !users.some((user) => user.userId === userId) &&
    // users.push({userId, socketId});
}

const removeUser = (socketId) =>{
    if(users?.some((user) => user?.socketId === socketId )){
        users = users.filter((user) => user?.socketId !== socketId);
    }
    
}

const getUser = (userId) =>{
    return users.find(found_user => found_user.userId == userId);
}

io.on("connection", (socket) => {
    // when connect
    console.log("User Connected !!!");
    //take userId and socketId from user
    socket.on("addUser", userId =>{
        addUser(userId, socket.id);
        io.emit("getUsers", users)
    });

    //send and get message
    socket.on("sendMessage", ({senderId, receiverId, text}) =>{
        const user = getUser(receiverId);
        io.to(user?.socketId).emit("getMessage", {
            senderId,
            text,
        })
    })


    // when disconnect
    socket.on("disconnect", ()=>{
        console.log("User disconneted !!!")
        removeUser(socket.id);
    })

});
