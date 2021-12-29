let CONFIG = {
    coreElementsSelectors: {
        container: '.container',
        workZoneHolder: '#main_field_holder',
        workZoneIdentifier: '#main_field',
        rootIremsIdentifier: '.drag-and-drop-item',
        rootItemsSeparator: '.drag-and-drop-items-separator',
        itemPanel: '.items-panel',
    },
    logic: {
        itemOpacityWhileMoving: 0.5,
        outOfZoneAnimationTime: 0.3, //(s)
        itemMovingOffsetFromWorkZoneBorder: 5, //px
        workSpaceItemDropType: 0, //defines type of algorythm will be used for item wich is dropping into workspace
        contextMenuOpeningSpeed: 0.1, //s
    },
    UI: {
        panelOrientation: 'bottom',
    }
}

const   container = document.querySelector(CONFIG.coreElementsSelectors.container),
        workZoneHolder = document.querySelector(CONFIG.coreElementsSelectors.workZoneHolder),
        workZone = document.querySelector(CONFIG.coreElementsSelectors.workZoneIdentifier), // field or div where droped items are located
        rootItems = document.querySelectorAll(CONFIG.coreElementsSelectors.rootIremsIdentifier), // items wich are basis of items in workZone
        rootItemsSeparator = document.querySelector(CONFIG.coreElementsSelectors.rootItemsSeparator),
        itemPanel = document.querySelector(CONFIG.coreElementsSelectors.itemPanel)

workZoneHolder.className = `${workZoneHolder.className} ${workZoneHolder.className}-${CONFIG.UI.panelOrientation}`;
workZone.className = `${workZone.className} ${workZone.className}-${CONFIG.UI.panelOrientation}`;
rootItemsSeparator.className = `${rootItemsSeparator.className} ${rootItemsSeparator.className}-${CONFIG.UI.panelOrientation}`
itemPanel.className = `${itemPanel.className} ${itemPanel.className}-${CONFIG.UI.panelOrientation}`;
container.className = `${container.className} ${container.className}-${CONFIG.UI.panelOrientation}`;

rootItems.forEach((element)=>{
    element.className = `${element.className} ${element.className}-${CONFIG.UI.panelOrientation}`;
    element.ondragstart = () => false;
    element.childNodes.forEach(element => {
        element.ondragstart = () => false;
    })
})

document.body.style.display = '';

let incomingJson = {
    cabinet: {
        number: 221,
        items: [
            {
                code: '1011123331',
                name: 'Принтер 1',
                description: 'Не друкує'
            },
            {
                code: '1011123332',
                name: 'Монітор philips))',
                description: 'Показує добренько'
            }
        ]
    }
}
