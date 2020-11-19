<template>
	<div class="repeater-manager-wrap">
		<div 
			@click="toggleAppState('repeaterManagerOpen')" 
			:class="['close-repeater-manager']"
		>
			<b-icon icon="x"></b-icon>
		</div>
		<div class="bg-layer">
		</div>		
		<div class="repeater-manager-inner">
			<div class="repeater-table">			
				<div class="repeater-table-titles">
					<div 
						v-for="(repeaterField,key) in getRepeaterFields"
						:key="'repeater-table-title-' + key"
						:class="['repeater-table-title']"
					>
						{{repeaterField.displayName}}
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
							:key="'repeater-table-field-' + fieldKey + '-'+ recordKey"
							:class="['repeater-table-field']"
						>
							<input
								:ref="'input-field-' + repeaterField.name + '-'+ recordKey"
								:key="'input-field-' + repeaterField.name + '-'+ recordKey"
								:name="'input-field-' + repeaterField.name + '-'+ recordKey"
								:value="repeaterRecord[repeaterField.name]"
								type="text"
								:placeholder="repeaterRecord[repeaterField.name]"
							/>
						</div>
						<div 
							class="delete-btn-wrap"
							@click="deleteRepeaterRecord(repeaterRecord[getRepeaterUniqueFieldName])"
						>
							<b-icon 
								icon="x-square-fill"
							>
							</b-icon>
						</div> 
					</div> 
				</div>
				<div class="add-btn-wrap">
					<b-icon 
						icon="plus-square-fill"
						@click="addRepeaterRecord()"
					>
						Add
					</b-icon>
				</div> 
			</div>
			<div class="save-btn-wrap">
				<button
					class="general-btn small-btn"
					key="repeater-save-btn"
					@click="saveRepeaterContent()"
				>
					Save
				</button>
			</div> 
		</div>
	</div>
</template>

<script>
import LogMixin from "@/mixins/LogMixin";
import { mapGetters, mapActions } from "vuex";
export default {
	name: "TheRepeaterManager",
	mixins: [LogMixin],
	props: {
	
    },
	data() {
		return {}
    },
    computed: {
		...mapGetters([
			"getRepeaterFields",
			"getRepeaterRecords",
			"getRepeaterUniqueFieldName"
		]),
	},
	methods: {
		...mapActions([
			"toggleAppState",
			"deleteRepeaterRecord",
			"addRepeaterRecord",
			"setRepeaterNewValues"
		]),
		saveRepeaterContent(){
			this.log("saveRepeaterContent");
			let keyCouner=0;
			let repeaterRecordsArr=[]
			let recordObj={}
			while (this.$refs["input-field-" + this.getRepeaterUniqueFieldName + "-" + keyCouner] && keyCouner<100) {
			
				this.getRepeaterFields.forEach(field => {
					recordObj[field.name] = this.$refs["input-field-" + field.name + "-" + keyCouner][0].value;
					//this.log("input-field-" + field.name + "-" + keyCouner);
				});
				keyCouner=keyCouner+1;
				this.log(recordObj);
				repeaterRecordsArr.push(recordObj);
				recordObj={}
			}
			
			//this.log(keyCouner);
			this.log(repeaterRecordsArr);
			//'input-field-' + repeaterField.name + '-'+ recordKey
			//(repeaterField, fieldKey) in getRepeaterFields
			
			//this.$refs[	"input-field-" + this.selectedImageFieldName
			//][0].value

			this.setRepeaterNewValues(repeaterRecordsArr);
			this.toggleAppState('repeaterManagerOpen');
		}
    }
};
</script>

<style lang="scss" scoped>
@import "@/scss/main.scss";
.repeater-manager-wrap{
	position: absolute;
	z-index: 9;
	height: calc(100vh - #{$app-footer-height} - #{$app-header-height} - #{$app-space-top-high});
	width:100%;
	top: 0;
	.bg-layer{
		display: flex;
		position: absolute;
		border-radius: $app-border-radius2 $app-border-radius2 0 0;
		background-color: $app-bg-color2;
		opacity: 0.7;
		height: 100%;
		width:100%;
		z-index: 8;
	}
	.close-repeater-manager{
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
	.repeater-manager-inner{
		display:flex;
		z-index: 9;
		padding: $app-space-bottom $app-space-x;
		height: 100%;
    	overflow-y: auto;
		position:relative;
		color:$app-text-color3;
		flex-direction: column;
		.save-btn-wrap{
			display:flex;
			padding-top: $app-space-y;
			justify-content: center;
		}
		.repeater-table{
			display:flex;
			justify-content: flex-start;
			align-content: center;
			flex-direction: column;
			flex: 1 1 auto;
			.add-btn-wrap{
				display:flex;
				padding-top: $app-space-y;
				justify-content: center;
				cursor: pointer;
			}
			.repeater-table-titles{
				display:flex;
				justify-content: space-around;
				align-content: flex-start;
				padding-bottom: $app-space-x-small;
				.repeater-table-title{
					font-size: $app-text-fs-mid;
				}
			}
			.repeater-table-lines{
				display:flex;
				justify-content: space-around;
				align-content: flex-start;
				flex-direction:column;
				.repeater-table-line{
					margin-bottom: $app-space-x-small;
					display:flex;
					justify-content: space-around;
					align-content: flex-start;
					.delete-btn-wrap{
						display:flex;
						align-items: center;
						color:$app-delete-color;
						.b-icon{
							background-color: $app-bg-color;
						}
					}
					.repeater-table-field{
						padding: 0 $app-space-x-small;
					}
				}
			}
		}
	}
}
</style>