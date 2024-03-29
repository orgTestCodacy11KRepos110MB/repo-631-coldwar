# Rats of the Maze

The year is 2048.

Thirty years ago we outsourced the mundane running of our lives to Machines. Machines that learn. The Machines learnt too well.

All computing resource on the planet has been consolidated in an immense Maze hewn out of solid rock.

No humans are permitted in The Maze, but the warm glow of it's reactors make it an ideal home for millions of giant Rats.

Your mission is to enter The Maze and deactivate the systems that power The Machines.

No human has ever returned from The Maze of the Rats.

+++ TRANSMISSION END

Rats of the Maze is an arcade simulation.

The talk will be a journey through the theory and technique of programming radioactive maze-solving rats that seek human flesh -- a journey from the very foundations of computer memory through to the algorithms used to create and solve mazes, wrapped up in unique hand crafted vector graphics running in the browser.

[ratsofthemaze.com](https://ratsofthemaze.com)

## Simulation Platform

Cold War is a simulation platform. Cold War comes with a set of scenes for you to watch and tweak. If you want to write your own it gives you code patterns to follow and a runtime environment to play them in.

## Hacking

Start by looking in `server/public/js/scenes` and `server/public/js/actors`. These are the only two places you'll need to mess with to write your own sims. Create a Scene and fill it with Actors. Start simple and build it up. Interception is a good scene to use as a base. Edit `scenes/index.js` to add it to the list of scenes on the homepage.

![](http://i.imgur.com/PNsaof4.gif)

## Talks

Talks have been given on Coldwar at:

* JSConf US, May 2015 (Jacksonville, Florida, US)
* [Web Directions Code, June 2015](https://vimeo.com/132786140) (Melbourne, Australia)
* SydJS, July 2015 (Sydney, Australia)
* [TX JS, July 2015](https://www.youtube.com/watch?v=hXW7kkyhtqo) (Austin, Texas, US)
* [Talk.js, November 2015](https://www.youtube.com/watch?v=4lmJJX2KoKY) (Singapore)
* [JSConf Asia November 2014](https://www.youtube.com/watch?v=0HJPilemNns) (Singapore)

## Stickers

[Stickers available here](https://www.stickermule.com/marketplace/9199-coldwar-dot-io)

![](https://raw.githubusercontent.com/simonswain/coldwar/master/artwork/coldwar_blue_web_small.png)

## Getting Started

You'll need Node.js version 4 or above.

```bash
git clone git@github.com:simonswain/coldwar.git
cd coldwar
npm install
npm start
open http://localhost:4002
```

## Key Controls

* `tab` toggle options
* `esc` back to index
* `enter` restart scene
* `?` help.
* `\` diagnostics.
* `drag` pan
* `+` `-` `0` zoom
* `mousewheel` zoom.

## References

* [SAGE](https://www.youtube.com/results?search_query=sage+computer)
* [Cold War, Hot Jets](https://www.youtube.com/watch?v=oJtzyFRy2Ko)
* [Wargames](https://www.youtube.com/watch?v=NHWjlCaIrQo)
* [Fail Safe](https://www.youtube.com/watch?v=-9R3w8wDrmM)
* [Thirteen Days](https://www.youtube.com/watch?v=-yfIoHXOO9E)
* [Seven Days in May](https://www.youtube.com/watch?v=nwMjiArJFhM)
* [Dr Strangelove](https://www.youtube.com/watch?v=vuP6KbIsNK4)
* [Major Havoc](https://www.youtube.com/watch?v=rbq1LE9MJc0)
* [History of Game Graphics](https://www.youtube.com/watch?v=dzN2pgL0zeg&index=1&list=PLOQZmjD6P2HlOoEVKOPaCFvLnjP865X1f)
* [Cold War Britain](https://www.youtube.com/watch?v=TZi_rrZX4bo)
* [The Power of Decision](https://www.youtube.com/watch?v=q2v0YuDatpc)
* [NASA A year in the life of Earth's CO2](https://www.youtube.com/watch?v=x1SgmFa0r04)
* [Energy2D-JS](http://concord-consortium.github.io/energy2d-js/model2d-demo.html)
* [Major Havoc](https://www.youtube.com/watch?v=rbq1LE9MJc0)
* [Rats of The Maze](http://bitsavers.informatik.uni-stuttgart.de/pdf/convergent/ngen/screenshots/Rats_2.JPG)
* [Microsimulation model of a national economy](http://dankozub.com/simulation/)

## History

2015-11-17 1.0.0 Initial public release
