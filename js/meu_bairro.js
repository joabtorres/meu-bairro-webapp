function mostraConteudo(){
	var element = document.getElementById("interface");
	element.style.display="block";
	init_map1();
	initialize();
    carregarPontos();
}
$(document).ready(function () {

    $('div.bgParallax').each(function () {
        var $obj = $(this);

        $(window).scroll(function () {
            var yPos = -($(window).scrollTop() / $obj.data('speed'));

            var bgpos = '50% ' + yPos + 'px';

            $obj.css('background-position', bgpos);

        });
    });
});

$(document).ready(function () {

    var defaults = {
        containerID: 'toTop', // fading element id
        containerHoverID: 'toTopHover', // fading element hover id
        scrollSpeed: 1200,
        easingType: 'linear'
    };


    $().UItoTop({easingType: 'easeOutQuart'});

});
$(document).ready(function ($) {
    $(".scroll").click(function (event) {
        event.preventDefault();
        $('html,body').animate({scrollTop: $(this.hash).offset().top}, 1200);
    });
});

if (document.getElementById("mapa_contato")) {
    function init_map1() {
        var myLocation = new google.maps.LatLng(-4.222738, -56.001706);
        var mapOptions = {
            center: myLocation,
            zoom: 16
        };
        var marker = new google.maps.Marker({
            position: myLocation,
            title: "Localização dos imoveis da Kananda Imobiliaria!",
            icon: "imagens/marcado.png"
        });
        var map = new google.maps.Map(document.getElementById("mapa_contato"),
                mapOptions);
        marker.setMap(map);
    }
    init_map1();
}

/**
 * 
 * PÁGINA MAPA: Configuração do mapa
 */
if (document.getElementById("mapaview")) {
    var markerCluster = null;
    var map;
    var idInfoBoxAberto;
    var infoBox = [];
    var markers = [];

    function initialize() {
        var latlng = new google.maps.LatLng(-4.254695, -56.005965);

        var options = {
            zoom: 8,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById("mapaview"), options);
    }

    initialize();
    carregarPontos();

    function abrirInfoBox(id, marker) {
        if (typeof (idInfoBoxAberto) == 'number' && typeof (infoBox[idInfoBoxAberto]) == 'object') {
            infoBox[idInfoBoxAberto].close();
        }
        infoBox[id].open(map, marker);
        idInfoBoxAberto = id;
    }


    function carregarPontos() {
        if (markerCluster) {
            markerCluster.clearMarkers();
        }

        $.getJSON('json/comercios.json', function (pontos) {

            var latlngbounds = new google.maps.LatLngBounds();

            $.each(pontos, function (index, ponto) {

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(ponto.latitude_endereco, ponto.longitude_endereco),
                    title: "Meu Bairro - Comercios",
                    icon: "imagens/mapa/marcado.png"
                });

                var myOptions = {
                    content: "<img src='" + ponto.comercio_imagem + "' class='img-responsive'/><p class='text-center font-bold'>"+ponto.comercio_nome+"</p> <p class='text-center'>"+ponto.comercio_categoria+"</p> <a href='"+ponto.comercio_detalhe+"' class='btn btn-success btn-block'><span class='glyphicon glyphicon-plus'></span> Mais detatlhes</a> <a href='"+ponto.comercio_google_map+"' class='btn btn-danger btn-block' target='_blank'><span class='glyphicon glyphicon-globe'></span> Rotas</a>",
                    pixelOffset: new google.maps.Size(-150, 0)
                };

                infoBox[ponto.cod_imovel] = new InfoBox(myOptions);
                infoBox[ponto.cod_imovel].marker = marker;

                infoBox[ponto.cod_imovel].listener = google.maps.event.addListener(marker, 'click', function (e) {
                    abrirInfoBox(ponto.cod_imovel, marker);
                });

                markers.push(marker);
                latlngbounds.extend(marker.position);
            });
            var mcOptions = {gridSize: 50, maxZoom: 15, imagePath: 'imagens/mapa/m'};

            markerCluster = new MarkerClusterer(map, markers, mcOptions);
            map.fitBounds(latlngbounds);
        });

    }

    function remover_markers() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    }
}