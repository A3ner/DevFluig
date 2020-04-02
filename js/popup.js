var url;
var user;

function usuarioLogado(){
    if(user){
        return user;
    }else{
       return buscaUsuariosLogado(function(user){return user;});
    }
};

// Execução ao abrir a extensão
$(document).ready(function() {
    carregaUrl(function(){
        mascaras();
        // Funções específicas por URL
        funcoesEspecificasPorURL();
        // Funções padrões Globais
        funcoesComuns();
        buscaUsuario();
        buscaInfoDocumentos();
        buscaGrupo();
        buscaDataset();   
    });
});

function carregaUrl(callback){
    chrome.tabs.getSelected(null, function(tab){
        url = new URL (tab.url);
        
        if(url.host.indexOf("fluig")== -1){
            var achouUrl = false;
            chrome.storage.sync.get({urlException: []}, function(items) {
                for(var x in items.urlException){
                    if(url.href.indexOf(items.urlException[x])>=0){
                       achouUrl = true;
                    }
                }
                if(achouUrl){
                    callback();
                }else{
                    $(".wrapper-panel").html("<labe>Url não possui 'fluig' no nome, caso queira adicionar sua url como exceção clique com o botão direito na extensão DevFluig e acesse às Opções</label>");
                    return false;
                }
            });
        }else{
            callback();
        }
   });
}


//Verifica a URL acessado e define função proprias para cada página
function funcoesEspecificasPorURL(){
  // Injeta JS para retornar html da tab
  chrome.tabs.executeScript(null, {file: "js/getPagesSource.js"}, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      $("#message").html('There was an error injecting script : \n' + chrome.runtime.lastError.message);
    }
  });
    // Busca html da tab
  chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getSource") {
      if(url && url.pathname.indexOf("pageworkflowview") >= 0) { // Visualização de Solicitação
        buscaInformacoesFormularioBPM(request);
      } else if(url && url.pathname.indexOf("pageprocessconvert") >= 0){ // Conversão de Processos
          botaoParearAtividades(request);
      } else{
        $("#message").html("Nenhuma a\u00E7\u00E3o encontrada"); 
      }
    }
    
  });
}

function buscaUsuario(){
    var id = "buscaUsuario";
    var idBtnSubstituto = "substitutoBuscaUsuario";
    
    var preencheInfoUsuario = function(content){
        if(content && content.fullName && content.code){
            var append = "";
            append += template_label_input("ID", content.id);
            append += template_label_input("Login", content.login);
            append += template_label_input("E-mail", content.email);
            append += template_label_input("Nome", content.fullName);
            append += template_label_input("Ativo", content.isActive);
            append += template_label_input("User Code", content.code);    
            append += template_label_input("Papeis", content.roles.toString());
            append += template_button("Adicionar-se como Substituto", idBtnSubstituto);
            append += '<label class="col-xs-12">Grupos:</label>';
            append += template_textarea(content.groups.toString().replace(/,/g , "\n"), 5);
            $("#"+id+"-content").html(append);

            $("#"+idBtnSubstituto).click(function(){
                adicionaSubstituto(content.fullName, content.code, function(){
                    alert("Substituto adicionado para hoje, atualize sua tela");
                });
            });
        }else{
            $("#"+id+"-content").html("Usuário não encontrado.");
        }
    };
    
    buscasGenericas(id, "Busca Usuário", "Código/Login/E-mail do usuário", function(){
        
        var user = $("#"+id).val();
        if(user.indexOf("@")==-1){
            restUsuarios(user, function(content){preencheInfoUsuario(content)});
        }else{
            buscaUsuarioPorEmail(user, function(data){
                if(data && data.values && data.values.length > 0){
                    restUsuarios(data.values[0]["login"], function(content){
                        preencheInfoUsuario(content);
                    });
                }else{
                    $("#"+id+"-content").html("Usuário não encontrado.");
                }
            });
        }
        
    });
}

function buscasGenericas(idButton, tituloCollapse, placeholderInput, htmlContent){
    template_collapse(idButton, tituloCollapse, template_input_spanbutton(idButton, placeholderInput)); 
    $("#bt-"+idButton).click(function(){
        $("#"+idButton+"-content").html(htmlContent);
    });
    $("#"+idButton).on("keyup", function(e){
        if(e.key == "Enter"){
            $("#bt-"+idButton).click();
        }
    });
}

