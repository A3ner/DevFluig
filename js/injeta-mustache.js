/*
Função para adicionar um novo collapse

Parâmetros:
id = id utilizados nos panel, head e collapse
titulo = Titulo da aba de collapse
before = true/false para se quiser adicionar no inicio ou fim do elementro accordion
*/
function template_collapse(id, titulo, html_panel, before){
    var template = $('#template-collapse').html();
    
    Mustache.parse(template);
    var rendered = Mustache.render(template, {id, titulo});
    
    if(before && html){
       $('#accordion').prepend(rendered);
    }else{
        $('#accordion').append(rendered);
    }
    
    $("#"+id+"-panel").html(html_panel);
}


function template_input_spanbutton(id, placeholder){
    var template = $('#template-input-spanbutton').html();
    
    Mustache.parse(template);
    var rendered = Mustache.render(template, {id, placeholder});
    
    return rendered;
}

function template_label_input(label, value){
    var html = "";
    html = '<div class="col-xs-12 input-group">';
      html += '<span class="input-group-addon">'+label+'</span>';
      html += '<input type="text" class="form-control" value="'+value+'" readonly="readonly"></input>';
    html += '</div>';
    return html;
}

function template_label_input_button(label, value, idButton){
    var html = '';
    html = '<div class="col-xs-12 input-group">';
      html += '<span class="input-group-addon">'+label+'</span>';
      html += '<input type="text" class="form-control" value="'+value+'" readonly="readonly"></input>';
      html += '<span class="input-group-btn" id="'+idButton+'">';
        html += '<button class="btn glyphicon glyphicon-share" type="button"></button>';
      html += '</span>';
    html += '</div>';
   
    return html;
}

function template_textarea(value, row){
    return '<textarea class="form-control fs-no-resize" rows="'+row+'" readonly="" >'+value+'</textarea>';
}

function template_button(value, idButton){
    return '<input type="button" id="'+idButton+'" value="'+value+'" class="btn btn-default">';
}