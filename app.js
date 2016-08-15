var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM({
        url: 'http://geoserver.lcm.nl/{z}/{x}/{y}.png'
      })
    })
  ],
  target: 'map',
  view: new ol.View({center: [570000, 6817000], zoom: 8})
});
