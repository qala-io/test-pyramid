(function () {
  angular.module('app.pyramid')
    .factory('pyramidCanvas', ['$document', 'canvasSize', PyramidCanvas]);


  function PyramidCanvas($document, canvasSize) {
    return new function () {
      const self = this;
      this.draw = draw;
      this.canvasLength = canvasSize.width;
      this.canvasHeight = canvasSize.height;
      //for testing
      this.getUnitTestsArea = getUnitTestsArea;
      this.getComponentTestsArea = getComponentTestsArea;
      this.getSystemTestsArea = getSystemTestsArea;

      function draw(testPercents) {
        const length = self.canvasLength;
        const height = self.canvasHeight;
        const canvasEl = $document.find('canvas');
        if (!canvasEl.length || !canvasEl[0].getContext) {
          console.warn('No context is available in canvas: ' + canvasEl);
          return;
        }
        const ctx = canvasEl[0].getContext('2d');
        ctx.fillStyle = '#1276B5';
        ctx.clearRect(0, 0, length, height);
        ctx.fill(getUnitTestsArea(testPercents[0], testPercents[1], testPercents[2]).toCanvasPath());
        ctx.fill(getComponentTestsArea(testPercents[0], testPercents[1], testPercents[2]).toCanvasPath());
        ctx.fill(getSystemTestsArea(testPercents[0], testPercents[1], testPercents[2]).toCanvasPath());
      }

      function getUnitTestsArea(unitProportion, componentProportion, systemProportion) {
        const area = new CanvasArea();
        if (!unitProportion) {
          return area;
        }
        const length = self.canvasLength;
        const bottomHeight = self.canvasHeight;
        const topHeight = self.canvasHeight * 0.666;
        const topTestsProportion = componentProportion || systemProportion;

        if (greaterOrEqual(unitProportion, topTestsProportion)) {
          area.push(
            {x: (0.5 - unitProportion / 2) * length, y: bottomHeight},
            {x: (0.5 + unitProportion / 2) * length, y: bottomHeight});
        } else {
          area.push({x: 0.5 * length, y: bottomHeight});
        }

        if (!topTestsProportion) {
          area.points.push(
            {x: (0.5 + unitProportion / 2) * length, y: topHeight},
            {x: (0.5 - unitProportion / 2) * length, y: topHeight}
          );
        } else if (greaterOrEqual(unitProportion, topTestsProportion)) {
          area.points.push(
            {x: (0.5 + topTestsProportion / 2) * length, y: topHeight},
            {x: (0.5 - topTestsProportion / 2) * length, y: topHeight}
          );
        } else if (systemProportion && unitProportion &&
          greaterOrEqual(componentProportion, systemProportion) && greaterOrEqual(componentProportion, unitProportion)) {
          area.points.push(
            {x: (0.5 + topTestsProportion / 2) * length, y: topHeight},
            {x: (0.5 - topTestsProportion / 2) * length, y: topHeight}
          );
        } else {
          area.points.push(
            {x: (0.5 + unitProportion / 2) * length, y: topHeight},
            {x: (0.5 - unitProportion / 2) * length, y: topHeight}
          );
        }
        return area;
      }

      function getComponentTestsArea(unitProportion, componentProportion, systemProportion) {
        const area = new CanvasArea();
        if (!componentProportion) {
          return area;
        }
        const unitArea = getUnitTestsArea(unitProportion, componentProportion, systemProportion);
        const systemArea = getSystemTestsArea(unitProportion, componentProportion, systemProportion);

        const length = self.canvasLength;
        const bottomHeight = self.canvasHeight * 0.666;
        const topHeight = self.canvasHeight * 0.333;

        if (!unitProportion && !greaterOrEqual(componentProportion, systemProportion)) {
          area.push({x: 0.5 * length, y: bottomHeight});
        } else if (unitArea.points.length === 0 && greaterOrEqual(componentProportion, systemProportion)) {
          area.push(
            {x: (0.5 - componentProportion / 2) * length, y: bottomHeight},
            {x: (0.5 + componentProportion / 2) * length, y: bottomHeight});
        } else {
          for (let i = unitArea.points.length - 1; i >= 0; i--) {
            const point = unitArea.points[i];
            equal(unitArea.points[i].y, bottomHeight) && area.push(point);
          }
        }

        if (!systemProportion && !greaterOrEqual(componentProportion, unitProportion)) {
          area.push({x: 0.5 * length, y: topHeight});
        } else if (!systemProportion && greaterOrEqual(componentProportion, unitProportion)) {
          area.push(
            {x: (0.5 + componentProportion / 2) * length, y: topHeight},
            {x: (0.5 - componentProportion / 2) * length, y: topHeight});
        } else {
          for (let i = systemArea.points.length - 1; i >= 0; i--) {
            const point = systemArea.points[i];
            equal(point.y, topHeight) && area.push(point);
          }
        }
        return area;
      }

      function getSystemTestsArea(unitProportion, componentProportion, systemProportion) {
        const bottomHeight = self.canvasHeight * 0.333;
        const topHeight = 0;
        const area = new CanvasArea();
        // logic is the same as unit tests, so getting unit area and then updating y's to system's height
        const flippedArea = getUnitTestsArea(systemProportion, componentProportion, unitProportion);
        for (let i = flippedArea.points.length - 1; i >= 0; i--) {
          const point = flippedArea.points[i];
          if (equal(point.y, self.canvasHeight)) {
            area.push({x: point.x, y: topHeight});
          } else {
            area.push({x: point.x, y: bottomHeight});
          }
        }
        return area;
      }
    };
  }

  function CanvasArea() {
    this.points = [];

    this.push = function () {
      // Not using slice() because:
      // You should not slice on arguments because it prevents optimizations in JavaScript engines (V8 for example).
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
      for (let i = 0; i < arguments.length; i++) {
        this.points.push(arguments[i]);
      }
    };

    this.toCanvasPath = function () {
      const path = new Path2D();
      if (this.points.length === 0) {
        return path;
      }
      path.moveTo(this.points[0].x, this.points[0].y);
      for (let i = 1; i < this.points.length; i++) {
        path.lineTo(this.points[i].x, this.points[i].y);
      }
      return path;
    };
    //used by tests only
    this.bottomWidth = function () {
      if (this.points.length === 0) {
        return 0;
      } else if (this.sameHeight(this.points[0], this.points[1])) {
        return this.points[1].x - this.points[0].x;
      } else {
        return 0;
      }
    };
    this.topWidth = function () {
      if (this.points.length === 0) {
        return 0;
      } else if (this.points.length === 4 && this.sameHeight(this.points[2], this.points[3])) {
        return Math.abs(this.points[2].x - this.points[3].x);
      } else if (this.points.length === 3 && this.sameHeight(this.points[1], this.points[2])) {
        return Math.abs(this.points[1].x - this.points[2].x);
      }
      return 0;
    };
    this.sameHeight = function (point1, point2) {
      return equal(point1.y, point2.y);
    };
  }

  function equal(float1, float2) {
    return Math.abs(float1 - float2) < 0.001;
  }

  function greaterOrEqual(float1, float2) {
    return equal(float1, float2) || float1 > float2;
  }
})();