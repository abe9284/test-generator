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
        return `(${withAnswer ? this.answer : ' '}) ${this.number}. ${this.question} <br/>${this._genOptions()}`
    }

}

function _randomPick(arr, needNum) {
    if (!Array.isArray(arr) || !needNum || Number.isNaN(+needNum)) {
        alert('資料有誤');
        return [];
    }
    const totalNum = arr.length;
    if (+needNum > totalNum) {
        alert('所需題數多過總題數');
        return [];
    }
    const resultSet = new Set();
    while (resultSet.size <= needNum) {
        const randomNum = Math.floor(Math.random() * totalNum);
        resultSet.add(randomNum);
    }

    return arr.filter((_, i) => resultSet.has(i));
}

/** 整理資料，依照需要的題數 & 是否需要答案產出 */
function _arrangeData(data, needNum, withAnswer) {
    const rowArr = _randomPick(data.split('\n'), needNum);
    const testArr = [];
    for (row of rowArr) {
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