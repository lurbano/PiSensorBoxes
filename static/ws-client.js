$(document).ready(function(){

        var WEBSOCKET_ROUTE = "/ws";

        if(window.location.protocol == "http:"){
            //localhost
            var ws = new WebSocket("ws://" + window.location.host + WEBSOCKET_ROUTE);
            }
        else if(window.location.protocol == "https:"){
            //Dataplicity
            var ws = new WebSocket("wss://" + window.location.host + WEBSOCKET_ROUTE);
            }

        ws.onopen = function(evt) {
            $("#ws-status").html("Connected");
            $("#ws-status").css("background-color", "#afa");
            $("#server_light").val("ON");
            };

        ws.onmessage = function(evt) {
            //console.log(evt);
            var sData = JSON.parse(evt.data);
            if (sData.sensor !== 'undefined'){
              //console.log(sData.info + "|" + )

              if (sData.info == 'check' || sData.info == 'check_multipulse'){
                var txt = sData.data + " " + sData.units;
                $("#dMeasurement").html(txt);
                }
              else if (sData.info == 'log'){
                var txt = "<table id='log_table'>";
                txt +=    "<tr><th>Time (sec)</th><th>Data</th></tr>";
                for (var r = 0; r < sData.data.length; r++){
                  var t = "<tr>";
                  t += "<td>" + sData.data[r][0] +  "</td>";
                  t += "<td>" + sData.data[r][1] +  "</td>";
                  t += "</tr>";
                  txt += t;
                  }
                txt += '</table>';
                $("#log_data").html(txt);
                $("#logging").html("");
                }
              else if (sData.info == 'log_feed'){
                  var t = "<tr>";
                  t += "<td>" + sData.t +  "</td>";
                  t += "<td>" + sData.d +  "</td>";
                  t += "</tr>";
                $("#log_data tr:last").after(t);
                console.log(t);
                }

              };
            };

        ws.onclose = function(evt) {
            $("#ws-status").html("Disconnected");
            $("#ws-status").css("background-color", "#faa");
            $("#server_light").val("OFF");
            };

        $("#server_light").click(function(){
            var opt = $(this).val() == "OFF" ? "on" : "off";
            $(this).val(opt.toUpperCase());
            //console.log("Server light: " + opt);
            var msg = '{"what": "ser_led", "opts": "'+opt+'"}';
            ws.send(msg);
            });

        $("#dist_measure").click(function(){
          var msg = '{"what": "dist", "opts": "check"}';
          ws.send(msg);
            });

        $("#dist_multipulse").click(function(){
          var msg = '{"what": "dist", "opts": "check_multipulse",';
          msg +=    ' "info": {"n": "10"}}';
          ws.send(msg);
            });

        $("#dist_log, #dist_log_feed").click(function(){
            var dt = $("#dist_dt").val();
            var tt = $("#dist_tt").val();

            //Check values
            var l_error = true;
            var err ='';
            if (dt <= 0.0) {
                err = "Error: <strong>Timestep</strong> must be greater than zero";
                console.log(err);
              } else if (tt <= 0.0 || tt < dt) {
                err += "Error: <strong>Total Time</strong> must be greater than zero, and greater than the timestep.";
              } else {
                //Passed checks then
                l_error = false;
              }
            $("#logError").html(err);

            if (!l_error) {
              $("#logging").html("Logging...");
              $("#logging").html($(this).attr("id"));

              var msg = '{"what": "dist",';
              if ($(this).attr("id") == "dist_log") {
                msg += '"opts": "log",';
                }
              else if ($(this).attr("id") == "dist_log_feed"){
                msg += '"opts": "log_feed",';
                //set up table for feed
                var txt = "<table>";
                txt +=    "<tr><th>Time (sec)</th><th>Data</th></tr>";
                $("#log_data").html(txt);
                }
              msg += '"info": {"dt": "'+dt+'","tt":"'+tt+'" }}';
              ws.send(msg);
              }

            });


      });
