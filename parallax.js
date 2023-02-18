/* eslint-disable prefer-destructuring */
/**
 * @effect	Parallax
 *
 * Crea un efecto de paralaje sobre fondos o elementos de manera sencilla a través de Polymer.
 * Para realizar este efecto, tan solo tenemos que llamar a **Polymer.Parallax** y pasarle el
 * elemento sobre el que queremos aplicar el efecto Parallax y una sencilla configuración básica.
 *
 * Esta versión del efecto Parallax está optimizada para que funcione en todos los dispositivos ya
 * que utiliza la transformación CSS y en ningún caso crea efectos sobre propiedades CSS que modifiquen
 * el dibujo de la página en el navegador.
 *
 * @param	{HTMLObject}	el			Elemento HTML sobre el que queremos aplicar el efecto.
 * @param	{object}		settings	Configuración del efecto Parallax que queremos dar.
 *
 * settings {
 * 		property: 	(background|element)	=>	Inidica si queremos el efecto sobre un fondo o un elemento.
 * 		direction:	(down|up)				=>	La dirección que queremos que tenga el efecto.
 * 		speed:		(1-20)					=>	La velocidad de movimiento del elemento respecto al scroll.
 * 		backgroundColor:	(cssColor)				=>	Para los fondos el color de fondo que queremos.
 * }
 *
 * Ej.: Polymer.Parallax( el, { property: "background", direction: "up", speed: 6 });
 */
/** @typedef {import("./types/parallax").MoParallaxSettings MoParallaxSettings */
/** @typedef {import("./types/parallax").MoParallaxInternalSettings MoParallaxInternalSettings */
/** @typedef {import("./types/parallax").MoParallaxComponent MoParallaxComponent */

