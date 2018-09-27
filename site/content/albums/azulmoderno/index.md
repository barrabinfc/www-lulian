+++
draft = false
Title = "AZUL MODERNO"
subtitle = "Entre as estrelas em volta de andrômeda"
description = "Clipe de Azul Moderno, música que da título ao álbum \"Azul Moderno\" de Luiza Lian."

layout = "azul"

info_enabled = true
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
  src = "images/Album_Cover.jpg"

[[resources]]
  name = "logo"
  src = "images/logo.png"

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
            <a href="https://soundcloud.com/luizalian" class="player-icon sc-icon" alt="Soundcloud" target="_blank">Soundcloud</a>
            <a href="https://www.youtube.com/playlist?list=PLm8ISRwZVCAOxav1tHjRT_Z-vWQBLBuWM" class="player-icon yt-icon" alt="Youtube" target="_blank">Youtube</a>
            <a href="https://open.spotify.com/album/3ocMFmdWIfjrfNdHVFQ41I" class="player-icon spot-icon" alt="Spotify" target="_blank">Spotify</a>
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
          Clipe de Azul Moderno, música que da título ao álbum "Azul Moderno" de Luiza Lian.
          </p>
        </div>
        <div class="content">
          <a href="https://www.youtube.com/watch?v=sH4gJp_Y4_M" class="song-item is-playing">
            <span class="song-name">Azul Moderno</span>
            <span class="song-length">3:55</span>
          </a>
          <a href="https://soundcloud.com/luizalian/" class="song-item blurred">
            <span class="song-name">Vem Dizer Tchau</span>
            <span class="song-length">4:00</span>
          </a>
          <a href="#" class="song-item ">
            <span class="song-name">Mil Mulheres</span>
            <span class="song-length">3:45</span>
          </a>
          <a href="#" class="song-item ">
            <span class="song-name">Sou Yaba</span>
            <span class="song-length">3:00</span>
          </a>
          <a href="#" class="song-item ">
            <span class="song-name">Mira</span>
            <span class="song-length">4:01</span>
          </a>
          <a href="#" class="song-item ">
            <span class="song-name">Larinhas</span>
            <span class="song-length">3:28</span>
          </a>
          <a href="#" class="song-item ">
            <span class="song-name">Pomba Gira do Luar</span>
            <span class="song-length">4:26</span>
          </a>
          <a href="#" class="song-item ">
            <span class="song-name">Geladeira</span>
            <span class="song-length">3:24</span>
          </a>
          <a href="#" class="song-item ">
            <span class="song-name">Notícias do Japão</span>
            <span class="song-length">2:54</span>
          </a>
          <a href="#" class="song-item ">
            <span class="song-name">Santa Bárbara</span>
            <span class="song-length">3:01</span>
          </a>
        </div>
      </section>
    </div>
</div>