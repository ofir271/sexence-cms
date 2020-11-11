<template>
	<footer class="app-footer">
		<div class="footer-bg-layer">
		</div>
		<div class="footer-content">
			<span class="footer-left">all rights reserved.</span>
			<span class="footer-center">
				<div :class="['logo-wrap img-wrap']">
					<img src="@/assets/white-logo-type.svg" alt="footer-logo"/>
				</div>
			</span>
			<div :class="[getIsLoading ? 'loading' : '',getIsSending ? 'sending' : '', 'logo-wrap img-wrap']">
				<img src="@/assets/sexence-icon.svg" alt="footer-logo2"/>
			</div>
		</div>		

	</footer>
</template>

<script>
import { mapGetters } from "vuex";
export default {
	name: "AppFooter",
	data() {
		return {};
	},
	computed: {
		...mapGetters([ "getIsLoading", "getIsSending"]),
	},
};
</script>

<style lang="scss">
@import "@/scss/main.scss";

.app-footer {
	height: $app-footer-height;
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	color: $app-color2;
	width: 100%;
	z-index: 9999;
	bottom: 0;
	border-top: 1px solid $app-color2;
	.footer-bg-layer{
		display: flex;
		position: absolute;
		background-color: $app-bg-color2;
		opacity: 0.7;
		height: 100%;
		width:100%;
		z-index: 9999;
	}
	.footer-content{
		display: flex;
		position: absolute;
		justify-content: space-between;
		align-items: center;
		padding:0 $app-space-side;
		height: 100%;
		width: 100%;
		z-index: 10000;
		@keyframes spin { 100% { transform: rotate(360deg); } }
		@keyframes spin-left { 100% { transform: rotate(-360deg); } }
		span{
			&.footer-left{
				font-size: $app-text-fs-smaller;
			}
		}
		.logo-wrap{
			height: calc(#{$app-footer-height} - #{$app-space-y} * 2);
			&.loading{
				animation: spin 0.3s linear infinite;
				animation-fill-mode: forwards;
			}			
			&.sending{
				animation: spin-left 0.3s linear infinite;
				animation-fill-mode: forwards;
			}
		}
	}
}
</style>