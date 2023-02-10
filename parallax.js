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
 * 		bgColor:	(cssColor)				=>	Para los fondos el color de fondo que queremos.
 * }
 *
 * Ej.: Polymer.Parallax( el, { property: "background", direction: "up", speed: 6 });
 */
const MoParallax = {
    /**
     * @method	init
     *
     * Inicia el efecto Parallax en algún elemento o fondo de la página.
     *
     * @param	{HTMLElement} el			El elemento sobre el que se va a realizar el efecto Parallax.
     * @param 	{{property: "background"|"element", direction: "down"|"up", speed: number, bgColor: string}} settings Configuración del efecto
     */
    init(el, settings = null) {
        // Ajsutamos compatibilidad con versión anterior.

        settings = MoParallax._compatibilty(settings);

        // Extenemdos la configuración por defecto

        settings = MoParallax._extends([MoParallax._defaults(), settings]);

        // Asignamos los límites

        settings = MoParallax._setToppers(el, settings);

        // Si la animación es sobre el fondo, se prepara la capa.

        if (settings.property == `background`) {
            settings.direction = `down`;
            let bgPrep = MoParallax._prepareBackground(el, settings);
            el = bgPrep.el;
            settings = bgPrep.settings;
        }

        // Registra el componente

        MoParallax._register(el, settings);
    },

    /**
     * @method	_compatibilty
     *
     * Crea compatibilidad con la versión anterior del efecto Parallax adaptando las antiguas propiedades
     * a las nuevas establecidas en esta versión.
     *
     * @param	{object}	settings	Configuración asignada al declarar el efecto.
     */
    _compatibilty(settings) {
        if (!settings) {
            return null;
        }

        let newSettings = {};

        // Si tiene cssProperty

        if (settings.cssProperty) {
            if (settings.cssProperty == `background-position`) {
                newSettings.property = `background`;
            } else {
                newSettings.property = `element`;
            }
        }

        // Si tiene parallaxDir

        if (settings.parallaxDir) {
            newSettings.direction = settings.parallaxDir;
        }

        // Si tiene topLimit

        if (settings.topLimit || settings.topEnd) {
            newSettings.topEnd = null;
        }

        // Asignamos valores correctos si vienen

        if (settings.property) {
            newSettings.property = settings.property;
        }
        if (settings.direction) {
            newSettings.direction = settings.direction;
        }
        if (settings.speed) {
            newSettings.speed = settings.speed;
        }
        if (settings.topStart) {
            newSettings.topStart = null;
        }
        if (settings.topEnd) {
            newSettings.topEnd = settings.topEnd;
        }
        if (settings.bgColor) {
            newSettings.bgColor = settings.bgColor;
        }

        return newSettings;
    },

    /**
     * @method	_defaults
     *
     * Establece los valores por defecto de la clase Parallax por si no se han establecido
     * al declararlos, se obtendrán estos valores.
     *
     * **property**		=> 	La propiedad sobre la que se va a realizar el efecto (background|element),
     * 						si nos referimos a una imagen de fondo o a un elemento HTML simple.
     * **direction**	=>	La dirección que tomará el efecto (down,up,left,rigth).
     * **speed**		=>	La velocidad del efecto.
     * **topStart**		=>	El top del scroll donde empezará el efecto.
     * **topEnd**		=>	El top del scroll donde terminará el efecto.
     * **initialTop**	=>	El top donde el componente empieza movimiento con respecto a la pantalla
     */
    _defaults() {
        return {
            property: `background`,
            direction: `down`,
            speed: 5,
            bgColor: `transparent`,
            topStart: null,
            topEnd: null,
            initialTop: 0,
        };
    },

    /**
     * @method	_extends
     *
     * Se asigna la configuración por defecto en caso de que ésta no venga dada al declarar el efecto.
     *
     * @param	{array}	objs	Array con la configuración por defecto y la asignada al declarar el efecto.
     */
    _extends(objs) {
        let newObj = {};

        for (let i = 0; i < objs.length; i++) {
            for (let prop in objs[i]) {
                newObj[prop] = objs[i][prop];
            }
        }

        return newObj;
    },

    /**
     * @method	_prepareBackground
     *
     * Prepara la capa para la animación sobre el fondo de un elemento.
     *
     * @param	{object}	el		Elemento sobre el que se va a realizar el efecto Parallax.
     */
    _prepareBackground(el, settings) {
        // Obtemnemos los estilos computados de los elementos.

        let compStyles = window.getComputedStyle(el, null);

        let image = compStyles.getPropertyValue(`background-image`);
        let position = compStyles.getPropertyValue(`background-position`);
        let repeat = compStyles.getPropertyValue(`background-repeat`);
        let size = compStyles.getPropertyValue(`background-size`);
        let attachment = compStyles.getPropertyValue(`background-attachment`);

        // Ajustamos los tamaños

        let adjusts = {
            top: 0,
            left: 0,
            width: `100%`,
            height: `100%`,
        };

        if (el.offsetHeight < window.innerHeight / 2) {
            // Ajustamos la posición y el tamaño nuevos.

            let percent = 100 - (el.offsetHeight * 100) / (window.innerHeight / 2) + 10;
            adjusts.top = `-` + percent / 2 + `%`;
            adjusts.left = `-` + percent / 2 + `%`;
            adjusts.width = 100 + percent + `%`;
            adjusts.height = 100 + percent + `%`;

            // Ajustamos el nuevo initialTop

            settings.initialTop -= ((percent * el.offsetHeight) / 100) * 2;
        }

        // Creamos un nuevo elemento con los estilos computados.

        let div = document.createElement(`DIV`);
        div.style.position = `absolute`;
        div.style.top = adjusts.top;
        div.style.left = adjusts.left;
        div.style.width = adjusts.width;
        div.style.height = adjusts.height;
        div.style.backgroundImage = image ? image : ``;
        div.style.backgroundPosition = position ? position : ``;
        div.style.backgroundRepeat = repeat ? repeat : ``;
        div.style.backgroundSize = size ? size : ``;
        div.style.backgroundAttachment = attachment ? attachment : ``;

        // Itroducimos el nuevo elemento.

        if (el.children[0]) {
            el.insertBefore(div, el.children[0]);
        } else {
            el.append(div);
        }

        // Eliminamos los estilos computados del elemento original.

        el.style.background = settings.bgColor;
        el.style.overflow = `hidden`;

        // Devolvemos el elemnto que vamos a animar

        return {
            el: div,
            settings: settings,
        };
    },

    /**
     * @method	_setToppers
     *
     * Asigna los límites en los que se va a realizar el efecto
     */
    _setToppers(el, settings) {
        // Calculamos el topStart y el initialTop

        if (!settings.topStart) {
            settings.topStart = 0;

            if (settings.property == `background`) {
                let diff = 0;
                if (el.getBoundingClientRect().top + window.scrollY > window.innerHeight) {
                    settings.topStart = el.getBoundingClientRect().top + window.scrollY - window.innerHeight;
                    diff = el.getBoundingClientRect().top + window.scrollY - window.innerHeight;
                }

                if (el.getBoundingClientRect().top + window.scrollY > 0) {
                    settings.initialTop = el.getBoundingClientRect().top + window.scrollY - diff;
                }
            } else {
                let diff = 0;
                let parent = el.parentElement;
                if (parent.getBoundingClientRect().top + window.scrollY > window.innerHeight) {
                    settings.topStart = parent.getBoundingClientRect().top + window.scrollY - window.innerHeight;
                    if (settings.direction == `down`) {
                        diff = parent.getBoundingClientRect().top + window.scrollY - window.innerHeight;
                    } else {
                        diff = parent.getBoundingClientRect().top + window.scrollY - window.innerHeight - 126;
                    }
                }

                if (parent.getBoundingClientRect().top + window.scrollY > 0) {
                    if (settings.direction == `down`) {
                        settings.initialTop = parent.getBoundingClientRect().top + window.scrollY - diff;
                    } else {
                        settings.initialTop = parent.getBoundingClientRect().top + window.scrollY + diff;
                    }
                }
            }
        }

        // Calculamos el topEnd

        if (!settings.topEnd) {
            if (settings.property == `background`) {
                settings.topEnd = el.getBoundingClientRect().top + window.scrollY + el.offsetHeight;
            } else {
                settings.topEnd =
                    el.parentElement.getBoundingClientRect().top + window.scrollY + el.parentElement.offsetHeight;
            }
        }

        return settings;
    },

    /**
     * @method	_register
     *
     * Registra el elemento y su configuración para realizar el efecto Parallax.
     *
     * @param	{object}	el			El elemento sobre el que se va a realizar el efecto Parallax.
     * @param 	{object}	settings	La configuración que tendrá el efecto, será un objeto con las
     * 									mismas propiedades que _defaults().
     */
    _register(el, settings) {
        // Se comprueba si tiene el atributo aw-parallax, si es el caso se detiene, de lo contrario se asigna.

        if (el.hasAttribute(`aw-parallax`)) {
            return false;
        } else {
            el.setAttribute(`aw-parallax`, ``);
        }

        // Creamos el componente a registrar.

        let component = {
            el: el,
            settings: settings,
            animated: false,
            scrollHandler: null,
        };

        // Si el navegador permite el evento "onscroll" animamos.

        if (`onscroll` in document.documentElement) {
            component.scrollHandler = () => {
                MoParallax._scrolling(component);
            };

            MoParallax._reset(component);
            MoParallax._scrolling(component);
            window.addEventListener(`scroll`, component.scrollHandler);
        }
    },

    /**
     * @method	_scrolling
     *
     * Realiza el efecto al hacer scroll en la ventana.
     *
     * @param	{object}	component	Componente registrado sobre el que se aplica el efecto Parallax.
     */
    _scrolling(component) {
        // Detenemos el listener si ya no existe el elemento

        if (!document.body.contains(component.el)) {
            MoParallax._destroy(component);
            return false;
        }

        // Reseteamos la animación si llega al tope

        if (window.scrollY <= component.settings.topStart) {
            if (component.animated) {
                MoParallax._reset(component);
            }
            return false;
        }

        // Detenemos la función si hay topEnd y supera el scrollY

        if (component.settings.topEnd && window.scrollY > component.settings.topEnd) {
            return false;
        }

        // Marcamos el componente como animado

        component.animated = true;

        // Animamos el componente

        window.requestAnimationFrame(() => {
            MoParallax._animate(component);
        });
    },

    /**
     * @method	_animate
     *
     * Anima el componente cuando se hace scroll.
     *
     * @param	{object}	component	Componente registrado sobre el que se aplica el efecto Parallax.
     */
    _animate(component) {
        if (component.settings.direction == `down`) {
            component.el.style.transform =
                `translateY(` +
                (window.scrollY - component.settings.initialTop - component.settings.topStart) /
                    component.settings.speed +
                `px)`;
        }

        if (component.settings.direction == `up`) {
            component.el.style.transform =
                `translateY(` +
                -(
                    (window.scrollY - component.settings.initialTop - component.settings.topStart) /
                    component.settings.speed
                ) +
                `px)`;
        }
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
        if (component.settings.direction == `down`) {
            component.el.style.transform =
                `translateY(` +
                (component.settings.topStart - component.settings.initialTop) / component.settings.speed +
                `px)`;
        } else {
            component.el.style.transform =
                `translateY(` +
                (component.settings.topStart + component.settings.initialTop) / component.settings.speed +
                `px)`;
        }
    },

    /**
     * @method	_destroy
     *
     * Destruye el listeners si el componente no se encuentra en el documento.
     *
     * @param	{object}	component	Componente que se va a destruir del listener.
     */
    _destroy(component) {
        window.removeEventListener(`scroll`, component.scrollHandler);
        return false;
    },
};

export default MoParallax.init;
