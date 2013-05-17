function getNewWindowWidth(windowWidth) {
	return (windowWidth > 575 ? 575:320);
}

function windowOpts() {
	var windowWidth = $(window).width();
	var width  = getNewWindowWidth(windowWidth),
        height = windowWidth > 575 ? 400:200,
        left   = (windowWidth  - width)  / 2,
        //top    = ($(window).height() - height) / 2,
        top = 50,
        opts   = ',width='  + width  +
        		 ',height='  + height  +
                 ',top='    + top    +
                 ',left='   + left; 
        return opts;
}

function bindtoFacebookFollowClick(e) {
	e.preventDefault();
	//u="http://www.facebook.com/becipe";
	title="Like Us On Facebook";
	//url = "http://www.facebook.com/plugins/like.php?href="+encodeURIComponent(u)+"&amp;t="+encodeURIComponent(title)+"&amp;send=false&amp;layout=standard&amp;show_faces=true&amp;action=like&amp;colorscheme=light";
	url = "http://m.facebook.com/becipe"; 
	title=document.title;
	window.open(url,'Facebook',windowOpts());
	return false;
}

function bindtoTwitterFollowClick(e) {
	e.preventDefault();
	title="Follow Us On Twitter";
	//url = "https://platform.twitter.com/widgets/follow_button.html?screen_name=becipeapp&show_screen_name=true&show_count=true";
	url = "http://m.twitter.com/becipeapp"; 
	window.open(url,'Twitter',windowOpts());
	return false;
}

function bindtoPinterestFollowClick(e) {
	e.preventDefault();
	title="Follow Us On Pinterest";
	url = "http://m.pinterest.com/becipeapp/"; 
	window.open(url,'Pinterest',windowOpts());
	return false;
}

function bindtoLinkedInFollowClick(e) {
	e.preventDefault();
	options = windowOpts();
	w = window.open("",'LinkedIn', options);
	var windowHTML =
         "<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.01 Transitional//EN' 'http://www.w3.org/TR/html4/loose.dtd'>\n" +
         '<html>\n' +
         '<head><meta name="viewport" content="width=device-width, initial-scale=1"/></head>\n' +
         '<body></body>\n' +
         '</html>';
    w.document.write(windowHTML);
    w.document.close();
	var s1 = w.document.createElement("script"); 
	s1.type = "text/javascript"; 
	s1.src = "//platform.linkedin.com/in.js";
	var s2 = w.document.createElement("script"); 
	s2.type = "IN/CompanyProfile"; 
	s2.setAttribute('data-id', '3117050');
	s2.setAttribute('data-format', 'inline');
	s2.setAttribute('data-width', getNewWindowWidth($(window).width()) - 10);
	w.document.getElementsByTagName("body")[0].appendChild(s1);
	w.document.getElementsByTagName("body")[0].appendChild(s2);
	return false;
}

function bindtoFacebookShareClick(e) {
	e.preventDefault();
	u=location.href;
	title="Like this page on Facebook";
	url = "http://www.facebook.com/plugins/like.php?href="+encodeURIComponent(u)+"&amp;t="+encodeURIComponent(title)+"&amp;send=false&amp;layout=standard&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;height=35"; 
	title=document.title;
	window.open(url,"sharer",windowOpts());
	return false;
}

function bindtoTwitterShareClick(e) {
	e.preventDefault();
	u=location.href;
	title="Share this page on LinkedIn";
	window.open("http://twitter.com/share?text="+encodeURIComponent("Check it out: ")+encodeURIComponent(u), "twitter", windowOpts());
	return false;
}

function bindtoPinterestShareClick(e) {
	e.preventDefault();
	options = windowOpts();
	//w = window.open("",'LinkedIn', options);
	//var windowHTML =
    //     "<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.01 Transitional//EN' 'http://www.w3.org/TR/html4/loose.dtd'>\n" +
    //    '<html>\n' +
    //     '<head><meta name="viewport" content="width=device-width, initial-scale=1"/></head>\n' +
    //     '<body></body>\n' +
    //     '</html>';
    //w.document.write(windowHTML);
    //w.document.close();
	var s1 = document.createElement("script"); 
	s1.type = "text/javascript";
	s1.setAttribute('src','http://assets.pinterest.com/js/pinmarklet.js?r='+Math.random()*99999999); 
	document.getElementsByTagName("body")[0].appendChild(s1);
	return false;
}

