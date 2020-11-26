<template>
	<div class="repeater-manager-wrap">
		<div
			@click="toggleAppState('repeaterManagerOpen')"
			:class="['close-repeater-manager']"
		>
			<b-icon icon="x"></b-icon>
		</div>
		<div class="bg-layer"></div>
		<div class="repeater-manager-inner">
			<div class="repeater-table">
				<div class="repeater-table-titles">
					<div
						v-for="(repeaterField, key) in getRepeaterFields"
						:key="'repeater-table-title-' + key"
						:class="['repeater-table-title']"
					>
						{{ repeaterField.displayName }}
					</div>
				</div>
				<div class="repeater-table-lines">
					<div
						v-for="(repeaterRecord, recordKey) in getRepeaterRecords"
						:key="'repeater-table-line-' + recordKey"
						:class="['repeater-table-line']"
					>
						<div
							v-for="(repeaterField, fieldKey) in getRepeaterFields"
							:key="'repeater-table-field-' + fieldKey + '-' + recordKey"
							:class="['repeater-feild-type-'+repeaterField.class,'repeater-table-field']"
						>
							<vue-editor 
								:id="'editor-'+repeaterField.name+ '-' + recordKey" 
								v-model="localEditorsContent[recordKey]"
								v-if="repeaterField.class === 'html'"
								:ref="'input-field-' + repeaterField.name + '-' + recordKey"
								:key="'input-field-' + repeaterField.name + '-' + recordKey"
								:name="'input-field-' + repeaterField.name + '-' + recordKey"
							>
							</vue-editor>
 	
							<textarea
								v-else-if="repeaterField.class === 'textarea'"
								:ref="'input-field-' + repeaterField.name + '-' + recordKey"
								:key="'input-field-' + repeaterField.name + '-' + recordKey"
								:name="'input-field-' + repeaterField.name + '-' + recordKey"
								:value="repeaterRecord[repeaterField.name]"
								
							>	
							</textarea>	
				
							<input
								v-else
								:ref="'input-field-' + repeaterField.name + '-' + recordKey"
								:key="'input-field-' + repeaterField.name + '-' + recordKey"
								:name="'input-field-' + repeaterField.name + '-' + recordKey"
								v-model="repeaterRecord[repeaterField.name]"
								type="text"
								
							/>
							

						</div>
						<div
							class="delete-btn-wrap"
							v-show="!isSingleRecord"
							@click="
								deleteRepeaterRecordClick(
									repeaterRecord[getRepeaterUniqueFieldName],recordKey
								)
							"
						>
							<b-icon icon="x-circle-fill"> </b-icon>
						</div>
					</div>
				</div>
				<div
					class="add-btn-wrap"
				>
					<b-icon icon="plus-square-fill" @click="addRepeaterRecordClick()">
						Add
					</b-icon>
				</div>
			</div>
			<div class="save-btn-wrap">
				<button
					class="general-btn small-btn"
					key="repeater-save-btn"
					@click="saveRepeaterAndClose()"
				>
					Save
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import LogMixin from "@/mixins/LogMixin";
import { mapGetters, mapActions } from "vuex";
export default {
	name: "TheRepeaterManager",
	components: {
		VueEditor
	},
	mixins: [LogMixin],
	props: {
		isSingleRecord: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			localEditorsContent:[]
		};
	},
	computed: {
		...mapGetters([
			"getRepeaterFields",
			"getRepeaterRecords",
			"getRepeaterUniqueFieldName",
			"getRepeaterNewValues",
			"getIsReloadRepeaterLocalHtml"
		]),
	},
	watch: {
		getRepeaterRecords:	function (newContent, oldContent) {
			this.log("repeater manage. watch getRepeaterRecords", newContent);
			//this.localEditorsContent
		},
		getRepeaterFields: function (newContent, oldContent) {
			this.log("repeater manage. watch getRepeaterFields", newContent);
			//this.localEditorsContent = []
			//this.log("repeater manage. localEditorsContent", this.localEditorsContent);
		},
		getIsReloadRepeaterLocalHtml: function (newContent, oldContent) {
			this.log("repeater manage. watch getIsReloadRepeaterLocalHtml", newContent);
			this.log("localEditorsContent",this.localEditorsContent)
			if (newContent===true){
				this.localEditorsContent.splice(0,this.localEditorsContent.length)
				this.log("getRepeaterFields", this.getRepeaterFields);
				let htmlFieldName = this.getRepeaterFields.filter(field => field.class==='html')
				try {
					htmlFieldName = htmlFieldName[0].name;
				} catch {
					htmlFieldName = 'innerHtml';
				}
				this.log("htmlFieldName", htmlFieldName);
				//this.log("getRepeaterRecords", this.getRepeaterRecords);
				this.getRepeaterRecords.forEach(record => {
					//this.log("record['textHtml']", record['textHtml']);
					this.log("record[htmlFieldName]", record[htmlFieldName]);
					this.localEditorsContent.push(record[htmlFieldName])
				});
				this.setIsReloadRepeaterLocalHtml(false);
				//let repeaterRecordHtmlValues = this.getRepeaterRecords.map(a => a.htmlFieldName);
				//this.log("repeaterRecordHtmlValues", repeaterRecordHtmlValues);
				//this.localEditorsContent = getRepeaterRecords.filter()
			} else {
				this.log("localEditorsContent",this.localEditorsContent)
			}
			this.log("repeater manage. localEditorsContent", this.localEditorsContent);
			
		},
	},
	methods: {
		...mapActions([
			"toggleAppState",
			"deleteRepeaterRecord",
			"addRepeaterRecord",
			"setRepeaterNewValues",
			"setRepeaterRecords",
			"setIsReloadRepeaterLocalHtml"
		]),
		async deleteRepeaterRecordClick(recordUniqueValue,recordKey) {
			this.log("deleteRepeaterRecordClick");
			const repeaterRecordsArr = this.getRepeaterManagerRecords();
			try {
				const saveRepeaterContent = await this.setRepeaterRecords(
					repeaterRecordsArr
				)
					.then((res) => {
						this.log("setRepeaterRecords ok. res: ", res);
						this.deleteRepeaterRecord(recordUniqueValue);
						this.localEditorsContent.splice(recordKey,1)
					})
					.catch((err) => {
						this.log("error setRepeaterRecords. err: ", err);
					});
			} catch (error) {
				this.log("deleteRepeaterRecordClick. err: ", error);
			}
		},
		async addRepeaterRecordClick() {
			this.log("addRepeaterRecordClick");
			const repeaterRecordsArr = this.getRepeaterManagerRecords();
			//singleRepeaterRecord
			// try {
			// 	this.log("repeaterRecordsArr.length", repeaterRecordsArr[0].length);
			// }catch(err){
			// 	this.log("repeaterRecordsArr", repeaterRecordsArr);
			// }
			// this.log("getRepeaterRecords", this.getRepeaterRecords.length);
			
			try {
				const saveRepeaterContent = await this.setRepeaterRecords(
					repeaterRecordsArr
				)
					.then((res) => {
						this.log("setRepeaterRecords ok. res: ", res);
						this.addRepeaterRecord();
						this.localEditorsContent.push("");

					})
					.catch((err) => {
						this.log("error setRepeaterRecords. err: ", err);
					});
			} catch (error) {
				this.log("addRepeaterRecordClick. err: ", error);
			}
		},
		async saveRepeaterAndClose() {
			this.log("saveRepeaterAndClose");
			const repeaterRecordsArr = this.getRepeaterManagerRecords();
			//this.setRepeaterNewValues(repeaterRecordsArr);
			try {
				const saveRepeaterContent = await this.setRepeaterNewValues(
					repeaterRecordsArr
				)
					.then((res) => {
						this.log("setRepeaterNewValues ok. res: ", res);
					})
					.catch((err) => {
						this.log("setRepeaterNewValues. err: ", err);
					});
			} catch (error) {
				this.log("saveRepeaterAndClose. err: ", error);
			} finally {
				this.setIsReloadRepeaterLocalHtml(false);
				this.toggleAppState("repeaterManagerOpen");
			}
		},
		getRepeaterManagerRecords() {
			this.log("getRepeaterManagerRecords");
			let keyCouner = 0;
			let repeaterRecordsArr = [];
			let recordObj = {};
			try {
				while (
					this.$refs[
						"input-field-" + this.getRepeaterUniqueFieldName + "-" + keyCouner
					] &&
					keyCouner < 100
				) {
					this.getRepeaterFields.forEach((field) => {
						this.log("field.class", field.class);
						if (field.class === 'html'){
							this.log("xxxx");
							// this.log("ref", this.$refs[
							// 	"input-field-" + field.name + "-" + keyCouner
							// ][0]);							
							// this.log("baseURI", this.$refs[
							// 	"input-field-" + field.name + "-" + keyCouner
							// ][0].baseURI);							
							// this.log("$refs", this.$refs[
							// 	"input-field-" + field.name + "-" + keyCouner
							// ][0].$refs);							
							// this.log("$refs.quillContainer", this.$refs[
							// 	"input-field-" + field.name + "-" + keyCouner
							// ][0].$refs.quillContainer);	
							
							
							// recordObj[field.name] = this.$refs[
							// 	"input-field-" + field.name + "-" + keyCouner
							// ][0].value;
							// this.log("ref: input-field-" + field.name + "-" + keyCouner,' value:', this.$refs[
							// 	"input-field-" + field.name + "-" + keyCouner
							// ][0].value);						
							// let htmlEditorInnerHtml = this.$refs[
							// 	"input-field-" + field.name + "-" + keyCouner
							// ][0].$refs.quillContainer.innerHTML;
							// this.log("$refs.quillContainer.innerHTML", this.$refs[
							// 	"input-field-" + field.name + "-" + keyCouner
							// ][0].$refs.quillContainer.innerHTML);
							this.log('localEditorsContent keyCouner ',this.localEditorsContent);
							recordObj[field.name] = this.localEditorsContent[keyCouner]
						} else {
							recordObj[field.name] = this.$refs[
								"input-field-" + field.name + "-" + keyCouner
							][0].value;
							this.log("ref: input-field-" + field.name + "-" + keyCouner,' value:', this.$refs[
								"input-field-" + field.name + "-" + keyCouner
							][0].value);
						}
					});
					keyCouner = keyCouner + 1;
					this.log(recordObj);
					repeaterRecordsArr.push(recordObj);
					recordObj = {};
				}
			} catch {
				this.log("keyCouner", keyCouner);
			}
			this.log("repeaterRecordsArr:", repeaterRecordsArr);
			return repeaterRecordsArr;
		},
	},
};
</script>
<style lang="scss" >
@import "@/scss/main.scss";
.ql-toolbar.ql-snow{
	background-color: $app-input-disabled-bg-color;
}
.ql-container {
    font-family: $body-font-family;
	font-size: $app-text-fs-smaller;
	background-color: $app-bg-color;
	color: $app-text-color;
}
</style>


