// create base layer
var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

// create map
var map = L.map ("map", {
  center: [46.2276, 2.2137],
  zoom: 4,
  layers: [light]
});

// pull all earthquake info from last 7 days, assign colors based on magnitude
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

var colors = ['#E53935', '#FB8C00', '#FFB300', '#FDD835', '#C0CA33', '#7CB342']

d3.json (url, (response) => {

    L.geoJSON (response, {
        onEachFeature: (feature, layer) => {
            var mag = feature.properties.mag;
            var coords = feature.geometry.coordinates;
            
            var magColor = ''

            if (mag > 5) {magColor = colors[0];}
            else if (mag > 4) {magColor = colors[1];}
            else if (mag > 3) {magColor = colors[2];}
            else if (mag > 2) {magColor = colors[3];}
            else if (mag > 1) {magColor = colors[4];}
            else {magColor = colors[5];}
            
            L.circle([coords[1], coords[0]], {
                radius: Math.pow (mag, 3) * 600,
                color: magColor
            }).bindPopup (`<strong>magnitude ${mag}</strong><hr>${feature.properties.place}`)
            .addTo(map);
        }
    });
});

// create legend, add to map
var legend = L.control ({position: 'bottomright'});

legend.onAdd = ((map) => {
    var div = L.DomUtil.create ('div', 'info legend');

    grades = ['>5', '4-5', '3-4', '2-3', '1-2', '<1'];

    div.innerHTML = '<strong>Magnitude</strong><hr>';

    for (var x = 0; x < colors.length; x++) {
        div.innerHTML += `<i style = "background: ${colors[x]}"></i>${grades[x]}<br>`;
    }
    return div;
});

legend.addTo(map);
