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
      opacity: 0.5
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
      this.style = element.style;
      this.value = {};
      this.lastPosition = {};
    }

    Animation.prototype.formula = function(lastPosition, value) {
      var position, speed;
      if (value > lastPosition && (Math.ceil(lastPosition) !== value) || value < lastPosition && (Math.floor(lastPosition) !== value)) {
        speed = value - lastPosition;
        return position = lastPosition + speed * Math.ceil(Math.abs(speed) / this.resist * 100) / 100;
      }
    };

    Animation.prototype.live = function() {
      var component, components, lastPosition, n, position, prop, propName, proppers, result, value, _i, _j, _len, _len1, _ref, _ref1;
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
              proppers = this.lastPosition[prop];
              lastPosition = this.lastPosition[prop][propName];
              value = ~~component;
              position = this.formula(proppers[propName], value);
              if (position) {
                proppers[propName] = position;
                result += propName + position;
              } else {
                result += propName + proppers[propName];
              }
            }
          }
          this.style[prop] = result + propName;
        } else {
          lastPosition = this.lastPosition[prop];
          position = this.formula(lastPosition, value);
          this.lastPosition[prop] = this.style[prop] = position;
        }
      }
      if (position) {
        return setTimeout(((function(_this) {
          return function() {
            return _this.live();
          };
        })(this)), this.delay);
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
        return this._status = 0;
      }
    };

    Animation.prototype.start = function(startData, fps, resist) {
      var component, components, n, prop, propName, proppers, result, value, _i, _len, _results;
      this.resist = resist;
      this.delay = 1000 / fps;
      _results = [];
      for (prop in startData) {
        value = startData[prop];
        this.style[prop] = value;
        if (typeof value === "string") {
          components = value.split("~");
          result = "";
          proppers = this.lastPosition[prop] = {};
          for (n = _i = 0, _len = components.length; _i < _len; n = ++_i) {
            component = components[n];
            if (!(n % 2)) {
              propName = component;
            }
            if (n % 2) {
              proppers[propName] = ~~component;
              result += propName + component;
            }
          }
          _results.push(this.style[prop] = result + propName);
        } else {
          _results.push(this.lastPosition[prop] = this.style[prop] = value);
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
