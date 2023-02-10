# MO-EFFECTS

Improves to animate or apply effects to HTML elements

### MoAnimate

As if it were the jQuery animate function, with this function we can create animations in DOM elements in a simple way. These animations make use of the CSS engine so they are optimized for use in most browsers.

<span style="font-size:12px">index.js</span>

```javascript
import { MoAnimate } from "mo-effects";

let divToAnimate = document.querySelector( "#divToAnimate" );

MoAnimate(divToAnimate, {
	left: 50%,
	top: 50%,
	width: 150px
}, {
	speed: 500,
	effect: "ease-in",
	delay; 1000
}, () => {
	// Do something when end animation
})
```

### MoColors

With this method we can treat colors in javascript in a simple and effective way. This class allows us to convert colors from `HEX to RGB` or from `HEX to HSL` or from `RGBA to HSLA`, etc... It also allows us to obtain the contrast of a color to know if it is light or dark or to know the format of a color that we pass in a string.

<span style="font-size:12px">index.js</span>

```javascript
import { MoColors } from "mo-effects";

// Know color format
let format = MoColors.type("#000000"); // format = "HEX"

// Convert to RGB
let rgb = MoColors.toRGB("#000000"); // rgb = "rgb(0,0,0);

// Convert to RGBA
let rgba = MoColors.toRGBA("#000000", 0.8); // rgba = "rgba(0,0,0,.8)

// Convert to HSL
let hsl = MoColors.toHSL("rgb(0,0,0)"); // hsl = "hsl(0,0%,0%)"

// Convert to HSLA
let hsla = MoColors.toHSLA("#000000", 0.7); // hsla = "hsl(0,0%,0%,.7)"

// Convert to HEX
let hex = MoColors.toHEX("hsl(0,0%,0%)"); // hex = "#000000"

// Get contrast
let contrast1 = MoColors.contrast("#000000"); // contrast1 = "dark";
let contrast2 = MoColors.contrast("#FFFFFF"); // contrast2 = "light";
```

### MoFade

With this method we can make HTML elements appear or disappear as if it were jQuery.

```typescript
MoFade.in( el: HTMLElement, settings?: { speed: number, effect: string }|Function, callback?: Function ) : void
```

```typescript
MoFade.out( el: HTMLElement, settings?: { speed: number, effect: string }|Function, callback?: Function ) : void
```

```typescript
MoFade.toggle( el: HTMLElement, settings?: { speed: number, effect: string }|Function, callback?: Function ) : void
```

<span style="font-size:12px">index.js</span>

```javascript
// @ts-check

import { MoFade } from "mo-effects";

let el = document.querySelector("#myElement");

MoFade.in(
    el,
    {
        speed: 500,
        effect: "ease-in",
    },
    () => {
        // Do something when animation end
    }
);

MoFade.out(el, () => {
    // Do something when animation end
});
```

### MoFade

Method similar to `MoFade` only this one does it with a rolling shutter effect.

```typescript
MoFade.down( el: HTMLElement, settings?: { speed: number, effect: string }|Function, callback?: Function ) : void
```

```typescript
MoFade.up( el: HTMLElement, settings?: { speed: number, effect: string }|Function, callback?: Function ) : void
```

```typescript
MoFade.toggle( el: HTMLElement, settings?: { speed: number, effect: string }|Function, callback?: Function ) : void
```

<span style="font-size:12px">index.js</span>

```javascript
// @ts-check

import { MoFade } from "mo-effects";

let el = document.querySelector("#myElement");

MoFade.down(
    el,
    {
        speed: 500,
        effect: "ease-in",
    },
    () => {
        // Do something when animation end
    }
);

MoFade.up(el, () => {
    // Do something when animation end
});
```

### MoParallax

This method creates a parallax effect on a given element.

```typescript
MoParallax( el: HTMLElement, settings?: { property: string, direction: string, speed: number, bgColor: string } ) : void
```

<span style="font-size:12px">index.js</span>

```javascript
// @ts-check

import { MoParallax } from "mo-effects";

let el = document.querySelector("#myElement");

// Create the parallax effect with a background image that is in the #myElement element
MoParallax(el, {
    property: "background",
    direction: "down",
    speed: 15,
    bgColor: "#000000",
});

let el2 = document.querySelector("#myElement2");

// Create the parallax effect animating the #myElement2 element
MoParallax(el2, {
    property: "Element",
    direction: "up",
    speed: 5,
});
```

### MoScroll

Animates the scroll of the page or a scrollable element.

```typescript
MoScroll.to( height: number, duration?: number, scrollable?: HTMLElement ) : void
```

```typescript
MoScroll.top( duration: number, scrollable?: HTMLElement ) => void
```

```typescript
MoScroll.bottom( duration: number, scrollable?: HTMLElement ) => void
```

```typescript
MoScroll.toElement( el: HTMLElement, margin?: number, duration?: number, scrollable?: HTMLElement ) => void
```

