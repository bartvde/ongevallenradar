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

var styleCache = {};

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
