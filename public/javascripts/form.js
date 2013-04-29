
function validateEmail(email)
{
    var splitted = email.match("^(.+)@(.+)$");
    if (splitted == null) return false;
    if (splitted[1] != null)
    {
        var regexp_user = /^\"?[\w-_\.]*\"?$/;
        if (splitted[1].match(regexp_user) == null) return false;
    }
    if (splitted[2] != null)
    {
        var regexp_domain = /^[\w-\.]*\.[A-Za-z]{2,4}$/;
        if (splitted[2].match(regexp_domain) == null)
        {
            var regexp_ip = /^\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]$/;
            if (splitted[2].match(regexp_ip) == null) return false;
        } 
        return true;
    }
    return false;
}

function onFocus() {
	$(this).removeClass("error"); $(this).removeClass("empty");
	var val = $(this).val();  
	var waterMark = $(this).attr("data");
	if (val == waterMark || val == "") { $(this).val(''); } 	  
}
	
function onBlur(waterMark) {
	$(this).removeClass("error");
	var val = $(this).val();  
	var waterMark = $(this).attr("data");
	if (val == "") { $(this).val(waterMark); $(this).addClass("empty"); } 	  
}

function isValid(el, waterMark) {
	var val = $(el).val(); 
	var valParts = /^(?!\s*$).+/.exec(val);
	var isValid = (valParts!=null && val!=waterMark);
	if(isValid && waterMark=="Email") {
		isValid = validateEmail(val);
	}
    return isValid;	
}


$(function() { 
	
	$("#fn").on('focus', onFocus);
	$("#ln").on('focus', onFocus);
	$("#em").on('focus', onFocus);
	$("#fn").on('blur', onBlur);
	$("#ln").on('blur', onBlur);
	$("#em").on('blur', onBlur);
	 
  	$("#signup").click(function() {  
    	 
		var validated = true;
		
		$("input").each(function() {
		
			if(!isValid(this, $(this).attr("data"))) {
				validated = false;
				$(this).addClass("error");
			} else {
				$(this).removeClass("error");
			}		
		});
		
		if(!validated) {
			return false;
		}
		
		$('#form').hide();
		$('#wait').show();
		
		$.ajax({
			url: "@routes.Application.signup()",
		  	type: "POST",    
		  	data: {'fn':$("#fn").val(),'ln':$("#ln").val(),'em':$("#em").val()}
		}).done(function(data) {
			$('#wait').hide();
			$('#name').text($("#fn").val() + ",");
			$('#success_message').fadeIn(1500);
		});   
		return false;  
	});
		
});
