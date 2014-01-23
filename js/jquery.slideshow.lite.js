/**
 * Slideshow Lite plugin for jQuery
 *
 * v0.8.2
 *
 * Copyright (c) 2009 Fred Wu
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

/**
 * Usage:
 *
 * // using default options
 * $("#slideshow").slideshow();
 *
 * // using some custom options
 * $("#slideshow2").slideshow({
 *   pauseSeconds: 4,
 *   height: 200,
 *   caption: false
 * });
 *
 * Configuration options:
 *
 * pauseSeconds  float    number of seconds between each photo to be displayed
 * fadeSpeed     float    number of seconds for the fading transition, the value should not exceed `pauseSeconds`
 * width         integer  width of the slideshow, in pixels
 * height        integer  height of the slideshow, in pixels
 * caption       boolean  display photo caption?
 * cssClass      string   name of the CSS class, defaults to `slideshowlite`
 * anchorTarget  string   name for the target="_xxx" attribute, defaults to `_self`
 * disableOnBlur bool     should we pause and resume the rotation on window blur
 */

(function($){
	$.widget("ui.slideshow", $.extend({}, $.ui.widget, {

	options: {
      pauseSeconds: 2,
      fadeSpeed: 0.5,
      width: 468,
      height: 120,
      caption: true,
      cssClass: 'slideshowlite',
      anchorTarget: '_self',
      disableOnBlur: false
	},
		
	// ----------------------------------------
    // run the slideshow instances!
    // ----------------------------------------
	_create: function() {
		if (this.length > 1) {
		  this.each(function() {
			this.runInstance(this.element);
		  });
		} else {
		  this.runInstance(this.element);
		}
	},
 
    // ----------------------------------------
    // slideshow instance
    // ----------------------------------------
		instance: null,
		makeSlideshow: null,
		
	runInstance : function(target) {
      var items  = $("a", target);
	  var that = this;
      //var instance;

      // ----------------------------------------
      // some mandontory styling
      // ----------------------------------------

      if ( ! $(target).hasClass(this.options.cssClass)) $(target).addClass(this.options.cssClass);

      $(target).css({
        width: this.options.width + "px",
        height: this.options.height + "px"
      });

      // ----------------------------------------
      // create anchor links to make the structure simpler for manupilation
      // ----------------------------------------

      $("> img", target).wrap(document.createElement("a"));
      $("a", target).attr("target", this.options.anchorTarget);

      // ----------------------------------------
      // add item sequence markups
      // ----------------------------------------

      var i = 1;
      $("a", target).each(function(){
        $(this).attr("data-seq", i++);
      });

      // ----------------------------------------
      // create pagination and caption
      // ----------------------------------------

      $(target).append("<ul></ul>");
      $(target).append("<ol></ol>");
      var pagination = $("> ul", target);
      var caption = $("> ol", target);

      var i = 1;
      var j = 0;
      $("a", target).each(function(){
        pagination.append("<li><a href=\"#\"><span>" + i++ + "</span></a></li>");
        caption.append("<li>" + $("img:nth(" + j++ + ")", target).attr("alt") + "</li>");
      });
      pagination.fadeTo(0, 0.8);
      caption.fadeTo(0, 0.6);
      caption.hide();

      // ----------------------------------------
      // shortcuts
      // ----------------------------------------

      var firstItem   = $("> a:first", target);
      var lastItem    = $("> a:last", target);
      var currentItem = firstItem;

      // ----------------------------------------
      // pagination highlight
      // ----------------------------------------

      var paginationHighlight = function(sequence){
        $("> li > a", pagination).removeClass("current");
        $("> li > a:nth(" + sequence + ")", pagination).addClass("current");
      }

      // ----------------------------------------
      // caption
      // ----------------------------------------

      var showCaption = function(sequence){
        caption.show();
        $("> li", caption).hide();
        $("> li:nth(" + sequence + ")", caption).fadeIn();
      }

      // ----------------------------------------
      // slideshow logic
      // ----------------------------------------

      var makeSlideshow = function(){

        // pagination click
        $("> li > a", pagination).click(function(){
          if ( ! $(this).hasClass("current"))
          {
            // select the current item after the pagination click
            currentItem = $("a:nth(" + ($(this).text()-1) + ")", target);

            currentItem.show();
            startSlideshow();
          }
          return false;
        });

        // pagination highlight
        paginationHighlight(currentItem.data("seq")-1);

        // show caption
        if (that.options.caption == true)
        {
          showCaption(currentItem.data("seq")-1);
        }

        currentItem.css("z-index", 2);

        // show the current slide
        currentItem.fadeIn(that.options.fadeSpeed*1000, function(){
          $("> a", target).hide();
          $(this).show().css("z-index", 1);
        });

        // prepare for the next slide
        // determines the next item (or we need to rewind to the first item?)
        if ($("img", currentItem).attr("src") == $("img", lastItem).attr("src")
			&& $(currentItem).data("name") == $(lastItem).data("name") )
        {
          currentItem = firstItem;
        }
        else
        {
          currentItem = currentItem.next();
        }

        currentItem.css("z-index", 1);
      };

      var startSlideshow = function(){
        clearInterval(that.instance);
        makeSlideshow();
        that.instance = setInterval(makeSlideshow, that.options.pauseSeconds*1000);
      };
		
		
      if(that.options.disableOnBlur) {
        $(window).focus(function() {
            clearInterval(that.instance);
            that.instance = setInterval(makeSlideshow, that.options.pauseSeconds*1000);
        });
    
        $(window).blur(function() {
            clearInterval(that.instance)
        });
      }

      // ----------------------------------------
      // start the slideshow!
      // ----------------------------------------
	  this.makeSlideshow = makeSlideshow;
      startSlideshow();
    },
 	destroy: function() {
		clearInterval(this.instance);
		$(window).off("focus");
		$(window).off("blur");
	  $("ul,ol", this.element).remove();
		
      $.Widget.prototype.destroy.call( this );
    },
	stop: function() {
		clearInterval(this.instance);
	},
	start: function() {
        this.instance = setInterval(this.makeSlideshow, this.options.pauseSeconds*1000);
	}

    
  })
)})(jQuery);
