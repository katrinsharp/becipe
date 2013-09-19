define([
  'jquery', 
  'underscore', 
  'backbone',
  'module'
], function($, _, Backbone, module){

	var initialize = function(){
		this.currentIteration = module.config().currentIteration;
		this.recipeHelpers = {
			date: function(time){
				var date = moment(time).format('LL');
				return date;
			},
			previewUrl: function(photos){
				var photoBaseUrl = module.config().photoBaseUrl;
				var bucket = '';
				var key = '';
				var preview = _.find(photos, function(photo){ return photo.metadata.typeOf == 'preview'; });
				if(preview!=undefined) {
					bucket = preview.bucket;
					key = preview.key;
				}
				var previewUrl = photoBaseUrl + '/' + bucket + '/' + key;
				return previewUrl;
			},
			fullUrl: function(options){
				var previewUrl = module.config().photoBaseUrl + '/' + options.bucket + '/' + options.key;
				return previewUrl;
			},
			getErrorDiv: function(name) {
				var nameDiv = $('[name='+name+']').siblings('.input-name');
				if(nameDiv.length!=0) {
					return $(nameDiv).find('span.error');
				} else {
					return $('[name='+name+']').next('span.error');
				}
			},
			removeErrorDiv: function(name) {
				this.getErrorDiv(name).remove();
			},
			setErrorDiv: function(name, errorDesc, toDisplay) {
				var errSpanStr = '<span class="error" style="margin-left: 2px;display:none">'+errorDesc+'</span>';
				var nameDiv = $('[name='+name+']').siblings('.input-name');
				var errSpan = undefined;
				if(nameDiv.length!=0) {
					$(nameDiv).append(errSpanStr);
					errSpan = $(nameDiv).find('span.error');
				} else {
					$('[name='+name+']').after(errSpanStr);
					errSpan = $('[name='+name+']').next('span.error');
				}
				if((toDisplay!=undefined)&&toDisplay) {
					$(errSpan).css('display', '');
				}
			}
		},
		this.socialHelpers = {
			getNewWindowWidth: function(windowWidth) {
				return (windowWidth > 575 ? 575:320);
			},
			windowOpts: function() {
				var windowWidth = $(window).width();
				var width  = this.getNewWindowWidth(windowWidth),
				height = windowWidth > 575 ? 400:200,
				left   = (windowWidth  - width)  / 2,
				//top    = ($(window).height() - height) / 2,
				top = 50,
				opts   = ',width='  + width  +
						 ',height='  + height  +
						 ',top='    + top    +
						 ',left='   + left; 
				return opts;
			},
			bindtoFacebookFollowClick: function(e) {
				e.preventDefault();
				//u="http://www.facebook.com/becipe";
				title="Like Us On Facebook";
				//url = "http://www.facebook.com/plugins/like.php?href="+encodeURIComponent(u)+"&amp;t="+encodeURIComponent(title)+"&amp;send=false&amp;layout=standard&amp;show_faces=true&amp;action=like&amp;colorscheme=light";
				url = "http://m.facebook.com/becipe"; 
				title=document.title;
				window.open(url,'Facebook', this.windowOpts());
				return false;
			},
			bindtoTwitterFollowClick: function(e) {
				e.preventDefault();
				title="Follow Us On Twitter";
				//url = "https://platform.twitter.com/widgets/follow_button.html?screen_name=becipeapp&show_screen_name=true&show_count=true";
				url = "http://m.twitter.com/becipeapp"; 
				window.open(url,'Twitter',this.windowOpts());
				return false;
			},
			bindtoPinterestFollowClick: function(e) {
				e.preventDefault();
				title="Follow Us On Pinterest";
				url = "http://m.pinterest.com/becipeapp/"; 
				window.open(url,'Pinterest',this.windowOpts());
				return false;
			},
			bindtoLinkedInFollowClick: function(e) {
				e.preventDefault();
				options = this.windowOpts();
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
				s2.setAttribute('data-width', this.getNewWindowWidth($(window).width()) - 10);
				w.document.getElementsByTagName("body")[0].appendChild(s1);
				w.document.getElementsByTagName("body")[0].appendChild(s2);
				return false;
			},
			bindtoFacebookShareClick: function(e) {
				e.preventDefault();
				u=location.href;
				title="Like this page on Facebook";
				url = "http://www.facebook.com/plugins/like.php?href="+encodeURIComponent(u)+"&amp;t="+encodeURIComponent(title)+"&amp;send=false&amp;layout=standard&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;height=35"; 
				title=document.title;
				window.open(url,"sharer",this.windowOpts());
				return false;
			},
			bindtoTwitterShareClick: function(e) {
				e.preventDefault();
				u=location.href;
				title="Share this page on LinkedIn";
				window.open("http://twitter.com/share?text="+encodeURIComponent("Check it out: ")+encodeURIComponent(u), "twitter", this.windowOpts());
				return false;
			},
			bindtoPinterestShareClick: function(e) {
				e.preventDefault();
				options = this.windowOpts();
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
			},
			bindtoLinkedInShareClick: function(e) {
				e.preventDefault();
				u=location.href;
				title="Share this page on LinkedIn";
				url = "http://www.linkedin.com/shareArticle?mini=true&url="+encodeURIComponent(u)+"&title="+encodeURIComponent(title)+"&summary="+$(this).attr('data')+"&source=Becipe";
				window.open(url, "linkedin", this.windowOpts());
				return false;
			}
		}
	};

	return { 
		initialize: initialize
	};
});