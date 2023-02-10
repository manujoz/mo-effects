const MoColors = {
    /**
     * @method	type
     *
     * Determina el formato del color que se pasa al método.
     *
     * @param	{string}	color		Color del que queremos saber el formato.
     * @returns	{"HEX"|"RGB"|"RGBA"|"HSL"|"HSLA"|"TEXTO"}
     */
    type: function (color) {
        let regHEX = /^\#(([A-Fa-f0-9]){3}|([A-Fa-f0-9]){6})$/;
        let regRGB =
            /^rgb\((((\d{1,2})|([0-1][0-9]{2})|([0-2][0-4][0-9])|([0-2][0-5][0-5]))\,){2}((\d{1,2})|([0-1][0-9]{2})|([0-2][0-4][0-9])|([0-2][0-5][0-5]))\)$/;
        let regRGBA =
            /^rgba\((((\d{1,2})|([0-1][0-9]{2})|([0-2][0-4][0-9])|([0-2][0-5][0-5]))\,){3}((0?\.[0-9]{1,2})|(1))\)$/;
        let regHSL =
            /^hsl\(((\d{1,2})|([0-2][0-9]\d)|([0-3][0-5]\d)|(360))\,((\d{1,2})|(100))\%\,((\d{1,2})|(100))\%\)$/;
        let regHSLA =
            /^hsla\(((\d{1,2})|([0-2][0-9]\d)|([0-3][0-5]\d)|(360))\,(((\d{1,2})|(100))\%\,){2}((0?\.[0-9]{1,2})|(1))\)$/;
        let text = /[a-zA-z]/;

        if (regHEX.test(color)) {
            return `HEX`;
        }

        color = color.toString();
        let newColor = color.replace(new RegExp(` `, `g`), ``);

        if (regRGB.test(newColor)) {
            return `RGB`;
        }

        if (regRGBA.test(newColor)) {
            return `RGBA`;
        }

        if (regHSL.test(newColor)) {
            return `HSL`;
        }

        if (regHSLA.test(newColor)) {
            return `HSLA`;
        }

        if (text.test(newColor)) {
            return `TEXTO`;
        }

        // eslint-disable-next-line no-console
        console.error(
            `[Mo Effects#Colors] The entered color does not have a valid format (hexadecimal, rgb, rgba, hsl, hsla, hsla, hsla).): ${color}`
        );
        return false;
    },

    /**
     * @method	toRGB
     *
     * Convierte un color a formato RGB.
     *
     * @param	{string}	color		Color que queremos convertir.	Color que queremos convertir.
     * @returns {string}
     */
    toRGB: function (color) {
        let type = this.type(color);

        // Compronamos que sea un color válido

        if (!type) {
            return false;
        }

        // Quitamos los espacios al color

        color = color.toString();
        color = color.replace(new RegExp(` `, `g`), ``);

        // Si es rgb lo devolvemos tal cual

        if (type === `RGB`) {
            return color;
        }

        // Si es rgba lo convertimos a hexadecimal

        if (type === `RGBA`) {
            type = `HEX`;
            color = this.toHEX(color);
        }

        // De Hexadecimal a RGB

        if (type === `HEX`) {
            let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

            color = color.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });

            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);

            if (result) {
                let rgb =
                    `rgb(` +
                    parseInt(result[1], 16) +
                    `,` +
                    parseInt(result[2], 16) +
                    `,` +
                    parseInt(result[3], 16) +
                    `)`;
                return rgb;
            } else {
                return false;
            }
        }

        // De HSL a RGB

        if (type === `HSL` || type === `HSLA`) {
            let [sp] = color.split(`(`)[1].split(`)`);
            sp = sp.split(`,`);

            let r, g, b;
            let m1, m2, hue;

            let h = parseInt(sp[`0`]);
            let s = parseInt(sp[`1`]);
            let l = parseInt(sp[`2`]);

            s /= 100;
            l /= 100;
            if (s === 0) r = g = b = l * 255;
            else {
                if (l <= 0.5) {
                    m2 = l * (s + 1);
                } else {
                    m2 = l + s - l * s;
                }

                m1 = l * 2 - m2;
                hue = h / 360;
                r = Math.round(this._hue2rgb(m1, m2, hue + 1 / 3));
                g = Math.round(this._hue2rgb(m1, m2, hue));
                b = Math.round(this._hue2rgb(m1, m2, hue - 1 / 3));
            }

            return `rgb(` + r + `,` + g + `,` + b + `)`;
        }
    },

    /**
     * @method	toRGBA
     *
     * Convierte un color a formato RGBA.
     *
     * @param	{string}	color		Color que queremos convertir.
     * @param	{string}	trans		Transparencia que queremos darle al color.	Color que queremos convertir.
     * @returns {string}
     */
    toRGBA: function (color, trans) {
        let type = this.type(color);

        // Compronamos que sea un color válido

        if (!type) {
            return false;
        }

        // Quitamos los espacios al color

        color = color.toString();
        color = color.replace(new RegExp(` `, `g`), ``);

        // Si ya es rgba lo devolvemos tal cual

        if (type === `RGBA`) {
            return color;
        }

        // Si es rgb lo convertimos a hexadecimal

        if (type === `RGB`) {
            type = `HEX`;
            color = this.toHEX(color);
        }

        if (!trans) {
            trans = 1;
        }

        if (type === `HEX`) {
            let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

            color = color.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });

            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);

            if (result) {
                let rgba =
                    `rgba(` +
                    parseInt(result[1], 16) +
                    `,` +
                    parseInt(result[2], 16) +
                    `,` +
                    parseInt(result[3], 16) +
                    `,` +
                    trans +
                    `)`;
                return rgba;
            } else {
                return false;
            }
        }

        if (type === `HSL` || type === `HSLA`) {
            let [sp] = color.split(`(`)[1].split(`)`);
            sp = sp.split(`,`);

            let r, g, b;
            let m1, m2, hue;

            let h = parseInt(sp[`0`]);
            let s = parseInt(sp[`1`]);
            let l = parseInt(sp[`2`]);

            s /= 100;
            l /= 100;
            if (s === 0) r = g = b = l * 255;
            else {
                if (l <= 0.5) {
                    m2 = l * (s + 1);
                } else {
                    m2 = l + s - l * s;
                }

                m1 = l * 2 - m2;
                hue = h / 360;
                r = Math.round(this._hue2rgb(m1, m2, hue + 1 / 3));
                g = Math.round(this._hue2rgb(m1, m2, hue));
                b = Math.round(this._hue2rgb(m1, m2, hue - 1 / 3));
            }

            return `rgba(` + r + `,` + g + `,` + b + `,` + trans + `)`;
        }
    },

    /**
     * @method	toHSL
     *
     * Convierte un color a formato HSL.
     *
     * @param	{string}	color		Color que queremos convertir.	Color que queremos convertir.
     * @returns {string}
     */
    toHSL: function (color) {
        "use strict";

        let type = this.type(color);

        // Compronamos que sea un color válido

        if (!type) {
            return false;
        }

        // Quitamos los espacios al color

        color = color.toString();
        color = color.replace(new RegExp(` `, `g`), ``);

        // Si es hsl lo devolvemos tal cual

        if (type === `HSL`) {
            return color;
        }

        // Si no es rgb lo convertimos

        if (type !== `RGB`) {
            type = `RGB`;
            color = this.toRGB(color);
        }

        // Obtenemos los colores separados

        let [sp] = color.split(`(`)[1].split(`)`);
        sp = sp.split(`,`);

        let r = parseInt(sp[`0`]);
        let g = parseInt(sp[`1`]);
        let b = parseInt(sp[`2`]);

        r /= 255;
        g /= 255;
        b /= 255;

        let max = Math.max(r, g, b),
            min = Math.min(r, g, b);

        let l = (max + min) / 2;
        let s = 0;
        let h = 0;

        if (max !== min) {
            if (l < 0.5) {
                s = (max - min) / (max + min);
            } else {
                s = (max - min) / (2 - max - min);
            }

            if (r === max) {
                h = (g - b) / (max - min);
            } else if (g === max) {
                h = 2 + (b - r) / (max - min);
            } else {
                h = 4 + (r - g) / (max - min);
            }
        }

        h = Math.round(h * 60);
        s = Math.round(s * 100);
        l = Math.round(l * 100);

        if (h < 0) {
            h *= -1;
            h = 360 - h;
        }

        return `hsl(` + h + `,` + s + `%,` + l + `%)`;
    },

    /**
     * @method	toHSLA
     *
     * Convierte un color a formato HSLA.
     *
     * @param	{string}	color		Color que queremos convertir.
     * @param	{string}	trans		Transparencia que queremos darle al color.	Color que queremos convertir.
     * @returns {string}
     */
    toHSLA: function (color, trans) {
        "use strict";

        let type = this.type(color);

        // Compronamos que sea un color válido

        if (!type) {
            return false;
        }

        // Quitamos los espacios al color

        color = color.toString();
        color = color.replace(new RegExp(` `, `g`), ``);

        // Si es hsl lo devolvemos tal cual

        if (type === `HSLA`) {
            return color;
        }

        // Si no es rgb lo convertimos

        if (type !== `RGB`) {
            type = `RGB`;
            color = this.toRGB(color);
        }

        if (!trans) {
            trans = 1;
        }

        // Obtenemos los colores separados

        let [sp] = color.split(`(`)[1].split(`)`);
        sp = sp.split(`,`);

        let r = parseInt(sp[`0`]);
        let g = parseInt(sp[`1`]);
        let b = parseInt(sp[`2`]);

        r /= 255;
        g /= 255;
        b /= 255;

        let max = Math.max(r, g, b),
            min = Math.min(r, g, b);

        let l = (max + min) / 2;
        let s = 0;
        let h = 0;

        if (max !== min) {
            if (l < 0.5) {
                s = (max - min) / (max + min);
            } else {
                s = (max - min) / (2 - max - min);
            }

            if (r === max) {
                h = (g - b) / (max - min);
            } else if (g === max) {
                h = 2 + (b - r) / (max - min);
            } else {
                h = 4 + (r - g) / (max - min);
            }
        }

        h = Math.round(h * 60);
        s = Math.round(s * 100);
        l = Math.round(l * 100);

        if (h < 0) {
            h *= -1;
            h = 360 - h;
        }

        return `hsla(` + Math.round(h) + `,` + s + `%,` + l + `%,` + trans + `)`;
    },

    /**
     * @method	toHEX
     *
     * Convierte un color a formato HEX.
     *
     * @param	{string}	color		Color que queremos convertir.
     * @returns {string}
     */
    toHEX: function (color) {
        "use strict";

        let type = this.type(color);

        // Compronamos que sea un color válido

        if (!type) {
            return false;
        }

        // Quitamos los espacios al color

        color = color.toString();
        color = color.replace(new RegExp(` `, `g`), ``);

        // Si ya es hexadecimal lo devolvemos tal cual

        if (type === `HEX`) {
            return color;
        }

        // Si no es rgb lo convertimos

        if (type !== `RGB` && type !== `RGBA`) {
            color = this.toRGB(color);
        }

        // Convertimos el color

        let [sp] = color.split(`(`)[1].split(`)`);
        sp = sp.split(`,`);

        let r = parseInt(sp[`0`]).toString(16);
        r = r.length === 1 ? `0` + r : r;

        let g = parseInt(sp[`1`]).toString(16);
        g = g.length === 1 ? `0` + g : g;

        let b = parseInt(sp[`2`]).toString(16);
        b = b.length === 1 ? `0` + b : b;

        return `#` + r + `` + g + `` + b;
    },

    /**
     * @method	constrast
     *
     * Devuelve el contraste de un color dado.
     *
     * @param	{string}	color		Color del que queremos saber el contrate.
     * @return	{"light"|"dark"}
     */
    contrast: function (color) {
        let type = this.type(color);

        // Compronamos que sea un color válido

        if (!type || type == `TEXTO`) {
            return false;
        }

        // Si no es hexadecimal lo CONVERTIMOS

        if (type !== `RGB`) {
            color = this.toRGB(color);
        }

        // Sacamos los colores red, green, blue

        color = color.toString();
        color = color.replace(new RegExp(` `, `g`), ``);

        let [sp] = color.split(`(`)[1].split(`)`);
        sp = sp.split(`,`);

        let r = parseInt(sp[`0`]);
        let g = parseInt(sp[`1`]);
        let b = parseInt(sp[`2`]);

        // Sacamos el brillo del color

        let brillo = (r * 299 + g * 587 + b * 114) / 1000;

        // Devolvemos si es claro u oscuro

        if (brillo > 125) {
            return `light`;
        } else {
            return `dark`;
        }
    },

    /**
     * @method	_hue2rgb
     *
     * Realiza los cálculos para transformar un color de HSL a RGB
     */
    _hue2rgb: function (m1, m2, hue) {
        let v;
        if (hue < 0) {
            hue += 1;
        } else if (hue > 1) {
            hue -= 1;
        }

        if (6 * hue < 1) {
            v = m1 + (m2 - m1) * hue * 6;
        } else if (2 * hue < 1) {
            v = m2;
        } else if (3 * hue < 2) {
            v = m1 + (m2 - m1) * (2 / 3 - hue) * 6;
        } else {
            v = m1;
        }

        return 255 * v;
    },
};

export default {
    contrast: MoColors.contrast,
    toHEX: MoColors.toHEX,
    toHSL: MoColors.toHSL,
    toHSLA: MoColors.toHSLA,
    toRGB: MoColors.toRGB,
    toRGBA: MoColors.toRGBA,
    type: MoColors.type,
};
