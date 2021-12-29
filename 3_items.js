/**
 * Fill item panel with items, wich are declared in special object
 * @param {string} itemPanel identifier of panel wich contains items
 * @param {object} objectWithItems JSON object with available items
 */
function fillItemPanelWithItems(itemPanel, objectWithItems) {
    let itemPanelFolder = document.createElement('div');
    let itemPanelElement = document.createElement('div');
    //specific item panel element creation
    let itemPanelWorkSpaceElement = document.createElement('div');
    let itemPanelElementContainer = document.createElement('div');
    
    itemPanelElement.appendChild(document.createElement('img'));

    //adding some things to specific element
    itemPanelWorkSpaceElement.appendChild(document.createElement('div'));
    itemPanelWorkSpaceElement.childNodes[0].appendChild(document.createElement('img'));
    itemPanelWorkSpaceElement.appendChild(document.createElement('div'));

    console.log(itemPanelWorkSpaceElement)
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

    if (newElementOfSchema.getAttribute('i-name') == 'work_space') {
        //newElementOfSchema is a work-space-head and work-space-container holder
        newElementOfSchema.style = null;
        newElementOfSchema.className = 'work-space';
        newElementOfSchema.style.padding = `${CONFIG.UI.workSpace.mainDiv.padding * CONFIG.UI.workZoneCurrentScale}px`;
        newElementOfSchema.style.borderRadius = `${CONFIG.UI.defaultWorkZoneItemBorderRadius * CONFIG.UI.workZoneCurrentScale}px`;
        //acceapt work-space-head class to first cild div (image holder)
        newElementOfSchema.childNodes[1].className = 'work-space-head';
        //accepting `unit-image` class to an image of every created div gives system possibility to detect
        //this image by selector and do some fency stuff about zooming it
        newElementOfSchema.childNodes[1].childNodes[1].className = `unit-image`;
        newElementOfSchema.childNodes[1].style.width = 
            `${CONFIG.UI.workSpace.defaultOffsetsWorkSpaceHead.width * CONFIG.UI.workZoneCurrentScale}px`;
        newElementOfSchema.childNodes[1].style.height = 
            `${CONFIG.UI.workSpace.defaultOffsetsWorkSpaceHead.height * CONFIG.UI.workZoneCurrentScale}px`;
        newElementOfSchema.childNodes[1].childNodes[1].style.width = 
            `${CONFIG.UI.defaultWorkZoneItemImageOffsets.width * CONFIG.UI.workZoneCurrentScale}px`;
        newElementOfSchema.childNodes[1].childNodes[1].style.height = 
            `${CONFIG.UI.defaultWorkZoneItemImageOffsets.height * CONFIG.UI.workZoneCurrentScale}px`;
    } else {
        newElementOfSchema.className = 'field-item';
        newElementOfSchema.style.width = `${CONFIG.UI.defaultWorkZoneItemsOffsets.width * CONFIG.UI.workZoneCurrentScale}px`;
        newElementOfSchema.style.height = `${CONFIG.UI.defaultWorkZoneItemsOffsets.height * CONFIG.UI.workZoneCurrentScale}px`;
        newElementOfSchema.style.borderRadius = `${CONFIG.UI.defaultWorkZoneItemBorderRadius * CONFIG.UI.workZoneCurrentScale}px`;
        newElementOfSchema.childNodes[1].className = `unit-image`;
        newElementOfSchema.childNodes[1].style.width = `${CONFIG.UI.defaultWorkZoneItemImageOffsets.width * CONFIG.UI.workZoneCurrentScale}px`;
        newElementOfSchema.childNodes[1].style.height = `${CONFIG.UI.defaultWorkZoneItemImageOffsets.height * CONFIG.UI.workZoneCurrentScale}px`;
    }

    //becouse workZone item
    if (newElementOfSchema.getAttribute('i-name')=='work_space') {
        shiftX = (event.pageX - rootItem.getBoundingClientRect().left +
            CONFIG.UI.workSpace.gapBetweenContainedItems * 2) * CONFIG.UI.workZoneCurrentScale
        + workZone.getBoundingClientRect().left;
        shiftY = (event.pageY - rootItem.getBoundingClientRect().top +
            CONFIG.UI.workSpace.gapBetweenContainedItems * 2) * CONFIG.UI.workZoneCurrentScale
        + workZone.getBoundingClientRect().top;
    } else {
        shiftX = (event.pageX - rootItem.getBoundingClientRect().left) * CONFIG.UI.workZoneCurrentScale
        + workZone.getBoundingClientRect().left;
        shiftY = (event.pageY - rootItem.getBoundingClientRect().top) * CONFIG.UI.workZoneCurrentScale
        + workZone.getBoundingClientRect().top;
    }

    //set newly created item opacity to value wich is mentioned in config as itemOpacityWhileMoving
    newElementOfSchema.style.opacity = CONFIG.logic.itemOpacityWhileMoving;
    newElementOfSchema.ondragstart = () => false;
    newElementOfSchema.childNodes.forEach(element => {
        element.ondragstart = () => false;
    });
}