<style lang="scss" scoped>
@import "@/scss/main.scss";
.repeater-manager-wrap {
	position: absolute;
	z-index: 9;
	height: calc(
		100vh - #{$app-footer-height} - #{$app-header-height} - #{$app-space-top-high}
	);
	width: 100%;
	top: 0;
	.bg-layer {
		display: flex;
		position: absolute;
		border-radius: $app-border-radius2 $app-border-radius2 0 0;
		background-color: $app-bg-color2;
		opacity: 0.7;
		height: 100%;
		width: 100%;
		z-index: 8;
	}
	.close-repeater-manager {
		position: absolute;
		top: $app-space-y;
		left: $app-space-x;
		z-index: 10;
		color: $app-text-color3;
		cursor: pointer;
		// .b-icon{
		// 	width: $app-icon-size-small;
		// 	height: $app-icon-size-small;
		// }
	}
	.repeater-manager-inner {
		display: flex;
		z-index: 9;
		padding: $app-space-bottom $app-space-x;
		height: 100%;
		overflow-y: auto;
		position: relative;
		color: $app-text-color3;
		flex-direction: column;
		.save-btn-wrap {
			display: flex;
			padding-top: $app-space-y;
			justify-content: center;
		}
		.repeater-table {
			display: flex;
			justify-content: flex-start;
			align-content: center;
			flex-direction: column;
			flex: 1 1 auto;
			.add-btn-wrap {
				display: flex;
				padding-top: $app-space-y;
				justify-content: center;
				cursor: pointer;
			}
			.repeater-table-titles {
				display: flex;
				justify-content: space-around;
				align-content: flex-start;
				padding-bottom: $app-space-x-small;
				.repeater-table-title {
					font-size: $app-text-fs-mid;
				}
			}
			.repeater-table-lines {
				display: flex;
				justify-content: space-around;
				align-content: flex-start;
				flex-direction: column;
				.repeater-table-line {
					position: relative;
					margin-bottom: $app-space-y;
					padding-right: calc(#{$app-icon-size} + #{$app-space-x-small});
					display: flex;
					flex-wrap: wrap;
					justify-content: space-around;
					align-content: flex-start;
					.delete-btn-wrap {
						position: absolute;
						top: 0;
						right: 0;
						display: flex;
						align-items: center;
						color: $app-delete-color;
						.b-icon {
							background-color: $app-bg-color;
							border-radius: calc(#{$app-icon-size}/ 2);
						}
					}
					.repeater-table-field {
						padding: 0 $app-space-x-small;
						margin-bottom: $app-space-y;
						flex: 3 1 auto;
						&.repeater-feild-type-id{
							flex: 1 1 auto;
							width: $app-input-width-small;
						}						
						&.repeater-feild-type-title{
							flex: 6 1 auto;
						}						
						&.repeater-feild-type-textarea{
							flex: 6 1 auto;
							min-width: 100%;
						}						
						&.repeater-feild-type-html{
							flex: 6 1 auto;
							min-width: 100%;
						}
					}
				}
			}
		}
	}
}
</style>