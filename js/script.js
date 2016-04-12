$(document).ready(function () {
    //var Punto = {"x":null, "y":null, "nombre":null, "notas":null};
    var Puntos = [];
    var Datos = {
        "imagen": null,
        "puntos": Puntos
    };

    $('#datos').hide();

    $('.get_coord').on('click', 'img', function (ev) {

        /* comprobamos si esto é un point ou é novo */
        if ($(this)[0].className == "point") {
            /* esto é un point */

            //recollemos coord
            var x = parseInt($(this).css('transform').split(',')[4]);
            var y = parseInt($(this).css('transform').split(',')[5]);
            var coord = x + "," + y;
            //console.log('POINT x: ' + x + ', y: ' + y);
            //console.log(Datos.puntos);
            
            $('#datos').show();
            $('#point_input').val(coord);

            //vaciamos
            $("#nombre").val('');
            $("#notas").val('');

            //buscar
            for (var i = 0; i < Datos.puntos.length; i++) {
                if (Datos.puntos[i].x == x && Datos.puntos[i].y == y) {
                    //console.log("existe");
                    $("#nombre").val(Datos.puntos[i].nombre);
                    $("#notas").val(Datos.puntos[i].notas);
                    break;
                } else {
                    //console.log("no existe");
                    encontrado = false;
                }
            }

        } else {
            /* é novo */
            $('#datos').hide(); //escondense os input            

            /* obtemos coordenadas */
            var $div = $(ev.target);
            var $display = $div.find('.display');

            var offset = $div.offset();
            var x = ev.clientX - offset.left;
            var y = ev.clientY - offset.top;

            //axustando
            var mapwidth = $("#map").width();
            var x = parseInt((x - mapwidth) - 12);
            var y = parseInt(y - 12);

            //console.log('NOVO x: ' + x + ', y: ' + y);                        

            /* agregamos un point */
            $("#current_map").append('<img class="point" id="'+x+'point'+y+'" src="image/point.png" style="z-index: 99; transform: translate(' + x + 'px, ' + y + 'px);">')
        }

    });


    /* Almacenando puntos */
    function guardar_punto() {
        var Punto = {
            "x": null,
            "y": null,
            "nombre": null,
            "notas": null
        };

        var coord = $("#point_input").val();
        var x = coord.split(',')[0];
        var y = coord.split(',')[1];
        var nombre = $("#nombre").val();
        var notas = $("#notas").val();

        Punto.x = x;
        Punto.y = y;
        Punto.nombre = nombre;
        Punto.notas = notas;

        if (Datos.puntos.length == 0) {
            Datos.puntos.push(Punto);
        } else {
            //buscar
            var encontrado = false;
            var posicion;
            for (var i = 0; i < Datos.puntos.length; i++) {
                if (Datos.puntos[i].x == x && Datos.puntos[i].y == y) {
                    //console.log("existe");
                    encontrado = true;
                    posicion = i;
                    break;
                } else {
                    //console.log("no existe");
                    encontrado = false;
                }
            }

            if (encontrado == true) {
                //console.log("update");
                var x = coord.split(',')[0];
                var y = coord.split(',')[1];
                var nombre = $("#nombre").val();
                var notas = $("#notas").val();

                Datos.puntos[posicion].x = x;
                Datos.puntos[posicion].y = y
                Datos.puntos[posicion].nombre = nombre;
                Datos.puntos[posicion].notas = notas;

            } else {
                //console.log("insert");
                Datos.puntos.push(Punto);
            }

        }

        //console.log(Datos);
    };
    $("#nombre").change(function () {
        guardar_punto();
    });

    $("#notas").change(function () {
        guardar_punto();
    });

    /* Borrar punto */
    $('#point_delete').on("click", function(){
        var x = $('#point_input').val().split(',')[0];
        var y = $('#point_input').val().split(',')[1];

        //console.log(Datos.puntos);
            //buscar
            var encontrado = false;
            var posicion;
            for (var i = 0; i < Datos.puntos.length; i++) {
                if (Datos.puntos[i].x == x && Datos.puntos[i].y == y) {
                    //console.log("existe");
                    encontrado = true;
                    posicion = i;
                    break;
                } else {
                    //console.log("no existe");
                    encontrado = false;
                }
            }

            if (encontrado == true) {
                if (posicion > -1) {
                    var coord = $("#point_input").val();
                    var x = coord.split(',')[0];
                    var y = coord.split(',')[1];
                    id = x+'point'+y;
 
                    //console.log(Datos.puntos);
                    Datos.puntos.splice(posicion, 1);
                    $('#'+id).remove();
                    //console.log(Datos.puntos);
                }


            }; 

    });


    /* agrega a imaxen en base64 */
    function handleFileSelect(evt) {
        $("#current_map").empty();

        var files = evt.target.files; // FileList object

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {

            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    $("#current_map").append(['<img id="map" src="', e.target.result, '" title="', escape(theFile.name), '" style="width:600px;"/>'].join(''));
                    Datos.imagen = e.target.result;
                    //console.log(Datos); 
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    };

    document.getElementById('input_add_image').addEventListener('change', handleFileSelect, false);


    /* Exportar JSON */
    $('#export').on("click", function (e) {
        //Non funciona en dispositivos móviles :/
        stringy = JSON.stringify(Datos);
        var blob = new Blob([stringy], {
            type: "text/json"
        });

        // Construese a uri
        var uri = URL.createObjectURL(blob);

        // Construese o elemento <a>
        var link = document.createElement("a");
        link.download = 'datos.json'; // nome do arquivo
        link.href = uri;

        // Trapi para móviles
        //var clickEvent = document.createEvent('MouseEvent');
        //clickEvent.initEvent('click', true, true);

        // Agregase ó DOM e lanzase o evento click
        document.body.appendChild(link);
        link.click();         
        //link.dispatchEvent(clickEvent); //continuacion do trapi

        // Limpase o DOM
        document.body.removeChild(link);
        delete link;
    });

    
    /* Importar datos do arquivo */
    $('#import').change(function(evt){
        files = evt.target.files;
        var reader = new FileReader();
        
        reader.onload = (function (theFile){
            return function (e){
                contido = e.target.result;
                //console.log(contido);
                
                //parse from contido and draw
                Datos = JSON.parse(contido);
                
                //append map
                $("#current_map").append(['<img id="map" src="', Datos.imagen, '" title="', escape(theFile.name), '" style="width:600px;"/>'].join(''));
                
                //append points
                $.each(Datos.puntos, function(indice, valor){                    
                    $("#current_map").append('<img class="point" id="'+valor.x+'point'+valor.y+'" src="image/point.png" style="z-index: 99; transform: translate(' + valor.x + 'px, ' + valor.y + 'px);">');                   
                });
                
                
                
                
                
            };
        })(files[0]);
        
        reader.readAsText(files[0]);
    });
    
});
