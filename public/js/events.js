import helpers from './helpers.js';
// import rtc from './rtc';

window.addEventListener( 'load', () => {

    let chatElem = document.querySelector( '#chat-pane' );
        let mainSecElem = document.querySelector( '#main-section' );
        if ( chatElem.classList.contains( 'chat-opened' ) ) {
            chatElem.setAttribute( 'hidden', true );
            mainSecElem.classList.remove( 'col-md-9' );
            mainSecElem.classList.add( 'col-md-12' );
            chatElem.classList.remove( 'chat-opened' );
        }
        else {
            chatElem.attributes.removeNamedItem( 'hidden' );
            mainSecElem.classList.remove( 'col-md-12' );
            mainSecElem.classList.add( 'col-md-9' );
            chatElem.classList.add( 'chat-opened' );
        }
        //remove the 'New' badge on chat icon (if any) once chat is opened.
        setTimeout( () => {
            if ( document.querySelector( '#chat-pane' ).classList.contains( 'chat-opened' ) ) {
                helpers.toggleChatNotificationBadge();
            }
        }, 300 );
   
        // console.log("responseUserData",responseUserData);
    let roomName = "hospital";
    let yourName = "ibrahim";

    if ( roomName && yourName ) {
       

        //save the user's name in sessionStorage
        sessionStorage.setItem( 'username', yourName );

        //create room link
        let roomLink = `${ location.origin }?room=${ roomName}_1`;

        document.getElementById("create-room").innerHTML = `<a href='${ roomLink }'>start chat</a>`
        
    }
   

    //When the 'Enter room' button is clicked.
    document.getElementById( 'enter-room' ).addEventListener( 'click', ( e ) => {
        e.preventDefault();

        let name = "mariam";

        if ( name ) {
         
            //save the user's name in sessionStorage
            sessionStorage.setItem( 'username', name );

            //reload room
            location.reload();
        }

     
    } );


   
} );
