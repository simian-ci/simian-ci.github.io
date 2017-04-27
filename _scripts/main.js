/**
 * These are custom easing functions for animejs,
 * check the docs here for more info
 * https://github.com/juliangarnier/anime#defining-custom-functions
 *
 * noEase: for instant transition
 *
 * bulbEasing: when half of the time has passed, transition.
 * (this one was made specially for the bulb)
 */
anime.easings['noEase'] = function() {
  return 1;
};
anime.easings['bulbEasing'] = function(t) {
  return t > 0.5 ? 1 : 0;
}

var SimianCI = {
  init: function() {
    this.nav();
    this.mobileMenu();
    this.animatePage();
  },

  animatePage: function() {
    var currentPath = window.location.pathname;

    switch(currentPath) {
      case '/':
        this.leadAnimation();
        break;
    }
  },

  // Binds scroll events related to the navbar (when user scrolls and alt navbar appears)
  nav: function() {
    var navbar = $('#navbar');
    var navbarInverse = $('#navbar-inverse');
    // Offset to show navbar
    var scrollOffset = 20;
    var mobileMenu = $('#mobile-menu');

    checkPageScroll();

    function activateInverseNavbar(inverse) {
      if (navbarInverse.hasClass('navbar--show') && inverse) {
        return;
      }
      navbar.toggleClass('navbar--show', !inverse);
      navbarInverse.toggleClass('navbar--show', inverse);
    }

    function checkPageScroll() {
      var scroll = $(window).scrollTop();
      activateInverseNavbar(scroll > scrollOffset);
    }

    $(document).scroll(function(event) {
      if (mobileMenu.hasClass('mobile-menu--active')) {
        event.preventDefault();
        return;
      }
      checkPageScroll();
    });
  },

  // Binds click handler to open and close mobile menu.
  mobileMenu: function() {
    var menuTriggers = $('.menu-toggle-wrapper');
    var menuTogglers = $('.menu-toggle');
    var body = $(document.body);
    var menu = $('#mobile-menu');

    function toggleMenu() {
      menuTogglers.toggleClass('menu-toggle--active');
      menu.toggleClass('mobile-menu--active');
      // Prevents body from scrolling when menu is active
      body.toggleClass('modal-open');
    }

    menuTriggers.on('click', function(event) {
      toggleMenu();
    });
  },

  leadAnimation: function() {
    var elSVGContainer = $('.lead-svg');
    var nonPathItems = document.querySelectorAll('#lead-svg #monkey .face-item');

    var animationItems = [
      { wireNumber: '01', serverNumber: '01' },
      { wireNumber: '02', serverNumber: '02' },
      { wireNumber: '03', serverNumber: '03' }
    ];

    // Shows svg once page loads
    elSVGContainer.addClass('lead-svg--show');

    // Times are in ms unless stated otherwise
    var options = {
      timesServerLights:             600,
      timeBetweenServerLights:       300,
      // Time to restart animation once it finishes
      timeToRestart:                 1600,
      bulbDuration:                  840,
      bulbLoops:                     6,
      // This is not actually time, but frames
      initialDrawingTime:            120,
      wiresTime:                     1000
    };

    var colors = {
      inchWorm:    '#93E10E',
      monza:       '#D0011B',
      carnation:   '#F15569',
      webOrange:   '#FFA300',
      silver:      '#C2C2C2',
      altSilver:   '#BCBCBC'
    };

    // Binding functions with default parameters as this wont change
    var turnOnBulb = bulbAnimation.bind(null, { duration: 100, loop: false, opacity: 1 }, { stroke: colors.monza });
    var animateBulb = bulbAnimation.bind(null, { duration: options.bulbDuration, loop: options.bulbLoops, opacity: 1 }, { stroke: [colors.monza, colors.carnation] });
    var turnOffBulb = bulbAnimation.bind(null, { duration: 100, loop: false, opacity: 0 }, { stroke: colors.altSilver });

    var animateLights = serverLightsAnimation.bind(null, { delay: serverLightsDelay, duration: options.timesServerLights, fill: colors.monza });
    var fixLights = serverLightsAnimation.bind(null, { delay: serverLightsDelay, duration: 100, duration: options.timesServerLights, fill: colors.inchWorm });

    var turnWireOn = wiresAnimation.bind(null, { duration: options.wiresTime, fillOpacity: 1, stroke: colors.webOrange, strokeWidth: 2.25 });
    var turnWireOff = wiresAnimation.bind(null, { duration: options.wiresTime, fillOpacity:0, stroke: colors.silver, strokeWidth: 1  });

    // We obtain the actual svg elements and bind animation functions with them
    animationItems.map(function(server) {
      var newItem = server;

      newItem.wire = getNWire(server.wireNumber);
      newItem.lights = getNServerLights(server.serverNumber);

      // Bind animation functions
      newItem.turnWireOn = turnWireOn.bind(null, newItem.wire);
      newItem.animateLights = animateLights.bind(null, newItem.lights);
      newItem.turnWireOff = turnWireOff.bind(null, newItem.wire);
      // To fix lights, do it backwards
      newItem.fixLights = fixLights.bind(null, newItem.lights.concat().reverse());

      return newItem;
    });

    var vivus = new Vivus('lead-svg', {
      duration: options.initialDrawingTime,
      type: 'delayed',
      animTimingFunction: Vivus.EASE,
      pathTimingFunction: Vivus.EASE_OUT
    }, function() {
      requestAnimationFrame(startAnimation)
    });

    // This makes the monkey face elements and server lights visible
    setTimeout(function () {
      requestAnimationFrame(function () {
        anime({
          targets: document.querySelectorAll('.non-regular'),
          easing: 'easeInOutSine',
          duration: 300,
          fillOpacity: 1,
        });
      });
    }, 300);

    function startAnimation() {
      var animationPromise;

      for (var i = 0; i < animationItems.length; i++) {
        var server = animationItems[i];
        animationPromise = animateWholeServer(animationPromise, server)
      }

      animationPromise.then(function() {
        setTimeout(function () {
          requestAnimationFrame(startAnimation);
        }, options.timeToRestart);
      });
    }

    /**
     * This is the "timeline" for each server, at this point,
     * it plays the following animation (for the server passed in):
     *
     * 1. Turn on server related wire
     * 2. Turn on bulb and start flashing
     * 3. Kill server (Put its lights to red in sequence)
     * 4. Turn wire off
     * 5. Fix lights (Put server lights to green all at once)
     */
    function animateWholeServer(animationPromise, server) {
      var wire = server.wire;

      animationPromise = typeof animationPromise === 'undefined' ?
        turnWireOn(wire) : animationPromise.then(server.turnWireOn);

      animationPromise = animationPromise
        .then(function() {
          return Promise.all([
            turnOnBulb().then(animateBulb).then(turnOffBulb),
            server.animateLights()
          ]);
        })
        .then(server.turnWireOff)
        .then(server.fixLights);

      return animationPromise;
    }

    function getNWire(n) {
      var nodes = document
        .querySelectorAll('#lead-svg .cable_' + n);

      return [].slice.call(nodes);
    }

    function getNServerLights(n) {
      var nodes = document
        .querySelectorAll('#lead-svg #server_' + n +' *[fill="#93E10E"]');

      return [].slice.call(nodes);
    }

    function serverLightsDelay(el, i) {
      return i * options.timeBetweenServerLights;
    }

    /*
      All of the functions below return finished, thats an animejs property,
      and its a promise that will resolve once the animation finishes
    */

    function wiresAnimation(params, wire) {
      return anime({
        targets: wire,
        easing: 'easeInOutSine',
        duration: params.duration,
        delay: function(el, i) { return i * 50 },
        fillOpacity: params.fillOpacity,
        strokeWidth: params.strokeWidth,
        stroke: params.stroke
      }).finished;
    }

    function serverLightsAnimation(params, lights) {
      return anime({
        targets: lights,
        duration: params.duration,
        delay: params.delay,
        easing: 'bulbEasing',
        fill: params.fill
      }).finished;
    }

    function bulbAnimation(params, glassParams) {
      var bulb = anime({
        targets: '#lead-svg #lamp .bulb-light',
        delay: 0,
        loop: params.loop,
        easing: 'bulbEasing',
        duration: params.duration,
        fillOpacity: params.opacity,
        fill: glassParams.stroke
      }).finished;

      if (glassParams) {
        var glass = anime({
          targets: '#lead-svg #lamp .bulb-glass',
          delay: 0,
          loop: params.loop,
          easing: 'bulbEasing',
          duration: params.duration,
          stroke: glassParams.stroke
        }).finished;

        return Promise.all([ bulb, glass ]);
      }

      return bulb;
    }
  },

  // Timer utility class
  Timer: function(callback, time) {
    this.callback = callback;
    this.time = time;

    this.createTimer = function() {
      this.interval = setInterval(this.callback, this.time);
    };

    this.resetTimer = function() {
      clearInterval(this.interval);
      this.createTimer();
    };

    this.createTimer();
  }
};

$(document).ready(function () {
  SimianCI.init();
});
