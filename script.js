//There is 2 main functions: itemDropActions, itemDragActions
//itemDragActions is a function wich in general adds to item some drag and drop features
//itemDropActions is a function wich declares what will heppend to item when drag and drop action will end
//and also there 1 config object wich should be edited if needed

let     elementsOfSchema = [], // array with movable items inside the work field
        newElementOfSchema,
        shiftX, shiftY,
        workFieldSelectedAsDropTarget = null,
        workSpaceItemSelectedAsDropTarget = null,
        dropTarget = null,
        currentItem = null,
        contextMenu = null,
        contextMenuContent = null
           
/**
 * @param {mouse event} mouseEvent 
 * @param {item wich will be moved with mouse cursor} movableItem 
 * @param {offset wich allows user hold item in place where lmb was pressed on it (x - axes)} itemOffsetX 
 * @param {offset wich allows user hold item in place where lmb was pressed on it (y - axes)} itemOffsetY
 * @param {element on the page (div, etc) inside wich movable item can be but can`t leave} zoneForMoving 
 */
function moveAt(mouseEvent, movableItem, itemOffsetX, itemOffsetY) {
    movableItem.style.left = mouseEvent.clientX - itemOffsetX + 'px';
    movableItem.style.top = mouseEvent.clientY - itemOffsetY + 'px';
}

/**
 * @param {mouse event} event 
 * @param {basis for new item wich will be created after performing a function} rootItem 
 */
function createNewItem(event, rootItem) {
    //creates copy of selected root element and and puts it into elementsOfSchema array
    elementsOfSchema.push(rootItem.cloneNode(true))

    //append newly created element to work field and accepts its value to variable newElementOfSchema
    workZone.append(elementsOfSchema[elementsOfSchema.length-1])
    newElementOfSchema = elementsOfSchema[elementsOfSchema.length-1]

    //calculating shift of div position wich will be moved along with cursor
    //calculation made with rootItems properties
    shiftX = event.pageX - rootItem.getBoundingClientRect().left,
    shiftY = event.pageY - rootItem.getBoundingClientRect().top;

    if (newElementOfSchema.getAttribute('i-name') == 'work_space') {
        //newElementOfSchema is a work-space-head and work-space-container holder
        newElementOfSchema.className = 'work-space';
        newElementOfSchema.childNodes[1].style = null;
        //acceapt work-space-head class to first cild div (image holder)
        newElementOfSchema.childNodes[1].className = 'work-space-head';
    } else {
        newElementOfSchema.className = 'field-item'
    }

    //set newly created item opacity to value wich is mentioned in config as itemOpacityWhileMoving
    newElementOfSchema.style.opacity = CONFIG.logic.itemOpacityWhileMoving;

    newElementOfSchema.ondragstart = () => false;

    newElementOfSchema.childNodes.forEach(element => {
        element.ondragstart = () => false;
    });
}

/**
 * Add drag and dtop to item and also adds some features like context menu by releasing lmb
 * @param {selected item} item 
 */
function addDragAndDropToItem(item) {
    item.onmousedown = (event) => {
        itemDragActions(item,event)
        removeContextMenu()
    }
    itemDragActions(item,event)
}

/**
 * actions wich happens while drag and drop event is going
 * @param {item of actions} item 
 */
