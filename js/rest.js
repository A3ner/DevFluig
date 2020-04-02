function buscaDocumento(numDocument, callback){
    $.ajax({
      url: url.origin+"/api/public/2.0/documents/getActive/"+numDocument,
      type: "GET",
      async: false,
      success: function (data) {
          callback(data);
      },
      error: function () {}
    });
}

function apresentaInfoDocumento(documento){
    buscaRestInfoDocumento(documento, function(data){
        var append = "";
        if(data != "ERROR"){
            for(var att in data){
                append += "<div class='col-xs-10'><input class='form-control' value='"+att+" = "+data[att]+"' readonly='readonly' /></div>";
            }
        }
        $("#infoDocument-panel").html(append);
    });
}

function buscaRestInfoDocumento(numDocument, callback){
    $.ajax({
      url: url.origin+"/api/public/ecm/document/activedocument/"+numDocument,
      type: "GET",
      async: false,
      success: function (data) {
          callback(data.content);
      },
      error: function () {
          callback("ERROR");
      }
    });
}


function buscaInfoDatasetGerado(dataset, callback){
    $.ajax({
      url: url.origin+"/ecm/api/rest/ecm/dataset/customlist/cg?offset=0&limit=1&orderby=&pattern="+dataset,
      type: "GET",
      async: false,
      success: function (data) {
          if(data.content){
             
            }
          callback(data.content);
      },
      error: function () {}
    });
}

function buscaInfoDatasetInterno(dataset, callback){      
    $.ajax({
      url: url.origin+"ecm/api/rest/ecm/dataset/customlist/i?offset=0&limit=1&orderby=&pattern="+dataset,
      type: "GET",
      async: false,
      success: function (data) {
          callback(data.content);
      },
      error: function () {}
    });
}

function buscaDatasetGerado(dataset, callback){
    
    $.ajax({
      url: url.origin+"/api/public/ecm/document/getDocumentByDatasetName/"+dataset,
      type: "GET",
      async: false,
      success: function (data) {
          callback(data.content);
      },
      error: function () {
          callback(false);
      }
    });
}

function restUsuarios(user, callback){
    
    $.ajax({
      url: url.origin+"/api/public/2.0/users/getUser/"+user,
      type: "GET",
      async: false,
      success: function (data) {  
        callback(data.content);
      },
      error: function () {
          callback(false);
      }
    });
}

function buscaUsuariosLogado(callback){
    
    $.ajax({
      url: url.origin+"/api/public/2.0/users/getCurrent/",
      type: "GET",
      async: false,
      success: function (data) {
          callback(data.content);
      },
      error: function () {
          callback(false);
      }
    });
}

function restInfoGrupo(grupo, callback){
    
    $.ajax({
      url: url.origin+"/portal/api/rest/wcm/service/group/get?json="+grupo,
      type: "GET",
      async: false,
      success: function (data) {
          callback(data);
      },
      error: function () {
          callback(false);
      }
    });
}

function restUsuariosGrupo(grupo, callback){
    
    $.ajax({
      url: url.origin+"/api/public/2.0/groups/listUsersByGroup/"+grupo,
      type: "GET",
      async: false,
      success: function (data) {
          callback(data.content);
      },
      error: function () {
          callback(false);
      }
    });
}

function buscaolicitacao(WKNumProces, callback){
    
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
    
    restDataset(post, callback);
}

function restDataset(arrayPost, callback){
    $.ajax({
      url: url.origin+"/api/public/ecm/dataset/datasets",
      data: JSON.stringify(arrayPost),
      type: "POST",
      async: false,
      contentType: "application/json",
      success: function (dataset) {
          callback(dataset.content);
      },
      error: function () {}
    });
}

function buscaUsuarioPorEmail(email, callback){
    
    var post = {
	"name":"colleague",
	"fields":null,
	"constraints":[
            {
                "_field":"mail",
                "_initialValue":email,
                "_finalValue":email,
                "_type":0
            }
	   ],
	"order":null
    };
    
    restDataset(post, callback);
}

function adicionaSubstituto(nomeSubstituido, codeSubstituido, callback){
    
    var dataAtual = new Date();
    var hoje = dataAtual.getDate()+"/"+(dataAtual.getMonth()+1)+"/"+(dataAtual.getYear()+1900);
    
    buscaUsuariosLogado(function(usuarioLogado){
        var post  = {  
                       "formData":{  
                          "colleagueReplacementId":"",
                          "colleagueId": codeSubstituido,
                          "colleagueName": nomeSubstituido,
                          "replacementId": usuarioLogado.code,
                          "replacementName":usuarioLogado.fullName,
                          "dataInicial": hoje,
                          "dataFinal": hoje,
                          "processes":""
                       },
                       "config":{  
                          "className":"foundation.model.ColleagueReplacement",
                          "validateFields":[  
                             {  
                                "key":"colleagueId"
                             },
                             {  
                                "key":"replacementId"
                             },
                             {  
                                "key":"dataInicial"
                             },
                             {  
                                "key":"dataFinal"
                             }
                          ]
                       }
                    };
    
        $.ajax({
          url: url.origin+"/ecm/api/rest/ecm/colleaguereplacement/create",
          data: JSON.stringify(post),
          type: "POST",
          async: false,
          contentType: "application/json",
          success: function (data) {
              callback(data);
          },
          error: function () {}
        });
    });

}


/* /ecm/api/rest/ecm/workflowModeling/getprocess?processId= */