class AnimateClass {
    /**
     * Animate at element
     *
     * @param {HTMLElement} el Element to animate
     * @param {CSSStyleDeclaration} props CSS props to animate
     * @param {{speed: number, effect: string, delay: number}|Function} settings Animation settings or callback function
     * @param {Function} fn Callback function
     */
    static Animate(el, props, settings = { speed: 400, effect: `ease`, delay: 0 }, fn = null) {
        setTimeout(function () {
            AnimateClass.start(el, props, settings, fn);
        }, 10);
    }

    /**
     * @param {HTMLElement} el
     * @param {CSSStyleDeclaration} props
     * @param {{speed: number, effect: string, delay: number}} settings
     * @param {Function} fn
     */
    static start(el, props, settings, fn) {
        // Si no hay elemento o propiedades

        if (!el || !props) {
            throw new Error(`[MoEffect#Animate] HTML ELement or props not providers`);
        }

        // Comprobamos que no se esté animando

        if (!el.hasAttribute(`aw-poly-animate`)) {
            el.setAttribute(`aw-poly-animate`, el.style.transition);
        }

        // Ajustamos los argumentos de la función

        if (typeof settings === `function`) {
            fn = settings;
            settings = { speed: 400, effect: `ease` };
        }

        // Ponemos la fecha actual

        const now = Date.now();
        el.setAttribute(`aw-poly-animate-now`, now);

        // Ajustamos la configuración

        settings = AnimateClass.setSettings(settings);

        // Creamos la nueva transicino

        const newTrans = AnimateClass.setTransition(props, settings);
        el.style.transition = newTrans;

        // Animamos el objeto

        setTimeout(function () {
            for (const prop in props) {
                if (props.hasOwnProperty(prop)) {
                    el.style[prop] = props[prop];
                }
            }
        }, 10);

        // Ejecutamos el final de la transición

        AnimateClass.finishAnimation(el, settings.speed, fn, now);
    }

    /**
     * @param {HTMLElement} el
     * @param {number} speed
     * @param {Function} fn
     * @param {number} now
     */
    static finishAnimation(el, speed, fn, now) {
        setTimeout(function () {
            const nowAttr = el.getAttribute(`aw-poly-animate-now`);
            if (now.toString() === nowAttr) {
                const styleTrans = el.getAttribute(`aw-poly-animate`);

                el.removeAttribute(`aw-poly-animate`);
                el.removeAttribute(`aw-poly-animate-now`);
                el.style.transition = styleTrans || ``;

                if (typeof fn === `function`) {
                    fn.call(this);
                }
            }
        }, speed + 5);
    }

    /**
     * @param {{speed: number, effect: string, delay: number}} settings
     * @returns {{speed: number, effect: string, delay: number}}
     */
    static setSettings(settings) {
        return {
            speed: settings.speed || 400,
            effect: settings.effect || `ease`,
            delay: settings.delay || 0,
        };
    }

    /**
     * @param {CSSStyleDeclaration} props
     * @param {{speed: number, effect: string, delay: number}} settings
     * @returns {string}
     */
    static setTransition(props, settings) {
        let newTrans = ``;
        for (const prop in props) {
            if (props.hasOwnProperty(prop)) {
                if (newTrans === ``) {
                    newTrans = `${prop} ${settings.speed / 1000}s ${settings.effect} ${settings.delay / 1000}s`;
                } else {
                    newTrans = `, ${prop} ${settings.speed / 1000}s ${settings.effect} ${settings.delay / 1000}s`;
                }
            }
        }
        return newTrans;
    }
}

export default AnimateClass.Animate;
