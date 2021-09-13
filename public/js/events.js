import helpers from './helpers.js';

window.addEventListener( 'load', () => {


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
