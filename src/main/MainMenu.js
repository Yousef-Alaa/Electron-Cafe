import { Menu } from 'electron'

const template = [
{
	label: "File",
	submenu: [
		{ role: "reload" },
        { role: "copy" },
		{ role: "cut" },
        { role: "paste" },
		{ label: 'Toggle Full Screen', role: "togglefullscreen" },
		{ type: "separator" },
		{ label: 'Exit', role: "close" },
	],
},
// {
//     label: "Edit",
//     submenu: [
//         { role: "undo" },
//         { role: "redo" },
//         { type: "separator" },
//         { role: "cut" },
//         { role: "copy" },
//         { role: "paste" },
//         { role: "delete" },
//         { type: "separator" },
//         { role: "selectAll" }
//     ],
// },
// {
//     label: "View",
//     submenu: [
// 		{ role: "reload" },
// 		{ role: "forceReload" },
// 		{ role: "toggleDevTools" },
// 		{ type: "separator" },
// 		{ role: "resetZoom" },
// 		{ role: "zoomIn" },
// 		{ role: "zoomOut" },
// 		{ type: "separator" },
// 		{ role: "togglefullscreen" },
//     ],
// },
{
    label: "Help",
    submenu: [
		{
			label: "Facebook",
			click: async () => {
			const { shell } = require("electron");
			await shell.openExternal("https://www.facebook.com/Yousseef.Alaa/");
			}
		},
		{
			label: "GitHub",
			click: async () => {
			const { shell } = require("electron");
			await shell.openExternal("https://github.com/Yousef-Alaa");
			}
		},
		{
			label: "LinkedIn",
			click: async () => {
			const { shell } = require("electron");
			await shell.openExternal("https://www.linkedin.com/in/yousef-alaa-4b54021b2");
			}
		},
		{ type: "separator" },
		{
			label: 'About',
			click: () => {
				const { dialog } = require('electron')
				dialog.showMessageBox({
					type: 'info',
					title: 'Internet Cafe',
					message: 'Internet Cafe is a system help you to manage your devices like PC, PS4 and PS5.',
					buttons: ['OK']
				})
			}
		},
/* 		{
			label: "How To Use",
			click: async () => {
				//Todo: open the video
			const { shell } = require("electron");
			await shell.openExternal("https://electronjs.org");
			}
		}, */
    ],
},
];

const ApplyMainMenu = () => Menu.setApplicationMenu( Menu.buildFromTemplate(template) );

export { ApplyMainMenu }