module.exports = async function (self) {




	self.setVariableDefinitions(self.state.slots.map(o => ({
        variableId: `slot_${o.code}`,
        name: `Slot ${o.slotName} Source`
    })));

    let values = {};


    for(let i = 0; i < self.state.slots.length; i++) {
        let o = self.state.slots[i];

        values[`slot_${o.code}`] = o.sourceName;
    }

    self.setVariableValues(values);

        
        
        
    //     [
	// 	{ variableId: 'variable1', name: 'My first variable' },
	// 	{ variableId: 'variable2', name: 'My second variable' },
	// 	{ variableId: 'variable3', name: 'Another variable' },
	// ])
}
