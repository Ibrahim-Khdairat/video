export default {

    //function to create random number to use it in room id 
    generateRandomString() {
        const crypto = window.crypto || window.msCrypto;
        let array = new Uint32Array(1);
        console.log(array,'*****************')
        console.log(crypto.getRandomValues(array),'*******///////////////**********')
        return crypto.getRandomValues(array);

        
    },

     returnUser(user){
        return user
     },
     
    closeVideo( elemId ) {
        if ( document.getElementById( elemId ) ) {
            document.getElementById( elemId ).remove();
            this.adjustVideoElemSize();
            // console.log(adjustVideoElemSize(),'adjustVideoElemSize()')
            console.log(elemId,'mmmmmmmmmmmmmmmmmmmmmm')
        }
    },

    getQString( url = '', keyToReturn = '' ) {
        url = url ? url : location.href;

        // console.log(location,'location')
        // console.log(location.href,'location.href')
        // console.log(url,'url print')

        let queryStrings = decodeURIComponent( url ).split( '#', 2 )[0].split( '?', 2 )[1];

        // console.log(decodeURIComponent(  ),'decodeURIComponent( url )')
        // console.log(decodeURIComponent( url ).split( '#', 2 )[0],'---------');

        if ( queryStrings ) {
            let splittedQStrings = queryStrings.split( '&' );
            // console.log(splittedQStrings,'splittedQStrings')

            if ( splittedQStrings.length ) {
                let queryStringObj = {};

                splittedQStrings.forEach( function ( keyValuePair ) {
                    let keyValue = keyValuePair.split( '=', 2 );

                    // console.log(keyValue,'keyValue')

                    if ( keyValue.length ) {
                        queryStringObj[keyValue[0]] = keyValue[1];
                    }
                } );

                return keyToReturn ? ( queryStringObj[keyToReturn] ? queryStringObj[keyToReturn] : null ) : queryStringObj;
            }

            return null;
        }

        return null;
    },


    userMediaAvailable() {
        return !!( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia );
    },


    getUserFullMedia() {
        if ( this.userMediaAvailable() ) {
            return navigator.mediaDevices.getUserMedia( {
                video: true,
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true
                }
            } );
        }

        else {
            throw new Error( 'User media not available' );
        }
    },


    getUserAudio() {
        if ( this.userMediaAvailable() ) {
            return navigator.mediaDevices.getUserMedia( {
                audio: {
                    echoCancellation: true,
                    noiseSuppression: false
                }
            } );
        }

        else {
            throw new Error( 'User media not available' );
        }
    },



   
    getIceServer() {
        return {
            iceServers: [
                {
                    urls: ["stun:eu-turn4.xirsys.com"]
                },
                {
                    username: "ml0jh0qMKZKd9P_9C0UIBY2G0nSQMCFBUXGlk6IXDJf8G2uiCymg9WwbEJTMwVeiAAAAAF2__hNSaW5vbGVl",
                    credential: "4dd454a6-feee-11e9-b185-6adcafebbb45",
                    urls: [
                        "turn:eu-turn4.xirsys.com:80?transport=udp",
                        "turn:eu-turn4.xirsys.com:3478?transport=tcp"
                    ]
                }
            ]
        };
    },

    addChat( data, senderType ) {
        let chatMsgDiv = document.querySelector( '#chat-messages' );
        let contentAlign = 'justify-content-end';
        let senderName = 'You';
        let msgBg = 'bg-white';
        if ( senderType === 'remote' ) {
            contentAlign = 'justify-content-start';
            senderName = data.sender;
            msgBg = '';
            this.toggleChatNotificationBadge();
        }
        let infoDiv = document.createElement( 'div' );
        infoDiv.className = 'sender-info';
        infoDiv.innerHTML = `${ senderName } - ${ moment().format( 'Do MMMM, YYYY h:mm a' ) }`;
        let colDiv = document.createElement( 'div' );
        colDiv.className = `col-10 card chat-card msg ${ msgBg }`;
        colDiv.innerHTML = xssFilters.inHTMLData( data.msg );
        let rowDiv = document.createElement( 'div' );
        rowDiv.className = `row ${ contentAlign } mb-2`;
        colDiv.appendChild( infoDiv );
        rowDiv.appendChild( colDiv );
        chatMsgDiv.appendChild( rowDiv );
        /**
         * Move focus to the newly added message but only if:
         * 1. Page has focus
         * 2. User has not moved scrollbar upward. This is to prevent moving the scroll position if user is reading previous messages.
         */
        // if ( this.pageHasFocus ) {
        //     rowDiv.scrollIntoView();
        // }
    },
    toggleChatNotificationBadge() {
        if ( document.querySelector( '#chat-pane' ).classList.contains( 'chat-opened' ) ) {
            document.querySelector( '#new-chat-notification' ).setAttribute( 'hidden', true );
        }
        else {
            document.querySelector( '#new-chat-notification' ).removeAttribute( 'hidden' );
        }
    },


    replaceTrack( stream, recipientPeer ) {
        let sender = recipientPeer.getSenders ? recipientPeer.getSenders().find( s => s.track && s.track.kind === stream.kind ) : false;

        sender ? sender.replaceTrack( stream ) : '';
    },




    toggleVideoBtnDisabled( disabled ) {
       
        document.getElementById( 'toggle-video' ).disabled = disabled;
    },




    singleStreamToggleMute( e ) {

        if ( e.target.classList.contains( 'fa-microphone' ) ) {
            console.log(disabled,'///////////////////////////');
            e.target.parentElement.previousElementSibling.muted = true;
            e.target.classList.add( 'fa-microphone-slash' );
            e.target.classList.remove( 'fa-microphone' );
        }

        else {
            e.target.parentElement.previousElementSibling.muted = false;
            e.target.classList.add( 'fa-microphone' );
            e.target.classList.remove( 'fa-microphone-slash' );
        }
    },


    

    setLocalStream( stream, mirrorMode = true ) {
        const localVidElem = document.getElementById( 'local' );

        localVidElem.srcObject = stream;
        mirrorMode ? localVidElem.classList.add( 'mirror-mode' ) : localVidElem.classList.remove( 'mirror-mode' );
    },



    createDemoRemotes( str, total = 6 ) {
        let i = 0;

        let testInterval = setInterval( () => {
            let newVid = document.createElement( 'video' );
            newVid.id = `demo-${ i }-video`;
            newVid.srcObject = str;
            newVid.autoplay = true;
            newVid.className = 'remote-video';

            //video controls elements
            let controlDiv = document.createElement( 'div' );
            // controlDiv.className = 'remote-video-controls';
            // controlDiv.innerHTML = `<i class="fa fa-microphone text-white pr-3 mute-remote-mic" title="Mute"></i>
            //     <i class="fa fa-expand text-white expand-remote-video" title="Expand"></i>`;

            //create a new div for card
            let cardDiv = document.createElement( 'div' );
            // cardDiv.className = 'card card-sm';
            cardDiv.id = `demo-${ i }`;
            cardDiv.appendChild( newVid );
            // cardDiv.appendChild( controlDiv );

            //put div in main-section elem
            document.getElementById( 'videos' ).appendChild( cardDiv );

            this.adjustVideoElemSize();

            i++;

            if ( i == total ) {
                clearInterval( testInterval );
            }
        }, 2000 );
    }
};
