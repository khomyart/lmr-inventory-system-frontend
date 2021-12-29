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
        itemMovingOffsetFromWorkZoneBorder: 0.3, //%
        workSpaceItemDropType: 0, //defines type of algorythm will be used for item wich is dropping into workspace
        contextMenuOpeningSpeed: 0.1, //s
    },
    UI: {
        panelOrientation: 'left',
        defaultWorkZoneOffsets: {
            // width: 1754,
            // height: 1240,
            width: 1200,
            height: 1000,
        },
        defaultWorkZoneItemsOffsets: {
            width: 55,
            height: 55,
        },
        defaultWorkZoneItemImageOffsets: {
            width: 30,
            height: 30
        },
        defaultWorkZoneItemBorderRadius: 3, //px
        workZoneCurrentScale: 1, //multiplier
        workZoneMinScale: 0.2,
        workZoneMaxScale: 2.8,
        workSpace: {
            mainDiv: {
                padding: 8, //px
            },
            defaultOffsetsWorkSpaceHead: {
                width: 55,
                height: 55,
            },
            defaultOffsetsWorkSpaceContainerItem: {
                width: 45,
                height: 45,
            },
            amountOfContainedItemsPerRow: 3,
            gapBetweenContainedItems: 5, //px (margin and padding)
            distanceBetweenContainerAndHead: 10, //px
        }
    }   
}
