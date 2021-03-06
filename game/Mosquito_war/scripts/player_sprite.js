/*
*/

;Quintus.PlayerSprites = function(Q){
	Q.gravityY = 0;
  Q.gravityX = 0;

	// 紀錄被 power 打到的上一個
	var lastCollide = null;
	var twinkle_count = 10 ;

	// 載入玩家
	Q.Sprite.extend("Player",{
		init: function(p){
			this._super(p,{
				sheet: 'player' ,
				sprite: 'player',
				type: Q.SPRITE_ENEMY ,
				opacity: 1 ,
				x: Q.width/2,
				y: 470
			}) ;

			Q.state.set("player_h" , this.p.h) ;
			
			this.add("tween");
			this.on("player_speedUp , player_invincible , player_recover, hurt , destroy");
		},

		step: function(dt){
			// 控制人物
			var player_w = this.p.w/2 ;
			if (Q.inputs['A']){
				this.p.x -= GAME.PLAYER.moveSpeed ;

				if ( this.p.x < player_w)
					this.p.x = player_w ;
			}else if (Q.inputs['D']){
				this.p.x += GAME.PLAYER.moveSpeed ;

				if ( this.p.x > (Q.width - player_w))
					this.p.x = (Q.width - player_w) ;
			}

			if(Q("Enemy").length == 0 ){
				if(Q.state.get("isMosenter")) ;
				else{
					if(GAME.PLAYER.mos_addCount > 0){
						Q('MosAttack').trigger('destroy');

						Q.state.inc("isMosenterScene",1); // according to "isMosenterScene" NUM
						Q.stageScene("mosEnter"); // 召喚蚊子
						
						GAME.PLAYER.mos_addCount -- ; 
					} 
					else if(GAME.PLAYER.mos_addCount == 0 && Q("Enemy").length == 0){
						this.stage.insert(new Q.MosKing()); // 加入魔王

						stopBGM(Q.state.get("whichBGM"));
						mosBloodEnter(this.stage,1,220); // blood bubble
						
						// 使 GAME.PLAYER.mos_addCount = -1 不繼續動
						GAME.PLAYER.mos_addCount -- ;
		    		playVideo(GAME.VIDEO.mosking_appear , 2); // Play video_mosking_appear
					}	
				}
			}
		},

		hurt: function(){
			Q.audio.play("player_hurt.mp3");

			var count = 8;
			Q.state.set("isPlayerAttack",true);
			this.twinkle_opacity_0(count);

			setState('～～可惡...啊～～');
		},

		twinkle_opacity_0: function(count){

			if( count > 0 ){
				count -- ; // when count = 1 , --> 0.2sec
				this.animate({opacity:0},0.1,Q.Easing.Quadratic.InOut,{
					callback: function(){
						this.twinkle_opacity_1(count);
					}
				})
			}else{
				Q.state.set("isPlayerAttack",false);
				setState('竟然敢傷害我，要你好看！');

				switch(Q.state.get("lives"))
				{
					case 3:
						this.p.sheet = "man_life_3";
						this.p.h = 120 ;
						this.p.cy= 60; // update center "Y" ; 
						break ;
					case 2:
						this.p.sheet = "man_life_2";
						break;
					case 1:
						this.p.sheet = "man_life_1";
						this.p.cx=40;
						this.p.w = 80;
						this.p.h = 120 ;
						break;
					default:
						Q.stageScene("gameOver");
				}
			}
		},

		twinkle_opacity_1: function(count){
			this.animate({opacity:1},0.1,Q.Easing.Quadratic.InOut,{
				callback: function(){
					this.twinkle_opacity_0(count);
				}
			})
		},

		player_speedUp: function(){

			var player_x = this.p.x ;
      var player_y = this.p.y ;

      GAME.PLAYER.moveSpeed = 9;

      this.stage.insert(new Q.PlayerSpeedUP({
      	x: player_x,
      	y: player_y + 40
      }))
		},

		player_invincible: function(){
			var player_x = this.p.x ;
      var player_y = this.p.y ;

      this.stage.insert(new Q.PlayerInvincible({
      	x: player_x ,
      	y: player_y + 15
      }))
		},

		player_recover : function(){
			GAME.PLAYER.moveSpeed = 3;
			Q("PlayerSpeedUP").trigger("hidden_destroy");
		}
	})

	Q.Sprite.extend("PlayerSpeedUP",{
		init: function(p){
			this._super(p,{
				sheet: "player_speedup",
				sprite: "player_speedup",
				scale: 0.1,
				opacity: 0.1
			})

			this.add("animation,tween");
			this.animate({scale: 1 , opacity: 1} , 0.2 , Q.Easing.Linear);
			this.play("default");

			this.on("hidden_destroy");
		},

		step: function(){
			if(Q.state.get("mosking_life") < 0 || Q.state.get("lives") <= 0){
				this.destroy();
			}else{
				this.p.x = Q.select('Player').items[0].p.x ;
			}
		},

		hidden_destroy: function(){
			this.animate({opacity: 0} , 1 , Q.Easing.Linear , {
				callback: function(){ this.destroy()}
			});
		}
	})

	Q.Sprite.extend("PlayerInvincible" , {
		init: function(p){
			this._super(p,{
				sheet: "player_invincible",
				sprite: "player_invincible",
				opacity: 0 ,
				type: Q.SPRITE_ENEMY ,
			})

			this.add("tween");
			this.on("twinkle_show");
			this.on("twinkle_hidden");
			this.on("hidden_destroy");

			this.animate({opacity: 1} , 0.3 , Q.Easing.Linear);
		},
		step: function(){
			if(Q.state.get("mosking_life") < 0 || Q.state.get("lives") <= 0){
				this.destroy();
			}else{
				this.p.x = Q.select('Player').items[0].p.x ;
			}
		},
		hidden_destroy: function(){
			twinkle_count = 15 ;
			this.twinkle_hidden();
		},
		twinkle_hidden: function(){
			twinkle_count-- ;
			this.animate({opacity:0},0.1,Q.Easing.Linear,{
				callback: function(){ this.twinkle_show();}
			})
		},
		twinkle_show: function(){
			if(twinkle_count > 0){
				this.animate({opacity:1},0.1,Q.Easing.Linear,{
					callback: function(){ this.twinkle_hidden();}
				})
			}else{
				this.destroy();
			}
		}

	})

	Q.Sprite.extend("Power" , {
		init: function(p){
			// x , y 在發射出去的時候依照人物位置決定
			this._super(p,{
				sprite: "power",
				collisionMask: Q.SPRITE_DEFAULT ,
				angle:0

			}) ;

			// Wait til we are inserted, then listen for events on the stage
			this.on("hit" , this , "collide");
			this.on("power_up,power_recover,disappear");
		},
		disappear: function(){
			this.destroy();
		},

		step: function(dt) {
			this.p.x += this.p.vx * dt;
      this.p.y += this.p.vy * dt;
    	this.stage.collide(this);
    },

    collide: function(col) {
    	if(col.obj.isA("MosAttack") || col.obj.isA("MosKing")) {
    		Q.audio.play("power_collide.ogg",true);
      	this.destroy(); // Power destroy() ;
        col.obj.trigger("destroy");
      }
      else if( col.obj.isA("Enemy") || col.obj.isA("MosKingAttack")){
      	Q.audio.play("power_collide.ogg",true);
      	this.destroy(); // Power destroy() ;
      	col.obj.trigger("attacked");
      }
    },

   	power_up: function(){
			Q.state.set("power_up",1);
		},

		power_recover: function(){
			Q.state.set("power_up",0);
		}
	});

	Q.Sprite.extend("PrePower" , {
		init: function(p){

			this._super(p , {
				sheet: "pre_power",
				sprite: "pre_power",
				opacity:1
			})

			this.add("animation,tween");
			this.play("shoot");
			this.animate({opacity:0} , 0.3 , Q.Easing.Linear , {
				callback: function(){
					this.destroy();
				}
			});
		}
	})

	Q.Sprite.extend("PrePowerUp" , {
		init: function(p){

			this._super(p , {
				sheet: "pre_power_up",
				sprite: "pre_power_up",
				y: 370,
				opacity:1
			})

			this.add("animation,tween");
			this.play("shoot");
			this.animate({opacity:0} , 0.5 , Q.Easing.Linear , {
				callback: function(){
					this.destroy();
				}
			});
		}
	})

}