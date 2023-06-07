import React, { useState } from 'react';
import {
    HomeOutlined,
    BarChartOutlined,
    ShopOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { Tooltip } from 'antd'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as PlayStation} from '../assets/PlayStation-Small.svg';
import { useEffect } from 'react';

function SideBar() {

    const navigate = useNavigate()
    const location = useLocation()
    const { colors, isDark } = useSelector(state => state.theme)

    const [fullScreen, setFullScreen] = useState(false);
    const NavItems = [
        {
            key: '/',
            icon: <HomeOutlined />,
            label: "Home"
        },
        {
            key: '/market',
            icon: <ShopOutlined />,
            label: "Market"
        },
        {
            key: '/reports',
            icon: <BarChartOutlined />,
            label: "Reports"
        },
        {
            key: '/settings',
            icon: <SettingOutlined />,
            label: "Settings"
        }
        // {
        //     key: '/getapp',
        //     icon: <DownloadOutlined />,
        //     label: "Get App"
        // }
    ];
    const asideStyle = {
        backdropFilter: `blur(${isDark ? 0 : 3}px)`,
        paddingTop: 10, 
        width: 80,
        minWidth: 80,
        left: '-100%'
    }


    useEffect(() => {
        window.electron.ipcRenderer.on('appIsFullScreen', () => setFullScreen(true))
        window.electron.ipcRenderer.on('appNotInFullScreen', () => setFullScreen(false))
    }, [])

    return (
        <>
        <aside style={asideStyle}>
            <div className="logo">
                <PlayStation style={{maxWidth: '100%', fill: colors.text, height: 60, marginBottom: 8, filter: `drop-shadow(2px 4px 5px ${colors.textWithOpacity(70)})`}} />
            </div>
            <ul style={{'--fontSize': 16}}>
                {NavItems.map((item, index) => <Tooltip placement="right" key={index} title={item.label}>
                        <li 
                        style={{padding:'0 28px'}}
                        onClick={() => navigate(item.key)}
                        className={`nav-item ${item.key === location.pathname ? 'nav-item-active' : ''}`}
                        >

                        {item.icon}

                    </li>
                    </Tooltip>
                )}
            </ul>

            <span className='trigger' style={{color: colors.text}}>
                <div className="icons" onClick={() => window.electron.ipcRenderer.send('toggleFullScreen')} style={{paddingLeft: 21}}>
                    {
                        fullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />
                    }
                </div>
            </span>
        </aside>
    </>
    );
}

export default SideBar;