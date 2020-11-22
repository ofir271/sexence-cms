<template>
	<div class="tags-line-wrap">
		<div class="tags-line-input">
			<input
				:ref="'input-field-tag-' + fieldName"
				:id="'input-field-tag-' + fieldName"
				:name="'input-field-tag-' + fieldName"
				:hidden="false"
				type="text"
			/>
			<div @click="addTag()" class="add-tag-icon">
				<b-icon icon="plus-circle-fill"></b-icon>
			</div>
			<label
				:key="'input-field-label-' + fieldName"
				:for="'input-field-tag-' + fieldName"
				class="input-field-label"
			>
				{{ fieldDisplay }}
			</label>
		</div>	
		<div class="tags-line-inner">
			<div 
				v-for="(tagValue,key) in tagsLineArr"
				:key="'tag-' + key"
				:class="['tag-wrap']"
			>
				<div class="tag-value">
					{{tagValue.tagName}}
				</div>
				<div 
					class="tag-delete"
					@click="deleteTagLocal(tagValue)"
				>
					<b-icon icon="x"></b-icon>
				</div>
			</div> 
		</div>
	</div>
</template>

<script>
import LogMixin from "@/mixins/LogMixin";
import { mapGetters, mapActions } from "vuex";
export default {
	name: "TagsLine",
	mixins: [LogMixin],
	props: {
		tagsLineStrProp: {
			type: String,
			default: '["test tag1", "test tag1"]'
		},
		fieldName: {
			type: String,
			default: ''
		},		
		fieldDisplay: {
			type: String,
			default: ''
		}
    },
	data() {
		return {
			tagsLineArr: [],
		}
    },
    computed: {
		...mapGetters([
			//"getCurrentTags",
			//"isReloadContent",
			"getCurrentDataContent",
			"getContentState",
			"getIsClearTags",
			"getIsDataContentChanged"
		]),
		// getTagsLineArr(){
		// 	this.log("getTagsLineArr- inactive atm");
		// 	let tagsLineArr=[]
		// 	try {
		// 		tagsLineArr = JSON.parse(this.tagsLineStr);
		// 		this.log("getTagsLineArr. tagsLineArr:", this.tagsLineArr);
		// 	} catch(err) {
		// 		this.log("getTagsLineArr. err:", err)
		// 	}
		// 	return this.tagsLineArr;
		// },

	},
	watch : {
		// isReloadContent: function (newContent, oldContent) {
		// 	this.log("watch isReloadContent in TagsLIne");
		// 	if (newContent === true) {
		// 		this.tagsLineStr = '["test tag1", "test tag1"]'
		// 	}
		// },
		getCurrentDataContent: function (newContent, oldContent) {
			this.log("watch getCurrentDataContent in TagsLIne", newContent );
			try {
				this.log("newContent.tags", newContent[this.fieldName]);
				this.tagsLineArr = JSON.parse(newContent[this.fieldName]);
			} catch(err) {
				this.tagsLineArr = [];
				this.log("watch getCurrentDataContent err.", err );
			}
			//this.tagsLineArr = newContent.filter'["test tag1", "test tag1"]'
		},
		getContentState: function (newContent, oldContent) {
			this.log("TagLine .watch getContentState");
			if (newContent === "Add" && oldContent !== "") {
				this.tagsLineArr = []
				this.log("clear tagsLineArr.");
			}
		},
		getIsClearTags: function (newContent, oldContent) {
			this.log("TagLine .watch getIsClearTags");
			if (newContent === true ) {
				this.tagsLineArr = []
				this.log("clear tagsLineArr.");
			}
		},
		getIsDataContentChanged : function (newContent, oldContent) {
			this.log("TagLine .watch setIsDataContentChanged.");
			//todo find or add better flag for clearing record
			if (newContent === false) {
				this.tagsLineArr = []
				this.log("clear tagsLineArr.");
			}
		}
		
	},
	methods: {
		...mapActions([
			//"setCurrentTags",
			//"toggleAppState",
			//"deleteTag"
		]),
		deleteTagLocal(tagValue){
			this.log("TagsLine, deleteTagLocal ", tagValue );
			try {
				this.tagsLineArr = this.tagsLineArr.filter(tag => tag.tagName !== tagValue);
				this.$emit('change', this.fieldName, JSON.stringify(this.tagsLineArr))
				this.log("TagsLine, deleteTagLocal. delete ok. ", tagValue );
			} catch (error) {
				this.log("TagsLine, deleteTagLocal. failed to delete. err: ", error );
			}
		},
		addTag(){
			this.log("TagsLine, addTag ", this.fieldName );
			let valueToAdd = "";
			try {
				this.log("TagsLine, addTag. ref: ", this.$refs["input-field-tag-"+this.fieldName].value);
				valueToAdd = this.$refs["input-field-tag-"+this.fieldName].value;
				
				if (valueToAdd !== "") {
					let tagObj = {"tagName": valueToAdd}
					this.tagsLineArr.push(tagObj);
					this.$refs["input-field-tag-"+this.fieldName].value = "";
					this.$emit('change', this.fieldName, JSON.stringify(this.tagsLineArr))
					this.log("TagsLIne, addTag. add ok. ", tagObj );
				}
			} catch (error) {
				this.log("TagsLIne, addTag. failed to add. err: ", error );
			}
		}
    }
};
</script>

<style lang="scss" scoped>
@import "@/scss/main.scss";
.tags-line-wrap{
	position: absolute;
	z-index: 7;
	height: calc(#{$app-input-height}*2 + #{$app-space-y3});
	max-height: calc(#{$app-input-height}*2 + #{$app-space-y3});
	width:100%;
	left:0;
	top: 0;
	.tags-line-input{
		position:relative;
		.add-tag-icon{
			position: absolute;
			left: $app-space-x;
			top: 0;
			color: $app-text-color2;
			height: $app-input-height;
			display: flex;
			align-items: center;
			cursor:pointer;
			transition: $app-transition-time-short;
			:hover{
				color: $app-hover-color;
			}
		}
		input{
			padding-left: calc(#{$app-space-x} + #{$app-space-x-small} + #{$app-icon-size})
		}
		.input-field-label {
			position: absolute;
			font-size: $app-text-fs-smaller;
			top: calc(-#{$app-text-fs-smaller}* 0.6);
			left: $app-space-x;
			line-height: 1;
			background-color: $app-bg-color;
			padding: 0 3px;
			transition: top $app-transition-time-short,
		}
	}						
	.tags-line-inner{
		display:flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-content: flex-start;
		z-index: 9;
		overflow-y: auto;
		padding: 3px $app-space-x;
		max-height: calc(#{$app-input-height} + #{$app-space-y3});
 		position: relative;
		.tag-wrap{
			height: $app-height-btn-small;
			padding: 0 $app-space-x-small;
			margin-right: $app-space-x;
			margin-top: $app-space-y-small;
			border-radius: $app-border-radius;
			box-shadow: $app-shadow-btn-outline;
			display: flex;
			width: auto;
			justify-content: center;
			align-items:center;
			align-content: space-between;
			background: $app-gradiant3;
			color: $app-color-btn-text;
			.tag-value {
				line-height:1;
			}
			.tag-delete{
				cursor: pointer;
			}
		}
	}
}
</style>