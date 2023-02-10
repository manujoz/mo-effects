const MoFade = {
    /**
     * @param {HTMLElement} el
     * @param {{speed: number, effect: string}} settings
     * @param {Function} func
     */
    toggle(el, settings = { speed: 400, effect: `ease` }, func = null) {
        if (el.offsetHeight === 0) {
            MoFade.in(el, settings, func);
        } else {
            MoFade.out(el, settings, func);
        }
    },

    /**
     * @param {HTMLElement} el
     * @param {{speed: number, effect: string}} settings
     * @param {Function} func
     */
    in(el, settings = { speed: 400, effect: `ease` }, func = null) {
        // Si tiene alto devolvemos false

        if (el.offsetHeight > 0) {
            return false;
        }

        // Si esta siendo animado false

        if (el.hasAttribute(`aw-fade-animating`)) {
            return false;
        } else {
            el.setAttribute(`aw-fade-animating`, ``);
        }

        // Ajustamos los argumentos de la función

        if (typeof settings === `function`) {
            func = settings;
            settings = { speed: 400, effect: `ease` };
        }

        // Ajustamos la configuración
        settings = MoFade._setSettings(settings);

        // Cogemos los estilos por defecto del elemento

        let style = MoFade._getStyles(el);

        // Preparamos el elemento para aparecer

        el.style.opacity = `0`;
        if (el.style.opacity && el.style.opacity !== `1`) {
            el.style.opacity = el.style.opacity;
        }

        el.style.transition = `all ` + settings.speed / 1000 + `s ` + settings.effect;
        el.style.display = `block`;

        // Animamos el elemento

        setTimeout(function () {
            el.style.opacity = `1`;
        }, 10);

        // Llamamos a la función si corresponde

        if (typeof func === `function`) {
            let response = {
                action: `in`,
            };

            setTimeout(function () {
                func.call(el, response);
            }, settings.speed);
        }

        // Reseteamos el elemento

        MoFade._resetElement(el, style, settings.speed);
    },

    /**
     * @param {HTMLElement} el
     * @param {{speed: number, effect: string}} settings
     * @param {Function} func
     */
    out(el, settings = { speed: 400, effect: `ease` }, func = null) {
        // Si no tiene alto devolvemos false

        if (el.offsetHeight === 0) {
            return false;
        }

        // Si esta siendo animado false

        if (el.hasAttribute(`aw-fade-animating`)) {
            return false;
        } else {
            el.setAttribute(`aw-fade-animating`, ``);
        }

        // Ajustamos los argumentos de la función

        if (typeof settings === `function`) {
            func = settings;
            settings = { speed: 400, effect: `ease` };
        }

        // Ajustamos la configuración

        settings = MoFade._setSettings(settings);

        // Cogemos los estilos por defecto del elemento

        let style = MoFade._getStyles(el);

        // Preparamos el elemento para aparecer

        el.style.opacity = `1`;
        if (el.style.opacity && el.style.opacity !== `0`) {
            el.style.opacity = el.style.opacity;
        }

        el.style.transition = `all ` + settings.speed / 1000 + `s ` + settings.effect;
        el.style.display = `block`;

        // Animamos el elemento

        setTimeout(function () {
            el.style.opacity = `0`;
        }, 10);

        // Llamamos a la función si corresponde

        if (typeof func === `function`) {
            let response = {
                action: `out`,
            };

            setTimeout(function () {
                func.call(MoFade, response);
            }, settings.speed);
        }

        // Reseteamos el elemento

        MoFade._resetElement(el, style, settings.speed, true);
    },

    _setSettings(settings) {
        return {
            speed: settings.speed || 400,
            effect: settings.effect || `ease`,
        };
    },

    _getStyles(el) {
        return {
            opacity: el.style.opacity || null,
            transition: el.style.transition || null,
        };
    },

    _resetElement(el, style, speed, hide = false) {
        setTimeout(function () {
            el.removeAttribute(`aw-fade-animating`);
            el.style.opacity = style.opacity;
            el.style.transition = style.transition;

            if (hide) {
                el.style.display = `none`;
            }
        }, speed + 10);
    },
};

export default {
    in: MoFade.in,
    out: MoFade.out,
    toggle: MoFade.toggle,
};
