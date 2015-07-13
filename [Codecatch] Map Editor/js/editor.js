// Load the map file into the editor by this function

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


            //optionally the zoom-levels can be adjusted by the image size
            
            //var mapMinZoom = (this.width/window.innerWidth)/2 + 1;
            //var mapMaxZoom = this.width/window.innerWidth + 1;    
            var mapMinZoom = 0;
            var mapMaxZoom = 4;

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


// Use this function to add POI-Markers, the arguments of this function will be typed in to the angular.js-modal

function addM(POIname, POIinfo, POIlogo, POItags) {
        
    //Definition of marker
    
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
    
    //Adding marker to map
    
    marker.addTo(map).bindPopup("<img src=logo/" + marker.logo + " height=20 width=20 /> Drag me to the right position!").openPopup();
    
    //Set view to the right position in order to have the marker in your field of view
    
    map.setView(new L.LatLng(marker.getLatLng().lat, marker.getLatLng().lng), mapMinZoom);

    // Define the 'dragend'-event in order to write the new coordinates of the marker into the array
    
    marker.on('dragend', function(event) {
    var marker = event.target;  
    var result = marker.getLatLng();  
    marker.pixCoordX = map.project(marker.getLatLng(), mapMaxZoom).x.toString();  
    marker.pixCoordY = map.project(marker.getLatLng(), mapMaxZoom).y.toString();  
    marker.bindPopup("<img src=logo/" + marker.logo + " height=20 width=20 />" + marker.name);    
    markerArray[marker.id] = marker;
    
    });   

};


//Use this function to download the JSON-file containing the information of POI- and position-markers

