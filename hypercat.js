/*
  CityVerve - HyperCat Demo
  https://developer.cityverve.org.uk
  https://github.com/cityverve/hypercat-demo

  Released under the MIT license
  https://en.wikipedia.org/wiki/MIT_License

  Copyright 2018 CityVerve  */

// --- constants

const MANCHESTER   = { nw: { lat: 53.54482, lng: -2.37739 },    // top left  = Kearsley Station
                       se: { lat: 53.42681, lng: -2.14073 } };  // bot right = Romiley Station
const API_ENDPOINT = 'https://api.cityverve.org.uk/v1/cat/car-park';
const API_KEY      = 'YOUR-KEY-HERE';  // cityverve api key
const WAIT         = ['Nearly there', 'Hold your horses', 'Tick Tock', 'Hang on a mo\'', 'Look away'];  // just a bit of fun
const MAIN_PROMPT  = 'Select an action, complete it\'s parameters and then click the \'Make the Call\' button';
const CONTEXTS     =
{
             'all' : { prompts: [ ],
                       params : { } },

         'name-eq' : { prompts: [ 'full name' ],
                       params : { 'rel': 'name', 'val': 'param-1' } },

        'name-lex' : { prompts: [ 'part of name' ],
                       params : { 'prefix-rel': 'name', 'prefix-val': 'param-1' } },

     'capacity-eq' : { prompts: [ 'exact capacity' ],
                       params : { 'rel': 'entity.capacity', 'val': 'param-1' } },

     'capacity-gt' : { prompts: [ 'minimum capacity' ],
                       params : { 'lexrange-rel': 'entity.capacity', 'lexrange-min': 'param-1' } },

    'occupancy-lt' : { prompts: [ 'maximum occupancy' ],
                       params : { 'lexrange-rel': 'entity.occupancy', 'lexrange-max': 'param-1' } },

    'occupancy-bt' : { prompts: [ 'minimum occupancy', 'maximum occupancy' ],
                       params : { 'lexrange-rel': 'entity.occupancy', 'lexrange-min': 'param-1', 'lexrange-max' : 'param-2' } },

         'loc-geo' : { prompts: [ 'nw - lat, long', 'se - lat, long' ],
                       params : { 'geobound-minlat': 'param-1', 'geobound-minlong': 'param-2', 'geobound-maxlat' : 'param-3', 'geobound-maxlong' : 'param-4' } }
}

// --- one time initialisation

function onStartUp ()
{
    $.ajaxSetup ({ headers: { 'Authorization': API_KEY } });  // set our key for all future requests

    $('#url' ).text (API_ENDPOINT);
    $('#info').text (MAIN_PROMPT );
}

// --- the action box has been changed

function onAction ()
{
    var keys    = $('#option').val ().split (':');
    var context = CONTEXTS [keys [2]];

    $('#param1').prop ('disabled', keys [0] == '0');
    $('#param2').prop ('disabled', keys [1] == '0');

    $('#param1').val ('');
    $('#param2').val ('');

    $('#param1').attr ('placeholder', context.prompts.length > 0 ? context.prompts [0] : '');
    $('#param2').attr ('placeholder', context.prompts.length > 1 ? context.prompts [1] : '');

    if (keys [2] == 'loc-geo')
    {
        $('#param1').val (MANCHESTER.nw.lat + ', ' + MANCHESTER.nw.lng);
        $('#param2').val (MANCHESTER.se.lat + ', ' + MANCHESTER.se.lng);
    }

    $('#info').text (MAIN_PROMPT);
    $('#cat' ).text ('');

    onParam ();
}

// --- an edit box value has changed

function onParam ()
{
    var keys    = $('#option').val ().split (':');
    var context = CONTEXTS [keys [2]];
    var params  = $.param (context.params);

    var param1  = $('input#param1').val ().trim ();
    var param2  = $('input#param2').val ().trim ();
    var param3  = '';
    var param4  = '';

    if (keys [2] == 'loc-geo')
    {
        var bits1 = param1.split (',');
        var bits2 = param2.split (',');

        param1  = bits1.length > 0 ? bits1 [0].trim () : '';
        param2  = bits1.length > 1 ? bits1 [1].trim () : '';
        param3  = bits2.length > 0 ? bits2 [0].trim () : '';
        param4  = bits2.length > 1 ? bits2 [1].trim () : '';
    }

    params = params.replace ('param-1', encodeURIComponent (param1));
    params = params.replace ('param-2', encodeURIComponent (param2));
    params = params.replace ('param-3', encodeURIComponent (param3));
    params = params.replace ('param-4', encodeURIComponent (param4));

    $('#url').text (API_ENDPOINT + (params.length ? '?' : '') + params);
}

// --- the call button has been clicked

function onCall ()
{
    var prompt = $('#call').text ();

    $('#call').prop ('disabled', true);
    $('#call').text ('Calling...');

    $('#info').text (WAIT [ Math.floor (Math.random () * WAIT.length) ] + '...');
    $('#cat' ).text ('');

    $.get ($('#url').text (), function (data)
    {
        var count = data.items.length;
        var info  = (count == 0 ? 'Zero' : count) + ' item' + (count == 1 ? '' : 's') + ' returned';

        $('#cat' ).html (prettyPrint (data));
        $('#info').text (info);
    })

    .fail (function (error)
    {
        $('#cat' ).text (error.responseText);
        $('#info').text ('Something went wrong');
    })

    .always (function ()
    {
        $('#call').prop ('disabled', false);
        $('#call').text (prompt);
    });
}

// --- the document has all loaded

$(document).ready (function ()
{
    onStartUp ();

    $('#option').change (onAction);
    $('#call'  ).click  (onCall  );

    $('input').keyup (function (event)
    {
        if (event.which == 13)  // return key
        {
            onCall ();
            event.preventDefault();
        }
        else
        {
            onParam ();
        }
    });
});

// --- a generic method for making pretty json output - https://gist.github.com/pete-rai/444a4f6203869d3bcc77e9c618ab9e44

function prettyPrint (json)
{
    var line   = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
    var pretty = JSON.stringify (json, null, 3);

    pretty = pretty.replace (/&/g  , '&amp;' );
    pretty = pretty.replace (/\\"/g, '&quot;');
    pretty = pretty.replace (/</g  , '&lt;'  );
    pretty = pretty.replace (/>/g  , '&gt;'  );
    pretty = pretty.replace (line, function (match, indent, key, val, end)
    {
        var akey = '<span class=json-key>';
        var aval = '<span class=json-value>';
        var astr = '<span class=json-string>';
        var text = indent || '';

        if (key)
        {
            text = text + akey + key.replace (/[": ]/g, '') + '</span>: ';
        }

        if (val)
        {
            text = text + (val [0] == '"' ? astr : aval) + val + '</span>';
        }

        return text + (end || '');
    });

    return pretty;
}
