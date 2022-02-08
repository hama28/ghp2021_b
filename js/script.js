let emergency_flg = false;

function clickSetting() {
    let header = document.getElementById("header");
    let title = document.getElementById("title");
    let bottom_menu = document.getElementById("bottom-menu");
    if (emergency_flg) {
        title.innerText = "観光マップ";
        header.style.backgroundColor = "#34675C";
        bottom_menu.style.backgroundColor = "#34675C";
        map.removeLayer(osm);
        gsi.addTo(map);
        emergency_flg = false;
    } else {
        title.innerText = "避難マップ";
        header.style.backgroundColor = "red";
        bottom_menu.style.backgroundColor = "red";
        osm.addTo(map);
        emergency_flg = true;
    }
}