function buscaGrupo(){

    var id = "buscaGrupo";
    buscasGenericas(id, "Busca Grupo", "Código do grupo", function(){
        var grupo = $("#"+id).val();
        restInfoGrupo(grupo, function(content){
            if(content && content.id && content.groupCode){
                var append = "";
                append += template_label_input("ID", content.id);
                append += template_label_input("Código", content.groupCode);
                append += template_label_input("Descrição", content.groupDescription);
                append += '<label class="col-xs-12">Usuários:</label>';
                restUsuariosGrupo(content.groupCode, function(users){
                    var appendUser = "";

                    for(var u in users){
                        appendUser += users[u].email+"\n";
                    }
                    append += template_textarea(appendUser, 10);
                    $("#"+id+"-content").html(append);
                });
            }else{
                $("#"+id+"-content").html("Grupo não encontrado.");
            }
        });
    });
}

function buscaDataset(){
    var id = "buscaDataset";
    buscasGenericas(id, "Busca Dataset", "Nome dataset", function(){
        var dataset = $("#"+id).val();
        
        buscaInfoDatasetGerado(dataset, function(custom){
            var append = "";
            if(custom.length > 0){
                var achouDataset = false;
                for(var x in custom){
                    if(custom[x].datasetId == dataset){
                        var codigo = custom[x].datasetImpl;

                        append += template_label_input("Descrição", custom[x].datasetDescription);
                        append += template_label_input("Tipo", custom[x].type);
                        if(codigo){
                            append +=template_textarea(codigo, 15);
                        }

                        achouDataset = true;
                        break;
                    }
                }
                if(achouDataset){
                    $("#"+id+"-content").html(append);
                }
            }else{
                buscaDatasetGerado(dataset, function(gerado){
                    if(gerado){

                        append += template_label_input("ID Documento", gerado.id);
                        append += template_label_input_button("Documento", gerado.description, "datasetDocumentId");
                        if(codigo){
                            append +=template_textarea(codigo, 15);
                        }

                        $("#"+id+"-content").html(append);

                        $("#datasetDocumentId").click(function(){
                            buscaAbreDocumento(gerado.id, gerado.version);
                        });
                    }else{
                         append += '<label class="col-xs-12">Dataset não encontrado</label>';
                        $("#"+id+"-content").html(append);
                    }
                });
            }
        });
    });
}

function buscaInfoDocumentos(){
    var id = "buscaInfoDocumentos";
    buscasGenericas(id, "Busca Informações de Documentos", "Código do Documento", function(){
        var documento = $("#"+id).val();
        buscaRestInfoDocumento(documento, function(data){
            var append = "";
            if(data != "ERROR"){
                for(var att in data){
                    append += template_label_input(att, data[att]);
                }
                $("#"+id+"-content").html(append);
            }else{
                $("#"+id+"-content").html("Documento não encontrado.");
            }
        });
    });
    
    $("#"+id).mask("##################9");
}

function buscaInfoProcess(){
    var id = "buscaInfoProcess";
    buscasGenericas(id, "Busca Informações de Processos", "Código do Processo", function(){
        var documento = $("#"+id).val();
        buscaRestInfoDocumento(documento, function(data){
            var append = "";
            if(data != "ERROR"){
                for(var att in data){
                    append += template_label_input(att, data[att]);
                }
            }
            $("#"+id+"-content").html(append);
        });
    });
    
}


// Adicionar funções de botões de funcionalidade comuns
function funcoesComuns(){
    $("#buscaSolicitacoes").click(function(){
        var solicitacao = $("#solicitacao").val();
        var _url = url.origin+"/portal/p/1/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID="+solicitacao;
        chrome.tabs.create({ url: _url });
    });
    
    $("#buscaDocumentos").click(function(){
        var documento = $("#documento").val();
        buscaAbreDocumento(documento);
    });
    
    $("#buscaInfoDocumentos").click(function(){
        var documento = $("#infoDocumento").val();
        apresentaInfoDocumento(documento);
    });
    
    $("#documento").on("keyup", function(e){
        if(e.key == "Enter"){
            $("#buscaDocumentos").click();
        }
    });
    
    $("#solicitacao").on("keyup", function(e){
        if(e.key == "Enter"){
            $("#buscaSolicitacoes").click();
        }
    });
}

function buscaAbreDocumento(numDocumento, version){
    if(version){
        var _url = url.origin+"/portal/p/1/ecmnavigation?app_ecm_navigation_doc="+numDocumento+"&app_ecm_navigation_docVersion="+version
        chrome.tabs.create({ url: _url });
    }else{
        buscaDocumento(numDocumento, function(doc){
            if(doc.content != null){
                var _url = url.origin+"/portal/p/1/ecmnavigation?app_ecm_navigation_doc="+numDocumento+"&app_ecm_navigation_docVersion="+doc.content.version
                chrome.tabs.create({ url: _url });   
            }
        });
    }
}