/**
 * @param {event} mouseEvent mouse event
 * @param {object} movableItem item wich will be moved with mouse cursor
 * @param {int} itemOffsetX offset wich allows user hold item in place where lmb was pressed on it (x - axes)
 * @param {int} itemOffsetY offset wich allows user hold item in place where lmb was pressed on it (y - axes)
 */
function moveAt(mouseEvent, movableItem, itemOffsetX, itemOffsetY) {
    movableItem.style.left = mouseEvent.clientX - itemOffsetX + 'px';
    movableItem.style.top = mouseEvent.clientY - itemOffsetY + 'px';
}

/**
 * Add drag and dtop to item and also adds some features like context menu by releasing lmb
 * @param {object} item selected item 
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
 * @param {object} item item of actions
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
    //getting scroll position, when item has been spawned
    initialScrollPosition = {
        x: everythingHolder.scrollLeft,
        y: everythingHolder.scrollTop
    };
    newScrollPosition = {
        x: null,
        y: null,
    };
    shiftX = event.pageX - item.getBoundingClientRect().left + workZone.getBoundingClientRect().left;
    shiftY = event.pageY - item.getBoundingClientRect().top + workZone.getBoundingClientRect().top;

    if (!currentItem) {
        currentItem = 
        document.elementFromPoint(event.clientX, event.clientY).closest('.work-space-container-item');
    }

    mouseEvent = {
        clientX: null,
        clientY: null
    }
    
    document.body.onmousemove = (event) => {
        if (event.buttons == 1) {
            enableItemPositionCalculationMethod = true;
            if(contextMenu) {
                removeContextMenu()
            }
            newScrollPosition.y = everythingHolder.scrollTop;
            newScrollPosition.x = everythingHolder.scrollLeft;
            if (newScrollPosition.x != initialScrollPosition.x 
                || newScrollPosition.y != initialScrollPosition.y) {
                mouseEvent.clientX = event.clientX + (newScrollPosition.x - initialScrollPosition.x);
                mouseEvent.clientY = event.clientY + (newScrollPosition.y - initialScrollPosition.y);
            } else {
                mouseEvent.clientX = event.clientX;
                mouseEvent.clientY = event.clientY;
            }
            console.log(initialScrollPosition)
            // var x = (event.pageX - everythingHolder.offsetLeft) + everythingHolder.scrollLeft;
            // var y = (event.pageY - everythingHolder.offsetTop) + everythingHolder.scrollTop;
            //console.log(x, y)
            if(currentItem) {
                item = currentItem
                shiftX = event.pageX - item.getBoundingClientRect().left + workZone.getBoundingClientRect().left;
                shiftY = event.pageY - item.getBoundingClientRect().top + workZone.getBoundingClientRect().top;
                item.className = 'field-item' 
                workZone.append(item)
                calculatePositionForItems(item)
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
            // mouseEvent.clientX = x;
            // mouseEvent.clientY = y;
            moveAt(mouseEvent, item, shiftX, shiftY);           
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
        enableItemPositionCalculationMethod = false;
        console.log('item should be deleted')
        item.remove();
    } 

    if ((workZone.getBoundingClientRect().left > item.getBoundingClientRect().left) 
    || (workZone.getBoundingClientRect().right < item.getBoundingClientRect().right)
    || (workZone.getBoundingClientRect().top > item.getBoundingClientRect().top)
    || (workZone.getBoundingClientRect().bottom < item.getBoundingClientRect().bottom)) {
        enableItemPositionCalculationMethod = false;
        item.style.transition = `all ease-in-out ${CONFIG.logic.outOfZoneAnimationTime}s`
        setTimeout(() => {
            item.style.transition = `all ease-in-out 0s`;
        }, CONFIG.logic.outOfZoneAnimationTime*1000)
    }

    if (workZone.getBoundingClientRect().left > item.getBoundingClientRect().left) {
        enableItemPositionCalculationMethod = false;
        item.style.left =
        CONFIG.logic.itemMovingOffsetFromWorkZoneBorder + '%';
        item.style.top =
        item.offsetTop / workZone.offsetHeight * 100  + '%';
    }

    if (workZone.getBoundingClientRect().right < item.getBoundingClientRect().right) {
        enableItemPositionCalculationMethod = false;
        item.style.left = 100 - (CONFIG.UI.defaultWorkZoneItemsOffsets.width * CONFIG.UI.workZoneCurrentScale /
             workZone.offsetWidth * 100) - CONFIG.logic.itemMovingOffsetFromWorkZoneBorder + '%';
        item.style.top =
        item.offsetTop / workZone.offsetHeight * 100  + '%';
    }

    if (workZone.getBoundingClientRect().top > item.getBoundingClientRect().top) {
        enableItemPositionCalculationMethod = false;
        item.style.top = 
        CONFIG.logic.itemMovingOffsetFromWorkZoneBorder + '%';
        item.style.left =
        item.offsetLeft / workZone.offsetWidth * 100  + '%';
    }

    if (workZone.getBoundingClientRect().bottom < item.getBoundingClientRect().bottom) {
        enableItemPositionCalculationMethod = false;
        item.style.top = 100 - (CONFIG.UI.defaultWorkZoneItemsOffsets.height * CONFIG.UI.workZoneCurrentScale /
             workZone.offsetHeight * 100) - CONFIG.logic.itemMovingOffsetFromWorkZoneBorder + '%';
        item.style.left =
        item.offsetLeft / workZone.offsetWidth * 100  + '%';
    }

    if (workSpaceItemSelectedAsDropTarget) {
        if (item.getAttribute('i-type') == 'structure') {
            //do nothing if structure item is trying to be dropped on work_space
        } else if (workSpaceItemDropType == 0) {
            //if item drops on work_space for the firs time, do initialization of work_space_container
            //main parameters
            if (workSpaceItemSelectedAsDropTarget.childNodes[3].style.display = 'none') {
                let workSpaceContainer = workSpaceItemSelectedAsDropTarget.childNodes[3];
                let amountOfItemsPerRow = CONFIG.UI.workSpace.amountOfContainedItemsPerRow;
                workSpaceContainer.style.paddingBottom = `${CONFIG.UI.workSpace.gapBetweenContainedItems *
                    CONFIG.UI.workZoneCurrentScale}px`;
                workSpaceContainer.style.paddingLeft = `${CONFIG.UI.workSpace.gapBetweenContainedItems *
                    CONFIG.UI.workZoneCurrentScale}px`;
                workSpaceContainer.style.marginLeft = `${CONFIG.UI.workSpace.distanceBetweenContainerAndHead *
                    CONFIG.UI.workZoneCurrentScale}px`;
                workSpaceContainer.style.maxWidth = 
                    `${(amountOfItemsPerRow * CONFIG.UI.workSpace.defaultOffsetsWorkSpaceContainerItem.width + 
                        amountOfItemsPerRow * CONFIG.UI.workSpace.gapBetweenContainedItems) 
                        * CONFIG.UI.workZoneCurrentScale}px`;
                workSpaceContainer.style.borderRadius = `${CONFIG.UI.defaultWorkZoneItemBorderRadius *
                     CONFIG.UI.workZoneCurrentScale}px`;
            }
            workSpaceItemSelectedAsDropTarget.childNodes[3].appendChild(item);
            workSpaceItemSelectedAsDropTarget.childNodes[3].style.display = 'flex';
            //initialisation of work_space container item
            item.style = null;
            item.className = 'work-space-container-item';
            item.style.width = `${CONFIG.UI.workSpace.defaultOffsetsWorkSpaceContainerItem.width *
                CONFIG.UI.workZoneCurrentScale}px`;
            item.style.height = `${CONFIG.UI.workSpace.defaultOffsetsWorkSpaceContainerItem.height *
                CONFIG.UI.workZoneCurrentScale}px`;
            item.style.marginRight = `${CONFIG.UI.workSpace.gapBetweenContainedItems *
                CONFIG.UI.workZoneCurrentScale}px`;
            item.style.marginTop = `${CONFIG.UI.workSpace.gapBetweenContainedItems *
                CONFIG.UI.workZoneCurrentScale}px`;
            item.style.borderRadius = `${CONFIG.UI.defaultWorkZoneItemBorderRadius *
                CONFIG.UI.workZoneCurrentScale}px`;
        } else if (workSpaceItemDropType == 1) {
            workSpaceItemSelectedAsDropTarget.parentNode.childNodes[3].appendChild(item);
            workSpaceItemSelectedAsDropTarget.parentNode.childNodes[3].style.display = 'flex';
            item.style = null;
            item.className = 'work-space-container-item';
        }
    }
    
    if (enableItemPositionCalculationMethod == true) {
        calculatePositionForItems(item)
    }
    enableItemPositionCalculationMethod = false;
    document.body.onmousemove = null;
    document.body.onmouseup = null;
}

/**
 * Showing context menu with content wich is releted to selected item 
 * @param {selected item} item 
 */
