var map = L.map('map').setView([31.653586,131.019111], 16);

var gsi = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
    attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
});

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
});

var baseMaps = {
    "地理院地図" : gsi,
    "OpenStreetMap" : osm
};

L.control.layers(baseMaps).addTo(map);
gsi.addTo(map);

var rockfallIcon = L.icon({
    iconUrl: './img/災害記号_土砂崩れ.png',
    iconRetinaUrl: './img/災害記号_土砂崩れ.png',
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
});

// TODO:重たいので今回は無し
//$.getJSON("./data/土砂災害警戒区域データ_鹿児島_R1_曾於市.geojson", function(data) {
//    var geojson = L.geoJson(data, {
//        onEachFeature: function (feature, layer) {
//            //layer.bindPopup(feature.properties.name);
//            var xcoord = feature.properties.xcoord;
//            var ycoord = feature.properties.ycoord;
//            //var marker = L.marker([ycoord,xcoord]).addTo(map);
//            var marker = L.marker([ycoord,xcoord], { icon: sampleIcon }).addTo(map);
//            marker.bindPopup("土砂災害 危険区域").openPopup();
//        }
//    });
//    //L.geoJson(geojsonFeature).addTo(map);
//    geojson.addTo(map);
//});

var someGeojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [131.019111, 31.653586]
    }
};

// var latlng = L.latLng(31.653586,131.019111);

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

L.geoJSON(someGeojsonFeature, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(map);


var hazardAreaStyle = {
    "color": "#ff0000",
    "weight": 5,
    "opacity": 0.65
};

$.getJSON("./data/急傾斜地崩壊危険区域データ_鹿児島県_R2_曽於市.geojson", function(data) {
    var geojson = L.geoJson(data, {
        onEachFeature: function (feature, layer) {
            var polygon = turf.polygon(feature.geometry.coordinates[0]);
            var centroid = turf.centroid(polygon);
            var lat = centroid.geometry.coordinates[1].toFixed(6);
            var lng = centroid.geometry.coordinates[0].toFixed(6);
            var marker = L.marker([lat,lng], {icon: rockfallIcon}).addTo(map);
            marker.bindPopup(feature.properties.A47_004).openPopup();
        },
        style: hazardAreaStyle
    });
    geojson.addTo(map);
});

var marker = L.marker([31.653586,131.019111]).addTo(map);
marker.bindPopup("曽於市役所").openPopup();

// 2022/2/16 ルート追加 ------- //
var marker1 = null;
var marker2 = null;
// lat lng設定
let lat_strat = 0.0;
let lng_start = 0.0;
let lat_end = 0.0;
let lng_end = 0.0;
let flg = 0;
map.on('click', function(e){
    if ( flg == 0 ){
        lat_start = e.latlng.lat;
        lng_start = e.latlng.lng;
        flg += 1;
        // ルート始点pointの追加
        marker1 = L.marker([lat_start, lng_start],{title:"始点"});
        marker1.addTo(map);
        marker1.bindPopup("スタート").openPopup();
    }else if ( flg == 1 ) {
        lat_end = e.latlng.lat;
        lng_end = e.latlng.lng;
        flg += 1;
        // ルート終点pointの追加
        marker2 = L.marker([lat_end, lng_end],{title:"終点"});
        marker2.addTo(map);
        marker2.bindPopup("目的地").openPopup();
    }else {
        alert("ルートを選び直すには「ルート終了」ボタンを押して下さい。");
    }
})
// ルート検索
var routing_ctl = null;
function search_route(){
    // 異なる２点のcordinateが得られているかチェック
    if ( lat_start == 0.0 || lng_start == 0.0 || lat_end == 0.0 || lng_end == 0.0){
        alert("ルートを選んで下さい");
        return;
    }else if (lat_start == lat_end && lng_start == lng_end){
        alert("ルートを選び直して下さい");
        return;
    }
    // ルート検索
    routing_ctl = L.Routing.control({
        waypoints:[L.latLng(lat_start,lng_start), L.latLng(lat_end, lng_end)],
        routeWhileDragging:true}).addTo(map);
}
// ルート終了
function end_route(){
    flg = 0;
    if ( routing_ctl != null ){
        map.removeControl(routing_ctl); // ルートクリア
        routing_ctr = null;
    }
    // point削除する
    if ( marker1 != null ){
        map.removeLayer(marker1);
    }
    if ( marker2 != null ){
        map.removeLayer(marker2);
    }
}
// ---- ルート追加 end ----- //


// TODO:デモでは無し
// 現在地の取得
// function onLocationFound(e) {
//     L.marker(e.latlng).addTo(map).bindPopup("現在地").openPopup();
// }

// function onLocationError(e) {
//     alert("現在地を取得できませんでした。" + e.message);
// }

// map.on('locationfound', onLocationFound);
// map.on('locationerror', onLocationError);
// map.locate({setView: true, maxZoom: 16, timeout: 20000});
