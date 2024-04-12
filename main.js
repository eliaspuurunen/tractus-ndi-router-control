const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const SignalR = require('@microsoft/signalr')

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config;
        this.state = {};

        this.updateStatus(InstanceStatus.Connecting);

        let didInitOK = false;

        try {
            await this.fetchLatestState();
            await this.setupSignalR();
            didInitOK = true;
        } catch(ex) {
            didInitOK = false;
        }

        if(didInitOK) {
            this.updateStatus(InstanceStatus.Ok)
            this.updateActions() // export actions
            this.updateFeedbacks() // export feedbacks
            this.updateVariableDefinitions() // export variable definitions
        } else {
            this.updateStatus(InstanceStatus.ConnectionFailure);
        }

	}

    async setupSignalR() {
        let hub = new SignalR.HubConnectionBuilder()
            .withUrl(`http://${this.config.host}:${this.config.port}/ws`)
            .build();

        await hub.start();

        hub.on("Reset", () => this.fetchStateAndUpdateFeedback());
        hub.on('RouteChange', () => this.fetchStateAndUpdateFeedback());
        hub.on('RouteRenamed', () => this.fetchStateAndUpdateFeedback());
        hub.on('RouteDeleted', () => this.fetchStateAndUpdateFeedback());
        hub.on('RouteAdded', () => this.fetchStateAndUpdateFeedback());

        this.hub = hub;
    }

    async fetchStateAndUpdateFeedback(e) {
        try {
            console.warn("TESTING")
            await this.fetchLatestState();
            console.log("Got latest state. Now update feedback.");
            this.updateVariableDefinitions();
            this.checkFeedbacks();
   
        } catch(ex) {
            console.error("Exception: ", ex);
        }
    }

    async fetchLatestState() {
        this.log("info", this.config.host);
        this.state.slots = await this.get('slots');
    }

    async get(route) {
        let resultRaw = await fetch(`http://${this.config.host}:${this.config.port}/${route}`);
        let result = resultRaw.json();

        return result;
    }

	// When module gets deleted
	async destroy() {
        if(this.hub) {
            try {
                await this.hub.stop();
            } catch {

            }
        }

		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config;
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 8,
                default: '127.0.0.1',
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
                default: '8902',
				width: 4,
				regex: Regex.PORT,
			},
		]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
