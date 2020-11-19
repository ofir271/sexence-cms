import axios from 'axios';
import { tsToDateTime } from "@/mixins/helper";

import dataTypesJson from '@/data/json/data-types.json';
import dataTypesFieldsJson from '@/data/json/data-types-fields.json';

import dummyServerImagesJson from '@/data/json/dummy/server-images.json';
import dummyArticlesJson from '@/data/json/dummy/articles.json';
import dummyCategoriesJson from '@/data/json/dummy/categories.json';
import dummyHowtosJson from '@/data/json/dummy/howtos.json';
import dummyDailiesJson from '@/data/json/dummy/dailies.json';
import dummyDailyJson from '@/data/json/dummy/daily.json';
import dummySecretsJson from '@/data/json/dummy/secrets.json';
import { sortByKey } from '@/mixins/helper.js';

import {
	SET_DATA_TYPES,
	SET_DATA_TYPES_FIELDS,
	SET_DATA_TYPE,
	SET_DATA_TABLE,
	SET_DATA_CONTENT,
	SET_IS_LOADING,
	SET_IS_SENDING,
	SET_CONTENT_STATE,
	DELETE_DATA_RECORD,
	UPDATE_DATA_RECORD,
	ADD_DATA_RECORD,
	SET_IS_DATA_CONTENT_CHANGED,
	SET_DATA_TYPE_SELECTS,
	SET_IS_RELOAD_CONTENT,
	SET_SERVER_IMAGES,
	SET_SELECTED_IMAGE_PATH,
	SET_REPEATER_FIELDS,
	SET_REPEATER_RECORDS,
	ADD_REPEATER_RECORD,
	DELETE_REPEATER_RECORD,
	SET_REPEATER_UNIQUE_FIELD_NAME,
	SET_REPEATER_NEW_VALUES

} from '@/store/app-mutation-types'

const state = {
	dataTypes: [],
	dataTypesFields: [],
	isDataTypes: false,
	isDataType: false,
	isDataTable: false,
	isDataContent: false,
	isDataContentChanged: false,
	isReloadContent: false, // watch to fix content reactivity
	isLoading: false,
	isSending: false,
	currentDataType: "",
	localDataTables: [], //for local cashing
	currentDataTable: [],
	currentDataTypeFields: [],
	currentDataTableFields: [],
	currentDataContentFields: [],
	currentDataContent: [],
	currentDataContentFieldsCol1: [],
	currentDataContentFieldsCol2: [],
	contentState: "",
	imagePathBase: "https://dev1.sexence.com/imagesStub/",
	serverImagesPath: "https://dev1.sexence.com/imagesStub/server-images.json",
	serverImagesNames: [],
	serverImages: [],
	selectedImagePath: "",
	currentRepeaterFields: [],
	currentRepeaterRecords: [],
	currentRepeaterUniqueFieldName:"",
	currentRepeaterNewValues:""
};

const getters = {
	getDataTypes: state => state.dataTypes,
	getDataTypesFields: state => state.dataTypesFields,
	getDataTypesGroup: (state) => (groupName) => {
		let dataTypesGroup = state.dataTypes.filter(dataTypes => dataTypes.menuGroup === groupName);
		try {
			return dataTypesGroup;
		} catch {
			return [];
		}
	},
	getDataType: state => state.currentDataType,
	getDataTable: state => state.currentDataTable,
	getIsDataTable: state => state.isDataTable,
	getIsDataType: state => state.isDataType,
	getIsDataContent: state => state.isDataContent,
	getIsDataContentChanged: state => state.isDataContentChanged,
	getIsReloadContent: state => state.isReloadContent,
	getIsLoading: state => state.isLoading,
	getIsSending: state => state.isSending,
	getDataTypeFields: state => state.currentDataTypeFields,
	getDataTableFields: state => state.currentDataTableFields,
	getDataContentFields: state => state.currentDataContentFields,
	getDataContentFieldsCol1: state => state.currentDataContentFieldsCol1,
	getDataContentFieldsCol2: state => state.currentDataContentFieldsCol2,
	getCurrentDataContent: state => state.currentDataContent,
	getContentState: state => state.contentState,
	getLocalDataTables: state => state.localDataTables,
	getServerImagesNames: state => state.serverImagesNames,
	getServerImages: state => state.serverImages,
	getSelectedImagePath: state => state.selectedImagePath,
	getRepeaterFields: state => state.currentRepeaterFields,
	getRepeaterRecords: state => state.currentRepeaterRecords,
	getRepeaterUniqueFieldName: state => state.currentRepeaterUniqueFieldName,
	getRepeaterNewValues: state => state.currentRepeaterNewValues,
};

