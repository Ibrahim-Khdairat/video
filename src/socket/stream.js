const stream = (socket) => {

    socket.on('subscribe', (data) => {
        //subscribe/join a room
        socket.join(data.room);
        socket.join(data.socketId);


        //Inform other members in the room of new user's arrival
        if (socket.adapter.nsp._eventsCount) {

            socket.to(data.room).emit('new user', { socketId: data.socketId },);


        }
    });


    socket.on('newUserStart', (data) => {

        socket.to(data.to).emit('newUserStart', { sender: data.sender },

        );
    });

    socket.on('sdp', (data) => {

        socket.to(data.to).emit('sdp', { description: data.description, sender: data.sender },);

    });


    socket.on('ice candidates', (data) => {
        socket.to(data.to).emit('ice candidates', { candidate: data.candidate, sender: data.sender },);


    });

    var ahmad = [];
    socket.on('chat', (data) => {
        ahmad.push(data.room);
        if (!messageQueue[data.room]) {
            messageQueue[data.room] = [];
        }
        messageQueue[data.room] = [...messageQueue[data.room], { sender: data.sender, msg: data.msg, }];
        console.log(messageQueue);
        socket.to(data.room).emit('chat', { sender: data.sender, msg: data.msg },
        );
    });

    socket.on('disconnect', () => {

        socket.on('disconnected', (data) => {
            console.log(data.room, 'disco*///*/*/*/*/*/*')



        })


        if (!socket.adapter.rooms) {
            console.log('////////////////////////////////////////',
                'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'
            );

        };

    });
    let messageQueue = {};


    socket.on("userConnected", user => {
        console.log(`${user} connected`);
    })

    // socket.on("message" , (message)=>{
    //     console.log(message);
    //    socket.emit("sendMessage" , message)
    // })

    // socket.on("test", message=>{
    //     console.log(`${message.reciver} should recive ${message.body} from ${message.sender} `);
    // })

};

module.exports = stream;
