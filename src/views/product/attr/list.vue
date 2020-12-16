<template>
  <div>
    <!-- 子传父使用自定义事件 -->
    <!-- <CateGory
      @change="getAttrInfoList"
      @clearList="clearList"
       :disabled="!isShow"
    /> -->
    <!-- 全局事件总线 -->
    <CateGory :disabled="!isShow" />

    <el-card v-show="isShow" style="margin-top: 20px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!category.category3Id"
        @click="add"
        >添加属性</el-button
      >
      <el-table :data="BrandList" border style="width: 100% margin:20px 0">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              style="margin-right: 5px"
              v-for="attrValue in row.attrValueList"
              :key="attrValue.id"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <!--  scope代表所有数据
              scope.row 代表当前行所有数据 -->
        <el-table-column prop="operation" label="操作" width="150">
          <template v-slot="{ row }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="update(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              slot="reference"
              @click="delDate(row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card v-show="!isShow" style="margin-top: 20px">
      <el-form v-model="Brand" inline>
        <el-form-item label="属性名" prop="attrName">
          <el-input v-model="Brand.attrName"></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addBrandList()"
        :disabled="!Brand.attrName"
        >添加属性</el-button
      >
      <el-table
        :data="Brand.attrValueList"
        border
        style="width: 100% margin:20px 0"
      >
        <el-table-column type="index" label="序号~~" width="80" align="center">
        </el-table-column>
        <el-table-column label="属性值名称~~">
          <template v-slot="{ row, $index }">
            <!--
              事件修饰符：
                .native
                专门给组件绑定事件使用的
                会给组件中的第一个标签绑定相应的原生DOM事件
             -->
            <el-input
              v-if="row.edit"
              v-model="row.valueName"
              @blur="editComplete(row, $index)"
              @keyup.enter.native="editComplete(row, $index)"
              autofocus
              ref="input"
              size="mini"
            ></el-input>
            <!-- 直接给对象添加新属性不是响应式数据, 通过this.$set添加的属性才是响应式 -->
            <span
              v-else
              @click="edit(row)"
              style="display: block; witch: 100%"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>
        <!--  scope代表所有数据
              scope.row 代表当前行所有数据 -->
        <el-table-column prop="operation" label="操作">
          <template v-slot="{ row, $index }">
            <el-popconfirm
              :title="`您确定要删除${row.valueName}`"
              @onConfirm="delBrandList($index)"
            >
              <el-button type="danger" icon="el-icon-delete" slot="reference">
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="saveBrandList">保存</el-button>
      <el-button @click="isShow = true">取消</el-button>
    </el-card>
  </div>
</template>

<script>
/*
attrName:"信道数量"
attrValueList:Array[3]
0:Object
attrId:193
id:20145
valueName:"5"
1:Object
2:Object
categoryId:63
categoryLevel:3
id:193
*/
import CateGory from "@/components/Category";
export default {
  name: "AttrList",
  data() {
    return {
      //商品属性列表所有数据
      BrandList: [],
      isShow: true,
      Brand: {
        attrName: "",
        attrValueList: [],
      },
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    //切换二三级分类清除为空
    clearList() {
      this.BrandList = [];
      this.category.category3Id = "";
    },
    //点击添加属性lieb
    add() {
      this.isShow = false;
      this.Brand.attrName = "";
      this.Brand.attrValueList = [];
    },
    //删除
    async delDate(id) {
      const result = await this.$API.attrs.DeleteAttr(id);
      this.$message.success(result.message || "删除属性成功");
      this.getAttrInfoList(this.category);
    },
    //失去焦点
    editComplete(row, index) {
      //如果没有输入值的话就删掉
      if (!row.valueName) {
        this.Brand.attrValueList.splice(index, 1);

        // console.log(row.valueName);
        // console.log(this.Brand.attrValueList);
        return;
      }
      row.edit = false;
    },
    //点击保存属性列表
    async saveBrandList() {
      const isAdd = !this.Brand.id;
      const data = this.Brand;
      if (isAdd) {
        data.categoryId = this.category.category3Id;
        data.categoryLevel = 3;
      }
      const ruselt = await this.$API.attrs.SaveAttrInfo(data);
      if (ruselt.code === 200) {
        this.isShow = true;
        this.getAttrInfoList(this.category);
      } else {
        this.$message.error(ruselt, message);
      }
    },
    //点击删除属性
    delBrandList(index) {
      this.Brand.attrValueList.splice(index, 1);
    },
    //点击添加属性
    addBrandList() {
      this.Brand.attrValueList.push({ edit: true });
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //失去焦点触发bug
    edit(row) {
      this.$set(row, "edit", true),
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
    },
    //点击修改更新数据
    update(Brand) {
      this.Brand = JSON.parse(JSON.stringify(Brand));
      this.isShow = false;
    },
    //接收属性列表数据
    async getAttrInfoList(category) {
      this.category = category;
      const ruselt = await this.$API.attrs.getAttrInfoList(category);
      if (ruselt.code === 200) {
        this.BrandList = ruselt.data;
      } else {
        this.$message.error(ruselt, message);
      }
    },
  },
  mounted() {
    this.$bus.$on("change", this.getAttrInfoList);
    this.$bus.$on("clearList", this.clearList);
  },
  beforeDestroy() {
    this.$bus.$emit("change", this.getAttrInfoList);
    this.$bus.$emit("clearList", this.clearList);
  },
  components: {
    CateGory,
  },
};
</script>
