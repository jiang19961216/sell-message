<template>
  <div class="goods-add">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title">商品添加</span>
      </div>
      <div>
        <el-form ref="goodsAddForm" :model="goodsAddForm" label-width="80px">
          <!-- 商品添加表单 -->
          <!-- 1 商品名称 -->
          <el-form-item label="商品名称">
            <el-input v-model="goodsAddForm.goodsname"></el-input>
          </el-form-item>

          <!-- 2 商品分类 -->
          <el-form-item label="商品分类">
            <el-select v-model="goodsAddForm.goodscategory" placeholder="请选择商品分类">
              <el-option label="热销" value="热销"></el-option>
              <el-option label="饮品" value="饮品"></el-option>
              <el-option label="小吃" value="小吃"></el-option>
              <el-option label="热菜" value="热菜"></el-option>
              <el-option label="凉菜" value="凉菜"></el-option>
              <el-option label="火锅" value="火锅"></el-option>
            </el-select>
          </el-form-item>

          <!-- 3 商品特色 -->
          <el-form-item label="商品特色">
            <el-checkbox-group v-model="goodsAddForm.goodsfeature">
              <el-checkbox label="新品上市" name="goodsfeature"></el-checkbox>
              <el-checkbox label="第二单半价" name="goodsfeature"></el-checkbox>
              <el-checkbox label="主打产品" name="goodsfeature"></el-checkbox>
              <el-checkbox label="火爆产品" name="goodsfeature"></el-checkbox>
              <el-checkbox label="祖传手艺" name="goodsfeature"></el-checkbox>
              <el-checkbox label="源自四川" name="goodsfeature"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <!-- 4 商品图片 -->
          <el-form-item label="商品图片">
            <el-upload
              class="avatar-uploader"
              action="http://172.16.3.254:5000/goods/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="goodsAddForm.imgUrl" :src="baseApi + goodsAddForm.imgUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <!-- 5 是否促销 -->
          <el-form-item label="是否促销">
            <el-radio-group v-model="goodsAddForm.isPromotion">
              <el-radio label="促销"></el-radio>
              <el-radio label="不促销"></el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 6 食品规格 -->
          <el-form-item label="食品规格">
            <el-radio-group v-model="goodsAddForm.goodsstandard">
              <el-radio label="单规格"></el-radio>
              <el-radio label="多规格"></el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- ============================ 单规格 ================================== -->
          <!-- 7 包装费 -->
          <el-form-item label="包装费" v-show="standardVisible">
            <el-input-number v-model="goodsAddForm.packingexpense" :min="0" :max="100" label="包装费"></el-input-number>
          </el-form-item>
          <!-- 8 价格 -->
          <el-form-item label="价格" v-show="standardVisible">
            <el-input-number v-model="goodsAddForm.goodsprice" :min="20" :max="100" label="包装费"></el-input-number>
          </el-form-item>

          <!-- ============================ 多规格 ================================== -->
          <!-- 多规格 -->
          <div v-show="!standardVisible" style="margin: 30px 0; text-align: center;">
            <el-button size="small" type="primary" @click="dialogFormVisible = true">添加规格</el-button>

            <!-- 添加规格表格 -->
            <el-table :data="goodsAddForm.tableData" style="width: 100%">
              <el-table-column prop="goodsstandard" label="规格"></el-table-column>
              <el-table-column prop="packingexpense" label="包装费"></el-table-column>
              <el-table-column prop="goodsprice" label="价格"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 9 商品描述 -->
          <el-form-item label="商品描述">
            <el-input type="textarea" v-model="goodsAddForm.goodsdesc"></el-input>
          </el-form-item>

          <!-- 立即添加按钮 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm">立即添加</el-button>
          </el-form-item>
        </el-form>

        <!-- 模态框 -->
        <el-dialog width="420px" title="添加规格" :visible.sync="dialogFormVisible">
          <el-form style="width: 280px;" :model="form">
            <!-- 规格 -->
            <el-form-item label="规格" :label-width="formLabelWidth">
              <el-input v-model="form.goodsstandard" auto-complete="off"></el-input>
            </el-form-item>

            <!--包装费 -->
            <el-form-item label="包装费" :label-width="formLabelWidth">
              <el-input-number v-model="form.packingexpense" :min="0" :max="100" label="包装费"></el-input-number>
            </el-form-item>
            <!-- 价格 -->
            <el-form-item label="价格" :label-width="formLabelWidth">
              <el-input-number v-model="form.goodsprice" :min="20" :max="100" label="包装费"></el-input-number>
            </el-form-item>
          </el-form>
          <!-- 尾部 -->
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addStandard">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入接口函数
import { addGoods } from "@/api/goods";

