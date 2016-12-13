/**
 * Created by Victor on 29/11/2016.
 */

var ROOT_URI = 'http://localhost:3000/api';
//var ROOT_URI = 'http://strs-taxi.herokuapp.com/api';

var USER_TOKEN = '';

var PUSHER_KEY = 'e8bca01fb79c7e5af913';

var activeUser = {};

var PUSHER_STATED = false;

var NO_AUTH_URIS = ['/login','/register'];

var LOCATION_TIMEOUT = 0;

var DEFAULT_TIMEOUT = 15000;