function showContextMenuOfItem(item, event) {
    removeContextMenu()
    contextMenu = document.createElement('div')
    contextMenu.className = 'context-menu'
    document.body.append(contextMenu)
    contextMenuContent = [
        {
            name:`${event.clientX}, ${event.clientY}`,
            method: () => {
                alert(contextMenuContent[0].name)
                removeContextMenu()
            },
            extendable: {}
        },
        {
            name:`${item.getAttribute('i-name')}`,
            method: () => {
                console.log(contextMenuContent[1].name)
                removeContextMenu()
            },
        }, 
        {
            name:`hr`
        },
        {
            name: `Remove`,
            method: () => {
                item.remove()
                removeContextMenu()
            },
        }, 
    ]

    contextMenuContent.forEach((element, index) => {
        if(element.name == 'hr') {
            contextMenu.innerHTML = contextMenu.innerHTML +
            `
                <div class="context-menu-separator"></div>
            `
        } else {
            contextMenu.innerHTML = contextMenu.innerHTML +
            `
                <div class="context-menu-item" onclick="contextMenuContent[${index}].method()">
                    ${element.name}
                <div>
            `
        }
    })

    contextMenu.style.transition = `all ease-in-out ${CONFIG.logic.contextMenuOpeningSpeed}s`
    contextMenu.style.top = `${event.clientY + 2}px`
    contextMenu.style.left = `${event.clientX + 2}px`
    contextMenu.style.zIndex = 2000;
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