function buscaInformacoesFormularioBPM(request){
    var source = $(request.source);
    var _urlIframe = source.find("#workflowView-cardViewer").attr('src').split("?")[1];
    var parentId;
    var documentId;
    
    var append = "";
    var listaTags = _urlIframe.split("&");
    for(x in listaTags){
       append += "<div class='col-xs-10'><input class='form-control' value='"+listaTags[x]+"' readonly='readonly' /></div>";
        if(listaTags[x].indexOf("WDParentDocumentId") >= 0){    
            parentId = listaTags[x].split("WDParentDocumentId=")[1];
             
            append += "<div class='col-xs-2'><span class='input-group-btn' id='BPMparentId'><button class='btn glyphicon glyphicon-share' type='button'></button></span></div>";
        }else if(listaTags[x].indexOf("WDNrDocto") >= 0){    
            documentId = listaTags[x].split("WDNrDocto=")[1];
            if(documentId != "0")
            append += "<div class='col-xs-2'><span class='input-group-btn' id='BPMdocumentId'><button class='btn glyphicon glyphicon-share' type='button'></button></span></div>";
        }
    }
    

    adicionaHtmlFuncoesPagina(append);
    
    $("#BPMparentId").click(function(){
        buscaAbreDocumento(parentId);
    });
     $("#BPMdocumentId").click(function(){
        buscaAbreDocumento(documentId);
    });
}

function injetarScriptTab(code){
    chrome.tabs.getSelected(null, function(tab){
        code=JSON.stringify(code.toString());
        code='var script = document.createElement("script");'+
            'script.innerHTML = "('+code.substr(1,code.length-2)+')();";'+
            'document.body.appendChild(script)';
        chrome.tabs.executeScript(tab.id, {code : code});
    });
}

function executarScriptTab(code){
    chrome.tabs.getSelected(null, function(tab){
        code=JSON.stringify(code.toString());
        code=code.substr(1,code.length-2);
        chrome.tabs.executeScript(tab.id, {code : code});
    });
}

function botaoParearAtividades(request){
    adicionaHtmlFuncoesPagina("<input type='button' id='botaoPareaAtividade' value='Parear Atividades' class='hidden btn btn-default'/>");	
    $("#botaoPareaAtividade").on('click', function(e) {
        injetarScriptTab(funcaoParearAtividades);
    });

    if($(request.source).find("#tabs-ecm-processConvert-container-1").attr("style").indexOf("display: block;")>=0){
        $("#botaoPareaAtividade").removeClass("hidden");
    }
}

function funcaoParearAtividades(){
  $.each($('table[id="ecm-processstateselection-grid"] > tbody > tr[role="row"]'), function() {var atividade = $(this).prop("id").split("-")[0].trim(); $("#sl_"+atividade).val(atividade); });
}

function mascaras(){
    $('.number').mask("###############9");
}

function adicionaHtmlFuncoesPagina(html){
    $(".page").show();
    $("#common-panel").html(html);
}




/* http://oncoclinicasdev.fluig.com/ecm/api/rest/ecm/userpreferences/findGroupsByUser 
    {companyId: "1", userId: "dmgz2x4fnbs87y3r1473714749717"}
    
    
    
    
Buscar papel
http://oncoclinicasdev.fluig.com/portal/api/rest/wcm/service/user/findUserRoles?space=&login=totvssuporteonco.gmail.com.1&_=1519682035233


http://oncoclinicastst.fluig.com/api/public/2.0/users/getUser/m13x1guah5dun0yv1435003803343



Adicionar Substituto
http://oncoclinicastst.fluig.com/ecm/api/rest/ecm/colleaguereplacement/create
POST

{"formData":{"colleagueReplacementId":"","colleagueId":"m9f7t8xqzadbsvs11471610728939","colleagueName":"Sara Millard Nogueira Ribeiro","replacementId":"dmgz2x4fnbs87y3r1473714749717","replacementName":"Suporte Totvs","dataInicial":"28/02/2018","dataFinal":"28/02/2018","processes":""},"config":{"className":"foundation.model.ColleagueReplacement","validateFields":[{"key":"colleagueId"},{"key":"replacementId"},{"key":"dataInicial"},{"key":"dataFinal"}]}}
*/

function loadingOn(){
    $(".loader").show();
    $(".loader-overlay").show();
}

function loadingOff(){
    $(".loader").hide();
    $(".loader-overlay").hide();
}