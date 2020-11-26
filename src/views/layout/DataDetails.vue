<template>
	<div class="data-content-wrap">
		<div class="data-content-inner">
			<div
				v-show="!getIsDataType"
				key="data-content-logo-place-holder"
				class="sexence-logo place-holder-layer"
			>
				<div
					:class="[
						getIsLoading ? 'loading' : '',
						getIsSending ? 'sending' : '',
						'logo-wrap img-wrap',
					]"
				>
					<img src="@/assets/sexence-icon.svg" alt="header-logo" />
				</div>
			</div>
			<div
				v-show="getIsDataType"
				key="data-content-main"
				class="data-content-main"
			>
				<h1 class="main-title">{{ dataContentTitle }}</h1>
				<TheImageSelection
					v-show="getAppStates['imageSelectionOpen']"
					:imagePath="selectedImagePath"
				/>				
				<TheRepeaterManager
					v-show="getAppStates['repeaterManagerOpen']"
					:is-single-record="currentRepeaterIsSingle"
				/>
				<!--todo - do generic or component-->
				<div class="content-fields-cols">
					<div class="content-fields-col col1">
						<div
							v-for="contentField in getDataContentFieldsCol1"
							:key="'content-field-' + contentField.name"
							:class="[
								'content-field-' + contentField.fieldType,
								contentField.hidden ||
								(getContentState === 'Add' &&
									(contentField.fieldType === 'id' ||
										contentField.fieldType === 'ts'))
									? 'hidden'
									: '',
								'content-field',
							]"
						>
							<input
								v-if="
									['string', 'id', 'title', 'html'].includes(
										contentField.fieldType
									)
								"
								:ref="'input-field-' + contentField.name"
								:key="'input-field-input-' + contentField.name"
								:id="'input-field-input-' + contentField.name"
								:disabled="contentField.disabled || contentField.fieldType === 'id'"
								:hidden="
									contentField.hidden ||
									(getContentState === 'Add' && contentField.fieldType === 'id')
								"
								:required="contentField.required"
								@change="setIsDataContentChanged(true)"
								type="text"
							/>	
							<!-- <vue-editor 
								v-if="contentField.fieldType === 'html'"
								:ref="'input-field-' + contentField.name"
								:key="'input-field-' + contentField.name"
								:id="'input-field-' + contentField.name"
								class="input-field-html"
								:disabled="contentField.disabled"
								:hidden="contentField.hidden"
								:required="contentField.required"
								@change="setIsDataContentChanged(true)"
							>
							</vue-editor> -->
 							<textarea
								v-else-if="contentField.fieldType === 'textarea'"
								:ref="'input-field-' + contentField.name"
								:key="'input-field-' + contentField.name"
								:id="'input-field-' + contentField.name"
								class="input-field-textarea"
								:disabled="contentField.disabled"
								:hidden="contentField.hidden"
								:required="contentField.required"
								@change="setIsDataContentChanged(true)"
							>	
							</textarea>							
							<input
								v-if="contentField.fieldType === 'date'"
								:ref="'input-field-' + contentField.name"
								:key="'input-field-date-' + contentField.name"
								:id="'input-field-date-' + contentField.name"
								class="input-field-date"
								:disabled="contentField.disabled"
								:hidden="contentField.hidden"
								:required="contentField.required"
								@change="setIsDataContentChanged(true)"
								type="date"
							/>
							<div
								v-if="contentField.fieldType === 'image'"
								:key="'input-field-image-' + contentField.name"
								:class="'img-wrap'"
								@click="openImageSelection(contentField.name)"
							>
								<input
									:ref="'input-field-' + contentField.name"
									:id="'input-field-' + contentField.name"
									:name="'input-field-' + contentField.name"
									:hidden="true"
									@change="
										getIsDataContentChanged ? '' : setIsDataContentChanged(true)
									"
									type="text"
								/>
								<img
									:src="getContentState === 'Add' ? getDefaultImageUrl : contentField.value"
									:ref="'field-image-' + contentField.name"
								/>
								<!-- :src="contentField.value" -->
							</div>
							<input
								v-if="contentField.fieldType == 'ts'"
								:ref="'input-field-' + contentField.name"
								:key="'input-field-ts-' + contentField.name"
								:id="'input-field-ts-' + contentField.name"
								:disabled="true"
								:hidden="contentField.hidden || getContentState === 'Add'"
								:required="contentField.required"
								@change="
									getIsDataContentChanged ? '' : setIsDataContentChanged(true)
								"
								type="text"
							/>
							<input
								v-if="contentField.name == 'createdTs'"
								:ref="'field-created-ts-hidden'"
								:id="'field-created-ts-hidden'"
								:key="'field-created-ts-hidden'"
								:hidden="true"
								type="text"
							/>
							<label
								v-if="
									!(
										contentField.hidden ||
										(getContentState === 'Add' &&
											(contentField.fieldType === 'ts' ||
												contentField.fieldType === 'id'))
									)
								"
								:key="'input-field-label-' + contentField.name"
								:for="'input-field-' + contentField.name"
								class="input-field-label"
								@click="focusInput('input-field-'+contentField.name)"
							>
								{{ contentField.displayName }}
							</label>
						</div>
					</div>
					<div
						v-if="getDataType.detailsCols === 2"
						key="content-fields-col2"
						class="content-fields-col col2"
					>
						<div
							v-for="(contentField, key) in getDataContentFieldsCol2"
							:key="'content-field-' + key"
							:class="[
								'content-field-' + contentField.fieldType,
								'content-field',
							]"
						>
							<input
								v-if="
									['string', 'id', 'title', 'html'].includes(
										contentField.fieldType
									)
								"
								:ref="'input-field-' + contentField.name"
								:key="'input-field-input-' + contentField.name"
								:id="'input-field-input-' + contentField.name"
								:name="'input-field-' + contentField.name"
								:disabled="contentField.disabled || contentField.fieldType === 'id'"
								:hidden="contentField.hidden"
								:required="contentField.required"
								@change="
									getIsDataContentChanged ? '' : setIsDataContentChanged(true)
								"
								type="text"
							/>
							<input
								v-if="contentField.fieldType === 'date'"
								:ref="'input-field-' + contentField.name"
								:key="'input-field-date-' + contentField.name"
								:id="'input-field-date-' + contentField.name"
								:disabled="contentField.disabled"
								:hidden="contentField.hidden"
								:required="contentField.required"
								class="input-field-date"
								@change="setIsDataContentChanged(true)"
								type="date"
							/>
							<input
								v-if="contentField.fieldType == 'ts'"
								:ref="'input-field-' + contentField.name"
								:key="'input-field-ts-' + contentField.name"
								:id="'input-field-ts-' + contentField.name"
								:disabled="true"
								:hidden="contentField.hidden || getContentState === 'Add'"
								:required="contentField.required"
								@keydown="
									getIsDataContentChanged ? '' : setIsDataContentChanged(true)
								"
								type="text"
							/>
							<input
								v-if="contentField.name == 'createdTs'"
								:ref="'field-created-ts-hidden'"
								:key="'field-created-ts-hidden'"
								:id="'field-created-ts-hidden'"
								:hidden="true"
								type="text"
							/>
							<div
								v-if="contentField.fieldType === 'image'"
								:key="'input-field-image-' + contentField.name"
								:class="'img-wrap'"
								@click="openImageSelection(contentField.name)"
							>
								<input
									:ref="'input-field-' + contentField.name"
									:name="'input-field-' + contentField.name"
									:id="'input-field-' + contentField.name"
									:hidden="true"
									@change="
										getIsDataContentChanged ? '' : setIsDataContentChanged(true)
									"
									type="text"
								/>
								<img
									:src="getContentState === 'Add' ? getDefaultImageUrl : contentField.value"
									:ref="'field-image-' + contentField.name"
								/>
							</div>
							<!-- <vue-editor 
								v-if="contentField.fieldType === 'html'"
								:ref="'input-field-' + contentField.name"
								:key="'input-field-' + contentField.name"
								:id="'input-field-' + contentField.name"
								class="input-field-html"
								:disabled="contentField.disabled"
								:hidden="contentField.hidden"
								:required="contentField.required"
								@change="setIsDataContentChanged(true)"
							>
							</vue-editor> -->
 							<textarea
								v-else-if="contentField.fieldType === 'textarea'"
								:ref="'input-field-' + contentField.name"
								:key="'input-field-' + contentField.name"
								:id="'input-field-' + contentField.name"
								class="input-field-textarea"
								:disabled="contentField.disabled"
								:hidden="contentField.hidden"
								:required="contentField.required"
								@change="setIsDataContentChanged(true)"
							>	
							</textarea>	
							<div
								v-if="contentField.fieldType === 'select'"
								:key="'input-field-select-' + contentField.name"
								:class="'select-wrap'"
							>
								<select
									:ref="'input-field-' + contentField.name"
									:key="'input-field-input-' + contentField.name"
									:id="'input-field-input-' + contentField.name"
									:name="'input-field-' + contentField.name"
									:disabled="contentField.disabled"									
									:multiple="contentField.multiple"
									:hidden="contentField.hidden"
									:required="contentField.required"
									@change="
										getIsDataContentChanged ? '' : setIsDataContentChanged(true)
									"
									type="text"
								>
									<!-- todo remove option refs? -->
									<option 
										:ref="'select-option-' + contentField.name + keyOption"
										v-for="(tableRecord,keyOption) in getSelectTable(contentField.selectDataTypeName)"
										:key="'select-option-' + contentField.name + keyOption"
										:value="tableRecord[contentField.selectValueField]"
									>
										{{tableRecord[contentField.selectDisplayField]}}
									</option>
								</select>
							</div>							
							<div
								v-if="contentField.fieldType === 'tags'"
								:key="'input-field-tags-' + contentField.name"
								:class="'tags-wrap'"
							>
								<!-- <div 
									class="tags-display"
									:ref="'input-field-tags-display-' + contentField.name"
								>

								</div> -->
								<!-- <input
									:ref="'input-field-tag-' + contentField.name"
									:id="'input-field-tag-' + contentField.name"
									:name="'input-field-tag-' + contentField.name"
									:hidden="false"
									:required="contentField.required"
									@keydown="
										getIsDataContentChanged ? '' : setIsDataContentChanged(true)
									"
									type="text"
								/>
								<div @click="addTag(contentField.name)" class="add-tag-icon">
									<b-icon icon="plus-circle-fill"></b-icon>
								</div> -->
								<TagsLine
									:tags-line-str-prop="contentField.value"
									:field-name="contentField.name"
									:field-display="contentField.displayName"
									@change = "tagChange"
								/>
								<input
									:ref="'input-field-' + contentField.name"
									:key="'input-field-' + contentField.name"
									:id="'input-field-' + contentField.name"
									:name="'input-field-' + contentField.name"
									:hidden="false"
									type="text"
								/>
							</div>							
							<div
								v-if="contentField.fieldType === 'repeater'"
								:key="'input-field-repeater-' + contentField.name"
								:class="'repeater-wrap'"
								@click="openRepeaterManager(contentField.name)"
							>
								<input
									:ref="'input-field-' + contentField.name"
									:id="'input-field-' + contentField.name"
									:name="'input-field-' + contentField.name"
									:hidden="false"
									:disabled="true"
									@keydown="
										getIsDataContentChanged ? '' : setIsDataContentChanged(true)
									"
									type="text"
								/>
								<div @click="openRepeaterManager(contentField.name)" class="open-repeater-icon">
									<b-icon icon="list-ul"></b-icon>
								</div>
							</div>
							<label
								v-if="!contentField.hidden && contentField.fieldType!=='tags'"
								:key="'input-field-label-' + contentField.name"
								:for="'input-field-' + contentField.name"
								class="input-field-label"
								@click="focusInput('input-field-'+contentField.name)"
							>
								{{ contentField.displayName }}
							</label>
						</div>
					</div>
				</div>
				<div class="content-btns">
					<button
						class="general-btn content-btn add-btn"
						v-show="getContentState === 'Add'"
						key="content-add-btn"
						@click="addContentRecord"
					>
						{{ getContentState }}
					</button>
					<button
						class="general-btn content-btn update-btn"
						v-show="getContentState === 'Update'"
						key="content-update-btn"
						@click="updateContentRecord"
						:disabled="!getIsDataContentChanged"
					>
						{{ getContentState }}
						<b-icon 
							icon="check2-circle"
							v-show="getIsUpdateDone && !getIsDataContentChanged"
						>
						</b-icon>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import LogMixin from "@/mixins/LogMixin";
