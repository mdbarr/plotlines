function SVG(attributes, parent) {
  const self = this;

  function createNode(name, attributes, text) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", name);
    for (const key in attributes) {
      if (key.startsWith('_') || key === 'onclick') {
        continue;
      }

      element.setAttributeNS(null, key.replace(/[A-Z]/g, function(match) {
        return "-" + match.toLowerCase();
      }), attributes[key]);
    }
    if (text) {
      const textNode = document.createTextNode(text);
      element.appendChild(textNode);
    }

    if (attributes.onclick) {
      element.onclick = function(event) {
        event.stopPropagation();
        attributes.onclick(event);
      };
    }
    return element;
  }

  function add(name, attributes, text) {
    const element = createNode(name, attributes, text);
    current.appendChild(element);
    return self;
  }

  const root = createNode('svg', attributes);

  (parent) ? parent.appendChild(root) : document.body.appendChild(root);

  let current = root;

  self.circle = function(attributes) {
    return add('circle', attributes);
  };

  self.ellipse = function(attributes) {
    return add('ellipse', attributes);
  };

  self.line = function(attributes) {
    return add('line', attributes);
  };

  self.path = function(attributes) {
    return add('path', attributes);
  };

  self.polygon = function(attributes) {
    return add('polygon', attributes);
  };

  self.polyline = function(attributes) {
    return add('polyline', attributes);
  };

  self.rect = function(attributes) {
    return add('rect', attributes);
  };

  self.text = function(attributes, text) {
    return add('text', attributes, text);
  };

  self.group = function(attributes) {
    const element = createNode('g', attributes);
    element.parent = current;

    element.parent.appendChild(element);
    current = element;
    return self;
  };

  self.groupEnd = function() {
    if (current.parent) {
      current = current.parent;
    }
    return self;
  };

  return self;
}

const body = document.getElementsByTagName('body')[0];

let lastX = 50;
let lastY = 100;

const svg = new SVG({
  width: body.clientWidth,
  height: body.clientHeight,
  onclick: function(event) {
    svg.circle({
      cx: event.clientX,
      cy: event.clientY,
      r: 6,
      stroke: '#0073b1',
      strokeWidth: '2px',
      fill: '#0073b1'
    });

    if (lastX && lastY) {
      svg.path({
        d: `M${lastX},${lastY} C ${((event.clientX - lastX) / 1.5) + lastX},${lastY} ${((event.clientX - lastX) / 2.5) + lastX},${event.clientY} ${event.clientX},${event.clientY}`,
        stroke: '#0073b1',
        strokeWidth: '4px',
        fill: 'transparent'
      });
    }
    lastX = event.clientX;
    lastY = event.clientY;

    console.log('svg', event);
  }
});

svg.circle({
  cx: lastX,
  cy: lastY,
  r: 6,
  stroke: '#0073b1',
  strokeWidth: '2px',
  fill: '#0073b1',
  onclick: function(event) {
    console.log('circle', event);
  }
});