const actions = {
	async setDataTypes({ commit, state, rootState }) {
		if (rootState.isLog) console.log('setDataTypes');
		if (!state.isDataTypes) {
			commit(SET_DATA_TYPES, dataTypesJson);
			commit(SET_DATA_TYPES_FIELDS, dataTypesFieldsJson);
			return 'set dataTypes ok';
		} else {
			return "dataTypes allready available"
		}
	},
	async setContentState({ commit, state, rootState }, contentState) {
		if (rootState.isLog) console.log('setContentState', contentState);
		commit(SET_CONTENT_STATE, contentState);
	},
	async setSelectedImagePath({ commit, state, rootState }, selectedImagePath) {
		if (rootState.isLog) console.log('setSelectedImagePath', selectedImagePath);
		commit(SET_SELECTED_IMAGE_PATH, selectedImagePath);
	},
	async setIsDataContentChanged({ commit, rootState }, isChange) {
		if (rootState.isLog) console.log('setIsDataContentChanged', isChange);
		commit(SET_IS_DATA_CONTENT_CHANGED, isChange);
	},	
	async setRepeaterFields({ commit, rootState }, repeaterFields) {
		if (rootState.isLog) console.log('setRepeaterFields', repeaterFields);
		commit(SET_REPEATER_FIELDS, repeaterFields);
	},	
	async setRepeaterRecords({ commit, rootState }, repeaterRecords) {
		if (rootState.isLog) console.log('setRepeaterRecords', repeaterRecords);
		commit(SET_REPEATER_RECORDS, repeaterRecords);
	},	
	async setRepeaterUniqueFieldName({ commit, rootState }, repeaterUniqueFieldName) {
		if (rootState.isLog) console.log('setRepeaterUniqueFieldName', repeaterUniqueFieldName);
		commit(SET_REPEATER_UNIQUE_FIELD_NAME, repeaterUniqueFieldName);
	},	
	async setRepeaterNewValues({ commit, rootState }, newValues) {
		if (rootState.isLog) console.log('setRepeaterNewValues', newValues);
		commit(SET_REPEATER_NEW_VALUES, newValues);
	},	
	async addRepeaterRecord({ commit, state, rootState }) {
		if (rootState.isLog) console.log('addRepeaterRecord');
		let emptyRepeaterRecordObj={};
		//let emptyRepeaterRecordStr="{"
		state.currentRepeaterFields.forEach((repeaterField) => {
			if (rootState.isLog) console.log('repeaterField.name',repeaterField.name);
			//emptyRepeaterRecordStr = emptyRepeaterRecordStr + repeaterField.name + " :'',";
			emptyRepeaterRecordObj[repeaterField.name]="";
		});
		//emptyRepeaterRecordStr = emptyRepeaterRecordStr.slice(0, -1);
		//emptyRepeaterRecordStr = emptyRepeaterRecordStr +"}";
		//if (rootState.isLog) console.log('emptyRepeaterRecordStr',emptyRepeaterRecordStr);
		if (rootState.isLog) console.log('emptyRepeaterRecordObj',emptyRepeaterRecordObj);
		//emptyRepeaterRecordStr = JSON.parse(emptyRepeaterRecordStr);
		commit(ADD_REPEATER_RECORD,emptyRepeaterRecordObj);
	},
	async deleteRepeaterRecord({ commit, rootState }, recordUniqueValue) {
		if (rootState.isLog) console.log('deleteRepeaterRecord', recordUniqueValue);
		commit(DELETE_REPEATER_RECORD, recordUniqueValue);
	},	
	async setIsReloadContent({ commit, rootState }, isReload) {
		if (rootState.isLog) console.log('setIsReloadContent', isReload);
		commit(SET_IS_RELOAD_CONTENT, isReload);
	},
	async setDataType({ commit, state, rootState }, dataType) {
		if (rootState.isLog) console.log('setDataType', dataType);
		if (state.isDataTypes) {
			if (!state.isLoading && !state.isSending) {
				commit(SET_DATA_TYPE, dataType);
				//commit(SET_DATA_TYPE_SELECTS, dataType);
				commit(SET_CONTENT_STATE, "Add");
				return "set data item type ok";
			} else {
				return "loading or sending data";
			}
		} else {
			return "missing data types";
		}
	},
	async loadDataTable({ commit, state, rootState }, reload = false) {
		if (rootState.isLog) console.log('loadDataTable', state.currentDataType.dataTypeName);
		if (state.isDataType && state.isDataTypes) {
			if (!state.isLoading) {
				commit(SET_IS_LOADING, true);
				if (reload && typeof state.localDataTables[state.currentDataType.dataTypeName] !== 'undefined') {
					state.localDataTables[state.currentDataType.dataTypeName] = null;
				}
				if (typeof state.localDataTables[state.currentDataType.dataTypeName] !== 'undefined' && state.localDataTables[state.currentDataType.dataTypeName] !== null) {
					commit(SET_DATA_TABLE, state.localDataTables[state.currentDataType.dataTypeName]);
					commit(SET_IS_LOADING, false);
					return "load local table ok"
				} else {
					if (rootState.isAxios == false) {
						//let sleep = await new Promise(resolve => setTimeout(resolve, 500));
						switch (state.currentDataType.dataTypeName) {
							case "article":
								commit(SET_DATA_TABLE, dummyArticlesJson);
								break;
							case "howto":
								commit(SET_DATA_TABLE, dummyHowtosJson);
								break;
							case "category":
								commit(SET_DATA_TABLE, dummyCategoriesJson);
								break;
							case "daily":
								commit(SET_DATA_TABLE, dummyDailiesJson);
								break;
							case "secrets":
								commit(SET_DATA_TABLE, dummySecretsJson);
								break;
							default:
						}
						commit(SET_IS_LOADING, false);
						return "dummy data items. load ok"
					} else {
						const result = await axios.get(state.currentDataType.endPointPlural, { responseType: "json" })
							.then(res => {
								if (rootState.isLog) console.log('loadDataTable axios res: ', res.data);

								// if (state.currentDataType.dataTypeName==='secret'){
								// 	let data = (res.data).map(secret => {
								// 		let parsedAnswers = JSON.parse(secret.answers)
								// 		secret.answers = parsedAnswers
								// 		return secret
								// 	});
								// }
								commit(SET_DATA_TABLE, res.data);
								commit(SET_IS_LOADING, false);
								return "axios done ok";
							}).catch(error => {
								switch (state.currentDataType.dataTypeName) {
									case "article":
										commit(SET_DATA_TABLE, dummyArticlesJson);
										break;
									case "howto":
										commit(SET_DATA_TABLE, dummyHowtosJson);
										break;
									case "category":
										commit(SET_DATA_TABLE, dummyCategoriesJson);
										break;
									case "daily":
										commit(SET_DATA_TABLE, dummyDailiesJson);
										break;
									case "secrets":
										commit(SET_DATA_TABLE, dummySecretsJson);
										break;
									default:

								}
								commit(SET_IS_LOADING, false);
								return 'dummy data. axios error:.' + error;
							})
					}
				}
			} else {
				return "data allready loading"
			}
		} else {
			return "missing data types or data type"
		}
	},
	async loadServerImages({ commit, state, rootState }) {
		if (rootState.isLog) console.log('loadServerImages', location.hostname);
		if (state.isDataTypes) {
			if (!state.isLoading) {
				commit(SET_IS_LOADING, true);
				if (rootState.isAxios == false || location.hostname === "localhost" || location.hostname === "127.0.0.1") {
					//let sleep = await new Promise(resolve => setTimeout(resolve, 500));
					commit(SET_SERVER_IMAGES, dummyServerImagesJson);
					commit(SET_IS_LOADING, false);
					return "dummy images names. load ok"
				} else {
					const result = await axios.get(state.serverImagesPath, { responseType: "json" })
						.then(res => {
							if (rootState.isLog) console.log('loadServerImages axios res: ', res.data);
							let serverImagesObj = res.data;
							commit(SET_SERVER_IMAGES, serverImagesObj);
							commit(SET_IS_LOADING, false);
							return 'axios done ok';
						}).catch(error => {
							commit(SET_SERVER_IMAGES, dummyServerImagesJson);
							commit(SET_IS_LOADING, false);
							return 'dummy data. axios error:.' + error;
						})
				}
			} else {
				return "data allready loading"
			}
		} else {
			return "missing data types"
		}
	},
	async loadDataSelects({ commit, state, rootState }) {
		if (rootState.isLog) console.log('loadDataSelects', state.currentDataType.dataTypeName);
		if (state.isDataType && state.isDataTypes) {
			if (!state.isLoading) {
				commit(SET_IS_LOADING, true);
				state.currentDataTypeFields.forEach(dataField => {
					if (dataField.fieldType==="select"){
						if (rootState.isLog) console.log('loadDataSelects', dataField.fieldType);
					}
				})
				// if (rootState.isAxios == false) {
				// 	//let sleep = await new Promise(resolve => setTimeout(resolve, 500));

				// 	switch (state.currentDataType.dataTypeName) {
				// 		case "article":
				// 			commit(SET_DATA_TABLE, dummyArticlesJson);
				// 			break;
				// 		case "howto":
				// 			commit(SET_DATA_TABLE, dummyHowtosJson);
				// 			break;
				// 		case "daily":
				// 			commit(SET_DATA_TABLE, dummyDailiesJson);
				// 			break;
				// 		case "secrets":
				// 			commit(SET_DATA_TABLE, dummySecretsJson);
				// 			break;
				// 		default:
				// 	}
				// 	commit(SET_IS_LOADING, false);
				// 	return "dummy data items. load ok"
				// } else {
				// 	const result = await axios.get(state.currentDataType.endPointPlural, { responseType: "json" })
				// 		.then(res => {
				// 			if (rootState.isLog) console.log('loadDataTable axios res: ', res);
				// 			commit(SET_DATA_TABLE, res.data);
				// 			commit(SET_IS_LOADING, false);
				// 			return 'axios done ok';
				// 		}).catch(error => {
				// 			switch (state.currentDataType.dataTypeName) {
				// 				case "article":
				// 					commit(SET_DATA_TABLE, dummyArticlesJson);
				// 					break;
				// 				default:

				// 			}
				// 			commit(SET_IS_LOADING, false);
				// 			return 'dummy data. axios error:.' + error;
				// 		})
				// }
			} else {
				return "data allready loading"
			}
		} else {
			return "missing data types or data type"
		}
	},
	async setDataContent({ commit, state, rootState }, recordId) {
		if (rootState.isLog) console.log('setDataContent', recordId);
		if (!state.getIsDataContentChanged) {
			if (!state.isLoading && !state.isSending) {
				commit(SET_DATA_CONTENT, recordId);
				commit(SET_CONTENT_STATE, "Update");
				return "set data item ok";
			} else {
				return "loading or sending data";
			}
		} else {
			return "DataContentChanged";
		}
	},
	async addDataTypeRecord({ commit, state, rootState }, dataTypeRecord) {
		if (rootState.isLog) console.log('addDataTypeRecord', dataTypeRecord);
		if (state.isDataTypes && state.isDataType) {
			if (!state.isSending) {
				commit(SET_IS_SENDING, true);
				if (rootState.isAxios == false) {
					//let sleep = await new Promise(resolve => setTimeout(resolve, 500));
					commit(ADD_DATA_RECORD, dataTypeRecord);
					commit(SET_IS_SENDING, false);
					return "addDataTypeRecord. no axios. add ok"
				} else {
					const result = await axios.post(state.currentDataType.endPointSingle + 'add', dataTypeRecord)
						.then(res => {
							if (rootState.isLog) console.log('addDataTypeRecord axios res: ', res);
							commit(ADD_DATA_RECORD, dataTypeRecord);
							commit(SET_IS_SENDING, false);
							return 'axios done ok';
						}).catch(error => {
							commit(SET_IS_SENDING, false);
							return 'add data record. axios error: ' + error;
						})
				}
			} else {
				return "allready sending data";
			}
		} else {
			return "missing data types or data type";
		}
	},
	async updateDataTypeRecord({ commit, state, rootState }, dataTypeRecord) {
		if (rootState.isLog) console.log('updateDataTypeRecord', dataTypeRecord);
		if (state.isDataTypes && state.isDataType) {
			if (!state.isSending) {
				commit(SET_IS_SENDING, true);
				if (rootState.isAxios == false) {
					//let sleep = await new Promise(resolve => setTimeout(resolve, 500));
					commit(UPDATE_DATA_RECORD, dataTypeRecord);
					commit(SET_IS_SENDING, false);
					return "UpdateDataTypeRecord. no axios. update ok"
				} else {
					const result = await axios.post(state.currentDataType.endPointSingle + 'update', dataTypeRecord)
						.then(res => {
							if (rootState.isLog) console.log('updateDataTypeRecord axios res: ', res);
							commit(UPDATE_DATA_RECORD, dataTypeRecord);
							commit(SET_IS_SENDING, false);
							return 'axios done ok';
						}).catch(error => {
							commit(SET_IS_SENDING, false);
							return 'update data record. axios error: ' + error;
						})
				}
			} else {
				return "allready sending data";
			}
		} else {
			return "missing data types or data type";
		}
	},
	async deleteDataTypeRecord({ commit, state, rootState }, dataTypeRecordId) {
		if (rootState.isLog) console.log('deleteDataTypeRecord', dataTypeRecordId);
		if (state.isDataTypes && state.isDataType) {
			if (!state.isSending) {
				commit(SET_IS_SENDING, true);
				if (rootState.isAxios == false) {
					//let sleep = await new Promise(resolve => setTimeout(resolve, 500));
					commit(DELETE_DATA_RECORD, dataTypeRecordId);
					commit(SET_IS_SENDING, false);
					return "deleteDataTypeRecord. no axios. done ok"
				} else {
					const result = await axios.get(state.currentDataType.endPointSingle + 'delete/' + dataTypeRecordId)
						.then(res => {
							if (rootState.isLog) console.log('deleteDataTypeRecord axios res: ', res);
							commit(DELETE_DATA_RECORD, dataTypeRecordId);
							commit(SET_IS_SENDING, false);
							return 'deleteDataTypeRecord. axios done ok';
						}).catch(error => {
							commit(SET_IS_SENDING, false);
							return 'deleteDataTypeRecord. axios error: ' + error;
						})
				}
			} else {
				return "allready sending data";
			}
		} else {
			return "missing data types or data type";
		}
	},
}

