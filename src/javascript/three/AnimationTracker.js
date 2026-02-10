import constants from "../constants";

export default class AnimationTracker {
    static getInstance() {
        if (!AnimationTracker.instance) {
            AnimationTracker.instance = new AnimationTracker();
        }
        return AnimationTracker.instance;
    }

    constructor() {
        AnimationTracker.instance = this;

        this.triggerSection = {};

        this._ensureSection = (name) => {
            if (!this.triggerSection[name]) {
                let resolveReady;
                const ready = new Promise((res) => (resolveReady = res));

                this.triggerSection[name] = {
                    initialized: false,
                    ready,           // promise you can await
                    _resolveReady: resolveReady,
                    currentProgress: 0,
                    roundedProgress: 0,
                };
            }
            return this.triggerSection[name];
        };

        // Home

        this.setProgress('home', 0)

        // Journey

        const journey = this._ensureSection("journey");
        journey.originalVal = [];
        journey.prefSum = [];

        const round = (n) => Math.round((n + Number.EPSILON) * 1000) / 1000;

        constants.timeline.home.map((_timeVal, _index) => {
            this.triggerSection.journey.originalVal.push(_timeVal);
            this.triggerSection.journey.prefSum.push(_index >= 1 ? round(_timeVal + this.triggerSection.journey.prefSum[_index - 1]) : round(_timeVal))
        })

        // console.log(this.triggerSection)
    }

    setProgress(name, progress) {
        const section = this._ensureSection(name);

        if (!section.initialized) {
            section.initialized = true;
            section._resolveReady(); // resolves the promise exactly once
            section._resolveReady = null;
        }

        section.currentProgress = progress;
        section.roundedProgress = Number(progress.toFixed(3));

        // console.log(section.roundedProgress)
    }

    addSection(_options) {
        const tempSection = {
            start: _options.start,
            end: _options.end,
            callback: _options.callback,
        }

        this.triggerSection.push(tempSection);
    }
}