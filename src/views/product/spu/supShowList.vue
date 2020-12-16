<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!category.category3Id"
        @click="$emit('showUpdateList', { category3Id: category.category3Id })"
        >添加SPU</el-button
      >

      <el-table :data="SpuList" border style="width: 100% margin:20px 0">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="spuName" label="SPU名称" width="150">
        </el-table-column>
        <el-table-column prop="description" label="SPU描述"> </el-table-column>
        <!--  scope代表所有数据
              scope.row 代表当前行所有数据 -->
        <el-table-column v-slot="{ row }" label="操作" width="150">
          <template>
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="$emit('showUpdateList', row)"
            ></el-button>
            <el-button type="info" icon="el-icon-info" size="mini"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="getPageList(page, $event)"
        @current-change="getPageList($event, limit)"
        class="trademark-pagination"
        :page-sizes="[3, 6, 9]"
        :page-size.sync="limit"
        :current-change="page"
        layout="prev, pager, next,jumper,sizes,total"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "supShowList",
  data() {
    return {
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      page: 1,
      limit: 3,
      total: 0,
      SpuList: [],
    };
  },
  methods: {
    //清除数据
    clearList(SpuList, category) {
      this.SpuList = [];
      this.page = 1;
      this.limit = 3;
      this.total = 0;
      this.category.category3Id = "";
    },
    //请求分页数据
    async getPageList(page, limit) {
      const { category3Id } = this.category;
      const result = await this.$API.spu.getSpuList({
        page,
        limit,
        category3Id,
      });
      if (result.code === 200) {
        this.$message.success("获取SPU分页列表成功");
        this.SpuList = result.data.records;
        // console.log(this.SpuList);
        this.total = result.data.total;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    //全局事件总线
    this.$bus.$on("change", (category) => {
      this.category = category;
      this.getPageList(this.page, this.limit);
    });

    this.$bus.$on("clearList", this.clearList);
  },
};
</script>

<style lang='less' scoped>
</style>
