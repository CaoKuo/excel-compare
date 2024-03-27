import { Button, Card, InputNumber, message, Space, Upload } from "antd";
import type { UploadProps } from 'antd';
import { MinusOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import React, { forwardRef, useImperativeHandle, useState } from "react";
import './index.less';

// 子组件
interface ChildProps {
    title: string; // 子组件期望接收一个名为value的prop
    columnsNum: number,
    changeColumnsNum: Function,
}

const File = forwardRef<any, ChildProps>((props, ref) => {
    const { title, columnsNum, changeColumnsNum } = props;

    const [top, setTop] = useState<number>(1);
    const [columns, setColumns] = useState<Array<number>>(Array.from({length: columnsNum}))
    const [uploadFile, setUploadFile] = useState({
        name: '',
        file: null,
    })

    const onTopChange = (value: number) => {
        setTop(value);
    }

    const onChange = (value: number, index: number) => {
        let newArray: Array<number> = Array.from({length: columnsNum});
        newArray = [
            ...columns
        ]
        newArray[index] = value;
        setColumns(newArray);
    }

    const addColumns = () => {
        let num = columnsNum;
        num = num + 1;
        changeColumnsNum(num);
    }

    const reduceColumns = () => {
        let num = columnsNum;
        num = num - 1;
        changeColumnsNum(num);
    }

    const inputDom = [];
    for(let i = 0; i < columnsNum; i ++) {
        inputDom.push(
            <InputNumber key={i} value={columns[i]} min={1} max={100000} onChange={(value) => onChange(value, i)} />
        )
    }

    const onFileChange = (file: any) => {
        setUploadFile({
            name: file.file.name,
            file: file.file
        })
    }

    const uploadProps: UploadProps = {
        accept: '.xlsx, .xls',
        fileList: [],
        customRequest: onFileChange
    }

    useImperativeHandle(ref, () => ({
        getColumns: () => columns,
        getFile: () => uploadFile.file,
        getTop: () => top,
    }))

    return  (
        <Card title={title}>
            <Space direction="vertical" size="small"  style={{ display: 'flex' }}>
                <div className="file_wrapper">
                    <div className="file_title">需要比较的文件</div>
                    <div className="file_content">
                        {
                            uploadFile.file ? 
                            <div className="file_name">{uploadFile.name}</div>
                            :
                            <Upload {...uploadProps}>
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload>
                        }
                    </div>
                </div>
                <div className="top_wrapper">
                    <div className="top_title">文件顶部所占用的行数</div>
                    <InputNumber value={top} min={1} max={100} onChange={onTopChange} />
                </div>
                <div className="bottom_title">文件所需对比的列</div>
                <Space wrap>
                    {inputDom}
                    <Button shape="circle" icon={<PlusOutlined />} disabled={columnsNum >= 100} onClick={addColumns} />
                    <Button shape="circle" icon={<MinusOutlined />} disabled={columnsNum <= 1} onClick={reduceColumns} />
                </Space>
            </Space>
        </Card>
    )
})

export default File