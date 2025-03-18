const styles = /* css */ `
    :root {
            --keyboard-scale: 1;
            --primary-light: #8abdff;
            --primary: #6d5dfc;
            --primary-dark: #5b0eeb;

            --white: #FFFFFF;
            --greyLight-1: #E4EBF5;
            --greyLight-2: #c8d0e7;
            --greyLight-3: #bec8e4;
            --greyDark: #9baacf;
        }


        @font-face {
            font-family: "HoufRegular";
            src: url("https://hajaulee.github.io/Houf-Jaco-Regular-Script/new_fonts/ttf/HoufRegularScript-Light.ttf");
            unicode-range: U+3040-309F, U+4E00-9FFF, U+30A0-30FF, U+FF00-FFEF, U+1B000-1B0FF, U+3040-F5700;
        }

        @font-face {
            font-family: "sanjikaishu";
            src: url("https://hajaulee.github.io/Houf-Jaco-Regular-Script/new_fonts/ttf/SanJiKaiShu-2.ttf");
            unicode-range: U+3040-309F, U+4E00-9FFF, U+30A0-30FF, U+FF00-FFEF, U+1B000-1B0FF, U+3040-F5700;
        }

        @font-face {
            font-family: "ZiTiGuanJiaKaiTi";
            src: url("https://hajaulee.github.io/Houf-Jaco-Regular-Script/new_fonts/ttf/ZiTiGuanJiaKaiTi-1.ttf");
            unicode-range: U+3040-309F, U+4E00-9FFF, U+30A0-30FF, U+FF00-FFEF, U+1B000-1B0FF, U+3040-F5700;
        }

        .regular-font {
            font-family: 'HoufRegular', 'HoufRegularB64', 'sanjikaishu', 'ZiTiGuanJiaKaiTi', Arial, Verdana, sans-serif !important;
        }

        .keyboard-container {
            width: 510px;
            height: fit-content;
            position: fixed;
            bottom: 0;
            left: 50%;
            translate: -50% 0;
            transform: scale(var(--keyboard-scale));
            transform-origin: center bottom;
            font-size: 16px;
            z-index: 10000;
        }

        .keyboard {            
            border: 1px solid #fafafa;
            border-radius: 5px;
            width: calc(100% - 1em);
            margin: auto;
            padding: 0.5em;
            padding-bottom: 1.2em;
            text-align: center;
        }

        .keyboard-row {
            display: flex;
            margin-top: 0.5em;
            justify-content: space-evenly;
        }

        .keyboard-row-full {
            justify-content: space-between;
            gap: 0.5em;
        }

        .keyboard-row-scroll {
            padding: 0.5rem 0.3rem;
            height: 54px;
            gap: 0.5em;
            justify-content: left;
            overflow: auto;
            /* Keeps scrolling enabled */
            scrollbar-width: none;
            /* Firefox */
            -ms-overflow-style: none;
            /* IE & Edge */
        }


        .keyboard button {
            padding: 6px 14px;
            font-size: 16px;
            cursor: pointer;
            min-height: 54px;
            min-width: 41px;
            display: flex;
            justify-content: center;
            align-items: center;
            outline: none;
            position: relative;
        }

        .keyboard button > * {
            pointer-events: none;
        }

        .keyboard button > img {
            font-size: 16px;
            width: 0.6em;
            height: 1.5em;
        }

        .keyboard button[id^="Key"]::before {
            content: attr(data-label);
            position: absolute;
            top: 7px;
            left: 7px;
            font-size: 0.6em;
        }

        .keyboard button.no-badge::before {
            content: ''!important;
        }

        .va-btn {
            padding: 6px 11px;
        }

        .va-btn>img {
            width: 0.9em;
        }

        .space {
            flex: auto;
        }

        #ShiftLeft {
            width: 54px;
            font-size: 29px;
        }


        #Backspace {
            width: 54px;
        }

        #Comma {
            font-weight: bold;
            font-size: 29px;
        }

        #Period {
            font-weight: bold;
            font-size: 29px;
        }

        #Enter {
            width: 69px;
            font-weight: bold;
            font-size: 29px;
        }

        .press {
            background-color: green;
        }

        /* 
        START BUTTON THEME  
        From: https://codepen.io/myacode/pen/PoqQQNM
        */

        .neumorphic .keyboard {
            background: var(--greyLight-1);
        } 

        .neumorphic .keyboard button {
            background: var(--greyLight-1);
            border: 0;
            border-radius: 1rem;
            box-shadow: 0.3rem 0.3rem 0.6rem var(--greyLight-2), -0.2rem -0.2rem 0.5rem var(--white);
            justify-self: center;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            color: var(--greyDark);

            transition: 0.3s ease;
        }

        .neumorphic .keyboard button img {
            /* Comute color at: https://codepen.io/sosuke/pen/Pjoqqp */
            /* filter: invert(81%) sepia(2%) saturate(5396%) hue-rotate(191deg) brightness(86%) contrast(88%); */
            filter: invert(30%) sepia(45%) saturate(4102%) hue-rotate(235deg) brightness(114%) contrast(109%);
        }

        .neumorphic button.btn_primary {
            grid-column: 1/2;
            grid-row: 4/5;
            background: var(--primary);
            box-shadow: inset 0.2rem 0.2rem 1rem var(--primary-light), inset -0.2rem -0.2rem 1rem var(--primary-dark), 0.3rem 0.3rem 0.6rem var(--greyLight-2), -0.2rem -0.2rem 0.5rem var(--white);
            color: var(--greyLight-1);
        }

        .neumorphic .keyboard button:hover {
            color: var(--primary);
        }

        .neumorphic .keyboard button:hover img {
            filter: invert(10%) sepia(97%) saturate(7327%) hue-rotate(266deg) brightness(89%) contrast(108%);
        }

        .neumorphic .keyboard button:active {
            box-shadow: inset 0.2rem 0.2rem 0.5rem var(--greyLight-2), inset -0.2rem -0.2rem 0.5rem var(--white);
        }

        
        .neumorphic button.btn_primary:hover {
            color: var(--white);
        }

        .neumorphic button.btn_primary:active {
            box-shadow: inset 0.2rem 0.2rem 1rem var(--primary-dark), inset -0.2rem -0.2rem 1rem var(--primary-light)!important;
        }

        /* 
        END BUTTON THEME 
        */
`;

