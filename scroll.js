const MoScroll = {
    /**
     * Move scroll to specific height
     * @param {number} to Height to move scroll
     * @param {number} duration Animation duration
     * @param {HTMLElement} element Element scrollable
     */
    to(to, duration = 500, element = window) {
        let start = element === window ? window.scrollY : element.scrollTop,
            change = to - start,
            currentTime = 0,
            increment = 20;

        this._animate(element, duration, start, change, currentTime, increment);
    },

    /**
     * Move scroll to specific element
     * @param {HTMLElement} el Element to move scroll
     * @param {number} margin Margin between top viewport and element
     * @param {number} duration Animation duration
     * @param {HTMLElement} element Element scrollable
     */
    toElement(el, margin = 0, duration = 500, element = window) {
        let scrollTop = element === window ? window.scrollY : element.scrollTop;
        let top = el.getBoundingClientRect().top + scrollTop + margin;

        let start = element === window ? window.scrollY : element.scrollTop,
            change = top - start,
            currentTime = 0,
            increment = 20;

        this._animate(element, duration, start, change, currentTime, increment);
    },

    /**
     * Move to top of element or window
     * @param {number} duration Animation duration
     * @param {HTMLElement} element Element scrollable
     */
    top(duration, element = window) {
        let start = element === window ? window.scrollY : element.scrollTop,
            change = 0 - start,
            currentTime = 0,
            increment = 20;

        this._animate(element, duration, start, change, currentTime, increment);
    },

    /**
     * Move to bottom of element or window
     * @param {number} duration Animation duration
     * @param {HTMLElement} element Element scrollable
     */
    bottom(duration, element = window) {
        let start = element === window ? window.scrollY : element.scrollTop,
            change = element.offsetHeight - start,
            currentTime = 0,
            increment = 20;

        this._animate(element, duration, start, change, currentTime, increment);
    },

    _animate(element, duration, start, change, currentTime, increment) {
        currentTime += increment;

        let val = this._easeInOutQuad(currentTime, start, change, duration);

        if (element === window) {
            window.scroll(0, val);
        } else {
            element.scrollTop = val;
        }

        if (currentTime < duration) {
            setTimeout(
                function () {
                    this._animate(element, duration, start, change, currentTime, increment);
                }.bind(this),
                increment
            );
        }
    },

    _easeInOutQuad(t, b, c, d) {
        t /= d / 2;

        if (t < 1) {
            return (c / 2) * t * t + b;
        }

        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
    },
};

export default {
    to: MoScroll.to,
    toElement: MoScroll.toElement,
    top: MoScroll.top,
    bottom: MoScroll.bottom,
};
