$(document).ready(function() { // Espera a que carguen todos os datos da web
  var form = $("#formulario"); // colle o formulario

  if($("form").length > 0){ // se hai un formulario na pagina
    form.submit(function(evt) { // Captura o evento que envía o formulario
      evt.stopPropagation();
      var optValor = ($("input[name='group1']:checked").val()); // Colle o elemento seleccionado das opcións
      var cantidad = $("#cantidad").val(); // a cantidade seleccionada

      if (typeof optValor != "undefined" && cantidad > 0) { // mira que haxa algun valor seleccionado

        var incidencia = { // define unha incidencia
          "tipo": optValor, // o tipo de incidencia
          "cantidad": cantidad, // a cantidade de producto
          "fecha": new Date().today(), // o día de creación
          "hora": new Date().timeNow() // a hora de creación
        };

        var incidencias = readCookie("incidencias"); // recupera as incidencias antiguas

        if (incidencias == null) { // se non hai elementos anteriores
          incidencias = Array(incidencia); // crea o vector coa incidencia
        } else {
          incidencias = JSON.parse(incidencias); // se hai elemntos, deserializamos os datos da cookie
          incidencias.push(incidencia); // inserta a incidencia no vector
        }

        var incidenciaString = JSON.stringify(incidencias); // serializamos os datos das incidencias
        createCookie("incidencias", incidenciaString, 20); // garda a informacion en forma de cookie

        $("#cantidad").val(0); // reinicia o campo
        $("input[name='group1']:checked").prop('checked', false); // reinicia o campo

        alert("Incidencia creada");
      } else {

        var error = "Error:\n";

        if (cantidad == 0) { // comproba cal e o erro
          error += ("Seleccione unha cantidade \n");
        }

        if(typeof optValor == "undefined") {
          error += ("Seleccione unha opción da lista");
        }

        alert(error);
      }

      return false // cancela o refresco da pagina
    });
  }else{ // se non está o formulario, deberemos estar na paxina de datos
      var incidencias = readCookie("incidencias"); // recupera as incidencias gardadas
      var tabla = $("#tabla-incidencias")

      if (incidencias != null){
        incidencias = JSON.parse(incidencias); // deserializa as incidencias
        $("#total-incidencias").text(incidencias.length); // imprime el total de incidencias

        $.each(incidencias, function(clave, incidencia){
          var tr = $("<tr></tr>");

          var td1 = $("<td>" +incidencia.fecha+ "</td>");
          var td2 = $("<td>" +incidencia.hora+ "</td>");
          var td3 = $("<td>" +incidencia.tipo+ "</td>");
          var td4 = $("<td>" +incidencia.cantidad+ "</td>");

          tr.append(td1);
          tr.append(td2);
          tr.append(td3);
          tr.append(td4);

          tabla.append(tr);
        });

      }else{
        $("#total-incidencias").text("0"); // imprime el total de incidencias
        tabla.remove();
      }

  }

});

// ** Funcions importadas **
// Funcions para xestionar as cookies
function createCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + ";" + expires + "; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// La fecha de hoy
Date.prototype.today = function() {
  return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
}

Date.prototype.timeNow = function() {
  return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
}
