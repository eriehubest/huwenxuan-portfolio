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

        this.currentFocus = null;

        this._listeners = new Set();

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

                    focus: false,
                };
            }
            return this.triggerSection[name];
        };

        // Home

        const home = this.setProgress('home', 0)

        // Journey

        const journey = this._ensureSection("journey");
        journey.originalVal = [];
        journey.prefSum = [];

        const round = (n) => Math.round((n + Number.EPSILON) * 1000) / 1000;

        constants.timeline.home.map((_timeVal, _index) => {
            this.triggerSection.journey.originalVal.push(_timeVal);
            this.triggerSection.journey.prefSum.push(_index >= 1 ? round(_timeVal + this.triggerSection.journey.prefSum[_index - 1]) : round(_timeVal))
        })

        // Achievements

        const achievements = this._ensureSection("achievements");

        // console.log(this.triggerSection)
    }

    setFocus(name) {
        if (this.currentFocus !== name) {
            this.currentFocus = name;
            this._emitFocus?.(name);
        }
    }

    onFocusChange(fn) {
        this._listeners.add(fn);
        return () => this._listeners.delete(fn);
    }

    _emitFocus(name) {
        for (const fn of this._listeners) fn(name);
    }

    setProgress(name, progress, enforcedTrue = false) {
        const section = this._ensureSection(name);

        if (!section.initialized) {
            section.initialized = true;
            section._resolveReady();
            section._resolveReady = null;

        }

        let nextFocus = this.currentFocus;

        // if (!enforcedTrue) {
        //     section.focus = progress < 1 && progress >= 0 ? true : false;
        //     if (section.focus) nextFocus = name;
        // } else {
        //     section.focus = enforcedTrue;
        //     if (section.focus) nextFocus = name;
        // }

        // if (nextFocus !== this.currentFocus) {
        //     this.currentFocus = nextFocus;
        //     this._emitFocus(this.currentFocus);
        // }

        section.currentProgress = progress;
        section.roundedProgress = Number(progress.toFixed(10));

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