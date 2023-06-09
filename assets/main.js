/**
         * 1. Render songs done
         * 2. Scroll top done
         * 3. Play/ pause/ seek done
         * 4. CD rotate done
         * 5. Next/ prev done
         * 6. Random done
         * 7. Next / Repeat when added done
         * 8. Active song done
         * 9. Scroll active song into view done
         * 10. Play song when click done
         */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'NINH_PLAYER';

const player = $('.player'); 
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');

const playBtn = $('.btn-toggle-play');

const progress = $('#progress');
const repeatBtn = $('.btn-repeat');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');

const playList = $('.playlist');



const app = {
   currentIndex: 0,  
   isPlaying: false,
   isRandom: false,
   isRepeat: false,
   config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
   setConfig: function (key, value) {
       this.config[key] = value;
       localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
   },
   
   songs: [
     {
         name: 'Chuyện đôi ta',
         singer: 'Emcee L ft. Muội',
         path: './assets/music/Chuyện Đôi Ta (Freak D Lofi Ver.) - Emcee L ft Muộii.mp3',
         image: './assets/img/chuyen-doi-ta-xin.jpg'
     },
     {
         name: 'Đại diện cho trái tim',
         singer: 'SOUTHALID ft. Mal',
         path: "./assets/music/(Speed up Version) SOUTHALID - 'ĐẠI DIỆN CHO TRÁI TIM' FEAT. MAL.mp3",
         image: './assets/img/dai-dien-cho-trai-tim-xin.jpg'
     },
     {
         name: 'Chỉ cần có em',
         singer: 'Twenty ft. Darki',
         path: './assets/music/CHỈ CẦN CÓ EM - Twenty ft. Darki - OFFICIAL MV LYRICS.mp3',
         image: './assets/img/chi-can-co-em.jpg'
     },
     {
         name: 'Muốn bên anh thật không',
         singer: 'SOUTHALID',
         path: "./assets/music/(Speed Up Version) SOUTHALID - 'Muốn Bên Anh Thật Không'.mp3",
         image: './assets/img/muon-ben-anh-that-khong.jpg'
     },
     {
         name: 'Bộ tộc cùng già',
         singer: 'Thiện Hưng x Entidi x Dũng Đặng',
         path: "./assets/music/Bộ Tộc Cùng Già - Thiện Hưng x Entidi x Dũng Đặng [OFFICIAL MV LYRIC].mp3",
         image: './assets/img/bo-toc-cung-gia.jpg'
     },
     {
         name: 'Cupid',
         singer: 'FIFTY FIFTY',
         path: './assets/music/Cupid - Fifty Fifty (TwinVer.) - Sped Up (Lyrics + Vietsub) ♫.mp3',
         image: './assets/img/cupid-xin.png'
     },
     {
         name: 'Tình yêu bát cơm rang',
         singer: 'Thiện Hưng ft. Cường',
         path: './assets/music/Tình yêu bát cơm rang - Thiện Hưng ft Cường..mp3',
         image: './assets/img/tinh-yeu-bat-com-rang.jpg'
     },
     {
         name: 'Không yêu xin đừng nói',
         singer: 'UMIE',
         path: './assets/music/(Piano Ver.) Không Yêu Xin Đừng Nói - UMIE (Prod. ToneRx).mp3',
         image: './assets/img/khong-yeu-xin-dung-noi-xin.jpg'
     },
     {
         name: 'Old Love',
         singer: 'Yuji',
         path: './assets/music/Old Love - Yuji - Putri Dahlia (Official Lyrics Video).mp3',
         image: './assets/img/old-love.jpg'
     },
     {
         name: 'Night Dancer',
         singer: 'imase',
         path: './assets/music/NIGHT DANCER.mp3',
         image: './assets/img/night-dancer-xin.jpg'
     }

 
 
   ],

   
   render: function() {
     const html = this.songs.map( (song, index) => {
         return `
           <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
             <div class="thumb" style="background-image: url('${song.image}')">
             </div>
             <div class="body">
               <h3 class="title">${song.name}</h3>
               <p class="author">${song.singer}</p>
             </div>
             <div class="option">
               <i class="fas fa-ellipsis-h"></i>
             </div>
           </div>
         `
     })
     playList.innerHTML = html.join('');
   },

   defineProperties: function() {
       Object.defineProperty(this, 'currentSong', {
         get: function() {
             return this.songs[this.currentIndex];
         }
       });
   },

   handleEvent: function() {
       const _this = this;
       const cdWiddth = cd.offsetWidth;

       //Xử lý CD quay / dừng
       const cdThumbAnimate = cdThumb.animate([
         { transform: 'rotate(360deg)'}
       ], {
           duration: 10000, //10s
           iterations: Infinity
       });
       cdThumbAnimate.pause();

       //Xu ly phong to / thu nho CD
       document.onscroll = function() {
           const scrollTop = window.scrollY || document.documentElement.scrollTop;
           const newCDWidth = cdWiddth - scrollTop;

           cd.style.width = newCDWidth > 0 ? newCDWidth + 'px' : 0;
           cd.style.opacity = newCDWidth / cdWiddth;

       }

       //Xử lý khi click play
       playBtn.onclick = function() {
           if (_this.isPlaying) {
               audio.pause();
           } else {                 
               audio.play();                       
           }               
       }
       
       //Khi song được play
       audio.onplay = function() {
           _this.isPlaying = true;
           player.classList.add('playing');
           cdThumbAnimate.play();
       }

       //Khi song được pause
       audio.onpause = function() {
           _this.isPlaying = false;
           player.classList.remove('playing');
           cdThumbAnimate.pause();
       }

       // Khi tiến độ bài hát thay đổi
       audio.ontimeupdate = function() {
         if (audio.duration) {
             const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
             progress.value = progressPercent;
         }
           
       }

       // Xử lý khi tua song
       progress.onchange = function(e) {
           const seekTime = audio.duration / 100 * e.target.value;
           audio.currentTime = seekTime;
       }

       // Khi next song 
       nextBtn.onclick = function() {
           if (_this.isRandom) {
               _this.playRandomSong();
           } else {
               _this.nextSong();
           }
           audio.play();
           _this.render();
           _this.scrollToActiveSong();
       }

       // Khi prev song 
       prevBtn.onclick = function() {
           if (_this.isRandom) {
               _this.playRandomSong();
           } else {
               _this.prevSong();
           }
           audio.play();
           _this.render();
           _this.scrollToActiveSong();

       }

       // Xu ly bat / tat randdom song
       randomBtn.onclick = function(e) { 
             _this.isRandom = !_this.isRandom;
             _this.setConfig('isRandom', _this.isRandom);
             randomBtn.classList.toggle("active", _this.isRandom);
           
         }

         // Khi phát lại song
         repeatBtn.onclick = function(e) { 
             _this.isRepeat = !_this.isRepeat;
             _this.setConfig('isRepeat', _this.isRepeat);
             repeatBtn.classList.toggle("active", _this.isRepeat);
         }

         
         // Xu ly nextsong khi song ended
         audio.onended = function () {
           if (_this.isRepeat) {
               audio.play();
           } else {
               nextBtn.click();
           }   
         }
         
         // Lang nghe hanh vi click vao playlist  
         playList.onclick = function (e) {
           const songNode = e.target.closest('.song:not(.active)');
           const songOption = e.target.closest('.option');
           if (songNode || songOption) { 
           
             // Xu ly khi click vao song
             if (songNode) {
                 _this.currentIndex = Number(songNode.dataset.index);
                 _this.loadCurrentSong();
                 _this.render();
                 audio.play();
             }
             // Xu ly khi click vao option  
             if (songOption) {

             }
           }
                 
             
         }

         
   },

   scrollToActiveSong: function () {
       setTimeout(() => {
           $('.song.active').scrollIntoView({
               behavior: 'smooth',
               block: 'end',
               inline: 'nearest'
           });
       }
       , 100);
   },

   loadCurrentSong: function() {
     

       heading.textContent = this.currentSong.name;
       cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
       audio.src = this.currentSong.path;

       console.log(heading, cdThumb, audio);
   },

   loadConfig: function () {
       this.isRandom = this.config.isRandom;
       this.isRepeat = this.config.isRepeat;

   },

   nextSong: function() {
     this.currentIndex++;
     if (this.currentIndex >= this.songs.length) { 
         this.currentIndex = 0;
     }
     this.loadCurrentSong();
     
   },

   prevSong: function() {
     this.currentIndex--;
     if (this.currentIndex < 0) { 
         this.currentIndex = this.songs.length - 1;
     }
     this.loadCurrentSong();
   },

   playRandomSong: function() {
       let newIndex;
       do {
           newIndex = Math.floor(Math.random() * this.songs.length);
       } while (newIndex === this.currentIndex);

       this.currentIndex = newIndex;
     this.loadCurrentSong();
   },

 
   start: function() {
       //Gan cau hinh tu config vao ung dung
       this.loadConfig();

       //Định nghĩa các thuộc tính cho object
       this.defineProperties();

       //Lắng nghe và sử lý các sự kiện
       this.handleEvent();

       //Tải thông tin bài hát đầu tiên trong UI khi chạy ứng dụng
       this.loadCurrentSong();
       
       //Render playlist
       this.render()

       // Hien thi trang thai ban dau cua button repeat & random
       // randomBtn.classList.toggle("active", this.isRandom);
       // repeatBtn.classList.toggle("active", this.isRepeat);

   }
   
}

app.start();