function bindtoLinkedInShareClick(e) {
	e.preventDefault();
	u=location.href;
	title="Share this page on Twitter";
	url = "http://www.linkedin.com/shareArticle?mini=true&url="+encodeURIComponent(u)+"&title="+encodeURIComponent(title)+"&summary="+$(this).attr('data')+"&source=Becipe";
	console.log(url);
	window.open(url, "linkedin", windowOpts());
	return false;
}

// Jquery with no conflict
jQuery(document).ready(function($) {
	
	$('#fb-follow').bind('click', bindtoFacebookFollowClick);
	$('#tw-follow').bind('click', bindtoTwitterFollowClick);
	$('#pin-follow').bind('click', bindtoPinterestFollowClick);
	$('#linkedin-follow').bind('click', bindtoLinkedInFollowClick);
	
	$('#fb-share').bind('click', bindtoFacebookShareClick);
	$('#tw-share').bind('click', bindtoTwitterShareClick);
	$('#pinterest-share').bind('click', bindtoPinterestShareClick);
	$('#linkedin-share').bind('click', bindtoLinkedInShareClick);
	
	
    //##########################################
	// Filter - Isotope 
	//##########################################
	
	$('#filter-buttons a').click(function(){
	
		// select current
		var $optionSet = $(this).parents('#filter-buttons');
	    $optionSet.find('.selected').removeClass('selected');
	    $(this).addClass('selected');
    
		var selector = $(this).attr('data-filter');
		$container.isotope({ filter: selector });
		return false;
	});
	
	<!-- centered layout extension http://isotope.metafizzy.co/ --> 

	$.Isotope.prototype._getCenteredMasonryColumns = function() {
	
	    this.width = this.element.width();
	
	    var parentWidth = this.element.parent().width();
	
	    var colW = this.options.masonry && this.options.masonry.columnWidth || // i.e. options.masonry && options.masonry.columnWidth
	
	    this.$filteredAtoms.outerWidth(true) || // or use the size of the first item
	
	    parentWidth; // if there's no items, use size of container
	
	    var cols = Math.floor(parentWidth / colW);
	
	    cols = Math.max(cols, 1);
	
	    this.masonry.cols = cols; // i.e. this.masonry.cols = ....
	    this.masonry.columnWidth = colW; // i.e. this.masonry.columnWidth = ...
	};
	
	$.Isotope.prototype._masonryReset = function() {
	
	    this.masonry = {}; // layout-specific props
	    this._getCenteredMasonryColumns(); // FIXME shouldn't have to call this again
	
	    var i = this.masonry.cols;
	
	    this.masonry.colYs = [];
	        while (i--) {
	        this.masonry.colYs.push(0);
	    }
	};
	
	$.Isotope.prototype._masonryResizeChanged = function() {
	
	    var prevColCount = this.masonry.cols;
	
	    this._getCenteredMasonryColumns(); // get updated colCount
	    return (this.masonry.cols !== prevColCount);
	};
	
	$.Isotope.prototype._masonryGetContainerSize = function() {
	
	    var unusedCols = 0,
	
	    i = this.masonry.cols;
	        while (--i) { // count unused columns
	        if (this.masonry.colYs[i] !== 0) {
	            break;
	        }
	        unusedCols++;
	    }
	
	    return {
	        height: Math.max.apply(Math, this.masonry.colYs),
	        width: (this.masonry.cols - unusedCols) * this.masonry.columnWidth // fit container to columns that have been used;
	    };
	};

	//recipes	
	var $container = $('#filter-container');	
	$container.imagesLoaded( function(){
		$container.isotope({
			itemSelector : 'figure',
			cornerStampSelector: '.corner-stamp',
			filter: '*',
			isFitWidth: true
		});
	});
});



















