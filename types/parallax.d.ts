export declare interface MoParallax {
    init: (element: HTMLElement, settings: MoParallaxSettings | null, elScrollable: HTMLElement | null) => void;
}

export declare interface MoParallaxSettings {
    /** You can make effect over an element or over background-image of a element */
    property: "background" | "element";
    /** Effect direction */
    direction: "down" | "up";
    /** Effect speed: min 1, max 15, default 13 */
    speed: number;
    /** CSS color */
    backgroundColor: string;
}

export declare interface MoParallaxInternalSettings {
    property: "background" | "element";
    direction: "down" | "up";
    speed: number;
    backgroundColor: string;
    realTop: number;
}

export declare interface MoParallaxComponent {
    el: HTMLElement;
    parentBodyRef: HTMLElement;
    settings: MoParallaxInternalSettings;
    animated: boolean;
    scrollHandler: () => void;
}
