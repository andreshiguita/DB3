var methods = new Array();
methods[0] = "method=Autenticacion";
methods[1] = "method=RecuperarClave";
methods[2] = "method=ListarTicketUsuario";
methods[3] = "method=OpcionesGestionReparaccion";
methods[4] = "method=DatosTicket";
methods[5] = "method=AbrirReparacion";
methods[6] = "method=RutaTicket";
methods[7] = "method=ModuloEquipoTicket";
methods[8] = "method=CodigoProblemaModuloEquipoTicket";
methods[9] = "method=Causal";
methods[10] = "method=CodigoCierre";
methods[11] = "method=CodigoReparacion";
methods[12] = "method=CerrarModuloEquipoTicket";
methods[13] = "method=CerrarReparacion";
methods[14] = "method=ParteModuloEquipoTicket";
methods[15] = "method=CerrarParteModuloEquipoTicket";
methods[16] = "method=StatusXMS";
methods[17] = "method=StatusXMSDetalle";
methods[18] = "method=Acepta";
methods[19] = "method=ResponderNovedad";
methods[20] = "method=CheckList";
methods[21] = "method=RegistroCheckList";
methods[22] = "method=NovedadTicket";
methods[24] = "method=BusquedaParte";
methods[25] = "method=NovedadSistema";
methods[26] = "method=IngenierosEnZona";
methods[27] = "method=ServiciosIngeniero";
methods[28] = "method=CambioIngeniero";
methods[29] = "method=RegistroNovedad";
methods[30] = "method=ObtenerNovedad";
methods[31] = "method=NovedadAlmacen";
methods[32] = "method=DevuelvePartes";
methods[33] = "method=SolicitarPartes";
methods[34] = "method=RecibePartes";
methods[35] = "method=RegistroPosicion";
methods[36] = "method=EnTransito";
methods[37] = "method=ModuloEquipo";
methods[38] = "method=AgregarModulo";
methods[39] = "method=ListarActividadesRelacionadas";
methods[40] = "method=ObtenerActividadRelacionada";
methods[41] = "method=ListarPartesSolicitadas";
methods[42] = "method=ListarNovedadAsignacion";
methods[43] = "method=ListarNovedadNoLeidasUsuario";
methods[44] = "method=SolicitarHistorial";
methods[45] = "method=MarcarNovedadLeida";
methods[46] = "method=ResumenCierre";
methods[47] = "method=NovedadAlmacenGeneral";
methods[48] = "method=EliminarParteSolicitud";
methods[49] = "method=ObtenerReparacionModulosVistaPrevia";


var movil = "movil=3183592508", url1, url, map;

//Define el tipo de entorno de publicación:
//d = Desarrollo
//b = Pruebas
//a = Producción
var entorno = "a";
switch(entorno)
{
case "d":
    //Dirección Proxy Desarrollo
    url = "http://localhost/db3/app/?callback=?";
    url1 = "http://localhost/db3/app/";
break;
case "b":
    //Dirección Pública Proxy Pruebas
    url = "http://190.242.36.105/app/?callback=?";
    url1 = "http://190.242.36.105/app/";
break;
case "a":
    //Dirección üblica Proxy Producción
    url1 = "http://www.dbdmobilesar.com/app/";
    url = "http://www.dbdmobilesar.com/app/?callback=?";
break;
default:
    //Dirección Proxy Desarrollo
    url = "http://localhost/db3/app/?callback=?";
    url1 = "http://localhost/db3/app/";
};

//***************************location***********************
function echoMovilidad(){
    setInterval(
        function(){
            capturePosition();
        },300000);
}

function capturePosition() {
    navigator.geolocation.getCurrentPosition(
        onPositionSucces,
        onPositionError
    );
}

function onPositionSucces(position){
    registroPosicion(position.coords.latitude, position.coords.longitude);
}

function onPositionError(error){
    $('.busqueda').html('');
    $('.busqueda').append(
                'echo error' +
                'code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n'
    );
}

