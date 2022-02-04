!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e=e||self).window=e.window||{})}(this,function(e){"use strict";function h(){return t||"undefined"!=typeof window&&(t=window.gsap)&&t.registerPlugin&&t}function i(e){return Math.round(1e4*e)/1e4}function j(e){t=e||h(),l||(p=t.utils.getUnit,l=1)}function k(e,t,i,s,n){var a=e._gsap,r=a.get(e,t);this.p=t,this.set=a.set(e,t),this.s=this.val=parseFloat(r),this.u=p(r)||0,this.vel=i||0,this.v=this.vel/n,s||0===s?(this.acc=s,this.a=this.acc/(n*n)):this.acc=this.a=0}var t,l,p,v=Math.PI/180,s={version:"3.9.1",name:"physics2D",register:j,init:function init(e,t,i){l||j();var s=this,n=+t.angle||0,a=+t.velocity||0,r=+t.acceleration||0,p=t.xProp||"x",o=t.yProp||"y",c=t.accelerationAngle||0===t.accelerationAngle?+t.accelerationAngle:n;s.target=e,s.tween=i,s.step=0,s.sps=30,t.gravity&&(r=+t.gravity,c=90),n*=v,c*=v,s.fr=1-(+t.friction||0),s._props.push(p,o),s.xp=new k(e,p,Math.cos(n)*a,Math.cos(c)*r,s.sps),s.yp=new k(e,o,Math.sin(n)*a,Math.sin(c)*r,s.sps),s.skipX=s.skipY=0},render:function render(e,t){var s,n,a,r,p,o,c=t.xp,l=t.yp,v=t.tween,h=t.target,u=t.step,f=t.sps,d=t.fr,g=t.skipX,y=t.skipY,w=v._from?v._dur-v._time:v._time;if(1===d)a=w*w*.5,s=c.s+c.vel*w+c.acc*a,n=l.s+l.vel*w+l.acc*a;else{for(r=o=(0|(w*=f))-u,o<0&&(c.v=c.vel/f,l.v=l.vel/f,c.val=c.s,l.val=l.s,r=o=(t.step=0)|w),p=w%1*d;o--;)c.v+=c.a,l.v+=l.a,c.v*=d,l.v*=d,c.val+=c.v,l.val+=l.v;s=c.val+c.v*p,n=l.val+l.v*p,t.step+=r}g||c.set(h,c.p,i(s)+c.u),y||l.set(h,l.p,i(n)+l.u)},kill:function kill(e){this.xp.p===e&&(this.skipX=1),this.yp.p===e&&(this.skipY=1)}};h()&&t.registerPlugin(s),e.Physics2DPlugin=s,e.default=s;if (typeof(window)==="undefined"||window!==e){Object.defineProperty(e,"__esModule",{value:!0})} else {delete e.default}});

