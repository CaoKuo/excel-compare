import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Space } from 'antd';
import File from '../components/File/index';

// 声明 Electron API 的类型
interface ElectronAPI {
    readFile: any
    showMssage: any,
}

// 在 Window 接口中扩展 ElectronAPI
declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

const App: React.FC = () => {
    const [columnsNum, setColumnsNum] = useState(1);

    const fileOneRef = useRef(null);
    const fileTwoRef = useRef(null);

    const changeColumnsNum = (value: number) => {
        setColumnsNum(value);
    }

    const readFileAsArrayBuffer = (file: any) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = function(event) {
                const arrayBuffer = event.target.result as ArrayBuffer;
                const buffer = new Uint8Array(arrayBuffer);
                resolve(buffer);
            };
            reader.onerror = function(event) {
                reject(event.target.error);
            };
        });
    };
    

    const compare = async () => {
        const basic: { [key: string]: any } = {
            sheet: 0,
            top: 1,
            columns: [],
            file: null,
        }
        let data1 = { ...basic };

        let data2 = { ...basic };

        if (fileOneRef.current) {
            data1.columns = fileOneRef.current.getColumns(); // 获取子组件的columns值
            data1.top = fileOneRef.current.getTop();
            const file = fileOneRef.current.getFile();
            data1.file = await readFileAsArrayBuffer(file);
        }
        if(fileTwoRef.current) {
            data2.columns = fileTwoRef.current.getColumns(); // 获取子组件的columns值
            data2.top = fileTwoRef.current.getTop();
            const file = fileTwoRef.current.getFile();
            data2.file = await readFileAsArrayBuffer(file);
        }

        window.electronAPI.readFile(data1, data2)
    }

    useEffect(() => {
        window.electronAPI.showMssage((tips: string) => {
            message.success(tips);
        })
    }, [])

    return (
        <div className='App'>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <File ref={fileOneRef} title={'文件1'} columnsNum={columnsNum} changeColumnsNum={changeColumnsNum} />
                <File ref={fileTwoRef} title={'文件2'} columnsNum={columnsNum} changeColumnsNum={changeColumnsNum} />
                <Button type="primary" onClick={compare}>开始对比</Button>
            </Space>
        </div>
    )
}

export default App;