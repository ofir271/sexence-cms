import {
	SET_APP_STATE,
	TOGGLE_APP_STATE
} from '@/store/app-mutation-types'

const state = {
    appStates: {
        sidebarOpen: true,
        midOpen: true,
        sidebarMainGroupOpen: true,
        imageSelectionOpen: false,
        repeaterManagerOpen: false
    }
};

const getters = {
    getAppStates: state => state.appStates
};

const actions = {
    async setAppState({ commit, state, rootState }, appStateObj) {
        if (rootState.isLog) console.log('setAppState', appStateObj);
        commit(SET_APP_STATE, appStateObj);
    },
    async toggleAppState({ commit, state, rootState }, appStateName) {
        if (rootState.isLog) console.log('toggleAppState', appStateName);
        commit(TOGGLE_APP_STATE, appStateName);
    },
}

const mutations = {
    [SET_APP_STATE]: (state, appStateObj) => {
        state.appStates[appStateObj.name] = appStateObj.value;
    },
    [TOGGLE_APP_STATE]: (state, appStateName) => {
        state.appStates[appStateName] = !state.appStates[appStateName];
    },
}

export default {
	state,
	getters,
	actions,
	mutations
};

