/* eslint-disable no-console */
const MoSortable = {
    /**
     * SET ELEMENTS
     *
     * Asigna las propiedades de la clase como si fuera el constructor()
     *
     */
    _setElements() {
        this.elSort = null;
        this.childrens = [];
        this.elDragged = null;
        this.tagNames = null;
        this.callback = null;

        this.funcDragStart = (ev) => {
            this._dragStart(ev);
        };

        this.funcDragOver = (ev) => {
            ev.preventDefault();

            this._dragOver(ev);
        };

        this.funcDragEnd = (ev) => {
            ev.preventDefault();

            this._dragEnd(ev);
        };

        this._upload = () => {
            let allowed = this._setChildrens();

            if (!allowed) {
                console.warn(
                    `[MoEffects.sortable] No se pueden ordenar hijos directos diferentes dentro de un elemento ordenable.`
                );

                for (let i = 0; i < this.childrens.length; i++) {
                    this.childrens[i].removeAttribute(`draggable`);
                    this.childrens[i].style.cursor = ``;
                }
            }
        };

        this._unlistener = () => {
            setTimeout(() => {
                if (!document.body.contains(this.elSort)) {
                    this.elSort.removeEventListener(`dragstart`, this.funcDragStart);
                    this.elSort.removeEventListener(`dragover`, this.funcDragOver);
                    this.elSort.removeEventListener(`drop`, this.funcDragEnd);
                    document.removeEventListener(`DOMNodeInserted`, this._upload);
                    document.removeEventListener(`DOMNodeRemoved`, this._unlistener);
                }
            }, 0);
        };
    },

    /**
     * Convert element in sortable
     *
     * @param {HTMLElement} elSort ELement must be sortable
     * @param {Object} options Settings effect
     * @param {function} callback Callback drop function
     */
    init(elSort, options, callback) {
        this._setElements();

        if (!elSort) {
            console.warn(`[MoEffects.sortable] No se ha recibido ningún elemento para ordenar`);
            return false;
        }

        this.elSort = elSort;

        let allowed = this._setChildrens();

        if (allowed) {
            this.elSort.addEventListener(`dragstart`, this.funcDragStart);
            this.elSort.addEventListener(`dragover`, this.funcDragOver);
            this.elSort.addEventListener(`drop`, this.funcDragEnd);

            if (typeof options === `function`) {
                this.callback = options;
            } else if (typeof callback === `function`) {
                this.callback = callback;
            }

            this._uploadEls();
            this._disconnect();
        }

        if (!allowed) {
            console.warn(
                `[MoEffects.sortable] No se pueden ordenar hijos directos diferentes dentro de un elemento ordenable.`
            );

            for (let i = 0; i < this.childrens.length; i++) {
                this.childrens[i].removeAttribute(`draggable`);
                this.childrens[i].style.cursor = ``;
            }
        }
    },

    /**
     * SET CHILDRENS
     *
     * Asigna los hijos del elemento ordenable
     */
    _setChildrens() {
        let allowed = true;
        this.childrens = this.elSort.children;
        for (let i = 0; i < this.childrens.length; i++) {
            this.childrens[i].setAttribute(`draggable`, `true`);
            this.childrens[i].style.cursor = `move`;

            if (!this.tagNames) {
                this.tagNames = this.childrens[i].tagName;
            } else if (this.tagNames !== this.childrens[i].tagName) {
                allowed = false;
            }
        }

        return allowed;
    },

    /**
     * DRAG STAR
     *
     * Método que es invocado cuando se empieza a arrastrar un elemento
     *
     * @param    {event}             ev              Evento devuelto por dragstart
     */
    _dragStart(ev) {
        let { target } = ev;

        while (!target.hasAttribute(`draggable`)) {
            target = target.parentElement;
        }

        this.elDragged = target;

        ev.dataTransfer.effectAllowed = `move`;
        ev.dataTransfer.setData(`text`, target.tagName);
    },

    /**
     * DRAG OVER
     *
     * Método que es invocado cuando se arrastra el elemento sobre otro
     *
     * @param    {event}             ev              Evento devuelto por dragstart
     */
    _dragOver(ev) {
        ev.dataTransfer.dropEffect = `move`;

        let { target } = ev;
        while (target && !target.hasAttribute(`draggable`)) {
            target = target.parentElement;

            if (target === this.elSort) {
                return false;
            }
        }

        if (target && target !== this.elSort && target !== this.elDragged && target.tagName === this.tagNames) {
            if (target.nextElementSibling && target.nextElementSibling === this.elDragged) {
                this.elSort.insertBefore(this.elDragged, target);
            } else if (target.nextElementSibling) {
                this.elSort.insertBefore(this.elDragged, target.nextElementSibling);
            } else {
                this.elSort.appendChild(this.elDragged);
            }
        }
    },

    /**
     * DRAG END
     *
     * Método que es invocado cuando se finaliza el arrastre
     *
     * @param    {event}             ev              Evento devuelto por dragstart
     */
    _dragEnd() {
        if (this.callback) {
            let childrens = this.elSort.children;
            this.callback(this.elDragged, childrens, this.elSort);
        }
    },

    _uploadEls() {
        document.addEventListener(`DOMNodeInserted`, this._upload);
    },

    /**
     * DISCONNECT
     *
     * Método que desconecta los listeners cuando desaparece el elemento ordenable
     */
    _disconnect() {
        document.addEventListener(`DOMNodeRemoved`, this._unlistener);
    },
};

export default MoSortable.init;
