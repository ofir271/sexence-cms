import LogMixin from '@/mixins/LogMixin';
export default {
	mixins: [
		LogMixin
	],
    data() {
        return {}
    },
    methods: {
        goPage(dataPageName, params=""){
            this.log('Page : ' + dataPageName + 'params : ' , params);
            if (params==""){
                this.$router.push({
                    name: dataPageName
                });
            }else{
                this.$router.push({
                    name: dataPageName, params: params
                });
            }
        }
    }
}