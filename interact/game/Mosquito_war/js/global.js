function resetAttackTimer(){GAME.ENEMY.attackTimer.forEach(function(e){clearInterval(e)}),GAME.ENEMY.k_attackTimer.forEach(function(e){clearInterval(e)}),GAME.ENEMY.attackTimer.length=0,GAME.ENEMY.k_attackTimer.length=0,GAME.ENEMY.k_attack_5.length=0,GAME.ENEMY.mosId=0,GAME.ENEMY.k_attackId=0}function reset(){resetAttackTimer(),resetTimeBar(),Q.clearStage(1),Q.clearStage(4),Q.state.set({mosking_life:10,lives:4,isPlayerAttack:!1,isMosenter:!1,isMosenterScene:0}),GAME.PLAYER.mos_addCount=2,GAME.PLAYER.moveSpeed=3,GAME.PLAYER.life.length=0,GAME.kathaTimer.forEach(function(e){clearInterval(e),GAME.kathaTimer.length=0})}function mosBloodEnter(e,n,t){var a=e.insert(new Q.Mos_magic_circle({y:220}));a.animate({scale:1,opacity:1},.3,Q.Easing.Quadratic.InOut,{callback:function(){GAME.ENEMY.k_attack_5.length=0,this.stage.insert(new Q.MosquitoTracker({data:Q.asset("addKingattack_s_"+n),y:t,direct:"down"})),this.animate({opacity:0},.5,Q.Easing.Linear,{delay:.5,callback:function(){this.destroy()}})}})}function dropKatha(e,n,t){var a=Math.round(Math.random()*t);1!=a||0!=Q("Katha_1").length||Q.state.get("iskatha1")?2!=a||0!=Q("Katha_2").length||Q.state.get("iskatha2")?3!=a||0!=Q("Katha_3").length||Q.state.get("iskatha3")||e.insert(new Q.Katha_3({x:n.c.x,y:n.c.y})):e.insert(new Q.Katha_2({x:n.c.x,y:n.c.y})):e.insert(new Q.Katha_1({x:n.c.x,y:n.c.y}))}function button_click(e){e.animate({opacity:.3,scale:.9},.05,Q.Easing.Linear,{callback:function(){e.animate({opacity:1,scale:1},.1,Q.Easing.Linear)}})}function stageStop(){Q.stage().paused=!0,stopTimeBar()}function stageContinue(){Q.stage().paused=!1,Q.state.get("is_countdown_over")&&startClock(getUsedTime())}function setState(e){GAME.ADD.state.innerHTML=e}function sortRank(e,n){var t=!1;return GAME.rank.push({time:e,name:n,rank:-1}),GAME.rank.sort(function(e,n){var t=e.time,a=n.time;return a>t?-1:t>a?1:0}),GAME.rank.forEach(function(n,a){n.rank=a+1,5>a&&n.time===e&&(t=a+1)}),t}function formatTime(e){var n=Math.floor(e/60),t=e%60;return 10>t&&(t="0"+t),n+":"+t}function sendWinnerData(e,n){var t={time:e,name:n};ref.push().set(t).then(function(){console.log("sucuess")})["catch"](function(){console.log("error")}),GAME.ADD.winner_name.innerHTML=n,inputNameHidden(),winnerNameShow()}function inputNameHidden(){GAME.ADD.input_name.style.display="none"}function inputNameShow(){GAME.ADD.input_name.style.display="block"}function winnerNameHidden(){GAME.ADD.winner_name.style.display="none"}function winnerNameShow(){GAME.ADD.winner_name.style.display="block"}function winnerTimeHidden(){GAME.ADD.winner_time.style.display="none"}function winnerTimeShow(){GAME.ADD.winner_time.style.display="block"}var GAME={VIDEO:{},AUDIO:{},TIMEBAR:{},ADD:{},ENEMY:{},PLAYER:{},kathaTimer:[],rank:[]};GAME.VIDEO={isOpening:!0,opening:document.getElementById("video_opening"),fight:document.getElementById("video_fight"),mosking_appear:document.getElementById("video_mosking_appear"),winnerB:document.getElementById("video_winnerB"),winnerA:document.getElementById("video_winnerA"),winnerS:document.getElementById("video_winnerS"),skip_btn:document.getElementById("skip_btn"),videoArray:[]},GAME.AUDIO={audioArray:[]},GAME.TIMEBAR={now:new Date,allSecs:300,remainSecs:300,timeBarFlag:null},GAME.ADD={quintus_container:null,bar:null,result:null,inner_bar:null,input_name:null,winner_name:null,winner_time:null,state:document.getElementById("state")},GAME.ENEMY={attackTimer:[],k_attackTimer:[],k_attack_5:[],mosId:0,k_attackId:0,RATE_mosAttack:6,RATE_moskingAttack:5,mosSpeed:100},GAME.PLAYER={mos_addCount:2,moveSpeed:3,life:[]};