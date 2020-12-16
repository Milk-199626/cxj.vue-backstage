<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form :model="spu" label-width="80px" ref="spuForm" :rules="rules">
        <el-form-item prop="spuName" label="SPU名称">
          <el-input
            placeholder="请输入SPU名称"
            v-model="spu.spuName"
          ></el-input>
        </el-form-item>

        <el-form-item label="品牌" prop="trademark">
          <el-select placeholder="请选择品牌" v-model="spu.tmId">
            <el-option
              v-for="tm in TrademarkList"
              :key="tm.id"
              :value="tm.id"
              :label="tm.tmName"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="description" label="SPU描述">
          <el-input
            placeholder="请输入SPU描述"
            v-model="spu.description"
          ></el-input>
        </el-form-item>

        <!-- :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            GET /admin/product/findBySpuId/{spuId}
            -->

        <el-form-item label="SPU图片" prop="SpuImageList">
          <el-upload
            class="avatar-uploader"
            accept="image/*"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            list-type="picture-card"
            :file-list="formatSpuImageList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <span style="color: red">只能上传jpg/png文件,且不超过50kb</span>
        </el-form-item>

        <el-form-item label="销售属性" prop="saleAttr">
          <el-select
            :placeholder="`还有${filterSpuSaleAttrList.length}张未选择`"
            v-model="spu.saleAttr"
          >
            <el-option
              v-for="saleAttr in filterSpuSaleAttrList"
              :key="saleAttr.id"
              :label="saleAttr.name"
              :value="`${saleAttr.id}-${saleAttr.name}`"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            class="el-icon-plus"
            @click="addsaleAttr"
            :disabled="!spu.saleAttr"
            >添加销售属性</el-button
          >

          <el-table
            :data="spuSaleAttrList"
            border
            style="width: 100% margin:20px 0"
          >
            <el-table-column
              type="index"
              label="序号"
              width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="saleAttrName" label="属性名" width="150">
            </el-table-column>
            <el-table-column label="属性值列表">
              <template v-slot="{ row }">
                <el-tag
                  @close="delTag(i, row)"
                  closable
                  v-for="spuSaleAttrValue in row.spuSaleAttrValueList"
                  :key="spuSaleAttrValue.id"
                  >{{ spuSaleAttrValue.saleAttrValueName }}</el-tag
                >
                <el-input
                  v-if="row.edit"
                  v-model="spuSaleAttrValuetext"
                  @blur="editComplete(row)"
                  @keyup.enter.native="editComplete(row)"
                  autofocus
                  ref="input"
                  size="mini"
                ></el-input>
                <el-button v-else size="mini" @click="edit(row)"
                  >+ 添加</el-button
                >
              </template>
            </el-table-column>
            <!--  scope代表所有数据
              scope.row 代表当前行所有数据 -->
            <el-table-column label="操作" width="150">
              <template>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delSpuSaleAttr"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="$emit('isShowList', spu.category3Id)"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="img" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    item: Object,
  },
  data() {
    return {
      spu: this.item,
      TrademarkList: [], //所有的品牌数据
      SpuImageList: [], //图片列表
      dialogImageUrl: "", //图片地址
      dialogVisible: false, //预览开关
      spuSaleAttrList: [], //spu销售属性
      saleAttrList: [], //销售属性列表
      spuSaleAttrValuetext: "",
      rules: {
        spuName: [{ required: true, message: "请输入SPU名称" }],
        TrademarkList: [{ required: true, message: "请选择其中一项品牌" }],
        description: [{ required: true, message: "需要填写SPU描述" }],
        SpuImageList: [
          {
            validator: this.rulesSpuImageList,
            required: true,
          },
        ],
        saleAttr: [{ validator: this.rulesSaleAttrList, required: true }],
      },
    };
  },
  computed: {
    formatSpuImageList() {
      return this.SpuImageList.map((SpuImage) => {
        return {
          uid: SpuImage.uid || SpuImage.id,
          name: SpuImage.imgName,
          url: SpuImage.imgUrl,
        };
      });
    },
    //找到销售属性列表和spu销售属性同样的id就过滤掉
    filterSpuSaleAttrList() {
      return this.saleAttrList.filter((saleAttr) => {
        return !this.spuSaleAttrList.find(
          (spuSaleAttr) => spuSaleAttr.baseSaleAttrId === saleAttr.id
        );
      });
    },
  },
  methods: {
    //校检属性值列表
    rulesSaleAttrList(rule, value, callback) {
      //校检销售属性
      if (this.spuSaleAttrList.length === 0) {
        callback(new Error("请至少添加一个销售属性"));
        return;
      }
      //校检销售属性值列表
      const isNotOK = this.spuSaleAttrList.some(
        (spuSaleAttr) => spuSaleAttr.spuSaleAttrValueList.length === 0
      );
      if (isNotOK) {
        callback(new Error("请至少添加一个销售属性值"));
        return;
      }
      callback();
    },
    //图片校检规则
    rulesSpuImageList(rule, value, callback) {
      if (this.SpuImageList.length > 0) {
        //校检通过
        callback();
        return;
      }
      //校检不通过
      callback(new Error("请上传至少一张图片"));
    },
    //保存
    save() {
      this.$refs.spuForm.validate(async (valid) => {
        if (valid) {
          console.log("校检通过");
          //收集数据
          const spu = {
            ...this.spu,
            spuImageList: this.SpuImageList,
            spuSaleAttrList: this.spuSaleAttrList,

            /*{
      "category3Id": 0,
      "description": "string",
      "id": 0,
      spuName
      "tmId": 0
      "spuImageList":
      "spuSaleAttrList":
} */
          };
          let result;
          if (this.spu.id) {
            result = await this.$API.spu.updateSpu(spu);
          } else {
            result = await this.$API.spu.saveSpu(spu);
          }

          //发送请求

          if (result.code === 200) {
            this.$message.success(`${this.spu.id ? "更新" : "添加"}SPU成功`);
            this.$emit("isShowList", this.spu.category3Id);
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },
    //删除整个销售属性
    delSpuSaleAttr(index) {
      this.spuSaleAttrList.splice(index, 1);
    },
    //删除属性值
    delTag(index, row) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    //添加属性值，需要什么可以去文档看
    editComplete(row) {
      if (this.spuSaleAttrValuetext) {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId: row.baseSaleAttrId,
          saleAttrName: row.saleAttrName,
          saleAttrValueName: this.spuSaleAttrValuetext,
          spuId: row.spuId,
        });
        this.spuSaleAttrValuetext = "";
      }
      row.edit = false;
    },
    //失去焦点触发bug
    edit(row) {
      this.$set(row, "edit", true),
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
    },
    //添加属性值到属性值列表里
    addsaleAttr() {
      const { saleAttr, id } = this.spu;
      const [baseSaleAttrId, saleAttrName] = saleAttr.split("-");
      this.spuSaleAttrList.push({
        baseSaleAttrId: +baseSaleAttrId,
        saleAttrName,
        spuId: id,
        spuSaleAttrValueList: [],
      });
      this.spu.saleAttr = "";
    },
    // //获取所有销售属性列表
    async salesAttrList() {
      const result = await this.$API.spu.salesAttrList();
      if (result.code === 200) {
        this.$message.success("获取Spu销售数据列表成功");
        this.saleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    //获取sup销售属性数据
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      if (result.code === 200) {
        // console.log(result);
        this.$message.success("获取Spu销售数据列表成功");
        this.spuSaleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },

    // 上传图片之前触发的回调
    beforeAvatarUpload(file) {
      const imgTyps = ["image/jpg", "image/png", "image/jpeg"];
      const isValidType = imgTyps.indexOf(file.type) > 1;
      const isLt = file.size / 1024 < 50;

      if (!isValidType) {
        this.$message.error("上传品牌LOGO只能是 JPG 或 PNG 格式!");
      }
      if (!isLt) {
        this.$message.error('上传品牌LOGO大小不能超过 50 kb!"');
      }
      return isValidType && isLt;
    },
    //上传成功的回调
    handleAvatarSuccess(res, file) {
      this.SpuImageList.push({
        /*
          imgName: "flex.png";
            imgUrl: "http://182.92.128.115:8080/group1/M00/00/B4/rBFUDF_Ye-SAQGP5AAOKku37Rzk259.png";
              spuId: 2272;

           */
        //格式化
        uid: file.uid,
        imgName: file.name,
        imgUrl: res.data,
        spuId: this.spu.id,
      });
    },
    //图片大小预览
    handlePictureCardPreview(file) {
      console.log(111, file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
      // console.log("fileList", fileList);
    },
    //删除图片回调
    handleRemove(file, fileList) {
      this.SpuImageList = this.SpuImageList.filter(
        (SpuImage) => SpuImage.imgUrl !== file.url
      );
    },
    //获取所有商品图片
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      if (result.code === 200) {
        this.$message.success("获取所有品牌成功");
        this.SpuImageList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    //获取所有品牌数据
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      if (result.code === 200) {
        this.$message.success("获取所有品牌成功");
        this.TrademarkList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    this.getTrademarkList();
    this.salesAttrList();
    if (this.spu.id) {
      this.getSpuSaleAttrList();
      this.getSpuImageList();
    }
  },
};
</script>

<style lang='less' scoped>
</style>

