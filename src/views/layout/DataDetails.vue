<template>
	<div class="data-content-wrap">
		<div class="data-content-inner">
			<div
				v-show="!getIsDataType"
				key="data-content-logo-place-holder"
				class="sexence-logo place-holder-layer"
			>
				<div :class="[getIsLoading ? 'loading' : '',getIsSending ? 'sending' : '', 'logo-wrap img-wrap']">
					<img src="@/assets/sexence-icon.svg" alt="header-logo"/>
				</div>
			</div>
			<div
				v-show="getIsDataType"
				key="data-content-main"
				class="data-content-main"
			>
				<h1 class="main-title">{{dataContentTitle}}</h1>

					<div class="content-fields-cols">	
						<div class="content-fields-col col1">				
							<div 
								v-for="contentField in getDataContentFieldsCol1"
								:key="'content-field-'+contentField.name"
								:class="['content-field-'+contentField.fieldType, contentField.hidden || (getContentState==='Add' && (contentField.fieldType==='id'||contentField.fieldType==='ts')) ? 'hidden':'', 'content-field']"
							>
								<input 
									v-if="['string','id','title','html','date','image','select'].includes(contentField.fieldType)"
									:ref="'input-field-'+contentField.name" 
									:key="'input-field-input'+contentField.name" 
									:value="contentField.value" 
									:disabled="contentField.disabled"
									:hidden="contentField.hidden || (getContentState==='Add' && contentField.fieldType==='id')"
									:required="contentField.required"
									@change="setIsDataContentChanged(true)"
									type="text"
								/>								
								<input 
									v-if="contentField.fieldType=='ts'"
									:ref="'input-field-'+contentField.name" 
									:key="'input-field-'+contentField.name" 
									:value="contentField.value" 
									:disabled="contentField.disabled"
									:hidden="contentField.hidden || getContentState==='Add'"
									:required="contentField.required"
									@keydown="getIsDataContentChanged ? '' : setIsDataContentChanged(true)"
									type="text"
								/>
								<label 
									v-if="!(contentField.hidden || (getContentState==='Add' && (contentField.fieldType==='ts' || contentField.fieldType==='id')))"
									:key="'input-field-label-'+contentField.name"									
									:for="'input-field-'+contentField.name"
									class="input-field-label"
								> 
									{{contentField.displayName}} 
								</label>
							</div>
						</div>
						<div 
							v-if="getDataType.detailsCols===2"
							key="content-fields-col2"
							class="content-fields-col col2"
						>
							<div 
								v-for="(contentField, key) in getDataContentFieldsCol2"
								:key="'content-field-'+key"
								:class="['content-field-'+contentField.fieldType, 'content-field']"
							>
								<input 
									v-if="['string','id','title','html','date','image','select'].includes(contentField.fieldType)"
									:ref="'input-field-'+contentField.name" 
									:key="'input-field-'+contentField.name" 
									:name="'input-field-'+contentField.name" 
									:value="contentField.value" 
									:disabled="contentField.disabled"
									:hidden="contentField.hidden"
									:required="contentField.required"
									@keydown="getIsDataContentChanged ? '' : setIsDataContentChanged(true)"
									type="text"
								/>								
								<label 
									v-if="!contentField.hidden"
									:key="'input-field-label-'+contentField.name"
									:for="'input-field-'+contentField.name"
									class="input-field-label"

								> 
									{{contentField.displayName}} 
								</label>
							</div> 
						</div> 
					</div>
					<div class="content-btns">
						<button 
							class="general-btn content-btn add-btn " 
							v-show="getContentState==='Add'" 
							key="content-add-btn"
							@click="addContentRecord"
						>{{getContentState}}</button>
						<button 
							class="general-btn content-btn update-btn" 
							v-show="getContentState==='Update'" 
							key="content-update-btn"
							@click="updateContentRecord"
							:disabled="!getIsDataContentChanged"
						>{{getContentState}}</button>
					</div>

			</div>
		</div>
	</div>
</template>

<script>
import LogMixin from "@/mixins/LogMixin";
import { mapGetters, mapActions } from "vuex";