function makeCoordList(){

        // Get all current coordinates of both the POI- and Position-markers at the maximum zoom level to guarantee a correct integration into the Codecatch-App
    
        for( var a = 0; a < markerArray.length; a++){
                markerArray[a].pixCoordX = map.project(markerArray[a].getLatLng(), mapMaxZoom).x.toString();
                markerArray[a].pixCoordY = map.project(markerArray[a].getLatLng(), mapMaxZoom).y.toString();
        }
    
        for( var a = 0; a < markerArrayPos.length; a++){
                markerArrayPos[a].pixCoordX = map.project(markerArrayPos[a].getLatLng(), mapMaxZoom).x.toString();
                markerArrayPos[a].pixCoordY = map.project(markerArrayPos[a].getLatLng(), mapMaxZoom).y.toString();
        }
    
    
    
    // Start of the JSON-file content
    var textToWrite='{"poi":' + '\n' + "   [" + '\n';


    // Get all the necessary marker information and write them into a form compatible with JSON syntax
    for( var a = 0; a < markerArray.length-1; a++){

        var tags = '';
    
            for(var i = 0; i < markerArray[a].tags.length; i++){
    
                if(i < markerArray[a].tags.length-1)    
                    tags = tags + '"' + markerArray[a].tags[i].text + '", '; 
                else
                    tags = tags + '"' + markerArray[a].tags[i].text + '"';
                }
        

        
        textToWrite = textToWrite + '   {' + '"name": ' + '"' + String(markerArray[a].name) + '"' +  ', '
                + '"beschreibung": ' + '"' + String(markerArray[a].info) + '"' +  ', '
                + '"tags": ' + '[' + tags + ']' +  ', '
                + '"x": ' + '"' + String(markerArray[a].pixCoordX) + '"' +  ', ' 
                + '"y": ' + '"' + String(markerArray[a].pixCoordY) + '"' +  ', '
                + '"logoName": ' + '"' + markerArray[a].logo + '"' +  '},' + '\n'; 
    }
    
    
    // This section is supposed for the last array element only
    if(markerArray.length > 0){
        
        var tagsOfLastMarker = '';
        
        
            for(var i = 0; i < markerArray[markerArray.length - 1].tags.length; i++){
    
                if(i < markerArray[markerArray.length - 1].tags.length-1)    
              
                    
                    tagsOfLastMarker = tagsOfLastMarker + '"' + markerArray[markerArray.length - 1].tags[i].text + '", '; 
                else
                    tagsOfLastMarker = tagsOfLastMarker + '"' + markerArray[markerArray.length - 1].tags[i].text + '"';
                }
    
    
        textToWrite = textToWrite + '   {' + '"name": ' + '"' + String(markerArray[markerArray.length-1].name) +'"'+', '
            + '"beschreibung": ' + '"' + String(markerArray[markerArray.length-1].info) + '"' +  ', '
            + '"tags": ' + '[' + tagsOfLastMarker + ']' +  ', '
            + '"x": ' + '"' + String(markerArray[markerArray.length-1].pixCoordX) + '"' +  ', ' 
            + '"y": ' + '"' + String(markerArray[markerArray.length-1].pixCoordY) + '"' +  ', '
            + '"logoName": ' + '"' + markerArray[markerArray.length-1].logo + '"' +  '}' + '\n'; 
    }

    textToWrite= textToWrite + "   ]," + '\n' + '\n' + '"position":' + '\n' + "   [" + '\n';
    
    
    if(markerArrayPos.length > 0){
    
    // Write all information about the Position-marker into the text
    for( var b = 0; b < markerArrayPos.length - 1 ; b++){
        
        textToWrite = textToWrite + '   {' + '"posCode": ' + '"' + String(markerArrayPos[b].positionCode) + '"' +  ', '
                 + '"x": ' + '"' + String(markerArrayPos[b].pixCoordX) + '"' +  ', ' 
                 + '"y": ' + '"' + String(markerArrayPos[b].pixCoordY) + '"' +  ','
                 + '"text": "You Are Here!"' + '},' + '\n'; 
    }
    
    
        textToWrite = textToWrite + '   {' + '"posCode": ' + '"' + String(markerArrayPos[markerArrayPos.length - 1].positionCode) + '"' +  ', '
             + '"x": ' + '"' + String(markerArrayPos[markerArrayPos.length - 1].pixCoordX) + '"' +  ', ' 
             + '"y": ' + '"' + String(markerArrayPos[markerArrayPos.length - 1].pixCoordY) + '"' +  ','
             + '"text": "You Are Here!"' + '}' + '\n'; 
    }
    
    textToWrite= textToWrite + "   ]" + '\n' +'}';
    
    
    
    // Writing the text into a 'Blob' and preparing it for the download

    var textFileAsBlob = new Blob([textToWrite], {type:'application/JSON'});
    var fileNameToSaveAs = String('jsonData.json');

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

// This function will be used to add Position-markers to the map
function configMarkPos (){
    
    var redMarkerIcon = new L.icon({
        iconUrl: 'marker_red.png',
        
        //currently no shadow included
        
        iconSize:     [65, 65], // size of the icon
        //shadowSize:   [50, 64], // size of the shadow, not included
        iconAnchor:   [32, 65], // point of the icon which will correspond to marker's location
        //shadowAnchor: [4, 62],  // the same for the shadow, not included
        popupAnchor:  [1, -49] // point from which the popup should open relative to the iconAnchor
    });
    
    var code;
    var currentNum = countCodes - 1;
    
    // This section adds the code to the Position-marker, assuming that there will be not more than 9999 markers on the map
    
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
    
    // Finally marker will be added to the map
    var marker = new L.marker(map.unproject([midHeight, midWidth], mapMaxZoom), {draggable:true, icon:redMarkerIcon} );
        
    marker.positionCode = code;
    marker.num = currentNum;
    marker.pixCoordX = map.project(marker.getLatLng(), mapMaxZoom).x.toString();  
    marker.pixCoordY = map.project(marker.getLatLng(), mapMaxZoom).y.toString(); 
    
    markerArrayPos.push(marker);
    
    marker.addTo(map).bindPopup(String(marker.positionCode)).openPopup();
    
    map.setView(new L.LatLng(marker.getLatLng().lat, marker.getLatLng().lng), mapMinZoom);
    
    
    // Definition of 'dragend'-event
    marker.on('dragend', function(event) {
    var marker = event.target;  
    var result = marker.getLatLng(); 
    marker.pixCoordX = map.project(marker.getLatLng(), mapMaxZoom).x.toString();  
    marker.pixCoordY = map.project(marker.getLatLng(), mapMaxZoom).y.toString();  
    marker.bindPopup(String(marker.positionCode));    

    markerArrayPos[marker.num] = marker;
    });  
    
};


// This function is used to invoke the browser's print function, more configs have to be done to the print options in order to get the full map on the page
// the idea is to get a pdf-file giving information about the location where to place the code signs
function printdiv(printpage) {
    
    for( var b = 0; b < markerArrayPos.length; b++){
    
        markerArrayPos[b].openPopup();
    }
    
    //map.setView([midHeight, midWidth], mapMinZoom);
    
    
    // The section containing the map and the markers will be set to the entire html page,
    // by saving the old status it is possible to reset the old design, nonetheless the map will not be editable anymore
    // Only use this function when you are sure that no more changes have to be done to the map
    
    
    var headstr = "<html><head><title></title></head><body>";
    var footstr = "</body>";
    var newstr = document.all.item(printpage).innerHTML;
    var oldstr = document.body.innerHTML;
    document.body.innerHTML = headstr+newstr+footstr;
    window.print();
    document.body.innerHTML = oldstr;
    return false;
    
};
