+++
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
subtitle = ""
description = ""

poster_enabled = true
poster_masked = true
info_enabled = true

# Videoclip and full album embed
video = "https://www.youtube.com/watch?v=sH4gJp_Y4_M"
album_embed = '<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=3413521932/size=large/bgcol=ffffff/linkcol=0687f5/artwork=none/track=2818734274/transparent=true/" seamless></iframe>'

# Social plataforms
[album]
  [album.platforms]
    soundcloud = "luizalian"
    youtube = "playlist?list=PLm8ISRwZVCAOxav1tHjRT_Z-vWQBLBuWM"
    spotify = "album/3ocMFmdWIfjrfNdHVFQ41I"

# Colors
[colors]
  foreground =  "#fff"
  background =  "#000"

# Images
[[resources]]
  name = "logo"
  src = "images/logo.png"

[[resources]]
  name = "text_poster"
  src = "images/poster3.jpg"

[[resources]]
  name = "text_movie"
  src = "images/fundo_cropped.mp4"

[[resources]]
  name = "info_fundo"
  src = "images/AZMO-SINGLE_low.jpg"

[[resources]]
  name = "album_cover"
  src = "images/Album_Cover.jpg"

---