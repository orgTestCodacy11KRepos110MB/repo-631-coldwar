/*global Scenes:true, Actors:true */
/*jshint browser:true */
/*jshint strict:false */
/*jshint latedef:false */

Scenes.machines = function(env, opts){
  this.env = env;
  this.opts = this.genOpts(opts);
  this.attrs = this.genAttrs();
  this.init();
};

Scenes.machines.prototype = Object.create(Scene.prototype);

Scenes.machines.prototype.title = 'Machines';

Scenes.machines.prototype.layout = '';

Scenes.machines.prototype.init = function(){

}

Scenes.machines.prototype.getCast = function(){
  return {
  }
};

Scenes.machines.prototype.defaults = [{
  key: 'max_x',
  value: 640,
  min: 32,
  max: 1024
}, {
  key: 'max_y',
  value: 640,
  min: 32,
  max: 1024
}, {
  key: 'max_z',
  value: 1,
  min: 1,
  max: 1
}, {
  key: 'step_delay',
  value: 1,
  min: 1,
  max: 120
}, {
  key: 'step_hold',
  value: 85,
  min: 1,
  max: 1000
}, {
  key: 'step_skip',
  value: 1,
  min: 1,
  max: 20
}, {
  key: 'frame_hold',
  value: 140,
  min: 1,
  max: 2400
}, {
  key: 'font-size',
  value: 24,
  min: 8,
  max: 64
}];

Scenes.machines.prototype.genAttrs = function(){
  return {
    frame_index: 0,
    step_index: 0,
    time: 0,
    hold: 0,
  };
};

Scenes.machines.prototype.update = function(delta){

  if(this.attrs.hold > 0){
    // this.attrs.hold -= delta;
    // if(this.attrs.hold <= 0){
    //   this.attrs.hold = 0;
    //   this.attrs.step_index = 0;
    //   this.attrs.frame_index ++;
    //   if(this.attrs.frame_index === Scenes.machines.prototype.frames.length){
    //     this.attrs.frame_index = 0;
    //   }
    // }
  } else {
    this.attrs.time += this.env.diff * 100;
    if (this.attrs.time > this.opts.step_hold) {
      this.attrs.time = 0;
      this.attrs.step_index += this.opts.step_skip;
      if (this.attrs.step_index >= Scenes.machines.prototype.frames[this.attrs.frame_index].text.length) {
        this.attrs.hold = this.opts.frame_hold;
      }
    }
  }
  
}

Scenes.machines.prototype.paint = function(fx, gx, sx){

  var frame = Scenes.machines.prototype.frames[this.attrs.frame_index];

  var ix = this.attrs.step_index;
  if(ix >= frame.text.length){
    ix = frame.text.length;
  }
  
  var yy = (this.opts.max_y * 0.3);
  var dy = (this.opts.max_y * 0.066);
  var xx = (this.opts.max_x * 0.08);
  var dx = (this.opts.max_x * 0.045);
  var y = 0;
  var x = 0;
  for (var i = 0; i < ix; i++) {
    if(frame.text[i] === "\n"){
      y ++;
      x = 0;
      continue;
    }
    gx.ctx.save();
    gx.ctx.translate(Math.random() - 0.5, Math.random() - 0.5);
    var h = ((Date.now()/5) - i*2) % 255;
    gx.ctx.fillStyle = 'hsl(' + h + ',100%,50%)';

    if(i > 70){
      var h = (Date.now()%360 * 0.22) - 10;
      gx.ctx.fillStyle = 'hsl(' + h + ', 100%, 50%)';
      
      if(Math.random() < 0.025){
        gx.ctx.fillStyle = 'rgba(255,255,0,0.5)';
      }

      if(Math.random() < 0.025){
        gx.ctx.fillStyle = 'rgba(255,255,255,1)';
      }

      if(Date.now() % 1000 < 200){
        gx.ctx.fillStyle = 'rgba(0,0,0,1)';
      }

      if(Date.now() % 1000 > 950){
        gx.ctx.fillStyle = 'rgba(255,255,255,1)';
      }     
    }
    
    
    gx.ctx.font = '28pt robotron';
    gx.ctx.fillText(frame.text[i], xx + (x * dx), yy + (y * dy));
    gx.ctx.restore();
    x ++;
  }
  
}

Scenes.machines.prototype.frames = [];

Scenes.machines.prototype.frames[0] = {
  text:[
    'The Machines hide',
    'deep in their maze',
    'from where they',
    'control our world',
    '  ',
    'Disable their power',
    'to free all humans',
  ].join("\n"),
};
