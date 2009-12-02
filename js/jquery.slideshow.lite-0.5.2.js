/**
 * Slideshow Lite plugin for jQuery
 *
 * v0.5.2
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
 * width         integer  width of the slideshow, in pixels
 * height        integer  height of the slideshow, in pixels
 * caption       boolean  display photo caption?
 * cssClass      string   name of the CSS class, defaults to 'slideshowlite'
 */

(function($){
	$.fn.slideshow = function(options){
		
		var defaults = {
			pauseSeconds: 2,
			width: 468,
			height: 120,
			caption: true,
			cssClass: 'slideshowlite'
		};
		
		var options = $.extend(defaults, options);
		
		// ----------------------------------------
		// slideshow objects and variables
		// ----------------------------------------
		
		var target = this;
		var items  = $(target).children("a");
		var instance;
		
		// ----------------------------------------
		// some mandontory styling
		// ----------------------------------------
		
		if ( ! $(this).hasClass(options.cssClass)) $(this).addClass(options.cssClass);
		
		$(this).css({
			width: options.width + "px",
			height: options.height + "px"
		});
		
		// ----------------------------------------
		// create anchor links to make the structure simpler for manupilation
		// ----------------------------------------
		
		$(this).children("img").wrap(document.createElement("a"));
		$(this).children("a").attr("target", "blank");
		
		// ----------------------------------------
		// add item sequence markups
		// ----------------------------------------
		
		var i = 1;
		$(this).children("a").each(function(){
			$(this).attr("rel", i++);
		});
		
		// ----------------------------------------
		// create pagination and caption
		// ----------------------------------------
		
		$(this).append("<ul></ul>");
		$(this).append("<ol></ol>");
		var pagination = $(this).children("ul");
		var caption = $(this).children("ol");
		
		var i = 1;
		var j = 0;
		$(this).children("a").each(function(){
			pagination.append("<li><a href=\"#\">" + i++ + "</a></li>");
			caption.append("<li>" + $("#" + $(target).attr("id") + " img:nth(" + j++ + ")").attr("alt") + "</li>");
		});
		pagination.fadeTo(0, 0.8);
		caption.fadeTo(0, 0.6);
		caption.hide();
		
		// ----------------------------------------
		// shortcuts
		// ----------------------------------------
		
		var firstItem   = $(target).children("a:first");
		var lastItem    = $(target).children("a:last");
		var currentItem = firstItem;
		
		// ----------------------------------------
		// pagination highlight
		// ----------------------------------------
		
		var paginationHighlight = function(sequence){
			pagination.children("li").children("a").removeClass("current");
			pagination.children("li").children("a:nth(" + sequence + ")").addClass("current");
		}
		
		// ----------------------------------------
		// caption
		// ----------------------------------------
		
		var showCaption = function(sequence){
			caption.show();
			caption.children("li").hide();
			caption.children("li:nth(" + sequence + ")").fadeIn();
		}
		
		// ----------------------------------------
		// slideshow logic
		// ----------------------------------------
		
		var makeSlideshow = function(){
			
			// pagination click
			pagination.children("li").children("a").click(function(){
				if ( ! $(this).hasClass("current"))
				{
					// select the current item after the pagination click
					currentItem = $(target).children("a:nth(" + ($(this).text()-1) + ")");

					currentItem.show();
					startSlideshow();
				}
			});
			
			// pagination highlight
			paginationHighlight(currentItem.attr("rel")-1);
			
			// show caption
			if (options.caption == true)
			{
				showCaption(currentItem.attr("rel")-1);
			}
			
			// show the current slide
			currentItem.fadeIn(function(){
				$(target).children("a").hide();
				$(this).show().css("z-index", 1);
			});
			
			// prepare for the next slide
			// determines the next item (or we need to rewind to the first item?)
			if (currentItem.children("img").attr("src") == lastItem.children("img").attr("src"))
			{
				currentItem = firstItem;
				currentItem.css("z-index", 2);
			}
			else
			{
				currentItem = currentItem.next();
			}
		};
		
		var startSlideshow = function(){
			clearInterval(instance);
			makeSlideshow();
			instance = setInterval(makeSlideshow, options.pauseSeconds*1000);
		};
		
		// ----------------------------------------
		// start the slideshow!
		// ----------------------------------------
		
		startSlideshow();
	};
})(jQuery);