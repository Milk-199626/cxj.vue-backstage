<template>
  <div>
    <Category :disabled="!isShowList" />
    <SupShowList v-if="isShowList" @showUpdateList="showUpdateList" />
    <SupUpdateList v-else :item="item" @isShowList="showList" />
  </div>
</template>

<script>
import Category from "@/components/Category";
import SupShowList from "./supShowList";
import SupUpdateList from "./supUpdateList";

export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      item: {},
    };
  },
  methods: {
    // 获取当前已有的数据
    showUpdateList(row) {
      this.isShowList = false;
      this.item = { ...row };
    },
    showList(category3Id) {
      this.isShowList = true;
      this.$nextTick(() => {
        this.$bus.$emit("change", { category3Id });
      });
    },
  },
  components: {
    Category,
    SupShowList,
    SupUpdateList,
  },
};
</script>
