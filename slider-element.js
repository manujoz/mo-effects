const MoSliderElement = {
    defaults() {
        return {
            headFixHeight: 0,
            footerFixHeight: 0,
            minWidth: null,
            marginStart: 20,
        };
    },

    _extend(objs) {
        let newObj = {};

        for (let i = 0; i < objs.length; i++) {
            for (let prop in objs[i]) {
                newObj[prop] = objs[i][prop];
            }
        }

        return newObj;
    },

    /**
     * Put an element on sticky mode when scroll
     * @param {HTMLElement} el ELement that must be sticky
     * @param {{headFixHeight: number, footerFixHeight: number, minWidth: number, marginStart: number}} settings Settings of effect
     * @param {HTMLElement} mainSlider Element scrollable that must activate de effect, by default window
     */
    init(el, settings, mainSlider = window) {
        // Registramos el elemento
        MoSliderElement.register(el, settings, mainSlider);
    },

    register(el, settings, mainSlider) {
        if (el.hasAttribute(`aw-sliderElement`)) {
            return false;
        }

        el.setAttribute(`aw-sliderElement`, ``);

        let component = {
            element: el,
            elHeight: el.offsetHeight,
            elWidth: el.offsetWidth,
            contenedor: el.parentElement,
            settings: MoSliderElement._extend([MoSliderElement.defaults(), settings]),
            elStyle: null,
            topWinAnt: 0,
            scrollHandler: null,
        };

        // Si tiene estilos en linea los almacenamos

        if (component.element.getAttribute(`style`)) {
            component.elStyle = component.element.getAttribute(`style`);
        }

        // Ponemos a la escucha el componente

        component.scrollHandler = () => {
            MoSliderElement.scrolling(component, mainSlider);
        };

        MoSliderElement.scrolling(component, mainSlider);
        mainSlider.addEventListener(`scroll`, component.scrollHandler);
    },

    scrolling(component, mainSlider) {
        //  - - - - - - - - - - - - - - - - - - - -
        //	DESTUIMOS SI NO EXISTE
        //	- - - - - - - - - - - - - - - - - - - - //

        if (component.element.offsetHeight === 0) {
            MoSliderElement.destroy(component, mainSlider);
            return false;
        }

        //  - - - - - - - - - - - - - - - - - - - -
        //	REAJUSTAMOS LA ALTURA SI HA CAMBIADO
        //	- - - - - - - - - - - - - - - - - - - - //

        if (component.elHeight !== component.element.offsetHeight) {
            component.elHeight = component.element.offsetHeight;
        }

        //  - - - - - - - - - - - - - - - - - - - -
        //	VARIABLES DE CONTROL
        //	- - - - - - - - - - - - - - - - - - - - //

        const marginTop = component.settings.headFixHeight + component.settings.marginStart;
        const height = document.documentElement.clientHeight - marginTop - component.settings.footerFixHeight;
        const topWindow = mainSlider == window ? window.scrollY + marginTop : mainSlider.scrollTop + marginTop;
        const topContenedor =
            mainSlider == window
                ? window.scrollY + component.contenedor.getBoundingClientRect().top
                : mainSlider.scrollTop + component.contenedor.getBoundingClientRect().top;

        const contPaddingTop = parseInt(window.getComputedStyle(component.contenedor, ``).paddingTop.replace(`px`, ``));
        const contBorder =
            parseInt(window.getComputedStyle(component.contenedor, ``).borderTopWidth.replace(`px`, ``)) +
            parseInt(window.getComputedStyle(component.contenedor, ``).borderBottomWidth.replace(`px`, ``));

        //  - - - - - - - - - - - - - - - - - - - -
        //	SI CUMPLE LA CONDICIÓN
        //	- - - - - - - - - - - - - - - - - - - - //

        if (MoSliderElement.condition(component)) {
            //  Variables de cálculo
            //	. . . . . . . . . . . . . . . . . . . .

            let diferencia = null;
            let topeSup = 0;
            let topeInf = 0;
            let topElement = 0;

            //  Si la ventana es mayor al elemento
            //	. . . . . . . . . . . . . . . . . . . .

            if (height > component.elHeight) {
                topeSup = topContenedor + contPaddingTop;
                topeInf = topeSup + component.contenedor.offsetHeight - component.elHeight - contPaddingTop;

                // Si baja el scroll

                if (MoSliderElement.getDirection(component, mainSlider) === `baja`) {
                    // Ponemos en fixed

                    if (topWindow > topeSup && component.element.style.position !== `fixed`) {
                        component.element.style.position = `fixed`;
                        component.element.style.top = marginTop + `px`;
                        component.element.style.width = MoSliderElement.getWidth(component) + `px`;
                    }

                    // Fijamos abajo

                    if (topWindow > topeInf && component.element.style.position === `fixed`) {
                        component.element.style.position = `absolute`;
                        component.element.style.top = topeInf - topeSup + contPaddingTop - contBorder + `px`;
                        component.element.style.width = MoSliderElement.getWidth(component) + `px`;
                    }
                }

                // Si sube el scroll

                if (MoSliderElement.getDirection(component, mainSlider) === `sube`) {
                    // Ponemos el elemento en su posición inical

                    if (topWindow <= topeSup && component.element.style.position !== `relative`) {
                        MoSliderElement.resetElement(component);
                    }

                    // Ponemos fijo al subir

                    if (topWindow <= topeInf && component.element.style.position === `absolute`) {
                        component.element.style.position = `fixed`;
                        component.element.style.top = marginTop + `px`;
                        component.element.style.width = MoSliderElement.getWidth(component) + `px`;
                    }
                }
            }

            //  Si la ventana es menor al elemento
            //	. . . . . . . . . . . . . . . . . . . .

            if (height < component.elHeight) {
                diferencia = component.elHeight - height;
                topeSup = topContenedor + diferencia + component.settings.marginStart;
                topeInf = topeSup + component.contenedor.offsetHeight - component.elHeight;
                topElement = MoSliderElement.getTop(component);

                // Si baja el scroll

                if (MoSliderElement.getDirection(component, mainSlider) === `baja`) {
                    // Ponemos absolute

                    if (topElement === marginTop && component.element.style.position === `fixed`) {
                        component.element.style.position = `absolute`;
                        component.element.style.top = topWindow - topContenedor + `px`;
                        component.element.style.width = MoSliderElement.getWidth(component) + `px`;
                    }

                    // Ponemos fixed

                    if (
                        topWindow > topeSup + contPaddingTop + MoSliderElement.getTop(component) &&
                        component.element.style.position !== `fixed`
                    ) {
                        component.element.style.position = `fixed`;
                        component.element.style.top = marginTop - diferencia - component.settings.marginStart + `px`;
                        component.element.style.width = MoSliderElement.getWidth(component) + `px`;
                    }

                    // Fijamos abajo el elemento

                    if (topWindow > topeInf - contPaddingTop && component.element.style.position === `fixed`) {
                        component.element.style.position = `absolute`;
                        component.element.style.top = topeInf - topeSup - contPaddingTop - contBorder + `px`;
                        component.element.style.width = MoSliderElement.getWidth(component) + `px`;
                    }
                }

                // Si sube el scroll

                if (MoSliderElement.getDirection(component, mainSlider) === `sube`) {
                    // Ponemos en absolute

                    if (topElement !== marginTop && component.element.style.position === `fixed`) {
                        component.element.style.position = `absolute`;
                        component.element.style.top = topWindow - topContenedor - diferencia + `px`;
                        component.element.style.width = MoSliderElement.getWidth(component) + `px`;
                    }

                    // Ponemos fijo el elemento

                    if (topWindow < topContenedor + topElement && component.element.style.position === `absolute`) {
                        component.element.style.position = `fixed`;
                        component.element.style.top = marginTop + `px`;
                        component.element.style.width = MoSliderElement.getWidth(component) + `px`;
                    }

                    // Ponemos el elemento en su posción inicial

                    if (topWindow < topContenedor + contPaddingTop && component.element.style.position !== `relative`) {
                        MoSliderElement.resetElement(component);
                    }
                }
            }
        }

        //  - - - - - - - - - - - - - - - - - - - -
        //	SI NO CUMPLE LA CONDICIÓN
        //	- - - - - - - - - - - - - - - - - - - - //

        if (!MoSliderElement.condition(component)) {
            MoSliderElement.resetElement(component);
        }

        // Ponemos el top anterior

        component.topWinAnt = topWindow;
    },

    condition(component) {
        // Si no cumple el ancho mínimo

        if (component.settings.minWidth && component.settings.minWidth > document.documentElement.clientWidth) {
            return false;
        }

        // Si el contenedor no es mayor al alto del elemento

        if (component.contenedor.offsetHeight <= component.elHeight) {
            return false;
        }

        // Si cumple condiciones devolvemos true

        return true;
    },

    getTop(component) {
        let { top } = window.getComputedStyle(component.element, ``);

        if (top === `auto`) {
            top = 0;
        } else {
            top = parseInt(top.replace(`px`, ``));
        }

        return top;
    },

    getWidth(component) {
        // const paddingLeft = parseInt(window.getComputedStyle(component.element, ``).paddingLeft.replace(`px`, ``));
        // const paddingRight = parseInt(window.getComputedStyle(component.element, ``).paddingRight.replace(`px`, ``));
        // const marginLeft = parseInt(window.getComputedStyle(component.element, ``).marginLeft.replace(`px`, ``));
        // const marginRight = parseInt(window.getComputedStyle(component.element, ``).marginRight.replace(`px`, ``));
        // const borderLeft = parseInt(window.getComputedStyle(component.element, ``).borderLeftWidth.replace(`px`, ``));
        // const borderRight = parseInt(window.getComputedStyle(component.element, ``).borderRightWidth.replace(`px`, ``));
        // let resta = paddingLeft + paddingRight + marginLeft + marginRight + borderLeft + borderRight;
        //return component.contenedor.offsetWidth - resta;

        return component.elWidth;
    },

    getDirection(component, mainSlider) {
        let scrollTop = window == mainSlider ? window.scrollY : mainSlider.scrollTop;
        let topWindow = scrollTop + component.settings.headFixHeight + component.settings.marginStart;

        if (component.topWinAnt < topWindow) {
            return `baja`;
        } else {
            return `sube`;
        }
    },

    resetElement(component) {
        if (component.elStyle) {
            component.element.setAttribute(`style`, component.elStyle);
        } else {
            component.element.removeAttribute(`style`);
        }
    },

    destroy(component, mainSlider) {
        mainSlider.removeEventListener(`scroll`, component.scrollHandler);
        return false;
    },
};

export default MoSliderElement.init;
