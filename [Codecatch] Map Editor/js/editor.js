function previewFile() {
    
    var img     = document.createElement("img");
    var file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();

    reader.onloadend = function () {
        img.src = reader.result;               
    }

    if (file) {
        reader.readAsDataURL(file);
        img.onload = function(){

            midHeight = this.height/2;
            midWidth = this.width /2;   


            var mapMinZoom = (this.width/window.innerWidth)/2 + 1;
            var mapMaxZoom = this.width/window.innerWidth + 1;    




            var pointSouthWest = L.point(0, this.height);		
            var pointNorthEast = L.point(this.width, 0);			

            var pointCenter = new L.point(midWidth, midHeight);	
            var latlngCenter = map.unproject(pointCenter, mapMaxZoom);	
            map.setView(latlngCenter, mapMinZoom);



            mapBounds = new L.LatLngBounds(
                map.unproject(pointSouthWest, mapMaxZoom),
                map.unproject(pointNorthEast, mapMaxZoom));

            L.imageOverlay(img.src, mapBounds).addTo(map); 			

            map.setMaxBounds(mapBounds);   	    
            
    }    

    } else {
        preview.src = "";
    }
}  



function addM(POIname, POIinfo, POIlogo, POItags) {
        
    var name_v1 = "id" + String(i);
    i++;
    var name = POIname;
    var marker = new L.marker(map.unproject([midHeight, midWidth], mapMaxZoom), {draggable:true});
    marker.id = name;
    marker.name = POIname;
    marker.info = POIinfo;
    marker.logo = POIlogo;
    marker.tags = POItags;
    marker.pixCoordX = map.project(marker.getLatLng(), mapMaxZoom).x.toString();
    marker.pixCoordY = map.project(marker.getLatLng(), mapMaxZoom).y.toString();
    markerArray.push(marker);
    
    marker.addTo(map).bindPopup("<img src=logo/" + marker.logo + " height=20 width=20 /> Drag me to the right position!").openPopup();
    
    map.setView(new L.LatLng(marker.getLatLng().lat, marker.getLatLng().lng), mapMinZoom);

    marker.on('dragend', function(event) {
    var marker = event.target;  
    var result = marker.getLatLng();  
    marker.pixCoordX = map.project(marker.getLatLng()).x.toString();  
    marker.pixCoordY = map.project(marker.getLatLng()).y.toString();  
    marker.bindPopup("<img src=logo/" + marker.logo + " height=20 width=20 />" + marker.name);    
    markerArray[marker.id] = marker;
    
    });   

};


function makeCoordList(){

    // Setze Map-View auf MaxZoom und setze die POI-Koordianten dem Zoomlevel entsprechend neu
    map.setView([midHeight, midWidth], mapMaxZoom);
    
        for( var a = 0; a < markerArray.length; a++){
                markerArray[a].pixCoordX = map.project(markerArray[a].getLatLng(), mapMaxZoom).x.toString();
                markerArray[a].pixCoordY = map.project(markerArray[a].getLatLng(), mapMaxZoom).y.toString();
        }
    
    
    
    
    var textToWrite='{"poi":' + '\n' + "   [" + '\n';


    for( var a = 0; a < markerArray.length; a++){

        var tags = '';
    
            for(var i = 0; i < markerArray[a].tags.length; i++){
    
                if(i < markerArray[a].tags.length-1)    
                    tags = tags + '"' + markerArray[a].tags[i].text + '", '; 
                else
                    tags = tags + '"' + markerArray[a].tags[i].text + '"';
                }
        
        
        
        
        textToWrite = textToWrite + '   {' + '"name": ' + '"' + String(markerArray[a].name) + '"' +  ', '
                + '"beschreibung / info": ' + '"' + String(markerArray[a].info) + '"' +  ', '
                + '"tags": ' + '[' + tags + ']' +  ', '
                + '"koordinate_x": ' + '"' + String(markerArray[a].pixCoordX) + '"' +  ', ' 
                + '"koordinate_y": ' + '"' + String(markerArray[a].pixCoordY) + '"' +  ', '
                + '"logo_filename": ' + '"' + markerArray[a].logo + '"' +  '},' + '\n'; 
    }

    textToWrite= textToWrite + "   ]" + '\n' +'}' + '\n' + '{"positon":' + '\n' + "   [" + '\n';
    
    for( var b = 0; b < markerArrayPos.length; b++){
        
        textToWrite = textToWrite + '   {' + '"code": ' + '"' + String(markerArrayPos[b].positionCode) + '"' +  ', '
                 + '"koordinate_x": ' + '"' + String(markerArrayPos[b].pixCoordX) + '"' +  ', ' 
                 + '"koordinate_y": ' + '"' + String(markerArrayPos[b].pixCoordY) + '"' +  '},' + '\n'; 
    }
    
    textToWrite= textToWrite + "   ]" + '\n' +'}'

    var textFileAsBlob = new Blob([textToWrite], {type:'application/JSON'});
    var fileNameToSaveAs = String('coordinates_name_info.json');

   var downloadLink = document.createElement("a");
   downloadLink.download = fileNameToSaveAs;
   downloadLink.innerHTML = "Download File";
   if (window.webkitURL != null)
   {
        // Chrome allows the link to be clicked
          // without actually adding it to the DOM.
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
   }
   else
   {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
       
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
   }

   downloadLink.click();



};


function configMarkPos (){
    
    var redMarkerIcon = new L.icon({
        iconUrl: 'marker_red.png',
        
        iconSize:     [65, 65], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [10, -76] // point from which the popup should open relative to the iconAnchor
    });
    
    var code;
    var currentNum = countCodes - 1;
    
    if(countCodes < 10){

        code = "000" + countCodes;
        countCodes++;
    }
    
    if(countCodes >= 10 && countCodes < 100){

        code = "00" + countCodes;
        countCodes++;
    }
    
    if(countCodes >= 100 && countCodes < 1000){

        code = "0" + countCodes;
        countCodes++;
    }
    
    if(countCodes >= 1000){

        code = countCodes;
        countCodes++;
    }
    
    var marker = new L.marker(map.unproject([midHeight, midWidth], mapMaxZoom), {draggable:true, icon:redMarkerIcon} );
        
    marker.positionCode = code;
    marker.num = currentNum;
    marker.pixCoordX = map.project(marker.getLatLng()).x.toString();  
    marker.pixCoordY = map.project(marker.getLatLng()).y.toString(); 
    
    markerArrayPos.push(marker);
    
    marker.addTo(map).bindPopup(String(marker.positionCode)).openPopup();
    
    map.setView(new L.LatLng(marker.getLatLng().lat, marker.getLatLng().lng), mapMaxZoom);
    
    marker.on('dragend', function(event) {
    var marker = event.target;  
    var result = marker.getLatLng(); 
    marker.pixCoordX = map.project(marker.getLatLng()).x.toString();  
    marker.pixCoordY = map.project(marker.getLatLng()).y.toString();  
    marker.bindPopup(String(marker.positionCode));    

    markerArrayPos[marker.num] = marker;
    });  
    
};