const htmlTemplate = /* html */ `
    <div class="keyboard-container neumorphic">
        <div class="keyboard">
            <!-- Row Hint -->
            <div id="hintRow" class="keyboard-row keyboard-row-scroll">
            </div>

            <!-- Row 1 -->
            <div class="keyboard-row keyboard-row-full">
                <button id="KeyQ" data-label="Q">Q</button>
                <button id="KeyW" data-label="W">W</button>
                <button id="KeyE" data-label="E">E</button>
                <button id="KeyR" data-label="R">R</button>
                <button id="KeyT" data-label="T">T</button>
                <button id="KeyY" data-label="Y">Y</button>
                <button id="KeyU" data-label="U">U</button>
                <button id="KeyI" data-label="I">I</button>
                <button id="KeyO" data-label="O">O</button>
                <button id="KeyP" data-label="P">P</button>
            </div>

            <!-- Row 2 -->
            <div class="keyboard-row">
                <button id="KeyA" data-label="A">A</button>
                <button id="KeyS" data-label="S">S</button>
                <button id="KeyD" data-label="D">D</button>
                <button id="KeyF" data-label="F">F</button>
                <button id="KeyG" data-label="G">G</button>
                <button id="KeyH" data-label="H">H</button>
                <button id="KeyJ" data-label="J">J</button>
                <button id="KeyK" data-label="K">K</button>
                <button id="KeyL" data-label="L">L</button>
            </div>

            <!-- Row 3 -->
            <div class="keyboard-row keyboard-row-full">
                <button id="ShiftLeft">⇧</button>
                <button id="KeyZ" data-label="Z">Z</button>
                <button id="KeyX" data-label="X">X</button>
                <button id="KeyC" data-label="C">C</button>
                <button id="KeyV" data-label="V">V</button>
                <button id="KeyB" data-label="B">B</button>
                <button id="KeyN" data-label="N">N</button>
                <button id="KeyM" data-label="M">M</button>
                <button id="Backspace">⌫</button>
            </div>

            <!-- Row 4 -->
            <div class="keyboard-row keyboard-row-full">
                <button id="Symbol">?123</button>
                <button id="Comma">,</button>
                <button id="AltLeft">🌐</button>
                <button id="Space" class="space">Dấu cách</button>
                <button id="Period">.</button>
                <button id="Enter" class="btn_primary">⏎</button>
            </div>
        </div>
    </div>

`;