const MoParallax = {
    /**
     * @method	init
     *
     * Inicia el efecto Parallax en algún elemento o fondo de la página.
     *
     * @param {HTMLElement} el Element over make parallax effect.
     * @param {MoParallaxSettings} settings Settings
     * @param {HTMLElement} elScrollable Element to listen scroll, default window
     */
    async init(el, settings = null, elScrollable = window) {
        // Check duplicate
        if (MoParallax._checkHasEffect(el) || document.documentElement.onscroll) {
            return;
        }

        // Extendemdos la configuración por defecto
        settings = !settings ? MoParallax._defaults() : { ...MoParallax._defaults(), ...settings };

        // If property is background, set control attribute to element
        if (settings.property === `background`) {
            el.setAttribute(`mo-parallax`, ``);
        }

        // Set speed
        settings = MoParallax._setSpeed(settings);

        // Asignamos los límites
        settings = MoParallax._setRealTop(el, settings);

        // Si la animación es sobre el fondo, se prepara la capa.
        if (settings.property == `background`) {
            const bgPrep = await MoParallax._prepareBackground(el, settings);
            el = bgPrep.el;
            settings = bgPrep.settings;
        }

        // Registra el componente

        MoParallax._register(el, settings, elScrollable);
    },

    /**
     * @method	_animate
     *
     * Anima el componente cuando se hace scroll.
     *
     * @param	{MoParallaxComponent}	component	Componente registrado sobre el que se aplica el efecto Parallax.
     */
    _animate(component, elScrollable) {
        const parent = component.el.parentNode ?? component.el.host;
        const scrollTop = elScrollable === window ? window.scrollY : elScrollable.scrollTop;

        if (component.settings.direction == `down`) {
            let top = 0;
            let parentTop = parent.getBoundingClientRect().top;
            if (component.settings.realTop > window.innerHeight) {
                top = ((parentTop + parent.offsetHeight - window.innerHeight) * -1) / component.settings.speed;
            } else {
                top = scrollTop / component.settings.speed;
            }
            component.el.style.transform = `translateY(${top}px)`;
        }

        if (component.settings.direction == `up`) {
            let top = 0;

            let parentTop = parent.getBoundingClientRect().top;
            if (component.settings.realTop > window.innerHeight) {
                top = (parentTop + parent.offsetHeight - window.innerHeight) / component.settings.speed;
            } else {
                top = (scrollTop * -1) / component.settings.speed;
            }
            component.el.style.transform = `translateY(${top}px)`;
        }
    },

    /**
     *
     * @param {HTMLElement} el
     */
    _checkHasEffect(el) {
        if (el.hasAttribute(`mo-parallax`)) {
            return true;
        }

        return false;
    },

    /**
     * @method	_defaults
     *
     * Establece los valores por defecto de la clase Parallax por si no se han establecido
     * al declararlos, se obtendrán estos valores.
     *
     * @returns {MoParallaxInternalSettings}
     */
    _defaults() {
        return {
            property: `background`,
            direction: `down`,
            speed: 13,
            backgroundColor: `transparent`,
            realTop: 0,
        };
    },

    /**
     * @method	_destroy
     *
     * Destruye el listeners si el componente no se encuentra en el documento.
     *
     * @param {MoParallaxComponent}	component Componente que se va a destruir del listener.
     * @param {HTMLElement} elScrollable
     */
    _destroy(component, elScrollable) {
        elScrollable.removeEventListener(`scroll`, component.scrollHandler);
        return false;
    },

    /**
     *
     * @param {HTMLElement} el
     */
    _getParentBodyRef(el) {
        let parent = el.parentNode;

        while (!document.body.contains(parent)) {
            parent = parent.parentNode ?? parent.host;
        }

        return parent;
    },

    /**
     * @method	_prepareBackground
     *
     * Prepara la capa para la animación sobre el fondo de un elemento.
     *
     * @param {HTMLElement}	el		Elemento sobre el que se va a realizar el efecto Parallax.
     * @param {MoParallaxSettings} settings
     */
    _prepareBackground(el, settings) {
        return new Promise((resolve) => {
            // Obtemnemos los estilos computados de los elementos.
            const compStyles = window.getComputedStyle(el, null);

            const image = compStyles.getPropertyValue(`background-image`)?.split(`url("`)[1]?.split(`")`)[0];
            if (!image) {
                return;
            }

            // Eliminamos los estilos computados del elemento original.
            el.style.background = settings.backgroundColor;
            el.style.overflow = `hidden`;

            // Creamos la imagen
            const img = new Image();
            img.src = image;
            img.style.position = `absolute`;
            img.onload = () => {
                let w = parseInt(el.offsetWidth);
                let h = parseInt((w * img.naturalHeight) / img.naturalWidth);

                if (h < el.offsetHeight) {
                    h = parseInt(el.offsetHeight + 300);
                    w = parseInt((h * img.naturalWidth) / img.naturalHeight);
                }

                img.style.top = `${((h - el.offsetHeight) / 2) * -1}px`;
                img.style.left = `0px`;
                img.style.width = `${w}px`;
                img.style.height = `${h}px`;

                // Itroducimos el nuevo elemento.
                el.append(img);

                resolve({ el: img, settings: settings });
            };
        });
    },

    /**
     * @method	_register
     *
     * Registra el elemento y su configuración para realizar el efecto Parallax.
     *
     * @param {HTMLElement}	el Elemento sobre el que se va a realizar el efecto Parallax.
     * @param {MoParallaxSettings} settings
     * @param {HTMLElement} elScrollable
     */
    _register(el, settings, elScrollable) {
        // Se comprueba si tiene el atributo mo-parallax, si es el caso se detiene, de lo contrario se asigna.
        if (el.hasAttribute(`mo-parallax`)) {
            return false;
        } else {
            el.setAttribute(`mo-parallax`, ``);
        }

        // Set default translate
        el.style.transform = `translateY(0px)`;

        // Creamos el componente a registrar.

        let component = {
            el: el,
            parentBodyRef: MoParallax._getParentBodyRef(el),
            settings: settings,
            animated: false,
            scrollHandler: null,
        };

        component.scrollHandler = () => {
            MoParallax._scrolling(component, elScrollable);
        };

        // MoParallax._reset(component);
        MoParallax._scrolling(component, elScrollable);
        elScrollable.addEventListener(`scroll`, component.scrollHandler);
    },

    /**
     * @method	_reset
     *
     * Resetea el componente a sus valores por defecto.
     *
     * @param	{object}	component	Componente registrado sobre el que se aplica el efecto Parallax.
     */
    _reset(component) {
        component.animated = false;
        component.el.style.transform = `translateY(0px)`;
    },

    /**
     * Set speed of effect
     * @param {MoParallaxSettings} settings
     */
    _setSpeed(settings) {
        if (isNaN(settings.speed)) {
            settings.speed = 8;
        }
        let min = 1;
        let max = 15;
        if (settings.speed > max) {
            settings.speed = max;
        }

        if (settings.speed < min) {
            settings.speed = min;
        }

        max++;
        settings.speed = max - settings.speed;
        return settings;
    },

    /**
     * @param {HTMLElement} el
     */
    _getRealTop(el) {
        let top = el.offsetTop;
        /** @type {HTMLElement} */
        let parent = el.parentNode ?? el.host;

        while (parent) {
            if (!isNaN(parent.offsetTop)) {
                top += parent.offsetTop;
            }
            parent = parent.parentNode ?? parent.host;
        }

        return top;
    },

    /**
     * @param {HTMLElement}	el
     * @param {MoParallaxInternalSettings} settings
     */
    _setRealTop(el, settings) {
        settings.realTop = MoParallax._getRealTop(el);

        return settings;
    },

    /**
     * @method	_scrolling
     *
     * Realiza el efecto al hacer scroll en la ventana.
     *
     * @param	{MoParallaxComponent}	component	Componente registrado sobre el que se aplica el efecto Parallax.
     * @param {HTMLElement} elScrollable
     */
    _scrolling(component, elScrollable) {
        if (!elScrollable) {
            return;
        }
        // Detenemos el listener si ya no existe el elemento
        if (!document.body.contains(component.parentBodyRef)) {
            MoParallax._destroy(component, elScrollable);
            return;
        }

        // Detenemos la función si no es visible
        const parent = component.el.parentNode ?? component.el.host;
        const isVisible = parent.getBoundingClientRect().top < window.innerHeight;
        if (!isVisible) {
            return;
        }

        // Marcamos el componente como animado

        component.animated = true;

        // Animamos el componente

        window.requestAnimationFrame(() => {
            MoParallax._animate(component, elScrollable);
        });
    },
};

const init = MoParallax.init;
export default init;
