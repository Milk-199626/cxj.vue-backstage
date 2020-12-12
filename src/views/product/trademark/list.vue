<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="visible = true"
      >添加</el-button
    >
    <el-table :data="BrandList" border style="width: 100% margin:20px 0">
      <el-table-column type="index" label="序列号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img class="trademark-img" :src="scope.row.logoUrl" alt="logo" />
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作">
        <el-button type="warning" icon="el-icon-edit">修改</el-button>
        <el-button type="danger" icon="el-icon-delete">删除</el-button>
      </el-table-column>
    </el-table>
    <!-- @size-change="handleSizeChange":每页显示的条数发生变化时触发  -->
    <!-- @size-change="handleSizeChange":页码发生变化时触发  -->
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
    <!--添加弹框  -->
    <el-dialog title="添加品牌" :visible.sync="visible" width="70%">
      <el-form
        ref="BrandFrom"
        :rules="rules"
        :model="BrandFrom"
        label-width="100px"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="BrandFrom.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="tmName">
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="BrandFrom.logoUrl"
              :src="BrandFrom.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件,且不超过50kb</span>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('BrandFrom')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      BrandList: [], //所有数据
      total: 0, //总数
      page: 1, //页码
      limit: 3, //每页条数
      visible: false, //添加弹框隐藏&显示
      //表单数据
      BrandFrom: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        //校验选项
        tmName: [
          {
            //必选项
            required: true,
            //提醒项
            message: "请输入品牌名称",
            //触发表单检验时机
            trigger: "blur",
          },
        ],
        logoUrl: [{ required: true, message: "请上传品牌LOGO图片" }],
      },
    };
  },
  methods: {
    //提交表单
    submitForm(BrandFrom) {
      //校检表单
      this.$refs[BrandFrom].validate(async (valid) => {
        //表单通过
        if (valid) {
          //请求数据更新
          const result = await this.$API.trademark.addBrand(this.BrandFrom);
          console.log(result);
          //请求响应
          if (result.code === 200) {
            this.$message.success("添加品牌数据成功");
            this.visible = false;
            this.getPageList(this.page, this.limit);
          } else {
            this.$message.error("添加品牌数据失败");
          }
        }
      });
    },
    //上传图片成功的回调
    handleAvatarSuccess(res) {
      // console.log(res);
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.BrandFrom.logoUrl = res.data;
    },
    // 上传图片之前触发的回调
    beforeAvatarUpload(file) {
      console.log(file);
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

    //发送请求
    async getPageList(page, limit) {
      try {
        //请求数据
        const result = await this.$API.trademark.getPageList(page, limit);
        // console.log(result);
        //请求响应
        if (result.code === 200) {
          this.$message.success("获取品牌分页列表成功");
          this.limit = result.data.size;
          this.page = result.data.current;
          this.BrandList = result.data.records;
          this.total = result.data.total;
        } else {
          this.$message.error("获取品牌分页列表失败");
        }
      } catch {
        this.$message.error("获取品牌分页列表失败");
      }
    },
  },

  // handleSizeChange(limit) {
  //   this.getPageList(this.page, limit);
  //   console.log("limit", limit);
  // },
  // handleCurrentChange(page) {
  //   this.getPageList(page, this.limit);
  //   console.log("page", page);
  // },

  mounted() {
    //一上来就发送请求
    this.getPageList(this.page, this.limit);
  },
};
</script>
<style lang="sass" scoped>
.trademark-img
  width: 150px
.trademark-pagination
  text-align: right
>>>.el-pagination__sizes

>>>.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
  &:hover
    border-color: #409EFF

>>>.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center

>>>.avatar
  width: 178px
  height: 178px
  display: block
</style>
