import { createApp } from 'https://unpkg.com/petite-vue?module'
import * as XLSX from 'https://unpkg.com/xlsx/xlsx.mjs';

createApp({
    // exposed to all expressions
    number: 50, // 題目數
    testData: [], // 考題
    testHeader: '', // 題本表頭
    // getters
    // methods
    handleFileChange(event) {
        this.fileLoaded = true; // Set to true when a file is selected
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (jsonData.length > 0) {
                const headers = jsonData.splice(0, 1);
                let testData = _randomPick(jsonData, this.number).map((row, i) => {
                    row[1] = i + 1;
                    return row;
                })
                this.testData = testData;
                this.testHeader = headers[0];
            } else {
                this.testData = []; // Clear data if sheet is empty
                this.testHeader = '';
            }
        };

        reader.readAsArrayBuffer(file);
    },

    genTestContent(withAnswer) {
        if (!this.testData?.length) {
            alert('請上傳檔案');
            return;
        }
        let data = this.testData;
        if(!withAnswer){
            data = this.testData.map(e=>{
                e[0]= '（　）';
                return e;
            })
        }
        downloadExcel(data, this.testHeader);
    },

}).mount();


/** 下載檔案 */
function downloadExcel(data, header, filename = 'output.xlsx') {
    const worksheet = XLSX.utils.json_to_sheet(data, {header: [header] }); // Convert JSON data to worksheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1"); // Add the worksheet

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }); // Convert workbook to binary Excel file

    // Create a Blob (Binary Large Object)
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a link and trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob); // Create a URL for the blob
    link.download = filename; // Set the filename
    link.style.display = 'none'; // Hide the link
    document.body.appendChild(link); // Add to the DOM
    link.click(); // Simulate click to trigger download
    document.body.removeChild(link); // Remove from the DOM
    URL.revokeObjectURL(link.href);  // Release the blob URL
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
    while (resultSet.size < needNum) {
        const randomNum = Math.floor(Math.random() * totalNum);
        resultSet.add(randomNum);
    }

    return shuffleArray(arr.filter((_, i) => resultSet.has(i)));
}

/** 洗牌 */
function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// TODO 進階功能
// function splitAndDownloadExcel(worksheet, needNum, filename = 'output.xlsx') {
//     const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
//     const header = jsonData[0]; // Extract the header
  
//     if (!jsonData || jsonData.length === 0) {
//         console.error("No data to split.");
//         return;
//     }
  
//     const numFiles = Math.ceil(jsonData.length / rowsPerFile); // Calculate number of files
  
//     for (let i = 0; i < needNum; i++) {
//       const startRow = i * rowsPerFile;
//       const endRow = Math.min((i + 1) * rowsPerFile, jsonData.length); // Handle last file
//       const chunk = jsonData.slice(startRow, endRow);
  
//       // Create a new worksheet for each chunk
//       const newWorksheet = {};
  
//       // Add the header row
//       header.forEach((headerText, index) => {
//         const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
//         newWorksheet[cellAddress] = { v: headerText, t: 's' };
//       });
  
//       // Add the data rows for the current chunk
//       chunk.forEach((dataRow, rowIndex) => {
//         header.forEach((headerText, colIndex) => {
//           const cellAddress = XLSX.utils.encode_cell({ r: rowIndex + 1, c: colIndex });
//           newWorksheet[cellAddress] = { v: dataRow[headerText], t: typeof dataRow[headerText] === 'number' ? 'n' : 's' };
//         });
//       });
  
//       const range = { s: { c: 0, r: 0 }, e: { c: header.length - 1, r: chunk.length } };
//       newWorksheet['!ref'] = XLSX.utils.encode_range(range);
  
//       const newWorkbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Sheet1");
//       const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
  
//       const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);
//       link.download = `${filenamePrefix}${i + 1}.xlsx`; // Numbered filenames
//       link.style.display = 'none';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(link.href);
//     }
//   }
