/* global Actors, Actor, Vec3, VecR */

Actors.TwistyHuman = function (env, refs, attrs) {
  this.env = env
  this.refs = refs
  this.opts = this.genOpts()
  this.attrs = this.genAttrs(attrs)
  this.init(attrs)
}

Actors.TwistyHuman.prototype = Object.create(Actor.prototype)

Actors.TwistyHuman.prototype.title = 'TwistyHuman'

Actors.TwistyHuman.prototype.genAttrs = function (attrs) {
  var energy = 10 + random0to(10)

  return {
    alpha: 0,
    face_enemy: false,
    face_angle: 0,
    speed: this.opts.speed_base + (Math.random() * this.opts.speed_flux),
    color: attrs.color || '#fff',
    dead: false,
    recharge: 1 + (random1to(10)) / 10,
    energy_max: energy,
    energy: energy,
    damage: 0,
    escaped: false

  }
}

Actors.TwistyHuman.prototype.init = function (attrs) {

 
  this.pos = new Vec3(
    attrs.x,
    attrs.y,
    0
  );

  this.velo = new VecR(
    Math.PI * 2 * Math.random(),
    this.attrs.speed
  ).vec3()

}

Actors.TwistyHuman.prototype.defaults = [{
  key: 'speed_base',
  value: 5,
  min: 1,
  max: 100
}, {
  key: 'speed_flux',
  value: 3,
  min: 0.2,
  max: 50
}, {
  key: 'velo_scale',
  value: 0.1,
  min: 0.1,
  max: 1,
  step: 0.1
}, {
  key: 'intent_scale',
  value: 20,
  min: 0,
  max: 100,
}, {
  key: 'separation_range',
  value: 50,
  min: 10,
  max: 500
}, {
  key: 'cohesion_range',
  value: 200,
  min: 10,
  max: 500
}, {
  key: 'alignment_range',
  value: 500,
  min: 10,
  max: 1000
}, {
  key: 'separation_force',
  value: 0.7,
  min: 0.1,
  max: 1.0,
  step: 0.05
}, {
  key: 'cohesion_force',
  value: 2,
  min: 0.1,
  max: 1.0,
  step: 0.05
}, {
  key: 'alignment_force',
  value: 2.25,
  min: 0.1,
  max: 5.0,
  step: 0.05
}, {
  key: 'predator_range',
  value: 130,
  min: 10,
  max: 500
}, {
  key: 'predator_force',
  value: 30,
  min: 0,
  max: 100
}, {
  key: 'reflect_force',
  value: 10,
  min: 0,
  max: 10
}, {
  key: 'show_params',
  value: 0,
  min: 0,
  max: 1
}, {
  key: 'laser_probability',
  value: 0.5,
  min: 0,
  max: 1
}, {
  key: 'laser_range_base',
  value: 240,
  min: 1,
  max: 500
}, {
  key: 'laser_range_flux',
  value: 32,
  min: 1,
  max: 100
}, {
  key: 'laser_power_base',
  value: 160,
  min: 1,
  max: 500
}, {
  key: 'laser_power_flux',
  value: 10,
  min: 1,
  max: 100
}, {
  key: 'flashbang_rats',
  value: 15,
  min: 1,
  max: 100
}, {
  key: 'flashbang_probability',
  value: 0.1,
  min: 0,
  max: 1,
  step:0.1
}]


