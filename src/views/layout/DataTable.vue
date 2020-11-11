<template>
	<div class="data-table-wrap">
		<div @click="toggleAppState('midOpen')" class="close-mid close-panel">
			<b-icon icon="arrow-bar-left"></b-icon>
		</div>
		<h1 class="main-title">{{dataTableTitle}}</h1>
		<div class="data-table-list">
			<div 
				v-for="tableDataRecord in getDataTable"
				:key="'data-line-'+ tableDataRecord[getDataType.dataTypeIdField]"
				class="data-table-item"
				@click="setEditRecordDetails(tableDataRecord[getDataType.dataTypeIdField])"
			>
				<div @click="deleteRecord(tableDataRecord[getDataType.dataTypeIdField], tableDataRecord[getDataType.dataTypeTitleField] )" class="delete-record-icon">
					<b-icon icon="arrow-bar-left"></b-icon>
				</div>
				<div 
					v-if="getDataType.dataTypeImageField !== ''"
					:key="'data-line-'+ tableDataRecord[getDataType.dataTypeIdField] +'-field-image'"
					class="data-line-image data-table-field"
				>
					<img 
						:src="tableDataRecord[getDataType.dataTypeImageField]"
					/>
				</div>
				<div class="data-line-text-wrap">	
					<div 
						v-if="getDataType.dataTypeTitleField !== ''"
						:key="'data-line-'+ tableDataRecord[getDataType.dataTypeIdField] +'-field-title'"
						class="data-line-title data-table-field"
					>
						<h3>
							{{tableDataRecord[getDataType.dataTypeTitleField]}}
						</h3>		
					</div>
					<span 
						v-if="getDataType.dataTypeIdField!== ''" 
						:key="'data-line-'+ tableDataRecord[getDataType.dataTypeIdField] +'-field-id'"
						class="data-line-id data-table-field"
					>
						{{tableDataRecord[getDataType.dataTypeIdField]}}
					</span>			
					<div class="data-line-sub-fields-wrap">	
						<template 
							v-for="tableDataField in getDataTableFields"
						>				
							<span 
								v-if="tableDataField.fieldType==='string' || tableDataField.fieldType==='disabled'" 
								:key="'data-line-'+ tableDataRecord[getDataType.dataTypeIdField] +'-field-'+tableDataField.tableOrder+'-span'"
								class="data-line-text"
							>
								{{tableDataRecord[tableDataField.name]}}
							</span>					
						</template>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import LogMixin from "@/mixins/LogMixin";
import { mapGetters, mapActions } from "vuex";

export default {
	name: "DataTable",
	components: {},
	mixins: [LogMixin],
	Data() {
		return {};
	},
	computed: {
		...mapGetters(["getDataType", "getDataTable", "getDataTypesFields", "getDataTableFields", "getIsDataContentChanged"]),
		dataTableTitle() {
			if (this.getDataType.display)
				return this.getDataType.display;
			else
				return "Welcome to Sexence Admin";
		}
	},
	methods: {
		...mapActions(["setDataType", "loadDataTable", "toggleAppState", "deleteDataTypeRecord", "setDataContent"]),
		deleteRecord(recordId, recordTitle = ''){
			this.log('deleteRecord', recordId, recordTitle);
			alert('delete', recordId)
			try {
				const dataTypesResult = this.deleteDataTypeRecord(recordId)
					.then((res) => {
						this.log("setDataTypes. res: ", res);
					})
					.catch((err) => {
						this.log("error setDataTypes. err: ", err);
					});
			} catch (err) {
				this.log("failed to setDataTypes. err: ", err);
			}
		},
		setEditRecordDetails(recordId) {
			this.log('setEditRecordDetails', recordId);
			if (!this.getIsDataContentChanged){
				try {
					const dataTypesResult = this.setDataContent(recordId)
						.then((res) => {
							this.log("setDataContent. res: ", res);
						})
						.catch((err) => {
							this.log("error setDataContent. err: ", err);
						});
				} catch (err) {
					this.log("failed to setDataContent. err: ", err);
				}
			}
		}
	},
};
</script>

<style lang="scss" scoped>
@import "@/scss/main.scss";

.main-container.sidebar-closed{
	.data-table-wrap{
		transform: translateX(calc(-#{$app-sidebar-width} + #{$app-space-side}*2));
	}
}
.main-container.mid-closed{
	.data-table-wrap{
		transform: translateX(calc(-#{$app-table-width} + #{$app-space-side}*4));
		.close-mid{
			transform: rotate(180deg) translateX(calc(#{$app-space-side} + #{$app-space-icon}));
		}
	}
}
.main-container.sidebar-closed.mid-closed{
	.data-table-wrap{
		transform: translateX(calc(-#{$app-table-width} - #{$app-sidebar-width} + #{$app-space-side}*6));
	}
}

.data-table-wrap{
	width: $app-table-width;
	position: absolute;
	left: $app-sidebar-width;
	background: $app-gradiant2;
	min-height: 100vh;
	padding-top: calc(#{$app-header-height} + #{$app-space-top-high});
	padding-bottom: calc(#{$app-footer-height} + #{$app-space-bottom});
	padding-right: $app-space-side-wide;
	padding-left: $app-space-side-wide;
	transition: $app-transition-time transform;
	z-index: 5;
	.close-sidebar{
		color: $app-text-color2;
	}
	.main-title{
		font-size: $app-title-fs-big;
		margin-bottom: $app-space-bottom;
		color: $app-title-color3;
		font-weight: 500;
		text-align: center;
	}
	.data-table-list{
		display: flex;
		flex-direction: column;
		.data-table-item{
			background-color: $app-bg-color;
			border-radius: $app-border-radius;
			box-shadow: $app-shadow;
			display: flex;
			min-height: $app-table-line-height;
			height: $app-table-line-height;
			position: relative;
			margin-bottom: $app-space-y3;
			.delete-record-icon{
				position: absolute;
				color:$app-delete-color;
				left: $app-space-x;
				bottom: $app-space-bottom-small;
			}
			.data-line-image{
				height: $app-table-line-height;
				max-width: calc(#{$app-table-line-height} * #{$app-image-ratio});
				min-width: calc(#{$app-table-line-height} * #{$app-image-ratio});
				img{
					width:100%;
					height:100%;
					object-fit: cover;
					object-position: center;
					border-radius: $app-border-radius 0 0 $app-border-radius;
				}
			}
			.data-line-text-wrap{
				padding: $app-space-y $app-space-x $app-space-bottom-small;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				width: 100%;
				.data-line-id{
					position:absolute;
					right:$app-space-y;
					top:$app-space-x;
				}
				.data-line-title{
					h3{
						font-size: $app-text-fs-mid;
						padding-right: $app-space-x;
						font-weight: 400;
						color: $app-title-color2;
					}
				}
				.data-line-sub-fields-wrap{
					display:flex;
					justify-content: space-between;
				}
			}
		}
	}
}
</style>
