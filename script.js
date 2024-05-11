let currentsong=new Audio;
let folder;
let songs;

async function getsong(folder){
    currfolder=folder;
    let a= await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response=await a.text();
    console.log(response)
    let div=document.createElement("div");
    div.innerHTML=response
    let as =div.getElementsByTagName('a');
    songs=[];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
           songs.push(element.href.split(`/${folder}/`)[1])
        }

        let songul=document.querySelector(".playlist").getElementsByTagName("ul")[0]
    songul.innerHTML=""
    for (const song of songs) {
        songul.innerHTML=songul.innerHTML+`<li>
        <img class="invert" src="music.svg" alt="music">
        <div class="info">
            <div>${song.replaceAll('%20'," ")}</div>
            <div>...</div>
        </div>
        <img class="invert" src="play.svg" alt="">

         </li>`;
        
    }

     // Attach an event listner to each song
     Array.from (document.querySelector(".playlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            // console.log(element.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
            
        })
       
    })

    }
    return songs;
}



function convertSecondsToMinutesAndSeconds(seconds) {
    // Ensure that seconds is within a valid range
    seconds = Math.max(0, Math.floor(seconds));

    // Calculate the number of minutes and remaining seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    // Format the minutes and remaining seconds with leading zeros
    var formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
    var formattedSeconds = (remainingSeconds < 10 ? '0' : '') + remainingSeconds;

    // Return the formatted string
    return formattedMinutes + ':' + formattedSeconds;
}



const playmusic=(track,pause=false)=>{
    // let audio=new Audio("/songs/" + track);
    currentsong.src= `/${currfolder}/` + track;
    if(!pause){
        currentsong.play();
        play.src='pause.svg';
    }
    document.querySelector(".songinfo").innerHTML=(track)
    document.querySelector(".songtime").innerHTML="00:00/0:00";
    
}

    // Add an event listner for hamberger.
    document.querySelector(".hamberg").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })
    // Add an event listner to close 
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"
    })

    // Add an event listner to previous and next
    previous.addEventListener("click",()=>{
        currentsong.pause()
        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playmusic(songs[index-1])
        }
    })
    next.addEventListener("click",()=>{
        currentsong.pause()
        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index+1)< songs.length){
            playmusic(songs[index+1])
        }
        
    })

  

     // function for time update
     currentsong.addEventListener("timeupdate",()=>{
        // console.log(currentsong.currentTime,currentsong.duration)
        document.querySelector(".songtime").innerHTML=`${convertSecondsToMinutesAndSeconds(currentsong.currentTime)}/${convertSecondsToMinutesAndSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100+"%"
    })
    // Add an event listner to seqbar..
    document.querySelector(".seqbar").addEventListener("click",(e)=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width) * 100 
        document.querySelector(".circle").style.left= percent + "%"
        currentsong.currentTime=((currentsong.duration)*percent)/100
        
    })




async function main(){

    songs=await getsong("songs/cs");
    playmusic(songs[0],true);

    var audio=new Audio(songs[0]);
    audio.play();

    // Attach an event lister to play , next and previous.
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play();
            play.src="pause.svg"
        }
        else{
            currentsong.pause();

            play.src='play.svg';
        }
    })


    
    // Load the playlist whenever the card is clicked
    Array.from( document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            songs=await getsong(`songs/${item.currentTarget.dataset.folder}`)
            playmusic(songs[0]);
        })
    })
        


}
main()