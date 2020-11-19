<template>
	<div class="image-selection-wrap">
		<div class="bg-layer">
		</div>		
		<div class="image-selection-inner">
			<div 
				v-for="serverImage in getServerImages"
				:key="'image-selection-' + serverImage.key"
				:class="[imagePath===serverImage.path ? 'active':'','img-wrap']"
			>
				<img 
					:src="serverImage.path" 
					:alt="'image selection'+serverImage.key"
					@click="selectImage(serverImage.path)"
				/>
			</div> 
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
	name: "TheImageSelection",
	props: {
		active: {
			type: Boolean,
			default: false,
		},		
		selectedId: {
			type: String,
			default: "0",
		},		
		selectedName: {
			type: String,
			default: "",
		},		
		imagePath: {
			type: String,
			default: "",
		}
    },
	data() {
		return {}
    },
    computed: {
		...mapGetters([
			"getServerImages",
		]),
	},
	methods: {
		...mapActions([
			"setSelectedImagePath",
			"toggleAppState"
		]),
		selectImage(serverImagePath){
			this.setSelectedImagePath(serverImagePath);
			this.toggleAppState('imageSelectionOpen');
		}
    }
};
</script>

<style lang="scss" scoped>
@import "@/scss/main.scss";
.image-selection-wrap{
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
	.image-selection-inner{
		display:flex;
		flex-wrap:wrap;
		justify-content: space-around;
		align-content: flex-start;
		z-index: 9;
		padding: $app-space-bottom-small $app-space-x-small;
		height: 100%;
    	overflow-y: auto;
		position:relative;
		.img-wrap{
			height: $app-table-line-height;
			max-width: calc(#{$app-table-line-height} * #{$app-image-ratio});
			min-width: calc(#{$app-table-line-height} * #{$app-image-ratio});
			padding: $app-space-bottom-small $app-space-x-small;
			&.active, &:hover{
				img{
					border-color: $app-color4;
				}
			}
			img{
				cursor: pointer;
				width:100%;
				object-position: center;
				border-radius: $app-border-radius;
				border: 1px solid $app-text-color2;
			}
		}
	}
}
</style>