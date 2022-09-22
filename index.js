const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(server,{
    cors:{
        origin:'http://localhost:3000',
        methods:['GET','POST']
    }
});
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/",(req,res)=>{
    res.send("server is running");
})

// init connection with socket .io
io.on('connection',(socket)=>{
    console.log(` A new User Connected`);
    socket.emit('me',socket.id);
    socket.on('disconnect',()=>{
        console.log(` A user has been disconnected `);
        socket.broadcast.emit('callEnded');
    });
    //sending details
    socket.on("callUser",({userToCall,signalData,from,name})=>{
        console.log(`userToCall`,userToCall);
        io.to(userToCall).emit("callUser",{signal:signalData,from,name})
    });

    //answer call
    socket.on('answerCall',(data)=>{
        io.to(data.to).emit("callAccepted",data.signal);
    }) 

})

server.listen(PORT,()=>{
console.log(`Server is running at PORT ${PORT}`)
})