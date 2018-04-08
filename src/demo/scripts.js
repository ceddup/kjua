/* eslint-disable func-names,no-var,prefer-reflect,prefer-arrow-callback */
(function () {
    var win = window; // eslint-disable-line no-undef
    var FR = win.FileReader;
    var doc = win.document;
    var kjua = win.kjua;
    var options = {};

    var guiValuePairs = [
        ['size', 'px'],
        ['minversion', ''],
        ['quiet', ' modules'],
        ['rounded', '%'],
        ['msize', '%'],
        ['mposx', '%'],
        ['mposy', '%']
    ];

    function elById(id) {
        return doc.getElementById(id);
    }

    function valById(id) {
        var el = elById(id);
        return el && el.value;
    }

    function intById(id) {
        return parseInt(valById(id), 10);
    }

    function onEvent(el, type, fn) {
        el.addEventListener(type, fn);
    }

    function onReady(fn) {
        console.log('onReady');
        onEvent(doc, 'DOMContentLoaded', fn);

        // Init defaults
        options.items = [{
            mode: 'label',

            mSize: 20,
            mPosX: 50,
            mPosY: 50,

            label: 'NANO',
            fontname: 'Nunito',
            fontcolor: '#000000'
        },
        {
            mode: 'label',
            mSize: 20,
            mPosX: 250,
            mPosY: 10,

            label: 'NANO ACCEPTED HERE',
            fontname: 'Nunito',
            fontcolor: '#000000'
        },
        {
            mode: 'label',

            mSize: 10,
            mPosX: 50,
            mPosY: 50,

            label: 'Pay with NANO',
            fontname: 'Nunito',
            fontcolor: '#eeeeee'
        },
        {
            mode: 'label',

            mSize: 20,
            mPosX: 50,
            mPosY: 50,

            // label: 'NANO',
            fontname: 'Nunito',
            fontcolor: '#000000'
        }
        ];
    }

    function forEach(list, fn) {
        Array.prototype.forEach.call(list, fn);
    }

    function all(query, fn) {
        var els = doc.querySelectorAll(query);
        if (fn) {
            forEach(els, fn);
        }
        return els;
    }

    function updateGui() {
        guiValuePairs.forEach(function (pair) {
            var label = all('label[for="' + pair[0] + '"]')[0];
            var text = label.innerHTML;
            label.innerHTML = text.replace(/:.*$/, ': ' + valById(pair[0]) + pair[1]);
        });
    }

    function updateQrCode() {
        console.log('updateQrCode');
        options.render = valById('render');
        options.crisp = valById('crisp') === 'true';
        options.ecLevel = valById('eclevel');
        options.minVersion = intById('minversion');

        options.fill = valById('fill');
        options.back = valById('back');

        options.text = valById('text');
        options.size = intById('size');
        options.rounded = intById('rounded');
        options.quiet = intById('quiet');

        if (!options.items) options.items = [];
        options.items[valById('item')] = {
            mode: valById('mode'),

            mSize: intById('msize'),
            mPosX: intById('mposx'),
            mPosY: intById('mposy'),

            label: valById('label'),
            fontname: valById('font'),
            fontcolor: valById('fontcolor'),

            image: elById('img-buffer')
        };
        // console.log('options :' + JSON.stringify(options));
        var container = elById('container');
        var qrcode = kjua(options);
        forEach(container.childNodes, function (child) {
            container.removeChild(child);
        });
        if (qrcode) {
            container.appendChild(qrcode);
        }
    }

    function update() {
        updateGui();
        updateQrCode();
    }

    function onImageInput() {
        var input = elById('image');
        if (input.files && input.files[0]) {
            var reader = new FR();
            reader.onload = function (ev) {
                elById('img-buffer').setAttribute('src', ev.target.result);
                elById('mode').value = 4;
                setTimeout(update, 250);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    onReady(function () {
        onEvent(elById('image'), 'change', onImageInput);
        all('input, textarea, select', function (el) {
            onEvent(el, 'input', update);
            onEvent(el, 'change', update);
        });
        onEvent(win, 'load', update);
        update();
    });
}());
/* eslint-enable */
