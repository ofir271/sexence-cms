<template>
	<div class="app-sidebar">
		<div @click="toggleAppState('sidebarOpen')" class="close-sidebar close-panel">
			<b-icon icon="arrow-bar-left"></b-icon>
		</div>
		<div class="app-sidebar-wrap">
			<nav class="sidebar-nav">
				<ul class="nav">
					<li class="list-title list-title-top">
						<div :class="['logo-wrap img-wrap']">
							<img src="@/assets/sexence-icon.svg" alt="header-logo"/>
						</div>
						Data Manager
					</li>
					<li 
						v-for="(dataType, key) in getDataTypesGroup('main')"
						:key="'menu-item-main-' + key"
						@click="setDataTable(dataType.dataTypeName)" 
						class="data-type-item"
					>
						<b-icon :icon="dataType.iconName"></b-icon><span class="menue-item-text">{{dataType.display}}</span>
					</li>					
					<li class="list-title">Content</li>
					<li 
						v-for="(dataType, key) in getDataTypesGroup('content')"
						:key="'menu-item-content-' + key"
						@click="goPage('DataTable',{type: dataType.dataTypeName})" 
						class="data-type-item"
					>
						<b-icon :icon="dataType.iconName"></b-icon><span class="menue-item-text">{{dataType.display}}</span>
					</li>
				</ul>
			</nav>
		</div>
	</div>
</template>

<script>
import LogMixin from "@/mixins/LogMixin";
import GoPageMixin from "@/mixins/GoPageMixin";
import { mapGetters, mapActions } from "vuex";

export default {
	name: "AppSidebar",
	mixins: [LogMixin, GoPageMixin],
	data() {
		return {
			sidebarOpen: true
		};
    },
    computed: {
		...mapGetters([
			"getDataTypes",
			"getDataTypesGroup",
			"getIsLoading",
			"getIsSending",
			"getAppStates"
		]),
    },
	created() {
		try {
			const dataTypesResult = this.setDataTypes()
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
	methods: {
		...mapActions([
			"setDataTypes",
			"setDataType",
			"loadDataTable",
			"toggleAppState"
		]),
		setDataTable(dataType) {
			this.log("setDataTable", dataType);
			try {
				const dataTypeResult = this.setDataType(dataType)
					.then((res) => {
						this.log("setDataType. res: ", res);
					})
					.catch((err) => {
						this.log("error setDataType. err: ", err);
					});			
				const dataItemsResult = this.loadDataTable()
					.then((res) => {
						this.log("loadDataTable. res: ", res);
					})
					.catch((err) => {
						this.log("error loadDataTable. err: ", err);
					});
			} catch (err) {
				this.log("failed to setDataType or loadDataTable. err: ", err);
			}	
		}
	}
};
</script>

<style lang="scss" scoped>
@import "@/scss/main.scss";
.main-container.sidebar-closed{
	.app-sidebar{
		transform: translateX(calc(-#{$app-sidebar-width} + #{$app-space-side}*2));
		.close-sidebar{
			transform: rotate(180deg) translateX(calc(#{$app-icon-size} - #{$app-space-side}));
		}
	}
}

.app-sidebar{
	width: $app-sidebar-width;
	position: fixed;
	left: 0;
	background: $app-gradiant1;
	height: 100vh;
	padding-top: calc(#{$app-header-height} + #{$app-space-top});
	padding-bottom: calc(#{$app-footer-height} + #{$app-space-bottom});
	padding-right: $app-space-side;
	padding-left: $app-space-side;
	border-right: 1px solid $app-color4;
	transition: $app-transition-time transform;
	z-index: 7;
	.close-sidebar{
		color: $app-text-color3;
	}
	nav{
		.nav{
			display: flex;
			flex-direction: column;
			.list-title{
				color: $app-title-color3;
				font-size: $app-title-fs;
				margin-bottom: $app-space-y;				
				margin-top: $app-space-y2;
				&.list-title-top{
					margin-top: 0;
					margin-bottom: $app-space-y2;
					transform: translateX(-10px);
					.logo-wrap{
						height: 2.5rem;
						display: inline-block;
					}
				}				
			}
			.data-type-item{
				color: $app-text-color3;
				font-size: $app-text-fs-big;
				font-weight: 300;
				display: flex;
				align-items: center;
				margin-bottom: $app-space-y;
				cursor: pointer;
				.menue-item-text{
					margin-left: $app-space-icon;
				}
			}
		}
	}
}
</style>