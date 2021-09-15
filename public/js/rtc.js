
import h from './helpers.js';
let socket = io('/stream');



/////////////////////////////////////////////////////////////////////////////////////////////////
let logInForm = document.getElementById("logInForm");
let logInformdiv = document.getElementById("logInFormdiv");
let video = document.getElementById("video");
let chat = document.getElementById("videoChat");
let sendmessage = document.getElementById("sendmessage");
let text = document.querySelector("#text");
let messageSpace = document.querySelector(".messageSpace");
let reciver = document.querySelector("#reciver");
let responseUser;



logInForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let roleList = document.getElementById("role")
    let userName = e.target.userName.value;
    let password = e.target.password.value;
    let role = roleList.value;

    signInFunction(userName, password, role);


    logInformdiv.setAttribute("hidden", 1);
    chat.removeAttribute("hidden");

    socket.emit("userConnected" ,userName )



})

// let userData = localStorage.getItem("userData");
// let user = JSON.parse(userData);





// Functions Implementations
async function signInFunction(userName, password, role) {
    // Send a GET request with the authorization header set to
    let uri = `http://localhost:3001/signin/${role}`;
    

    let header = new Headers();
    header.append(userName, password);
    let encoded = window.btoa(`${userName}:${password}`);
    let auth = "Basic " + encoded;
    header.append("Authorization", auth);
    // console.log(auth);

    let req = new Request(uri, {
        method: "GET",
        headers: header,
    });
    //credentials: 'same-origin'

    fetch(req)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                alert("Invalid login");
                throw new Error("BAD HTTP stuff");
            }
        })
        .then((jsonData) => {
            console.log(jsonData);
            responseUser = jsonData;
            let storageData = JSON.stringify(jsonData);

            localStorage.setItem("userData", storageData);
            
            location.replace(
              "https://videos-chat-app.herokuapp.com/"
              
            );
        })
        .catch((err) => {
            console.log(err);
        });


        return (responseUser)
}



///////////////////////////////////////////////////////////////////////////////////////////

