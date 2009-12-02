/**
 * Slideshow Lite plugin for jQuery
 *
 * v0.1
 *
 * Copyright (c) 2009 Fred Wu
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
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
		var clicked = false; // prevent slideshow from running multiple instances by clicking too fast
		
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
			pagination.children("li").children("a").removeClass("current");
			pagination.children("li").children("a:nth(" + sequence + ")").addClass("current");
		}
		
		// ----------------------------------------
		// slideshow logic
		// ----------------------------------------
		
		var makeSlideshow = function(current){
			if (running == false)
			{
				$(target).children("a").hide();
				
				current.fadeIn().animate({opacity:1}, options.pauseSeconds*1000, function(){
					
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
			
				$(this).unbind("click");
				
				if (clicked == false && ! $(this).hasClass("current"))
				{
					var self = this;
					$(target).children("a").hide();
					running = true;
					
					$(target).children("a:nth(" + ($(self).text()-1) + ")").show().animate({opacity:1}, options.pauseSeconds*1000, function(){
						
						running = false;
						clicked = false;
						
						// rewind to the first item?
						if ($(self).text() == $(target).children("a").length)
							makeSlideshow(firstItem);
						else
							makeSlideshow($(target).children("a:nth(" + $(self).text() + ")"));
						
					});
					
					paginationHighlight($(self).text()-1);
				}
				
				clicked = true;
				
				return false;
			});
			
		};
		
		// ----------------------------------------
		// start the slideshow!
		// ----------------------------------------
		
		firstItem.show(); // show the first image immediately
		
		makeSlideshow(firstItem);
	};
})(jQuery);