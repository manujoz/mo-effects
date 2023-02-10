const MoSlide = {
    /**
     * Toggle slide effect over an element
     *
     * @param	{HTMLElement} el Element to animate
     * @param	{{speed: number, effect: string}} settings Effect options.
     * @param	{Function}	func Callback function.
     */
    toggle(el, settings = { speed: 400, effect: `ease` }, func = null) {
        if (el.offsetHeight === 0) {
            this.down(el, settings, func);
        } else {
            this.up(el, settings, func);
        }
    },

    /**
     * Close effect over an element.
     *
     * @param	{HTMLElement} el Element to animate
     * @param	{{speed: number, effect: string}} settings Effect options.
     * @param	{Function}	func Callback function.
     */
    up(el, settings = { speed: 400, effect: `ease` }, func = null) {
        // Si no tiene alto devolvemos false

        if (el.offsetHeight === 0) {
            return false;
        }

        // Si esta siendo animado false

        if (el.hasAttribute(`aw-slide-animating`)) {
            return false;
        } else {
            el.setAttribute(`aw-slide-animating`, ``);
        }

        // Ajustamos los argumentos de la función

        if (typeof settings === `function`) {
            func = settings;
            settings = { speed: 400, effect: `ease` };
        }

        // Ajustamos la configuración

        settings = this._setSettings(settings);

        // Cogemos los estilos por defecto del elemento

        let style = this._getStyles(el);

        // Cogemos el padding y los bordes

        let padding = this._getPadding(el);
        let margin = this._getMargin(el);
        let border = this._getBorder(el);

        // Cogemos el heigh del elemento

        let height = el.offsetHeight - padding.top - padding.bottom - border.top - border.bottom;

        // Preparamos el elemento para la animación

        el.style.overflow = `hidden`;
        el.style.height = height + `px`;
        el.style.transition = `all ` + settings.speed / 1000 + `s ` + settings.effect;

        // Animamos el elemento

        setTimeout(function () {
            el.style.height = `0px`;
            el.style.paddingTop = `0px`;
            el.style.paddingBottom = `0px`;
            el.style.padding = `0px ` + padding.right + `px 0px` + padding.left + `px`;
            el.style.marginTop = `0px`;
            el.style.marginBottom = `0px`;
            el.style.margin = `0px ` + margin.right + `px 0px` + margin.left + `px`;
            el.style.borderTopWidth = `0px`;
            el.style.borderBottomWidth = `0px`;
        }, 20);

        // Llamamos a la función si corresponde

        if (typeof func === `function`) {
            let response = {
                action: `up`,
            };

            setTimeout(function () {
                func.call(this, response);
            }, settings.speed);
        }

        // Reseteamos el elemento

        this._resetElement(el, style, settings.speed, true);
    },

    /**
     * Open effect over an element.
     *
     * @param	{HTMLElement} el Element to animate
     * @param	{{speed: number, effect: string}} settings Effect options.
     * @param	{Function}	func Callback function.
     */
    down(el, settings = { speed: 400, effect: `ease` }, func = null) {
        // Si tiene alto devolvemos false

        if (el.offsetHeight > 0) {
            return false;
        }

        // Si esta siendo animado false

        if (el.hasAttribute(`aw-slide-animating`)) {
            return false;
        } else {
            el.setAttribute(`aw-slide-animating`, ``);
        }

        // Ajustamos los argumentos de la función

        if (typeof settings === `function`) {
            func = settings;
            settings = { speed: 400, effect: `ease` };
        }

        // Ajustamos la configuración

        settings = this._setSettings(settings);

        // Cogemos los estilos por defecto del elemento

        let style = this._getStyles(el);

        // Cogemos el padding del elemento

        let padding = this._getPadding(el);
        let margin = this._getMargin(el);
        let border = this._getBorder(el);

        // Clonamos el elemento y cogemos el ancho computado si lo tiene

        let clon = el.cloneNode(true);
        clon.style.display = `block`;

        let anEl = window.getComputedStyle(el, ``).width;
        if (anEl === `auto`) {
            anEl = `100%`;
        }

        // Creamos el elemento provisional e introducimos el clon

        let prov = document.createElement(`DIV`);
        prov.style.position = `absolute`;
        prov.style.width = anEl;
        prov.style.zIndex = `-1000`;
        prov.style.opacity = `0`;

        prov.appendChild(clon);

        // Introducimos el elemento provisional en el body

        if (!el.parentElement) {
            document.body.appendChild(prov);
        } else {
            el.parentElement.appendChild(prov);
        }

        // Cogemos la altura del elemento

        let height = clon.offsetHeight - padding.top - padding.bottom - border.top - border.bottom;

        // Eliminamos el elemento provisional

        if (prov.parentNode) {
            prov.parentNode.removeChild(prov);
        }

        // Ajustamos el elemento para la animación

        el.style.height = `0px`;
        el.style.paddingTop = `0px`;
        el.style.paddingBottom = `0px`;
        el.style.padding = `0px ` + padding.right + `px 0px` + padding.left + `px`;
        el.style.marginTop = `0px`;
        el.style.marginBottom = `0px`;
        el.style.margin = `0px ` + margin.right + `px 0px` + margin.left + `px`;
        el.style.borderTopWidth = `0px`;
        el.style.borderBottomWidth = `0px`;
        el.style.overflow = `hidden`;
        el.style.transition = `all ` + settings.speed / 1000 + `s ` + settings.effect;
        el.style.display = `block`;

        // Animamos el elemento

        setTimeout(function () {
            el.style.height = height + `px`;
            el.style.paddingTop = padding.top + `px`;
            el.style.paddingBottom = padding.bottom + `px`;
            el.style.padding =
                padding.top + `px ` + padding.right + `px ` + padding.bottom + `px ` + padding.left + `px`;
            el.style.marginTop = margin.top + `px`;
            el.style.marginBottom = margin.bottom + `px`;
            el.style.margin = margin.top + `px ` + margin.right + `px ` + margin.bottom + `px ` + margin.left + `px`;
            el.style.borderTopWidth = border.top + `px`;
            el.style.borderBottomWidth = border.bottom + `px`;
        }, 10);

        // Llamamos a la función si corresponde

        if (typeof func === `function`) {
            let response = {
                action: `down`,
            };

            setTimeout(function () {
                func.call(this, response);
            }, settings.speed);
        }

        // Reseteamos el elemento

        this._resetElement(el, style, settings.speed);
    },

    /**
     * @method	_setSettings
     *
     * Asigna las opciones del efecto.
     *
     * @param	{object}	settings	Opciones del efecto.
     */
    _setSettings(settings) {
        return {
            speed: settings.speed || 400,
            effect: settings.effect || `ease`,
        };
    },

    /**
     * @method	_getStyles
     *
     * Obtiene los estilos del node sobre el que estamos haciendo el efecto. Este método
     * se llama antes de realizar el efecto para obtener los estilos originales del node.
     *
     * @param	{node}		el			Elemento sobre el que hacemos el efecto.
     */
    _getStyles(el) {
        return {
            opacity: el.style.opacity || null,
            height: el.style.height || null,
            paddingTop: el.style.paddingTop || null,
            paddingBottom: el.style.paddingBottom || null,
            padding: el.style.padding || null,
            marginTop: el.style.marginTop || null,
            marginBottom: el.style.marginBottom || null,
            margin: el.style.margin || null,
            borderTopWidth: el.style.borderTopWidth || null,
            borderBottomWidth: el.style.borderBottomWidth || null,
            overflow: el.style.overflow || null,
            transition: el.style.transition || null,
        };
    },

    /**
     * @method	_resetElement
     *
     * Resetea los estilos CSS del elemento sobre el que hacemos el efecto. Este método
     * se llama al finalizar el efecto para dejar el elemento como estaba originalmente.
     *
     * @param	{node}		el			Elemento sobre el que hacemos el efecto.
     * @param	{object}	style		Estilos originales del node.
     * @param	{number}	speed		Velocidad a la que se realiza el efecto.
     * @param	{boolean}	hide		Determina si estamos ocultado el elemento.
     */
    _resetElement(el, style, speed, hide = false) {
        setTimeout(function () {
            el.removeAttribute(`aw-slide-animating`);
            el.style.opacity = style.opacity;
            el.style.height = style.height;
            el.style.paddingTop = style.paddingTop;
            el.style.paddingBottom = style.paddingBottom;
            el.style.padding = style.padding;
            el.style.marginTop = style.marginTop;
            el.style.marginBottom = style.marginBottom;
            el.style.margin = style.margin;
            el.style.borderTopWidth = style.borderTopWidth;
            el.style.borderBottomWidth = style.borderBottomWidth;
            el.style.overflow = style.overflow;
            el.style.transition = style.transition;

            if (hide) {
                el.style.display = `none`;
            }
        }, speed + 10);
    },

    /**
     * @method	_getPadding
     *
     * Obtiene los padding del elemento sobre el que realizamos el efecto.
     *
     * @param	{node}		el			Elemento sobre el que realizamos el efecto.
     */
    _getPadding(el) {
        let paddTop = parseInt(window.getComputedStyle(el, ``).paddingTop.replace(`px`, ``));
        let paddRight = parseInt(window.getComputedStyle(el, ``).paddingRight.replace(`px`, ``));
        let paddBottom = parseInt(window.getComputedStyle(el, ``).paddingBottom.replace(`px`, ``));
        let paddLeft = parseInt(window.getComputedStyle(el, ``).paddingLeft.replace(`px`, ``));

        return {
            top: paddTop,
            right: paddRight,
            bottom: paddBottom,
            left: paddLeft,
        };
    },

    /**
     * @method	_getMargin
     *
     * Obtiene el margen del elemento sobre el que realizamos el efecto.
     *
     * @param	{node}		el			Elemento sobre el que realizamos el efecto.
     */
    _getMargin(el) {
        let marginTop = parseInt(window.getComputedStyle(el, ``).marginTop.replace(`px`, ``));
        let marginRight = parseInt(window.getComputedStyle(el, ``).marginRight.replace(`px`, ``));
        let marginBottom = parseInt(window.getComputedStyle(el, ``).marginBottom.replace(`px`, ``));
        let marginLeft = parseInt(window.getComputedStyle(el, ``).marginLeft.replace(`px`, ``));

        return {
            top: marginTop,
            right: marginRight,
            bottom: marginBottom,
            left: marginLeft,
        };
    },

    /**
     * @method	_getBorder
     *
     * Obtiene los bordes del elemento sobre el que realizamos el efecto.
     *
     * @param	{node}		el			Elemento sobre el que realizamos el efecto.
     */
    _getBorder(el) {
        let borderTop = parseInt(window.getComputedStyle(el, ``).borderTopWidth.replace(`px`, ``));
        let borderRight = parseInt(window.getComputedStyle(el, ``).borderRightWidth.replace(`px`, ``));
        let borderBottom = parseInt(window.getComputedStyle(el, ``).borderBottomWidth.replace(`px`, ``));
        let borderLeft = parseInt(window.getComputedStyle(el, ``).borderLeftWidth.replace(`px`, ``));

        return {
            top: borderTop,
            right: borderRight,
            bottom: borderBottom,
            left: borderLeft,
        };
    },
};

export default {
    down: MoSlide.down,
    up: MoSlide.up,
    toggle: MoSlide.toggle,
};
