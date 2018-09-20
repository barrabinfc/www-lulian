+++
draft = false
Title = "AZUL MODERNO"
subtitle = "AZUL MODERNO"
layout = "azul"

video = "https://www.youtube.com/watch?v=sH4gJp_Y4_M"
youtubeID = "sH4gJp_Y4_M"

buy_link  = "https://lianluiza.bandcamp.com/"

[[resources]]
  name = "fundo"
  src = "images/fundo.png"

[[resources]]
  name = "info_fundo"
  src = "images/AZMO-SINGLE.jpg"

[[resources]]
  name = "album_cover"
  src = "images/Album_Cover.png"

[[resources]]
  name = "logo"
  src = "images/logo_trans_white.png"

[[resources]]
  name = "text_poster"
  src = "images/poster7.jpg"

[[resources]]
  name = "text_movie"
  src = "images/fundo_cropped.mp4"

[[resources]]
  name = "text_fundo"
  src = "images/fundo.png"

[[resources]]
  name = "video_poster"
  src = "images/fundo.png"

[[resources]]
  name = "video_clipe"
  src = "images/AZUL MODERNO_baixa.mp4"

[[resources]]
  name = "seta_icon"
  src = "images/seta.svg"

[[resources]]
  name = "players_icon"
  src = "images/players.svg"

[[resources]]
  name = "soundcloud_icon"
  src = "images/sc_icon.svg"

[[resources]]
  name = "youtube_icon"
  src = "images/yt_icon.svg"

[[resources]]
  name = "spotify_icon"
  src = "images/spot_icon.svg"


+++


<div class="theater">
    <div id="screen" class="screen hidden">
        <div id="videoclip"></div>
        <!--
        <iframe id="videoclip" src="https://www.youtube.com/embed/ii63fKLTSuU?enablejsapi=1&autoplay=0&color=white&controls=2&modestbranding=1&playsinline=0&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        <video id="videoclip" preload  poster='{{% resource_path path="video_poster" %}}'>
            <source src='{{% resource_path path="video_clipe" %}}' />
	      </video>
        -->
    </div>
    <div id="poster" class="spotlight">
        <video autoplay playsinline muted loop preload
        onloadeddata="document.dispatchEvent(new Event('posterPreloaded'))"  poster='{{% resource_path path="text_poster" %}}'>
            <source src='{{% resource_path path="text_movie" %}}'/>
	      </video>
        <a href="#play" class="logo">AZUL<br/>moderno</a>
    </div>
    <div id="info" class="info" style='background-image: url({{% resource_path path="info_fundo" %}});'>
      <section id="left">
        <picture class="cover" data-tilt data-tilt-max="10" data-tilt-speed="800" data-tilt-scale="1.025" data-tilt-glare data-tilt-max-glare="0.5">
          <source media="(min-width: 768px)" srcset='{{% resource_path path="album_cover" %}}' />
          <img src='{{% resource_path path="album_cover" %}}' alt="Azul Moderno Cover"/>
        </picture>
        <div class="other">
          <div class="players_links">
            <a href="https://soundcloud.com/luizalian/sets/azul-moderno/s-MDVTV" class="player-icon sc-icon" alt="Soundcloud">Soundcloud</a>
            <a href="https://soundcloud.com/luizalian/sets/azul-moderno/s-MDVTV" class="player-icon yt-icon" alt="Youtube">Youtube</a>
            <a href="https://soundcloud.com/luizalian/sets/azul-moderno/s-MDVTV" class="player-icon spot-icon" alt="Spotify">Spotify</a>
          </div>
          <!--
            <button class="buy_link"><a href="">COMPRAR</a></button>
          -->
        </div>
      </section>
      <section id="right">
        <div class="title">
          <h1>Azul MODERNO</h1>
          <h3>Entre as estrelas em volta de andrômeda</h3>
          <p>
          Nam ut lobortis massa, sed ultrices erat. Donec id placerat enim, ut tempor tellus. Sed auctor mauris id cursus pulvinar. Phasellus massa purus, laoreet sed porttitor in, finibus ut metus. In urna diam, cursus ut suscipit eget.
          </p>
        </div>
        <div class="content">
          <a href="#" class="song-item is-playing">
            <span class="song-name">Azul Moderno</span>
            <span class="song-length">3:12</span>
          </a>
          <a href="#" class="song-item">
            <span class="song-name">Sketches of spain</span>
            <span class="song-length">3:12</span>
          </a>
          <a href="#" class="song-item">
            <span class="song-name">Azul Moderno 3</span>
            <span class="song-length">3:12</span>
          </a>
          <a href="#" class="song-item">
            <span class="song-name">Azul Moderno 4</span>
            <span class="song-length">3:12</span>
          </a>
          <a href="#" class="song-item">
            <span class="song-name">Azul Moderno 4</span>
            <span class="song-length">3:12</span>
          </a>
          <a href="#" class="song-item">
            <span class="song-name">Azul Moderno 4</span>
            <span class="song-length">3:12</span>
          </a>
          <a href="#" class="song-item">
            <span class="song-name">Azul Moderno 4</span>
            <span class="song-length">3:12</span>
          </a>
          <a href="#" class="song-item">
            <span class="song-name">Azul Moderno 8</span>
            <span class="song-length">3:12</span>
          </a>
        </div>
      </section>
    </div>
</div>