$(document).ready(function() {
    $("#add").on("click", function(){
        $("#exception").append("<input type='text' class='fluigUrl' style='width:100%' /><br> ");
    });
    $("#save").on("click", function(){
        var listUrl = [];
        $(".fluigUrl").each(function(){
            if($(this).val() && $(this).val().trim() != ""){ 
                listUrl.push($(this).val());
            }
        });
        
        chrome.storage.sync.set({urlException: listUrl}, function() {
            $("#saveSucess").show();
        });
    });
    
    restore_options();
});


function restore_options() {
  chrome.storage.sync.get({urlException: []}, function(items) {
    for(var x in items.urlException){
        $("#exception").append("<input type='text' class='fluigUrl' style='width:100%' value='"+items.urlException[x]+"'/><br> ");    
    }
  });
}