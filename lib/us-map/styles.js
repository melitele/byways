var borders = [
  { "weight": 2 },
  { "hue": "#eeeeee" },
  { "saturation": 30 },
  { "lightness": 30 }
];

var off = [
  { "visibility": "off" }
];

var styles = [
  {
    "featureType": "water",
    "stylers": [
      { "lightness": -10 },
      { "saturation": -40 },
    ]
  },{
    "featureType": "poi",
    "stylers": off
  },{
    "featureType": "road.local",
    "stylers": off
  },{
    "featureType": "road.arterial",
    "stylers": off
  },{
    "featureType": "administrative.locality",
    "stylers": off
  },{
    "featureType": "administrative.neighborhood",
    "stylers": off
  },{
    "featureType": "administrative.land_parcel",
    "stylers": off
  },{
    "featureType": "landscape.man_made",
    "stylers": off
  },{
    "featureType": "landscape.natural",
    "stylers": [
      { "hue": "#808090" },
      { "saturation": -40 },
      { "lightness": 40 }
    ]
  },{
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": borders
  },{
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": borders
  },{
    "featureType": "administrative.province",
    "elementType": "labels.text",
    "stylers": off
  },{
    "featureType": "administrative.country",
    "elementType": "labels.text",
    "stylers": off
  }
];

module.exports = styles;