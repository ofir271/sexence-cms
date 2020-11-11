<template>
	<div class="app-header">
		<!-- <button class="sidebar-toggle">Toggle Sidebar</button> -->
		<div class="logo-wrap img-wrap"><img src="@/assets/logo-red-bold.png" alt="header-logo"/></div>
	</div>
</template>

<script>
export default {
	name: "AppHeader",
	data() {
		return {};
	},
};
</script>

<style lang="scss">
@import "@/scss/main.scss";

.app-header{
	height: $app-header-height;
	background-color: $app-bg-color;
	border-bottom: 1px solid $app-color4;
	color: $app-color2;
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	width: 100%;
	z-index: 9999;
	top: 0;
	.sidebar-toggle{
		position: absolute;
		left: $app-space-side;
	}
	.logo-wrap{
		height: calc(#{$app-header-height} - #{$app-space-y2});
	}
}

</style>