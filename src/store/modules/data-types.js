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
	SET_SELECT_TABLE,
	SET_IS_RELOAD_CONTENT,
	SET_SERVER_IMAGES,
	SET_SELECTED_IMAGE_PATH,
	SET_REPEATER_FIELDS,
	SET_REPEATER_RECORDS,
	ADD_REPEATER_RECORD,
	DELETE_REPEATER_RECORD,
	SET_REPEATER_UNIQUE_FIELD_NAME,
	SET_REPEATER_NEW_VALUES,
	SET_IS_UPDATE_DONE,
	SET_CURRENT_TAGS,
	CLEAR_DATA_RECORD_VALUES
	
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
	defaultImageUrl: "https://dev1.sexence.com/imagesStub/placeholder-15.jpg",
	currentRepeaterFields: [],
	currentRepeaterRecords: [],
	currentRepeaterUniqueFieldName:"",
	currentRepeaterNewValues:"",
	isUpdateDone: false,
	currentTags:[],
	isClearTags:false
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
	//todo - doclear flage into global datasatate
	getIsClearTags: state => state.isClearTags,
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
	getDefaultImageUrl: state => state.defaultImageUrl,
	getRepeaterFields: state => state.currentRepeaterFields,
	getRepeaterRecords: state => state.currentRepeaterRecords,
	getRepeaterUniqueFieldName: state => state.currentRepeaterUniqueFieldName,
	getRepeaterNewValues: state => state.currentRepeaterNewValues,
	getIsUpdateDone: state => state.isUpdateDone,
	getCurrentTags: state => state.currentTags
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
	async setCurrentTags({ commit, state, rootState }, tagsArr) {
		if (rootState.isLog) console.log('setCurrentTags', tagsArr);
		commit(SET_CURRENT_TAGS, tagsArr);
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
	async setIsUpdateDone({ commit, rootState }, isDone) {
		if (rootState.isLog) console.log('setIsUpdateDone', isDone);
		commit(SET_IS_UPDATE_DONE, isDone);
	},
	async setDataType({ commit, state, rootState, actions }, dataType) {
		if (rootState.isLog) console.log('setDataType start', dataType);
		if (state.isDataTypes) {
			if (!state.isLoading && !state.isSending) {
				commit(SET_DATA_TYPE, dataType);
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
		if (rootState.isLog) console.log('loadDataTable. reload.', reload);
		if (rootState.isLog) console.log('dataTypeName', state.currentDataType.dataTypeName);
		if (state.isDataType && state.isDataTypes) {
			if (!state.isLoading) {
				commit(SET_IS_LOADING, true);
				if (reload && typeof state.localDataTables[state.currentDataType.dataTypeName] !== 'undefined') {
					state.localDataTables[state.currentDataType.dataTypeName] = null;
					if (rootState.isLog) console.log('loadDataTable. removeCache');
				}
				if (typeof state.localDataTables[state.currentDataType.dataTypeName] !== 'undefined' && state.localDataTables[state.currentDataType.dataTypeName] !== null) {
					if (rootState.isLog) console.log('loadDataTable. load local table ');
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
						if (rootState.isLog) console.log('endPointPlural: ',state.currentDataType.endPointPlural);
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
	async loadSelectTables({ commit, state, rootState }){
		if (rootState.isLog) console.log('loadSelectTables ');
		if (state.isDataTypes) {
			state.currentDataTypeFields.forEach(dataField => {
			 	if (dataField.fieldType === 'select'){
			 		if (typeof state.localDataTables[dataField.selectDataTypeName] == 'undefined' || state.localDataTables[dataField.selectDataTypeName] == null) {
						 let dataTypeName = dataField.selectDataTypeName;
			 			if (rootState.isLog) console.log('dataTypeName', dataTypeName);
						 if (!state.isLoading) {
							commit(SET_IS_LOADING, true);
							let setSelectTableObj = {dataTypeName : dataTypeName}
							if (typeof state.localDataTables[dataTypeName] !== 'undefined' && state.localDataTables[dataTypeName] !== null) {
								if (rootState.isLog) console.log('loadDataSelects. local table');
								setSelectTableObj.table = state.localDataTables[dataTypeName];
								commit(SET_SELECT_TABLE, setSelectTableObj);
								commit(SET_IS_LOADING, false);
								return "local table exist"
							} else {
								if (rootState.isAxios == false) {
									switch (dataTypeName) {
										case "article":
											setSelectTableObj.table = dummyArticlesJson
											break;
										case "howto":
											setSelectTableObj.table = dummyHowtosJson
											break;
										case "daily":
											setSelectTableObj.table = dummyDailiesJson
											break;
										case "secrets":
											setSelectTableObj.table = dummySecretsJson
											break;
										default:
									}
									commit(SET_SELECT_TABLE, setSelectTableObj);
									commit(SET_IS_LOADING, false);
									return "dummy data items. load ok"
								} else {
									if (rootState.isLog) console.log('dataTypes: ', state.dataTypes); 
									let dataTypeIndex = state.dataTypes.findIndex(dataType => dataType.dataTypeName === dataTypeName);
									//let dataTypeIndex2 = state.dataTypes[0].dataTypeName;
									let endPointPlural = "";
									if (dataTypeIndex !== 1) 
										endPointPlural = state.dataTypes[dataTypeIndex].endPointPlural;
								 	if (rootState.isLog) console.log('endPointPlural: ', endPointPlural);
									//todo check why async await not working
									 axios.get(endPointPlural, { responseType: "json" })
										.then(res => {
											if (rootState.isLog) console.log('loadDataSelects axios res: ', res);
											setSelectTableObj.table = res.data;
											commit(SET_SELECT_TABLE, setSelectTableObj);
											commit(SET_IS_LOADING, false);
											return 'axios done ok';
										}).catch(error => {
											switch (dataTypeName) {
												case "article":
													setSelectTableObj.table = dummyArticlesJson
													break;
												case "howto":
													setSelectTableObj.table = dummyHowtosJson
													break;
												case "daily":
													setSelectTableObj.table = dummyDailiesJson
													break;
												case "secrets":
													setSelectTableObj.table = dummySecretsJson
													break;
												default:
											}
											commit(SET_SELECT_TABLE, setSelectTableObj);
											commit(SET_IS_LOADING, false);
											return 'dummy data. axios error:.' + error;
										})
								}
							}
						} else {
							return "data allready loading"
						}
			
						
						//rootActions.loadSelectTable(dataField.selectDataTypeName);
			 		}
			 	}
			 })
			return "loadSelectTables ok";
		} else {
			return "missing data types";
		}
	},
	async loadSelectTable({ commit, state, rootState }, dataTypeName) {
		//not used atm. loadSelectTables is used instead
		if (rootState.isLog) console.log('loadSelectTable', dataTypeName);
		if (state.isDataType && state.isDataTypes) {
			if (!state.isLoading) {
				commit(SET_IS_LOADING, true);
				let setSelectTableObj = {dataTypeName : dataTypeName, table:""}
				if (typeof state.localDataTables[dataTypeName] !== 'undefined' && state.localDataTables[dataTypeName] !== null) {
					if (rootState.isLog) console.log('loadDataSelects. local table');
					setSelectTableObj.table = state.localDataTables[dataTypeName];
					commit(SET_SELECT_TABLE, setSelectTableObj);
					commit(SET_IS_LOADING, false);
					return "local table exist"
				} else {
					if (rootState.isAxios == false) {
						switch (dataTypeName) {
							case "article":
								setSelectTableObj.table = dummyArticlesJson
								break;
							case "howto":
								setSelectTableObj.table = dummyHowtosJson
								break;
							case "daily":
								setSelectTableObj.table = dummyDailiesJson
								break;
							case "secrets":
								setSelectTableObj.table = dummySecretsJson
								break;
							default:
						}
						commit(SET_SELECT_TABLE, setSelectTableObj);
						commit(SET_IS_LOADING, false);
						return "dummy data items. load ok"
					} else {
						const endPointPlural = state.dataTypes.find(dataType=>{
							dataType.dataTypeName === dataTypeName
						}).endPointPlural;
						if (rootState.isLog) console.log('endPointPlural: ',endPointPlural);
						const result = await axios.get(endPointPlural, { responseType: "json" })
							.then(res => {
								if (rootState.isLog) console.log('loadDataSelects axios res: ', res);
								//setSelectTableObj.table = res.data
								setSelectTableObj={dataTypeName : dataTypeName, table: res.data}
								if (rootState.isLog) console.log('before  SET_SELECT_TABLE ', setSelectTableObj);
								commit(SET_SELECT_TABLE, setSelectTableObj);
								commit(SET_IS_LOADING, false);
								return 'axios done ok';
							}).catch(error => {
								switch (dataTypeName) {
									case "article":
										setSelectTableObj.table = dummyArticlesJson
										break;
									case "howto":
										setSelectTableObj.table = dummyHowtosJson
										break;
									case "daily":
										setSelectTableObj.table = dummyDailiesJson
										break;
									case "secrets":
										setSelectTableObj.table = dummySecretsJson
										break;
									default:
								}
								commit(SET_SELECT_TABLE, setSelectTableObj);
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
	async clearDataRecordValues({ commit, state, rootState }) {
		if (rootState.isLog) console.log('clearDataRecordValues');
		if (!state.getIsDataContentChanged) {
			if (!state.isLoading && !state.isSending) {
				commit(CLEAR_DATA_RECORD_VALUES);
				return "clearDataRecordValues ok";
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
	[SET_SELECT_TABLE]: (state, SelectTableObj) => {
		console.log(SET_SELECT_TABLE,SelectTableObj)
		let tempTables = state.localDataTables;
		state.localDataTables[SelectTableObj.dataTypeName]
		//if (typeof state.localDataTables[SelectTableObj.dataTypeName] == 'undefined' || state.localDataTables[SelectTableObj.dataTypeName] == null) {
			//console.log(SET_SELECT_TABLE,2)
			tempTables[SelectTableObj.dataTypeName] = SelectTableObj.table
			//state.localDataTables[SelectTableObj.dataTypeName] = SelectTableObj.table;
		//}
		state.localDataTables = tempTables;
		console.log(SET_SELECT_TABLE,state.localDataTables)
	},
	[SET_DATA_CONTENT]: (state, recordId) => {
		let contentRecord = state.currentDataTable.filter(tableRecord => tableRecord[state.currentDataType.dataTypeIdField] === recordId)
		//console.log(SET_DATA_CONTENT, contentRecord[0]);
		state.currentDataContent = contentRecord[0];
		state.currentDataContentFieldsCol1.forEach(contentField => {
			contentField.value = contentRecord[0][contentField.name];
			console.log(contentRecord[0][contentField.name]);
			
		});
		state.currentDataContentFieldsCol2.forEach(contentField => {
			contentField.value = contentRecord[0][contentField.name];
		});
	},
	[CLEAR_DATA_RECORD_VALUES]: (state, recordId) => {
		// todo check why error
		try {
			state.currentDataContent.forEach(contentField => {
				contentField.value = "";
			});	
		} catch {
			console.log(CLEAR_DATA_RECORD_VALUES,"err?")
		}
		
		state.currentDataContentFieldsCol1.forEach(contentField => {
			contentField.value = "";
		});
		state.currentDataContentFieldsCol2.forEach(contentField => {
			contentField.value = "";
		});
		//todo - remove else where
		console.log(CLEAR_DATA_RECORD_VALUES,"getIsClearTags")
		state.getIsClearTags=true;

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
		//for now loading data again after add so no need for local changes
		//state.currentDataTable.add = dataTypeRecordId;
	},
	[UPDATE_DATA_RECORD]: (state, dataTypeRecord) => {
		//state.currentDataTable.update = dataTypeRecordId;
		//console.log(UPDATE_DATA_RECORD, dataTypeRecord);
		//console.log(UPDATE_DATA_RECORD, state.currentDataTable);
		const index = state.currentDataTable.findIndex(dataTableRecord => dataTableRecord[state.currentDataType.dataTypeIdField] == dataTypeRecord[state.currentDataType.dataTypeIdField]);
		//console.log(UPDATE_DATA_RECORD,dataTypeRecord[state.currentDataType.dataTypeIdField]);
		//console.log(UPDATE_DATA_RECORD, state.currentDataType.dataTypeIdField);
		//console.log(UPDATE_DATA_RECORD, index);
		if (index !== -1) {
			state.currentDataTable.splice(index, 1, dataTypeRecord);
			console.log(UPDATE_DATA_RECORD, index);
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
		console.log(SET_REPEATER_RECORDS,repeaterRecords)
		try{
			state.currentRepeaterRecords = repeaterRecords;
		}catch{
			state.currentRepeaterRecords = [];
		}
		console.log(SET_REPEATER_RECORDS,state.currentRepeaterRecords)
		console.log(SET_REPEATER_RECORDS,"xx")
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
	},
	[SET_IS_UPDATE_DONE]: (state, isDone) => {
		state.isUpdateDone = isDone;
	},
	[SET_CURRENT_TAGS]: (state, tagsArr) => {
		state.currentTags = tagsArr;
	}
	
	
}

export default {
	state,
	getters,
	actions,
	mutations
};