export default {
  data() {
    return {
      // 商品图片服务器地址
      baseApi: "http://172.16.3.254:5000/upload/imgs/",
      // 商品添加表单对象
      goodsAddForm: {
        goodsname: "", // 名称
        goodscategory: "", // 分类
        goodsfeature: [], // 特色
        imgUrl: "", // 图片
        isPromotion: "不促销", // 促销
        goodsstandard: "单规格", // 规格
        packingexpense: 0, // 包装费（单规格）
        goodsprice: 20, // 价格（单规格）
        goodsdesc: "", // 描述
        // 多规格
        tableData: [
          { goodsstandard: "默认", packingexpense: 0, goodsprice: 20 }
        ]
      },
      dialogFormVisible: false, // 模态框显示和隐藏
      // 模态框
      form: {
        goodsstandard: "",
        packingexpense: "",
        goodsprice: ""
      },
      formLabelWidth: "100px" // 标签宽度
    };
  },
  computed: {
    // 单规格和多规格切换显示
    standardVisible() {
      return this.goodsAddForm.goodsstandard === "单规格" ? true : false;
    }
  },
  methods: {
    // 添加规格
    addStandard() {
      this.dialogFormVisible = false; // 隐藏模态框
      this.goodsAddForm.tableData.unshift(this.form); // 添加规格
      // 清空表格
      this.form = {
        goodsstandard: "",
        packingexpense: "",
        goodsprice: ""
      };
    },
    // 删除
    handleDelete(index) {
      this.goodsAddForm.tableData.splice(index, 1);
    },
    // 提交商品添加表单
    async submitForm() {
      // 把商品表单所有数据取出来
      let {
        goodsname,
        goodscategory,
        goodsfeature,
        imgUrl,
        isPromotion,
        goodsstandard,
        packingexpense,
        goodsprice,
        tableData,
        goodsdesc
      } = this.goodsAddForm;

      // 拼接发送给后端的参数对象
      let params = {
        goodsname,
        goodscategory,
        goodsfeature: JSON.stringify(goodsfeature),
        imgUrl,
        isPromotion,
        standard:
          goodsstandard === "单规格"
            ? JSON.stringify([{ goodsstandard, packingexpense, goodsprice }])
            : JSON.stringify(tableData),
        goodsdesc
      };

      // 发送添加商品请求
      let { code } = await addGoods(params);
      if (code === 0) {
        this.$router.push("/index/goodslist");
      }
    },
    // 图片上传成功之后，就会触发这个回调函数，上传成功后端响应的结果，可以在这个回调函数中接收
    handleAvatarSuccess(res) {
      // 解构数据
      let { code, msg, imgUrl } = res;
      if (code === 0) {
        this.goodsAddForm.imgUrl = imgUrl;
        this.$message({ type: "success", message: msg });
      }
    },
    // 图片上传之前，做一些类型和大小的限制
    beforeAvatarUpload(file) {
      const isJPGOrPng =
        file.type === "image/jpeg" || file.type === "image/png";

      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPGOrPng) {
        this.$message.error("上传头像图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPGOrPng && isLt2M;
    }
  }
};
</script>

<style lang="less">
.goods-add {
  .el-card {
    .el-card__header {
      .title {
        font-weight: 700;
      }
    }
    .el-card__body {
      .el-form {
        width: 500px;
        .avatar-uploader .el-upload {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
          border-color: #409eff;
        }
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 178px;
          height: 178px;
          line-height: 178px;
          text-align: center;
        }
        .avatar {
          width: 178px;
          height: 178px;
          display: block;
        }
      }
    }
  }
}
</style>