<template>
	<div class="app-sidebar">
		<div @click="toggleAppState('sidebarOpen')" class="close-sidebar close-panel">
			<b-icon icon="arrow-bar-left"></b-icon>
		</div>
		<div 
			@click="toggleAppState('sidebarMainGroupOpen')" 
			:class="[getAppStates.sidebarMainGroupOpen ? 'active' : '', 'close-sidebar-group vertical-toggle']"
		>
			<b-icon icon="arrow-bar-up"></b-icon>
		</div>
		<div class="app-sidebar-wrap">
			<nav class="sidebar-nav">
				<ul :class="[!getAppStates.sidebarMainGroupOpen ? 'closed' : '', 'nav']">
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
						:class="[getDataType.dataTypeName === dataType.dataTypeName ? 'active' : '', 'data-type-item', 'data-type-' + dataType.dataTypeName]"
					>
						<b-icon :icon="dataType.iconName"></b-icon><span class="menu-item-text">{{dataType.pluralDisplay}}</span>
					</li>					
				</ul>				
				<ul class="nav">
					<li class="list-title">Content</li>
					<li 
						v-for="(dataType, key) in getDataTypesGroup('content')"
						:key="'menu-item-content-' + key"
						@click="goPage('DataTable',{type: dataType.dataTypeName})" 
						class="data-type-item"
					>
						<b-icon :icon="dataType.iconName"></b-icon><span class="menu-item-text">{{dataType.pluralDisplay}}</span>
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
			"getDataType",
			"getDataTypesGroup",
			"getIsLoading",
			"getIsSending",
			"getAppStates",
			"getLocalDataTables",
			"getIsSelects"
		]),
    },
	async mounted() {
		try {
			const dataTypesResult = await this.setDataTypes()
				.then((res) => {
					// const setSelectsNamesResult = this.setSelectsNames()
					// 	.then((res2) => {
					// 		this.log("setSelectsNames. res: ", res2);
					// 	})
					// 	.catch((err2) => {
					// 		this.log("error setDataTypes. err: ", err2);
					// 	}); 					
						this.log("setDataTypes. res: ", res);
				})
				.catch((err) => {
					this.log("error setDataTypes. err: ", err);
				});  
		} catch (err) {
			this.log("failed to setDataTypes. err: ", err);
		}
		//todo - make generic, make only nessacery calls.
		try {
			let loadSelectTableResult = await this.loadSelectTable('category')
				.then((res) => {
						this.log("loadSelectTable category. res: ", res);
				})
				.catch((err) => {
					this.log("error loadSelectTable category. err: ", err);
				});  
		} catch (err) {
			this.log("failed to loadSelectTable. err: ", err);
		}
		try {
			let loadSelectTableResult = await this.loadSelectTable('article')
				.then((res) => {
						this.log("loadSelectTable article. res: ", res);
				})
				.catch((err) => {
					this.log("error loadSelectTable article. err: ", err);
				});  
		} catch (err) {
			this.log("failed to loadSelectTable article. err: ", err);
		}
		try {
			let loadSelectTableResult = await this.loadSelectTable('shopItem')
				.then((res) => {
						this.log("loadSelectTable article. res: ", res);
				})
				.catch((err) => {
					this.log("error loadSelectTable article. err: ", err);
				});  
		} catch (err) {
			this.log("failed to loadSelectTable article. err: ", err);
		}
		try {
			let loadSelectTableResult = await this.loadSelectTable('dailyTip')
				.then((res) => {
						this.log("loadSelectTable dailyTip. res: ", res);
				})
				.catch((err) => {
					this.log("error loadSelectTable dailyTip. err: ", err);
				});  
		} catch (err) {
			this.log("failed to loadSelectTable dailyTip. err: ", err);
		}		
		try {
			let loadSelectTableResult = await this.loadSelectTable('dailyFeedback')
				.then((res) => {
						this.log("loadSelectTable dailyFeedback. res: ", res);
				})
				.catch((err) => {
					this.log("error loadSelectTable dailyFeedback. err: ", err);
				});  
		} catch (err) {
			this.log("failed to loadSelectTable dailyTip. err: ", err);
		}
		try {
			let loadSelectTableResult = await this.loadSelectTable('dailyQuestion')
				.then((res) => {
						this.log("loadSelectTable dailyQuestion. res: ", res);
				})
				.catch((err) => {
					this.log("error loadSelectTable dailyQuestion. err: ", err);
				});  
		} catch (err) {
			this.log("failed to loadSelectTable dailyQuestion. err: ", err);
		}
		try {
			let loadSelectTableResult = await this.loadSelectTable('dailyForYou')
				.then((res) => {
						this.log("loadSelectTable dailyForYou. res: ", res);
				})
				.catch((err) => {
					this.log("error loadSelectTable dailyForYou. err: ", err);
				});  
		} catch (err) {
			this.log("failed to loadSelectTable dailyForYou. err: ", err);
		}


		// try {
		// 	const setSelectsNamesResult = this.setSelectsNames()
		// 		.then((res) => {
		// 			this.log("setSelectsNames. res: ", res);
		// 		})
		// 		.catch((err) => {
		// 			this.log("error setDataTypes. err: ", err);
		// 		});  
		// } catch (err) {
		// 	this.log("failed to setDataTypes. err: ", err);
		// }		
	},
	methods: {
		...mapActions([
			"setDataTypes",
			"setDataType",
			"loadDataTable",
			"toggleAppState",
			"loadSelectTables",
			"setSelectsNames",
			"loadSelectTable"
		]),
		async setDataTable(dataType) {
			this.log("sidebar. setDataTable", dataType);
			try {
				const dataTypeResult = await this.setDataType(dataType)
					.then((res) => {
						this.log("setDataType. res: ", res);
					})
					.catch((err) => {
						this.log("error setDataType. err: ", err);
					});			
				const dataTableResult = await this.loadDataTable()
					.then((res) => {
						//todo find why res empty
						this.log("loadDataTable from sidebar. res: ", res);

						})
					.catch((err) => {
						this.log("error loadDataTable. err: ", err);
					});	
				// if (1==1 || this.getIsSelects===false){ //todo. limit select tables calls
				// 	this.log('before loadSelectTables', false);
				// 	const dataTableSelects = await this.loadSelectTables()
				// 		.then((res) => {
				// 			this.log("loadSelectTables from sidebar. res: ", res);
				// 		})
				// 		.catch((err) => {
				// 			this.log("error loadSelectTables. err: ", err);
				// 		});
				// }				
			} catch (err) {
				this.log("failed to setDataType or loadDataTable or loadSelectTables. err: ", err);
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
	.close-sidebar-group{
		color: $app-text-color3;
		position: absolute;
		right: $app-space-x;
		bottom: calc(#{$app-footer-height} + #{$app-space-bottom});
		transition: 0.5s transform;
		&.active{
			transform: rotate(180deg);
		}
		cursor: pointer;
	}
	nav{
		.nav{
			display: flex;
			flex-direction: column;
			transition: height $app-transition-time;
			&.closed{
				max-height: 0;
				overflow:hidden
			}
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
				transition: color $app-transition-time-short;
				cursor: pointer;
				&.active{
					color: $app-active-color;
				}
				.menu-item-text{
					margin-left: $app-space-icon;
				}
			}
		}
	}
}
</style>