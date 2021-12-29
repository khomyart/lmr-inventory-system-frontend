let CONFIG = {
  coreElementsSelectors: {
    container: ".container",
    workZoneHolder: "#main_field_holder",
    workZoneIdentifier: "#main_field",
    rootIremsIdentifier: ".drag-and-drop-item",
    rootItemsSeparator: ".drag-and-drop-items-separator",
    itemPanel: ".items-panel",
    contextPanel: ".context-panel",
  },
  logic: {
    itemOpacityWhileMoving: 0.5,
    outOfZoneAnimationTime: 0.3, //(s)
    itemMovingOffsetFromWorkZoneBorder: 0.3, //%
    workSpaceItemDropType: 0, //defines type of algorythm will be used for item wich is dropping into workspace
    contextMenuOpeningSpeed: 0.1, //s
  },
  UI: {
    panelOrientation: "left",
    defaultWorkZoneOffsets: {
      // width: 1754,
      // height: 1240,
      width: 1200,
      height: 1000,
    },
    defaultWorkZoneItemsOffsets: {
      width: 60,
      height: 60,
    },
    defaultWorkZoneItemImageOffsets: {
      width: 30,
      height: 30,
    },
    infoPanel: {
      defaultDistanceFromWorkZoneItem: 10, //px
      imageSize: {
        width: 16, //px
        height: 16, //px
      },
    },
    zoomStep: 0.1,
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
        width: 50,
        height: 50,
      },
      amountOfContainedItemsPerRow: 4,
      gapBetweenContainedItems: 5, //px (margin and padding)
      distanceBetweenContainerAndHead: 10, //px
    },
  },
};
