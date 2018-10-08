!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var i in n)("object"==typeof exports?exports:e)[i]=n[i]}}(window,function(){return function(e){var t={};function n(i){if(t[i])return t[i].exports;var r=t[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(i,r,function(t){return e[t]}.bind(null,r));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/js",n(n.s=0)}([function(e,t,n){e.exports=n(1)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),r=a(n(2)),o=a(n(3)),s=n(4);function a(e){return e&&e.__esModule?e:{default:e}}var l={BLANK:"BLANK",INTRO:"INTRO",CLIP:"CLIP",CREDITS:"CREDITS"},u=new s.Cronometer;u.tap("SCRIPT_PARSING");var c=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:window.document;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.ctx=t,this.$vars=(0,s.CSSVariables)(this.ctx.body,getComputedStyle(this.ctx.documentElement)),this.dom={style:this.ctx.body.style,logo:this.ctx.querySelector("a.logo"),poster:this.ctx.getElementById("poster"),poster_video:this.ctx.querySelector("#poster > video"),screen:this.ctx.getElementById("screen"),clip:this.ctx.querySelector("#screen > #videoclip")},this.listeners={},this.stages=new o.default(l.BLANK),this.init()}return i(e,[{key:"init",value:function(){this.setupStepTransitions(),this.listeners.page=new s.listen(document),this.listeners.page.when("visibilitychange",!1).do(this.visibility_change.bind(this)),this.listeners.logo=new s.listen(this.dom.logo),this.listeners.screen=new s.listen(this.dom.screen),this.listeners.poster=new s.listen(this.dom.poster_video),this.listeners.poster.when("loadeddata").do(this.poster_loaded.bind(this)),u.tap("APP_READY"),setTimeout(function(){u.debug()},5e3)}},{key:"loadClip",value:function(e){var t=this;u.tap("YOUTUBE_READY");var n="";try{n=e.match(/\?v=(.*)/)[1],console.log("Loading youtube: ",n)}catch(t){throw new Error("Invalid youtube video...",e)}this.player=new r.default(this.dom.clip,n),this.player.play=(0,s.spy)([this.player.play,this.player],u.tap.bind(u,"PLAYER_PLAY")),this.player.pause=(0,s.spy)([this.player.pause,this.player],u.tap.bind(u,"PLAYER_PAUSE")),this.player.ready=function(e){console.log("videoclip ready..."),u.tap("VIDEOCLIP_READY"),t.player.play()},this.listeners.clip=new s.listen(this.dom.clip),this.listeners.clip.when("loadstart").do(this.clip_loadstart.bind(this)),this.listeners.clip.when("loadedmetadata").do(this.clip_loadedmtdt.bind(this)),this.listeners.clip.when("loadeddata").do(this.clip_loaded.bind(this))}},{key:"setupStepTransitions",value:function(){this.stages.addStep(l.INTRO).enter(this[l.INTRO+":enter"].bind(this)).exit(this[l.INTRO+":exit"].bind(this)),this.stages.addStep(l.CLIP).enter(this[l.CLIP+":enter"].bind(this)).exit(this[l.CLIP+":exit"].bind(this))}},{key:l.INTRO+":enter",value:function(e,t){var n=this;return new Promise(function(e,t){n.dom.poster.style["animation-play-state"]="running",document.body.style["overflow-y"]="hidden",setTimeout(function(){n.dom.logo.classList.add("interactive"),n.listeners.logo.when("click").do(n.poster_click.bind(n)),u.tap("CHANGE_STAGE",l.INTRO),e()},n.$vars["--intro-time"])})}},{key:l.INTRO+":exit",value:function(e,t){var n=this;return new Promise(function(e,t){n.dom.poster.style["animation-name"]="focusOut",n.listeners.logo.mute("click"),setTimeout(e,n.$vars["--intro-time"])})}},{key:l.CLIP+":enter",value:function(e,t){var n=this;return new Promise(function(e,t){document.body.style["overflow-y"]="auto",n.dom.poster.classList.add("hidden"),n.dom.screen.classList.remove("hidden"),n.dom.screen.classList.add("visible"),n.listeners.screen.when("click").do(n.screen_click.bind(n)),u.tap("CHANGE_STAGE",l.CLIP),n.player.play(),e()})}},{key:l.CLIP+":exit",value:function(e,t){var n=this;return new Promise(function(e,t){n.player.pause()})}},{key:"visibility_change",value:function(e){u.tap("PAGE_VISIBILITY",document.visibilityState)}},{key:"clip_loadstart",value:function(e){u.tap("CLIP_LOAD")}},{key:"clip_loadedmtdt",value:function(e){u.tap("CLIP_LOADED_MTDT")}},{key:"clip_loaded",value:function(e){u.tap("CLIP_LOADED")}},{key:"poster_loaded",value:function(e){u.tap("POSTER_LOADED"),this.stages.to(l.INTRO).then(function(){console.info("*** BG PRELOADED ***")})}},{key:"poster_click",value:function(e){e.preventDefault(),e.stopPropagation(),this.stages.to(l.CLIP)}},{key:"screen_click",value:function(e){this.player.toggle()}}]),e}();e.exports={CSSVariables:s.CSSVariables,Azul:c,AzulStages:l,cronometer:u},t.default=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();var r=function(){function e(t,n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.playing=!1,this.clip=t,this.player=new YT.Player(t,{videoId:n,events:{onReady:this.ready},playerVars:{origin:"luizalian.com.br",rel:0,playsinline:0,modestbranding:1}})}return i(e,[{key:"play",value:function(){this.player.playVideo(),this.playing=!0}},{key:"pause",value:function(){this.player.stopVideo(),this.playing=!1}},{key:"toggle",value:function(){this.playing?this.pause():this.play()}},{key:"ready",value:function(){}}]),e}();t.default=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();var r=function(){return Promise.resolve()},o=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.step=t,this.steps=[],this.enterFns=[],this.exitFns=[]}return i(e,[{key:"to",value:function(e){var t=this;return new Promise(function(n,i){var o=t.steps.indexOf(e),s=t.steps.indexOf(t.step),a=t.exitFns[s]||r,l=t.enterFns[o]||r;a(t.step,t.nextStep).catch(i).then(function(){return console.info("Step:",t.step+" -> "+e),t.previousStep=t.steps[s],t.step=e,Promise.resolve()}).then(function(){l(t.previousStep,t.step)}).catch(i).then(n)})}},{key:"addStep",value:function(e){var t=this,n=this.steps.length;this.steps.push(e),this.enterFns.push(r),this.exitFns.push(r);var i={enter:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:r;return t.enterFns[n]=e,i},exit:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:r;return t.exitFns[n]=e,i}};return i}}]),e}();t.default=o},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),o=function(){return function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var n=[],i=!0,r=!1,o=void 0;try{for(var s,a=e[Symbol.iterator]();!(i=(s=a.next()).done)&&(n.push(s.value),!t||n.length!==t);i=!0);}catch(e){r=!0,o=e}finally{try{!i&&a.return&&a.return()}finally{if(r)throw o}}return n}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();t.getCSSVar=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;return console.assert(void 0!==t,"❌ getCSSVar needs a valid computedStyles.\nTry `getComputedStyles(document.documentElement)`"),t.getPropertyValue(e)},t.CSSVariables=function(e,t){return new Proxy({computedStyles:t,style:e.style},{get:function(e,t){return e.computedStyles.getPropertyValue(t)},set:function(e,t,n){e.style.setProperty(t,n)}})},t.traceMethodCalls=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:console.log;return new Proxy(e,{get:function(e,n,i){e[n];return function(){for(var e=arguments.length,i=Array(e),r=0;r<e;r++)i[r]=arguments[r];var o=Reflect[n].apply(Reflect,i);return t(n,JSON.stringify(i),JSON.stringify(o)),o}}})},t.spy=function(e,t){var n=o(e,2),i=n[0],r=n[1],s=void 0===r?null:r;return function(){for(var e=arguments.length,n=Array(e),r=0;r<e;r++)n[r]=arguments[r];return t.apply(void 0,n),i.apply(s,n)}},t.listen=function(e){var t=this;return this.el=e,this.evHandlers={},this.when=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];return{do:function(i){var r;return t.evHandlers[e]=s(i),(r=t.el).addEventListener.apply(r,[e,t.evHandlers[e]].concat(function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}(n))),t}}},this.mute=function(e){if(console.log("Muting : ",e),void 0!=t.evHandlers[e])return t.el.removeEventListener(e,t.evHandlers[e]),t},this},t.parseQS=function(e){var t=e.indexOf("?");if(-1===t)return[];e=e.substring(t+1).split("&");for(var n=decodeURIComponent,i={},r=e.length-1;r>=0;r--){var o=e[r].split("=");i[n(o[0])]=n(o[1]||"")}return i},t.getMetaContent=function(e){var t=document.querySelector('meta[name="'+e+'"]');return t?t.getAttribute("content"):void 0};var s=t.compose=function(e){return function(t){return e(t)}};t.Cronometer=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.hook=t,this.t0=this.now(),this.samples=[]}return r(e,[{key:"now",value:function(){return window.performance&&window.performance.now()||Date.now()}},{key:"sample",value:function(){return Number(((this.now()-this.t0)/1e3).toFixed(4))}},{key:"tap",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=[this.sample(),e,t];if(this.hook&&i(this.hook))try{this.hook(n)}catch(e){console.error(e)}this.samples.push([this.sample(),e,t])}},{key:"debug",value:function(){var e=this.samples.map(function(e){return{time:e[0],name:e[1],"...":e[2]}});console.log("%c ⌛ Timings","font-size: 2em;"),console.table(e)}}]),e}()}])});