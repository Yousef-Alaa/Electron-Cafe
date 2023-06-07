import React from 'react';
import { ReactComponent as PlayStation} from '../assets/PlayStation-Small.svg';
import {
    VscChromeRestore, VscChromeMaximize, VscChromeMinimize, VscChromeClose
} from 'react-icons/vsc'
import { useEffect } from 'react';
import { useState } from 'react';


function TitleBar() {

    let [max, setMax] = useState(false)

    useEffect(() => {
        window.electron.ipcRenderer.on('appIsMaximized', () => setMax(true))
        window.electron.ipcRenderer.on('appNotMaximized', () => setMax(false))
    }, [])

    return (
        <div className="title-bar">
            <div style={{ WebkitAppRegion: 'drag', width: '-webkit-fill-available' }}>
                <div className="info">
                    <PlayStation />
                    <span>Electron Cafe</span>
                </div>
            </div>
            <div className="buttons">
                <button onClick={() => window.electron.ipcRenderer.send('minimizeApp')}>
                    <VscChromeMinimize />
                </button>
                <button onClick={() => window.electron.ipcRenderer.send('maximizeApp')}>
                    {max ? <VscChromeRestore /> : <VscChromeMaximize />}
                </button>
                <button onClick={() => window.electron.ipcRenderer.send('closeApp')}>
                    <VscChromeClose />
                </button>
            </div>
        </div>
    );
}

export default TitleBar;