// pull all earthquake info from last 7 days, assign colors based on magnitude, create layer
var eq_url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

var colors = ['#E53935', '#FB8C00', '#FFB300', '#FDD835', '#C0CA33', '#7CB342']

d3.json (eq_url, (response) => {

    // fxn to add circle markers
    function createCircles (feature) {
        var mag = feature.properties.mag;
        var coords = feature.geometry.coordinates;
            
        var magColor = ''

        if (mag > 5) {magColor = colors[0];}
        else if (mag > 4) {magColor = colors[1];}
        else if (mag > 3) {magColor = colors[2];}
        else if (mag > 2) {magColor = colors[3];}
        else if (mag > 1) {magColor = colors[4];}
        else {magColor = colors[5];}
            
        let options = {
            radius: Math.pow (mag, 2) * 4000,
            color: magColor
        }

        return L.circle ([coords[1], coords[0]], options);
    }

    // create layer for earthquakes
    var eq_layer = L.geoJSON (response, {
        onEachFeature: (feature, layer) => {
            layer.bindPopup (`<strong>magnitude ${feature.properties.mag}</strong><hr>${feature.properties.place}`);
        },
        pointToLayer: createCircles
        
    });

    // create layer for tectonic plates
    var tp_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

    var tp_style = {
        'color': '#D84315',
        'weight': 3,
        'fillOpacity': 0
    };

    d3.json (tp_url, (response) => {
        var tp_layer = L.geoJSON (response, {
            style: tp_style,
            onEachFeature: (feature, layer) => {
                layer.bindPopup (`<strong>plate name:</strong> ${feature.properties.PlateName}`);        
            }
        });

        // call 'createMap' fxn
        createMap (tp_layer, eq_layer);
    })
    
    
});

// fxn to create maps
function createMap (layer1, layer2) {

    // create base layers
    var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
    });

    var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
    });

    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
    });

    var baseMaps = {
    "light": light,
    "dark": dark,
    "satellite": satellite
    };

    var overlayMaps = {
    "fault lines": layer1,
    "earthquakes": layer2
    };

    // create map
    var map = L.map ("map", {
    center: [46.2276, 2.2137],
    zoom: 4,
    layers: [dark, layer1, layer2]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

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
}
