//earthquake URL
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";

//magitude size marker function
function markSize(data){
  return data * 10;
}

//magnitude color marker function
function markColor(data){
  if(data > 5){
    return 'red'
  }
  else if(data > 3){
    return 'yellow'
  }
  else if(data > 1){
    return 'blue'
  }
  else {
    return 'green'
  }
}

// Perform a GET request to the query URL
d3.json(earthquakeUrl, function(data) {

  createFeatures(data.features);
  console.log(data.features);
});

function createFeatures(earthquakeData) {

  //Create a popup with earthquake info
  function popUp(feature, layer){
    layer.bindPopup("<h3>Place: " + feature.properties.place + "</h3><h3>Magnitude: " + feature.properties.mag +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }
  //Create a marker function
  function marker(feature, location){
    var earthMark = {
      stroke: false,
      radius: markSize(feature.properties.mag),
      color: markColor(feature.properties.mag)
    }

    return L.circleMarker(location, earthMark);

  }

  //Create a geoJson Layer
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: popUp,
    pointToLayer: marker
  });

  //createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps and an overlay object
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create a map object
  var myMap = L.map("mapid", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    // Add min & max
    var legendInfo = "<h1>Magnitude Legend</h1>" +
      "<table><tr><th> > 5</th><td>Red</td></tr>" +
      "<tr><th> > 3</th><td>Yellow</td></tr>" + 
      "<tr><th> > 1</th><td>Blue</td></tr>" +
      "<tr><th> < 1</th><td>Green</td></tr></table>";

    div.innerHTML = legendInfo;
    return div;
  };

  legend.addTo(myMap);

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