Actors.TwistyHuman.prototype.update = function (delta) {


  this.attrs.alpha = Math.sin(Math.PI *((Date.now()%500)/1000));

  if(this.attrs.alpha < 0.1 && this.attrs.flag){
    this.attrs.flag = false;
    this.env.play('heartbeat');
  }
  if(this.attrs.alpha > 0.9 && !this.attrs.flag){
    this.attrs.flag = true;
    this.env.play('heartbeat');
  }

  var vec = new Vec3()
  var route

  this.recharge()

  if(this.refs.maze){
    if(this.refs.cell.attrs.i === this.refs.maze.attrs.exit_cell && !this.env.gameover){
      this.refs.maze.attrs.escape_done = true;
    } else {
      // seeking exit
      route = this.refs.maze.route(this.refs.cell, this.refs.maze.cells[this.refs.maze.attrs.exit_cell]);
      //
      route.push(this.refs.maze.attrs.exit_cell)

      if(route[0] === this.refs.cell.attrs.i){
        route.shift();
      }

      var intent = null;
      var intents = [[0,-1],[1,0],[0,1],[-1,0]];
      var qq=[];
      for(var i=0; i<4; i++){
        if(this.refs.cell.exits[i] && this.refs.cell.exits[i].attrs.i == route[0]){
          intent = i;
          break;
        }
      }
      if(intent !== null){
        vec.add(new Vec3(intents[intent][0], intents[intent][1]).scale(this.opts.intent_scale))
        if(intent === 1 || intent === 3){
          if(this.pos.y < this.refs.cell.opts.max_y * 0.4){
            vec.add(new Vec3(0, 1).scale(this.opts.intent_scale))
          }
          if(this.pos.y > this.refs.cell.opts.max_y * 0.6){
            vec.add(new Vec3(0, -1).scale(this.opts.intent_scale))
          }
        }

        if(intent === 0 || intent === 2){
          if(this.pos.x < this.refs.cell.opts.max_x * 0.4){
            vec.add(new Vec3(1, 0).scale(this.opts.intent_scale))
          }
          if(this.pos.x > this.refs.cell.opts.max_x * 0.6){
            vec.add(new Vec3(-1, 0).scale(this.opts.intent_scale))
          }
        }

      }


    }
  }

  this.attrs.intent = intent
  this.attrs.route = route;

  vec.add(this.reflect().scale(this.opts.reflect_force))

  vec.scale(this.opts.velo_scale)

  this.velo.add(vec)
  this.velo.limit(this.attrs.speed)
  this.pos.add(this.velo)

  var other, cell;

  if (this.pos.x < 0) {
    other = this.refs.cell.exits[3];
    if(other){
      this.pos.x += this.refs.cell.opts.max_x
    } else {
      this.velo = new Vec3(-this.velo.x, this.velo.y, 0);
      this.pos.x = 0
    }
  } else if (this.pos.x > this.refs.cell.opts.max_x) {
    other = this.refs.cell.exits[1];
    if(other){
      this.pos.x = this.pos.x - this.refs.cell.opts.max_x
    } else {
      this.velo = new Vec3(-this.velo.x, this.velo.y, 0);
      this.pos.x = this.refs.cell.opts.max_x
    }
  }

  if (this.pos.y < 0) {
    other = this.refs.cell.exits[0];
    if(other){
      this.pos.y += this.refs.cell.opts.max_y
    } else {
      this.velo = new Vec3(this.velo.x, - this.velo.y, 0);
      this.pos.y = 0
    }
  } else if (this.pos.y > this.refs.cell.opts.max_y) {
    other = this.refs.cell.exits[2];
    if(other){
      this.pos.y = this.pos.y - this.refs.cell.opts.max_y
    } else {
      this.velo = new Vec3(this.velo.x, -this.velo.y, 0);
      this.pos.y = this.refs.cell.opts.max_y
    }
  }

  cell = this.refs.cell;

  if(other){
    for (var i = 0, ii = cell.humans.length; i < ii; i++) {
      if (cell.humans[i] === this) {
        cell.humans[i] = null;
        break
      }
    }
    this.refs.cell = other;
    //console.log(this.refs.cell.attrs.i);
    other.humans.push(this);
  }

}

Actors.TwistyHuman.prototype.recharge = function () {
  // basics
  this.attrs.energy = this.attrs.energy + (this.attrs.recharge * (1 - (1 / this.attrs.energy_max) * this.attrs.damage))
  if (this.attrs.energy > this.attrs.energy_max) {
    this.attrs.energy = this.attrs.energy_max
  }
  this.attrs.damage = this.attrs.damage - this.attrs.recharge

  if (this.attrs.damage < 0) {
    this.attrs.damage = 0
  }
}


Actors.TwistyHuman.prototype.reflect = function () {

  var reflect = new Vec3()

  var max = Math.min(this.refs.cell.opts.max_x, this.refs.cell.opts.max_y)

  if (!this.refs.cell.exits[3] && this.pos.x < this.refs.cell.opts.max_x * 0.01) {
    reflect.x = ((this.refs.cell.opts.max_x * 0.1) - this.pos.x ) / (this.refs.cell.opts.max_x * 0.1);
  }

  if (!this.refs.cell.exits[0] && this.pos.y < this.refs.cell.opts.max_y * 0.01) {
    reflect.y = ((this.refs.cell.opts.max_y * 0.1) - this.pos.y ) / (this.refs.cell.opts.max_y * 0.1);
  }

  if (!this.refs.cell.exits[1] && this.pos.x > this.refs.cell.opts.max_x * 0.99) {
    reflect.x = - (this.pos.x - (this.refs.cell.opts.max_x * 0.9) ) / (this.refs.cell.opts.max_x * 0.1);
  }

  if (!this.refs.cell.exits[2] && this.pos.y > this.refs.cell.opts.max_y * 0.99
     ) {
    reflect.y = - (this.pos.y - (this.refs.cell.opts.max_y * 0.9) ) / (this.refs.cell.opts.max_y * 0.1);
  }

  return reflect

}


Actors.TwistyHuman.prototype.separation = function () {
  var i, ii
  var other
  var range

  var vec = new Vec3()

  for (i = 0, ii = this.refs.cell.humans.length; i < ii; i++) {
    other = this.refs.cell.humans[i]

    if (!other) {
      continue
    }

    if (other === this) {
      continue
    }

    range = this.pos.rangeXY(other.pos)

    if (range === 0) {
      continue
    }

    if (range > this.opts.separation_range) {
      continue
    }

    vec.add(this.pos.minus(other.pos).normalize().scale(1 / range))
  }

  return vec.normalize()
}

