import Vue from 'vue'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import CommentBody from '@/components/Comment/CommentBody.vue'
import CommentNode from '@/components/Comment/CommentNode.vue'
Vue.use(Element, { locale });
Vue.component("CommentBody",CommentBody);
Vue.component("CommentNode",CommentNode);
