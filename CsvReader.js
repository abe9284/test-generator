// deprecated

/** 整理資料，依照需要的題數 & 是否需要答案產出 */
function _arrangeData(data, needNum, withAnswer) {
    const rowArr = _randomPick(data.split('\n'), needNum);
    const testArr = [];
    for (let row of rowArr) {
        const i = rowArr.indexOf(row);
        if (i > 0) {
            const colArr = row.split(',');
            if (!colArr || colArr.length < 6) {
                alert(`檔案第${i + 1}列缺少必要欄位`);
                return [];
            }
            let test = new Test(
                rowArr.indexOf(row),
                colArr[0],
                colArr[1],
                colArr[2],
                colArr[3],
                colArr[4],
                colArr[5],
            );
            testArr.push(test.genContent(withAnswer));
        }
    }
    return testArr;
}

function readCsv(needNum, withAnswer) {
    const files = document.querySelector('#csv').files;

    if (files?.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            const data = e.target.result;
            const testArr = _arrangeData(data, needNum, withAnswer);
            const content = document.querySelector('#testContent');
            content.innerHTML = testArr.join('<br/>')
        }
    } else {
        alert('請上傳檔案');
    }
}


/** 將題目轉成test物件 */
function parseQuestion(inputString, index) {
    // Split the string by the pattern (number) with optional whitespace around it.
    const parts = inputString.split(/\s*\（\d+\）\s*/);

    // Filter out any empty strings that might result from the split.
    const filteredParts = parts.filter(part => part !== "").map(str => str.trim());

    return new Test(
        index + 1,
        filteredParts[0],
        filteredParts[1] || '',
        filteredParts[2] || '',
        filteredParts[3] || '',
        filteredParts[4] || '',
    );
}

class Test {
    number;
    question;
    optionA;
    optionB;
    optionC;
    optionD;
    answer;
    _optionTitle = ['(A)', '(B)', '(C)', '(D)']

    constructor(number, question, optionA, optionB, optionC, optionD, answer) {
        this.number = number;
        this.question = question;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.answer = answer;
    }

    /** 將答案組合成(A)(B)(C)(D)字串，以空格分開 */
    _genOptions = () => {
        const options = [this.optionA, this.optionB, this.optionC, this.optionD];
        return options.map((opt, i) => `${this._optionTitle[i]} ${opt}`).join(' ');
    }

    /** 將整個題目組合成 
     * ( ) 1. 題目 
     *         答案
     * 的字串
     * 可自行決定要不要呈現答案
     */
    genContent = (withAnswer) => {
        return `(${withAnswer ? ` ${this.answer?.trim()} ` : ' '}) ${this.number}. ${this.question} <br/>${this._genOptions()}`
    }

}