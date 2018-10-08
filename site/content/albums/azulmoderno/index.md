+++
draft = false
Title = "AZUL MODERNO"
subtitle = "Entre as estrelas em volta de Andrômeda"
description = "Clipe de Azul Moderno, música que da título ao álbum \"Azul Moderno\" de Luiza Lian."

layout = "azul"
info_enabled = true

# Videoclip and full album embed
video = "https://www.youtube.com/watch?v=sH4gJp_Y4_M"
album_embed = '<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=3413521932/size=large/bgcol=ffffff/linkcol=0687f5/artwork=none/track=2818734274/transparent=true/" seamless></iframe>'

buy_link  = "https://lianluiza.bandcamp.com/"
analytics_id = "UA-960953172"

# Social plataforms
[album]
  [album.platforms]
    spotify = "luizalian"
    youtube = "playlist?list=PLm8ISRwZVCAOxav1tHjRT_Z-vWQBLBuWM"
    spotify = "album/3ocMFmdWIfjrfNdHVFQ41I"

[[resources]]
  name = "favicon"
  src = "images/favicon.jpg"

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

+++


<div class="theater">
<!--
    <div id="screen" class="screen hidden">
        <div id="videoclip"></div>
    </div>
    <div id="poster" class="spotlight">
        <video autoplay playsinline muted loop preload
        onloadeddata="document.dispatchEvent(new Event('posterPreloaded'))"  poster='{{% resource_path path="text_poster" %}}'>
            <source src='{{% resource_path path="text_movie" %}}'/>
	      </video>
        <a href="#play" class="logo">{{ .Title }}</a>
    </div>
-->
</div>