var SimianCI = {
  init: function() {
    this.featuresSlider(7000);
  },

  featuresSlider: function(sliderTime) {
    var activeFeature = $('.feature--active');
    var featuresContainer = $('.features-container');
    // This timer will reset when the user clicks
    var autoSlideTimer = new this.Timer(getNextFeature, sliderTime || 7000);

    // Only exposing this method in case is needed
    function getNextFeature(nextFeature) {
      if (typeof nextFeature === 'undefined') {
        nextFeature = activeFeature.next();
        nextFeature = nextFeature.length ? nextFeature : getFirstFeature();
      }

      disableFeature(activeFeature);
      activateFeature(nextFeature);
      activeFeature = nextFeature;
    };

    function getFirstFeature() {
      return $('.feature').first();
    };

    function activateFeature(feature) {
      var index = feature.index();

      feature.addClass('feature--active');
      feature.find('.feature-title').addClass('feature-title--active');
      feature.find('.feature-text').addClass('feature-text--active');

      var image = $('.features-image').eq(index);
      image.addClass('features-image--active');
    };

    function disableFeature(feature) {
      var index = feature.index();

      feature.removeClass('feature--active');
      feature.find('.feature-title').removeClass('feature-title--active');
      feature.find('.feature-text').removeClass('feature-text--active');

      var image = $('.features-image').eq(index);
      image.removeClass('features-image--active');
    };

    // Using event delegation
    featuresContainer.on('click', function(event) {
      var target = $(event.target);
      var feature;

      autoSlideTimer.resetTimer();

      var isFeature = target.hasClass('feature') ||
        target.hasClass('feature-title') || target.hasClass('feature-text');

      if (isFeature) {
        feature = target.closest('.feature');
      }

      getNextFeature(feature);
    });
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