window.addEventListener('load', () => {
    const room = h.getQString(location.href, 'room');
    const username = sessionStorage.getItem('username');

    if (!room) {
        document.querySelector('#room-create').attributes.removeNamedItem('hidden');
    }

    else if (!username) {
        document.querySelector('#username-set').attributes.removeNamedItem('hidden');
    }

    else {
        let commElem = document.getElementsByClassName('room-comm');

        for (let i = 0; i < commElem.length; i++) {
            commElem[i].attributes.removeNamedItem('hidden');
        }

        var pc = [];

        //  console.log(pc,'pccccccccccccccccccccc')



        var socketId = '';
        var myStream = '';
        var screen = '';

        //Get user video by default
        getAndSetUserStream();


        socket.on('connect', () => {
            //set socketId
            socketId = socket.io.engine.id;


            socket.emit('subscribe', {
                room: room,
                socketId: socketId
            } ,
            );

            socket.on('new user', (data) => {

                socket.emit('newUserStart', { to: data.socketId, sender: socketId });
                pc.push(data.socketId);
                init(true, data.socketId);
                console.log('2')

            });

            socket.on('newUserStart', (data) => {
                pc.push(data.sender);
                init(false, data.sender);



            });


            socket.on('oldMessage',payload=>{
                let tasnim =payload.oldMessage[room];
                  if(tasnim){
                    tasnim.forEach(elem =>{
                        h.addChat(elem,'remote')
                    })
                  }
                })




            socket.on('ice candidates', async (data) => {
                data.candidate ? await pc[data.sender].addIceCandidate(new RTCIceCandidate(data.candidate)) : '';

            });


            socket.on('sdp', async (data) => {
                if (data.description.type === 'offer') {
                    data.description ? await pc[data.sender].setRemoteDescription(new RTCSessionDescription(data.description)) : '';
                    console.log('6')
                    h.getUserFullMedia().then(async (stream) => {
                        if (!document.getElementById('local').srcObject) {
                            h.setLocalStream(stream);
                        }

                        //save my stream
                        myStream = stream;

                        stream.getTracks().forEach((track) => {
                            pc[data.sender].addTrack(track, stream);
                        });

                        let answer = await pc[data.sender].createAnswer();

                        await pc[data.sender].setLocalDescription(answer);

                        socket.emit('sdp', { description: pc[data.sender].localDescription, to: data.sender, sender: socketId });
                    }).catch((e) => {
                        console.error(e);
                    });
                }

                else if (data.description.type === 'answer') {
                    await pc[data.sender].setRemoteDescription(new RTCSessionDescription(data.description));
                }
            });
            socket.on( 'chat', ( data ) => {
                h.addChat( data, 'remote' );
                console.log(data,'9999999999999999999999999999')
            } );
        

        });




        function getAndSetUserStream() {
            h.getUserFullMedia().then((stream) => {
                //save my stream
                myStream = stream;

                h.setLocalStream(stream);
            }).catch((e) => {
                console.error(`stream error: ${e}`);
            });
        }

        function sendMsg( msg ) {
            let data = {
                room: room,
                msg: msg,
                sender: username
            };
           //  console.log('8')
           //  socket.on('oldMessage',payload=>{
           //         console.log(payload.oldMessage,"payload");
           //      })
            //emit chat message
            socket.emit( 'chat', data );
            //add localchat
            h.addChat( data, 'local' );
        }



        function init(createOffer, partnerName) {
            pc[partnerName] = new RTCPeerConnection(h.getIceServer());

            if (screen && screen.getTracks().length) {
                screen.getTracks().forEach((track) => {
                    pc[partnerName].addTrack(track, screen);//should trigger negotiationneeded event
                });
            }

            else if (myStream) {
                myStream.getTracks().forEach((track) => {
                    pc[partnerName].addTrack(track, myStream);//should trigger negotiationneeded event
                });
            }

            else {
                h.getUserFullMedia().then((stream) => {
                    //save my stream
                    myStream = stream;

                    stream.getTracks().forEach((track) => {
                        pc[partnerName].addTrack(track, stream);//should trigger negotiationneeded event
                    });

                    h.setLocalStream(stream);
                }).catch((e) => {
                    console.error(`stream error: ${e}`);
                });
            }



            //create offer
            if (createOffer) {
                pc[partnerName].onnegotiationneeded = async () => {
                    let offer = await pc[partnerName].createOffer();

                    await pc[partnerName].setLocalDescription(offer);

                    socket.emit('sdp', { description: pc[partnerName].localDescription, to: partnerName, sender: socketId });
                };
            }



            //send ice candidate to partnerNames
            pc[partnerName].onicecandidate = ({ candidate }) => {
                socket.emit('ice candidates', { candidate: candidate, to: partnerName, sender: socketId });
            };



            //add
            pc[partnerName].ontrack = (e) => {
                let str = e.streams[0];
                if (document.getElementById(`${partnerName}-video`)) {
                    document.getElementById(`${partnerName}-video`).srcObject = str;
                }

                else {
                    //video elem
                    let newVid = document.createElement('video');
                    newVid.id = `${partnerName}-video`;
                    newVid.srcObject = str;
                    newVid.autoplay = true;
                    newVid.className = 'remote-video';

                    //video controls elements
                    let controlDiv = document.createElement('div');
                    controlDiv.className = 'remote-video-controls';
                    //  controlDiv.innerHTML = `<i class="fa fa-microphone text-white pr-3 mute-remote-mic" title="Mute"></i>
                    //      <i class="fa fa-expand text-white expand-remote-video" title="Expand"></i>`;

                    //create a new div for card
                    let cardDiv = document.createElement('div');
                    cardDiv.className = 'card card-sm';
                    cardDiv.id = partnerName;
                    cardDiv.appendChild(newVid);
                    cardDiv.appendChild(controlDiv);

                    //put div in main-section elem
                    document.getElementById('videos').appendChild(cardDiv);

                    //  h.adjustVideoElemSize();
                }
            };



            pc[partnerName].onconnectionstatechange = (d) => {
                switch (pc[partnerName].iceConnectionState) {
                    case 'disconnected':
                    case 'failed':
                        h.closeVideo(partnerName);
                        break;

                    case 'closed':
                        h.closeVideo(partnerName);
                        break;
                }
            };



            pc[partnerName].onsignalingstatechange = (d) => {
                switch (pc[partnerName].signalingState) {
                    case 'closed':
                        console.log("Signalling state is 'closed'");
                        h.closeVideo(partnerName);
                        break;
                }
            };
        }


        function broadcastNewTracks(stream, type, mirrorMode = true) {
            h.setLocalStream(stream, mirrorMode);

            let track = type == 'audio' ? stream.getAudioTracks()[0] : stream.getVideoTracks()[0];

            for (let p in pc) {
                let pName = pc[p];

                if (typeof pc[pName] == 'object') {
                    h.replaceTrack(track, pc[pName]);
                }
            }
        }


        document.getElementById( 'chat-input' ).addEventListener( 'keypress', ( e ) => {
            if ( e.which === 13 && ( e.target.value.trim() ) ) {
                e.preventDefault();
                sendMsg( e.target.value );
               //  console.log( sendMsg( e.target.value ),'dddddddddddddddddddddddd');
                setTimeout( () => {
                    e.target.value = '';
                }, 50 );
            }
        } );




        //When the video icon is clicked
        document.getElementById('toggle-video').addEventListener('click', (e) => {
            e.preventDefault();

            let elem = document.getElementById('toggle-video');

            if (myStream.getVideoTracks()[0].enabled) {


                e.target.classList.remove('fa-video');
                e.target.classList.add('fa-video-slash');
                elem.setAttribute('title', 'Show Video');

                myStream.getVideoTracks()[0].enabled = false;
            }

            else {
                e.target.classList.remove('fa-video-slash');
                e.target.classList.add('fa-video');
                elem.setAttribute('title', 'Hide Video');

                myStream.getVideoTracks()[0].enabled = true;
            }

            broadcastNewTracks(myStream, 'video');
        });


        //When the mute icon is clicked
        document.getElementById('toggle-mute').addEventListener('click', (e) => {
            e.preventDefault();

            let elem = document.getElementById('toggle-mute');

            if (myStream.getAudioTracks()[0].enabled) {
                e.target.classList.remove('fa-microphone-alt');
                e.target.classList.add('fa-microphone-alt-slash');
                elem.setAttribute('title', 'Unmute');

                myStream.getAudioTracks()[0].enabled = false;
            }

            else {
                e.target.classList.remove('fa-microphone-alt-slash');
                e.target.classList.add('fa-microphone-alt');
                elem.setAttribute('title', 'Mute');

                myStream.getAudioTracks()[0].enabled = true;
            }

            broadcastNewTracks(myStream, 'audio');
        });


    }
});