function itemDragActions(item, event) {
    item.onmouseup = () => {
        /**
         * If workspace item has more than 1 child item and user wants to click on this child item
         * if statement down below prevent workspace item context menu appearing
         */
        if (event.buttons == 2) {
            if (item.className == 'work-space-container-item') {
                item.parentNode.parentNode.setAttribute('i-is-selectable', 'false');
            }
    
            if(item.getAttribute('i-is-selectable') == 'true') {
                showContextMenuOfItem(item, event);
                currentItem = null
            }
        }
    }

    //set this variable to null as default value for every newly created item
    workFieldSelectedAsDropTarget = null;
    workSpaceItemSelectedAsDropTarget = null;
    workSpaceContainerItemSelectedAsMoveTarget = null;

    shiftX = event.pageX - item.getBoundingClientRect().left;
    shiftY = event.pageY - item.getBoundingClientRect().top;

    if (!currentItem) {
        currentItem = 
        document.elementFromPoint(event.clientX, event.clientY).closest('.work-space-container-item');
    }

    document.body.onmousemove = (event) => {
        if (event.buttons == 1) {
            
            if(contextMenu) {
                removeContextMenu()
            }

            if(currentItem) {
                item = currentItem
                shiftX = event.pageX - item.getBoundingClientRect().left;
                shiftY = event.pageY - item.getBoundingClientRect().top;
                item.className = 'field-item' 
                workZone.append(item)
                moveAt(event, item, shiftX, shiftY);   
                item.style.opacity = CONFIG.itemOpacityWhileMoving;
                /**
                * If workspace item is empty and has no workspace container item childs
                * set display to none for third workspace child (workspace item container)
                */
                elementsOfSchema.forEach(element => {
                    if (element.className == 'work-space' && 
                        element.style.display == 'flex' &&
                        element.childNodes[3].childNodes.length == 1) {    
                        element.childNodes[3].style.display = 'none';
                    }
                });
                currentItem = null
            }

            item.onmouseup = null

            moveAt(event, item, shiftX, shiftY);           
            item.style.opacity = CONFIG.logic.itemOpacityWhileMoving;
            //To get information about what we have under the item wich moving with cursor, we should do checking when actual item 
            //is invisible, so in this case we will get correct information for workFieldSelectedAsDropTarget variable
            item.style.display = 'none';
            workFieldSelectedAsDropTarget = 
            document.elementFromPoint(event.clientX, event.clientY).closest('#main_field');

            if (CONFIG.logic.workSpaceItemDropType == 0) {
                /**
                 * Use this realisation if worspace drop target needed to be just entire div
                 */
                workSpaceItemSelectedAsDropTarget = 
                document.elementFromPoint(event.clientX, event.clientY).closest('.work-space');
            } else if(CONFIG.logic.workSpaceItemDropType == 1) {
                /**
                 * Use realisation described down below if needed to separate drop target to 2 components such as work-space-head
                 * and work-space-item-container
                 */
                workSpaceItemSelectedAsDropTarget = 
                document.elementFromPoint(event.clientX, event.clientY).closest('.work-space-head');
                if(!workSpaceItemSelectedAsDropTarget) {
                    workSpaceItemSelectedAsDropTarget = 
                    document.elementFromPoint(event.clientX, event.clientY).closest('.work-space-item-container');
                }
            }
            
            item.style.zIndex = '2000';
            item.style.display = 'flex';
        }
    }

    document.body.onmouseup = () => {
        itemDropActions(item, CONFIG.logic.workSpaceItemDropType, workFieldSelectedAsDropTarget, workSpaceItemSelectedAsDropTarget);
    }
}

/**
 * Decides how item should behave when mouse moving is done and lmb has been released
 * @param {*} item 
 * @param {*} workFieldSelectedAsDropTarget 
 * @param {*} isItemNewlyCreatedFromRoot 
 */
