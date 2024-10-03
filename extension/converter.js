class Converter {

    constructor() {
        this.cache = {};
        this.codeMap = {};
        this.hanvietDict = {};
        this.resolveReady = () => {};

        this.ready = new Promise((resolve, reject) => {
            this.resolveReady = resolve;
        });
        
        this.paChars = [
            "q", "r", "t", "p",
            "s", "d", "đ", "g", "h", "k", "l",
            "z", "x", "c", "v", "b", "n", "m"
        ];
        this.pdAlternativeMap = {
            "": "-",
            "k": "c",
            "gh": "g",
            "ngh": "ng",
            "đ": "dd"
        }

        this.pcTac = ['c', 'ch',  't', 'p'];



        this.dauThanhData = {
            "f": "àằầìùừèềòồờỳ",
            "s": "áắấíúứéếóốớý",
            "r": "ảẳẩỉủửẻểỏổởỷ",
            "x": "ãẵẫĩũữẽễõỗỡỹ",
            "j": "ạặậịụựẹệọộợỵ"
        }
        this.dauThanhMap = {};
        for (const [dauThanh, mangNguyenAm] of Object.entries(this.dauThanhData)) {
            for (const c of mangNguyenAm) {
                this.dauThanhMap[c] = dauThanh;
            }
        }

        this.khongDauthanhData = {
            "àằầìùừèềòồờỳ": "aăâiuưeêoôơy",
            "áắấíúứéếóốớý": "aăâiuưeêoôơy",
            "ảẳẩỉủửẻểỏổởỷ": "aăâiuưeêoôơy",
            "ãẵẫĩũữẽễõỗỡỹ": "aăâiuưeêoôơy",
            "ạặậịụựẹệọộợỵ": "aăâiuưeêoôơy"
        };

        this.khongDauthanhMap = {};
        for (const [coDau, khongDau] of Object.entries(this.khongDauthanhData)) {
            for (let i = 0; i < coDau.length; i++) {
                this.khongDauthanhMap[coDau[i]] = khongDau[i];
            }
        }

        this.telexMap = {
            "ă": "aw",
            "â": "aa",
            "ư": "uw",
            "ê": "ee",
            "ô": "oo",
            "ơ": "ow"
        }
    }

    async convertOnCodeMapReady(text, useHanviet){
        return new Promise((resolve, reject) => {
            this.ready.then(() => {
                resolve(this.convert(text, useHanviet));
            })
        });
    }

    convert(text, useHanviet) {
        if (Object.keys(this.codeMap).length == 0){
            return text;
        }
        if (useHanviet){
            text = this.markHanviet(text);
        }
        const words = this.splitWords(text);
        let convertedText = "";
        let previousConverted = false;
        words.forEach(word => {
            let convertedWord = word;
            if (useHanviet){
                convertedWord = this.hanvietDict[word.replace(/_/g, ' ')] ?? word;
            }
            if (convertedWord == word){
                convertedWord = this.convertWord(word);
            }
            
            const currentConverted = convertedWord != word.toLowerCase();
            if (currentConverted){
                if (previousConverted){
                    convertedText = convertedText.replace(/^\ +|\ +$/g, "");
                }
            } else {
                convertedWord = word;
            }
            convertedText += convertedWord;

            if (word != ' '){
                previousConverted = currentConverted;
            }       
        })
        return convertedText;
    }

    convertWord(word) {
        word = word.toLowerCase();
        
        if (this.cache[word]) {
            return this.cache[word]
        }

        let [pd, va, pc, dt] = this.splitSpell(word);

        // Not vietnamese
        if (`${pd}${va}${pc}`.length < word.length || va.trim() == ''){
            return word
        }

        [pd, va, pc, dt] = this.postprocessSpell(pd, va, pc, dt);

        const charCode = this.codeMap[`${pd}_${va}_${pc}_${dt}`];
        return charCode ? `&#${charCode};` : word;
    }

    markHanviet(text){
        const words = this.splitWords(text);
        const marked = [];
        let i = 0;
        while (i < words.length) {
            let word = words[i];
            let testWordNumbers = [4, 3, 2];
            for (const wordNum of testWordNumbers) {
                let testingWord = words.slice(i, i + 2 * wordNum - 1).join('')
                if (this.hanvietDict[testingWord.toLowerCase()]) {
                    word = testingWord.toLowerCase().replace(/ /g, '_');
                    i += 2 * wordNum - 2;
                    break;
                }
            }
            marked.push(word)
            i++;
        }
        return marked.join("")
    }

    splitSpell(word){
        let pd = "";
        let va = "";
        let dt = "";
        let pc = "";

        for (let char of word) {
            if (this.paChars.includes(char)) {
                if (va == "") {
                    pd += char;
                } else {
                    pc += char;
                }
            } else if (pc == '') {
                if (this.dauThanhMap[char]) {
                    dt = this.dauThanhMap[char];
                    char = this.khongDauthanhMap[char];
                }
                va += char;
            }
        }

        return [pd, va, pc, dt];
    }

    postprocessSpell(pd, va, pc, dt) {
        // pd
        pd = this.pdAlternativeMap[pd] ?? pd;
        if (pd == 'q' && va[0] == 'u'){
            pd = 'qu';
            va = va.slice(1)
        }
        if (pd === "g" && va.startsWith("i")) {
            pd = "gi";
            
            // Co nguyem am khac ngoai i
            if (va.length > 1){
                if (va[1] != 'ê' || pc === "") {
                    va = va.slice(1);
                }
            }
        }

        // va
        if (va == 'o' && pc =='ng'){
            pc = 'nh';
        } else if (va == 'oo' && pc == 'ng'){
            va = 'o';
        }
        if (va[0] == 'y'){
            va = this.setCharAt(va, 0, 'i')
        }
        if (['oao', 'oeo'].includes(va)){
            va = va.slice(1)
        }
        va = va.split('').map(char => this.telexMap[char] ?? char).join('');

        // dt
        if (dt == 's' && this.pcTac.includes(pc)){
            dt = '';
        }

        return [pd, va, pc, dt];
    }

    splitWords(text) {
        let words = [];
        let currentWord = "";
        let isPreviousCharAlphabet = false;

        for (let char of text) {
            // Using \p{L} to match any kind of letter from any language
            let isCurrentCharAlphabet = /\p{L}/u.test(char) || char === '_';
            if (isCurrentCharAlphabet === isPreviousCharAlphabet) {
                currentWord += char;
            } else {
                if (currentWord) {
                    words.push(currentWord);
                }
                currentWord = char;
            }
            isPreviousCharAlphabet = isCurrentCharAlphabet;
        }
        if (currentWord) {
            words.push(currentWord);
        }

        return words;
    }

    setCharAt(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substring(0,index) + chr + str.substring(index+1);
    }

    updateResources(codeMap, hanvietDict){
        this.codeMap = codeMap;
        this.hanvietDict = hanvietDict;        
        this.resolveReady(true);
    }
}