import TheRepeaterManager from "@/components/TheRepeaterManager";
import TheImageSelection from "@/components/TheImageSelection";
import TagsLine from "@/components/TagsLine";
import { mapGetters, mapActions } from "vuex";

export default {
	name: "DataDetails",
	components: { TheImageSelection, TheRepeaterManager, TagsLine },
	mixins: [LogMixin],
	data() {
		return {
			selectedImageFieldName: "",
			selectedImagePath: "",
			currentRepeaterFieldName: "",
			selectArrays:[],
			currentRepeaterIsSingle: false
		};
	},
	computed: {
		...mapGetters([
			"getDataType",
			"getDataContentFields",
			"getDataContentFieldsCol1",
			"getDataContentFieldsCol2",
			"getIsDataContent",
			"getIsDataType",
			"getIsLoading",
			"getIsSending",
			"getContentState",
			"getIsDataContentChanged",
			"getIsReloadContent",
			"getCurrentDataContent",
			"getAppStates",
			"getSelectedImagePath",
			"getRepeaterFields",
			"getRepeaterRecords",
			"getRepeaterNewValues",
			"getDefaultImageUrl",
			"getIsUpdateDone",
			"getLocalDataTables",
			"getSelectTables",
			"getSelectTable"
		]),
		dataContentTitle() {
			if (this.getContentState !== "")
				return this.getContentState + " " + this.getDataType.singleDisplay;
			else return "";
		},
	},
	watch: {
		getSelectTables: function (newContent, oldContent) {
			this.log("watch getSelectTables");
			this.selectArrays == newContent
		},
		getDataType: function (newContent, oldContent) {
			this.log("watch getDataType");
			if (this.getAppStates["repeaterManagerOpen"]) {
				this.toggleAppState("repeaterManagerOpen");
				//this.log("toggle repeaterManagerOpen");
			}			
			if (this.getAppStates["imageSelectionOpen"]) {
				this.toggleAppState("imageSelectionOpen");
			}
			this.setIsUpdateDone(false);
		},
		getLocalDataTables:	function (newContent, oldContent) {
			this.log("watch getLocalDataTables", newContent);
		},	
		getContentState: function (newContent, oldContent) {
			this.log("watch getContentState");
			this.setIsUpdateDone(false);
			if (newContent === "Add" && oldContent !== "") {
				this.setIsDataContentChanged(false);
				this.clearDataRecordValues();
				this.clearContentFields();
				//let emptyErr= []
				this.setRepeaterRecords([]);
				this.setIsReloadRepeaterLocalHtml(false);
				this.setIsReloadRepeaterLocalHtml(true);
			}
		},
		getSelectedImagePath: function (newContent, oldContent) {
			this.log(
				"watch getSelectedImagePath. ref - field-image-" +
					this.selectedImageFieldName
			);
			this.$refs[
				"input-field-" + this.selectedImageFieldName
			][0].value = newContent;
			this.$refs[
				"field-image-" + this.selectedImageFieldName
			][0].src = newContent;
			this.log(
				"watch getSelectedImagePath. newContent" +
				this.$refs[
					"field-image-" + this.selectedImageFieldName
				][0].src
			);
		},		
		getRepeaterNewValues:function (newContent, oldContent) {
			this.log("watch getRepeaterNewValues.",newContent);
			this.$refs["input-field-" + this.currentRepeaterFieldName][0].value=JSON.stringify(newContent);
		},
		getIsReloadContent: function (newContent, oldContent) {
			//reactive fix. 
			this.log("watch getIsReloadContent. loading record to inputs");
			if (newContent === true) {
				this.setIsUpdateDone(false);
				this.setIsReloadContent(false);
				if (this.getAppStates["repeaterManagerOpen"]) {
					this.toggleAppState("repeaterManagerOpen");
				}			
				if (this.getAppStates["imageSelectionOpen"]) {
					this.toggleAppState("imageSelectionOpen");
				}
				this.getDataContentFields.forEach((contentField) => {
					try {
						this.log('field name, value:',contentField.name,this.getCurrentDataContent[contentField.name]);
						let fieldValue = "";
						let currentRecordFieldValue = this.getCurrentDataContent[contentField.name];
						//currentRecordFieldValue
						if (currentRecordFieldValue===' ' ||currentRecordFieldValue==='" "' || currentRecordFieldValue==='""') {
							currentRecordFieldValue = '';
						} 
						if (contentField.fieldType === "ts") {
							try {
								const localDate = new Date(currentRecordFieldValue * 1000);
								fieldValue = localDate.toLocaleString();
							}catch {
								fieldValue = '';
							}
							this.$refs['input-field-' + contentField.name][0].value = fieldValue;
						} else if (contentField.fieldType === 'date'){
							//this.log('date field',this.getCurrentDataContent[contentField.name]);
							let dateFormatValue = new Date(currentRecordFieldValue);
							let strFormatValue = JSON.stringify(dateFormatValue);
							fieldValue = strFormatValue.slice(1,11);
							//this.log('dateFormatValue',dateFormatValue);
							//this.log('strFormatValue',strFormatValue);
							this.log('date fieldValue',fieldValue);
							this.$refs['input-field-' + contentField.name][0].value = fieldValue;
						} else if (contentField.fieldType === 'select'){
							if (contentField.multiple){
								let fieldValueArr = [];
								try {
									fieldValueArr = JSON.parse(currentRecordFieldValue);
									this.log('fieldValueArr',fieldValueArr);
									let selectRefObj = this.$refs['input-field-'+contentField.name][0];
									this.log('selectRefObj',selectRefObj);

									selectRefObj.options.forEach(option => {

										// if (fieldValueArr.includes(option.value)){
										// 	this.log('selected option1',option.index);
										// }
										//this.log('option.value',option.value);
										// todo make more effective
										if (option.selected==true){
											option.selected=false;
											this.log('clear selected option2',option.index);
										}
										fieldValueArr.forEach(selectedValue => {

											if (option.value === selectedValue.id){
												this.log('selected option2',option.index);
												option.selected = true
											}
										})
									});		
								} catch (err){
									this.log('watch getIsReloadContent. err loading select values. err:');
								}
							}else{
								let selectRefObj = this.$refs[
									'input-field-' +contentField.name][0]
								//this.log("selectRefObj",selectRefObj);
								//selectRefObj.value
								//this.log('value',selectRefObj.value);
								//this.log('selectedIndex',selectRefObj.selectedIndex);
								//this.log('options',selectRefObj.options.length);
								selectRefObj.options.forEach(option => {
									if (option.value === currentRecordFieldValue){
										this.log('selected option',option.index);
										option.selected = true
									}
								});
								// let optionsToSelect = selectRefObj.options[0].filter(option => {
								// 	option.value === this.getCurrentDataContent[contentField.name];
								// });
								
								// this.log('optionsToSelect',optionsToSelect);
								//selectRefObj.selectedIndex = 3;

								//this.log('selectedIndex 3',selectRefObj.selectedIndex);
							}
            // if (printerOpts.length) {
				//'select-option-' + contentField.name + keyOption
            //     this.printer = printerOpts[0].value;
            // }
			// 					fieldValue
			// 				}
			// 											let OptionsObj = []
			// 				let selectValue = '';
			// 				allOptions.forEach(option => {
			// 					if (option.selected){
			// 						if (contentField.multiple )
			// 							OptionsObj.push({tagValue : option.value})
			// 						else
			// 							selectValue = option.value
			// 					}
			// 				});
			// 				if (contentField.multiple ) {
			// 					dataTypeRecord[contentField.name] = OptionsObj;
			// 					this.log('OptionsObj', OptionsObj);						
			// 				}else{
			// 					dataTypeRecord[contentField.name] = selectValue;
			// 					this.log('selectValue', selectValue);						
			// 				}
							// let OptionsObj = []
							// allOptions.forEach(option => {
							// 	if (option.selected){
							// 		OptionsObj.push({tagValue : option.value})
							// 	}
							// });
							// dataTypeRecord[contentField.name] = OptionsObj;
							// this.log('OptionsObj', OptionsObj);						
						} else {
							fieldValue = currentRecordFieldValue;
							this.$refs['input-field-' + contentField.name][0].value = fieldValue;	
						}
						if (contentField.fieldType === 'image'){
							this.$refs['field-image-' + contentField.name][0].src = currentRecordFieldValue;
						}						
						if (contentField.fieldType === 'tags'){
							
							//this.$refs['input-field-tags-display-' + contentField.name][0].innerText = this.getTagsDisplay(fieldValue);
							this.log('tags display field', this.$refs['input-field-tags-display-' + contentField.name][0].innerText)
						}
						if (contentField.name === 'createdTs'){
							this.$refs['field-created-ts-hidden'][0].value = currentRecordFieldValue;
						}
					} catch (err) {
						this.log("construct record. err: ", err);
					}
				});
			}
		},
	},
	methods: {
		...mapActions([
			"setDataType",
			"loadDataTable",
			"addDataTypeRecord",
			"updateDataTypeRecord",
			"setIsDataContentChanged",
			"setIsReloadContent",
			"setAppState",			
			"toggleAppState",
			"setRepeaterFields",
			"setRepeaterRecords",
			"setRepeaterUniqueFieldName",
			"setIsUpdateDone",
			"clearDataRecordValues",
			"setIsReloadRepeaterLocalHtml"
		]),
		tagChange(fieldName, fieldValueStr){
			this.log('tagChange ', fieldName, fieldValueStr);
			try {
				this.log('ref: ', this.$refs["input-field-" + fieldName]);
				this.$refs["input-field-" + fieldName][0].value = fieldValueStr;
				this.setIsDataContentChanged(true);
				this.log('tagChange ok');				
			} catch (error) {
				this.log('tagChange. err: ', error);	
			}
		},
		getTagsDisplay(tagsFieldValue){
			//inactive. not reactive. maybe use for display later
			this.log("getTagsDisplay");
			let tagsHtml='';
			try {
				tagsFieldValue.forEach(tag =>{
					tagsHtml = tagsHtml + '<span>' + tag + '</span>';
				})
			} catch (err) {
				this.log("getTagsDiplay. err: ", err);
			}
			return tagsHtml;
		},
		openImageSelection(imageFieldName) {
			this.log("openImageSelection");
			try {
				this.selectedImagePath = this.$refs[
					"input-field-" + imageFieldName
				][0].value;
				this.selectedImageFieldName = imageFieldName;
				this.setIsDataContentChanged(true);
				this.toggleAppState("imageSelectionOpen");
			} catch (err) {
				this.log("error opening image selection. err: ", err);
			}
			this.log("openImageSelection end");
		},
		openRepeaterManager(repeaterFieldName) {
			this.log("openRepeaterManager",repeaterFieldName);
			try {
				this.currentRepeaterFieldName = repeaterFieldName;
				this.currentRepeaterIsSingle = this.getDataContentFields.find(field => field.name === repeaterFieldName).singleRepeaterRecord;
				const repeaterFields = this.getDataContentFields.find(field => field.name === repeaterFieldName).repeaterFields;
				const repeaterUniqueFieldName = this.getDataContentFields.find(field => field.name === repeaterFieldName).repeaterUniqueFieldName;
				this.log("repeaterfields",repeaterFields);
				this.setRepeaterFields(repeaterFields);
				this.log("repeaterUniqueFieldName",repeaterUniqueFieldName);
				this.setRepeaterUniqueFieldName(repeaterUniqueFieldName);
			} catch (err) {
				this.log("error getting repeaterfields. err: ", err);
			}
			try {
				const repeaterRecords = this.$refs["input-field-" + repeaterFieldName][0].value;
				const repeaterRecordsObj = JSON.parse(repeaterRecords);
				this.log("repeaterRecords",repeaterRecordsObj);
				this.setRepeaterRecords(repeaterRecordsObj);
			} catch (err) {
				this.setRepeaterRecords([]);
				this.log("error getting repeaterRecords. err: ", err);
			}
			this.log("setIsReloadRepeaterLocalHtml true");
			this.setIsReloadRepeaterLocalHtml(true);
			try {
				this.setIsDataContentChanged(true);
				this.setAppState({name:"repeaterManagerOpen", value: true});
				this.log("repeaterManagerOpen",this.getAppStates["repeaterManagerOpen"]);
			} catch (err) {
				this.log("error opening image selection. err: ", err);
			}
			this.log("openRepeaterManager end");
		},
		focusInput(inputRef){
			this.log("focusInput. inputRef",inputRef);
			this.$refs[inputRef][0].focus();
		},
		clearContentFields() {
			try {
				this.log("clearContentFields");
				this.setIsUpdateDone(false);
				this.getDataContentFields.forEach((contentField) => {
					try {
						this.$refs["input-field-" + contentField.name][0].value = "";
						if (contentField.fieldType==="image"){
							this.$refs["field-image-" + contentField.name][0].src = this.getDefaultImageUrl;
						}
					} catch (err) {
						this.log(
							contentField.name,
							this.$refs["input-field-" + contentField.name][0].value
						);
						this.log("construct record. err: ", err);
					}
				});
			} catch (err) {
				//todo: fix error without try
				this.log("clearContentFields err: ", err);
			}
		},
		async addContentRecord() {
			this.log("addContentRecord");
			this.log(this.$refs);
			let dataTypeRecord = {};
			let dataTypeIdFieldName = this.getDataType.dataTypeIdField;
			this.getDataContentFields.forEach((contentField) => {
				try {
					this.log(contentField.name,this.$refs["input-field-" + contentField.name][0].value);
					if (dataTypeIdFieldName !== contentField.name) {
						if (this.$refs["input-field-" + contentField.name][0].value === "")
							dataTypeRecord[contentField.name] = " ";
						else if (contentField.fieldType === 'repeater')
							dataTypeRecord[contentField.name] = JSON.parse(this.$refs[
								'input-field-' + contentField.name
							][0].value);						
						else if (contentField.fieldType === 'tags')
							dataTypeRecord[contentField.name] = JSON.parse(this.$refs[
								'input-field-' + contentField.name
							][0].value);
						else if (contentField.fieldType === 'select'){
							let allOptions = this.$refs[
								'input-field-' +contentField.name][0].options
							//this.log('allOptions',allOptions);
							//this.log('allOptions',allOptions.length);
							let OptionsObj = []
							let selectValue = '';
							allOptions.forEach(option => {
								if (option.selected){
									if (contentField.multiple )
										OptionsObj.push({id : option.value})
									else
										selectValue = option.value
								}
							});
							if (contentField.multiple ) {
								dataTypeRecord[contentField.name] = OptionsObj;
								this.log('OptionsObj', OptionsObj);						
							}else{
								dataTypeRecord[contentField.name] = selectValue;
								this.log('selectValue', selectValue);						
							}
						} else
							dataTypeRecord[contentField.name] = this.$refs[
								"input-field-" + contentField.name
							][0].value;
					}
				} catch (err) {
					this.log("construct record. err: ", err);
				}
			});
			// todo - check if need to make server ts adjustment or creat date on server
			const epochTime = Math.floor(new Date().getTime()/1000.0);
			dataTypeRecord["createdTs"] = epochTime;
			dataTypeRecord["lastUpdatedTs"] = epochTime;
			try {
				const addRecordResult = this.addDataTypeRecord(dataTypeRecord)
					.then((res) => {
						this.log("addDataTypeRecord. res: ", res);
						//this.clearDataRecordValues();
						
						this.clearContentFields();
						this.setIsDataContentChanged(false);
						const dataTableResult = this.loadDataTable(true)
							.then((res) => {
								this.log("loadDataTable from details. res: ", res);
							})
							.catch((err) => {
								this.log("error loadDataTable. err: ", err);
							});
					})
					.catch((err) => {
						this.log("error addDataTypeRecord. err: ", err);
					});
			} catch (err) {
				this.log("failed to addDataTypeRecord. err: ", err);
			}
		},
		updateContentRecord() {
			this.log("updateContentRecord");
			let dataTypeRecord = {};
			this.getDataContentFields.forEach((contentField) => {
				try {
					this.log(contentField.name,this.$refs['input-field-' + contentField.name][0].value);
					if (this.$refs['input-field-' + contentField.name][0].value === "")
						dataTypeRecord[contentField.name] = " ";
					else if (contentField.fieldType === 'repeater')
						dataTypeRecord[contentField.name] = JSON.parse(this.$refs[
							'input-field-' + contentField.name
						][0].value);
					else if (contentField.fieldType === 'select'){
						let allOptions = this.$refs[
							'input-field-' +contentField.name][0].options
						//this.log('allOptions',allOptions);
						//this.log('allOptions',allOptions.length); multiple
						let OptionsObj = [];
						let selectValue = '';
						allOptions.forEach(option => {
							if (option.selected){
								if (contentField.multiple )
									OptionsObj.push({id : option.value})
								else
									selectValue = option.value
							}
						});
						if (contentField.multiple ) {
							dataTypeRecord[contentField.name] = OptionsObj;
							this.log('OptionsObj', OptionsObj);						
						}else{
							dataTypeRecord[contentField.name] = selectValue;
							this.log('selectValue', selectValue);						
						}
					} else if (contentField.fieldType === 'tags'){
							dataTypeRecord[contentField.name] = JSON.parse(this.$refs[
								'input-field-' + contentField.name
							][0].value);
					} else if (contentField.name === 'createdTs') {
						dataTypeRecord['createdTs']=this.$refs["field-created-ts-hidden"][0].value;
					} else 
						dataTypeRecord[contentField.name] = this.$refs[
							"input-field-" + contentField.name
						][0].value;
				} catch (err) {
					this.log("construct record. err: ", err);
				}
			});
			const epochTime = Math.floor(new Date().getTime()/1000.0);
			dataTypeRecord["lastUpdatedTs"] = epochTime;
			this.log("dataTypeRecord", dataTypeRecord);
			try {
				const updateRecordResult = this.updateDataTypeRecord(dataTypeRecord)
					.then((res) => {
						this.log("updateDataTypeRecord. res: ", res);
						this.setIsUpdateDone(true);
						this.setIsDataContentChanged(false);
						//todo - dont force table load after update. need to seperate data and parsed data. maybe add field to do it.
						const dataTableResult = this.loadDataTable(true) //true force table load regardless of localdata
							.then((res) => {
								this.log("loadDataTable from details. res: ", res);
							})
							.catch((err) => {
								this.log("error loadDataTable. err: ", err);
							});
					})
					.catch((err) => {
						this.log("error updateDataTypeRecord. err: ", err);
					});
			} catch (err) {
				this.log("failed to updateDataTypeRecord. err: ", err);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import "@/scss/main.scss";

.main-container.sidebar-closed {
	.data-content-wrap {
		transform: translateX(calc(-#{$app-sidebar-width} + #{$app-space-side}* 2));
		width: calc(100% - #{$app-table-width} - #{$app-space-side}* 2);
	}
}
.main-container.mid-closed {
	.data-content-wrap {
		transform: translateX(calc(-#{$app-table-width} + #{$app-space-side}* 4));
		width: calc(100% - #{$app-sidebar-width} - #{$app-space-side}* 4);
	}
}
.main-container.sidebar-closed.mid-closed {
	.data-content-wrap {
		transform: translateX(
			calc(-#{$app-table-width} - #{$app-sidebar-width} + #{$app-space-side}* 6)
		);
		width: calc(100% - #{$app-space-side}* 6);
	}
}

.data-content-wrap {
	width: calc(100% - #{$app-table-width} - #{$app-sidebar-width});
	position: fixed;
	left: calc(#{$app-table-width} + #{$app-sidebar-width});
	background: $app-bg-color;
	min-height: 100vh;
	padding-top: calc(#{$app-header-height} + #{$app-space-top-high});
	padding-bottom: calc(#{$app-footer-height} + #{$app-space-bottom});
	padding-right: calc(#{$app-space-side-wide} - #{$app-space-x});
	padding-left: calc((#{$app-space-side-wide} - #{$app-space-x}) / 2);
	transition: $app-transition-time all;
	.data-content-inner {
		position: relative;
		.place-holder-layer {
			height: calc(
				100vh - #{$app-footer-height} - #{$app-space-bottom} - #{$app-header-height} -
					#{$app-space-top-high}
			);
			position: absolute;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			@keyframes spin {
				100% {
					transform: rotate(360deg);
				}
			}
			.logo-wrap {
				height: $app-space-side-wide;
				&.loading {
					animation: spin 0.3s linear infinite;
					animation-fill-mode: forwards;
				}
			}
		}
		.main-title {
			font-size: $app-title-fs-big;
			color: $app-title-color3;
			font-weight: 500;
			text-align: center;
		}
		.content-fields-cols {
			display: flex;
			max-height: calc(
				100vh - #{$app-footer-height} - #{$app-space-bottom} - #{$app-header-height} -
					#{$app-space-top-high} - 8rem
			);
			overflow: auto;
			padding-top: $app-space-bottom;
			.content-fields-col {
				&.col1 {
					flex: 0 0 auto;
				}				
				&.col2 {
					flex: 4 1 auto;
				}
				.content-field {
					margin: 0 $app-space-x $app-space-y3;
					position: relative;
					&.hidden {
						display: none;
					}
					.img-wrap {
						height: $app-table-line-height;
						max-width: calc(#{$app-table-line-height} * #{$app-image-ratio});
						min-width: calc(#{$app-table-line-height} * #{$app-image-ratio});
						border-radius: $app-border-radius;
						border: 1px solid $app-text-color2;
						cursor: pointer;
						img {
							width: 100%;
							border-radius: $app-border-radius;
						}
					}
					.repeater-wrap {
						position:relative;
						cursor:pointer;
						.open-repeater-icon{
							position: absolute;
							left: $app-space-x;
							top: 0;
							color: $app-text-color2;
							height: $app-input-height;
							display: flex;
							align-items: center;
							transition: $app-transition-time-short; 
							:hover{
								color: $app-hover-color;
							}
						}
						input{
							padding-left: calc(#{$app-space-x} + #{$app-space-x-small} + #{$app-icon-size})
						}					
					}
					.tags-wrap{
						position: relative;
						height: calc(#{$app-input-height}*2 + #{$app-space-y3} );
						.add-tag-icon{
							position: absolute;
							left: $app-space-x;
							top: 0;
							color: $app-text-color2;
							height: $app-input-height;
							display: flex;
							align-items: center;
						}
						input{
							padding-left: calc(#{$app-space-x} + #{$app-space-x-small} + #{$app-icon-size})
						}
					}
					select[multiple]{
						height: calc(#{$app-input-height}*2 + #{$app-space-y3});
						max-height: calc(#{$app-input-height}*2 + #{$app-space-y3});
						padding: $app-space-y-small $app-space-x;
					}
					.input-field-label {
						position: absolute;
						top: calc(#{$app-input-height}/ 2 - #{$app-text-fs-base}/ 2);
						left: $app-space-x;
						line-height: 1;
						background-color: $app-bg-color;
						padding: 0 3px;
						transition: top $app-transition-time-short,
						font-size $app-transition-time-short;
					}
					.select-wrap ~ label,
					textarea:focus ~ label,
					textarea.input-field-textarea ~ label,
					input:focus ~ label,
					input:valid ~ label,
					input:disabled ~ label,
					.repeater-wrap ~ label,					
					.tags-wrap ~ label,
					.input-field-date ~ label {
						font-size: $app-text-fs-smaller;
						top: calc(-#{$app-text-fs-smaller}* 0.6);
					}
				}
			}
		}
		.question-input {
			height: 2.86rem;
			width: 100%;
			font-size: 1.14rem;
			text-align: center;
			border-radius: 30px;
			/*box-shadow: $app-shadow2;*/
			margin-top: 0.714rem;
			/* outline-color: #AE0000; */
		}
		.content-btns {
			display: flex;
			justify-content: center;
			/*calc(100vh - #{$app-footer-height} - #{$app-space-bottom} - #{$app-header-height} - #{$app-space-top-high})*/
			margin-top: $app-space-bottom;
			.content-btn {
				max-width: $app-width-btn;
				position: relative;
				.b-icon{
					position: absolute;
					left: $app-space-x;
					top: calc(#{$app-height-btn}/2 - #{$app-icon-size}/2);
				}
			}
		}
	}
}
</style>