export default {
	name: "DataDetails",
	components: {},
	mixins: [LogMixin],
	Data() {
		return {};
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
			"getIsDataContentChanged"
		]),
		dataContentTitle() {
			if (this.getContentState !== "") 
				return this.getContentState + " " + this.getDataType.singleDisplay;
			else
				return "";
		},
	},
	watch: {
		getDataContentFieldsCol1: function (newContent, oldContent) {
			this.log('watch getDataContentFieldsCol1');
		}
	},
	methods: {
		...mapActions(["setDataType", "loadDataTable", "addDataTypeRecord", "updateDataTypeRecord","setIsDataContentChanged"]),
		clearContentFields(){
			this.log('clearContentFields');
			this.getDataContentFields.forEach(contentField => {
				try {
					this.log(this.$refs['input-field-'+contentField.name][0].value);
					this.log(contentField.name);
					this.$refs['input-field-'+contentField.name][0].value = "";
				} catch(err) {
					this.log("construct record. err: ", err);
				}
			});
		},
		addContentRecord(){
			this.log('addContentRecord');
			this.log(this.$refs);
			let dataTypeRecord = {}
			let dataTypeIdFieldName = this.getDataType.dataTypeIdField;
			this.getDataContentFields.forEach(contentField => {
				try {
					this.log(this.$refs['input-field-'+contentField.name][0].value);
					this.log(contentField.name);
					if (dataTypeIdFieldName !== contentField.name)
						dataTypeRecord[contentField.name]=this.$refs['input-field-'+contentField.name][0].value;
				} catch(err) {
					this.log("construct record. err: ", err);
				}
			});
			try {
				const addRecordResult = this.addDataTypeRecord(dataTypeRecord)
					.then((res) => {
						this.log("addDataTypeRecord. res: ", res);
						this.clearContentFields();

						this.loadDataTable(this.getDataType.dataTypeName)
					})
					.catch((err) => {
						this.log("error addDataTypeRecord. err: ", err);
					});
			} catch (err) {
				this.log("failed to addDataTypeRecord. err: ", err);
			}
		},
		updateContentRecord(){
			this.log('updateContentRecord');
			let dataTypeRecord = {}
			this.getDataContentFields.forEach(contentField => {
				try {
					this.log(this.$refs['input-field-'+contentField.name][0].value);
					this.log(contentField.name);
					dataTypeRecord[contentField.name]=this.$refs['input-field-'+contentField.name][0].value;
				} catch(err) {
					this.log("construct record. err: ", err);
				}
			});
			this.log('dataTypeRecord', dataTypeRecord);
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

.main-container.sidebar-closed{
	.data-content-wrap{
		transform: translateX(calc(-#{$app-sidebar-width} + #{$app-space-side}*2));
		width: calc(100% - #{$app-table-width} - #{$app-space-side}*2);
	}
}
.main-container.mid-closed{
	.data-content-wrap{
		transform: translateX(calc(-#{$app-table-width} + #{$app-space-side}*4));
		width: calc(100% - #{$app-sidebar-width} -  #{$app-space-side}*4);
	}
}
.main-container.sidebar-closed.mid-closed{
	.data-content-wrap{
		transform: translateX(calc(-#{$app-table-width} - #{$app-sidebar-width} + #{$app-space-side}*6));
		width: calc(100% - #{$app-space-side}*6);
	}
}

.data-content-wrap{
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
	.data-content-inner{
		position: relative;
		.place-holder-layer{
			height: calc(100vh - #{$app-footer-height} - #{$app-space-bottom} - #{$app-header-height} - #{$app-space-top-high});
			position: absolute;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			@keyframes spin { 100% { transform:rotate(360deg); } }
			.logo-wrap{
				height: $app-space-side-wide;
				&.loading{
					animation: spin 0.3s linear infinite;
					animation-fill-mode: forwards;
				}
			}
		}
		.main-title{
			font-size: $app-title-fs-big;
			color: $app-title-color3;
			font-weight: 500;
			text-align: center;
		}
		.content-fields-cols{
			display:flex;
			max-height: calc(100vh - #{$app-footer-height} - #{$app-space-bottom} - #{$app-header-height} - #{$app-space-top-high} - 8rem);
    		overflow: auto;
			padding-top: $app-space-bottom;
			.content-fields-col{
				flex: 1 1 auto;
				.content-field{
					margin: 0 $app-space-x $app-space-y3;
					position: relative;
					&.hidden{
						display: none;
					}
					.input-field-label{
						position: absolute;
						top: calc(#{$app-input-height}/2 - #{$app-text-fs-base}/2);
						left: $app-space-x;
						line-height: 1;
						background-color: $app-bg-color;
						padding: 0 3px;
						transition: top $app-transition-time-short, font-size $app-transition-time-short;
					}
					input:focus ~ label, input:valid ~ label, input:disabled ~ label {
						font-size: $app-text-fs-smaller;
						top: calc(-#{$app-text-fs-smaller}*0.6);
					}
					input[type=text]{
						width: 100%;
						height: $app-input-height;
						box-shadow: $app-shadow2;
						border-radius: $app-border-radius2;
						padding: 0 $app-space-x; 
						text-align: left;
						border: none;
						color: $app-text-color;
						&:disabled{
							background-color: $app-input-disabled-bg-color;
						}
						&:focus{
							outline: 0;
							box-shadow: $app-shadow-input-outline;
						}
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
		.content-btns{
			display:flex;
			justify-content: center;
			/*calc(100vh - #{$app-footer-height} - #{$app-space-bottom} - #{$app-header-height} - #{$app-space-top-high})*/
			margin-top: $app-space-bottom;
			.content-btn{
				max-width: $app-width-btn;
			}
		}
	}
}
</style>