Actors.TwistyHuman.prototype.alignment = function () {
  var i, ii
  var other
  var range

  var vec = new Vec3()

  for (i = 0, ii = this.refs.cell.humans.length; i < ii; i++) {
    other = this.refs.cell.humans[i]

    if(!other){
      continue
    }

    if (other === this) {
      continue
    }

    range = this.pos.rangeXY(other.pos)

    if (range === 0) {
      continue
    }

    if (range > this.opts.separation_range) {
      continue
    }

    vec.add(other.velo)
  }

  return vec.normalize()
}

Actors.TwistyHuman.prototype.cohesion = function () {
  var i, ii
  var other

  var x = 0
  var y = 0
  var c = 0

  for (i = 0, ii = this.refs.cell.humans.length; i < ii; i++) {
    other = this.refs.cell.humans[i]

    if (other === this) {
      continue
    }

    x += this.pos.x
    y += this.pos.y
    c++
  }

  var center = new Vec3(x / c, y / c)

  return this.pos.minus(center).normalize()
  // return center.minus(this.pos).normalize()
}

Actors.TwistyHuman.prototype.steer = function () {
  var i, ii

  var dist
  var other
  var count = 0
  var vec, vector

  var alignment = new Vec3()
  var cohesion = new Vec3()
  var separation = new Vec3()

  for (i = 0, ii = this.refs.cell.humans.length; i < ii; i++) {
    other = this.refs.cell.humans[i]

    if (!other) {
      continue
    }

    if (other === this) {
      continue
    }

    dist = this.pos.rangeXY(other.pos)

    if (dist === 0) {
      continue
    }

    if (dist <= this.opts.separation_range) {
      vec = other.pos.minus(this.pos)
      vec.normalize().scale(this.opts.separation_range / dist)
      separation.add(vec)
    }

    if (dist <= this.opts.cohesion_range) {
      vec = this.pos.minus(other.pos)
      vec.normalize().scale(this.opts.cohesion_range / dist)
      cohesion.add(vec)
    }

    if (dist <= this.opts.alignment_range) {
      vec = this.pos.minus(other.pos)
      alignment.add(vec)
      count++
    }
  }

  if (count === 0) {
    return new Vec3()
  }

  separation.normalize().scale(this.opts.separation_force)
  cohesion.normalize().scale(this.opts.cohesion_force)

  alignment = this.pos.minus(alignment)
  alignment.normalize().scale(this.opts.alignment_force)

  vector = new Vec3()
  vector.add(separation)
  vector.add(cohesion)
  vector.add(alignment)
  vector.normalize()

  return vector
}

Actors.TwistyHuman.prototype.paint = function (view) {

  if(this.attrs.escaped){
    return;
  }

  view.ctx.save()
  if(this.attrs.face_enemy){
    view.ctx.rotate(this.attrs.face_angle)
  } else {
    view.ctx.rotate(this.velo.angleXY())
  }

  view.ctx.fillStyle = '#022'
  view.ctx.strokeStyle = '#0ff'
  view.ctx.lineWidth = 1

  var z = 32
  view.ctx.lineWidth = 8

  view.ctx.beginPath()
  view.ctx.rect(-z ,-z-z, z, z+z+z+z)
  view.ctx.stroke()

  view.ctx.beginPath()
  view.ctx.moveTo(z, 0)
  view.ctx.lineTo(-z, z)
  view.ctx.lineTo(-z, -z)
  view.ctx.lineTo(z, 0)
  view.ctx.closePath()
  view.ctx.fill()
  view.ctx.stroke()

  view.ctx.restore()

  // if(this.attrs.intent === 0){
  //   view.ctx.strokeStyle = '#f00'
  //   view.ctx.beginPath()
  //   view.ctx.moveTo(0, 0)
  //   view.ctx.lineTo(0, -2*z)
  //   view.ctx.stroke()
  // }

  // if(this.attrs.intent === 1){
  //   view.ctx.strokeStyle = '#f00'
  //   view.ctx.beginPath()
  //   view.ctx.moveTo(0, 0)
  //   view.ctx.lineTo(2*z, 0)
  //   view.ctx.stroke()
  // }

  // if(this.attrs.intent === 2){
  //   view.ctx.strokeStyle = '#f00'
  //   view.ctx.beginPath()
  //   view.ctx.moveTo(0, 0)
  //   view.ctx.lineTo(0, 2*z)
  //   view.ctx.stroke()
  // }

  // if(this.attrs.intent === 3){
  //   view.ctx.strokeStyle = '#f00'
  //   view.ctx.beginPath()
  //   view.ctx.moveTo(0, 0)
  //   view.ctx.lineTo(-2*z, 0)
  //   view.ctx.stroke()
  // }

}