<span style="font-size:12px">index.js</span>

```javascript
// @ts-check

import { MoScroll } from "mo-effects";

// Animate the page scroll up to a height of 500 in 300ms
MoScroll.to(500, 300);

// Animate the #myElement scroll to a height of 500 in 300ms
let el = document.querySelector("#myElement");
MoScroll.to(500, 300, el);

// Animate the page scroll to the top in 300ms
MoScroll.top(300);

// Animate the page scroll to the bottom by 300ms
MoScroll.bottom(300);

// Animate the page scroll up to the # myELement2 element by 300ms leaving a 50px top margin
let el2 = document.querySelector("#myElement2");
MoScroll.toElement(el2, 50, 300);
```

### MoTextAreaAdjust

Makes a textarea self-adjusting in height as you type inside it.

```typescript
MoTextAreaAdjust( el: TextAreaElement, settings: { maxHeight: number }) : void
```

<span style="font-size:12px">index.js</span>

```javascript
// @ts-check

import { MoTextAreaAdjust } from "mo-effects";

// Convert a textarea into auto adjustable with a maximum height of 500px
let textarea = document.querySelector("#myTextArea");
MoTextAreaAdjust(textarea, { maxHeight: 500 });
```

### MoStickyElement

Causes an element to slide across its parent element when scrolling vertically on the page.

```typescript
MoStickyElement( el: HTMLElement, settings: { headFixHeight: number, footerFixHeight: number, minWidth: number, marginStart: number }, scrollable?: HTMLElement ) : void
```

<span style="font-size:12px">index.html</span>

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <style>
            header {
                position: fixed;
                top: 0;
                width: 100%;
                left: 0;
                background-color: #333333;
                color: white;
                height: 70px;
            }
            .flex-container {
                position: relative;
                margin-top: 90px;
                display: flex;
                flex-flow: row wrap;
                heigh: 1800px;
            }
            .main {
                position: relative;
                flex-grow: 1;
                flex-basis: 0;
            }
            .container {
                position: relative;
                flex-grow: 0;
                flex-basis: 300px;
            }
        </style>
    </head>
    <body>
        <header>HEADER</header>
        <div class="flex-container">
            <div class="main">Left Column MAIN</div>
            <div class="container">
                <div class="slider-element">Righ column slider element into container parent when window scroll</div>
            </div>
        </div>
        <!-- Only for not chromiun navigators -->
        <script src="/node_modules/aw_webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
        <!-- Only for not chromiun navigators -->
        <script type="module" src="/node_modules/aw_polymer_3/polymer/polymer-element.js"></script>
        <script type="module" src="/index.js"></script>
    </body>
</html>
```

<span style="font-size:12px">index.js</span>

```javascript
// @ts-check

import { MoStickyElement } from "mo-effects";

// The .slider-element element will slide through its parent when the window is scrolled
// and the top of the window reaches the .slider-element leaving a 20px top margin between
// the top and the slider-element
let headerHeigh = document.querySelector("header").offsetHeigh;
let el = document.querySelector(".slider-element");
MoStickyElement(el, { headFixHeight: headerHeigh, marginStart: 20 });
```

In this case, we will put an example where the element that we want to slide does not depend on the scroll of the page, but on the scroll of the main element.

<span style="font-size:12px">index.html</span>

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <style>
            body {
                overflow: hidden;
            }
            header {
                position: relative;
                background-color: #333333;
                color: white;
                height: 70px;
            }
            main {
                position: absolute;
                top: 70px;
                left: 0;
                width: calc(100vh - 70px);
                overflow-x: auto;
            }
            .flex-container {
                position: relative;
                display: flex;
                flex-flow: row wrap;
                heigh: 1800px;
            }
            .main {
                position: relative;
                flex-grow: 1;
                flex-basis: 0;
            }
            .container {
                position: relative;
                flex-grow: 0;
                flex-basis: 300px;
            }
        </style>
    </head>
    <body>
        <header>HEADER</header>
        <main>
            <div class="flex-container">
                <div class="main">Left Column MAIN</div>
                <div class="container">
                    <div class="slider-element">
                        Righ column slider element into container parent when window scroll
                    </div>
                </div>
            </div>
        </main>
        <!-- Only for not chromiun navigators -->
        <script src="/node_modules/aw_webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
        <!-- Only for not chromiun navigators -->
        <script type="module" src="/node_modules/aw_polymer_3/polymer/polymer-element.js"></script>
        <script type="module" src="/index.js"></script>
    </body>
</html>
```

<span style="font-size:12px">index.js</span>

```javascript
// @ts-check

import { MoStickyElement } from "mo-effects";

// The .slider-element element will slide through its parent when the window is scrolled
// and the top of the main element reaches the .slider-element leaving a 0px top margin between
// the top and the slider-element
let el = document.querySelector(".slider-element");
let main = document.querySelector("main");
MoStickyElement(el, {}, main);
```
