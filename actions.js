module.exports = function (self) {
	self.setActionDefinitions({
		set_slot_output: {
			name: 'Set Slot Source',
			options: [
				{
					id: 'source',
					type: 'textinput',
					label: 'NDI Source Name',
					default: "",
					min: 0,
					max: 100,
				},
                {
                    id: 'slot',
                    type: 'dropdown',
                    label: 'Router Slot',
                    default: '',
                    choices: self.state.slots.map(o => ({
                        id: o.code,
                        label: `${o.slotName} (${o.code})`
                    }))
                }
			],
			callback: async (event) => {
                await self.get(`slots/${event.options.slot}/set/${event.options.source}`);
			},
		},

        clear_slot_output: {
            name: 'Clear Slot Output',
			options: [
                {
                    id: 'slot',
                    type: 'dropdown',
                    label: 'Router Slot',
                    default: '',
                    choices: self.state.slots.map(o => ({
                        id: o.code,
                        label: `${o.slotName} (${o.code})`
                    }))
                }
			],
			callback: async (event) => {
                await self.get(`slots/${event.options.slot}/clear`);
			},            
        },
	})
}
