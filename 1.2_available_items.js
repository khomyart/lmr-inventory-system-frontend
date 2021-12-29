let availableItems = [
    {
        name: 'door',
        displayName: 'Двері',
        icon: './icons/exit.svg',
        tagValue: 'structure',
        isInventoryNumberNeeded: false,
        connection: null
    },
    {
        name: 'ethernet',
        displayName: 'Інтернет-розетка',
        icon: './icons/ethernet.svg',
        tagValue: 'structure',
        isInventoryNumberNeeded: false,
        connection: {
            input: true,
            output: true
        }
    },
    {
        name: 'work_space',
        displayName: 'Робоче місце',
        icon: './icons/workspace.svg',
        tagValue: 'structure',
        isInventoryNumberNeeded: false,
        connection: null
    },
    {
        name: 'monitor',
        displayName: 'Монітор',
        icon: './icons/computer.svg',
        tagValue: 'device',
        isInventoryNumberNeeded: true,
        connection: null
    },
    {
        name: 'pc',
        displayName: 'Системний блок',
        icon: './icons/cpu.svg',
        tagValue: 'device',
        isInventoryNumberNeeded: true,
        connection: {
            input: true,
            output: true
        }
    },
    {
        name: 'ups',
        displayName: 'Джерело безперебійного живлення',
        icon: './icons/uninterrupted-power-supply.svg',
        tagValue: 'device',
        isInventoryNumberNeeded: true,
        connection: null
    },
    {
        name: 'printer',
        displayName: 'Принтер',
        icon: './icons/printer.svg',
        tagValue: 'device',
        isInventoryNumberNeeded: true,
        connection: {
            input: true,
            output: false
        }
    },
    {
        name: 'laptop',
        displayName: 'Ноутбук',
        icon: './icons/laptop2.svg',
        tagValue: 'device',
        isInventoryNumberNeeded: true,
        connection: {
            input: true,
            output: true
        }
    },
    {
        name: 'switch',
        displayName: 'Комутатор',
        icon: './icons/switch.svg',
        tagValue: 'device',
        isInventoryNumberNeeded: true,
        connection: {
            input: true,
            output: true
        }
    },
]