/* Javasctipt */

class JacoKeyBoardPdState {
    name = "pd";
    cssClass = '';
    layout = {
        "Q": "11_qu.svg",
        "W": "11_ng_fix.svg",
        "E": "11_ch.svg",
        "R": "11_r.svg",
        "T": "11_t.svg",
        "Y": "11_tr.svg",
        "U": "11_th.svg",
        "I": "11_nh.svg",
        "O": "11_-.svg",
        "P": "11_p.svg",

        "A": "",
        "S": "11_s.svg",
        "D": "11_dd.svg",
        "F": "11_ph.svg",
        "G": "11_g.svg",
        "H": "11_h.svg",
        "J": "11_gi.svg",
        "K": "11_kh_fix.svg",
        "L": "11_l.svg",

        "Z": "11_d.svg",
        "X": "11_x.svg",
        "C": "11_c.svg",
        "V": "11_v.svg",
        "B": "11_b.svg",
        "N": "11_n.svg",
        "M": "11_m.svg"
    }

    constructor() {
        Object.keys(this.layout).filter(key => this.layout[key]).forEach(key => {
            this.layout[key] = "https://hajaulee.github.io/jaco-regular-script-font-src/phuamdau/" + this.layout[key];
        })
    }
}

class JacoKeyBoardVaState {
    name = "va";
    cssClass = 'va-btn';
    layout = {
        "Q": "11_ai.svg",
        "W": "12_aa.svg",
        "E": "11_e.svg",
        "R": "11_ow_fix.svg",
        "T": "11_ee.svg",
        "Y": "11_uw.svg",
        "U": "11_u.svg",
        "I": "11_i.svg",
        "O": "11_o.svg",
        "P": "11_oo.svg",

        "A": "11_a.svg",
        "S": "12_aw.svg",
        "D": "11_ao.svg",
        "F": "11_eo.svg",
        "G": "12_uwow.svg",
        "H": "12_uyee.svg",
        "J": "12_uoo.svg",
        "K": "12_iee.svg",
        "L": "11_ooi.svg",

        "Z": "11_aau.svg",
        "X": "11_uwi.svg",
        "C": "11_uwowi.svg",
        "V": "11_ua.svg",
        "B": "11_ui.svg",
        "N": "11_ieeu.svg",
        "M": "11_oa.svg"
    }

    constructor() {
        Object.keys(this.layout).filter(key => this.layout[key]).forEach(key => {
            this.layout[key] = "https://hajaulee.github.io/jaco-regular-script-font-src/van/" + this.layout[key];
        })
    }
}

class JacoKeyBoardVaShiftState {
    name = "va-shift";
    cssClass = 'va-btn';

    layout = {
        "Q": "11_au.svg",
        "W": "12_uaa.svg",
        "E": "11_eeu.svg",
        "R": "11_ee.svg",
        "T": "11_uwowu.svg",
        "Y": "11_uy.svg",
        "U": "11_uow.svg",
        "I": "11_ia.svg",
        "O": "11_o.svg",
        "P": "11_owi.svg",

        "A": "11_a.svg",
        "S": "11_aay.svg",
        "D": "11_uaay.svg",
        "F": "11_uya.svg",
        "G": "11_uwa.svg",
        "H": "11_uee.svg",
        "J": "11_oe_fix.svg",
        "K": "11_oi.svg",
        "L": "12_oaw.svg",

        "Z": "11_ay.svg",
        "X": "11_uwu.svg",
        "C": "11_uyu.svg",
        "V": "11_uooi.svg",
        "B": "11_iu.svg",
        "N": "11_oai.svg",
        "M": "11_oay.svg"
    }

    constructor() {
        Object.keys(this.layout).filter(key => this.layout[key]).forEach(key => {
            this.layout[key] = "https://hajaulee.github.io/jaco-regular-script-font-src/van/" + this.layout[key];
        })
    }
}

