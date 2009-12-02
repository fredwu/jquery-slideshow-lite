/**
 * Slideshow Lite plugin for jQuery
 *
 * v0.4
 *
 * Copyright (c) 2009 Fred Wu
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

/**
 * Configuration options:
 *
 * pauseSeconds  integer  number of seconds between each photo to be displayed
 * width         boolean  width of the slideshow, in pixels
 * height        integer  height of the slideshow, in pixels
 * cssClass      string   name of the CSS class, defaults to 'slideshowlite'
 */

(function($){
	$.fn.slideshow = function(options){
		
		var defaults = {
			pauseSeconds: 2,
			width: 468,
			height: 120,
			cssClass: 'slideshowlite'
		};
		
		var options = $.extend(defaults, options);
		
		// ----------------------------------------
		// slideshow objects and variables
		// ----------------------------------------
		
		var target  = this;
		var items   = $(target).children("a");
		var running = false; // ensures there is only one running instance
		
		// ----------------------------------------
		// some mandontory styling
		// ----------------------------------------
		
		if ( ! $(this).hasClass(options.cssClass)) $(this).addClass(options.cssClass);
		
		$(this).css({
			width: options.width + "px",
			height: options.height + "px"
		});
		
		// create anchor links to make the structure simpler for manupilation
		$(this).children("img").wrap(document.createElement("a"));
		// force opening links in a new page
		$(this).children("a").attr("target", "blank");
		// add item sequence markups
		var i = 1;
		$(this).children("a").each(function(){
			$(this).attr("rel", i++);
		});
		// create pagination
		$(this).append("<ul></ul>");
		var pagination = $(target).children("ul");
		var i = 1;
		$(this).children("a").each(function(){
			pagination.append("<li><a href=\"#\">" + i++ + "</a></li>");
		});
		// make the pagination transparent
		pagination.fadeTo(0, 0.8);
		
		// ----------------------------------------
		// shortcuts
		// ----------------------------------------
		
		var firstItem = $(target).children("a:first");
		var lastItem  = $(target).children("a:last");
		
		// ----------------------------------------
		// pagination highlight
		// ----------------------------------------
		
		var paginationHighlight = function(sequence){
			pagination.children("li").children("a").fadeTo(100, 1);
			pagination.children("li").children("a").removeClass("current");
			pagination.children("li").children("a:nth(" + sequence + ")").addClass("current");
		}
		
		// ----------------------------------------
		// slideshow logic
		// ----------------------------------------
		
		var makeSlideshow = function(current){
			if (running == false)
			{
				current.fadeIn(function(){
					$(target).children("a").hide();
					$(this).show();
				}).animate({opacity:1}, options.pauseSeconds*1000, function(){
					
					// rewind to the first item?
					if (current.children("img").attr("src") == lastItem.children("img").attr("src"))
						makeSlideshow(firstItem);
					else
						makeSlideshow(current.next());
					
				}).fadeOut();
				
				paginationHighlight(current.attr("rel")-1);
			}
			
			// pagination click
			pagination.children("li").children("a").click(function(){
				
				if (running == false && ! $(this).hasClass("current"))
				{
					running = true;
					
					var self = this;
					$(target).children("a").hide();
					
					$(target).children("a:nth(" + ($(self).text()-1) + ")").show().animate({opacity:1}, options.pauseSeconds*1000, function(){
						
						running = false;
						clicked = false;
						
						// rewind to the first item?
						if ($(self).text() == $(target).children("a").length)
							makeSlideshow(firstItem);
						else
							makeSlideshow($(target).children("a:nth(" + $(self).text() + ")"));
						
					}).fadeOut();
					
					paginationHighlight($(self).text()-1);
					pagination.children("li").children("a").fadeTo(0, 0.2);
				}
				
				return false;
			});
			
		};
		
		// ----------------------------------------
		// start the slideshow!
		// ----------------------------------------
		
		makeSlideshow(firstItem);
	};
})(jQuery);