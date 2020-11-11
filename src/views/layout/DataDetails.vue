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
							v-for="(contentField, key) in getDataContentFieldsCol1"
							:key="'content-field-'+key"
							:class="['content-field-'+contentField.fieldType, 'content-field']"
						>
							<input :ref="'input-field-'+contentField.name" v-model="contentField.value" :placeholder="contentField.name" type="text"/>
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
							<input v-model="contentField.value" :placeholder="contentField.name" type="text"/>
							{{contentField.name}}
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
			"getContentState"
		]),
		dataContentTitle() {
			if (this.getContentState !== "") 
				return this.getContentState + " " + this.getDataType.display;
			else
				return "";
		},
	},
	methods: {
		...mapActions(["setDataType", "loadDataTable", "addDataTypeRecord", "updateDataTypeRecord"]),
		addContentRecord(){
			this.log('addContentRecord');
			this.log(this.$refs);
			let dataTypeRecord = {}
			this.getDataContentFields.forEach(ContentField => {
				//this.$refs[ContentField.name].values
				this.log(ContentField.name);
			});
			try {
				const addRecordResult = this.addDataTypeRecord(dataTypeRecord)
					.then((res) => {
						this.log("addDataTypeRecord. res: ", res);
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
			this.log(this.$refs);
			let dataTypeRecord = {}
			try {
				const updateRecordResult = this.updateDataTypeRecord(dataTypeRecord)
					.then((res) => {
						this.log("updateDataTypeRecord. res: ", res);
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
			margin-bottom: $app-space-bottom;
			color: $app-title-color3;
			font-weight: 500;
			text-align: center;
		}
		.content-fields-cols{
			display:flex;
			.content-fields-col{
				flex: 1 1 auto;
				.content-field{
					margin: 0 $app-space-x $app-space-y3;
					input[type=text]{
						width: 100%;
						height: $app-btn-height;
						box-shadow: $app-shadow2;
						border-radius: $app-border-radius2;
						text-align: center;
						border: none;
						color: $app-text-color;
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

