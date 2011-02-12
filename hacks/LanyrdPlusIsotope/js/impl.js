$list = $('#super-list');
  
$('#filter a').live('click',function(){
  var filterName = $(this).attr('data-filter');
  $list.isotope({ filter : filterName });
  return false;
});

$('#sort a').live('click',function(){
  var sortName = $(this).attr('data-sort');
  $list.isotope({ sortBy : sortName });
  return false;
});

var currentLayout = 'fitRows';

$('#layouts a').live('click',function(){
  var layoutName = $(this).attr('href').slice(1);
  $list.removeClass( currentLayout ).addClass( layoutName );
  currentLayout = layoutName;
  $list.isotope({ layoutMode : layoutName });
  return false;
});
  
    
// switches selected class on buttons
$('#options').find('.option-set a').live('click', function(){
var $this = $(this);

// don't proceed if already selected
if ( !$this.hasClass('selected') ) {
  $this.parents('.option-set').find('.selected').removeClass('selected');
  $this.addClass('selected');
}

});



$(function(){
  
  $list.isotope({
    layoutMode : 'fitRows',
    masonry : {
      columnWidth: 220
    },
    getSortData : {
      wordiness : function( $elem ) {
        return $($elem).find('p').text().length;
      },
	  start_time : function( $elem ) {
	  	return Date.parseString($elem.attr('data-start_time'), 'yyyy-MM-dd hh:mm:ss');
	  	
	  },
	  session_type : function( $elem ) {
		return $elem.attr('data-session_type');
	  }
    }
  });
  
});
	
var css_token = function css_token(val){
	var pass1 = val.replace(/ /g, '-').toLowerCase().replace(/[^a-zA-Z 0-9]+/g, '');
	return $.trim(pass1);
}
	
$('#super-list li > a').live('click', function() {
  var prefix = css_token($(this).text());
  var ids = [];
  var build_id_list = function build_id_list() {
    var _id = prefix + ids.length.toString();
    $(this).attr('id', _id);
    ids.push('#'+_id);
  };
  $(this).next('.slides').children().each(build_id_list);
  $.fancybox(
    ids,
    {
    'orig' : $(this),
    'type' : 'inline',
    'cyclic': true,
    'transitionIn':'elastic',
    'transitionOut':'elastic',
    'opacity':true,
    'overlayShow':false,
    'titlePosition'   : 'over',
    'titleFormat'       : function(title, currentArray, currentIndex, currentOpts) {
		if (title || currentArray.length > 1) {
			return '<span id="fancybox-title-over">Slide ' +  (currentIndex + 1) + ' / ' + currentArray.length + ' ' + title +'</span>';
		} else { return ''; }
    }

  });
  return false;
});
	
	
	
var filters = [];
var manage_filters = function manage_filters(filter){
	var token = css_token(filter)
	if ($.inArray(token, filters) === -1) {
		$('<li><a href="#'+token+'" data-filter=".'+token+'">'+filter+'</a></li>').appendTo('#filter');
		filters.push(token);
	}
	return token;
}
	
// Data fetching
var next_url = "http://sxsw-preview-api.lanyrd.net/2011/sxsw/mar-13/?callback=?";
var fetchSessions = function fetchSessions(){
	if (next_url) {
		// Now get the data::
		$.getJSON(next_url, function(data){
			var colours = new Hex('b7cc19').range(new Hex('ff6700'), data.sessions.length, true);  
			$.each(data.sessions, function(i, v){
				v.css_token = manage_filters(v.type);
				v.bg_color = colours[i].toHex();
				$list.isotope('insert', $('#sessionTemplate').tmpl(v));
			});
			$('#loader').fadeOut();
			next_url = data.pagination.api_urls.next;
			if (next_url) {
				next_url += '&callback=?';
				// more? then recurse or not...
				//fetchSessions();
			} 
		});
	}
};	



// Kick off by asking for the first set of sessions
fetchSessions();