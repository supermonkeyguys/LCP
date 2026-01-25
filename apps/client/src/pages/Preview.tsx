import { useEffect, useState } from 'react';
import { Renderer } from '../components/Renderer';
import { Spin } from 'antd';

export const Preview = () => {
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        // 1. 从 URL 参数获取 ID
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id') || '65b8e9d0f1a2b3c4d5e6f7a8';
        // 2. 从后端拉取真实数据
        fetch(`http://localhost:3000/pages/${id}`)
            .then(res => res.json())
            .then(data => setPageData(data))
            .catch(err => console.error(err));
    }, []);

    if (!pageData) return <div className="flex justify-center mt-20"><Spin size="large" /></div>;

    return (
        <div style={{ minHeight: '100vh', background: '#fff' }}>
            {/* 预览模式下，Renderer 依然工作，但没有编辑器外壳 */}
            <Renderer node={pageData} />
        </div>
    );
};