class JacoKeyBoardDtPcState {
    name = "dtpc";
    cssClass = 'va-btn';

    layout = {
        "Q": "",
        "W": "",
        "E": "",
        "R": "11_hoi.svg",
        "T": "12_t.svg",
        "Y": "",
        "U": "",
        "I": "",
        "O": "",
        "P": "12_p.svg",

        "A": "",
        "S": "11_sac.svg",
        "D": "",
        "F": "11_huyen.svg",
        "G": "12_ng.svg",
        "H": "12_ch.svg",
        "J": "11_nang.svg",
        "K": "",
        "L": "12_nh.svg",

        "Z": "",
        "X": "11_nga.svg",
        "C": "12_c.svg",
        "V": "",
        "B": "",
        "N": "12_n.svg",
        "M": "12_m.svg"
    }

    constructor() {
        Object.keys(this.layout).filter(key => this.layout[key]).forEach(key => {
            if ("SRXJF".includes(key)) {
                this.layout[key] = "https://hajaulee.github.io/jaco-regular-script-font-src/dauthanh/" + this.layout[key];
            } else {
                this.layout[key] = "https://hajaulee.github.io/jaco-regular-script-font-src/phuamcuoi/" + this.layout[key];
            }
        })
    }
}

class JacoKeyBoardQwertyState {
    name = "qwerty";
    cssClass = '';

    layout = {
        "Q": "q",
        "W": "w",
        "E": "e",
        "R": "r",
        "T": "t",
        "Y": "y",
        "U": "u",
        "I": "i",
        "O": "o",
        "P": "p",
        "A": "a",
        "S": "s",
        "D": "d",
        "F": "f",
        "G": "g",
        "H": "h",
        "J": "j",
        "K": "k",
        "L": "l",
        "Z": "z",
        "X": "x",
        "C": "c",
        "V": "v",
        "B": "b",
        "N": "n",
        "M": "m"
    }
}

class JacoKeyBoardSymbolState {
    name = "symbol";
    cssClass = 'no-badge';

    layout = {
        "Q": "1",
        "W": "2",
        "E": "3",
        "R": "4",
        "T": "5",
        "Y": "6",
        "U": "7",
        "I": "8",
        "O": "9",
        "P": "0",
        "A": "@",
        "S": "#",
        "D": "$",
        "F": "&",
        "G": "-",
        "H": "+",
        "J": "(",
        "K": ")",
        "L": "/",
        "Z": "*",
        "X": "\"",
        "C": "'",
        "V": ":",
        "B": ";",
        "N": "!",
        "M": "?"
    }
}

class JacoKeyBoardSymbolShiftState {
    name = "symbol";
    cssClass = 'no-badge';

    layout = {
        "Q": "~",
        "W": "`",
        "E": "|",
        "R": "・",
        "T": "√",
        "Y": "π",
        "U": "÷",
        "I": "×",
        "O": "σ",
        "P": "Δ",
        "A": "¥",
        "S": "【",
        "D": "】",
        "F": "^",
        "G": "°",
        "H": "=",
        "J": "{",
        "K": "}",
        "L": "\\",
        "Z": "%",
        "X": "「",
        "C": "」",
        "V": "<",
        "B": ">",
        "N": "[",
        "M": "]"
    }
}

class JacoKeyBoard {

    base64TransparentImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

    pdState = new JacoKeyBoardPdState();
    vaState = new JacoKeyBoardVaState();
    vaShiftState = new JacoKeyBoardVaShiftState();
    dtpcState = new JacoKeyBoardDtPcState();
    qwertyState = new JacoKeyBoardQwertyState();
    symbolState = new JacoKeyBoardSymbolState();
    symbolShiftState = new JacoKeyBoardSymbolShiftState();
    states = [
        this.pdState,
        this.vaState,
        this.vaShiftState,
        this.dtpcState
    ];
    stateIndex = 0;
    state = this.states[this.stateIndex];
    shiftKey = false;

    textEditor = null;
    codeMap = {};
    codeWordMap = {};
    hantuHints = {};
    hintList = [];

    dauthanhMap = {
        huyen: 'f',
        sac: 's',
        hoi: 'r',
        nga: 'x',
        nang: 'j'
    }