const mutations = {
	[SET_DATA_TYPES]: (state, dataTypes) => {
		state.dataTypes = dataTypes
	},
	[SET_DATA_TYPES_FIELDS]: (state, dataTypesFields) => {
		state.dataTypesFields = dataTypesFields
		state.isDataTypes = true
	},
	[SET_DATA_TYPE]: (state, dataType) => {
		state.currentDataType = state.dataTypes.find(dataTypes => dataTypes.dataTypeName === dataType);
		if (state.currentDataType.detailsCols != 2)
			state.currentDataType.detailsCols = 1;
		state.currentDataTypeFields = state.dataTypesFields.find(dataTypes => dataTypes.dataTypeName === dataType).fields;
		state.currentDataTableFields = sortByKey(state.currentDataTypeFields.filter(dataField => dataField.isTable === true), 'tableOrder');
		state.currentDataContentFields = sortByKey(state.currentDataTypeFields, 'singleOrder');
		state.currentDataContentFieldsCol1 = state.currentDataTypeFields.filter(dataField => dataField.col === 1);
		state.currentDataContentFieldsCol2 = state.currentDataTypeFields.filter(dataField => dataField.col === 2);
		state.isDataType = true;
	},
	[SET_DATA_TYPE_SELECTS]: (state, dataType) => {
		state.currentDataTypeFields.forEach(dataField => {
			//if (dataField.)
		})
	},
	[SET_DATA_CONTENT]: (state, recordId) => {
		//let fieldName = "howToId";
		let contentRecord = state.currentDataTable.filter(tableRecord => tableRecord[state.currentDataType.dataTypeIdField] === recordId)
		console.log(SET_DATA_CONTENT, contentRecord[0]);
		state.currentDataContent = contentRecord[0];
		state.currentDataContentFieldsCol1.forEach(contentField => {
			contentField.value = contentRecord[0][contentField.name];
			console.log(contentRecord[0][contentField.name]);
		});
		state.currentDataContentFieldsCol2.forEach(contentField => {
			contentField.value = contentRecord[0][contentField.name];
		});
	},
	[SET_DATA_TABLE]: (state, dataTable) => {
		if (typeof state.localDataTables[state.currentDataType.dataTypeName] == 'undefined' || state.localDataTables[state.currentDataType.dataTypeName] == null) {
			state.localDataTables[state.currentDataType.dataTypeName] = dataTable;
		}
		state.currentDataTable = dataTable;
		state.isDataTable = true;
	},
	// [SET_DATA_TABLE_DATES_FROM_TS]: (state, dataTable) => {
	// 	state.currentDataTable
	// 	state.currentDataTable.forEach = dataTable;
	// 	state.isDataTable = true;
	// },
	// tsToDateTime
	[DELETE_DATA_RECORD]: (state, dataTypeRecordId) => {
		state.currentDataTable = state.currentDataTable.filter(dataRecord => dataRecord[state.currentDataType.dataTypeIdField] !== dataTypeRecordId)
		state.localDataTables[state.currentDataType.dataTypeName] = state.currentDataTable;
	},
	[ADD_DATA_RECORD]: (state, dataTypeRecord) => {
		//state.currentDataTable.add = dataTypeRecordId;
	},
	[UPDATE_DATA_RECORD]: (state, dataTypeRecord) => {
		//state.currentDataTable.update = dataTypeRecordId;
		const index = state.currentDataTable.findIndex(dataTableRecord => dataTableRecord[state.currentDataType.dataTypeIdField] === dataTypeRecord[state.currentDataType.dataTypeIdField]);
		if (index !== -1) {
			state.currentDataTable.splice(index, 1, dataTypeRecord);
			if (typeof state.localDataTables[state.currentDataType.dataTypeName] !== 'undefined' && state.localDataTables[state.currentDataType.dataTypeName] !== null) {
				state.localDataTables[state.currentDataType.dataTypeName] = state.currentDataTable;
			}
		}
	},
	[SET_SERVER_IMAGES]: (state, serverImages) => {
		state.serverImagesNames = serverImages;
		state.serverImagesNames.forEach((serverImage, key) => {
			let tempImageObj = {
				path: state.imagePathBase + serverImage.imageName,
				key: key
			}
			state.serverImages.push(tempImageObj);
		});
	},
	[SET_IS_LOADING]: (state, loading) => {
		state.isLoading = loading;
	},
	[SET_IS_SENDING]: (state, sending) => {
		state.isSending = sending;
	},
	[SET_IS_DATA_CONTENT_CHANGED]: (state, isChange) => {
		state.isDataContentChanged = isChange;
	},
	[SET_IS_RELOAD_CONTENT]: (state, isReload) => {
		state.isReloadContent = isReload;
	},
	[SET_CONTENT_STATE]: (state, contentState) => {
		state.contentState = contentState;
	},
	[SET_SELECTED_IMAGE_PATH]: (state, selectedImagePath) => {
		state.selectedImagePath = selectedImagePath;
	},
	[SET_REPEATER_FIELDS]: (state, repeaterFields) => {
		state.currentRepeaterFields = repeaterFields;
	},
	[SET_REPEATER_RECORDS]: (state, repeaterRecords) => {
		state.currentRepeaterRecords = repeaterRecords;
	},
	[ADD_REPEATER_RECORD]: (state, emptyRepeaterRecordObj) => {
		state.currentRepeaterRecords.push(emptyRepeaterRecordObj);
	},
	[SET_REPEATER_UNIQUE_FIELD_NAME]: (state, repeaterUniqueFieldName) => {
		state.currentRepeaterUniqueFieldName = repeaterUniqueFieldName;
	},	
	[SET_REPEATER_NEW_VALUES]: (state, newValues) => {
		state.currentRepeaterNewValues = newValues;
	},
	[DELETE_REPEATER_RECORD]: (state, recordUniqueValue) => {
		state.currentRepeaterRecords = state.currentRepeaterRecords.filter(dataRecord => dataRecord[state.currentRepeaterUniqueFieldName] !== recordUniqueValue)
	}

}

export default {
	state,
	getters,
	actions,
	mutations
};