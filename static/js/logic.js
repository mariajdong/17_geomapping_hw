
var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

var baseMaps = {
  light: light
};

// var overlayMaps = {
//   cities: cityLayer
// };

var map = L.map ("map", {
  center: [46.2276, 2.2137],
  zoom: 4,
  layers: [light]
});

L.control.layers(baseMaps).addTo(map);

// pull earthquake info
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json (url, (response) => {

    L.geoJSON (response, {
        onEachFeature: (feature, layer) => {
            var mag = feature.properties.mag;
            var coords = feature.geometry.coordinates;
            
            var magColor = ''

            if (mag > 5) {magColor = '#E53935';}
            else if (mag > 4) {magColor = '#FB8C00';}
            else if (mag > 3) {magColor = '#FFB300';}
            else if (mag > 2) {magColor = '#FDD835';}
            else if (mag > 1) {magColor = '#C0CA33';}
            else {magColor = '#7CB342';}
            
            L.circle([coords[1], coords[0]], {
                radius: Math.pow (mag, 3) * 600,
                color: magColor
            }).bindPopup (`<strong>magnitude ${mag}</strong><hr>${feature.properties.place}`)
            .addTo(map);
        }
    })
})
    // }).bindPopup ((layer) => {
    //     layer.feature.properties.place;
//     }).addTo(map);
// })
