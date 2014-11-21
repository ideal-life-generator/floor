(function() {
  var Animation;

  document.addEventListener("DOMContentLoaded", function(event) {
    var animation, computedStyle, element, radiusElementX, radiusElementY;
    event.stopPropagation();
    element = document.querySelector(".cube");
    computedStyle = window.getComputedStyle(element);
    radiusElementX = parseInt(computedStyle.width) / 2;
    radiusElementY = parseInt(computedStyle.height) / 2;
    animation = new Animation(element);
    animation.start({
      "webkitTransform": "rotateX(~0~deg) rotateY(~0~deg)",
      opacity: 1
    }, 60, 3000);
    return window.addEventListener("mousemove", function(event) {
      var x, y;
      event.stopPropagation();
      x = event.pageX - radiusElementX;
      y = event.pageY - radiusElementY;
      return animation.use({
        "webkitTransform": "rotateX(~" + y + "~deg) rotateY(~" + x + "~deg)",
        opacity: (x + y) / 1000
      });
    });
  });


  /*
  Animation uses for regulate state of the animation
    start - take starts data
    use - take on live new data and save it's
   */

  Animation = (function() {
    function Animation(element) {
      this.element = element;
      this.value = {};
      this.lastPosition = {};
    }

    Animation.prototype.live = function() {
      var component, components, lastPosition, n, position, prop, propName, proppers, result, speed, testPosition, testValue, tryAgain, value, _i, _j, _len, _len1, _ref, _ref1;
      _ref = this.value;
      for (prop in _ref) {
        value = _ref[prop];
        if (typeof value === "string") {
          components = value.split("~");
          result = "";
          for (n = _i = 0, _len = components.length; _i < _len; n = ++_i) {
            component = components[n];
            if (!(n % 2)) {
              propName = component;
            }
            if (n % 2) {
              lastPosition = this.lastPosition[prop][propName];
              value = ~~component;
              if (value > lastPosition && (Math.ceil(lastPosition) !== value) || value < lastPosition && (Math.floor(lastPosition) !== value)) {
                tryAgain = true;
                speed = value - lastPosition;
                position = lastPosition + speed * Math.ceil(Math.abs(speed) / this.resist * 100) / 100;
                this.lastPosition[prop][propName] = position;
              } else {
                position = false;
              }
              if (position) {
                result += propName + position;
              } else {
                result += propName + lastPosition;
              }
            }
          }
          this.element.style[prop] = result + propName;
        } else {
          lastPosition = this.lastPosition[prop];
          testPosition = lastPosition * 10000;
          testValue = value * 10000;
          if (testValue > testPosition && (Math.ceil(testPosition) !== testValue) || testValue < testPosition && (Math.floor(testPosition) !== testValue)) {
            tryAgain = true;
            speed = value - lastPosition;
            position = lastPosition + speed * Math.ceil(Math.abs(speed) / this.resist * 100) / 100;
            this.lastPosition[prop] = this.element.style[prop] = position;
          }
        }
      }
      if (tryAgain) {
        return setTimeout(((function(_this) {
          return function() {
            return _this.live();
          };
        })(this)), this.fps);
      } else {
        _ref1 = this.value;
        for (prop in _ref1) {
          value = _ref1[prop];
          proppers = this.lastPosition[prop];
          if (typeof value === "string") {
            components = value.split("~");
            for (n = _j = 0, _len1 = components.length; _j < _len1; n = ++_j) {
              component = components[n];
              if (!(n % 2)) {
                propName = component;
              }
              if (n % 2) {
                proppers[propName] = ~~component;
              }
            }
          } else {
            proppers = value;
          }
        }
        return this._status = tryAgain = 0;
      }
    };

    Animation.prototype.start = function(startData, fps, resist) {
      var component, components, n, prop, propName, proppers, value, _results;
      this.resist = resist;
      this.fps = 1000 / fps;
      _results = [];
      for (prop in startData) {
        value = startData[prop];
        this.element.style[prop] = value;
        if (typeof value === "string") {
          components = value.split("~");
          proppers = this.lastPosition[prop] = {};
          _results.push((function() {
            var _i, _len, _results1;
            _results1 = [];
            for (n = _i = 0, _len = components.length; _i < _len; n = ++_i) {
              component = components[n];
              if (!(n % 2)) {
                propName = component;
              }
              if (n % 2) {
                _results1.push(proppers[propName] = ~~component);
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
          })());
        } else {
          _results.push(this.lastPosition[prop] = value);
        }
      }
      return _results;
    };

    Animation.prototype.use = function(actualData) {
      var prop, value;
      for (prop in actualData) {
        value = actualData[prop];
        this.value[prop] = value;
      }
      if (!this._status) {
        this._status = 1;
        return this.live();
      }
    };

    return Animation;

  })();

}).call(this);
