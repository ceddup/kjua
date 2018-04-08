const drawModuleRounded = require('./drawRounded');
const drawMode = require('./drawMode');

const drawBackground = (context, settings) => {
    context.fillStyle = settings.back;
    context.fillRect(0, 0, settings.size * 3, settings.size);
};

const drawModuleDefault = (qr, context, settings, width, row, col) => {
    if (qr.isDark(row, col)) {
        context.rect(col * width, row * width, width, width);
    }
};

const drawModules = (qr, context, settings) => {
    if (!qr) {
        return;
    }

    const drawModule = settings.rounded > 0 && settings.rounded <= 100 ? drawModuleRounded : drawModuleDefault;
    const moduleCount = qr.moduleCount;

    let moduleSize = settings.size / moduleCount;
    let offset = 0;
    if (settings.crisp) {
        moduleSize = Math.floor(moduleSize);
        offset = Math.floor((settings.size - moduleSize * moduleCount) / 2);
    }

    context.translate(offset, offset);
    context.beginPath();
    for (let row = 0; row < moduleCount; row += 1) {
        for (let col = 0; col < moduleCount; col += 1) {
            drawModule(qr, context, settings, moduleSize, row, col);
        }
    }
    context.fillStyle = settings.fill;
    context.fill();
    context.translate(-offset, -offset);
};

const drawText = (context, settings) => {
    const size = settings.size;
    const font = settings.mSize * 0.01 * size + 'px ' + settings.fontname;

    context.strokeStyle = settings.back;
    context.lineWidth = settings.mSize * 0.01 * size * 0.1;
    context.fillStyle = settings.fontcolor;
    context.font = font;

    const w = context.measureText(settings.label).width;
    const sh = settings.mSize * 0.01;
    const sw = w / size;
    const sl = (1 - sw) * settings.mPosX * 0.01;
    const st = (1 - sh) * settings.mPosY * 0.01;
    const x = size * 0.75 + sl * size;
    const y = st * size + 0.75 * settings.mSize * 0.01 * size;

    //context.strokeText(settings.label, x, y);
    context.fillText('Hello world', x, y);
};

const draw = (qr, context, settings) => {
    drawBackground(context, settings);
    drawModules(qr, context, settings);
    drawMode(context, settings);
    drawText(context, settings);
};

module.exports = draw;
