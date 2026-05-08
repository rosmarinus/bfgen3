'use strict';
module.exports = class ShapeSeeker {

    constructor(data) {
        const fs = require('fs');
        const path = require('path');

        const plugins = {};
        const shapedir = path.join(__dirname, "shapes");
        fs.readdirSync(shapedir).forEach(file => {
            if (path.extname(file) === '.js') {
                plugins[file.slice(0, -3)] = path.join(shapedir, file);
            }
        });
        delete plugins['shape'];

        this.whiteMarks = {};
        Object.keys(plugins).forEach(key => {
            const Shape = require(plugins[key]);
            const shape = new Shape(data);
            this.blackMark = key;
            this.whiteMarks[key] = shape.WhiteMarks;
        });
    };
}
