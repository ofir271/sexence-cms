import { mapGetters } from "vuex";

const LogMixin = {
    data() {
        return {}
    },
    computed: {
        ...mapGetters([
          'getIsLog'
        ])
    },
    methods: {
        log(msg, ...args) {
            if (this.getIsLog) {
                if (args.length > 0)
                    console.log('LOG - ' , msg, args);
                else
                    console.log('LOG - ' , msg);
               
            }
        }
    }
} 
export default LogMixin