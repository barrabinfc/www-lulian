// typewriter plugin
var typewriter = require('typewriter')

// Array.from equivalent
var ArrayFrom = function( str ){
	let x = [];
	for(var i=0;i<str.length;i++){ x[i] = str[i] }
	return x;
}

// retry calling fun.call(T, args)
// after `delay` miliseconds if fun failed
var retry = function( fun , T, args, delay , maxRetry){
	if(maxRetry == undefined) maxRetry = 3
	if(delay == undefined) delay = 500

	var callit = function(delei, stack){
		if(stack >= maxRetry){
			console.error("Retry " + fun + " failed more than  " + maxRetry + " times.")
			console.trace();
			return false;
		}

		var retval = undefined
		try {
			retval = fun.call(T,args)
		} catch (e) {
			setTimeout( function(){
				callit(delei*1.5, stack+1)
			}, delay );
		}

		return retval;
	}
	callit(delay, 0)
}

// Luiza Lian Player
var LuiPlayer = function( container ){
	this.container =  document.querySelector(container)
	this.sc_el 		 =  this.container.querySelector('#sc-embed > iframe');

  this.prev_btn  =  this.container.querySelector('#prev-btn');
	this.play_btn  =  this.container.querySelector('#play-btn');
  this.next_btn  =  this.container.querySelector('#next-btn');

	this.description 		 =  this.container.querySelector('.description > pre');
	this.tracknameLink 	 =  this.container.querySelector('#trackname');
	this.tracknameEl 		 =  this.tracknameLink.querySelector('pre')

	// typewriter effect
	var desc_tw 	 = typewriter(this.description).withAccuracy(100)
									 .withMinimumSpeed(12).withMaximumSpeed(20).build()
	var song_tw 	 = typewriter(this.tracknameEl).withAccuracy(99)
									 .withMinimumSpeed(8).withMaximumSpeed(15).build()


  /* Start player */
	this.run = function(){
		this._songPlayAlreadyCalled = false;
    this._songIndex = -1;

    // typewriter
		desc_tw.type('Aperte_\no_play\ne_\nnavegue');
    setTimeout(function(){
      this.changeMaterialPlayerIcons({'#play-btn': 1},['transparent','opaque'])
    }.bind(this), 1300 );

		this.SCAPI = SC.Widget(this.sc_el);
		this.SCAPI.bind( SC.Widget.Events.PLAY , 		this.onSongPlay.bind(this) )
		this.SCAPI.bind( SC.Widget.Events.PAUSE , 	this.onSongPause.bind(this) )
		this.SCAPI.bind( SC.Widget.Events.FINISH,   this.onSongFinish.bind(this) )

    // prev/Play/next button
    var clickOrTouch = ((document.ontouchstart==null) ? 'click' : 'touchstart');
    this.play_btn.addEventListener(clickOrTouch, function(ev){
      ev.preventDefault(); ev.stopPropagation();
      this.toggle();
    }.bind(this) );

    this.prev_btn.addEventListener(clickOrTouch, function(ev){
      ev.preventDefault(); ev.stopPropagation();
      this.prev();
    }.bind(this))

    this.next_btn.addEventListener(clickOrTouch, function(ev){
      ev.preventDefault(); ev.stopPropagation();
      this.next();
    }.bind(this))

	}


	this.toggle = function(){
		this.SCAPI.toggle();
		this.SCAPI.isPaused( this.togglePlayBtn.bind(this) );
	}
  this.prev = function(){ this.SCAPI.prev(); }
  this.next = function(){ this.SCAPI.next(); }


	this.onSongPlay = function( playhead ){
		if(this._songPlayAlreadyCalled) return
		else {
			this.onSongChange()
			this._songPlayAlreadyCalled = true;
		}
	}
	this.onSongFinish = function( playhead ){
		this._songPlayAlreadyCalled = false;
	}
	this.onSongPause = function( ){
		this._songPlayAlreadyCalled = false;
		//this.showSongName('')
	}

	// only interested on song change from one to another
	this.onSongChange = function( ){

    // show/hide next/previous buttons
    this.SCAPI.getCurrentSoundIndex( function(song_index) {
      this._songIndex = song_index;

      var playerState = {'#prev-btn': 0, '#next-btn': 1}
      if(this._songIndex > 0) playerState['#prev-btn'] = 1

      this.changeMaterialPlayerIcons(playerState)
    }.bind(this));

    // change song name
		this.SCAPI.getCurrentSound( function(song_info){
			var styledSongName = this.styleText( song_info.title );

			this.showSongName( styledSongName, song_info.permalink_url );
		}.bind(this) );
	}

	/* Show the name of the track playing */
	this.showSongName = function( song_name , song_uri){
		if(song_uri == undefined) song_uri = 'https://soundcloud.com/luizalian/'
		this.tracknameLink.setAttribute('href', song_uri);

		// hack to delete old song by issuing \b chars
		var old_songname = this.tracknameEl.innerHTML
		var delword = ArrayFrom(old_songname).map( function(c){ return '\b'; }).join('')

		song_tw.type(delword).waitRange(300,500).type( song_name );
	}


  /* toggle multiple icons material
   * eg: this.toggleMaterialPlayerIcons(
   *  {'#play-btn': 0, '#prev-btn': 1, '#next-btn': 0},
   * )
   * -->
   * #play-btn = opaque, #prev-btn = transparent, ....
   */
  var _materials = ['transparent','opaque']
  this.changeMaterialPlayerIcons = function( icons , material){
    if(material == undefined) material = _materials;

    for(var iconId in icons){
      var matIndex      = icons[iconId]
      var newMaterial   = material[matIndex]

      var iconEl = this.container.querySelector(iconId)
      var baseClass = iconEl.className.replace(material[0],'').replace(material[1],'').trim()

      iconEl.classList = baseClass + " " + newMaterial
    }
  }

  var _play_icons 		 = ["play_circle_outline","pause_circle_outline"]
  this.togglePlayBtn = function(is_paused, icons){
    if(icons == undefined) icons = _play_icons;

		// toggle play/pause icons
		var icon = (is_paused ? icons[0] : icons[1] )
		this.play_btn.innerHTML = icon;
	}


	/* Change song name to match design style
	 * songFormat: 01. Tempo Mãe
	 *
	 * Remove Track Number (01.)
	 * put each word in its own line (\n)
	 * first word have a _ prefix
	 * last word doesnt have any _
	 * other words prepend/append _ (or dont, 20% of chance)
	 */
	this.styleText = function(song_name){
		var t = song_name.split('.');
		// not correctly formatted special case, just ignore
		if(t.length < 1) return song_name;

		var track_number = t[0],
				track_name 	 = t[1].trim();

		// separate each word, handle song name as a single word
		var words = track_name.split(' ');
		var firstW = '_' + words[0],
				middleW = words.slice(1, words.length-1),
				lastW = (words.length > 1 ? words[words.length-1] : '' );

		// transform middle words.
		// Sometimes (20%) don't change the word at all
		// other times:
		//  if second word, always append '_'
		//  otherwise prepend or append '_' to it, alternatively
		let middleWStyled = middleW.map( function(w,i){
			var dice = (Math.random() <= 0.2);
			return (dice ? w :
              (i == 0 ? w+'_' :
							(['_'+w, w+'_'][i%2])));
		})

		// concat everything with break-lines in each word
		return [firstW].concat(middleWStyled).concat([lastW]).join('\n');
	}

	return this;
}
