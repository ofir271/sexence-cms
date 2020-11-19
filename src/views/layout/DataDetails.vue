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
				/>
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
									['string', 'id', 'title', 'html', 'date', 'select'].includes(
										contentField.fieldType
									)
								"
								:ref="'input-field-' + contentField.name"
								:key="'input-field-input' + contentField.name"
								:disabled="contentField.disabled || contentField.fieldType === 'id'"
								:hidden="
									contentField.hidden ||
									(getContentState === 'Add' && contentField.fieldType === 'id')
								"
								:required="contentField.required"
								@change="setIsDataContentChanged(true)"
								type="text"
							/>
							<div
								v-if="contentField.fieldType === 'image'"
								:key="'input-field-' + contentField.name"
								:class="'img-wrap'"
								@click="openImageSelection(contentField.name)"
							>
								<input
									:ref="'input-field-' + contentField.name"
									:name="'input-field-' + contentField.name"
									:hidden="true"
									@change="
										getIsDataContentChanged ? '' : setIsDataContentChanged(true)
									"
									type="text"
								/>
								<img
									:src="contentField.value"
									:ref="'field-image-' + contentField.name"
								/>
							</div>
							<input
								v-if="contentField.fieldType == 'ts'"
								:ref="'input-field-' + contentField.name"
								:key="'input-field-' + contentField.name"
								:disabled="true"
								:hidden="contentField.hidden || getContentState === 'Add'"
								:required="contentField.required"
								@change="
									getIsDataContentChanged ? '' : setIsDataContentChanged(true)
								"
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
							<!-- date YYYY-MM-DD  YYYYMMDD-->
							<input
								v-if="
									['string', 'id', 'title', 'html', 'date', 'select'].includes(
										contentField.fieldType
									)
								"
								:ref="'input-field-' + contentField.name"
								:key="'input-field-' + contentField.name"
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
								v-if="contentField.fieldType == 'ts'"
								:ref="'input-field-' + contentField.name"
								:key="'input-field-' + contentField.name"
								:disabled="true"
								:hidden="contentField.hidden || getContentState === 'Add'"
								:required="contentField.required"
								@keydown="
									getIsDataContentChanged ? '' : setIsDataContentChanged(true)
								"
								type="text"
							/>
							<div
								v-if="contentField.fieldType === 'image'"
								:key="'input-field-' + contentField.name"
								:class="'img-wrap'"
								@click="openImageSelection(contentField.name)"
							>
								<input
									:ref="'input-field-' + contentField.name"
									:name="'input-field-' + contentField.name"
									:hidden="true"
									@change="
										getIsDataContentChanged ? '' : setIsDataContentChanged(true)
									"
									type="text"
								/>
								<img
									:src="contentField.value"
									:ref="'field-image-' + contentField.name"
								/>
							</div>
							<div
								v-if="contentField.fieldType === 'select'"
								:key="'input-field-' + contentField.name"
								:class="'select-wrap'"
							>
								<select
									:ref="'input-field-' + contentField.name"
									:name="'input-field-' + contentField.name"
									:hidden="false"
									:disabled="false"
									@change="
										getIsDataContentChanged ? '' : setIsDataContentChanged(true)
									"
								>

								</select>

							</div>							
							<div
								v-if="contentField.fieldType === 'repeater'"
								:key="'input-field-' + contentField.name"
								:class="'repeater-wrap'"
								@click="openRepeaterManager(contentField.name)"
							>
								<input
									:ref="'input-field-' + contentField.name"
									:name="'input-field-' + contentField.name"
									:hidden="false"
									:disabled="false"
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
								v-if="!contentField.hidden"
								:key="'input-field-label-' + contentField.name"
								:for="'input-field-' + contentField.name"
								class="input-field-label"
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
import { mapGetters, mapActions } from "vuex";

