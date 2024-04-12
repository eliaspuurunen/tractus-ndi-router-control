const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
    
	self.setFeedbackDefinitions({
		SlotSource: {
			name: 'Source is Assigned to Slot',
			type: 'boolean',
			label: 'Source Assigned to Slot',
			defaultStyle: {
				bgcolor: combineRgb(96, 0, 0),
				color: combineRgb(255, 255, 255),
			},
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
                },
				{
					id: 'sourcename',
					type: 'textinput',
					label: 'Source Name',
					default: ''
				},
			],
			callback: (feedback) => {
                console.log(feedback);
				self.log('info', 'Feedback callback!', feedback, feedback.options.sourcename, feedback.options.slot)


                let slotCode = feedback.options.slot;
                let sourceName = feedback.options.sourcename;

                if(!slotCode || !sourceName) {
                    return false;
                }

                let slot = self.state.slots.find(x => x.code == slotCode);
                if(!slot) {
                    return false;
                }

                return slot.sourceName == sourceName;


                return false;
			},
		},
	})


}
