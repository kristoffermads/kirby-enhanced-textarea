(function($) {
  
  $.fn.betterInsertAtCursor = function (myValue) {
    return this.each(function(){
      // IE support
      if(document.selection) {
        this.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
        this.focus();
      // Moz / Netscape support
      } else if (this.selectionStart || this.selectionStart == '0') {
        var startPos  = this.selectionStart;
        var endPos    = this.selectionEnd;
        var scrollTop = this.scrollTop;
        this.focus();
        document.execCommand("insertText", false, myValue);
      } else {
        this.value += myValue;
        this.focus();
      }
    });
  };

  $.fn.editor = function() {

    return this.each(function() {

      if($(this).data('editor')) {
        return $(this);
      }

      var textarea = $(this);
      var buttons  = textarea.parent().find('.field-buttons');

      // start autosizing
      textarea.autosize();

      buttons.find('.btn').on('click.editorButton', function(e) {

        textarea.focus();
        var button = $(this);

        if(button.data('action')) {
          
          app.modal.open(button.data('action'), function() {
                      
            $(".modal .slidedown.active").on('click', function() {
              $(this).toggleClass("open")
                     .closest(".page").children(".subpages").slideToggle(250, function() {
                        var content = $('.modal-content');
                        console.log(content.center(3 * 16));
                     });
            });
            $(".modal .link.smalllink").on('click', function() {        
              textarea = $("#" + $(".modal form").data("textarea"));
              link = $(this).data("link");
              name = $(this).siblings(".name").html();
              var sel  = textarea.getSelection();
              if(sel.length > 0) name = sel;
              textarea.betterInsertAtCursor("(link: " + link + " text: " + name + ")" );
              textarea.trigger('autosize.resize');
              app.modal.close();
            });
          
          });
          
          
        } else {

          var sel  = textarea.getSelection();
          var selStart = textarea[0].selectionStart;
          var selEnd = textarea[0].selectionEnd;
          var tpl  = button.data('tpl');
          var text = button.data('text');
          var line = button.hasClass("list") || button.hasClass("header");
          var multiple = button.hasClass("list");
          
          function toLine(t) {
            var curline = t.value.substr(0, t.selectionStart).split("\n").length;
            var linestocur = t.value.substr(0, t.selectionStart).split("\n");
            linestocur.splice(-1, 1);
            var charstocur = linestocur.join("\n").length;
            if (linestocur.length > 0) {
              charstocur++;
            }
            t.focus();
            t.setSelectionRange(charstocur, charstocur);
          }
          
          function fullLines(t) {
            var curline = t.value.substr(0, t.selectionStart).split("\n").length;
            var linestocur = t.value.substr(0, t.selectionStart).split("\n");
            linestocur.splice(-1, 1);
            var charstocur = linestocur.join("\n").length;
            if (linestocur.length > 0) {
              charstocur++;
            }
            t.focus();
            t.setSelectionRange(charstocur, selEnd);
            selStart = textarea[0].selectionStart;
            selEnd = textarea[0].selectionEnd;
          }

          if (line) {
            var t = textarea[0];
            toLine(t);
          }
          
          if (multiple && sel.indexOf("\n") >= 0) {
            fullLines(t);
            var newsel = textarea.getSelection().split("\n");
            for (var i = 0; i < newsel.length; i++) {
              newsel[i] = tpl + newsel[i];
            }
            newsel = newsel.join("\n");
            var before = textarea[0].value.slice(0, selStart);
            var after = textarea[0].value.slice(selEnd);
            textarea[0].value = before + newsel + after;
          }
          else {
            if(sel.length > 0) text = sel;
            var tag = tpl.replace('{text}', text);
            textarea.betterInsertAtCursor(tag);
          }
          
          


          textarea.trigger('autosize.resize');

        }
        
        return false;

      });

      buttons.find('[data-editor-shortcut]').each(function(i, el) {
        var key    = $(this).data('editor-shortcut');
        var action = function(e) {
          $(el).trigger('click');
          return false;
        };

        textarea.bind('keydown', key, action);

        if(key.match(/meta\+/)) {
          textarea.bind('keydown', key.replace('meta+', 'ctrl+'), action);
        }

      });

      textarea.data('editor', true);

    });

  };

})(jQuery);