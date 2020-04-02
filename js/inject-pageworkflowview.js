/*

Para ativar este trecho de código, adicione no manifest.json o trecho abaixo:

,
    "content_scripts": [
        {
            "matches": [ "<all_urls>" ],
            "js": [ 
                    "js/jquery-3.3.1.min.js",
                    "js/inject-pageworkflowview.js"
                  ],
            "css": [
                    "css/inject-pageworkflowview.css"
                    ],
            "run_at":"document_end",
            "persistent":false
        }
    ]

*/


$(document).ready(function() {
    if(window.location.host.indexOf("fluig")>=0){
        $('#page-header').after('<div class="panel panel-primary" id="panelDevFluig" style="width: 150px;" >'+
			'<div class="panel-heading">'+
				'<h3 class="panel-title">DevFluig</h3>'+
			'</div>'+
			'<div class="panel-body">'+
				'<span id="abrirSubstituto" class="counter-group" style=""><a href="#" class="fluigicon fluigicon-user-transfer fluigicon-md"></a></span>'+
			'</div>'+
		'</div>');

        $('#abrirSubstituto').click(function(){
            if(window.location.href.indexOf("pageworkflowview") >= 0){
             buscaInformacoesFormularioBPM();
            }
        });
    }
});

function buscaInformacoesFormularioBPM(){
    var _urlIframe = $("#workflowView-cardViewer").attr('src').split("?")[1];    
    var WKNumProces;
    
    var append = "";
    var listaTags = _urlIframe.split("&");
    for(x in listaTags){
        if(listaTags[x].indexOf("WKNumProces=")>=0){
            WKNumProces = listaTags[x].split("WKNumProces=")[1];
            break;
        }
    }
    
    buscaSolicitacao(WKNumProces, function(solicitacao){
        if(solicitacao.values.length > 0){
            buscaUsuarioLogado(function(user){
                if(solicitacao.values[0]["processTaskPK.colleagueId"].indexOf("Pool:Group:") == -1){
                    buscaSubstitutos(function(data){
                        var encontrouSubstituto = false;
                        for(var substituto in data){
                             if(substituto == solicitacao.values[0]["processTaskPK.colleagueId"]){    
                                encontrouSubstituto = true;
                                window.open(window.location.origin+"/portal/p/1/pageworkflowview?app_ecm_workflowview_processInstanceId="+WKNumProces+
                                                            "&app_ecm_workflowview_currentMovto="+solicitacao.values[0]["processTaskPK.movementSequence"]+
                                                            "&app_ecm_workflowview_taskUserId="+substituto+
                                                            "&app_ecm_workflowview_managerMode=false");
                                 break;
                            }
                        };
                        if(!encontrouSubstituto){
                           alert("Você não é substituto deste usuário!");
                        }
                    });
                } else{
                    var grupo = solicitacao.values[0]["processTaskPK.colleagueId"].split("Pool:Group:")[1];
                    adicionaGrupo(user.login, grupo, function(){
                        window.open(window.location.origin+"/portal/p/1/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID="+WKNumProces);
                    });
                }
            });
        }
    });
}

function buscaUsuarioLogado(callback){
    $.ajax({
      url: window.location.origin+"/api/public/2.0/users/getCurrent",
      type: "GET",
      async: false,
      success: function (data) {
          callback(data.content);
      },
      error: function () {}
    });
}

function buscaSubstitutos(callback){
    $.ajax({
      url: window.location.origin+"/ecm/api/rest/ecm/centralTasks/getValidReplacedUsers",
      type: "GET",
      async: false,
      success: function (data) {
          callback(data);
      },
      error: function () {}
    });
}

function buscaSolicitacao(WKNumProces, callback){
    
    var post = {
	"name":"processTask",
	"fields":null,
	"constraints":[
            {
                "_field":"processTaskPK.processInstanceId",
                "_initialValue":WKNumProces,
                "_finalValue":WKNumProces,
                "_type":0
            },
            {
                "_field":"active",
                "_initialValue":true,
                "_finalValue":true,
                "_type":0
            }
	   ],
	"order":null
    };
    
    $.ajax({
      url: window.location.origin+"/api/public/ecm/dataset/datasets",
      data: JSON.stringify(post),
      type: "POST",
      async: false,
      contentType: "application/json",
      success: function (dataset) {
          callback(dataset.content);
      },
      error: function () {}
    });
}

function adicionaGrupo(login, grupo, callback){
    console.log(JSON.stringify([login]));
    $.ajax({
      url: window.location.origin+"/api/public/2.0/groups/addUsers/"+grupo,
      data: JSON.stringify([login]),
      type: "POST",
      async: false,
      contentType: "application/json",
      success: function (retorno) {
          callback(retorno);
      },
      error: function () {}
    });
}
