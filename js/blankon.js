$(document).ready(buildUI);
var password = '';
var noimage = '';

function buildUI() {
	$("#users").hide().delay(2500).fadeIn(600);
	$(".blankonlabel").hide().delay(2500).fadeIn(600);
	$(".form_input").hide();
	$(".alert").hide();
	$(".button").hide().delay(2500).fadeIn(600);
	$(".button").hide();
	$(".submit").click(
		function(){
			$(".form_input").val("").fadeOut("slow");
			
			//$(".button").fadeOut("slow");
			
			$(".user").attr("style","");
			$(".css-session").removeClass("css-session");
			$(".user-selected").removeClass("user-selected");
		}	       
	);
	$('.text_box').keydown(function(event) {
	 if (event.keyCode == 13) {
		password = $("#password-input").val();
		password_submit();
         }
	});
	var menu = '';
	if(lightdm.can_suspend)
		menu += '<li class="tbli"><a href="#" onclick="lightdm.suspend()"><img src="img/lightdm/sleep.svg"><ft>Suspend</ft></a></li>';
	if(lightdm.can_restart)
		menu += '<li class="tbli"><a href="#" onclick="lightdm.restart()"><img src="img/lightdm/reboot.svg"><ft>Restart</ft></a></li>';
	if(lightdm.can_shutdown)
		menu += '<li class="tbli"><a href="#" onclick="lightdm.shutdown()"><img src="img/lightdm/shutdown.svg"><ft>Shut Down</ft></a></li>';
		menu += '<li class="dropdown tbli" id="session"><a href="#" data-toggle="dropdown" class="dropdown-toggle"><img src="img/lightdm/sessions.svg"><ft>Session</ft></a><ul class="dropdown-menu dropup-menu" id="session-menu"></ul></li>';
	$('.button').html(menu);
	
	// session
	var sessionmenu = '';
	for(var i in lightdm.sessions)
	{
		var session = lightdm.sessions[i];
		sessionmenu += '<li class="session-'+session.key+'" >';
		sessionmenu += '<a href="#" onclick="select_session(\''+session.key+'\');"';
		sessionmenu += 'title="'+session.comment+'">'+session.name+'</a></li>';
	}
	$('#session-menu').html(sessionmenu);
	
	//user

	$.each(lightdm.users, function(index, value) {
	
		if (value.image.length > 0) {

				image = '<img src="'+value.image+'"></img>';
				noimage = '';

		}
		else {
			image = '';
			noimage = '';
		}

		var taguser = '';
		var displayname = value.display_name;
		/*taguser += '<div class="user-id-value">'+index+'</div>';
		taguser += '<div class="user-name-value">'+value.name+'</div>';
		taguser += '<div class="user-displayname-value">'+displayname+'</div>';
		if(value.logged_in)
			taguser += '<div class="logged-in"></div>';
		
		*/
		if(value.session != "default") {
			taguser += '<li class="user" name-value="'+value.name+'" session-val="'+value.session+'" displayname-val="'+displayname+'"><div class="ignuser">';
		} else {
			taguser += '<li class="user" name-value="'+value.name+'" session-val="mate" displayname-val="'+displayname+'"><div class="ignuser">';
		}
	
		taguser += '<div class="avatar" style="" select="">'+image+'</div>';
		taguser += '<div class="username">'+displayname+'</div>';
		taguser += '</div></li>';
		$('.avatarul').append(taguser);
	});
	
	
	$(".user").click(function(){
			$(".user-selected").removeClass("user-selected");
			$(".css-session").removeClass("css-session");
			$(this).addClass('user-selected');
			$(".user").attr("style","opacity:0.25");
			$(this).attr("style","");
			$(".form_input").fadeIn(600);
			
			$(".button").fadeIn(600);
			
			lightdm.start_authentication($(this).attr("name-value"));
			$('.text_box').val("").focus();
			var sesvalue = $(".user-selected").attr("session-val");
			$(".session-"+sesvalue).addClass("css-session");
			
	});
	
	
	if(lightdm.timed_login_user){
		switch_user($('#user-'+lightdm.timed_login_user+' .user-id-value').html());
	} 
	else {
		switch_user(selected_user);
	}

	function password_submit() {
		lightdm.provide_secret(password);
	}

	

	
}

function select_session(session) {
	$(".user-selected").attr("session-val",session);
	$(".css-session").removeClass("css-session");
	$(".session-"+session).addClass("css-session");
	$('.text_box').val("").focus();
}

function show_prompt(text) {
	$('#message').html(text);
}

function show_message(text) {
	$('#message').html(text);
}

function show_error(text) {
	$('#message').html(text);
}

function switch_user(user_index) {
	$('.user').each(function(index) {
		if(index == user_index) {
			$('.user-selected').removeClass('user-selected');
			$(this).addClass('user-selected');
			lightdm.start_authentication($('.user-name-value', this).html());
			$('#password-input').blur();
		}
	});
	//position_users();
}

function authentication_complete() {
	if(lightdm.is_authenticated) {
		var session = $(".user-selected").attr("session-val");
		if(session != "null" && session != null){
			lightdm.login(lightdm.authentication_user, session);
		} else {
			lightdm.login(lightdm.authentication_user);
		}
	} else {
		var displayname = $('.user-selected').attr("displayname-val");
		lightdmalert("<button type='button' class='close' data-dismiss='alert'>&times;</button>The password you entered for<strong style=color:white;><br>"+displayname+"<br></strong>was incorrect.");
		switch_user(selected_user);
	}
}


function lightdmalert(message) {
	$('div.alert').html(message).fadeIn("slow").delay(2500).fadeOut("slow");
}