var end_panel = document.querySelector("#panel");
    var end_cv = document.getElementById("magic-dust");
    var end_ctx = end_cv.getContext("2d");
    var end_cvWidth = parseInt(window.getComputedStyle(end_panel).width, 10); // get width without "px"
    var end_cvHeight = parseInt(window.getComputedStyle(end_panel).height, 10); // get height without "px"
    var resolution = window.devicePixelRatio || 1;
    var sprites = [];
    var toRad = Math.PI / 180;
    var fx_tl;

    // resize for retina
    resizeCv();
    function start_fx() {
        // particles
        init_fx(
            "circle",			    // texture
            1777, 				      // total sprites
            50,50, 50,50,  		// width-+, height-+
            0,1600, 0,1600,   // start position x-+, y-+
            4,12, 0,360,  		// velocity-+, angle-+
            .1,2.5, .2,.8, 	// scale start-+, end-+
            360, 0,0,   		  // rotation start, end-+
            1.7,24,   			    // duration-+
            .1, 2,  			    // fade in, out duration
            0.1,  				    // gravity
            12,					    // delay+ inbetween sprites
            -1,					      // repeat sprite animation (-1 = infinite)
            0					        // delay timeline
        );
    }

    function init_fx(textureSpr, totalSpr, minWidth,maxWidth, minHeight,maxHeight, xMin,xMax, yMin,yMax, veloMin,veloMax, angleMin,angleMax, startScaleMin,startScaleMax, endScaleMin,endScaleMax, rotStart, rotEndMin,rotEndMax, minDur,maxDur, fadeInDur, fadeOutDur, gravitySpr, delaySpr, repeatSpr, delayTl) {
        // generate sprites
        for (var i = 0; i < totalSpr; i++) {
            var widthSpr = randomInt(minWidth, maxWidth);
            var heightSpr = randomInt(minHeight, maxHeight);
            // define texture
            var texture = createShape(textureSpr, i);
            sprites.push(createSprite());
        }

        $(document).mousemove(function(e) {
            var x = e.pageX;
            var y = e.pageY;
            var texture = createShape(textureSpr, x);
            for (var i = 0; i < 10; i++) {
               sprites.push(createSprite(x,y,2));
            }
        });

        // start rendering animation
        gsap.ticker.add(renderCv);
        gsap.registerPlugin(Physics2DPlugin);
        function createSprite(x,y,t) {
            var width  = (texture.naturalWidth  || texture.width  || 0) / resolution;
            var height = (texture.naturalHeight || texture.height || 0) / resolution;
            var duration = t || randomNr(minDur, maxDur);
            // limit angle if needed
            var angleNr;
            if (angleMin == -90 && angleMax == -270) {
                angleNr = Math.random() < 0.5 ? 90 : 270; // only up or down
            } else if (angleMin == -0 && angleMax == -180)  {
                angleNr = Math.random() < 0.5 ? 0 : 180; // only left or right
            } else {
                angleNr = randomNr(angleMin, angleMax);
            }
            // create a new timeline for the sprite
            fx_tl = gsap.timeline({
                delay: t ? 0 : randomNr(delaySpr),
                repeat: t ? 0 : repeatSpr,
                repeatDelay: randomNr(1)
            });
            // sprite object default properites
            var sprite = {
                animation: fx_tl,
                texture: texture,
                width: width,
                height: height,
                alpha: 0,
                rotation: randomNr(rotStart),
                scale: randomNr(startScaleMin, startScaleMax),
                originX: t ? .2 : 0.5,
                originY: t ? .3 : 0.5,
                x: x || randomNr(xMin, xMax),
                y: y || randomNr(yMin, yMax),
            };

            // animate to
            fx_tl.add("start", delayTl)
                .to(sprite, t ? 0.3 : fadeInDur, {alpha: 1, ease:Power0.easeIn}, "start")
                .to(sprite, duration, {
                    rotation: 180 * randomNr(rotEndMin, rotEndMax),
                    scale: randomNr(endScaleMin, endScaleMax),
                    physics2D: {
                        velocity: randomNr(veloMin, veloMax),
                        angle: angleNr,
                        gravity: gravitySpr,
                    }
                }, "start")
                // fade out
                .to(sprite, t ? 1.5 : fadeOutDur, {
                    alpha: 0,
                    delay: t ? 1.5 : duration-fadeOutDur
                }, 0);

            return sprite;
        }

        function createShape(textureSpr, i) {
            // Create offscreen canvas
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            canvas.width = widthSpr * resolution;
            canvas.height = heightSpr * resolution;
            var radius = widthSpr / 2;
            var gradient = context.createRadialGradient(radius, radius, 0, radius, radius, radius);
            if (i % 3 === 0){
            gradient.addColorStop(0, "rgba(177,255,252,0.75)");
            gradient.addColorStop(0.15,	"rgba(177,255,252,0.1)");
            } else if (i % 5 === 0){
            gradient.addColorStop(0, "rgba(42,176,255,0.6)");
            gradient.addColorStop(0.1,	"rgba(42,176,255,0.1)");
            } else {
            gradient.addColorStop(0, "rgba(244,119,254,0.6)");
            gradient.addColorStop(0.1,	"rgba(244,119,254,0.1)");
            }
            gradient.addColorStop(0.65, "rgba(0,0,0,0)");
            context.fillStyle = gradient;
            context.fillRect(0, 0, widthSpr, heightSpr);
                return canvas;
        }
    }

    function renderCv() {
        end_ctx.clearRect(0, 0, end_cvWidth, end_cvHeight);
        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];
            // Skip rendering sprite if it has no alpha
            if (!sprite.alpha) {
                continue;
            }
            end_ctx.save();
            var offsetX = sprite.originX * sprite.width;
            var offsetY = sprite.originY * sprite.height;
            end_ctx.translate(sprite.x + offsetX, sprite.y + offsetY);
            end_ctx.rotate(sprite.rotation * toRad);
            end_ctx.scale(sprite.scale, sprite.scale);
            end_ctx.globalAlpha = sprite.alpha;
            end_ctx.drawImage(sprite.texture, -offsetX, -offsetY);
            end_ctx.restore();
        }
    }

    function resizeCv() {
        end_cv.width  = end_cvWidth * resolution;
        end_cv.height = end_cvHeight * resolution;
        end_cv.style.width  = end_cvWidth + "px";
        end_cv.style.height = end_cvHeight + "px";
        end_ctx.scale(resolution, resolution);
    }

    function randomNr(min, max) {
        if (max === undefined) { max = min; min = 0; }
        if (min > max) { var tmp = min; min = max; max = tmp; }
        return min + (max - min) * Math.random();
    }

    function randomInt(min, max) {
        if (max === undefined) { max = min; min = 0; }
        if (min > max) { var tmp = min; min = max; max = tmp; }
        return Math.floor(min + (max - min + 1) * Math.random());
    }
    start_fx();