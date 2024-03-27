import xlsx from 'xlsx';

interface FileData {
    sheet?: number,
    top?: number,
    columns: Array<number>,
    file: any,
}

export default class {
    sheet: number;
    top: number;
    columns: Array<number>;
    file: any;
    callback: Function;
    taskArr: Array<any>;
    workbook: any;
    constructor({ sheet, top, columns, file }: FileData) {
        this.sheet = sheet || 0;
        this.top = top || 1;
        this.columns = columns;
        this.file = file;
        this.taskArr = [];
        this.workbook = null;
        this.init();
    }
    init() {
        this.workbook = xlsx.read(this.file, { type: 'array' });
        const sheetName = this.workbook.SheetNames[this.sheet];
        const sheet = this.workbook.Sheets[sheetName];
        /**
         * opts (可选): 这是一个包含选项的对象，用于控制转换过程。常见的选项包括：
         * header: 指定是否将首行作为 JSON 对象的键。如果设置为 1 或 true，则将首行作为键；如果设置为 0 或 false，则将生成默认的键（A、B、C 等）。默认值为 1。
         * range: 指定要解析的单元格范围。它应该是一个字符串，形式如 'A1:B10'，表示从 A1 到 B10 的范围。
         * raw: 指定是否返回原始的单元格值。如果设置为 true，则不会进行任何类型转换，返回原始的字符串。默认值为 false。
         * blankrows: 指定是否将空行包含在结果中。如果设置为 true，则会将空行作为 JSON 对象返回，其中所有属性的值都是 null。默认值为 false。
         * defval: 指定默认值，用于替代空单元格。如果设置了该选项，所有空单元格都将使用该值填充。
         */
        const jsonData = xlsx.utils.sheet_to_json(sheet, {
            header: 1,
            defval: null,
        });

        this.taskArr = this.fixData(jsonData);
    }
    fixData(jsonData: Array<any>) {
        let arr = jsonData.slice(this.top);

        arr = arr.map(item => this.columns.map(select => item[select - 1]));
    
        return arr;
    }
    getTaskArr() {
        return Array.isArray(this.taskArr) ? this.taskArr : [];
    }
}