<template>
  <div class="personal">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-weight: 700;">个人中心</span>
      </div>
      <div class="personal-info">
        <p>
          管理员ID:
          <span>{{ accountInfo.id }}</span>
        </p>
        <el-divider></el-divider>
        <p>
          账号:
          <span>{{ accountInfo.account }}</span>
        </p>
        <el-divider></el-divider>
        <p>
          用户组:
          <span>{{ accountInfo.userGroup }}</span>
        </p>
        <el-divider></el-divider>
        <p>
          创建时间:
          <span>{{ accountInfo.ctime }}</span>
        </p>
        <el-divider></el-divider>
        <div style="height: 300px;">
          <p style="margin-bottom: 10px;">管理员头像:</p>
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:5000/users/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imgUrl" :src="baseApi + imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p>
            <el-button
              @click="handleEdit"
              style="margin-top: 20px; text-indent: 0;"
              type="primary"
            >确认修改</el-button>
          </p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAccountInfo, editAvatar } from "@/api/account";

export default {
  data() {
    return {
      baseApi: "http://127.0.0.1:5000/upload/account/",
      accountInfo: {},
      imgUrl: ""
    };
  },
  async created() {
    let { accountInfo } = await getAccountInfo();
    this.accountInfo = accountInfo;
  },
  methods: {
    // 上传成功回调
    handleAvatarSuccess(res, file) {
      let { code, imgUrl } = res;
      if (code === 0) {
        this.imgUrl = imgUrl;
      }
    },
    // 上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 修改头像
    async handleEdit() {
      let { code } = await editAvatar({ imgUrl: this.imgUrl });
      if (code === 0) {
        // 通过bus 把数据传递给头部组件
        this.$bus.$emit("updataAvatar");
      }
    }
  }
};
</script>

<style lang="less">
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
.personal {
  .personal-info {
    p {
      display: flex;
      align-items: center;
      .el-input {
        width: 200px;
        margin-left: 20px;
      }
      span {
        margin-left: 20px;
      }
    }
  }
}
</style>