function registroPosicion(latitude, longitude) {
    var key = "idUsuario",
        formdata;
    formdata = methods[35]+"&"+key+"="+sessionStorage.getItem(key)+"&latitud="+latitude+"&longitud="+longitude;
    $.getJSON(url, formdata, function(json) {
    $('.busqueda').html('');
        $.mobile.loading('hide');
        if(!json.hasOwnProperty('success')){
            if (json.SATISFACTORIO === "True") {
                if(json.TIENEMENSAJES === 'True'){
                    var mensaje = 'tienes '+json.CANTIDADMENSAJES+' mensajes, deseas leerlos';
                    $("#page3 li #cantidad-mensajes").html('');
                    $("#page3 li #cantidad-mensajes").append(json.CANTIDADMENSAJES);
                    if(sessionStorage.getItem("mensaje") === 'inactivo'){
                        navigator.notification.confirm(mensaje, aceptaMensajes, 'mensajes', 'ok, cancel');
                        // alert('mensaje');
                        sessionStorage.setItem("mensaje",'activo');
                    }
                }
                $('.busqueda').append(
                    'Enviando lat:' + latitude + ', lon: ' + longitude
                );
            }else{
                $('.busqueda').append(
                    'Posición no disponible'
                );
            }
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else{
            $.mobile.loading('hide');
        }
    });
}

function aceptaMensajes (button) {
    if(button==1){
        sessionStorage.setItem("mensaje",'inactivo');
        $.mobile.changePage($("#page40"),{transition:"none"});
    }
}

//autenticacion
var admin = 'False';
function autentication(formData) {
    sessionStorage.clear();
    formData = formData+"&"+methods[0]+"&"+movil;
    $.ajax({
        url: url1,
        type: "POST",
        crossDomain: true,
        data: formData,
        dataType: 'text json',
        success: function(json) {
            $.mobile.loading('hide');
            if(!json.hasOwnProperty('success')){
                if (json.SATISFACTORIA === 'True') {
                    if (json.ADMINISTRADOR === 'True'){
                        admin = json.ADMINISTRADOR;
                        $('#menu4').show();
                    }
                    sessionStorage.setItem("idUsuario",json.IDUSUARIO);
                    sessionStorage.setItem("mensaje",'inactivo');
                    $.mobile.changePage($("#page3"),{transition:"none"});
                    $('#textinput1').val('');
                    $('#textinput2').val('');
                    capturePosition();
                    echoMovilidad();
                    registroPosicion(5, -74);
                }else{
                    alert("usuario NO valido");
                }
                $('#btn-login').button('enable');
            }else if(json.success === 'error'){
                alert("error de conexión");
                $.mobile.loading('hide');
                $('#btn-login').button('enable');
            }else{
                $.mobile.loading('hide');
                $('#btn-login').button('enable');
            }
        }
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
        $('#btn-login').button('enable');
    });
}

//recuperar password
function recoveryPass(formData) {
    formData = formData+"&"+methods[1]+"&"+movil;
    $.ajax({
        url: url1,
        type: "POST",
        crossDomain: true,
        data: formData,
        dataType: 'text json',
        success: function(json) {
            $.mobile.loading('hide');
            if(!json.hasOwnProperty('success')){
                if(json.USUARIOVALIDO  === "True"){
                    if(json.CORREOENVIADO  === "True"){
                        alert("se ha enviado un correo");
                    }else {
                        alert("No se pudo enviar correo");
                    }
                }else{
                    alert("usuario NO valido");
                }
            }else if(json.success === 'error'){
                alert("error de conexión");
                $.mobile.loading('hide');
            }else {
                $.mobile.loading('hide');
            }
        }
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

//-----------menu gestionar ----------------listar tickets
function listTicket(){
    var ticket, idReparacion, $page = $("#page7 div[data-role='content']"), key = "idUsuario",
        formData = methods[2]+"&"+key+"="+sessionStorage.getItem(key), lista = "";
        $page.html('');
    $.getJSON(url, formData, function(json) {
        if(!json.hasOwnProperty('success')){
            $.mobile.loading('hide');
            var estado, abrir;
            $page.append(
                '<ul data-role="listview" data-divider-theme="b" data-inset="true" class="tickets"></ul>');
            if(json[0] === undefined){
                ticket = json.IDTICKET;
                    idReparacion = json.IDREPARACION;
                    abrir = json.ACCION;
                    if(json.VALOR === "1"){
                        estado = "verde.png";
                    }else if(json.VALOR === "2"){
                        estado = "amarillo.png";
                    }else{
                        estado = "rojo.png";
                    }
                    lista +=
                        '<li data-theme="c" data-idticket='+ticket+' data-idreparacion='+idReparacion+'>'+
                            '<a href="" data-transition="none" data-icon="arrow-r">'+
                                '<img src="img/'+estado+'" style="margin-top:40%; margin-left:2%"/>'+
                                '<h3>Ticket # '+ticket+'</h3>'+
                                '<p >'+
                                    '<br> '+abrir+' <br> '+
                                    json.ESTIMADO+'</p></a>'+
                            '</li>'
                    ;
            }else{
                for(var module in json){
                    ticket = json[module].IDTICKET;
                    idReparacion = json[module].IDREPARACION;
                    abrir = json[module].ACCION;
                    if(json[module].VALOR === "1"){
                        estado = "verde.png";
                    }else if(json[module].VALOR === "2"){
                        estado = "amarillo.png";
                    }else{
                        estado = "rojo.png";
                    }
                    lista +=
                        '<li data-theme="c" data-idticket='+ticket+' data-idreparacion='+idReparacion+'>'+
                            '<a href="" data-transition="none" data-icon="arrow-r">'+
                                '<img src="img/'+estado+'" style="margin-top:40%; margin-left:2%"/>'+
                                '<h3>Ticket # '+ticket+'</h3>'+
                                '<p >'+
                                    '<br> '+abrir+' <br> '+
                                    json[module].ESTIMADO+'</p></a>'+
                            '</li>'
                    ;
                }
            }
            $("#page7 div[data-role='content'] ul").html(lista);
            $(".tickets").listview({
                create: function(event, ui) {
                  $(".tickets li").click(function(event){
                        sessionStorage.setItem("idTicket", $(this).data('idticket'));
                        sessionStorage.setItem("idReparacion", $(this).data('idreparacion'));
                        $('div.titulo-reporte-servicio').html('');
                        $('div.titulo-reporte-servicio').append('<p><strong>'+
                            'Ticket#: '+sessionStorage.getItem("idTicket")+
                            '</strong></p>'
                        );
                        $.mobile.loading('show');
                        sessionStorage.removeItem('modulo');
                        reloadMenuOption();
                    });
                }
            });
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}
function loadNumService(){
    var indice = 0,
        idReparacion,
        key = "idUsuario",
        formData = methods[2]+"&"+key+"="+sessionStorage.getItem(key);
    $.getJSON(url, formData, function(json){
        $.mobile.loading('hide');
        if(!json.hasOwnProperty('success')){
            if(json[0] === undefined){
                indice++;
            }else{
                for(var module in json){
                    indice++;
                }
            }
        }
        $("li span#num-servicios").html('');
        $("li span#num-servicios").append(indice);
    });
}

//gestionar operaciones ----------------------PENDIENTE es el que carga el menu dinamicamente segun rol
function opcionesGestionReparaccion(){
    $.mobile.loading('show');
    var key = "idTicket", lista = "",
        $page = $('#page5 div[data-role="content"] #list-service');
        formData = methods[3]+"&"+key+"="+sessionStorage.getItem(key);
        $page.html('');
    $.getJSON(url, formData, function(json){
        if(!json.hasOwnProperty('success')){
            cantidadTareas();
            if(json[0] === undefined){
                lista +='<li data-role="list-divider" role="heading">'+
                                    json.NOMBRE+
                                '</li>';
                    if(json.MENUSHIJOS.MENUHIJO[0] === undefined){
                        navega = json.MENUSHIJOS.MENUHIJO.NAVEGACIONMOVILIDAD;
                        if(typeof(navega) === 'object'){
                            navega = '';
                        }
                        lista += '<li data-theme="c" id="acciones-'+json.MENUSHIJOS.MENUHIJO.NAVEGACIONMOVILIDAD+'" >'+
                                '<a id="acc-a'+json.MENUSHIJOS.MENUHIJO.NAVEGACIONMOVILIDAD+'" href="#'+navega+'" data-transition="none">'+
                                    json.MENUSHIJOS.MENUHIJO.NOMBRE+
                                '</a>'+
                            '</li>';
                    }else{
                    for(var j in json.MENUSHIJOS.MENUHIJO){
                        navega = json.MENUSHIJOS.MENUHIJO[j].NAVEGACIONMOVILIDAD;
                        if(typeof(navega) === 'object'){
                            navega = '';
                        }
                        lista +='<li data-theme="c" id="acciones-'+json.MENUSHIJOS.MENUHIJO[j].NAVEGACIONMOVILIDAD+'" >'+
                                '<a id="acc-a'+json.MENUSHIJOS.MENUHIJO[j].NAVEGACIONMOVILIDAD+'" href="#'+navega+'" data-transition="none">'+
                                    json.MENUSHIJOS.MENUHIJO[j].NOMBRE+
                                '</a>'+
                            '</li>';
                        }
                    }
                    $page.html(lista);
                    $page.find('#acc-apage12').append('<span class="ui-li-count" id="num-tareas"></span>');
            }else{
                for(var i in json){
                    lista +='<li data-role="list-divider" role="heading">'+
                                    json[i].NOMBRE+
                                '</li>';
                    if(json[i].MENUSHIJOS.MENUHIJO[0] === undefined){
                        navega = json[i].MENUSHIJOS.MENUHIJO.NAVEGACIONMOVILIDAD;
                        if(typeof(navega) === 'object'){
                            navega = '';
                        }
                        lista += '<li data-theme="c" id="acciones-'+json[i].MENUSHIJOS.MENUHIJO.NAVEGACIONMOVILIDAD+'" >'+
                                '<a id="acc-a'+json[i].MENUSHIJOS.MENUHIJO.NAVEGACIONMOVILIDAD+'" href="#'+navega+'" data-transition="none">'+
                                    json[i].MENUSHIJOS.MENUHIJO.NOMBRE+
                                '</a>'+
                            '</li>';
                    }else{
                    for(var j in json[i].MENUSHIJOS.MENUHIJO){
                        navega = json[i].MENUSHIJOS.MENUHIJO[j].NAVEGACIONMOVILIDAD;
                        if(typeof(navega) === 'object'){
                            navega = '';
                        }
                        lista +='<li data-theme="c" id="acciones-'+json[i].MENUSHIJOS.MENUHIJO[j].NAVEGACIONMOVILIDAD+'" >'+
                                '<a id="acc-a'+json[i].MENUSHIJOS.MENUHIJO[j].NAVEGACIONMOVILIDAD+'" href="#'+navega+'" data-transition="none">'+
                                    json[i].MENUSHIJOS.MENUHIJO[j].NOMBRE+
                                '</a>'+
                            '</li>';
                        }
                    }
                    $page.html(lista);
                    $page.find('#acc-apage12').append('<span class="ui-li-count" id="num-tareas"></span>');
                }
            }
        }else{
            alert('problema al cargar el menu');
        }
        $.mobile.loading('hide');
        $('#acc-apage15').click(function(event){
            event.preventDefault();
            document.getElementById("form-novedades-ticket").reset();
            $("#form-novedades-ticket").data('novedad', '2');
            $("#back-novedad").attr('href', '#page5');
            novedadesTicket();
        });
        $('#list-service').listview({
            create: function (event, ui) {}
        });
        $('#list-service').listview('refresh');
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

//-----------menu gestionar --//apertura caso//-----datos ticket-----------PENDIENTE organizar el texto
function dataTicket(){
    var cita = "", $page = $("#page10 div[data-role='content'] div.body-content"),
        key = "idReparacion",
        formData = methods[4]+"&"+key+"="+sessionStorage.getItem(key);
        $page.html('');
    $.getJSON(url, formData, function(json) {
        $.mobile.loading('hide');
        if(!json.hasOwnProperty('success')){
            if(json.CITA === "True"){
                cita = "Cita";
            }
            $page.append(
                '<div>'+
                    '<p>Servicio <b>'+cita+'</b>'+
                        '&nbsp;de&nbsp;<b>'+json.LINEASERVICIO+'</b>'+
                        ' para el equipo <b>'+json.LUNO+'</b>'+
                        ' del cliente: <b>'+json.CLIENTE+'</b>'+
                        ' con serial <b>'+json.SERIAL+'.</b>'+
                        '&nbsp; Ubicado en la ciudad de: &nbsp;<b>'+json.CIUDAD+'</b>'+
                        ' Direccion: <b>'+json.DIRECCION+'.&nbsp;</b>'+
                    '</p>'+
                    '<p>Fecha y hora de contacto: <b>'+json.FECHAGENERACION+'&nbsp;</b>'+
                        '&nbsp;&nbsp;&nbsp;Fecha y hora de estimado o Cita: <b>'+json.FECHAEFECTIVA+'.</b>'+
                    '</p>'+
                    '<p>El problema reportado es: <b>'+json.DESCRIPCIONFALLA+'.</b>'+
                    '</p>'+
                '</div>'
            );
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else{
            $.mobile.loading('hide');
        }
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

//-----------menu gestionar --//apertura caso//-------ubicacion --------------PENDIENTE dataTime
function routeticket(){
    var formData, key = "idReparacion";
    formData = methods[6]+"&"+key+"="+sessionStorage.getItem(key);
    $.getJSON(url, formData, function(json) {
            var place = [];
        if(!json.hasOwnProperty('success')){
            if(json[0] === undefined){
                var marker = [];
                lat = json.LATITUD.replace(",",".");
                lon = json.LONGITUD.replace(",",".");
                nombre = json.NOMBRE;
                marker.nombre = nombre;
                marker.LatLng = new google.maps.LatLng(lat, lon);
                place = marker;
                if(json.TIPO === 'INGENIERO'){
                    center = new google.maps.LatLng(lat, lon);
                    initialize(center, place);
                }
                routeMap(place);
            }else{
                for(var module in json){
                    var marker = [];
                    lat = json[module].LATITUD.replace(",",".");
                    lon = json[module].LONGITUD.replace(",",".");
                    nombre = json[module].NOMBRE;
                    marker.nombre = nombre;
                    marker.LatLng = new google.maps.LatLng(lat, lon);
                    place[module] = marker;
                    if(json[module].TIPO === 'INGENIERO'){
                        center = new google.maps.LatLng(lat, lon);
                        initialize(center, place);
                    }
                }
                routeMap(place);
            }
        }
        else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
            var lat = 0, lon = 0, nombre = '',
                marker1 = [];
            center = new google.maps.LatLng(lat, lon);
            marker1.nombre = nombre;
            marker1.LatLng = center;
            place[0] = marker1;
            initialize(center, place);
        }else{
            $.mobile.loading('hide');
            var lat = 0, lon = 0, nombre = '',
                marker1 = [];
            center = new google.maps.LatLng(lat, lon);
            marker1.nombre = nombre;
            marker1.LatLng = center;
            place[0] = marker1;
            initialize(center, place);
        }
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}
//carga el mapa con los datos
var map1;
function initialize(center, place) {
    $.mobile.loading('hide');
    var myOptions = {
            zoom: 14,
            center: center,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        },
        $content = $("#page10 #map_canvas");
    $content.height (screen.height * 0.30);
    map1 = new google.maps.Map ($content[0], myOptions);
}

function markerMap (place) {

    for(var i in place){
        var marker = new google.maps.Marker({
            position: place[i].LatLng,
            map: map1,
            title: place[i].nombre
        });
    }
}

function routeMap(place){
    var directionsService = new google.maps.DirectionsService(),
        directionsDisplay = new google.maps.DirectionsRenderer(),
        limits = new google.maps.LatLngBounds(
            place[0].LatLng,
            place[1].LatLng
        );
    directionsDisplay.setMap(map1);
    map1.fitBounds(limits);
    var request = {
        origin: place[0].LatLng,
        destination: place[1].LatLng,
        travelMode: google.maps.TravelMode.WALKING
    };
    directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(result);
    }
  });
}

//acepta caso
function aceptarCaso(){
    var formData, key = "idReparacion";
    formData = methods[18]+"&"+key+"="+sessionStorage.getItem(key);
    $.getJSON(url, formData, function(json) {
        if(!json.hasOwnProperty('success')){
            if(json.SATISFACTORIO === "True"){
                alert(json.MENSAJEPOPUP);
                reloadMenuOption();
            }else{
                alert(json.MENSAJEPOPUP);
                $.mobile.changePage($('#page5'),{transition:'none'});
            }
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

function reloadMenuOption(){
    $.mobile.changePage($('#page5'),{transition:'none'});
    opcionesGestionReparaccion();
}

function transitoCaso(){
    var formData, key = "idReparacion";
    formData = methods[36]+"&"+key+"="+sessionStorage.getItem(key);
    $.getJSON(url, formData, function(json) {
        if(!json.hasOwnProperty('success')){
            if(json.SATISFACTORIO === "True"){
                alert(json.MENSAJEPOPUP);
                reloadMenuOption();
            }else{
                alert(json.MENSAJEPOPUP);
                $.mobile.changePage($('#page5'),{transition:'none'});
            }
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

function solicitarHistorial(){
    var formData, key = "idTicket", key1 = 'idUsuario';
    formData = methods[44]+"&"+key+"="+sessionStorage.getItem(key)+"&"+key1+"="+sessionStorage.getItem(key1);
    $.getJSON(url, formData, function(json) {
        if(!json.hasOwnProperty('success')){
            if(json.SATISFACTORIO === "True"){
                alert("Se ha enviado solicitud");
                reloadMenuOption();
            }else{
                alert("No se pudo enviar solicitud");
                $.mobile.changePage($('#page5'),{transition:'none'});
            }
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

//-----------menu gestionar --//apertura caso//-------Abrir --------------------------------PENDIENTE dataTime
function opencase(formData){
    formData = formData.replace(/%3A/gi,":");
    formData = formData.replace(/'+'/gi," ");
    var formData2 = formData.split("&"),
        key = "idReparacion",
        fechaActual = new Date();
    
    if((formData2[0].split("="))[1] === 'true'){
        formData2[1] = (formData2[1].split("="))[0]+"="+fechaActual.getFullYear()+"-"+(fechaActual.getMonth()+1)+"-"+fechaActual.getDate();
        formData2[2] = (formData2[2].split("="))[0]+"="+fechaActual.getHours()+":"+fechaActual.getMinutes();
        formData2[1]+=" "+(formData2[2].split("="))[1];
        if((formData2[4].split("="))[1] === 'hora'){
            formData2.splice(2,4);
        }else{
            formData2.splice(2,3);
        }
    }else{
        var fecha = 'fecha=';
        if((formData2[3].split("="))[1] === 'hora'){
            fecha+= fechaActual.getFullYear()+'-'+(formData2[1].split("="))[1]+'-'+(formData2[2].split("="))[1];
            formData2.splice(2,2);
        }else{
            fecha+= (formData2[3].split("="))[1]+'-'+(formData2[1].split("="))[1]+'-'+(formData2[2].split("="))[1];
            formData2[1] = fecha;
            formData2[1]+=" "+(formData2[4].split("="))[1];
            formData2.splice(2,3);
        }
    }
    
    formData=formData2[0];
    for (var i = 1; i < formData2.length; i++) {
        formData += "&"+formData2[i];
    }
    
    formData = formData+"&"+methods[5]+"&"+key+"="+sessionStorage.getItem(key);
    $.getJSON(url, formData, function(json) {
        $.mobile.loading('hide');
        if(!json.hasOwnProperty('success')){
            if (json.APERTURASATISFACTORIA === "True") {

                //Actualia los valores de select
                $('.ui-select select').val('').selectmenu('refresh');
                alert(json.MENSAJEPOPUP);
                reloadMenuOption();
            }else{
                //Actualia los valores de select
                $('.ui-select select').val('').selectmenu('refresh');
                alert(json.MENSAJEPOPUP);
                $.mobile.changePage($('#page5'),{transition:'none'});
            }
            $("#btn-open-case").button('enable');
        }else if(json.success === 'error'){
            alert("error de conexión");
            $("#btn-open-case").button('enable');
            $.mobile.loading('hide');
        }else {
            $("#btn-open-case").button('enable');
            $.mobile.loading('hide');
        }
    })
    .error(function() {
        alert("error de conexión");
        $("#btn-open-case").button('enable');
        $.mobile.loading('hide');
    });
}




//-----------menu gestionar --// cierre //---------tareas-----modulo tickets
function cantidadTareas(){
    var server = true, indice = 0, formData, key = "idTicket",
        $page = $("#page12 div[data-role='content'] div[data-role='collapsible-set']");
    formData = methods[7]+"&"+key+"="+sessionStorage.getItem(key);
    $page.html('');
    $.ajax({
        url: url,
        dataType: 'json',
        async: true,
        data: formData,
        success: function(json) {
            if(!json.hasOwnProperty('success')){
                for(var module in json){
                    indice++;
                }
                $("li span#num-tareas").html('');
                $("li span#num-tareas").append(indice);
                $( ".module-collapse" ).collapsible({
                    create: function(event, ui) {}
                });
            }
        sessionStorage.setItem('modulo', '{}');
        }
    });
}


function moduletickets(){
    var server = true, indice = 0, formData, key = "idTicket",
        $page = $("#page12 div[data-role='content'] div[data-role='collapsible-set']");
    formData = methods[7]+"&"+key+"="+sessionStorage.getItem(key);
    $page.html('');
    $.ajax({
        url: url,
        dataType: 'json',
        async: true,
        data: formData,
        success: function(json) {
            if(!json.hasOwnProperty('success')){
                for(var module in json){
                    indice++;
                    problema = json[module].DESCRIPCIONPROBLEMA;
                    if(typeof(json[module].DESCRIPCIONPROBLEMA)==='object'){
                        problema = '';
                    }
                    $page.append('<div data-role="collapsible" data-collapsed="false"  class="module-collapse" >'+
                                    '<h3>Modulo: '+json[module].ALIAS+'</h3>'+
                                    '<div><p><b>'+problema+'</b></p></div>'+
                                    '<form data-ajax="false" id="form-module'+module+'" data-namemodulo="'+json[module].ALIAS+'" data-idmoduleticket="'+json[module].IDMODULOEQUIPOTICKET+'" autocomplete="off"></form>'+
                                '</div>'
                    );
                }
                $("li span#num-tareas").html('');
                $("li span#num-tareas").append(indice);
                $( ".module-collapse" ).collapsible({
                    create: function(event, ui) {}
                });
                loadoptions(false);

                //Almacena el total de modulos registrados en DocBase
                sessionStorage.setItem("modulos_docbase", indice);

                //Inicializa la variable para contar los modulos guardados
                var total_modulos_guardados = 0;
                sessionStorage.setItem("modulos_guardados", total_modulos_guardados);

            }else if(json.success === 'error'){
                alert("error de conexión");
                $.mobile.loading('hide');
            }else {
                $.mobile.loading('hide');
            }
            $("#acc-apage12").attr('href', '#page12');
            sessionStorage.setItem('modulo', '{}');
        }
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

//carga opciones de los modulos
function loadoptions(nuevoModulo){
    // if(!nuevoModulo){
        var $page = $("#page12 div[data-role='content'] div[data-role='collapsible-set']");
        var $modules = $page.children("div[data-role='collapsible']");
        $page.children("div[data-role='collapsible']").find("form").html('');
        $modules.each(function(){
            moduleticketsproblems($(this).find('form').data('idmoduleticket'));
            ParteModuloEquipoTicket($(this).find('form').data('idmoduleticket'));
        });

    // }
    moduleticketsreparacion();
    moduleticketscausals();
    moduleticketscierre();
    moduleticketstimedescription();
}

//carga las opciones de problemas
function moduleticketsproblems(idmoduleticket){
    $.mobile.loading('show');
    var formData, option = "",
        $page = $("#page12 div[data-role='content'] div[data-role='collapsible-set'] form[data-idmoduleticket='"+idmoduleticket+"']");
    formData = methods[8]+"&"+"idModuloEquipoTicket="+idmoduleticket;
    $page.find("div#problems-menu1"+idmoduleticket).html('');
    $page.append('<div data-role="fieldcontain" class="problems-menu1" id="problems-menu1'+idmoduleticket+'"></div>'                        );
    $.getJSON(url, formData, function(json) {
        if(!json.hasOwnProperty('success')){
            $page.find('div#problems-menu1'+idmoduleticket).append('<label for="IDCODIGOPROBLEMA">Problema</label>'+
                        '<select data-role="none" name="IDCODIGOPROBLEMA" id="selectmenu1'+idmoduleticket+'" class="problema">'+
                        '</select>'
                                );
            if(json[0] === undefined){
                option +=
                    '<option value='+json.IDCODIGOPROBLEMA+'>'+
                    json.NOMBRE+'</option>';
            }else{
                for(var module in json){
                    option +=
                        '<option value='+json[module].IDCODIGOPROBLEMA+'>'+
                        json[module].NOMBRE+'</option>';
                }
            }
            $("select#selectmenu1"+idmoduleticket).html(option);
            $( 'div select#selectmenu1'+idmoduleticket ).selectmenu({
                create: function(event, ui) {}
            });
            $page.find('div[data-role="fieldcontain"]').fieldcontain('refresh');
            $.mobile.loading('hide');
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });

}

//carga las causal de problemas
function moduleticketscausals(){
    $.mobile.loading('show');
    var formData, option = "", $page = $("#page12 div[data-role='content'] div[data-role='collapsible-set'] div[data-role='collapsible'] form");
    formData = methods[9];
    $page.find("div.causal-menu2").html('');
    $page.append('<div data-role="fieldcontain" class="causal-menu2" ></div>');
    $.getJSON(url, formData, function(json) {
        if(!json.hasOwnProperty('success')){
            $page.find("div.causal-menu2").append('<label for="IDCAUSAL">Causal</label>'+
                                '<select data-role="none" name="IDCAUSAL" class="causal"></select>'
                                );
            $( "div select.causal" ).selectmenu({
                create: function(event, ui) {}
            });
            if(json[0] === undefined){
                option +=
                    '<option value='+json.IDCAUSAL+'>'+
                    json.DESCRIPCION+'</option>';
            }else{
                for(var module in json){
                    option +=
                        '<option value='+json[module].IDCAUSAL+'>'+
                        json[module].DESCRIPCION+'</option>';
                }
            }
            $("select.causal").html(option);
            $page.find('div[data-role="fieldcontain"]').fieldcontain('refresh');
            $( "div select.causal" ).selectmenu("refresh");
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
        $.mobile.loading('hide');
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

//carga las cierre de problemas
function moduleticketscierre(){
    $.mobile.loading('show');
    var formData,
        key = "idTicket", option = "",
        $page = $("#page12 div[data-role='content'] div[data-role='collapsible-set'] div[data-role='collapsible'] form");
    formData = methods[10]+"&"+key+"="+sessionStorage.getItem(key);
    $page.find("div.cierre-menu3").html('');
    $page.append('<div data-role="fieldcontain" class="cierre-menu3" ></div>');
    $.getJSON(url, formData, function(json) {
        if(!json.hasOwnProperty('success')){
            $page.find("div.cierre-menu3").append('<label for="IDCODIGOCIERRE">Cierre</label>'+
                                '<select data-role="none" name="IDCODIGOCIERRE" class="cierre"></select>'
                                );
            if(json[0] === undefined){
                option +=
                '<option value='+json.IDCODIGOCIERRE+'>'+
                    json.DESCRIPCION+'</option>';
            }else{
                for(var module in json){
                    option +=
                    '<option value='+json[module].IDCODIGOCIERRE+'>'+
                        json[module].DESCRIPCION+'</option>';
                }
            }
            $("select.cierre").html(option);
            $( "div select.cierre" ).selectmenu({
                create: function(event, ui) {}
            });
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
        $.mobile.loading('hide');
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
    $( "div select.cierre" ).selectmenu("refresh");
}

//carga las codigo reparacion de problemas
function moduleticketsreparacion(){
    $.mobile.loading('show');
    var formData, option = "";
        key = "idTicket",
        $page = $("#page12 div[data-role='content'] div[data-role='collapsible-set'] div[data-role='collapsible'] form");
    formData = methods[11]+"&"+key+"="+sessionStorage.getItem(key);
    $page.find("div.reparacion-menu4").html('');
    $page.append('<div data-role="fieldcontain" class="reparacion-menu4" data-reparacion=""></div>');
    $.getJSON(url, formData, function(json) {
        if(!json.hasOwnProperty('success')){
            $page.find("div.reparacion-menu4").append('<label for="IDREPARACION">Reparación</label>'+
                                '<select data-role="none" name="IDCODIGOREPARACION" class="reparacion"></select>'
                                );
            if(json[0] === undefined){
                option +=
                    '<option value='+json.IDCODIGOREPARACION+'>'+
                    json.DESCRIPCION+'</option>';
            }else{
                for(var module in json){
                    option +=
                        '<option value='+json[module].IDCODIGOREPARACION+'>'+
                        json[module].DESCRIPCION+'</option>';
                }
            }
            $("select.reparacion").html(option);
            $( "div select.reparacion" ).selectmenu({
                create: function(event, ui) {}
            });
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
        $.mobile.loading('hide');
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
    $( 'div select.reparacion' ).selectmenu('refresh');
}

var indica = 0;
//muestra el tiempo de reparacion de problemas
function moduleticketstimedescription(){
    indica++;
    var $page = $('#page12 div[data-role="content"] div[data-role="collapsible-set"] div[data-role="collapsible"] form');
    $page.find('div.idtime-description').html('');
    $page.append('<div data-role="fieldcontain" class="idtime-description">'+
                    '<fieldset data-role="controlgroup">'+
                        '<label for="TIEMPOREPARACION">Tiempo reparación (en minutos)</label>'+
                        '<input type="number" name="TIEMPOREPARACION" data-role="none" class="textinput-time" placeholder="minutos" value="0" data-highlight="true" />'+
                    '</fieldset>'+
                '</div>'+
                '<div data-role="fieldcontain" class="idtime-description">'+
                    '<fieldset data-role="controlgroup" class="idja">'+
                        '<label for="DESCRIPCION" class="lab">Descripción </label>'+
                        '<textarea name="DESCRIPCION" class="texarea-description" placeholder=""></textarea>'+
                    '</fieldset>'+
                '</div>'+
                '<input class="btn-photo" type="button" data-icon="star" data-iconpos="left" value="Adjuntar foto" />'+
                '<img style="display:none;width:60px;height:60px;" id="smallImage" src="" />'+
                '<div data-role="collapsible" class="partes-collapse">'+
                    '<h2>Consumio Partes</h2>'+
                    '<ul class="lista-partes-modulo" data-role="listview" data-divider-theme="b" >'+
                    '</ul>'+
                    '</div>'+
                '<input type="submit" data-transition="none" href="" class="btn-save-module" value="Guardar" />'
            );
    $page.find('div[data-role="fieldcontain"]').fieldcontain('refresh');
    $('.btn-save-module').button({
        create: function(event, ui) {}
    });
    $('.btn-photo').button({
        create: function(event, ui) {
            $(".btn-photo").click(function(event){
                getPhoto();
            });
        }
    });
    $(".textinput-time").textinput({
        create: function(event, ui) {}
    });
    $(".texarea-description").textinput({
        create: function(event, ui) {}
    });
    $(".checkbox-module").checkboxradio({
        create: function(event, ui) {
            $(this).bind( "change", function(event, ui) {
                $.mobile.changePage($('#page19'),{transition:'none'});
            });
        }
    });
    $( ".partes-collapse" ).collapsible({
        create: function(event, ui) {}
    });
}

function ParteModuloEquipoTicket (idmoduleticket) {
    var formData, lista = "",
        $page = $("#page12 div[data-role='content'] div[data-role='collapsible-set'] form[data-idmoduleticket="+idmoduleticket+"]"),
        key = "idUsuario",
        key1 = 'idReparacion';
    formData = methods[14]+"&"+"idModuloEquipoTicket="+idmoduleticket+"&"+'idIngeniero'+"="+sessionStorage.getItem(key)+'&'+key1+"="+sessionStorage.getItem(key1);
    $page.find("ul.lista-partes-modulo").html('');
    $.getJSON(url, formData, function(json) {
        $.mobile.loading('hide');
        if(!json.hasOwnProperty('success')){
            if(json[0] === undefined){
                lista +=
                        '<li data-theme="c" data-idparte="'+json.IDPARTEDETALLE+'" data-idsolicitud="'+json.IDSOLICITUDDETALLEREPARACION+'">'+
                                json.ALIAS+
                                '<input type="number" class="cantidad-devolver" value="0" name="CANTIDAD" data-mini="true" style="width: 20%;" />'+
                                'Disponible ['+json.CANTIDADENPODER+'] '+
                        '</li>';
            }else{
                for(var module in json){
                    lista +=
                        '<li data-theme="c" data-idparte="'+json[module].IDPARTEDETALLE+'" data-idsolicitud="'+json[module].IDSOLICITUDDETALLEREPARACION+'">'+
                                json[module].ALIAS+
                                '<input type="number" class="cantidad-devolver" value="0" name="CANTIDAD" data-mini="true" style="width: 20%;" />'+
                                'Disponible ['+json[module].CANTIDADENPODER+'] '+
                        '</li>';
                }
            }
            $page.find("ul.lista-partes-modulo").html(lista);
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
        $page.find( ".cantidad-devolver" ).textinput({
            create: function(event, ui) {}
        });
        $page.find('.lista-partes-modulo').listview({
            create: function(event, ui) {}
        });
        $page.find('.lista-partes-modulo').listview('refresh');
        $page.find('div[data-role="fieldcontain"]').fieldcontain('refresh');
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

function cerrarParteModuloDetalle(idmoduleticket) {
    var formdata='', idParteDetalle, cantidad, i = 0,
        $page = $("#page12 div[data-role='content'] div[data-role='collapsible-set'] form[data-idmoduleticket="+idmoduleticket+"]");
    $lista = $page.find("ul.lista-partes-modulo li");
    $lista.each(function(){
        if ($(this).data('role') !== "list-divider"){
            idParteDetalle = $(this).data('idparte');
            idSolicitud = $(this).data('idsolicitud');
            cantidad = 'CANTIDAD_'+i+'=' + $(this).find('input').val();
            formdata += '&IDMODULOEQUIPOTICKET_'+i+'='+idmoduleticket+'&IDPARTEDETALLE_'+i+'='+idParteDetalle+'&IDSOLICITUDDETALLEREPARACION_'+i+'='+idSolicitud+'&'+cantidad;
            i++;
        }
    });
    formdata = methods[15]+formdata;
    $.getJSON(url, formdata, function(json) {
        if(!json.hasOwnProperty('success')){
            if(json.CIERREPARTESATISFACTORIO === 'True'){
                // alert('Se han cerrado las partes modulo');
            }
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

//agrega modulo
function agregarModulo(){
    $.mobile.loading('show');
    var key = "idTicket", option = "",
        $page = $("#page12 .agregar-modulo-menu"),
        formdata;
    $page.html('');
    formdata = methods[37]+'&'+key+"="+sessionStorage.getItem(key);
    $.getJSON(url, formdata, function(json) {
        $('#btn-add-module').button('enable');
        $.mobile.loading('hide');
        $page.append('<form action="" id="crear-modulo" autocomplete="off">'+
            '<span>'+
                        'Seleccione modulo'+
                    '</span>'+
            '<select data-role="none" name="idModuloEquipo" id="lista-modulos-agregar"></select></form>');
        if(!json.hasOwnProperty('success')){
            if(json[0] === undefined){
                option +=
                        '<option class="modulo" value='+json.IDMODULOEQUIPO+'>'+
                        json.MODULO+'</option>';
            }else{
                for(var module in json){
                    option +=
                        '<option class="modulo" value='+json[module].IDMODULOEQUIPO+'>'+
                        json[module].MODULO+'</option>';
                }
            }
            $("#lista-modulos-agregar").html(option);
            $page.append(
                '<p><fieldset data-role="controlgroup">'+
                    '<label for="description-modulo">'+
                        'Comentario'+
                    '</label>'+
                    '<textarea name="" id="description-modulo" placeholder="nuevo">'+
                    '</textarea>'+
                '</fieldset></p>'+
                '<input type="button" value="aceptar" id="btn-agregar-modulo"/>'
            );
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
        $( "#lista-modulos-agregar" ).selectmenu({
            create: function(event, ui) {}
        });
        $( "#description-modulo" ).textinput({
            create: function(event, ui) {}
        });
        $('#btn-agregar-modulo').button({
            create: function(event, ui) {
                $(this).on('click',function(event){
                    $(this).button('disable');
                    $.mobile.loading('show');
                    var formdata = $('#page12 #crear-modulo').serialize(),
                        key = 'idTicket',
                        description;
                    description = $('#description-modulo').val();
                    formdata = formdata+'&'+methods[38]+'&'+key+"="+sessionStorage.getItem(key)+'&strDescripcion='+description;
                    $.getJSON(url, formdata, function(json) {
                        $('#btn-agregar-modulo').button('enable');
                        $.mobile.loading('hide');
                        if(!json.hasOwnProperty('success')){
                            if(json.SATISFACTORIO === 'True'){
                                crearModulo($('#lista-modulos-agregar option:selected').val(), $('#lista-modulos-agregar option:selected').text());
                            }else{
                                alert('no se pudo crear el modulo');
                            }
                        }else if(json.success === 'error'){
                            alert("error de conexión");
                            $.mobile.loading('hide');
                        }else {
                            $.mobile.loading('hide');
                        }
                        $("#page12 .agregar-modulo-menu").html('');
                    });
                });
            }
        });
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

//crear modulo ticket
function crearModulo(idmodulo, titlemodulo){
    var key = "idTicket",
        $page = $("#page12 div[data-role='content'] div[data-role='collapsible-set']");
    $page.append('<div data-role="collapsible" data-collapsed="false" class="module-collapse">'+
                    '<h3>Modulo: '+titlemodulo+'</h3>'+
                    '<div><p><b></b></p></div>'+
                    '<form id="form-new-module" data-modulo="nuevo" data-idmoduleticket="'+idmodulo+'" data-ajax="false" autocomplete="off">'+
                    '</form>'+
                '</div>'
                );
    $( ".module-collapse" ).collapsible({
        create: function(event, ui) {}
    });
    $( 'div select.selectmenu1-new').selectmenu({
        create: function(event, ui) {}
    });
    $page.find('div[data-role="fieldcontain"]').fieldcontain('refresh');
    loadoptions(true);

    //Aumenta el total de modulos de Docbase
    var total_modulos_docbase = sessionStorage.getItem('modulos_docbase');
    total_modulos_docbase++;
    sessionStorage.setItem("modulos_docbase", total_modulos_docbase);
}

//-----------menu gestionar --// cierre //------check list --------------//
//check list
function checkList(){
    var formData, list = "",
        key = "idReparacion", $page = $("#page32 div[data-role='content']");
        formData = methods[20]+"&"+key+"="+sessionStorage.getItem(key);
    $page.html('');
    $.getJSON(url, formData, function(json) {
        $page.append(
            '<div class="titulo-reporte-servicio"><p><strong>'+
                'Ticket#: '+sessionStorage.getItem("idTicket")+
                '</strong></p>'+
            '</div>'+
            '<form id="form-check-list" autocomplete="off"></form>'
        );
        if(!json.hasOwnProperty('success')){
            $.mobile.loading('hide');
            for(var module in json){
                list +=
                    '<div data-role="fieldcontain">'+
                        '<fieldset data-role="controlgroup">'+
                            '<label for="toggleswitch'+json[module].IDPREGUNTA+'"">'+
                                json[module].DESCRIPCION+
                            '</label>'+
                            '<select name="'+json[module].IDPREGUNTA+'" class="toggleswitch" id="toggleswitch'+json[module].IDPREGUNTA+'" data-theme="" data-role="slider">'+
                                '<option value="false">'+
                                    'No'+
                                '</option>'+
                                '<option value="true">'+
                                    'Si'+
                                '</option>'+
                            '</select>'+
                        '</fieldset>'+
                    '</div>';
            }
            $page.find("form").html(list);
            $page.find("form").append(
                '<input data-role="button" data-transition="none" data-icon="check" data-iconpos="left" id="btn-send-check" value="Enviar" />'
                );
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
        $( ".toggleswitch" ).slider({
                    create: function(event, ui) {}
                });
        $('#btn-send-check').button({
            create: function(event, ui) {
                $('#btn-send-check').on('click', function(event){
                    item = 0;
                    $('#btn-send-check').button('disable');
                    $.mobile.loading('show');
                    event.preventDefault();
                    var aux, fin = true, formData2, formData = $(this).parents("form").serialize(),
                        key = "idReparacion", respuesta = 'true', $page = $("#page32 div[data-role='content']");
                    formData2 = formData.split("&");
                    sendChecklist(formData2, fin);
                });
            }
        });
        $page.find('div[data-role="fieldcontain"]').fieldcontain('refresh');
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

function sendChecklist(formData2, fin){
    key = "idReparacion";
    if(formData2.length > 0){
        respuesta = formData2[0].split("=")[1];
        aux = methods[21]+"&"+key+"="+sessionStorage.getItem(key)+"&idPregunta="+(formData2[0].split("="))[0]+"&respuesta="+respuesta;
        $.ajax({
            url: url,
            data: aux,
            type: 'GET',
            async: false,
            dataType: 'json',
            success: function(json) {
                if(!json.hasOwnProperty('success')){
                    if(json.GUARDESATISFACTORIO === 'True'){
                        formData2.splice(0,1);
                        sendChecklist(formData2, fin);
                    }
                    else{
                        fin = false;
                    }
                    if(!fin){
                        alert('No se ha enviado el check list');
                        $('#btn-send-check').button('enable');
                        $.mobile.loading('hide');
                    }
                }else if(json.success === 'error'){
                    alert("error de conexión");
                    $('#btn-send-check').button('enable');
                    $.mobile.loading('hide');
                }else {
                    $('#btn-send-check').button('enable');
                    $.mobile.loading('hide');
                }
            }
        }).error(function() {
            alert("error de conexión");
            $('#btn-send-check').button('enable');
            $.mobile.loading('hide');
        });
    }else{
        if(fin){
            alert('Se ha enviado el check list');
            $('#btn-send-check').button('enable');
            $.mobile.loading('hide');
            $.mobile.changePage($('#page9'),{transition:"none"});
        }
    }
}

//-----------menu gestionar --// cierre //------reporte de servicios --------------//
//cerrar reparacion ticket
function cerrarreparacionticket(formData){
    formData = formData.replace(/%3A/gi,":");
    formData = formData.replace(/%40/gi,"@");
    formData = formData.replace(/\+/gi," ");
    formData = formData.replace(/%0D%0A/gi,' ');
    var key = "idReparacion",
        formData2 = formData.split("&");
        fechaActual = new Date();
    if((formData2[0].split("="))[1] === 'true'){
        formData2[1] = (formData2[1].split("="))[0]+"="+fechaActual.getFullYear()+"-"+(fechaActual.getMonth()+1)+"-"+fechaActual.getDate();
        formData2[2] = (formData2[2].split("="))[0]+"="+fechaActual.getHours()+":"+fechaActual.getMinutes();
        formData2[1]+=" "+(formData2[2].split("="))[1];
        if((formData2[4].split("="))[1] === 'hora'){
            formData2.splice(2,4);
        }else{
            formData2.splice(2,3);
        }
    }else{
        var fecha = 'fecha=';
        if((formData2[3].split("="))[1] === 'hora'){
            fecha+= fechaActual.getFullYear()+'-'+(formData2[1].split("="))[1]+'-'+(formData2[2].split("="))[1];
            formData2.splice(2,2);
        }else{
            fecha+= (formData2[3].split("="))[1]+'-'+(formData2[1].split("="))[1]+'-'+(formData2[2].split("="))[1];
            formData2[1] = fecha;
            formData2[1]+=" "+(formData2[4].split("="))[1];
            formData2.splice(2,3);
        }
    }
    formData=formData2[0];
    for (var i = 1; i < formData2.length; i++) {
        formData += "&"+formData2[i];
    }
    var boxCanvas  = document.getElementById("signaturePanel");
    var dataCanvas = boxCanvas.toDataURL();
    var signatureData = dataCanvas.replace(/^data:image\/(png|jpg);base64,/, "");
    formData = methods[13]+'&firma='+signatureData+"&"+key+"="+sessionStorage.getItem(key)+"&"+formData;
    $.ajax({
        url: url1,
        type: "POST",
        crossDomain: true,
        data: formData,
        dataType: 'text json',
        success: function(json) {
            if(!json.hasOwnProperty('success')){
                $.mobile.loading('hide');
                if(json.CIERRESATISFACTORIO === "True"){

                    //Actualia los valores de select
                    $('.ui-select select').val('').selectmenu('refresh');
                    
                    alert(json.MENSAJEPOPUP);
                    reloadMenuOption();
                    $('#page28 content-canvas').html('');
                }else{
                    
                    //Actualia los valores de select
                    $('.ui-select select').val('').selectmenu('refresh');
                    alert(json.MENSAJEPOPUP);
                }
                $.mobile.loading('hide');
                $('#btn-send-close').button('enable');
            }else if(json.success === 'error'){
                $('#btn-send-close').button('enable');
                alert("error de conexión");
                $.mobile.loading('hide');
            }else {
                $('#btn-send-close').button('enable');
                $.mobile.loading('hide');
            }
        }
    }).error(function() {
        //Actualia los valores de select
        $('.ui-select select').val('').selectmenu('refresh');
        $('#btn-send-close').button('enable');
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

//cerrar reparacion ticket (vista previa)
function preview(formData){
    formData = decodeURIComponent(formData);
    formData = formData.replace(/Contacto/gi,"");
    formData = formData.replace(/\+/gi," ");
    var $page = $("#page28 div[data-role='content'] #idpreview"),
        formData2 = formData.split("&"),
        fechaActual = new Date();
    if((formData2[0].split("="))[1] === "true"){
        formData2[1] = (formData2[1].split("="))[0]+"="+fechaActual.getFullYear()+"-"+(fechaActual.getMonth()+1)+"-"+fechaActual.getDate();
        formData2[2] = (formData2[2].split("="))[0]+"="+fechaActual.getHours()+":"+fechaActual.getMinutes();
        formData2[1]+=" "+(formData2[2].split("="))[1];
        if((formData2[3].split("="))[1] === 'hora'){
            formData2.splice(2,2);
        }else{
            formData2.splice(2,3);
        }
    }else{
        var fecha = 'fecha=';
        if((formData2[3].split("="))[1] === 'hora'){
            fecha+= fechaActual.getFullYear()+'-'+(formData2[1].split("="))[1]+'-'+(formData2[2].split("="))[1];
            formData2.splice(2,2);
        }else{
            fecha+= (formData2[3].split("="))[1]+'-'+(formData2[1].split("="))[1]+'-'+(formData2[2].split("="))[1];
            formData2[1] = fecha;
            formData2[1]+=" "+(formData2[4].split("="))[1];
            formData2.splice(2,3);
        }
    }

    var key = "idReparacion",
        formData3 = methods[49]+"&"+key+"="+sessionStorage.getItem(key),
        dataModules;
    dataModules = sessionStorage.getItem('modulo');
    dataModules = JSON.parse(dataModules);
    $.getJSON(url, formData3, function(json) {
        if(!json.hasOwnProperty('success')){
            formData2[1]+=" "+(formData2[2].split("="))[1];
            $page.html('');
            $page.append(
                '<p><strong>Número de servicio: </strong><br>'+json.IDTICKET+'</p>'+
                '<p><strong>Equipo: </strong><br>'+json.LUNO+'</p>'+
                '<p><strong>Serial: </strong><br>'+json.SERIAL+'</p>'+
                '<p><strong>Cliente: </strong><br>'+json.CLIENTE+'</p>'
            );

            /*
            jQuery.each(json.MODULOS.MODULO, function(indice, modulo) {
                $page.append(
                    '<p><strong>Módulo: </strong>'+modulo.ALIAS+'<br>'+
                    '<strong>Problema </strong>'+modulo.DESCRIPCIONCODIGOPROBLEMA+'<br>'+
                    '<strong>Causal: </strong>'+modulo.DESCRIPCIONCAUSAL+'<br>'+
                    '<strong>Cierre: </strong>'+modulo.DESCRIPCIONCIERRE+'<br>'+
                    '<strong>Reparación </strong>'+modulo.DESCRIPCIONCODIGOREPARACION+'<br>'+
                    '<strong>Comentario </strong>'+modulo.COMENTARIOSREPARACION+'<br>'+
                    '<strong>Tiempo Reparación: </strong>'+modulo.TIEMPOREPARACION+'</p>'
                );
            });
            */


            correo= '';
            tele='';
            comentario='';
            if ((formData2[8].split("="))[1]){
                correo = (formData2[8].split("="))[1];
            }
            if ((formData2[9].split("="))[1]){
                tele = (formData2[9].split("="))[1];
            }
            if ((formData2[10].split("="))[1]){
                comentario = (formData2[10].split("="))[1];
            }

            $page.append('</p><p><strong>Datos de la persona de contacto</strong> <br>'+
                '<strong>Nombre:</strong> '+(formData2[7].split("="))[1]+'<br>'+
                '<strong>Correo:</strong> '+correo+'<br>'+
                '<strong>Telefóno:</strong> '+tele+'<br>'+
                '<strong>Comentario:</strong> '+comentario+'<br>'+'</p>'+
                '<p><strong>Fecha y Hora de Apertura</strong> <br>'+json.FECHAAPERTURA+'</p>'+
                '<p><strong>Fecha y Hora del Envio del cierre</strong> <br>'+json.FECHACIERRETENTATIVA+'</p>'
            );

        }else if(json.success === 'error'){
            $('#btn-preview').button('enable');
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $('#btn-preview').button('enable');
            $.mobile.loading('hide');
        }
        $('#btn-preview').button('enable');
        $.mobile.loading('hide');
        $.mobile.changePage($("#page28"),{transition:"none"});
    })
    .error(function() {
        $('#btn-preview').button('enable');
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

//-----------menu gestionar --// general //------status XMS --------------//
//novedades ticket
function novedadesTicket(){
    $('#page15 div').remove('.ui-select');
    $('#page15 .select-novedad').append(
        '<select data-role="none" name="IDCODIGONOVEDADCONFIGURACION" id="novedad-ticket" class="novedades-ticket">'+
        '</select>'
    );
    $('.novedades-ticket').selectmenu({
        create: function(event, ui){}
    });
    $("#form-novedades-ticket").data("novedad", "2");
    var formData, option = "",
        $page = $("#page15 #novedad-ticket"),
        key = 'idTicket';
    formData = methods[22]+"&"+key+"="+sessionStorage.getItem(key);
    $page.html('');
    $.getJSON(url, formData, function(json) {
        $.mobile.loading('hide');
        $('#btn-send-novedad').button('disable');
        if(!json.hasOwnProperty('success')){
            if(json[0] === undefined){
                option +=
                    '<option value="'+json.IDCODIGONOVEDADCONFIGURACION+'" data-idvaloradicional="'+json.VALORADICIONALPREGUNTA+'">'+
                    json.DESCRIPCION+'</option>';
            }
            for(var module in json){
                option +=
                    '<option value="'+json[module].IDCODIGONOVEDADCONFIGURACION+'" data-idvaloradicional="'+json[module].VALORADICIONALPREGUNTA+'">'+
                    json[module].DESCRIPCION+'</option>';
            }
            $page.html(option);
            $page.selectmenu('refresh', true);
            $page.val(0);
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

//status XMS
function statusXMS(){
    var lista = "", key = "idReparacion", $page = $("#page21 div[data-role='content']"),
        formData = methods[16]+"&"+key+"="+sessionStorage.getItem(key),
        formData2 = methods[17]+"&"+key+"="+sessionStorage.getItem(key);
    $page.find('.encabezado').html('');
    $page.find('#collapsible-xms').html('');
    $.getJSON(url, formData, function(json) {
        if(!json.hasOwnProperty('success')){
            $page.find('.encabezado').append('<p><strong>ATM '+json.strLuno+'</strong></p>'+
                '<p><strong>Estado:'+json.EQUIPMENTSTATUS+'</strong></p>'
            );
            $.getJSON(url, formData2, function(json1) {
                $.mobile.loading('hide');
                if(!json.hasOwnProperty('success')){
                    if(json1.MODULO[0] === undefined){
                        $page.find('#collapsible-xms').append(
                            '<div data-role="collapsible" class="collapse-modulos">'+
                                '<h2>'+json1.MODULO.NOMBRE+': '+json1.MODULO.STATUS+'</h2>'+
                                '<ul data-role="listview" data-divider-theme="b" id="lista-xms'+modulo+'" class="list-status"></ul>'+
                            '</div>'
                        );
                        if(json1.MODULO.SUBMODULOS.SUBMODULO[0] === undefined){
                             lista +=
                                    '<li data-theme="c">'+
                                        json1.MODULO.SUBMODULOS.SUBMODULO.NOMBRE+': '+json1.MODULO.SUBMODULOS.SUBMODULO.STATUS+
                                    '</li>';
                        }else{
                            for(var submodulo in json1.MODULO.SUBMODULOS.SUBMODULO){
                                lista +=
                                    '<li data-theme="c">'+
                                        json1.MODULO[modulo].SUBMODULOS.SUBMODULO.NOMBRE+': '+json1.MODULO.SUBMODULOS.SUBMODULO[submodulo].STATUS+
                                    '</li>';
                            }
                        }
                        $page.find('#lista-xms'+modulo).append(lista);
                        lista = '';
                    }else{
                        for(var modulo in json1.MODULO){
                            $page.find('#collapsible-xms').append(
                                '<div data-role="collapsible" class="collapse-modulos">'+
                                    '<h2>'+json1.MODULO[modulo].NOMBRE+': '+json1.MODULO[modulo].STATUS+'</h2>'+
                                    '<ul data-role="listview" data-divider-theme="b" id="lista-xms'+modulo+'" class="list-status"></ul>'+
                                '</div>'
                            );
                            if(json1.MODULO[modulo].SUBMODULOS.SUBMODULO[0] === undefined){
                                 lista +=
                                        '<li data-theme="c">'+
                                            json1.MODULO[modulo].SUBMODULOS.SUBMODULO.NOMBRE+': '+json1.MODULO[modulo].SUBMODULOS.SUBMODULO.STATUS+
                                        '</li>';
                            }else{
                                for(var submodulo1 in json1.MODULO[modulo].SUBMODULOS.SUBMODULO){
                                    lista +=
                                        '<li data-theme="c">'+
                                            json1.MODULO[modulo].SUBMODULOS.SUBMODULO[submodulo1].NOMBRE+': '+json1.MODULO[modulo].SUBMODULOS.SUBMODULO[submodulo1].STATUS+
                                        '</li>';
                                }
                            }
                            $page.find('#lista-xms'+modulo).append(lista);
                            lista = '';
                        }
                    }
                    $(".collapse-modulos").collapsible({
                        create: function(event, ui) {}
                    });
                    $(".list-status").listview({
                        create: function(event, ui) {}
                    });
                    $(".list-status").listview('refresh');
                }else if(json.success === 'error'){
                    alert("error de conexión");
                    $.mobile.loading('hide');
                }else {
                    $.mobile.loading('hide');
                }
            });
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
        $( ".collapsible-xms" ).collapsibleset( "refresh" );
        $("#page21 div[data-role='content']").fieldcontain('refresh');
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

//--------------------seguimiento de actividades
function seguimientoActividades () {
    var lista = "", key = "idTicket", $page = $("#page22 div[data-role='content'] #list-actividades"),
        formData = methods[39]+"&"+key+"="+sessionStorage.getItem(key);
    $page.html('');
    $page.append('<li data-role="list-divider" role="heading">'+
                    'Actividades'+
                '</li>');
    $.getJSON(url, formData, function(json) {
        if(!$.isEmptyObject(json)){
            if(!json.hasOwnProperty('success')){
                var estado = '0', semaforo;
                if(json.ACTIVIDADRELACIONADA[0] === undefined){
                    estado = json.ACTIVIDADRELACIONADA.IDSOLICITUD;
                    if(estado === '0'){
                        estado = json.ACTIVIDADRELACIONADA.IDCOORDINACIONDETALLE;
                    }
                    if(json.ACTIVIDADRELACIONADA.SEMAFORO === "1"){
                        semaforo = "verde.png";
                    }else if(json.ACTIVIDADRELACIONADA.SEMAFORO === "2"){
                        semaforo = "amarillo.png";
                    }else{
                        semaforo = "rojo.png";
                    }
                    lista +=
                    '<li data-theme="c" >'+
                                '<img src="img/'+semaforo+'" style="margin-top:5%; margin-left:1%"/>'+
                                    json.ACTIVIDADRELACIONADA.ACTIVIDAD+' '+estado+
                                    '<span class="ui-li-count"> '+
                                        json.ACTIVIDADRELACIONADA.ESTADO+
                                    '</span>'+
                            '</li>';
                }else{
                    for(var i in json.ACTIVIDADRELACIONADA){
                        estado = json.ACTIVIDADRELACIONADA[i].IDSOLICITUD;
                        if(estado === '0'){
                            estado = json.ACTIVIDADRELACIONADA[i].IDCOORDINACIONDETALLE;
                        }
                        if(json.ACTIVIDADRELACIONADA[i].SEMAFORO === "1"){
                            semaforo = "verde.png";
                        }else if(json.ACTIVIDADRELACIONADA[i].SEMAFORO === "2"){
                            semaforo = "amarillo.png";
                        }else{
                            semaforo = "rojo.png";
                        }
                        lista +=
                        '<li data-theme="c" >'+
                                    '<img src="img/'+semaforo+'" style="margin-top:5%; margin-left:1%"/>'+
                                        json.ACTIVIDADRELACIONADA[i].ACTIVIDAD+' '+estado+
                                        '<span class="ui-li-count"> '+
                                            json.ACTIVIDADRELACIONADA[i].ESTADO+
                                        '</span>'+
                                '</li>';
                    }
                }
            }else if(json.success === 'error'){
                alert("error de conexión");
                $.mobile.loading('hide');
            }else {
                $.mobile.loading('hide');
            }
            $page.append(lista);
        }else{
            lista +=
                '<li data-theme="c" >'+
                    '<span"> '+
                        'No tiene actividades relacionadas'+
                    '</span>'+
                '</li>';
            $page.append(lista);
        }
        $("#list-actividades").listview('refresh');
        $("#list-actividades").listview({
            create: function (event, ui) {}
        });
        $.mobile.loading('hide');
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

function detalleActividades (idSolicitud, idCoordinacion) {
    var $page = $("#page23 div[data-role='content']"),
        formData = methods[40]+"&idSolicitud="+idSolicitud+'&idCoordinacionDetalle='+idCoordinacion;
    $page.html('');
    $.getJSON(url, formData, function(json) {
        if(!json.hasOwnProperty('success')){
            $page.append('<div>'+
                            '<p><b>Servicio</b>12347</p>'+
                            '<p><b>Tarea:</b>'+json.ACTIVIDAD+'</p>'+
                            '<p><b>Fecha y hora Solicitud:</b>'+json.FECHAINICIO+'</p>'+
                            '<p><b>Usuario que solicito:</b>Ninguna</p>'+
                            '<p><b>Fecha cambio de estado:</b>'+json.FECHAFIN   +'</p>'+
                            '<p><b>Usuario que modifico:&nbsp;</b></p>'+
                        '</div>');
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
    }).error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

//gestionar partes
function searchPartes(formData){
    $.mobile.loading('show');
    $("#btn-search-partes").button('disable');
    var key = "idReparacion", lista = "", lista1 = "",
        $page = $("#page16 #list-search-partes"),
        $page1 = $("#page19 div[data-role='content'] ul");
    formData = methods[24]+"&"+key+"="+sessionStorage.getItem(key)+"&"+formData;

    $.getJSON(url, formData, function(json) {
        $page.html('');
        $page1.html('');
        lista +='<li data-role="list-divider" role="heading">'+
                        'Resultado'+
                    '</li>';
        lista1 += '<li data-role="list-divider" role="heading">'+
                        'Resultado'+
                    '</li>';
        if(!json.hasOwnProperty('success')){
            for(var module in json){
                lista +=
                '<li data-theme="c" >'+
                    '<a href="" data-transition="none" id="parte'+module+'" data-cargado="no" data-idpartedetalle="'+json[module].IDPARTEDETALLE+'">'+
                        '<span>'+json[module].ALIAS+'</span><br>'+
                        '<p><br>'+json[module].PARTE+'</p>'+
                    '</a>'+
                '</li>';
                lista1 += '<li data-theme="c" >'+
                            '<a href="" data-transition="none" id="parte'+module+'">'+
                                '<span>'+json[module].ALIAS+'</span><br>'+
                                '<p><br>'+json[module].PARTE+'</p>'+
                            '</a>'+
                        '</li>';
            }
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
            lista += '<li data-theme="c">No se encuentra la parte solicitada</li>';
        }else{
            lista += '<li data-theme="c">No se encuentra la parte solicitada</li>';
        }
        $page.html(lista);
        $page1.html(lista1);
        $("#list-search-partes a").on('click', function(event){
            if($(this).data('cargado') === 'no'){
                $(this).css('background', 'rgba(0, 0, 0, 0.1)');
                $(this).css('color', '#459CD6');
                carritoPartes($(this));
                $(this).data('cargado', "si");
                $("#list-search-partes").listview('refresh');
            }
        });
        $("#list-search-partes").listview({
            create: function(event, ui) {}
        });
        $page.listview('refresh');
        $.mobile.loading('hide');
        $("#btn-search-partes").button('enable');
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
        $("#btn-search-partes").button('enable');
    });
}

function carritoPartes ($parte) {
    var $page = $("#page16 #lista-solicitar-partes"),
        idParteDetalle = $parte.data('idpartedetalle'),
        alias = $parte.find('span').text(),
        serial = $parte.find('p').text(),
        modulo = $parte.attr('id');
    $page.append(
        '<li data-theme="c" data-idParteDetalle="'+idParteDetalle+'" data-icon="delete" data-modulo="'+modulo+'">'+
            '<a><span>'+alias+'.</span><br>'+
            '<p><br>'+serial+'</p>'+
            '<span style="float:left;">Cantidad </span>'+
            '<input type="number" class="cantidad-solicitar" name="CANTIDAD" data-mini="true" style="width: 20%; float:left; margin:0 20px;" /></a>'+
            '<a class="descartar-parte" data-mini="true" data-icon="delete" data-inline="true" data-theme="c" ></a>'+
        '</li>'
    );
    $page.listview('refresh');
    $('.descartar-parte').button({
        create: function (event, ui) {}
    });
    $page.find( ".cantidad-solicitar" ).textinput({
        create: function(event, ui) {}
    });
    $(".descartar-parte").live('click', function(event){
        $li = $(this).closest('li');
        $('#list-search-partes a[data-idpartedetalle="'+$li.data("idpartedetalle")+'"]').data('cargado', 'no');
        parte = $(this).closest('li').data('modulo');
        $("#list-search-partes #"+parte).css('background', '');
        $("#list-search-partes #"+parte).css('color', '');
        $(this).closest('li').remove();
    });
}
//Solicitar parte
function solicitarParte(){
    var key = "idReparacion",
        formData = "", i = 0,
        reparacion = sessionStorage.getItem(key),
        $page = $("#page16 div[data-role='content'] #lista-solicitar-partes li");
    $page.each(function(){
        if ($(this).data('role') !== "list-divider"){
            if($(this).find('input').val()>0){
                cantidad = '&CANTIDAD_'+i+'=' + $(this).find('input').val();
                formData += cantidad+'&IDREPARACION_'+i+'='+reparacion+'&IDPARTEDETALLE_'+i+'='+$(this).data("idpartedetalle");
                i++;
            }
        }
    });
    formData = methods[33]+formData;
    $.getJSON(url, formData, function(json) {
        $.mobile.loading('hide');
        if(!json.hasOwnProperty('success')){
            if(json.SOLICITUDSATISFACTORIA === "True"){
                alert("Se ha enviado solicitud de parte");
                limpiaSearch();
                $.mobile.changePage($("#page5"),{transition:"none"});
            }else{
                alert("No se envio solicitud de parte");
            }
            $('#solicitar-partes').button('enable');
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
            $('#solicitar-partes').button('enable');
        }else {
            $.mobile.loading('hide');
            $('#solicitar-partes').button('enable');
        }
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
        $('#solicitar-partes').button('enable');
    });
}

// Gestionar partes
function listarPartesSolicitadas () {
    var key = "idReparacion",
        $page = $("#page41 div[data-role='content'] #partes-solicitadas");
    formData = methods[41]+"&"+key+"="+sessionStorage.getItem(key);
    $page.html('');
    $.getJSON(url, formData, function(json) {
        if (typeof(json) === 'object' && !json.hasOwnProperty('SOLICITUD')){
            $page.append('<span>No tiene partes solicitadas</span>');
            $.mobile.loading('hide');
        }else {
            if(!json.hasOwnProperty('success')){
                var estado, typeEstado;
                if(json.SOLICITUD[0] === undefined) {
                    $page.append('<div data-role="collapsible" class="collapse-partes" id="'+json.SOLICITUD.IDSOLICITUD+'" data-accion="">'+
                                    '<h3>Solicitud '+json.SOLICITUD.IDSOLICITUD+'</h3>'+
                                    '<ul data-role="listview" data-divider-theme="b" data-inset="true" class="lista-partes-solicitadas" data-idsolicitud="'+json.SOLICITUD.IDSOLICITUD+'" data-accion="0">'+
                                        '<li data-accionrole="list-divider" role="heading">'+
                                            'Partes'+
                                        '</li>'+
                                    '</ul>'+
                                    '<input data-transition="none" type="button" class="btn-partes" value="enviar">'+
                                '</div>'
                        );
                    $page.find('div.collapse-partes .btn-partes').button({
                        create: function (event, ui) {}
                    });
                    if(json.SOLICITUD.PARTEDETALLE[0]===undefined){
                        estado = 'procesado';
                        typeEstado=3;
                        if(json.SOLICITUD.PUEDEELIMINAR === 'True'){
                            estado = 'eliminar';
                        }
                        if(json.SOLICITUD.PUEDECONSUMIR === 'True'){
                            estado = 'recibir';
                            typeEstado = 1;
                        }else{
                            if(json.SOLICITUD.PARTEDETALLE.DEVOLVER === 'True'){
                                estado = 'devolver';
                                typeEstado = 0;
                            }
                        }
                        $page.find('ul[data-idsolicitud="'+json.SOLICITUD.IDSOLICITUD+'"]').append(
                            '<li data-idsolicituddr="'+json.SOLICITUD.PARTEDETALLE.IDSOLICITUDDETALLEREPARACION+'" data-accion="'+typeEstado+'">'+
                                '<a><span>'+json.SOLICITUD.PARTEDETALLE.ALIAS+'</span><br>'+
                                '<p><br>'+json.SOLICITUD.PARTEDETALLE.CANTIDADPEDIDA+' '+estado+'</p></a>'+
                                '<input min="0" max="'+json.SOLICITUD.PARTEDETALLE.CANTIDADPEDIDA+'" type="number" class="cantidad-partes" name="CANTIDAD" data-mini="true" style="width: 20%; margin-left: 10px;" />'+
                                '<select data-role="none" name="IDCODIGONOVEDADCONFIGURACION" class="novedades-almacen" data-mini="true" data-novedad="" ></select>'+
                                '<a class="eliminar-parte" data-mini="true" data-icon="delete" data-inline="true" data-theme="c" style="display:none;"></a>'+
                            '</li>'
                        );
                    }else{
                        for (var j in json.SOLICITUD.PARTEDETALLE) {
                            estado = 'procesado';
                            typeEstado=3;
                            if(json.SOLICITUD.PUEDEELIMINAR === 'True'){
                                estado = 'eliminar';
                            }
                            if(json.SOLICITUD.PUEDECONSUMIR === 'True'){
                                estado = 'recibir';
                                typeEstado = 1;
                            }else{
                                if(json.SOLICITUD.PARTEDETALLE[j].DEVOLVER === 'True'){
                                    estado = 'devolver';
                                    typeEstado = 0;
                                }
                            }
                            $page.find('ul[data-idsolicitud="'+json.SOLICITUD.IDSOLICITUD+'"]').append(
                                '<li data-idsolicituddr="'+json.SOLICITUD.PARTEDETALLE[j].IDSOLICITUDDETALLEREPARACION+'" data-accion="'+typeEstado+'">'+
                                    '<a><span>'+json.SOLICITUD.PARTEDETALLE[j].ALIAS+'</span><br>'+
                                    '<p><br>'+json.SOLICITUD.PARTEDETALLE[j].CANTIDADPEDIDA+' '+estado+'</p></a>'+
                                    '<input min="0" max="'+json.SOLICITUD.PARTEDETALLE[j].CANTIDADPEDIDA+'" type="number" class="cantidad-partes" name="CANTIDAD" data-mini="true" style="width: 20%; margin-left: 10px;" />'+
                                    '<select data-role="none" name="IDCODIGONOVEDADCONFIGURACION" class="novedades-almacen" data-mini="true" data-novedad="" ></select>'+
                                    '<a class="eliminar-parte" data-mini="true" data-icon="delete" data-inline="true" data-theme="c" style="display:none;"></a>'+
                                '</li>'
                            );
                        }
                    }
                    $page.find('#'+json.SOLICITUD.IDSOLICITUD).append(
                        '<div data-role="fieldcontain">'+
                        '<form id="form-novedades-partes" autocomplete="off">'+
                            '<select data-role="none" name="IDCODIGONOVEDADCONFIGURACION" class="novedades-almacen-general" data-novedad=""></select>'+
                            '<p><div data-role="fieldcontain">'+
                                '<fieldset data-role="controlgroup">'+
                                    '<label for="comentario-partes">Comentario</label>'+
                                    '<textarea name="PREGUNTA" class="comentario-partes text-novedades" placeholder=""></textarea>'+
                                '</fieldset>'+
                            '</div></p>'+
                            '<div data-role="fieldcontain" class="div-adicional-almacen">'+
                                '<fieldset data-role="controlgroup">'+
                                    '<label for="valor-adicional-almacen">'+
                                        'Pregunta'+
                                    '</label>'+
                                    '<textarea name="VALORADICIONALPREGUNTA" id="valor-adicional-almacen" class="text-novedades""></textarea>'+
                                '</fieldset>'+
                            '</div>'+
                        '</form>'+
                            '<input data-role="button" data-transition="node" class="btn-novedad-partes" value="novedad solicitud" />'+
                        '</div>'
                    );
                    $('.cantidad-partes').hide();
                    $('.novedades-almacen').closest('div.ui-select').hide();
                    if(json.SOLICITUD.PUEDECONSUMIR === 'True'){
                        $('.cantidad-partes').show();
                    }else{
                        $('.btn-partes').button('disable');
                    }
                    if(json.SOLICITUD.PUEDEELIMINAR === 'True'){
                        $('.btn-partes').button('disable');
                        $('.eliminar-parte').show();
                        $('.novedades-almacen').closest('div.ui-select').hide();
                    }
                }else{
                    for (var i in json.SOLICITUD) {
                        $page.append('<div data-role="collapsible" class="collapse-partes" id="'+json.SOLICITUD[i].IDSOLICITUD+'" data-accion="">'+
                                        '<h3>Solicitud '+json.SOLICITUD[i].IDSOLICITUD+'</h3>'+
                                        '<ul data-role="listview" data-divider-theme="b" data-inset="true" class="lista-partes-solicitadas" data-idsolicitud="'+json.SOLICITUD[i].IDSOLICITUD+'" data-accion="0">'+
                                            '<li data-role="list-divider" role="heading">'+
                                                'Partes'+
                                            '</li>'+
                                        '</ul>'+
                                        '<input data-transition="none" type="button" class="btn-partes" value="enviar">'+
                                    '</div>'
                            );
                        $div_main =  $page.find('div#'+json.SOLICITUD[i].IDSOLICITUD);
                        $div_main.find('.btn-partes').button({
                            create: function (event, ui) {}
                        });
                        console.log($div_main);
                        if(json.SOLICITUD[i].PARTEDETALLE[0]===undefined){
                            estado = 'procesado';
                            typeEstado=3;
                            if(json.SOLICITUD[i].PUEDEELIMINAR === 'True'){
                                estado = 'eliminar';

                            }
                            if(json.SOLICITUD[i].PUEDECONSUMIR === 'True'){
                                estado = 'recibir';
                                typeEstado = 1;
                                $div_main.data('accion', '1');
                            }else{
                                if(json.SOLICITUD[i].PARTEDETALLE.DEVOLVER === 'True'){
                                    estado = 'devolver';
                                    typeEstado = 0;
                                    $div_main.data('accion', '1');
                                }
                            }

                            $page.find('ul[data-idsolicitud="'+json.SOLICITUD[i].IDSOLICITUD+'"]').append(
                                '<li data-idsolicituddr="'+json.SOLICITUD[i].PARTEDETALLE.IDSOLICITUDDETALLEREPARACION+'" data-accion="'+typeEstado+'">'+
                                    '<a><span>'+json.SOLICITUD[i].PARTEDETALLE.ALIAS+'</span><br>'+
                                    '<p><br>'+json.SOLICITUD[i].PARTEDETALLE.CANTIDADPEDIDA+' '+estado+'</p></a>'+
                                    '<input min="0" max="'+json.SOLICITUD[i].PARTEDETALLE.CANTIDADPEDIDA+'" type="number" class="cantidad-partes" name="CANTIDAD" data-mini="true" style="width: 20%; margin-left: 10px;" />'+
                                    '<select data-theme="b" data-role="none" name="IDCODIGONOVEDADCONFIGURACION" class="novedades-almacen" data-mini="true" data-novedad="" ></select>'+
                                    '<a class="eliminar-parte" data-mini="true" data-icon="delete" data-inline="true" data-theme="c" style="display:none;"></a>'+
                                '</li>'
                            );
                        }else{
                            for (var k in json.SOLICITUD[i].PARTEDETALLE) {
                                estado = 'procesado';
                                typeEstado=3;
                                if(json.SOLICITUD[i].PUEDEELIMINAR === 'True'){
                                    estado = 'eliminar';
                                }
                                if(json.SOLICITUD[i].PUEDECONSUMIR === 'True'){
                                    estado = 'recibir';
                                    typeEstado = 1;
                                    $div_main.data('accion', '1');
                                }else{
                                    if(json.SOLICITUD[i].PARTEDETALLE[k].DEVOLVER === 'True'){
                                        estado = 'devolver';
                                        typeEstado = 0;
                                        $div_main.data('accion', '1');
                                    }
                                }
                                $page.find('ul[data-idsolicitud="'+json.SOLICITUD[i].IDSOLICITUD+'"]').append(
                                    '<li data-idsolicituddr="'+json.SOLICITUD[i].PARTEDETALLE[k].IDSOLICITUDDETALLEREPARACION+'" data-accion="'+typeEstado+'">'+
                                        '<a><span>'+json.SOLICITUD[i].PARTEDETALLE[k].ALIAS+'</span><br />'+
                                        '<p><br>'+json.SOLICITUD[i].PARTEDETALLE[k].CANTIDADPEDIDA+' '+estado+'</p></a>'+
                                        '<input  min="0" max="'+json.SOLICITUD[i].PARTEDETALLE[k].CANTIDADPEDIDA+'" type="number" class="cantidad-partes" name="CANTIDAD" data-mini="true" style="width: 20%; margin-left: 10px;" />'+
                                        '<select data-theme="b" data-role="none" name="IDCODIGONOVEDADCONFIGURACION" class="novedades-almacen" data-mini="true" data-novedad="" ></select>'+
                                        '<a class="eliminar-parte" data-mini="true" data-icon="delete" data-inline="true" data-theme="c" style="display:none;"></a>'+
                                    '</li>'
                                );
                            }
                        }
                        $div_main.append(
                            '<div data-role="fieldcontain">'+
                            '<form id="form-novedades-partes" autocomplete="off">'+
                                '<select data-theme="b" data-role="none" name="IDCODIGONOVEDADCONFIGURACION" class="novedades-almacen-general" data-novedad=""></select>'+
                                '<p><div data-role="fieldcontain">'+
                                    '<fieldset data-role="controlgroup">'+
                                        '<label for="comentario-partes">Comentario</label>'+
                                        '<textarea name="PREGUNTA" class="comentario-partes text-novedades" placeholder=""></textarea>'+
                                    '</fieldset>'+
                                '</div></p>'+
                                '<div data-role="fieldcontain" class="div-adicional-almacen">'+
                                    '<fieldset data-role="controlgroup">'+
                                        '<label for="valor-adicional-almacen">'+
                                            'Pregunta'+
                                        '</label>'+
                                        '<textarea name="VALORADICIONALPREGUNTA" id="valor-adicional-almacen" class="text-novedades"></textarea>'+
                                    '</fieldset>'+
                                '</div>'+
                            '</form>'+
                                '<input data-role="button" data-transition="node" class="btn-novedad-partes" value="novedad solicitud" />'+
                            '</div>'
                        );
                        // $ulactual = $page.find('div#'+json.SOLICITUD[i].IDSOLICITUD);
                        $div_main.find('.cantidad-partes').hide();
                        $div_main.find('.novedades-almacen').closest('div.ui-select').hide();
                        if(json.SOLICITUD[i].PUEDECONSUMIR === 'True'){
                            $div_main.find('.cantidad-partes').show();
                        }else{
                            $div_main.find('.btn-partes').button('disable');
                        }
                        if(json.SOLICITUD[i].PUEDEELIMINAR === 'True'){
                            $div_main.find('.btn-partes').button('disable');
                            $div_main.find('.eliminar-parte').show();
                            $div_main.find('.novedades-almacen').closest('div.ui-select').hide();
                        }
                        console.log($div_main.data('accion'));
                        if($div_main.data('accion') === '1'){
                            $div_main.find('.btn-partes').button('enable');
                        }
                    }
                }
                $('.div-adicional-almacen').hide();
                var formData2, option = "", option1 = "",
                    key1 = 'idTicket';
                formData2 = methods[47]+"&"+key1+"="+sessionStorage.getItem(key1);
                $.getJSON(url, formData2, function(json2) {
                    if(!$.isEmptyObject(json2)){
                        if(!json2.hasOwnProperty('success')){
                            if(json2.NOVEDAD[0] === undefined){
                                option +=
                                    '<option value="'+json2.NOVEDAD.IDCODIGONOVEDADCONFIGURACION+'" data-idvaloradicional="'+json2.NOVEDAD.VALORADICIONALPREGUNTA+'">'+
                                        json2.NOVEDAD.DESCRIPCION+'</option>';
                                $page.find('.novedades-almacen-general').append(option);
                                $('.novedades-almacen-general').selectmenu({
                                    create: function(event, ui) {}
                                });
                            }else{
                                for(var module in json2.NOVEDAD){
                                    option +=
                                    '<option value="'+json2.NOVEDAD[module].IDCODIGONOVEDADCONFIGURACION+'" data-idvaloradicional="'+json2.NOVEDAD[module].VALORADICIONALPREGUNTA+'">'+
                                        json2.NOVEDAD[module].DESCRIPCION+'</option>';
                                }
                                $page.find('.novedades-almacen-general').append(option);
                                $('.novedades-almacen-general').selectmenu({
                                    create: function(event, ui) {}
                                });
                            }
                        }else if(json.success === 'error'){
                            alert("error de conexión");
                            $.mobile.loading('hide');
                            $('.novedades-almacen-general').selectmenu({
                                    create: function(event, ui) {}
                            });
                        }else {
                            $.mobile.loading('hide');
                            $('.novedades-almacen-general').selectmenu({
                                    create: function(event, ui) {}
                            });
                        }
                    }else{
                        alert("error de conexión");
                        $.mobile.loading('hide');
                        $('.novedades-almacen-general').selectmenu({
                                create: function(event, ui) {}
                        });
                    }
                });
                formData2 = methods[31]+"&"+key1+"="+sessionStorage.getItem(key1);
                $.getJSON(url, formData2, function(json3) {
                    if(!$.isEmptyObject(json3)){
                        if(!json3.hasOwnProperty('success')){
                            if(json3.NOVEDAD[0] === undefined){
                                option1 +=
                                    '<option value="'+json3.NOVEDAD.IDCODIGONOVEDADCONFIGURACION+'" data-idvaloradicional="'+json3.NOVEDAD.VALORADICIONALPREGUNTA+'">'+
                                        json3.NOVEDAD.DESCRIPCION+'</option>';
                                $page.find('.novedades-almacen').append(option1);
                                 $( '.novedades-almacen').selectmenu({
                                    create: function(event, ui) {
                                        $('.novedades-almacen').closest('div.ui-select').each(function(){
                                            $(this).css('width','50%');
                                            $(this).hide();
                                        });
                                    }
                                });
                            }else{
                                for(var module in json3.NOVEDAD){
                                    option1 +=
                                    '<option value="'+json3.NOVEDAD[module].IDCODIGONOVEDADCONFIGURACION+'" data-idvaloradicional="'+json3.NOVEDAD[module].VALORADICIONALPREGUNTA+'">'+
                                        json3.NOVEDAD[module].DESCRIPCION+'</option>';
                                }
                                $page.find('.novedades-almacen').append(option1);
                                 $( '.novedades-almacen').selectmenu({
                                    create: function(event, ui) {
                                        $('.novedades-almacen').closest('div.ui-select').each(function(){
                                            $(this).css('width','50%');
                                            $(this).hide();
                                        });
                                    }
                                });
                            }
                        }else if(json.success === 'error'){
                            alert("error de conexión");
                            $.mobile.loading('hide');
                        }else {
                            $.mobile.loading('hide');
                        }
                    }else{
                        alert("error de conexión");
                        $.mobile.loading('hide');
                    }
                });
                $('.cantidad-partes').textinput({
                    create: function (event, ui) {
                        $(this).focusout(function(){
                            if($(this).val() > $(this).attr('max')){
                                $(this).val($(this).attr('max'));
                            }
                            if($(this).val() < $(this).attr('max')){
                                $(this).closest('li').find('div.ui-select').show();
                            }else{
                                $(this).closest('li').find('div.ui-select').hide();
                            }
                        });
                    }
                });
                $('#valor-adicional-almacen').textinput({
                    create: function (event, ui) {}
                });
                $('.comentario-partes').textinput({
                    create: function (event, ui) {}
                });
                $('.btn-novedad-partes').button({
                    create: function (event, ui) {
                        $(this).button('disable');
                    }
                });
                $('.collapse-partes').collapsible({
                    create: function (event, ui) {}
                });
                $('.lista-partes-solicitadas').listview({
                    create: function (event, ui) {}
                });
                // $page.fieldcontain('refresh');
                $('#page41 .btn-novedad-partes').click(function(){
                    $.mobile.loading('show');
                    var $collapsible = $(this).closest('div[data-role="collapsible"]'),
                    formData = $collapsible.find("#form-novedades-partes").serialize();
                        // $('#page41 .novedades-almacen-general option:selected').val() > '0'){
                    if($collapsible.find('form .novedades-almacen-general option:selected').val() > '0'){
                        $(this).button('disable');
                        registroNovedad(formData, $collapsible.attr('id'));
                    }else{
                        $.mobile.loading('hide');
                    }
                });
                $('.btn-partes').on('click', function(event){
                    $.mobile.loading('show');
                    $(this).button('disable');
                    $ul = $(this).closest('div[data-role="collapsible"]').find('ul.lista-partes-solicitadas');
                    $listaRecibe = $ul.find('li[data-accion="'+1+'"]');
                    $listaDevuelve = $ul.find('li[data-accion="'+0+'"]');
                    if($listaRecibe.length > 0){
                        recibePartes($listaRecibe);
                    }
                    if($listaDevuelve.length > 0){
                        devuelvePartes($listaDevuelve);
                    }
                    if($ul.find('li').length !== ($listaDevuelve.length + $listaRecibe.length + 1)){
                        $.mobile.loading('hide');
                        $(this).button('enable');
                    }
                });
                $(".eliminar-parte").on('click', function(event){
                    $liactual = $(this).closest('li');
                    var solicitudR = $liactual.data('idsolicituddr'),
                        key = 'idUsuario';
                    formData2 = methods[48]+"&idSolicitudDetalleReparacion="+solicitudR+'&'+key+"="+sessionStorage.getItem(key);
                    $.getJSON(url, formData2, function(json) {
                        if(!json.hasOwnProperty('success')){
                            if(json.ELIMINACIONSATISFACTORIA === 'True'){
                                $liactual.remove();
                            }else{
                                alert('no se elimino la parte');
                            }
                        }else if(json.success === 'error'){
                            alert("error de conexión");
                            $.mobile.loading('hide');
                        }else {
                            $.mobile.loading('hide');
                        }
                    });
                });
                $.mobile.loading('hide');
            }else if(json.success === 'error'){
                alert("error de conexión");
                $.mobile.loading('hide');
            }else {
                $.mobile.loading('hide');
            }
        }
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

function devuelvePartes ($lista) {
    var formData = methods[32], i = 0;
    $lista.each(function(){
        idSolicitud = $(this).data('idsolicituddr');
        cantidad = $(this).find('input').val();
        formData += '&IDSOLICITUDDETALLEREPARACION_'+i+'='+idSolicitud+'&CANTIDAD_'+i+'='+cantidad;
        i++;
    });
    $.getJSON(url, formData, function(json) {
        $.mobile.loading('hide');
        if(!json.hasOwnProperty('success')){
            if(json.RECEPCIONSATISFACTORIA === "True"){
                alert('Se ha enviado devolver partes');
                $.mobile.changePage($("#page5"),{transition:"none"});
            }else{
                alert('NO se pudo enviar devolución');
            }
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
            $('.btn-partes').button('enable');
        }else {
            $.mobile.loading('hide');
            $('.btn-partes').button('enable');
        }
        $('.btn-partes').button('enable');
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
        $('.btn-partes').button('enable');
    });
}

function recibePartes ($lista) {
    var formData = methods[34], i = 0;
    $lista.each(function(){
        idSolicitud = $(this).data('idsolicituddr');
        cantidad = $(this).find('input').val();
        idconfiguracion = $('.novedades-almacen').find(':selected').val();
        formData += '&IDSOLICITUDDETALLEREPARACION_'+i+'='+idSolicitud+'&CANTIDAD_'+i+'='+cantidad +'&IDCODIGONOVEDADCONFIGURACION_'+i+'='+idconfiguracion;
        i++;
    });
    $.getJSON(url, formData, function(json) {
        $.mobile.loading('hide');
        if(!json.hasOwnProperty('success')){
            if(json.RECEPCIONSATISFACTORIA === "True"){
                alert('Se ha enviado recibir partes');
                $.mobile.changePage($("#page5"),{transition:"none"});
            }else{
                alert('NO se pudo enviar recibir partes');
            }
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
            $('.btn-partes').button('enable');
        }else {
            $.mobile.loading('hide');
            $('.btn-partes').button('enable');
        }
        $('.btn-partes').button('enable');
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
        $('.btn-partes').button('enable');
    });
}

//load detalles partes
function detallesPartes(formData, idparte){
    var key = "idReparacion", $page = $("#page36 div[data-role='content'] #detalle-parte");
    formData = methods[24]+"&"+key+"="+sessionStorage.getItem(key)+"&"+formData;
    $page.html('');
    $.getJSON(url, formData, function(json) {
        if(!json.hasOwnProperty('success')){
            $page.append('<h3>'+
                            'Alias: '+json[idparte].ALIAS+
                        '</h3>'+
                        '<div><p>'+
                            '<b>Parte: </b>'+
                                json[idparte].PARTE+
                            '</p>'+
                            '<p>'+
                            '<b>Disponible: </b>'+
                                json[idparte].DISPONIBLE+
                            '</p>'+
                            '<p>'+
                            '<b>Solicitadas: </b>'+
                                json[idparte].SOLICITADA+
                            '</p>'+
                            '<p>'+
                            '<b>Recibidas: </b>'+
                                'recibdas'+
                            '</p>'+
                            '<p>'+
                            '<b>Pendientes por recibir: </b>'+
                                'pendientes'+
                            '</p>'+
                            '<p>'+
                            '<b>Pendientes Por devolver: </b>'+
                                'pendientes devolver'+
                            '</p>'+
                            '<p>'+
                            '<b>Devueltas: </b>'+
                                'devueltas'+
                            '</p>'+
                            '<p>'+
                            '<b>Estado: </b>'+
                                'estado'+
                            '</p>'+
                        '</div>'
            );
            $("#solicita-parte").data("idParteDetalle",json[idparte].IDPARTEDETALLE);
            $("#recibe-parte").data("idParteDetalleReparacion",json[idparte].IDPARTEDETALLEREPARACION);
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
    $.mobile.changePage($("#page36"),{transition:"none"});
}

//listarNovedades en mensajeria
function listarNovedades () {
    var formData,
        key = 'idUsuario',
        key1 = 'idReparacion',
        $generados = $("#page42 #msn-generados"),
        $recibidos = $("#page42 #msn-recibidos");
    formData = methods[42] +'&idUsuarioConsulta='+sessionStorage.getItem(key)+'&'+key1+'='+sessionStorage.getItem(key1);
    $generados.html('');
    $generados.append('<li data-role="list-divider" role="heading">'+
                        'Mensajes generados'+
                    '</li>');
    $recibidos.html('');
    $recibidos.append('<li data-role="list-divider" role="heading">'+
                        'Mensajes recibidos'+
                    '</li>');
    $('.msn-novedades').listview('refresh');
    $.getJSON(url, formData, function(json) {
        if(!json.hasOwnProperty('success')){
            ticket = sessionStorage.getItem('idTicket');
            for (var i in json) {
                if(json[i].GENERADO === 'False'){
                    $recibidos.append('<li data-theme="c">'+
                        '<a href="" data-transition="none" class="msn-detalle-novedad" data-pantalla="#'+json[i].NAVEGACIONMOVILIDAD+'" data-idcodigo="'+json[i].IDCODIGONOVEDADCONFIGURACIONREPARACIONDETALLE+'" data-idticket="'+ticket+'" data-tipo="recibido">'+
                            json[i].NOVEDADDESCRIPCION+
                            '</a>'+
                        '</li>');
                }else{
                    $generados.append('<li data-theme="c">'+
                        '<a href="" data-transition="none" class="msn-detalle-novedad" data-pantalla="#'+json[i].NAVEGACIONMOVILIDAD+'" data-idcodigo="'+json[i].IDCODIGONOVEDADCONFIGURACIONREPARACIONDETALLE+'" data-idticket="'+ticket+'" data-tipo="generado">'+
                            json[i].NOVEDADDESCRIPCION+
                            '</a>'+
                        '</li>');
                }
            }
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
        $('#page43 div[data-role="header"] a[data-icon="back"]').attr('href','#page42');
        $('.msn-novedades').listview('refresh');
        $.mobile.loading('hide');
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

function obtenerNovedad (idcodigo, tipo) {
    var formData, respuesta = "", pregunta = "", preguntaAdicional="",
        $page = $("#page43 #detalle-msn-novedad");
    formData = methods[30] +'&idCodigoNovedadConfiguracionReparacionDetalle='+idcodigo;
    $page.html('');
    $.getJSON(url, formData, function(json) {
        if(!json.hasOwnProperty('success')){
            respuesta = json.NOVEDADMENSAJE.RESPUESTA;
            pregunta = json.NOVEDADMENSAJE.PREGUNTA;
            fechap = json.NOVEDADMENSAJE.FECHAPREGUNTA;
            fechar = json.NOVEDADMENSAJE.FECHARESPUESTA;
            codigorespu = json.NOVEDADMENSAJE.IDCODIGONOVEDADRESPUESTA;
            codigoconfi = json.NOVEDADMENSAJE.IDCODIGONOVEDADCONFIGURACIONREPARACIONDETALLE;
            if (typeof(respuesta) === 'object'){
                respuesta = "";
            }
            if (typeof(pregunta) === 'object'){
                pregunta = "";
            }
            if (typeof(fechap) === 'object'){
                fechap = "";
            }
            if (typeof(fechar) === 'object'){
                fechar = "";
            }
            if (typeof(codigorespu) === 'object'){
                codigorespu = "";
            }
            if (typeof(codigoconfi) === 'object'){
                codigoconfi = "";
            }
            $page.append(
                '<p><h2><b>'+json.NOVEDADMENSAJE.NOVEDADDESCRIPCION+'</b></h2></p>'+
                '<p><h3>Pregunta: <b>'+pregunta+'</b></h3></p>'+
                '<p><h3>Fecha: <b>'+fechap+'</b></h3></p>'+
                '<p><h3>Respuesta: <b>'+respuesta+'</b></h3></p>'+
                '<p><h3>Fecha: <b>'+fechar+'</b></h3></p>'+
                '<label>respuesta</label>'+
                '<input class="respuesta-novedad" type="text" value="" name="RESPUESTA" data-idrespuesta="'+codigorespu+'" data-idconfiguracion="'+codigoconfi+'"/>'
            );
            // preguntaAdicional = json.NOVEDADMENSAJE.TEXTOPREGUNTAMOVILIDAD;
            // if (typeof(pregunta) !== 'object'){
            //     $page.append(
            //         '<div data-role="fieldcontain" class="pregunta-adicional">'+
            //             '<fieldset data-role="controlgroup">'+
            //                 '<p><h3>Pregunta: <b>'+preguntaAdicional+'</b></h3></p>'+
            //             '</fieldset>'+
            //         '</div>'
            //     );
            //     for( var j in json.NOVEDADMENSAJE.RESPUESTASPARAMETRIZADAS.RESPUESTAPARAMETRIZADA){
            //         $page.find('div[data-role="fieldcontain"] fieldset').append(
            //             '<label><input type="radio" name="TEXTORESPUESTA" />'+json.NOVEDADMENSAJE.RESPUESTASPARAMETRIZADAS.RESPUESTAPARAMETRIZADA[j].TEXTORESPUESTA+'</label>'
            //         );
            //     }
            // }
            $page.append(
                '<input class="responde-novedad" type="button" value="enviar" />'
            );
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
        $("input[type='radio']").checkboxradio({
            create: function(event, ui) {}
        });
        $('.respuesta-novedad').textinput({
            create: function(event, ui){}
        });
        $('.responde-novedad').button({
            create: function(event, ui){}
        });
        $('.responde-novedad').button('disable');
        if(respuesta === ""){
            $('.responde-novedad').button('enable');
        }
        if(tipo){
            $('.responde-novedad').button('disable');
        }
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

//Solicitar parte
function responderNovedad(){
    var key = "idUsuario",
        $respuesta = $('#page43 .respuesta-novedad');
    formData = methods[19]+'&IDUSUARIORESPONDE='+sessionStorage.getItem(key)+"&IDCODIGONOVEDADCONFIGURACIONREPARACIONDETALLE="+$respuesta.data("idconfiguracion")+'&RESPUESTA='+$respuesta.val()+'&IDCODIGONOVEDADRESPUESTA='+$respuesta.data("idrespuesta")+'&VALORADICIONALRESPUESTA=';
     $.getJSON(url, formData, function(json) {
        if(!json.hasOwnProperty('success')){
             if(json.RESPUESTA === "True"){
                 alert("Se ha enviado respuesta");
             }else{
                 alert("No se envio respuesta");
             }
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
    })
     .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

//---------------------menu reporte de novedades
//novedades sistema
function novedadesSistema(){
    $('#page15 div').remove('.ui-select');
    $('#page15 .select-novedad').append(
        '<select data-role="none" name="IDCODIGONOVEDADCONFIGURACION" id="novedad-ticket" class="novedades-ticket">'+
        '</select>'
    );
    $('.novedades-ticket').selectmenu({
        create: function(event, ui){}
    });
    var option = "", formData, $page = $("#page15 #novedad-ticket");
    formData = methods[25];
    $page.html('');
    $.getJSON(url, formData, function(json) {
        $.mobile.loading('hide');
        $('#btn-send-novedad').button('disable');
        if(!json.hasOwnProperty('success')){
            if(json[0] === undefined){
                    option +=
                    '<option value="'+json.IDCODIGONOVEDADCONFIGURACION+'" data-idvaloradicional="'+json.VALORADICIONALPREGUNTA+'">'+
                        json.DESCRIPCION+'</option>';
            }else{
                for(var module in json){
                    option +=
                    '<option value="'+json[module].IDCODIGONOVEDADCONFIGURACION+'" data-idvaloradicional="'+json[module].VALORADICIONALPREGUNTA+'">'+
                        json[module].DESCRIPCION+'</option>';
                }
            }
            $page.html(option);
            var myselect = $page;
            myselect[0].selectedIndex = 0;
            myselect.selectmenu("refresh");
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

function registroNovedad (formdata, idSolicitud) {
    var formData,
        key = "idReparacion",
        key1 = "idUsuario",
        idReparacion = sessionStorage.getItem(key);
        idUsuario = sessionStorage.getItem(key1);
    if(idReparacion === null){
        idReparacion = 0;
    }
    formData = formdata +'&'+ methods[29]+"&IDUSUARIOPREGUNTA="+idUsuario+"&IDREPARACION="+idReparacion+"&IDSOLICITUD="+idSolicitud;
    $.getJSON(url, formData, function(json) {
        $.mobile.loading('hide');
        if(!json.hasOwnProperty('success')){
            if(json.RESPUESTA === 'True'){
                $(".text-novedades").val('');
                $('.novedades-ticket').val(0);
                $('.novedades-almacen-general').val(0);
                alert('Se ha enviado la novedad');
                if ($("#form-novedades-ticket").data("novedad") === '2'){
                    opcionesGestionReparaccion();
                    $.mobile.changePage($("#page5"),{transition:"none"});
                }else{
                    $.mobile.changePage($("#page3"),{transition:"none"});
                }
            }
        }else if(json.success === 'error'){
            alert('No se pudo enviar la novedad');
            $('.btn-novedad-partes').button('enable');
            $('#btn-send-novedad').button('enable');
        }else {
            $('.btn-novedad-partes').button('enable');
            $('#btn-send-novedad').button('enable');
        }
    })
    .error(function() {
        $.mobile.loading('hide');
        alert("error de conexión");
        $.mobile.loading('hide');
        $('.btn-novedad-partes').button('enable');
        $('#btn-send-novedad').button('enable');
    });
}

//-----------------------menu asignacion de servicios
//listado de ingenieros
function mapListadoIng(){
    var lista = "", formData, key = "idUsuario", $page = $("#page26 div[data-role='content'] ul");
    formData = methods[26]+"&"+key+"="+sessionStorage.getItem(key);
    $.getJSON(url, formData, function(json) {
        $page.html('');
        $page.append('<li data-role="list-divider" role="heading">'+
                        'Ingenieros'+
                    '</li>'
        );
        if(!json.hasOwnProperty('success')){
            initializeMaplist(json[0].LATITUD.replace(",","."),json[0].LONGITUD.replace(",","."));
            var place = [], lat, lon;
            for(var module in json){
                var ingeniero = [];
                lista +=
                '<li data-theme="c">'+
                    '<a href="" data-transition="none" data-idingeniero="'+json[module].IDUSUARIO+'">'+
                        'Ing. '+json[module].NOMBREUSUARIO+" "+json[module].APELLIDOUSUARIO+
                    '</a>'+
                '</li>';
                lat = json[module].LATITUD.replace(",","."),
                lon = json[module].LONGITUD.replace(",",".");
                nombre = json[module].NOMBREUSUARIO;
                ingeniero.nombre = nombre;
                ingeniero.localiza = new google.maps.LatLng(lat, lon);
                place[module] = ingeniero;
            }
            $page.append(lista);
            crearMarkerMap(place);
            $("#list-ingenieros a").click(function(event){
                event.preventDefault();
                serviciosIngeniero($(this).data("idingeniero"), $(this).text());
            });
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
        $('#list-ingenieros').listview({create: function(event, ui) {}});
        $('#list-ingenieros').listview('refresh');
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}
//carga el mapa con los datos
var map;
function initializeMaplist(latitude, longitude) {
    $.mobile.loading('hide');
    var latlng = new google.maps.LatLng(latitude, longitude),
        myOptions = {
            zoom: 10,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
    var $content = $("#page26 #map-list-ing");
    $content.height (screen.height * 0.30);
    map = new google.maps.Map ($content[0], myOptions);
}

function crearMarkerMap(place){
    for (var i in place){
    var marker = new google.maps.Marker({
            position: place[i].localiza,
            map: map,
            title: place[i].nombre
        });
    }
    if(place[1] !== undefined){
        var limits = new google.maps.LatLngBounds(
            place[1].localiza,
            place[0].localiza
        );
        map.fitBounds(limits);
    }
}

//lista servicios asignados ingeniero
function serviciosIngeniero(idIngeniero, name){
    $.mobile.changePage($("#page30"),{transition:"none"});
    $.mobile.loading('show');
    var formData, lista = "", $page = $("#page30 div[data-role='content'] ul");
    formData = methods[27]+"&idUsuario="+idIngeniero;
    $page.html('');
    $("#page30 div[data-role='content'] h3").html('');
    $("#page30 div[data-role='content'] h3").append(name);
    $.getJSON(url, formData, function(json) {
        $page.append('<li data-role="list-divider" role="heading">'+
                        'Asignaciones'+
                    '</li>'
            );
        $('#list-servicios-ing').listview({
            create: function(event, ui) {}
        });
        if (!json.hasOwnProperty('success')) {
            for(var module in json){
                lista +=
                '<li data-theme="c">'+
                    '<a href="" data-transition="none" data-idreparacion="'+json[module].IDREPARACION+'">'+
                        'Servicio: '+json[module].IDTICKET+' /Estado: '+json[module].ESTADO+
                    '</a>'+
                '</li>';
            }
            $page.append(lista);
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
        $('#list-servicios-ing').listview('refresh');
        $("#list-servicios-ing a").click(function(event){
            cambioIngeniero($(this).data("idreparacion"), $(this).text());
        });
        $("#page30 div[data-role='content']").fieldcontain('refresh');
        $.mobile.loading('hide');
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

//cambia ingeniero servicios asignados
function cambioIngeniero(idReparacion, name){
    $.mobile.changePage($("#page31"),{transition:"none"});
    $.mobile.loading('show');
    var formData, key = "idUsuario", $page = $("#page31 div[data-role='content'] form");
    formData = methods[26]+"&"+key+"="+sessionStorage.getItem(key);
    $page.html('');
    $.getJSON(url, formData, function(json) {
        $page.append('<div data-role="fieldcontain">'+
                        '<fieldset data-role="controlgroup" data-type="vertical">'+
                        '<legend>'+
                            'Ingenieros'+
                        '</legend>'+
                    '</div>'
            );
        if (!json.hasOwnProperty('success')) {
            for(var module in json){
                $page.find("div[data-role='fieldcontain'] fieldset").append(
                    '<input name="idUsuario" id="radio'+module+'" value="'+json[module].IDUSUARIO+'" type="radio" />'+
                    '<label for="radio'+module+'">'+
                        json[module].NOMBREUSUARIO+" "+json[module].APELLIDOUSUARIO+
                    '</label>'
                );
            }
            $page.append('<a data-role="button" data-transition="none" href="#page26" id="btn-cambio-ing" data-idreparacion="'+idReparacion+'">'+
                        'Aceptar'+
                    '</a>'
                    );
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
        $("#page31 div[data-role='content']").fieldcontain('refresh');
        $page.find("input[type='radio']").checkboxradio({
            create: function(event, ui) {}
        });
        $('#btn-cambio-ing').button({
            create: function(event, ui) {
                $(this).click(function(event){
                        asignaIngeniero($page.serialize(), $(this).data("idreparacion"));
                    });
            }
        });
        $.mobile.loading('hide');
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

//envia el cambio de ingeniero
function asignaIngeniero(formData, idReparacion){
    var key = "idUsuario";
    formData = methods[28]+"&idReparacion="+idReparacion+"&idIngenieroLider="+sessionStorage.getItem(key)+"&"+formData;
    $.getJSON(url, formData, function(json) {
        if (!json.hasOwnProperty('success')) {
            if(json.CAMBIOSATISFACTORIO === 'True'){
                alert('Se ha asignado nuevo ingeniero');
            }
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}
//----------------------mensajes sin leer --------------------//

function mensajesSinleer () {
    var key = "idUsuario", lista = "",
        $page = $("#page40 div[data-role='content'] ul");
    formData = methods[43]+'&idUsuarioConsulta='+sessionStorage.getItem(key);
    $page.html('');
    $.getJSON(url, formData, function(json) {
        if (!json.hasOwnProperty('success')) {
            $.mobile.loading('hide');
            $page.append('<li data-role="list-divider" role="heading">'+
                    'Mensajes sin leer'+
                '</li>'
            );
            if(json.NOVEDADMENSAJE[0] === undefined){
                lista +=
                '<li data-theme="c">'+
                    '<a href="" data-transition="none" class="msn-detalle-novedad" data-pantalla="#'+json.NOVEDADMENSAJE.NAVEGACIONMOVILIDAD+'" data-idcodigo="'+json.NOVEDADMENSAJE.IDCODIGONOVEDADCONFIGURACIONREPARACIONDETALLE+'" data-idticket="'+json.NOVEDADMENSAJE.IDTICKET+'" style="padding-bottom: 0;">'+
                        'Ticket: '+json.NOVEDADMENSAJE.IDTICKET+': '+json.NOVEDADMENSAJE.NOVEDADDESCRIPCION+
                    '</a>'+
                    '<span style= "margin-left: 15px;font-size: 14px;color: rgb(163, 158, 158);font-weight: normal;">'+json.NOVEDADMENSAJE.FECHAPREGUNTA+'</span>'+
                '</li>';
            }else{
                for(var module in json.NOVEDADMENSAJE){
                    lista +=
                    '<li data-theme="c">'+
                        '<a href="" data-transition="none" class="msn-detalle-novedad" data-pantalla="#'+json.NOVEDADMENSAJE[module].NAVEGACIONMOVILIDAD+'" data-idcodigo="'+json.NOVEDADMENSAJE[module].IDCODIGONOVEDADCONFIGURACIONREPARACIONDETALLE+'" data-idticket="'+json.NOVEDADMENSAJE[module].IDTICKET+'" style="padding-bottom: 0;">'+
                            'Ticket: '+json.NOVEDADMENSAJE[module].IDTICKET+': '+json.NOVEDADMENSAJE[module].NOVEDADDESCRIPCION+
                        '</a>'+
                        '<span style= "margin-left: 15px;font-size: 14px;color: rgb(163, 158, 158);font-weight: normal;">'+json.NOVEDADMENSAJE[module].FECHAPREGUNTA+'</span>'+
                    '</li>';
                }
            }
            $page.append(lista);
            $page.listview({
                create: function(event, ui) {}
            });
            $page.listview('refresh');
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
        $('#page43 div[data-role="header"] a[data-icon="back"]').attr('href','#page40');
        $.mobile.loading('hide');
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

function marcarNovedadLeida(idcodigo){
    var formData = methods[45]+"&idCodigoNovedadConfiguracionReparacionDetalle="+idcodigo;
    $.getJSON(url, formData, function(json) {
        if (!json.hasOwnProperty('success')) {
            if(json.RESPUESTA === 'True'){
                var can = $("#page3 li #cantidad-mensajes").text();
                if(can > 0){
                    can -= 1;
                }
                $("#page3 li #cantidad-mensajes").html(can);
            }
        }else if(json.success === 'error'){
            alert("error de conexión");
            $.mobile.loading('hide');
        }else {
            $.mobile.loading('hide');
        }
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

function resumenCierre(){
    var formData, key = "idTicket", key1 = 'idUsuario';
    formData = methods[46]+"&"+key+"="+sessionStorage.getItem(key)+"&"+key1+"="+sessionStorage.getItem(key1);
    $.getJSON(url, formData, function(json) {
        if(json.SATISFACTORIO === "True"){
            alert("Se ha enviado resumen de cierre");
            reloadMenuOption();
        }else{
            alert("No se pudo enviar resumen de cierre");
            $.mobile.changePage($('#page5'),{transition:'none'});
        }
    })
    .error(function() {
        alert("error de conexión");
        $.mobile.loading('hide');
    });
}

$('.msn-detalle-novedad').live('click', function(){
    marcarNovedadLeida($(this).data('idcodigo'));
    var tipo;
    if($(this).data('pantalla').search('object') === 2){
        if($(this).data('tipo') === 'generado'){
            $('.responde-novedad').button('disable');
            tipo = true;
        }else{
            $('.responde-novedad').button('enable');
            tipo = false;
        }
        $.mobile.changePage($("#page43"),{transition:"none"});
        obtenerNovedad($(this).data('idcodigo'), tipo);
    }else{
        sessionStorage.setItem('idTicket', $(this).data('idticket'));
        opcionesGestionReparaccion();
        page = $(this).data('pantalla');
        $.mobile.changePage($(page),{transition:"none"});
    }
});

$(".novedades-ticket").live('change', function(event, ui){
    $select = $('.novedades-ticket option:selected');
    if($select.data('idvaloradicional') === 'True'){
        $("div.div-adicional").show();
    }
    if($select.val()>'0'){
        $('#btn-send-novedad').button('enable');
    }
});

$(".novedades-almacen-general").live('change', function(){
    $select = $(this).find('option:selected');
    $form = $(this).closest('div[data-role="fieldcontain"]');
    if($select.data('idvaloradicional') === 'True'){
        $form.find("div.div-adicional-almacen").show();
    }
    if($select.val()>'0'){
        $form.find('.btn-novedad-partes').button('enable');
    }
});

$('.responde-novedad').live('click', function() {
    responderNovedad();
});

$("#list-actividades a").click(function(event){
    detalleActividades($(this).data('idSolicitud'), $(this).data('idCoordinacion'));
});

var dataPost, idModulo;
$('.btn-save-module').live('click', function(event){
    event.preventDefault();
    $btn = $(this);
    $form = $btn.closest('form');
    $.mobile.loading('show');
    $btn.button('disable');
    event.preventDefault();
    seleccausa = $form.find('.causal-menu2 option:selected');
    selecproblema = $form.find('.problems-menu1 option:selected');
    selecrepara = $form.find('.reparacion-menu4 option:selected');
    seleccierre = $form.find('.cierre-menu3 option:selected');
     if(seleccausa.val()>'0' && seleccierre.val()>'0'&& selecrepara.val()>'0'&& selecproblema.val()>'0'){
        var formData = $form.serialize(),
            nuevo = '&NUEVO=FALSE',
            key = 'idReparacion';
        idModulo = $form.data('idmoduleticket');
        if($form.data('modulo')){
            nuevo = '&NUEVO=TRUE';
        }
        var formData2 = formData.split("&"), cant = 0;
        formData = '';
        for (var i = 0; i < formData2.length; i++) {
            if(formData2[i].search("CANT") < 0){
                formData += "&"+formData2[i];
            }else{
                i = formData2.length;
            }
        }
        formData = methods[12]+formData+'&IDMODULOEQUIPOTICKET='+idModulo+nuevo+'&IDREPARACION='+sessionStorage.getItem(key);
        dataPost = formData;
        data = formData.split('&');
        var params = new Object();
        for (var k in data){
            subdata = data[k].split('=');
            params[subdata[0]]=subdata[1];
        }
        var datajson = JSON.stringify(params);
        if (typeof(FileUploadOptions) === 'undefined'){
            sendWhitoutImage();
        }else{
            sendWhitFoto(params);
        }
    }else{
        $btn.button('enable');
        $.mobile.loading('hide');
        alert('Falta selección');
    }
});

function sendWhitFoto(params){
    var largeImage = document.getElementById('smallImage');
    imageURI = largeImage.src;
    var options = new FileUploadOptions();
    options.fileKey="IMAGENDESPUES";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.mimeType="image/jpeg";
    options.params = params;
    var ft = new FileTransfer();
    ft.upload(imageURI, url1, successSend, failSend, options);
}

function successSend(r) {
    $.mobile.loading('hide');
    if(typeof(r.response) === 'string'){
        if(r.response.search('RESPUESTA') > -1){
            processResponse();
        }else{
            $btn.button('enable');
        }
    }else{
        if(!r.response.hasOwnProperty('success')){
            if(r.response.RESPUESTA === 'True'){
                processResponse();
            }
        }else{
            $btn.button('enable');
        }
    }
}

function processResponse(){
    var modules = [];
    $btn.closest('div.module-collapse').find('h3 a').css('background', 'rgba(0, 0, 0, 0.1)');
    $btn.closest('div.module-collapse').find('h3 a').css('color', '#459CD6');
    
    alert('Se ha cerrado el modulo');

    //Almacena la cantidad de modulos guardados
    var total_modulos_guardados = sessionStorage.getItem("modulos_guardados");
    total_modulos_guardados++;
    sessionStorage.setItem("modulos_guardados", total_modulos_guardados);
    
    cerrarParteModuloDetalle(idModulo);
    
    var modulo= {
        'id': $form.data('idmoduleticket'),
        'nombre': $form.data('namemodulo'),
        'problema': $form.find('.problema').find(':selected').text(),
        'causal': $form.find('.causal').find(':selected').text(),
        'cierre': $form.find('.cierre').find(':selected').text(),
        'reparacion': $form.find('.reparacion').find(':selected').text(),
        'descripcion': $form.find('.texarea-description').val()
    };

    datajson = sessionStorage.getItem('modulo');
    sessionStorage.removeItem('modulo');
    datajson = JSON.parse(datajson);
    for (var i in datajson){
        modules.push(datajson[i]);
    }
    
    modules.push(modulo);
    datajson = JSON.stringify(modules);
    sessionStorage.setItem('modulo', datajson);
}

function failSend(error) {
    if(error.code === 1){
        sendWhitoutImage();
    }else{
        alert("ocurrio un error al cargar la foto");
        $.mobile.loading('hide');
        $btn.button('enable');
    }
}

function sendWhitoutImage(){
    var modules = [];
    formData = dataPost;
    var response = $.ajax({
        url: url1,
        type: "POST",
        crossDomain: true,
        data: formData,
        dataType: 'text json',
        success: function(json) {
            $.mobile.loading('hide');
            if(!json.hasOwnProperty('success')){
                if(json.RESPUESTA === 'True'){
                    processResponse();
                }
            }else{
                $btn.button('enable');
            }
        }
    });
}

function limpiaSearch(){
    document.getElementById("form-search-partes").reset();
                $('#list-search-partes').html('');
                $('#lista-solicitar-partes').html('');
                $("#list-search-partes a").css('background', '');
                $("#list-search-partes a").css('color', '');
}
    