if(window.location.pathname=='/')
{
    //auto type animation
    var typed=new Typed(".typing",{
        strings:['your favourite songs for free.'],
        typeSpeed:100,
        backSpeed:60,
        loop:true
    });

    var myAnimation = new hoverEffect({
        parent: document.querySelector('.hearphone'),
        intensity: 0.2,
        image1: '../images/hearphone2.png',
        image2: '../images/hearphone.png',
        displacementImage: '../images/heightMap.png'
    });
}


let password=document.getElementById('password');
let toggle=document.getElementById('toggle');
function showHide()
{
    if(password.type === 'password')
    {
        password.setAttribute('type','text');
        toggle.classList.add('hide');
    }
    else
    {
        password.setAttribute('type','password');
        toggle.classList.remove('hide');
    }
}

// hamburger...
// const menuBtn=document.querySelector('.menu-btn');
// let menuOpen=false;
// menuBtn.addEventListener('click',function()
// {
//     if(!menuOpen)
//     {
    //         menuBtn.classList.add('open');
//         menuOpen=true;
//     }
//     else
//     {
//         menuBtn.classList.remove('open');
//         menuOpen=false;
//     }

// });


//music functionality
if(window.location.pathname=='/dashboard')
{
document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState=="visible")
    {
        playMusic();
    }
    else
    {
        pauseMusic();
    }
})

// music card sidebar functionality
let options=document.querySelector('.options');
function sidebar()
{
    options.classList.toggle('anime');
}

const playBtn=document.getElementById('playBtn');
const previousBtn=document.getElementById('previousBtn');
const nextBtn=document.getElementById('nextBtn');
const data=document.getElementById('data');
let allSongs=JSON.parse(data.dataset.musicdata);
let songimg=document.getElementById('songimg');
const song=document.getElementById('song');
const singer=document.getElementById('singer');
let audio=document.createElement('audio');
let volumeoff=document.getElementById('volumeoff');
let repeat=document.getElementById('repeat');
let updateTime=document.getElementById('updateTime');
let totalTime=document.getElementById('totalTime');
let seekslider=document.getElementById('seekslider');
let isplaying=false;
let index_no=0;
function loadAudio(index_no){
    audio.src='/audio/'+allSongs[index_no].musicpath;
    song.innerHTML=allSongs[index_no].musicname;
    singer.innerHTML=allSongs[index_no].musicartist;
    songimg.src='/images/'+allSongs[index_no].musicimg;
    audio.load();
}
loadAudio(index_no);


//checking whether the music is playing or not
playBtn.addEventListener('click',()=>{
    isplaying ? pauseMusic() : playMusic()
});

//play music...
const playMusic=()=>{
    audio.play();
    audio.volume=1;
    songimg.classList.add('imgRotation');
    playBtn.classList.replace('bx-play','bx-pause');
    isplaying=true;
};

//pause music
const pauseMusic=()=>{
    audio.pause();
    songimg.classList.remove('imgRotation');
    playBtn.classList.replace('bx-pause','bx-play');
    isplaying=false;
};

//nextsong
nextBtn.addEventListener('click',()=>{
    if(index_no < allSongs.length-1)
    {
        index_no+=1;
        loadAudio(index_no);
        playMusic();
    }
    else
    {
        index_no=0;
        loadAudio(index_no);
        playMusic();
    }
});

//previous song
previousBtn.addEventListener('click',()=>{
    if(index_no > 0)
    {
        index_no -= 1;
        loadAudio(index_no);
        playMusic();
    }
    else
    {
        index_no=allSongs.length-1;
        loadAudio(index_no);
        playMusic();
    }
}); 

//mute audio
function mute()
{
    if(audio.muted)
    {
        audio.muted=false;
        volumeoff.classList.remove('activeNow');

    }
    else
    {
        audio.muted=true;
        volumeoff.classList.add('activeNow');
    } 
}

//loop audio
function loop()
{
    if(audio.loop)
    {
        audio.loop=false;
        repeat.classList.remove('activeNow');

    }
    else
    {
        audio.loop=true;
        repeat.classList.add('activeNow');
    } 
}

//random song
let getRandomNumber=(min,max)=>{
    let step1=max-min+1;
    let step2=Math.random()*step1;
    let result=Math.floor(step2);
    return result;
}
function random(){
    let random_index=getRandomNumber(0,allSongs.length-1);
    loadAudio(random_index);
    audio.play();
}

//switch track
audio.addEventListener('ended',function(){
    if(index_no === (allSongs.length-1))
    {
        index_no=0
        loadAudio(index_no);
        audio.play();
    }
    else
    {
        index_no+=1;
        loadAudio(index_no);
        audio.play();
    }

  });

  audio.addEventListener('timeupdate',(event)=>
  {

    let {currentTime,duration} = event.srcElement;
    if(duration)
    {
        let position=(currentTime/duration)*100;
        seekslider.value=position;
        let min_duration=Math.floor(duration/60);
        let sec_duration=Math.floor(duration%60);
        let min_currentTime=Math.floor(currentTime/60);
        let sec_currentTime=Math.floor(currentTime%60);
        if(sec_currentTime < 10)
        {
            sec_currentTime=`0${sec_currentTime}`
        }
        totalTime.innerHTML=`${min_duration}:${sec_duration}`;
        updateTime.innerHTML=`${min_currentTime}:${sec_currentTime}`;
    }
    else
    {
        totalTime.innerHTML=`0:00`;
        updateTime.innerHTML=`0:00`;
    }
});
seekslider.addEventListener('click',(event)=>{
    let {duration} = audio;
    
    let seekto=(event.offsetX/event.srcElement.offsetWidth)*duration;
    audio.currentTime=seekto;
});

}


if(window.location.pathname =='/upload')
{
    document.addEventListener('play', function(e){
        var audios = document.getElementsByTagName('audio');
        for(var i = 0, len = audios.length; i < len;i++){
            if(audios[i] != e.target){
                audios[i].pause();
            }
        }
    }, true);

    $(document).ready(function(){
        $("#errorMessage").delay(3000).slideUp(300);
    });
}

if (window.location.pathname == '/login')
{
    $(document).ready(function(){
        $("#errorMessage").delay(3000).slideUp(300);
    });
}

if (window.location.pathname == '/register')
{
    $(document).ready(function(){
        $("#errorMessage").delay(3000).slideUp(300);
    });
    
}


if(window.location.pathname =='/mymusic')
{
    document.addEventListener('play', function(e){
        var audios = document.getElementsByTagName('audio');
        for(var i = 0, len = audios.length; i < len;i++){
            if(audios[i] != e.target){
                audios[i].pause();
            }
        }
    }, true);
}





