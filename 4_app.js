//There is 2 main functions: itemDropActions, itemDragActions
//itemDragActions is a function wich in general adds to item some drag and drop features
//itemDropActions is a function wich declares what will heppend to item when drag and drop action will end
//and also there 1 config object wich should be edited if needed

const   container = document.querySelector(CONFIG.coreElementsSelectors.container),
        everythingHolder = document.getElementById('pahlava'), //holds workZone
        workZoneHolder = document.querySelector(CONFIG.coreElementsSelectors.workZoneHolder),
        workZone = document.querySelector(CONFIG.coreElementsSelectors.workZoneIdentifier), // field or div where droped items are located
        itemPanel = document.querySelector(CONFIG.coreElementsSelectors.itemPanel),
        rootItems = document.querySelectorAll(CONFIG.coreElementsSelectors.rootIremsIdentifier), // items wich are basis of items in workZone
        rootItemsSeparator = document.querySelector(CONFIG.coreElementsSelectors.rootItemsSeparator);

let     amountOfItemsInWorkZone = document.querySelectorAll('.field-item').length,
        amountOfWorkSpacesInWorkZone = document.querySelectorAll('.work-space').length,
        elementsOfSchema = [], // array with movable items inside the work field
        newElementOfSchema,
        shiftX, shiftY,
        workFieldSelectedAsDropTarget = null,
        workSpaceItemSelectedAsDropTarget = null,
        dropTarget = null,
        currentItem = null,
        contextMenu = null,
        contextMenuContent = null,
        
        //preventing moving of item when just clicking on it, becouse every time when
        //user clicks on item, it gains coordinates of mouse as a top and left value and
        //then transforming it from px into % depends on workZone, this leads to unnecesory little moving,
        //becouse % is not accurate enough value to hold transformed current position of item in px
        //setTimeout(()=>{enableItemPositionCalculationMethod = false},10)
        enableItemPositionCalculationMethod = false,
        pressedMiddleMouseButtonCoordinates = {
            x: null,
            y: null
        },
        pressedMiddleMouseButtonScrollCoordinates = {
            x: null,
            y: null
        }
        scrollPosition = {
            left: 0, //%
            top: 0, //%
        };

//UI orientation initialization
workZone.className = `${workZone.className} ${workZone.className}-${CONFIG.UI.panelOrientation}`;
rootItemsSeparator.className = `${rootItemsSeparator.className} ${rootItemsSeparator.className}-${CONFIG.UI.panelOrientation}`
itemPanel.className = `${itemPanel.className} ${itemPanel.className}-${CONFIG.UI.panelOrientation}`;
container.className = `${container.className} ${container.className}-${CONFIG.UI.panelOrientation}`;

//initial workZone params, width and height
workZone.style.width = `${CONFIG.UI.defaultWorkZoneOffsets.width}px`;
workZone.style.height = `${CONFIG.UI.defaultWorkZoneOffsets.height}px`;

document.body.style.display = '';

//TODO Make this stuff responsive to screen changing, white(blank) spaces near workZone
setTimeout(() => {
    workZoneHolder.style.width = `${workZone.offsetWidth + document.body.offsetWidth * 1.5}px`;
    workZoneHolder.style.height = `${workZone.offsetHeight + document.body.offsetHeight * 1.5}px`;
    //initial scroll position, scroll can be setted up only if workZoneHolder with and haight are configured
    everythingHolder.scrollTop = workZoneHolder.offsetHeight/2 - everythingHolder.offsetHeight / 2;
    everythingHolder.scrollLeft = workZoneHolder.offsetWidth/2 - everythingHolder.offsetWidth / 2;
},10)

