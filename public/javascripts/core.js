$("#coor_k").val(Math.random() + 12);
$("#coor_B").val(Math.random() + 107);
var mapOptions = {
    center: new google.maps.LatLng(37.5074627, 127.0305232),
    zoom: 11
};
var map = new google.maps.Map(document.getElementById("map"), mapOptions);
var panorama = map.getStreetView();
//streetview보기
var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();

var socket = io.connect('http://localhost');
var coordinate = '';
var socket_id = '';
//회원번호알려주기위해서 socket id 
var time = '';
var allFlightPath = [];
var allMarkerStress = [];
var streetLineStatus = 0;
var markers = [];
var position_from = [],
    infowindow = [];
serverUserTime = 0;
createGroup = 0;
room_id = '';
function getServerUser() {
    socket.on("server_user", function(server_user) {
        if (serverUserTime == 0) {
            for (var i = 0; i < server_user.length; i++) {
                data_user = server_user[i];
                makeMarkerUser(data_user, server_user[i].id);
            }
            serverUserTime = 1;
        }
    });
}

$(function() {
    $('.fe_temp_bar').css('background-color',rgb(160,160,160));
    //jquery
    socket.on("invite_room", function(id, invite_room_id) {
        if (socket_id == id) {
            $("#invite_form").show();
        }
        $("#invite_form #no").click(function() {
            $("#invite_form").hide();
        });
        $("#invite_form #yes").click(function() {
            room_id = invite_room_id;
            socket.emit("status_invited_room", id, invite_room_id, 1);
            $("#invite_form").hide();
        });
    });  //만약 더블클릭으로 초대했을때 나오는 펑션

    getServerUser();
    socket.on("user_connection", function(id) {
        if (socket_id == '') {
            socket_id = id;
        }
    });

    $("#send_message").click(function() {
        data_message = {
            id: socket_id,
            message: $("#chat_message").val(),
            name: $("#user_name").val()
        };
        $("#chat_message").val("");
        socket.emit("message", data_message);
    });
    //이위에는 send누르면 message보내는거 

    $("#world, .chat_area").css({
            display: "block"
    });
    $(".top-right").css({
         display:"block"
    });
    socket.on("message", function(data_message) {
        $("#message").html($("#message").html() + "<b>" + data_message.name + "</b>: " + data_message.message + "<br/>");

        
        if (time != '') {
            clearTimeout(time);
        }
        setTimeout(function() {
            infowindow[data_message.id].setContent("<b>" + data_message.name + "</b>");
        }, 5000); 
        
    });
 
    google.maps.event.addListener(panorama, 'visible_changed', function() {
        streetview = {};
        if (panorama.getVisible()) {
            streetview.show = 1;
            streetview.getPano = panorama.getPano();
            streetview.getPov = panorama.getPov();
            streetview.getPosition = panorama.getPosition();
            streetview.getZoom = panorama.getZoom();
        } else {
            streetview.show = 0;
        }
        socket.emit("event_room", room_id, "streetview", streetview);
    });

    function streetview_changed(panorama) {
        streetview = {};
        streetview.show = 1;
        streetview.getPano = panorama.getPano();
        streetview.getPov = panorama.getPov();
        streetview.getPosition = panorama.getPosition();
        streetview.getZoom = panorama.getZoom();
        socket.emit("event_room", room_id, "streetview", streetview);
    }
    google.maps.event.addListener(panorama, 'position_changed', function() {
        streetview_changed(panorama);
    });
    google.maps.event.addListener(panorama, 'pov_changed', function() {
        streetview_changed(panorama);
    });
    google.maps.event.addListener(panorama, 'zoom_changed', function() {
        streetview_changed(panorama);
    });

    $("#createroom").click(function(event) {
        if (createGroup == 0 && room_id == '') {
            room_id = Math.random().toString(36).substring(7);
            socket.emit("create_room", room_id);
            createGroup = 1;
            $("#room_message").html("Created new room<br/>");
        }
        $("#world").css({
            display: "none"
        });
        $("#room").css({
            display: "block"
        });
        return false;
    });
    $("#send_room_message").click(function(event) {
        var data_message = {
            message: $("#chat_room_message").val(),
            name: $("#user_name").val()
        }
        socket.emit("room_message", room_id, data_message);
        $("#chat_room_message").val("");
        console.log(room_id);
        //console.log(data_message);
    });
    socket.on("room_message", function(data_message) {
        $("#room_message").html($("#room_message").html() + "<b>" + data_message.name + "</b>: " + data_message.message + "<br/>");
    })
});

function travel(from, to) {
    for (var i = 0; i < Math.max(allFlightPath.length, allMarkerStress.length); i++) {
        if (typeof(allFlightPath[i]) !== undefined) {
            allFlightPath[i].setMap(null);
        }
        if (typeof(allMarkerStress[i]) !== undefined) {
            allMarkerStress[i].setMap(null);
        }
    }
    allFlightPath = [];
    allMarkerStress = [];
    for (var i = 0; i < from.length; i++) {
        var request = {
            origin: new google.maps.LatLng(from[i][0], from[i][1]),
            destination: new google.maps.LatLng(to[0], to[1]), //lat, lng
            travelMode: google.maps.TravelMode["WALKING"]
        };
        directionsService.route(request, function(response, status) {
            var flightPath = '',
                marker_stress = '';
            if (status == google.maps.DirectionsStatus.OK) {
                data = response.routes[0].overview_path;
                color = "#ff0000";
                opacity = 1;

                flightPath = new google.maps.Polyline({
                    path: data,
                    geodesic: true,
                    strokeColor: color,
                    strokeOpacity: opacity,
                    strokeWeight: 2,
                    map: map
                });
                flightPath.setMap(map);
                marker_stress = new google.maps.Marker({
                    position: new google.maps.LatLng(data[data.length - 1].k, data[data.length - 1].B),
                    icon: "http://icons.iconarchive.com/icons/fatcow/farm-fresh/32/hand-point-270-icon.png"
                });
                marker_stress.setMap(map);
                allFlightPath.push(flightPath);
                allMarkerStress.push(marker_stress);
            }
        });
    }
}