export default {
	name: "DataDetails",
	components: { TheImageSelection, TheRepeaterManager },
	mixins: [LogMixin],
	data() {
		return {
			selectedImageFieldName: "",
			selectedImagePath: "",
			currentRepeaterFieldName: ""
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
			"getRepeaterNewValues"
		]),
		dataContentTitle() {
			if (this.getContentState !== "")
				return this.getContentState + " " + this.getDataType.singleDisplay;
			else return "";
		},
	},
	watch: {
		getDataType: function (newContent, oldContent) {
			this.log("watch getDataType");
			if (this.getAppStates["repeaterManagerOpen"]) {
				this.toggleAppState("repeaterManagerOpen");
				//this.log("toggle repeaterManagerOpen");
			}			
			if (this.getAppStates["imageSelectionOpen"]) {
				this.toggleAppState("imageSelectionOpen");
			}
		},		
		getContentState: function (newContent, oldContent) {
			this.log("watch getContentState");
			if (newContent === "Add" && oldContent !== "") {
				this.clearContentFields();
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
		},		
		getRepeaterFields: function (newContent, oldContent) {
			this.log("watch getRepeaterFields.");
			// this.$refs[
			// 	"input-field-" + this.selectedImageFieldName
			// ][0].value = newContent;
			// this.$refs[
			// 	"field-image-" + this.selectedImageFieldName
			// ][0].src = newContent;
		},
		getRepeaterNewValues:function (newContent, oldContent) {
			this.log("watch getRepeaterNewValues.",newContent);
			this.$refs["input-field-" + this.currentRepeaterFieldName][0].value=JSON.stringify(newContent);
		},
		getDataContentFieldsCol1: function (newContent, oldContent) {
			this.log("watch getDataContentFieldsCol1");
			/* todo - try and make reactive */
		},		
		getIsReloadContent: function (newContent, oldContent) {
			//reactive fix
			this.log("watch getIsReloadContent");
			if (newContent === true) {
				this.setIsReloadContent(false);
				if (this.getAppStates["repeaterManagerOpen"]) {
					this.toggleAppState("repeaterManagerOpen");
				}			
				if (this.getAppStates["imageSelectionOpen"]) {
					this.toggleAppState("imageSelectionOpen");
				}
				this.getDataContentFields.forEach((contentField) => {
					try {
						//this.log(this.$refs["input-field-" + contentField.name][0].value);
						//this.log(contentField.name);
						this.$refs[
							"input-field-" + contentField.name
						][0].value = this.getCurrentDataContent[contentField.name];
						if (contentField.fieldType==="image"){
							this.$refs["field-image-" + contentField.name][0].src = this.getCurrentDataContent[contentField.name];
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
			"setRepeaterUniqueFieldName"
		]),
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
				this.log("error getting repeaterRecords. err: ", err);
			}
			try {
				this.setIsDataContentChanged(true);
				this.setAppState({name:"repeaterManagerOpen", value: true});
				this.log("repeaterManagerOpen",this.getAppStates["repeaterManagerOpen"]);
			} catch (err) {
				this.log("error opening image selection. err: ", err);
			}
			this.log("openRepeaterManager end");
		},
		clearContentFields() {
			try {
				this.log("clearContentFields");
				this.getDataContentFields.forEach((contentField) => {
					try {
						this.$refs["input-field-" + contentField.name][0].value = "";
						if (contentField.fieldType==="image"){
							this.$refs["field-image-" + contentField.name][0].src = ""
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
		addContentRecord() {
			this.log("addContentRecord");
			this.log(this.$refs);
			let dataTypeRecord = {};
			let dataTypeIdFieldName = this.getDataType.dataTypeIdField;
			this.getDataContentFields.forEach((contentField) => {
				try {
					this.log(this.$refs["input-field-" + contentField.name][0].value);
					this.log(contentField.name);
					if (dataTypeIdFieldName !== contentField.name) {
						if (this.$refs["input-field-" + contentField.name][0].value === "")
							dataTypeRecord[contentField.name] = " ";
						else
							dataTypeRecord[contentField.name] = this.$refs[
								"input-field-" + contentField.name
							][0].value;
					}
				} catch (err) {
					this.log("construct record. err: ", err);
				}
			});
			// todo - check if need to make server ts adjustment or creat date on server
			const localTs = Date.now();
			dataTypeRecord["createdTs"] = localTs;
			dataTypeRecord["lastUpdatedTs"] = localTs;
			try {
				const addRecordResult = this.addDataTypeRecord(dataTypeRecord)
					.then((res) => {
						this.log("addDataTypeRecord. res: ", res);
						this.clearContentFields();
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
					this.log(this.$refs["input-field-" + contentField.name][0].value);
					if (this.$refs["input-field-" + contentField.name][0].value === "")
						dataTypeRecord[contentField.name] = " ";
					else if (contentField.fieldType === "repeater")
						dataTypeRecord[contentField.name] = JSON.parse(this.$refs[
							"input-field-" + contentField.name
						][0].value);
					else 
						dataTypeRecord[contentField.name] = this.$refs[
							"input-field-" + contentField.name
						][0].value;
					
				} catch (err) {
					this.log("construct record. err: ", err);
				}
			});
			const localTs = Date.now();
			dataTypeRecord["lastUpdatedTs"] = localTs;
			this.log("dataTypeRecord", dataTypeRecord);
			try {
				const updateRecordResult = this.updateDataTypeRecord(dataTypeRecord)
					.then((res) => {
						this.log("updateDataTypeRecord. res: ", res);
						this.message = "updated sucessfully";
						this.setIsDataContentChanged(false);
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
					flex: 1 0 auto;
				}				
				&.col2 {
					flex: 3 1 auto;
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
							height: $app-input-height;
							display: flex;
							align-items: center;
						}
						input{
							padding-left: calc(#{$app-space-x} + #{$app-space-x-small} + #{$app-icon-size})
						}					
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
					input:focus ~ label,
					input:valid ~ label,
					input:disabled ~ label {
						font-size: $app-text-fs-smaller;
						top: calc(-#{$app-text-fs-smaller}* 0.6);
					}
					.repeater-wrap ~ label {
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
			}
		}
	}
}
</style>

