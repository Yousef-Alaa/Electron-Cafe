import React, { useEffect } from 'react';
import { Layout, ConfigProvider } from 'antd';
import TheRoutes from './routes';
import SideBar from './componenets/SideBar';
import './App.scss';
import { useDispatch, useSelector } from 'react-redux';
import TitleBar from './componenets/TitleBar'

export function getUID() {

    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let nums = `${Math.floor(Math.random() * Date.now())}`
    let randIndexes = [
        Math.floor(Math.random() * chars.length),
        Math.floor(Math.random() * chars.length),
        Math.floor(Math.random() * chars.length)
    ]

    let uid = '';
    randIndexes.forEach(i => uid+= chars[i])
    uid += nums.substring(0, 3);

    return uid

}


function App() {
    
    const { isDark, bgLinear, colors } = useSelector(state => state.theme)
    const dispatch = useDispatch()

    useEffect(() => {
        window.electron.ipcRenderer.send('Do_You_Have_A_Data')

        window.electron.ipcRenderer.on('Yes_I_Have_Some_Data', (e, args) => {
            const { marketItems, reports, theme, units } = JSON.parse(args)

            if (marketItems) dispatch({type: 'market/setAll', payload: marketItems});
            if (reports) dispatch({type: 'reports/setAll', payload: reports});
            if (theme) dispatch({type: 'theme/setAll', payload: theme});
            if (units) dispatch({type: 'units/setAll', payload: units});
        })        
    }, [])

    useEffect(() => {
        document.documentElement.style.setProperty('--main', colors.main)
        document.documentElement.style.setProperty('--rgbmain', colors.rgbmain)
        document.documentElement.style.setProperty('--mainBg', colors.mainBg)
        document.documentElement.style.setProperty('--text', colors.text)
        document.documentElement.style.setProperty('--rgbtext', colors.rgbtext)
        document.documentElement.style.setProperty('--drawerBg', getDrawerBg())
    },[colors])

    function getDrawerBg() {
        if (isDark && bgLinear) return `linear-gradient(15deg, rgba(${colors.rgbmain}, .25) 10%, rgba(0, 0, 0, .25) 100%)`
        if (!isDark && bgLinear) return `linear-gradient(20deg, rgba(${colors.rgbmain}, .35) 10%, rgba(228, 228, 228, .22) 100%)`
        if (!isDark && !bgLinear) return `rgba(${colors.rgbmain}, .2)`
        return `rgba(0, 21, 41, .4)`
    }

    function getLayoutBg() {
        if (isDark && bgLinear) return `linear-gradient(15deg, ${colors.main} 10%, black 100%)`
        if (!isDark && bgLinear) return `linear-gradient(20deg, ${colors.main} 10%, #E4E4E4 100%)`
        if (!isDark && !bgLinear) return 'var(--bgNotDarkNotLinear)'
        return colors.mainBg
    }


    return (
        <ConfigProvider theme={{ token: {colorPrimary: colors.main} }} >
            <TitleBar />
            <Layout style={{height: '100vh', paddingTop: 30, flexDirection: 'row', background: getLayoutBg()}}>
                <SideBar />
                <Layout style={{background: 'transparent', backdropFilter: `blur(${isDark ? '3px' : '10px'})`, borderLeft: `2px solid ${colors.textWithOpacity(isDark ? 100 : 35)}`, overflow: 'hidden scroll'}}>
                    <Layout.Content style={{padding: 10, color: colors.text}}>
                        <TheRoutes />
                    </Layout.Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default App;