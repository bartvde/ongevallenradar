var styles = {
  'een': new ol.style.Style({
    image: new ol.style.RegularShape({
      fill: new ol.style.Fill({color: '#FF0000'}),
      stroke: new ol.style.Stroke({color: '#8a0808', width: 2}),
      points: 3,
      radius: 15,
      angle: 0
    })
  }),
  'twee': new ol.style.Style({
    image: new ol.style.RegularShape({
      fill: new ol.style.Fill({color: '#FE9A2E'}),
      stroke: new ol.style.Stroke({color: '#B45F04', width: 2}),
      points: 3,
      radius: 15,
      angle: 0
    })
  }),
  'drie': new ol.style.Style({
    image: new ol.style.RegularShape({
      fill: new ol.style.Fill({color: '#FE9A2E'}),
      stroke: new ol.style.Stroke({color: '#B45F04', width: 2}),
      points: 3,
      radius: 15,
      angle: 0
    })
  }),
  'vier': new ol.style.Style({
    image: new ol.style.RegularShape({
      fill: new ol.style.Fill({color: '#F4FA58'}),
      stroke: new ol.style.Stroke({color: '#AEB404', width: 2}),
      points: 3,
      radius: 15,
      angle: 0
    })
  }),
  'vijf': new ol.style.Style({
    image: new ol.style.RegularShape({
      fill: new ol.style.Fill({color: '#F4FA58'}),
      stroke: new ol.style.Stroke({color: '#AEB404', width: 2}),
      points: 3,
      radius: 15,
      angle: 0
    })
  }),
  'zes': new ol.style.Style({
    image: new ol.style.RegularShape({
      fill: new ol.style.Fill({color: '#F4FA58'}),
      stroke: new ol.style.Stroke({color: '#AEB404', width: 2}),
      points: 3,
      radius: 15,
      angle: 0
    })
  })
};

var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM({
        url: 'http://geoserver.lcm.nl/{z}/{x}/{y}.png'
      })
    }),
    new ol.layer.Vector({
      style: function(feature, resolution) {
        var nummer = feature.get('nummer');
        return styles[nummer];
      },
      source: new ol.source.Vector({
        strategy: ol.loadingstrategy.all,
        url: '/geoserver/wfs?service=WFS&request=GetFeature&typename=meldingen:actueel&version=1.1.0&srsname=EPSG:3857&outputFormat=application/json',
        format: new ol.format.GeoJSON()
      })
    })
  ],
  target: 'map',
  view: new ol.View({center: [570000, 6817000], zoom: 8})
});