    resCache = {};
    
    _ready;

    constructor() {
        this.onReady = () => new Promise((resolve) => {this._ready = resolve});

        this.preloadKeyImage();
        this.preloadFont();
    }

    preloadKeyImage() {
        this.states.forEach(state => {
            Promise.all(Object.keys(state.layout).map(async (key) => {
                this.resCache[state.layout[key]] = await this.urlContentToDataUri(state.layout[key]);
            })).then(() => {
                this._ready();
            });
        });
    }

    async preloadFont() {
        const uriData = await this.urlContentToDataUri("https://hajaulee.github.io/Houf-Jaco-Regular-Script/new_fonts/ttf/HoufRegularScript-Light.ttf");
        const newStyle = document.createElement('style');
        newStyle.appendChild(document.createTextNode(`
            @font-face {
                font-family: "HoufRegularB64";
                src: url("${uriData}");
                unicode-range: U+3040-309F, U+4E00-9FFF, U+30A0-30FF, U+FF00-FFEF, U+1B000-1B0FF, U+3040-F5700;
            }  
        `));
        document.head.appendChild(newStyle);  
    }

    hide() {
        document.querySelector(".keyboard-container").style.display = 'none';
    }

    show() {
        document.querySelector(".keyboard-container").style.display = 'block';
    }

    handleKey(key) {
        const oldStateName = this.state.name;
        let handled = false;
        let forceUpdate = false;

        if (!this.textEditor) {
            return false;
        }
        if (key.startsWith('Digit') && this.hintList.length) {
            key = 'Han-' + this.hintList[Number(key.slice(5)) - 1];
        }
        if (key.startsWith("Key")) {
            const charKey = key.slice(3);
            const keyVal = this.state == this.qwertyState
                ? charKey.toLowerCase()
                : [this.symbolState, this.symbolShiftState].includes(this.state)
                    ? this.state.layout[charKey]
                    : this.state.layout[charKey].split("_")[1]?.split(".")[0];
            if (keyVal) {

                if (this.state.name == 'pd') {
                    this.addText(this.getChar(keyVal + '_a__'));

                    this.state = this.vaState;
                } else if (this.state.name == 'va' || this.state.name == 'va-shift') {
                    const char = this.getCharAtCursor();
                    const word = this.codeWordMap[char.codePointAt(0)];
                    const parts = word.split("_");
                    parts[1] = keyVal;

                    // for ă, â, uô, ươ,...
                    if (!this.codeMap[parts.join('_')]) {
                        parts[2] = 'n';
                    }
                    const newWord = parts.join('_');

                    if (this.codeMap[newWord]) {
                        this.replaceText(this.getChar(newWord), char.length);
                    }


                    this.state = this.dtpcState;
                } else if (this.state.name == 'dtpc') {
                    const char = this.getCharAtCursor();
                    const word = this.codeWordMap[char.codePointAt(0)];
                    const parts = word.split("_");

                    if (this.dauthanhMap[keyVal]) {
                        if (this.dauthanhMap[keyVal] == parts[3]) {
                            parts[3] = ''
                        } else {
                            parts[3] = this.dauthanhMap[keyVal];
                        }
                    } else {
                        parts[2] = keyVal
                    }
                    const newWord = parts.join('_');

                    if (this.codeMap[newWord]) {
                        this.replaceText(this.getChar(newWord), char.length);
                    }
                } else if (this.state.name == 'qwerty') {
                    this.addText(this.shiftKey ? keyVal.toUpperCase() : keyVal.toLowerCase());
                } else if (this.state.name == 'symbol') {
                    this.addText(keyVal);
                }
            }
            handled = true;
        } else if (key == "ShiftLeft") {
            this.shiftKey = !this.shiftKey;

            if (this.state == this.vaState) {
                this.state = this.vaShiftState;
            } else if (this.state == this.vaShiftState) {
                this.state = this.vaState;
            } else if (this.state == this.symbolState) {
                this.state = this.symbolShiftState;
            } else if (this.state == this.symbolShiftState) {
                this.state = this.symbolState;
            }
            handled = true;
        } else if (key == "AltLeft") {
            if (this.state == this.qwertyState) {
                this.state = this.pdState;
            } else {
                this.state = this.qwertyState;
            }
            handled = true;
        } else if (key == "Symbol") {
            if (this.state == this.symbolState) {
                this.state = this.pdState;
            } else {
                this.state = this.symbolState;
            }
            handled = true;
        } else if (key == "Space") {
            if (this.state.name != 'pd' && this.state.name != 'qwerty') {
                this.state = this.pdState;
            } else {
                this.addText(' ')
            }
            handled = true;
        } else if (key == 'Backspace') {
            if (this.textEditor.selectionStart == this.textEditor.selectionEnd) {
                this.replaceText('', this.getCharAtCursor().length);
            } else {
                this.replaceText('');
            }
            this.resetKeyboard();
            handled = true;
        } else if (['Comma', 'Period', 'Enter'].includes(key)) {
            this.addText({ Comma: ',', Period: '.', Enter: '\n' }[key]);
            this.resetKeyboard();
            handled = true;
        } else if (key.startsWith("Han-")) {
            const hantu = key.slice(4);
            const hantuCount = Array.from(hantu).length;
            const replaceLength = this.getCharsBeforeCursor(hantuCount).length;
            this.replaceText(hantu, replaceLength);
            this.resetKeyboard();
            handled = true;
        }

        if (key != "ShiftLeft") {
            if (this.shiftKey) {
                forceUpdate = true;
            }
            this.shiftKey = false;
        }

        // Show hint for hantu
        this.hintList = [];
        const textsCheckHint = Array.from(this.getCharsBeforeCursor(4));
        for (let i = Math.min(4, textsCheckHint.length); i > 0; i--) {
            const text = textsCheckHint.slice(-i).join('');
            const hintList = this.hantuHints[text] || [];
            if (hintList) {
                this.hintList.push(...hintList);
            }
        }
        this.updateHint();

        if (!handled) {
            this.resetKeyboard();
        }

        if (this.state.name != oldStateName || key == "ShiftLeft" || forceUpdate) {
            this.update();
        }

        return handled;
    }

