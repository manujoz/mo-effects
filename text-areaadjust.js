const MoTextareaAdjust = {
    defaults() {
        return {
            defHeight: null,
            height: null,
            padding: null,
            maxHeight: null,
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
     * Text area autosizeble
     *
     * @param {HTMLElement} el Text area to apply auto size
     * @param {{defHeight: number, height: number, padding: number, maxHeight: number}} settings Settings of effect
     */
    init(el, settings) {
        // Registramos el textarea

        this.register(el, settings);
    },

    register(el, settings) {
        // Configuramos el elemento

        let element = {
            textarea: el,
            settings: this._extend([this.defaults(), settings]),
            eventHandler: null,
            eventRemove: null,
        };

        // Obtenemos datos de dimensiones

        element.settings.defHeight = window.getComputedStyle(element.textarea, null).height;
        element.settings.height = element.textarea.offsetHeight;
        element.settings.padding = this.getPadding(element.textarea);

        // Asignamos estilos específicos

        element.textarea.style.overflow = `hidden`;
        element.textarea.style.transition = `none`;

        // Ponemos a la escucha el elemento

        element.eventHandler = () => {
            this.adaptar(element);
        };

        element.eventRemove = (ev) => {
            this._remove(element, ev);
        };

        element.textarea.addEventListener(`keyup`, element.eventHandler);
        element.textarea.addEventListener(`focus`, element.eventHandler);

        // Comprobamos si es aw-textarea y añadimos evento de desconexión

        let awTextarea = null;
        if (
            element.textarea.parentElement.tagName == `LABEL` &&
            element.textarea.parentElement.parentElement.id == `container` &&
            element.textarea.parentElement.parentElement.classList.contains(`container`) &&
            !element.textarea.parentElement.parentElement.parentElement
        ) {
            if (element.textarea.id) {
                if (document.querySelector(`aw-textarea-df[id=` + element.textarea.id + `]`)) {
                    awTextarea = document.querySelector(`aw-textarea-df[id=` + element.textarea.id + `]`);
                } else {
                    awTextarea = document.querySelector(`aw-textarea[id=` + element.textarea.id + `]`);
                }
            } else if (element.textarea.name) {
                if (document.querySelector(`aw-textarea-df[name=` + element.textarea.name + `]`)) {
                    awTextarea = document.querySelector(`aw-textarea-df[name=` + element.textarea.name + `]`);
                } else {
                    awTextarea = document.querySelector(`aw-textarea[name=` + element.textarea.name + `]`);
                }
            }

            if (awTextarea) {
                awTextarea.addEventListener(`DOMNodeRemoved`, element.eventRemove);
            }
        } else {
            element.textarea.addEventListener(`DOMNodeRemoved`, element.eventRemove);
        }

        if (element.textarea.value) {
            setTimeout(() => {
                this.adaptar(element, true);
            }, 100);
        }
    },

    adaptar(element, load = false) {
        const { textarea } = element;

        // Damos altura si es cero

        if (element.settings.height === 0) {
            element.settings.height = element.textarea.offsetHeight;
        }

        // Si el textarea esta vacío devolvemos false

        if (!textarea.value) {
            textarea.style.height = element.settings.defHeight;
            return false;
        }

        // Remplazamos los saltos de linea del texto

        let texto = textarea.value;
        texto = texto.replace(new RegExp(`\n`, `g`), `<br/>`);

        // Tratamos como vacío si solo hay un salto de línea

        if (texto === `<br/>`) {
            textarea.value = ``;
            textarea.style.height = element.settings.height + `px`;
            return false;
        }

        // Cogemos los últimos cinco caracteres

        let ultChar = texto.substr(texto.length - 5, texto.length);

        // Ajustamos los valores del textarea

        if (texto === `<br/>`) {
            textarea.value = ``;
        } else if (ultChar !== `<br/>`) {
            textarea.value = textarea.value + `\n`;
            this.rango(textarea, textarea.value.length - 1);
        }

        if (load) {
            textarea.blur();
        }

        // Parametros del textarea

        let altoInicial = element.settings.height;
        let { padding } = element.settings;
        let altoExt = textarea.offsetHeight;
        let altoInt = textarea.scrollHeight - padding / 2;

        if (altoInt > altoExt) {
            if (element.settings.maxHeight && altoInt > element.settings.maxHeight) {
                textarea.style.overflow = `auto`;
                textarea.style.height = element.settings.maxHeight + `px`;
            } else {
                textarea.style.overflow = `hidden`;
                textarea.style.height = altoInt + `px`;
            }
        } else if (altoExt > altoInicial) {
            if (element.settings.maxHeight && altoInt < element.settings.maxHeight) {
                textarea.style.overflow = `hidden`;
            }
            textarea.style.height = altoInicial + `px`;

            altoInt = textarea.scrollHeight - padding / 2;
            textarea.style.height = altoInt + `px`;
        }
    },

    getPadding(textarea) {
        const paddingTop = parseInt(window.getComputedStyle(textarea, ``).paddingTop.replace(`px`, ``));
        const paddingBottom = parseInt(window.getComputedStyle(textarea, ``).paddingBottom.replace(`px`, ``));

        return paddingTop + paddingBottom;
    },

    rango(textarea, start, end) {
        if (!end) {
            end = start;
        }

        if (textarea.setSelectionRange) {
            textarea.focus();
            textarea.setSelectionRange(start, end);
        } else if (textarea.createTextRange) {
            let range = textarea.createTextRange();
            range.collapse(!0);
            range.moveEnd(`character`, end);
            range.moveStart(`character`, start);
            range.select();
        }
    },

    _remove(element, ev) {
        element.textarea.removeEventListener(`keyup`, element.eventHandler);
        element.textarea.removeEventListener(`focus`, element.eventHandler);
        ev.target.removeEventListener(`DOMNodeRemoved`, element.eventRemove);
    },
};

export default MoTextareaAdjust.init;
