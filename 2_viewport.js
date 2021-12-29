/**
 * Method do zoom in and zoom out of viewport and all included items. Contains rules for 
 * 
 * @param {string} direction in or out
 * @param {int} step how much viewport will zoomin or zoomout per one iteration (mmultiplier)
 */
function zoom(direction, step) {
    if (CONFIG.UI.workZoneCurrentScale < CONFIG.UI.workZoneMinScale && direction == 'in' ||
        CONFIG.UI.workZoneCurrentScale > CONFIG.UI.workZoneMaxScale && direction == 'out' ||
        CONFIG.UI.workZoneCurrentScale > CONFIG.UI.workZoneMinScale && CONFIG.UI.workZoneCurrentScale < CONFIG.UI.workZoneMaxScale) {

        if (direction == 'in') {
            CONFIG.UI.workZoneCurrentScale += step;
        } else if (direction == 'out') {
            CONFIG.UI.workZoneCurrentScale -= step;
        }
    
        if (amountOfItemsInWorkZone != document.querySelectorAll('.field-item').length) {
            amountOfItemsInWorkZone = document.querySelectorAll('.field-item').length
            calculatePositionForItems('.field-item')
        }
    
        if (amountOfWorkSpacesInWorkZone != document.querySelectorAll('.work-space').length) {
            amountOfWorkSpacesInWorkZone = document.querySelectorAll('.work-space').length
            calculatePositionForItems('.work-space')
        }
    
        document.querySelectorAll('.field-item').forEach(e => {
            //e.style.transition = 'width 0.2s, height 0.2s';
            e.style.width =`${CONFIG.UI.defaultWorkZoneItemsOffsets.width * CONFIG.UI.workZoneCurrentScale}px`;
            e.style.height =`${CONFIG.UI.defaultWorkZoneItemsOffsets.height * CONFIG.UI.workZoneCurrentScale}px`;
            e.style.borderRadius =`${CONFIG.UI.defaultWorkZoneItemBorderRadius * CONFIG.UI.workZoneCurrentScale}px`;
            
        })
    
        document.querySelectorAll('.unit-image').forEach(e => {
            e.style.width = `${CONFIG.UI.defaultWorkZoneItemImageOffsets.width * CONFIG.UI.workZoneCurrentScale}px`;
            e.style.height = `${CONFIG.UI.defaultWorkZoneItemImageOffsets.height * CONFIG.UI.workZoneCurrentScale}px`;  
        })
    
        document.querySelectorAll('.work-space').forEach(e => {
            e.style.padding = `${CONFIG.UI.workSpace.mainDiv.padding * CONFIG.UI.workZoneCurrentScale}px`;
            e.style.borderRadius = `${CONFIG.UI.defaultWorkZoneItemBorderRadius * CONFIG.UI.workZoneCurrentScale}px`;
        })
        
        document.querySelectorAll('.work-space-head').forEach(e => {
            e.style.width = 
                `${CONFIG.UI.workSpace.defaultOffsetsWorkSpaceHead.width * CONFIG.UI.workZoneCurrentScale}px`;
            e.style.height = 
                `${CONFIG.UI.workSpace.defaultOffsetsWorkSpaceHead.height * CONFIG.UI.workZoneCurrentScale}px`;
        })
    
        document.querySelectorAll('.work-space-item-container').forEach(e => {
            let workSpaceContainer = e;
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
        })
    
        document.querySelectorAll('.work-space-container-item').forEach(e => {
            let workSpaceCOntainerItem = e;
            workSpaceCOntainerItem.style.width = `${CONFIG.UI.workSpace.defaultOffsetsWorkSpaceContainerItem.width *
                CONFIG.UI.workZoneCurrentScale}px`;
            workSpaceCOntainerItem.style.height = `${CONFIG.UI.workSpace.defaultOffsetsWorkSpaceContainerItem.height *
                CONFIG.UI.workZoneCurrentScale}px`;
            workSpaceCOntainerItem.style.marginRight = `${CONFIG.UI.workSpace.gapBetweenContainedItems *
                CONFIG.UI.workZoneCurrentScale}px`;
            workSpaceCOntainerItem.style.marginTop = `${CONFIG.UI.workSpace.gapBetweenContainedItems *
                CONFIG.UI.workZoneCurrentScale}px`;
            workSpaceCOntainerItem.style.borderRadius = `${CONFIG.UI.defaultWorkZoneItemBorderRadius *
                CONFIG.UI.workZoneCurrentScale}px`;
        })
    
        scrollPosition.top = everythingHolder.scrollTop / workZoneHolder.offsetHeight * 100;
        scrollPosition.left = everythingHolder.scrollLeft / workZoneHolder.offsetWidth * 100;
    
        previousWorkZoneHolderOffset = {
            width: workZoneHolder.offsetWidth,
            height: workZoneHolder.offsetHeight,
        };
    
        workZone.style.width = `${CONFIG.UI.defaultWorkZoneOffsets.width * CONFIG.UI.workZoneCurrentScale}px`;
        workZone.style.height = `${CONFIG.UI.defaultWorkZoneOffsets.height * CONFIG.UI.workZoneCurrentScale}px`; 
        workZoneHolder.style.width = `${workZone.offsetWidth + everythingHolder.offsetWidth * 1.5}px`;
        workZoneHolder.style.height = `${workZone.offsetHeight + everythingHolder.offsetHeight * 1.5}px`;
    
        // // can be proper but a bit strange variant, here we have zoom in and zoom out variants
        // everythingHolder.scrollTop = workZoneHolder.offsetHeight / 100 * scrollPosition.top ;
        // everythingHolder.scrollLeft = workZoneHolder.offsetWidth / 100 * scrollPosition.left;
        //????
        everythingHolder.scrollLeft += (workZoneHolder.offsetWidth  - previousWorkZoneHolderOffset.width) /2 
        everythingHolder.scrollTop += (workZoneHolder.offsetHeight - previousWorkZoneHolderOffset.height) /2 
        // everythingHolder.scrollTop += 2 * CONFIG.UI.workZoneCurrentScale;
        // everythingHolder.scrollLeft = workZoneHolder.offsetWidth * scrollPosition.left
        // everythingHolder.scrollTop = 
    }
}

/**
 * calculate position of item in persentages (%) depends on viewport length
 * 
 * @param {string} selector pointer on items type (class)
 */
function calculatePositionForItems (selector) {
    if (typeof selector == 'string') {
        let allItems = document.querySelectorAll(selector);
        allItems.forEach(e => {
            e.style.top = `${e.offsetTop / workZone.offsetHeight * 100}%`
            e.style.left = `${e.offsetLeft / workZone.offsetWidth * 100}%`
        })
    } else if (typeof selector == 'object') {
        let item = selector;
        selector.style.top = `${selector.offsetTop / workZone.offsetHeight * 100}%`
        selector.style.left = `${selector.offsetLeft / workZone.offsetWidth * 100}%`
    }
}