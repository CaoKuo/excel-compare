import fs from 'fs';
import path from 'path';
import os from 'os';
import xlsx from 'xlsx';
import readExcel from "./readExcel";

const isEqual = (row1: Array<any>, row2: Array<any>) => {
    // 比较两个数组是否相等
    if (row1.length !== row2.length) {
        return false;
    }

    for (let i = 0; i < row1.length; i++) {
        if (row1[i] !== row2[i]) {
            return false;
        }
    }

    return true;
}

const compareArrays = (array1: Array<any>, array2: Array<any>) => {
    const unmatchedArray1 = [];
    const unmatchedArray2 = [];

    const hashTable: any = {};

    // 将 array1 中的所有元素存储到哈希表中
    for (const row of array1) {
        hashTable[row[0]] = row;
    }

    // 遍历 array2，逐个元素对比
    for (const row of array2) {
        // 如果在哈希表中找到相同的键，则表示元素相同
        if (hashTable.hasOwnProperty(row[0])) {
            // 检查元素是否相等，如果不相等则将其添加到 unmatchedArray2 中
            if (!isEqual(hashTable[row[0]], row)) {
                unmatchedArray2.push(row);
            } else {
                // 删除哈希表中的元素，避免重复处理
                delete hashTable[row[0]];
            }
        } else {
            // 如果在哈希表中找不到相同的键，则将当前元素添加到 unmatchedArray2 中
            unmatchedArray2.push(row);
        }
    }

    // 剩余的元素即为在 array1 中存在但在 array2 中不存在的元素
    for (const key of Object.keys(hashTable)) {
        unmatchedArray1.push(hashTable[key]);
    }

    return { unmatchedArray1, unmatchedArray2 };
}

const exportFile = (name: string, data: any) => {
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, 'Shee1');

    const outputDir = path.join(os.homedir(), 'Desktop', 'compare');
    const filePath = path.join(outputDir, name);

    if(!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    xlsx.writeFile(wb, filePath);
}

const compare = (data1: any, data2: any) => {
    return new Promise((resolve, reject) => {
        try {
            const readFile1 = new readExcel(data1);
            const readFile2 = new readExcel(data2);

            const taskArr1 = readFile1.getTaskArr();
            const taskArr2 = readFile2.getTaskArr();

            const { unmatchedArray1, unmatchedArray2 } = compareArrays(taskArr1, taskArr2);

            if(unmatchedArray1.length == 0 && unmatchedArray2.length == 0) {
                resolve('数据相同，未匹配到不同的数据');
                return;
            }

            exportFile('列表1未匹配中的数据.xlsx', unmatchedArray1)
            exportFile('列表2未匹配中的数据.xlsx', unmatchedArray2)
            resolve('剩余未匹配的数据已导入至桌面的compare文件夹下');
        } catch (error) {
            reject(error);
        }
    })
}

export default compare;