    resetKeyboard() {
        if (this.state.name != 'pd' && this.state.name != 'qwerty') {
            this.state = this.pdState;
        }
    }

    update() {
        Object.keys(this.state.layout).forEach(key => {
            const keyBtn = document.getElementById('Key' + key);
            keyBtn.classList = this.state.cssClass;
            if (this.state == this.qwertyState) {
                keyBtn.innerHTML = this.shiftKey ? key.toUpperCase() : key.toLowerCase();
            } else if ([this.symbolState, this.symbolShiftState].includes(this.state)) {
                keyBtn.innerHTML = this.state.layout[key];
            } else {
                if (this.state.layout[key]) {
                    keyBtn.innerHTML = `<img src="${this.resCache[this.state.layout[key]]}" alt="">`;
                } else {
                    keyBtn.innerHTML = `<img src="data:image/png;base64,${this.base64TransparentImage}" alt="">`;
                }
            }
        });

        this.updateHint();

    }

    updateHint() {
        const hintRowContent = this.hintList.map(hint => {
            return `<button id="Han-${hint}">${hint}</button>`
        }).join('\n');
        document.getElementById('hintRow').innerHTML = hintRowContent;
    }

    getChar(word) {
        return String.fromCodePoint(this.codeMap[word])
    }

    getCharAtCursor() {
        return this.getCharsBeforeCursor(1);
    }

    getCharsBeforeCursor(num = 1) {
        if (!this.textEditor) return '';
        // Get current cursor position
        const end = this.textEditor.selectionEnd;
        return [...this.textEditor.value.substring(end - 12, end)].slice(-num).join('');
    }

    addText(text) {
        if (this.textEditor) {
            this.insertAtCursor(this.textEditor, text, 0);
        }
    }

    replaceText(text, deleteNum) {
        if (this.textEditor) {
            this.insertAtCursor(this.textEditor, text, deleteNum);
        }
    }

    insertAtCursor(textarea, text, deleteNum) {
        if (!textarea) return;

        // Get current cursor position
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        // Insert text at the cursor position
        let before = textarea.value.substring(0, start);
        const after = textarea.value.substring(end);
        if (deleteNum) {
            before = before.slice(0, - deleteNum);
        }
        textarea.value = before + text + after;

        // Move cursor to after inserted text
        const newPos = start + text.length - (deleteNum || 0);
        textarea.selectionStart = textarea.selectionEnd = newPos;

        // Dispatch input event to notify changes
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }

