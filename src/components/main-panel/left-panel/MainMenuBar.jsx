import React, { useState } from 'react';
import './menuBar.css';
import {
    DownloadPanelIcon,
    GraphicsPanelIcon,
    ImagePanelIcon,
    TextPanelIcon,
    UploadPanelIcon,
    BackToHomeIcon,
} from '../../../assets/icons';
import UploadPanel from './UploadPanel';
import Elements from './Elements';
import TextPanel from './TextPanel';
import Attributes from './Attributes';
import { useSelector } from 'react-redux';

// color settings
const iconColor = '#ffffff';
const selectedIconColor = '#ffffff';

function MainMenuBar() {
    const [toggleSubMenu, setToggleSubMenu] = useState(false);
    const [activeKey, setActiveKey] = useState('1');
    const { canvas } = useSelector((state) => state.canvas);

    const toggleOpen = (key) => {
        if (key === activeKey && toggleSubMenu) {
            setToggleSubMenu(false);
        } else {
            setToggleSubMenu(true);
            setActiveKey(key);
        }
    };

    const download = () => {
        const dataURL = canvas.toDataURL({
            format: 'png',
            multiplier: 2,
        });

        // Create a download link and trigger the download
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `design.png`;
        link.click();
    };

    const navigateToHome = () => {
        // Use window.location.href to navigate to the specified URL
        window.location.href = 'http://205.134.238.117/~art/dipartstore/customization/';
    };

    return (
        <div className="gnr-ed-toolbar-wrapper">
            <div className="toolbar_menu">
                <div
                    onClick={() => toggleOpen('2')}
                    className={`tools_element d-flex flex-column align-items-center justify-content-center ${
                        activeKey === '2' ? 'active-tab' : ''
                    }`}
                >
                    <GraphicsPanelIcon fill={activeKey === '2' ? selectedIconColor : iconColor} />
                    <span className="tools_title">Background</span>
                </div>
                <div
                    onClick={() => toggleOpen('3')}
                    className={`tools_element d-flex flex-column align-items-center justify-content-center ${
                        activeKey === '3' ? 'active-tab' : ''
                    }`}
                >
                    <UploadPanelIcon fill={activeKey === '3' ? selectedIconColor : iconColor} />
                    <span className="tools_title">Uploads</span>
                </div>
                <div
                    onClick={() => toggleOpen('4')}
                    className={`tools_element d-flex flex-column align-items-center justify-content-center ${
                        activeKey === '4' ? 'active-tab' : ''
                    }`}
                >
                    <TextPanelIcon fill={activeKey === '4' ? selectedIconColor : iconColor} />
                    <span className="tools_title">Texts</span>
                </div>
                <div
                    onClick={() => download()}
                    className={`tools_element d-flex flex-column align-items-center justify-content-center`}
                >
                    <DownloadPanelIcon fill={iconColor} />
                    <span className="tools_title">Download</span>
                </div>
                <div
                    onClick={() => navigateToHome()}
                    className={`tools_element d-flex flex-column align-items-center justify-content-center ${
                        activeKey === '1' ? 'active-tab' : ''
                    }`}
                >
                    <BackToHomeIcon fill={activeKey === '1' ? selectedIconColor : iconColor} />
                    <span className="tools_title">Back to Site</span>
                </div>
            </div>
            <div className={`toolbar_sub_menu left-panel`}>
                {activeKey === '2' && <UploadPanel />}
                {activeKey === '3' && <Elements />}
                {activeKey === '4' && <TextPanel />}
            </div>
        </div>
    );
}

export default MainMenuBar;
