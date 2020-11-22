<template>
	<div class="data-table-wrap">
		<div @click="toggleAppState('midOpen')" class="close-mid close-panel">
			<b-icon icon="arrow-bar-left"></b-icon>
		</div>
		<div class="data-table-main">
			<h1 class="main-title">{{ dataTableTitle }}</h1>
			<div class="table-top-btns">
				<button 
					class="general-btn new-btn" 
					v-show="getContentState==='Update'" 
					key="content-new-btn"
					@click="setNewState()"
				>
					Add
				</button>
			</div>
			<div class="data-table-list">
				<div
					v-for="tableDataRecord in getDataTable"
					:key="'data-line-' + tableDataRecord[getDataType.dataTypeIdField]"
					:id="'data-line-' + tableDataRecord[getDataType.dataTypeIdField]"
					:class="[tableDataRecord[getDataType.dataTypeIdField] === getCurrentDataContent[getDataType.dataTypeIdField] ? 'active' : '', 'data-table-item']"
					@click="
						setEditRecordDetails(tableDataRecord[getDataType.dataTypeIdField])
					"
				>
					<div
						@click="
							deleteRecord(
								tableDataRecord[getDataType.dataTypeIdField],
								tableDataRecord[getDataType.dataTypeTitleField]
							)
						"
						class="delete-record-icon"
					>
						<b-icon icon="x-circle-fill"></b-icon>
					</div>
					<div
						v-if="getDataType.dataTypeImageField !== ''"
						:key="
							'data-line-' +
							tableDataRecord[getDataType.dataTypeIdField] +
							'-field-image'
						"
						class="data-line-image data-table-field"
					>
						<img :src="tableDataRecord[getDataType.dataTypeImageField]" />
					</div>
					<div class="data-line-text-wrap">
						<div
							v-if="getDataType.dataTypeTitleField !== ''"
							:key="
								'data-line-' +
								tableDataRecord[getDataType.dataTypeIdField] +
								'-field-title'
							"
							class="data-line-title data-table-field"
						>
							<h3>
								{{ tableDataRecord[getDataType.dataTypeTitleField] }}
							</h3>
						</div>
						<span
							v-if="getDataType.dataTypeIdField !== ''"
							:key="
								'data-line-' +
								tableDataRecord[getDataType.dataTypeIdField] +
								'-field-id'
							"
							class="data-line-id data-table-field"
						>
							{{ tableDataRecord[getDataType.dataTypeIdField] }}
						</span>
						<div class="data-line-sub-fields-wrap">
							<template v-for="tableDataField in getDataTableFields">
								<span
									v-if="
										tableDataField.fieldType === 'string' ||
										tableDataField.fieldType === 'disabled' ||
										tableDataField.fieldType === 'ts'
									"
									:key="
										'data-line-' +
										tableDataRecord[getDataType.dataTypeIdField] +
										'-field-' +
										tableDataField.name +
										'-span'
									"
									class="data-line-text"
								>
									<template v-if="tableDataField.fieldType === 'ts'">
										{{ tsToDateTime(tableDataRecord[tableDataField.name]) }}
									</template>
									<template v-if="tableDataField.fieldType === 'string'">
										{{ tableDataRecord[tableDataField.name] }}
									</template>
								</span>
							</template>
						</div>
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
		...mapGetters([
			"getDataType",			
			"getIsSelects",
			"getDataTable",
			"getDataTypesFields",
			"getDataTableFields",
			"getIsDataContentChanged",
			"getContentState",
			"getServerImages",
			"getCurrentDataContent"
		]),
		dataTableTitle() {
			if (this.getDataType.pluralDisplay) return this.getDataType.pluralDisplay;
			else return "Welcome to Sexence Admin";
		},
	},
	created() {
		try {
			const dataTypesResult = this.loadServerImages()
				.then((res) => {
					this.log("loadServerImages. res: ", res);
				})
				.catch((err) => {
					this.log("error loadServerImages. err: ", err);
				});
		} catch (err) {
			this.log("failed to loadServerImages. err: ", err);
		}		
	},
	methods: {
		...mapActions([
			"setDataType",
			"loadDataTable",
			"toggleAppState",
			"deleteDataTypeRecord",
			"setDataContent",
			"setIsDataContentChanged",
			"setIsReloadContent",
			"setContentState",
			"loadServerImages"
		]),
		deleteRecord(recordId, recordTitle = "") {
			this.log("deleteRecord", recordId, recordTitle);
			const confirmDelete = confirm("Please confirm dalete "+recordTitle);
			if (confirmDelete) {
				try {
					const dataTypesResult = this.deleteDataTypeRecord(recordId)
						.then((res) => {
							this.setIsDataContentChanged(false);
							if (recordId === this.getCurrentDataContent[this.getDataType.dataTypeIdField])
								this.setContentState("Add");
							this.log("deleteDataTypeRecord. res: ", res);
						})
						.catch((err) => {
							this.log("error deleteDataTypeRecord. err: ", err);
						});
				} catch (err) {
					this.log("failed to deleteDataTypeRecord. err: ", err);
				}
			}
		},
		tsToDateTime(UNIX_timestamp) {
			var tempDate = new Date(UNIX_timestamp * 1000);
			var months = [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec",
			];
			var year = tempDate.getFullYear();
			var month = months[tempDate.getMonth()];
			var date = tempDate.getDate();
			var hour = tempDate.getHours();
			var min = tempDate.getMinutes();
			var sec = tempDate.getSeconds();
			var time = date + " " + month + " " + year + " " + hour + ":" + min;
			return time;
		},
		setNewState(){
			this.log("setNewState");
			let confirmContentLoad = false;
			if (this.getIsDataContentChanged) {
				confirmContentLoad = confirm("data may be lost. continue anyway?");
			}
			if (!this.getIsDataContentChanged || confirmContentLoad) {
				this.setContentState('Add');
			}
		},
		setEditRecordDetails(recordId) {
			this.log("setEditRecordDetails", recordId);
			let confirmContentLoad = false;
			if (this.getIsDataContentChanged) {
				confirmContentLoad = confirm("data may be lost. continue anyway?");
			}
			if (!this.getIsDataContentChanged || confirmContentLoad) {
				/* todo: try and make reactive */

				try {
					const dataTypesResult = this.setDataContent(recordId)
						.then((res) => {
							this.log("setDataContent. res: ", res);
							this.setIsDataContentChanged(false);
							this.setIsReloadContent(true);
						})
						.catch((err) => {
							this.log("error setDataContent. err: ", err);
						});
				} catch (err) {
					this.log("failed to setDataContent. err: ", err);
				}
			}
		},
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
	.data-table-main{
		position: relative;
		.table-top-btns{
			position: absolute;
			left: 0;
			top: calc(#{$app-space-top} - #{$app-space-top-high});
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
				cursor: pointer;
				&.active{
					.data-line-text-wrap .data-line-title h3{
						color: $app-active-color;
					}
				}
				.delete-record-icon{
					position: absolute;
					color:$app-delete-color;
					left: -$app-space-x-small;
					bottom: -$app-space-bottom-small;
					cursor: pointer;
					.b-icon{
						border-radius: calc(#{$app-icon-size}/2);
						background-color: $app-bg-color;
					}
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
							transition: color $app-transition-time-short;
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
}
</style>