    async urlContentToDataUri(url) {
        return fetch(url, { mode: 'cors', cache: 'force-cache' })
            .then(response => response.blob())
            .then(blob => new Promise(callback => {
                let reader = new FileReader();
                reader.onload = function () { callback(this.result) };
                reader.readAsDataURL(blob);
            }));
    }
}

function fitKeyboardSize() {
    document.documentElement.style.setProperty('--keyboard-scale', Math.min(1, window.innerWidth / 510));
}

function dragElement(elmnt) {
    elmnt.addEventListener('pointerdown', function (e) {
        if (e.pointerType != 'mouse') {
            return;
        }
        e.preventDefault();

        // Get the initial mouse cursor position
        let offsetX = e.clientX - parseInt(window.getComputedStyle(this).left);
        let offsetY = e.clientY - parseInt(window.getComputedStyle(this).top);


        const onMouseMove = (e) => {
            // Calculate the new cursor position
            const left = e.clientX - offsetX;
            const top = e.clientY - offsetY;
            // Set the element's new position
            this.style.left = `${left}px`;
            this.style.top = `${top}px`;
        };

        const onMouseUp = () => {
            // Remove the event listeners when the mouse button is released
            document.removeEventListener('pointermove', onMouseMove);
            document.removeEventListener('pointerup', onMouseUp);
        };

        // Attach the event listeners
        document.addEventListener('pointermove', onMouseMove);
        document.addEventListener('pointerup', onMouseUp);
    });
}

function addStyles(css) {
    var style = document.createElement('style');
    style.type = 'text/css';

    // For most browsers, you can simply append a text node
    style.appendChild(document.createTextNode(css));

    // Append the <style> element to the document head
    document.head.appendChild(style);
}

function addElement(html) {
    const newDiv = document.createElement("div");
    newDiv.innerHTML = html;
    document.body.appendChild(newDiv);
}


/* Main */
(function () {
    addStyles(styles);
    addElement(htmlTemplate);

    const keyboard = new JacoKeyBoard();
    Promise.all([
        fetch("https://hajaulee.github.io/jaco/extension/code_map.json").then(res => res.json()),
        fetch("https://hajaulee.github.io/jaco/experience/hantu_hint.json").then(res => res.json())
    ]).then(([data, hantuHints]) => {
        keyboard.codeMap = data;
        Object.keys(data).forEach(word => {
            keyboard.codeWordMap[data[word]] = word;
        })
        keyboard.hantuHints = hantuHints;
        keyboard.onReady().then(() => {
            keyboard.update();
        });
        window.jacoKeyboard = keyboard;
    })


    document.querySelectorAll(".keyboard-row button").forEach(button => {
        button.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            keyboard.handleKey(e.target.id)
        })
    });

    document.getElementById("hintRow").addEventListener('pointerdown', (e) => {
        if (e.target.tagName == 'BUTTON') {
            keyboard.handleKey(e.target.id);
        }
    })

    dragElement(document.querySelector('.keyboard-container'));
    document
        .querySelector('.keyboard-container')
        .addEventListener('pointerdown', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
        })

    window.addEventListener('keydown', (e) => {
        const button = document.getElementById(e.code);
        if (button) {
            button.classList.add('press');
            setTimeout(() => {
                button.classList.remove('press');
            }, 100)
        }

        let cocKey = (e.metaKey || e.ctrlKey);

        if (!cocKey) {
            if (keyboard.state == keyboard.qwertyState && e.code != 'AltLeft') {
                return;
            }
            const handled = keyboard.handleKey(e.code, true);
            if (handled) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }
    });

    window.addEventListener('pointerdown', (e) => {
        console.log(e);

        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
            keyboard.textEditor = e.target;
            keyboard.show();
            e.target.classList.add('regular-font');
            setTimeout(() => {
                e.target.focus();
            }, 100);
        } else {
            keyboard.hide();
        }
    });

    window.addEventListener('resize', () => {
        fitKeyboardSize()
    })
    fitKeyboardSize();
})();
