let CONFIG = {
    workZoneIdentifier: '#main_field',
    rootIremsIdentifier: '.drag-and-drop-item',
    itemOpacityWhileMoving: 0.5,
    outOfZoneAnimationTime: 0.3 //(s)
}

const   workZone = document.querySelector(CONFIG.workZoneIdentifier), // field or div where droped items are located
        rootItems = document.querySelectorAll(CONFIG.rootIremsIdentifier) // items wich are basis of items in workZone

let     elementsOfSchema = [], // array with movable items inside the work field
        newElementOfSchema,
        shiftX, shiftY,
        isWorkFieldSelectedAsDropTarget = null,
        dropTarget = null
        
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

    if (newElementOfSchema.getAttribute('i-type') == 'work_space') {
        newElementOfSchema.className = 'work-space'
    } else {
        newElementOfSchema.className = 'field-item'
    }

    //set this variable to '' as default value for every newly created item
    isWorkFieldSelectedAsDropTarget = null;
    //set newly created item opacity to value wich is mentioned in config as itemOpacityWhileMoving
    newElementOfSchema.style.opacity = CONFIG.itemOpacityWhileMoving;
}

/**
 * 
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
 * Decides how item should behave when mouse moving is done and lmb has been released
 * @param {*} item 
 * @param {*} isWorkFieldSelectedAsDropTarget 
 * @param {*} isItemNewlyCreatedFromRoot 
 */
function itemEndpointBehavior(item, isWorkFieldSelectedAsDropTarget) {
    item.style.opacity = 1;
    item.style.zIndex = '1000'
    item.style.transition = `all ease-in-out 0s`;

    if (isWorkFieldSelectedAsDropTarget == null 
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
        item.style.transition = `all ease-in-out ${CONFIG.outOfZoneAnimationTime}s`
        setTimeout(() => {
            item.style.transition = `all ease-in-out 0s`;
        }, CONFIG.outOfZoneAnimationTime*1000)
    }

    if (workZone.getBoundingClientRect().left > item.getBoundingClientRect().left) {
        item.style.left = workZone.getBoundingClientRect().left + 'px';
    }

    if (workZone.getBoundingClientRect().right < item.getBoundingClientRect().right) {
        item.style.left = workZone.getBoundingClientRect().right - item.offsetWidth + 'px';
    }

    if (workZone.getBoundingClientRect().top > item.getBoundingClientRect().top) {
        item.style.top = workZone.getBoundingClientRect().top + 'px';
    }

    if (workZone.getBoundingClientRect().bottom < item.getBoundingClientRect().bottom) {
        item.style.top = workZone.getBoundingClientRect().bottom - item.offsetHeight + 'px';
    }

    document.body.onmousemove = null;
    document.body.onmouseup = null;
}

/**
 * Add drag and dtop to item and also adds some features like context menu by releasing lmb
 * @param {selected item} item 
 */
function addDragAndDropToItem(item) {
    item.onmousedown = (event) => {
        item.ondragstart = () => false
        
        item.onmouseup = () => {
            showContextMenuOfItem(item)
        }
        
        shiftX = event.pageX - item.getBoundingClientRect().left,
        shiftY = event.pageY - item.getBoundingClientRect().top;

        document.body.onmousemove = (event) => {
            moveAt(event, item, shiftX, shiftY);
            item.style.opacity = CONFIG.itemOpacityWhileMoving;
            item.style.display = 'none';
            isWorkFieldSelectedAsDropTarget = document.elementFromPoint(event.clientX, event.clientY).closest('#main_field');
            item.style.zIndex = '2000';
            item.style.display = 'flex';
            item.onmouseup = null
        }

        document.body.onmouseup = () => {
            itemEndpointBehavior(newElementOfSchema, isWorkFieldSelectedAsDropTarget)
            document.body.onmousemove = null;
        }        
    }
}

/**
 * Showing context menu with releted to selected item content
 * @param {selected item} item 
 */
function showContextMenuOfItem(item) {
    console.log(item.getAttribute('i-type'));
}

//loop wich allows to accept all needed functions to every root item
for (let i = 0; i < rootItems.length; i++) {
    rootItems[i].onmousedown = function(event) {
        createNewItem(event, rootItems[i]);
        
        //Variable has been assigned in createNewItem function
        newElementOfSchema.ondragstart = () => false;
        moveAt(event, newElementOfSchema, shiftX, shiftY);
        addDragAndDropToItem(newElementOfSchema);
        
        document.body.onmousemove = (event) => {
            moveAt(event, newElementOfSchema, shiftX, shiftY);
            //To get information about what we have under the item wich moving with cursor, we should do checking when actual item 
            //is invisible, so in this case we will get correct information for isWorkFieldSelectedAsDropTarget variable
            newElementOfSchema.style.display = 'none';
            isWorkFieldSelectedAsDropTarget = document.elementFromPoint(event.clientX, event.clientY).closest('#main_field');
            newElementOfSchema.style.display = 'flex';
        }
    }
}



