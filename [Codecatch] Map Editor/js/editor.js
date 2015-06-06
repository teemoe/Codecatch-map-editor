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
    mapBounds = new L.LatLngBounds(
    map.unproject([0, this.height], mapMaxZoom),
    map.unproject([this.width, 0], mapMaxZoom));


    imageBounds = [map.unproject([0, this.height], mapMaxZoom), map.unproject([this.width, 0], mapMaxZoom)];

    L.imageOverlay(img.src, imageBounds).addTo(map);

    map.fitBounds(imageBounds);      
    }    

    } else {
        preview.src = "";
    }
}  




function addM(POIname, POIinfo) {
    
    var name_v1 = "id" + String(i);
    i++;
    var name = POIname;
    var marker = new L.marker(map.unproject([midHeight, midWidth], mapMaxZoom), {draggable:true});
    marker.id = name;
    marker.name = POIname;
    marker.info = POIinfo;
    marker.pixCoordX = map.project(marker.getLatLng(), mapMinZoom).x.toString();
    marker.pixCoordY = map.project(marker.getLatLng(), mapMinZoom).y.toString();
    markerArray.push(marker);
    marker.addTo(map).bindPopup("Drag me to the right position!").openPopup();

    marker.on('dragend', function(event) {
    var marker = event.target;  // you could also simply access the marker through the closure
    var result = marker.getLatLng();  // but using the passed event is cleaner
    marker.pixCoordX = map.project(marker.getLatLng()).x.toString();  
    marker.pixCoordY = map.project(marker.getLatLng()).y.toString();  
    marker.bindPopup(marker.name);    

    markerArray[marker.id] = marker;
    });   

};


function makeCoordList(){

    var textToWrite="[" + '\n';


    for( var a = 0; a < markerArray.length; a++){

        textToWrite = textToWrite + '{' + '"name": ' + '"' + String(markerArray[a].name) + '"' +  ', '
                + '"beschreibung / info": ' + '"' + String(markerArray[a].info) + '"' +  ', '
                + '"koordinate_x": ' + '"' + String(markerArray[a].pixCoordX) + '"' +  ', ' 
                + '"koordinate_y": ' + '"' + String(markerArray[a].pixCoordY) + '"' +  '},' + '\n';
    }

    textToWrite= textToWrite + "]";

    var textFileAsBlob = new Blob([textToWrite], {type:'application/JSON'});
    var fileNameToSaveAs = String('coordinates_name_info');

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
      downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
   }

   downloadLink.click();



};