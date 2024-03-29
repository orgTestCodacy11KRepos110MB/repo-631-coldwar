/*global Scenes:true, Actors:true */
/*jshint browser:true */
/*jshint strict:false */
/*jshint latedef:false */

Scenes.gateway = function(env, opts){
  this.env = env;
  this.opts = this.genOpts(opts);
  this.attrs = this.genAttrs();
  this.init();
};

Scenes.gateway.prototype = Object.create(Scene.prototype);

Scenes.gateway.prototype.title = 'Gateway';

Scenes.gateway.prototype.layout = '';

Scenes.gateway.prototype.init = function(){
  this.env.play('fall')
}

Scenes.gateway.prototype.getCast = function(){
  return {
  }
};

Scenes.gateway.prototype.defaults = [{
  key: 'max_x',
  value: 480,
  min: 32,
  max: 1024
}, {
  key: 'max_y',
  value: 480,
  min: 32,
  max: 1024
}];

Scenes.gateway.prototype.genAttrs = function(){
  return {
    frame_index: 0,
    step_index: 0,
    time: 0,
    hold: 0,
  };
};

Scenes.gateway.prototype.update = function(delta){

  this.env.play('heartbeat');
  if(this.env.at > 2500) {
    this.env.goNext()
  }

}


Scenes.gateway.prototype.paint = function(fx, gx, sx){

    var arc = Math.PI/3;

  var p = (this.env.ms / 250) * 0.5;
  if(this.env.ms % 3 == 0){

    gx.ctx.save()
    gx.ctx.translate(this.opts.max_x/2, this.opts.max_y/2)

    gx.ctx.beginPath()
    gx.ctx.arc(0, 0, this.opts.r, 0, 2*Math.PI)
    gx.ctx.fill()

    gx.ctx.strokeStyle = 'rgba(255, 255, 255, 1)'
    gx.ctx.lineWidth = 12
    gx.ctx.beginPath()
    gx.ctx.rect(-this.opts.max_x * p/2, -this.opts.max_y * p/2, this.opts.max_x * p, this.opts.max_y * p)
    gx.ctx.stroke()
    gx.ctx.restore()

    fx.ctx.save()
    fx.ctx.translate(this.opts.max_x/2, this.opts.max_y/2)

    fx.ctx.beginPath()
    fx.ctx.arc(0, 0, this.opts.r, 0, 2*Math.PI)
    fx.ctx.fill()

    fx.ctx.strokeStyle = 'rgba(0, 255, 255, 1)'
    fx.ctx.lineWidth = 12
    fx.ctx.beginPath()
    fx.ctx.rect(-this.opts.max_x * p/2, -this.opts.max_y * p/2, this.opts.max_x * p, this.opts.max_y * p)
    fx.ctx.stroke()
    fx.ctx.restore()
  } 


  var h = (Date.now()%360 * 0.22) - 10;
  var c;
  c = 'hsl(' + h + ', 100%, 50%)';
    
    if(Math.random() < 0.025){
      c = 'rgba(255,255,0,0.5)';
    }

    if(Math.random() < 0.025){
      c = 'rgba(255,255,255,1)';
    }

    if(Date.now() % 1000 < 200){
      c = 'rgba(0,0,0,1)';
    }

    if(Date.now() % 1000 > 950){
      c = 'rgba(255,255,255,1)';
    }     

  gx.ctx.fillStyle = c;

  gx.ctx.shadowColor = c;
  gx.ctx.shadowBlur = 8;
  gx.ctx.shadowOffsetX = 0;
  gx.ctx.shadowOffsetY = 0;
  gx.ctx.shadowBlur = 8;

  
  gx.ctx.font = '36pt robotron';
  gx.ctx.textAlign='center'
  gx.ctx.textBaseline='middle'
  gx.ctx.fillText('enter the maze', this.opts.max_x / 2, this.opts.max_y / 2);
  gx.ctx.restore();
  
}
