var imageStyles = {
  'een': new ol.style.RegularShape({
    fill: new ol.style.Fill({color: '#FF0000'}),
    stroke: new ol.style.Stroke({color: '#8a0808', width: 2}),
    points: 3,
    radius: 13.5,
    angle: 0
  }),
  'twee': new ol.style.RegularShape({
    fill: new ol.style.Fill({color: '#FE9A2E'}),
    stroke: new ol.style.Stroke({color: '#B45F04', width: 2}),
    points: 3,
    radius: 13.5,
    angle: 0
  }),
  'drie': new ol.style.RegularShape({
    fill: new ol.style.Fill({color: '#FE9A2E'}),
    stroke: new ol.style.Stroke({color: '#B45F04', width: 2}),
    points: 3,
    radius: 13.5,
    angle: 0
  }),
  'vier': new ol.style.RegularShape({
    fill: new ol.style.Fill({color: '#F4FA58'}),
    stroke: new ol.style.Stroke({color: '#AEB404', width: 2}),
    points: 3,
    radius: 13.5,
    angle: 0
  }),
  'vijf': new ol.style.RegularShape({
    fill: new ol.style.Fill({color: '#F4FA58'}),
    stroke: new ol.style.Stroke({color: '#AEB404', width: 2}),
    points: 3,
    radius: 13.5,
    angle: 0
  }),
  'zes': new ol.style.RegularShape({
    fill: new ol.style.Fill({color: '#F4FA58'}),
    stroke: new ol.style.Stroke({color: '#AEB404', width: 2}),
    points: 3,
    radius: 13.5,
    angle: 0
  })
};

var canvas = document.getElementById('canvas');
var vectorContext = ol.render.toContext(canvas.getContext('2d'), {size: [6*27, 6*27]});
var ctx = canvas.getContext("2d");
var pointX = 13.5;
var pointY = 13.5;
var intervalY = 13.5*2;
var dpr = window.devicePixelRatio || 1;
for (var key in imageStyles) {
  var style = new ol.style.Style({
    image: imageStyles[key]
  });
  vectorContext.setStyle(style);
  vectorContext.drawGeometry(new ol.geom.Point([pointX, pointY]));
  ctx.font = "14px Arial";
  ctx.fillText(key, dpr * (pointX + 27) , dpr * pointY);
  pointY += intervalY;
}

var styleCache = {};

var wfsUrl = '/geoserver/wfs?service=WFS&request=GetFeature&typename=meldingen:actueel&version=1.1.0&srsname=EPSG:3857&outputFormat=application/json';
var geojsonFormat = new ol.format.GeoJSON();

var vectorSource = new ol.source.Vector({
  useSpatialIndex: false,
  strategy: ol.loadingstrategy.all,
  url: wfsUrl,
  format: geojsonFormat
});

var rayons = {};

var updateRayons = function() {
  $('#sel-rayon option:gt(0)').remove();
  for (var key in rayons) {
    $('#sel-rayon').append($("<option></option>").attr("value", key).text(key));
  }
};

var selectedRayon = null;

$('#sel-rayon').change(function(evt) {
  if (this.value === "0") {
    selectedRayon = null;
  } else {
    selectedRayon = this.value;
  }
  vectorSource.changed();
});

var onChange = function() { 
  if (vectorSource.getState() === 'ready') { 
    var features = vectorSource.getFeatures();
    for (var i = 0, ii = features.length; i < ii; ++i) {
      var rayon = features[i].get('rayon');
      rayons[rayon] = true;
    }
    updateRayons();
    vectorSource.un('change', onChange);
  }
};

vectorSource.on('change', onChange);

var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      extent: [313086.06785608083, 6418264.391049679, 939258.2035682462, 7200979.560689885],
      source: new ol.source.OSM({
        url: 'http://geoserver.lcm.nl/{z}/{x}/{y}.png'
      })
    }),
    new ol.layer.Vector({
      style: function(feature, resolution) {
        var nummer = feature.get('nummer');
        var rayon = feature.get('rayon');
        if (selectedRayon !== null && rayon !== selectedRayon) {
          return null;
        }
        var text = feature.get('bps') + '\n' + feature.get('tijdstip') + '\n' + feature.get('incident_type');
        if (!styleCache[nummer + '|' + text]) {
          styleCache[nummer + '|' + text] = new ol.style.Style({
            text: new ol.style.Text({
              fill: new ol.style.Fill({color: '#0000FF'}),
              stroke: new ol.style.Stroke({color: '#FFFFFF', width: 1.5}),
              font: 'bold 11px Arial',
              offsetY: -35,
              text: text
            }),
            image: imageStyles[nummer]
          });
        }
        return styleCache[nummer + '|' + text];
      },
      source: vectorSource
    })
  ],
  target: 'map',
  view: new ol.View({center: [570000, 6817000], zoom: 8})
});

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

closer.onclick = function() {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

var overlay = new ol.Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
});

map.addOverlay(overlay);

map.on('click', function(evt) {
  var pixel = map.getEventPixel(evt.originalEvent);
  overlay.setPosition(undefined);
  map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    if (feature && layer !== null) {
      var coordinate = evt.coordinate;
      content.innerHTML = '<table class="table"><tbody><tr><td>Berger</td><td>' + feature.get('berger') + '</td></tr><tr><td>Melder</td><td>' + feature.get('melder') + '</td></tr></tbody></table>';
      overlay.setPosition(coordinate);
    }
  });
});

var allowBeep = true;
$('#beep-checkbox').change(function() {
  allowBeep = this.checked;
});

var beep = function() {
  var sound = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
  sound.play();
};

var sourceHasFeature = function(feature) {
  var sourceFeatures = vectorSource.getFeatures();
  for (var i = 0, ii = sourceFeatures.length; i < ii; ++i) {
    if (feature.get('meldnr') === sourceFeatures[i].get('meldnr')) {
      return true;
    }
  }
  return false;
};

var getRemove = function(features) {
  var sourceFeatures = vectorSource.getFeatures();
  var removeList = [];
  for (var i = 0, ii = sourceFeatures.length; i < ii; ++i) {
    var feature = sourceFeatures[i];
    var remove = true;
    for (var j = 0, jj = features.length; j < jj; ++j) {
      if (feature.get('meldnr') === features[j].get('meldnr')) {
        remove = false;
      }
    }
    if (remove === true) {
      removeList.push(feature);
    }
  }
  return removeList;
};

var loadFeatures = function() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4) {
      var doBeep = false;
      var add = [];
      var remove;
      var dirty = false;
      if (xmlhttp.status === 200) {
        var features = geojsonFormat.readFeatures(xmlhttp.responseText);
        remove = getRemove(features);
        var i, ii;
        for (i = 0, ii = features.length; i < ii; ++i) {
          var feature = features[i];
          var rayon = feature.get('rayon');
          if (rayons[rayon] !== true) {
            rayons[rayon] = true;
            dirty = true;
          }
          if (!sourceHasFeature(feature)) {
            doBeep = true;
            add.push(feature);
          }
        }
        if (allowBeep && doBeep) {
          beep();
        }
        if (add.length > 0) {
          vectorSource.addFeatures(add);
        }
        if (remove.length > 0) {
          for (i = 0, ii = remove.length; i < ii; ++i) {
            vectorSource.removeFeature(remove[i]);
          }
        }
        if (dirty) {
          updateRayons();
        }
      } else {
        // TODO handle failure
      }
    }
  };
  xmlhttp.open('GET', wfsUrl, true);
  xmlhttp.send();
};

window.setInterval(loadFeatures, 10000);