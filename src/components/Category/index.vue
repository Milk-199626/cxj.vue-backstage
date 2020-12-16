<template>
  <div>
    <el-card>
      <el-form :inline="true" :model="category" class="demo-form-inline">
        <el-form-item label="一级分类">
          <el-select
            v-model="category.category1Id"
            @change="handelSelectchange1"
            placeholder="请选择"
            :disabled="disabled"
          >
            <el-option
              v-for="c1 in category1List"
              :key="c1.id"
              :label="c1.name"
              :value="c1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="category.category2Id"
            @change="handelSelectchange2"
            placeholder="请选择"
            :disabled="disabled"
          >
            <el-option
              v-for="c2 in category2List"
              :key="c2.id"
              :label="c2.name"
              :value="c2.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="三级分类">
          <el-select
            v-model="category.category3Id"
            @change="handelSelectchange3"
            placeholder="请选择"
            :disabled="disabled"
          >
            <el-option
              v-for="c3 in category3List"
              :key="c3.id"
              :label="c3.name"
              :value="c3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "CateGory",
  props: ["disabled"],
  data() {
    return {
      category: {
        category1Id: "", //一级分类id
        category2Id: "",
        category3Id: "",
      },
      category1List: [],
      category2List: [],
      category3List: [],
    };
  },
  methods: {
    async handelSelectchange1(category1Id) {
      this.category2List = [];
      this.category3List = [];
      this.category.category2Id = "";
      this.category.category3Id = "";
      const ruselt = await this.$API.attrs.getCategory2(category1Id);
      if (ruselt.code === 200) {
        this.category2List = ruselt.data;
      } else {
        this.$message.error(ruselt, message);
      }
      this.$bus.$emit("clearList");
    },
    async handelSelectchange2(category2Id) {
      this.category3List = [];
      this.category.category3Id = "";
      const ruselt = await this.$API.attrs.getCategory3(category2Id);
      if (ruselt.code === 200) {
        this.category3List = ruselt.data;
      } else {
        this.$message.error(ruselt, message);
      }
      this.$bus.$emit("clearList");
    },
    async handelSelectchange3(category3Id) {
      const category = {
        ...this.category,
        category3Id,
      };
      this.$bus.$emit("change", category);
    },
  },
  async mounted() {
    const ruselt = await this.$API.attrs.getCategory1();
    if (ruselt.code === 200) {
      this.category1List = ruselt.data;
    } else {
      this.$message.error(ruselt, message);
    }
  },
};
</script>

<style lang='less' scoped>
</style>
