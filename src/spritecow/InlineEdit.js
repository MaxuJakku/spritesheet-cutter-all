import $ from 'jquery';
import MicroEvent from './MicroEvent';

class InlineEdit {
    constructor($toWatch) {
        var $input = $('<input type="text"/>').appendTo($toWatch);
        var inlineEdit = this;

        inlineEdit._$input = $input;
        inlineEdit._$editing = null;
        inlineEdit._inputBoxOffset = {
            top: -parseInt($input.css('padding-top'), 10) - parseInt($input.css('border-top-width'), 10),
            left: -parseInt($input.css('padding-left'), 10) - parseInt($input.css('border-left-width'), 10)
        };

        $input.hide();
        $toWatch.on('click', '[data-inline-edit]', function (event) {
            var $target = $(event.target);
            var $editing = inlineEdit._$editing;

            if ($editing && $target[0] === $editing[0]) {
                return;
            }
            inlineEdit.edit($target);
            event.preventDefault();
        });

        $input.blur(function () {
            inlineEdit.finishEdit();
        }).keyup(function (event) {
            if (event.keyCode === 13) {
                $input[0].blur();
                event.preventDefault();
            }
        });

        // Call the function to automatically select all sprites when the document is ready
        $(document).ready(function() {
            inlineEdit.autoSelectAllSprites();
        });
    }
}

// Function to automatically select all sprites
InlineEdit.prototype.autoSelectAllSprites = function() {
    let sprites = this.detectSprites($('#spritesheet')[0]);
    sprites.forEach(sprite => {
        this.selectSprite(sprite);
    });
};

// Placeholder function to detect sprites in the spritesheet
InlineEdit.prototype.detectSprites = function(image) {
    let sprites = [];
    // Implement your sprite detection logic here
    return sprites;
};

// Function to select a sprite (existing logic can be integrated here)
InlineEdit.prototype.selectSprite = function(sprite) {
    // Your existing sprite selection logic
    // Example: $(sprite).trigger('click'); or any relevant logic
};

var InlineEditProto = InlineEdit.prototype = new MicroEvent();

InlineEditProto.edit = function($elm) {
    $elm = $($elm);

    var position = $elm.position();

    if (this._$editing) {
        this.finishEdit();
    }

    this._$editing = $elm;
    this._$input.show().css({
        top: position.top + this._inputBoxOffset.top,
        left: position.left + this._inputBoxOffset.left,
        width: Math.max($elm.width(), 50)
    }).val($elm.text()).focus();
};

InlineEditProto.finishEdit = function() {
    if (!this._$editing) { return; }

    var newVal = this._$input.hide().val();
    var event = new $.Event(this._$editing.data('inlineEdit'));

    event.val = newVal;
    this.trigger(event);
    this._$editing = null;
};

export default InlineEdit;
