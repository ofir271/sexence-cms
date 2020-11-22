<template>
	<div id="app">
		<router-view name="header" />
		<div 
			:class="[!getAppStates.sidebarOpen ? 'sidebar-closed' : '',
			!getAppStates.midOpen ? 'mid-closed' : '',
			'main-container']"
		>
			<router-view name="sidebar" />
			<router-view name="dataTable" />
			<router-view name="dataDetails" />
			<div class="main-content">
				<router-view />
			</div>
		</div>
		<router-view name="footer" />
	</div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
	name: "App",
	data() {
		return {}
	},
	computed: {
		...mapGetters([
			"getAppStates"
		]),
	}
}
</script>

<style lang="scss">
@import "@/scss/main.scss";
@import '@/scss/custom.scss';
@import '../node_modules/bootstrap/scss/bootstrap.scss';

html {
	color: $app-text-color;
	font-size: 16px;
}
html body {
	font-family: $body-font-family;
}

.img-wrap{
	img{
		height: 100%;
		width: auto;
		object-fit: cover;
	}
}
.close-panel{
	position: absolute;
	right: $app-space-x;
	top: calc(#{$app-header-height} + #{$app-space-x});
	display: inline;
	transition: 0.5s transform;
	cursor: pointer;
	.b-icon{
		width: $app-icon-size;
		height: $app-icon-size;
	}
}
button.general-btn{
	height: $app-height-btn;
	width: 100%;
	border-radius: 2rem;
	background: $app-gradiant3;
	box-shadow: $app-shadow-btn-outline;
	color: $app-color-btn-text;
	font-size: 1.142rem;
	line-height: 1;
	padding: 0 $app-space-x;
	text-align: center;
	border: none;
	outline: none;
	&.small-btn{
		width: $app-width-btn-small;
	}
}
button.general-btn:hover{
	background: $app-gradiant4;
}
button.general-btn:disabled{
	opacity: 0.7;
}

input[type="text"] ,input[type="date"], select, textarea {
	width: 100%;
	height: $app-input-height;
	box-shadow: $app-shadow2;
	border-radius: $app-border-radius2;
	padding: 0 $app-space-x;
	text-align: left;
	border: none;
	color: $app-text-color;
	&:disabled {
		background-color: $app-input-disabled-bg-color;
	}
	&:focus {
		outline: 0;
		box-shadow: $app-shadow-input-outline;
	}
}
.b-icon{
	width: $app-icon-size;
	height: $app-icon-size;
}
</style>