//Initialization root items, making them be dependent of config
rootItems.forEach((element)=>{
    element.className = `${element.className} ${element.className}-${CONFIG.UI.panelOrientation}`;
    //root item's width and height initialisation
    element.style.width = `${CONFIG.UI.defaultWorkZoneItemsOffsets.width}px`;
    element.style.height = `${CONFIG.UI.defaultWorkZoneItemsOffsets.height}px`;
    element.style.borderRadius = `${CONFIG.UI.defaultWorkZoneItemBorderRadius}px`;
    //root item's icon width and height initialisation
    if (element.getAttribute('i-name') == "work_space") {
        element.childNodes[1].childNodes[1].style.width = `${CONFIG.UI.defaultWorkZoneItemImageOffsets.width}px`;
        element.childNodes[1].childNodes[1].style.height = `${CONFIG.UI.defaultWorkZoneItemImageOffsets.height}px`;
        element.childNodes[1].childNodes[1].className = `drag-and-drop-unit-image`;
    } else {
        element.childNodes[1].style.width = `${CONFIG.UI.defaultWorkZoneItemImageOffsets.width}px`;
        element.childNodes[1].style.height = `${CONFIG.UI.defaultWorkZoneItemImageOffsets.height}px`;
        element.childNodes[1].className = `drag-and-drop-unit-image`;
    }

    element.ondragstart = () => false;
    if (element.getAttribute('i-name') == 'work_space') {
        element.childNodes[1].childNodes.forEach(element => {
            element.ondragstart = () => false;        
        })
    } else {
        element.childNodes.forEach(element => {
            element.ondragstart = () => false;        
        })
    }
})

//loop wich allows to accept all needed functions to every root item
for (let i = 0; i < rootItems.length; i++) {
    rootItems[i].onmousedown = (event) => {
        createNewItem(event, rootItems[i]);
        //Variable has been assigned in createNewItem function
        moveAt(event, newElementOfSchema, shiftX, shiftY);
        addDragAndDropToItem(newElementOfSchema);
    }
}

document.body.onmousedown = (event) => {
    if (!document.elementFromPoint(event.clientX, event.clientY).closest('.context-menu-item')) {
        removeContextMenu()
    }
}

//disable default context menu
document.oncontextmenu = () => false;

workZoneHolder.onmousewheel = (e) => {
    if (e.ctrlKey) {
        e.preventDefault();

        if(e.deltaY == 100){
            zoom('out', CONFIG.UI.zoomStep);
        }

        if(e.deltaY == -100){
            zoom('in', CONFIG.UI.zoomStep);
        }
    }
}

workZoneHolder.onmousedown = (e) => {
    pressedMiddleMouseButtonCoordinates = {
        x: e.clientX,
        y: e.clientY
    }

    pressedMiddleMouseButtonScrollCoordinates = {
        x: everythingHolder.scrollLeft,
        y: everythingHolder.scrollTop
    }

    if (e.buttons == 4) {
       e.preventDefault();
    }

    workZoneHolder.onmousemove = (e) => {
        if (e.buttons == 4) {
            everythingHolder.scrollLeft = pressedMiddleMouseButtonScrollCoordinates.x - 
            (e.clientX - pressedMiddleMouseButtonCoordinates.x)
            everythingHolder.scrollTop = pressedMiddleMouseButtonScrollCoordinates.y - 
            (e.clientY - pressedMiddleMouseButtonCoordinates.y)
            everythingHolder.style.cursor = 'grab';
        }
    }

    workZoneHolder.onmouseup = (e) => {
            everythingHolder.style.cursor = 'default';
    }
}



// let incomingJson = {
//     cabinet: {
//         number: 221,
//         items: [
//             {
//                 code: '1011123331',
//                 name: 'Принтер 1',
//                 description: 'Не друкує'
//             },
//             {
//                 code: '1011123332',
//                 name: 'Монітор philips))',
//                 description: 'Показує добренько'
//             }
//         ]
//     }
// }

// const   btn1 = document.getElementById('debug_button_1'),
//         btn2 = document.getElementById('debug_button_2');  
        
// btn1.onclick = () => {
//     //itemsMenu(everythingHolder, availableItems, 'open')
// }

// btn2.onclick = () => {
//     //itemsMenu(everythingHolder, availableItems, 'close')
// }