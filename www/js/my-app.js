// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});


$$(document).on('deviceready', function() {
    fetchDailyImg();


});


//NASA API:
//https://api.nasa.gov/planetary/apod?api_key=dvRrFhqcqaccZSEXI9Aaf22RKsciZsMvDnoR10J0

function fetchDailyImg(){

    $.ajax({
        method: "GET",
        url: "https://api.nasa.gov/planetary/apod?api_key=dvRrFhqcqaccZSEXI9Aaf22RKsciZsMvDnoR10J0"

    }).done(function(data){
        //console.log(data);

        $('#spin').css('display','none');


        var APD = '';

            APD+= `

            <div class="card demo-card-header-pic">
                    <div class="item-media">
                        <h1 id="mtitle">${data.title}</h1>
                        <img id="poster" src="${data.url}"/>
                    </div>
                    <div class="card-content">
                        <div class="card-content-inner">
                            <p><b>Taken By:</b> ${data.copyright}
                            <br>${data.date}
                            </p>
                            <hr>
                            <p>${data.explanation}</p>
                        </div>
                    </div>
                </div>
            `;

            $('#APD').html(APD);
    });
}



myApp.onPageInit('earth', function (page) {

    fetchEarth();

});

function fetchEarth(){

    //to get the img archive
    // https://epic.gsfc.nasa.gov/archive/natural/2015/10/31/png/epic_1b_20151031074844.png

    $.ajax({
        method: "GET",
        url: "https://api.nasa.gov/EPIC/api/enhanced/date/2018-12-31?api_key=dvRrFhqcqaccZSEXI9Aaf22RKsciZsMvDnoR10J0"

    }).done(function(data){
        console.log(data);

        $('#spin').css('display','none');

       var Ephoto = '';


        Ephoto+= `
                <h1>Most Recent Earth Image Gallery</h1>
                <h4>This image was taken by NASA's EPIC camera onboard the NOAA DSCOVR spacecraft</h4>
                `;



        $.each(data, function(index, earth){
            console.log(earth);

            var img = earth.image;
            console.log(img + ".png");
            var imgArchive = "https://epic.gsfc.nasa.gov/archive/enhanced/2018/12/31/png/" +img+ ".png";

            Ephoto+= `
            <li>
             <div class="card demo-card-header-pic">
                    <div class="item-media">
                        <h1 id="mtitle">${earth.date}</h1>
                        <img id="poster" src="${imgArchive}"/>
                    </div>
                    <div class="card-content">
                        <div class="card-content-inner">
                            <p><b>Centroid Coordinates:</b></p>
                            <p>Latitude:${earth.centroid_coordinates.lat}</p>
                            <p>Longitude:${earth.centroid_coordinates.lon}</p>
                            <hr>
                        </div>
                    </div>
                </div>
            </li>
            `;

            $('#earthPhoto').html(Ephoto);

        });

    });
}



myApp.onPageInit('asteroids', function (page) {

    $('#asteroidForm').on("submit", function(e){

        var searchDate = $('#asteroidDate').val();

        fetchAsteroids(searchDate);


        e.preventDefault();
    });

});


function fetchAsteroids(searchDate){

    //Searchdate must be YYYY-MM-DD
    $.ajax({
        method: "GET",
        url: "https://api.nasa.gov/neo/rest/v1/feed?api_key=dvRrFhqcqaccZSEXI9Aaf22RKsciZsMvDnoR10J0&start_date=" + searchDate + "&end_date="

    }).done(function(data){



        $('#spin').css('display','none');

        if(data.Response == "false"){
            myApp.alert('Enter a valid date in format yyyy-mm-dd', 'Reminder!');
        }

        //console.log(data.near_earth_objects);
        var neoObj = data.near_earth_objects;

        var asteroidList = '';

        

        $.each(neoObj, function(index, asteroid){
            //console.log("I am the asteroid" + asteroid);
            //console.log(asteroid);

            var NEOarray = asteroid[0];



            var NEOCAD = NEOarray.close_approach_data;
            NEOCAD = NEOCAD[0];



            var NEOCADdate = NEOCAD.close_approach_date;

            var NEOMISS = NEOCAD.miss_distance.kilometers;


            asteroidList+= `
            <li>
             <a href="asteroidInfo.html" class="item-link item-content" onclick="clickedAsteroid('${NEOarray.links.self}')">
                 <div class="item-media"></div>
                 <div class="item-inner">
                     <div class="item-title-row">
                        <div class="item-title">${NEOCADdate}</div>
                        <div class="item-after">${NEOMISS}Km</div>
                     </div>
                 </div>
              </a>
            </li>
            `;

            $('#asteroidList').html(asteroidList);
        });
    });
}


//this logs the imdbID from the onclick function in the movieList and stores it
function clickedAsteroid(link){
    //console.log(link);
    sessionStorage.setItem("AsteroidLink", link);
}


myApp.onPageInit('asteroidInfo', function (page) {

    //retrieving the store information on another page
    var link = sessionStorage.getItem("AsteroidLink");

    asteroidDetails(link);


})


//to display the information on the next page
function asteroidDetails(link){
    $.ajax({
        method: "GET",
        url: link

    }).done(function(response) {
        console.log(response);
        //console.log(response.estimated_diameter.meters.estimated_diameter_max);
        var Approachdata = response.close_approach_data;
        //console.log(Approachdata);
        var aprDetails = '';



        var aDetails = `
                <div class="card demo-card-header-pic">
                    <div class="item-media"><h1 id="mtitle">ID: ${response.id}</h1></div>
                    <div class="card-content">
                        <div class="card-content-inner">
                            <p><b>Estimated Diameter:</b> ${response.estimated_diameter.meters.estimated_diameter_max}m
                            <p><b>Hazardous:</b> ${response.is_potentially_hazardous_asteroid}
                            
                        `;

                            $.each(Approachdata, function(index, response){
        aprDetails += `
                        <tr>
                            <td>${response.close_approach_date}</td>
                            <td>${response.miss_distance.kilometers}Km</td>
                            <td>${response.relative_velocity.kilometers_per_hour}km/h</td>
                        </tr>
                        
                            `;

                             });



        $('#asteroidInfo1').html(aDetails);
        $('#asteroidInfo2').append(aprDetails);


    });
}
