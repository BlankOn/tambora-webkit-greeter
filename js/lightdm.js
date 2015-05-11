function LightDMUser (name, real_name, image, logged_in)
{
    this.name = name;
    this.real_name = real_name;
    this.display_name = real_name;
    this.image = image;
    this.logged_in = logged_in;
}

function LightDMSession (key, name, comment)
{
    this.key = key;
    this.name = name;
    this.comment = comment;
}

function _cancel_timed_login ()
{
    if (_login_timer != null)
    {
        clearTimeout (_login_timer);
        _login_timer = null;
    }
}

function _start_authentication (user)
{
    this._user = user;
    this.is_authenticated = false;
    show_prompt ("Password:");
}

function _provide_secret (secret)
{
    this.is_authenticated = (secret == "blankon");
    authentication_complete ();
}

function _cancel_authentication ()
{
    this.is_authenticated = false;
}

function _suspend ()
{
    window.location = 'suspend.svg';
}

function _hibernate ()
{
   alert ('Attempted to hibernate, but can_hibernate = false');
}

function _restart ()
{
    window.location = 'restart.svg';
}

function _shutdown ()
{
    window.location = 'suspend.svg';
}

function _login ()
{
    if(this.is_authenticated)
	window.location = 'http://blankonlinux.or.id';
    else
        show_promt("Password wrong");
}

function LightDMClass ()
{
    this.users = [new LightDMUser("Sri", "Sri Wahyuni", /*"file:///assets/img/image2.jpg",*/ true),
		  new LightDMUser("Siti", "Siti Aliya", true),
          new LightDMUser("Ribut", "Ribut Wahono", true)];
    this.num_users = this.users.length;
    this.sessions = [new LightDMSession("BlankOn", "BlankOn", "This session logs you into BlankOn"),
                     new LightDMSession("Default-Session", "Default Session", "This session logs you into Default Session"),
                     new LightDMSession("Gnome", "Gnome", "This session logs you into GNOME")];
    this.default_session = "BlankOn";
    this.timed_login_user = "Siti";
    this.timed_login_delay = 5;
    this.is_authenticated = false;
    this.can_suspend = true;
    this.can_hibernate = false;
    this.can_restart = true;
    this.can_shutdown = true;
    this.cancel_timed_login = _cancel_timed_login;
    this.start_authentication = _start_authentication;
    this.provide_secret = _provide_secret;
    this.cancel_authentication = _cancel_authentication;
    this.suspend = _suspend;
    this.hibernate = _hibernate;
    this.restart = _restart;
    this.shutdown = _shutdown;
    this.login = _login;
    
    this._user = this.timed_login_user;
}

if(typeof lightdm == 'undefined') {
	lightdm = new LightDMClass();
}
