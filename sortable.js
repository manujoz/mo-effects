/* eslint-disable no-console */
const MoSortable = {
    /**
     * SET ELEMENTS
     *
     * Asigna las propiedades de la clase como si fuera el constructor()
     *
     */
    _setElements() {
        MoSortable.elSort = null;
        MoSortable.childrens = [];
        MoSortable.elDragged = null;
        MoSortable.tagNames = null;
        MoSortable.callback = null;

        MoSortable.funcDragStart = (ev) => {
            MoSortable._dragStart(ev);
        };

        MoSortable.funcDragOver = (ev) => {
            ev.preventDefault();

            MoSortable._dragOver(ev);
        };

        MoSortable.funcDragEnd = (ev) => {
            ev.preventDefault();

            MoSortable._dragEnd(ev);
        };

        MoSortable._upload = () => {
            let allowed = MoSortable._setChildrens();

            if (!allowed) {
                console.warn(
                    `[MoEffects.sortable] No se pueden ordenar hijos directos diferentes dentro de un elemento ordenable.`
                );

                for (let i = 0; i < MoSortable.childrens.length; i++) {
                    MoSortable.childrens[i].removeAttribute(`draggable`);
                    MoSortable.childrens[i].style.cursor = ``;
                }
            }
        };

        MoSortable._unlistener = () => {
            setTimeout(() => {
                if (!document.body.contains(MoSortable.elSort)) {
                    MoSortable.elSort.removeEventListener(`dragstart`, MoSortable.funcDragStart);
                    MoSortable.elSort.removeEventListener(`dragover`, MoSortable.funcDragOver);
                    MoSortable.elSort.removeEventListener(`drop`, MoSortable.funcDragEnd);
                    document.removeEventListener(`DOMNodeInserted`, MoSortable._upload);
                    document.removeEventListener(`DOMNodeRemoved`, MoSortable._unlistener);
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
        MoSortable._setElements();

        if (!elSort) {
            console.warn(`[MoEffects.sortable] No se ha recibido ningún elemento para ordenar`);
            return false;
        }

        MoSortable.elSort = elSort;

        let allowed = MoSortable._setChildrens();

        if (allowed) {
            MoSortable.elSort.addEventListener(`dragstart`, MoSortable.funcDragStart);
            MoSortable.elSort.addEventListener(`dragover`, MoSortable.funcDragOver);
            MoSortable.elSort.addEventListener(`drop`, MoSortable.funcDragEnd);

            if (typeof options === `function`) {
                MoSortable.callback = options;
            } else if (typeof callback === `function`) {
                MoSortable.callback = callback;
            }

            MoSortable._uploadEls();
            MoSortable._disconnect();
        }

        if (!allowed) {
            console.warn(
                `[MoEffects.sortable] No se pueden ordenar hijos directos diferentes dentro de un elemento ordenable.`
            );

            for (let i = 0; i < MoSortable.childrens.length; i++) {
                MoSortable.childrens[i].removeAttribute(`draggable`);
                MoSortable.childrens[i].style.cursor = ``;
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
        MoSortable.childrens = MoSortable.elSort.children;
        for (let i = 0; i < MoSortable.childrens.length; i++) {
            MoSortable.childrens[i].setAttribute(`draggable`, `true`);
            MoSortable.childrens[i].style.cursor = `move`;

            if (!MoSortable.tagNames) {
                MoSortable.tagNames = MoSortable.childrens[i].tagName;
            } else if (MoSortable.tagNames !== MoSortable.childrens[i].tagName) {
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

        MoSortable.elDragged = target;

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

            if (target === MoSortable.elSort) {
                return false;
            }
        }

        if (
            target &&
            target !== MoSortable.elSort &&
            target !== MoSortable.elDragged &&
            target.tagName === MoSortable.tagNames
        ) {
            if (target.nextElementSibling && target.nextElementSibling === MoSortable.elDragged) {
                MoSortable.elSort.insertBefore(MoSortable.elDragged, target);
            } else if (target.nextElementSibling) {
                MoSortable.elSort.insertBefore(MoSortable.elDragged, target.nextElementSibling);
            } else {
                MoSortable.elSort.appendChild(MoSortable.elDragged);
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
        if (MoSortable.callback) {
            let childrens = MoSortable.elSort.children;
            MoSortable.callback(MoSortable.elDragged, childrens, MoSortable.elSort);
        }
    },

    _uploadEls() {
        document.addEventListener(`DOMNodeInserted`, MoSortable._upload);
    },

    /**
     * DISCONNECT
     *
     * Método que desconecta los listeners cuando desaparece el elemento ordenable
     */
    _disconnect() {
        document.addEventListener(`DOMNodeRemoved`, MoSortable._unlistener);
    },
};

export default MoSortable.init;