function itemDropActions(item, workSpaceItemDropType, workFieldSelectedAsDropTarget, workSpaceItemSelectedAsDropTarget) {
    item.style.opacity = 1;
    item.style.zIndex = '1000'
    item.style.transition = `all ease-in-out 0s`;
    item.setAttribute('i-is-selectable', 'true');

    if (workFieldSelectedAsDropTarget == null 
    && (workZone.getBoundingClientRect().left > item.getBoundingClientRect().right
    || workZone.getBoundingClientRect().right < item.getBoundingClientRect().left 
    || workZone.getBoundingClientRect().top > item.getBoundingClientRect().bottom
    || workZone.getBoundingClientRect().bottom < item.getBoundingClientRect().top)) {
        console.log('item should be deleted')
        item.remove();
    } 

    if ((workZone.getBoundingClientRect().left > item.getBoundingClientRect().left) 
    || (workZone.getBoundingClientRect().right < item.getBoundingClientRect().right)
    || (workZone.getBoundingClientRect().top > item.getBoundingClientRect().top)
    || (workZone.getBoundingClientRect().bottom < item.getBoundingClientRect().bottom)) {
        item.style.transition = `all ease-in-out ${CONFIG.logic.outOfZoneAnimationTime}s`
        setTimeout(() => {
            item.style.transition = `all ease-in-out 0s`;
        }, CONFIG.logic.outOfZoneAnimationTime*1000)
    }

    if (workZone.getBoundingClientRect().left > item.getBoundingClientRect().left) {
        item.style.left = workZone.getBoundingClientRect().left +
        CONFIG.logic.itemMovingOffsetFromWorkZoneBorder + 'px';
    }

    if (workZone.getBoundingClientRect().right < item.getBoundingClientRect().right) {
        item.style.left = workZone.getBoundingClientRect().right -
        CONFIG.logic.itemMovingOffsetFromWorkZoneBorder - item.offsetWidth + 'px';
    }

    if (workZone.getBoundingClientRect().top > item.getBoundingClientRect().top) {
        item.style.top = workZone.getBoundingClientRect().top +
        CONFIG.logic.itemMovingOffsetFromWorkZoneBorder + 'px';
    }

    if (workZone.getBoundingClientRect().bottom < item.getBoundingClientRect().bottom) {
        item.style.top = workZone.getBoundingClientRect().bottom -
        CONFIG.logic.itemMovingOffsetFromWorkZoneBorder - item.offsetHeight + 'px';
    }

    if (workSpaceItemSelectedAsDropTarget) {
        if (item.getAttribute('i-type') == 'structure') {
            //do nothing if work_space tring to drop on work_space
        } else if (workSpaceItemDropType == 0) {
            workSpaceItemSelectedAsDropTarget.childNodes[3].appendChild(item);
            workSpaceItemSelectedAsDropTarget.childNodes[3].style.display = 'flex';
            item.style = null;
            item.className = 'work-space-container-item';
        } else if (workSpaceItemDropType == 1) {
            workSpaceItemSelectedAsDropTarget.parentNode.childNodes[3].appendChild(item);
            workSpaceItemSelectedAsDropTarget.parentNode.childNodes[3].style.display = 'flex';
            item.style = null;
            item.className = 'work-space-container-item';
        }
    }
    document.body.onmousemove = null;
    document.body.onmouseup = null;
}

/**
 * Showing context menu with releted to selected item content
 * @param {selected item} item 
 */
function showContextMenuOfItem(item, event) {
    removeContextMenu()
    contextMenu = document.createElement('div')
    contextMenu.className = 'context-menu'
    workZone.append(contextMenu)
    contextMenuContent = [
        {
            name:`${event.clientX}, ${event.clientY}`,
            method: () => {
                alert(contextMenuContent[0].name)
                removeContextMenu()
            },
        },
        {
            name:`${item.getAttribute('i-name')}`,
            method: () => {
                console.log(contextMenuContent[1].name)
                removeContextMenu()
            },
        }
    ]

    contextMenuContent.forEach((element, index) => {
        contextMenu.innerHTML = contextMenu.innerHTML +
        `
            <div class="context-menu-item" onclick="contextMenuContent[${index}].method()">
                ${element.name}
            <div>
        `
    })

    contextMenu.style.transition = `all ease-in-out ${CONFIG.logic.contextMenuOpeningSpeed}s`
    contextMenu.style.top = `${event.clientY + 2}px`
    contextMenu.style.left = `${event.clientX + 2}px`
    contextMenu.style.zIndex = 2001;
    setTimeout(()=>{
        contextMenu.style.opacity = 1
    },10)
}

function removeContextMenu() {
    contextMenu = document.querySelector('.context-menu')
    if (contextMenu) {
        contextMenu.remove()
        console.log('context menu has been deleted')
    }
    contextMenuContent = null;
}

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

document.oncontextmenu = () => false;



