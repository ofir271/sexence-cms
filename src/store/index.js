import Vue from 'vue'
import Vuex from 'vuex'

import {
	SET_APP_STATE,
	TOGGLE_APP_STATE
} from '@/store/app-mutation-types'

import dataTypes from "./modules/data-types";
import appDisplay from "./modules/app-display";

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		isLog: true,
		isAxios: true,
	},
	getters: {
		getIsLog: state => state.isLog,
		getIsAxios: state => state.isAxios
	},
	actions: {
	},
	mutations: {
	},
	modules: {
		dataTypes,
		appDisplay
	}
})
