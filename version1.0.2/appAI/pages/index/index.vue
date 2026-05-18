<template>
  <view class="container">
    
    <!-- 宠物头像 -->
    <image 
      class="pet-avatar"	
      src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
    ></image>

    <!-- 设备状态 -->
    <text class="status">🟢 在线</text>

    <!-- 电量显示 -->
    <text class="battery">电量：85%</text>

    <!-- 进入通话按钮 -->
    <button class="start-btn" @click="goCall">
      进入陪伴
    </button>

  </view>
</template>

<script setup>

const goCall = () => {
  uni.navigateTo({
    url: '/pages/call/call'
  })
}


</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 120rpx;
  background-color: #f5f7fa;
  height: 100vh;
}

.pet-avatar {
  width: 220rpx;
  height: 220rpx;
  margin-bottom: 40rpx;
}

.status {
  font-size: 32rpx;
  margin-bottom: 20rpx;
}

.battery {
  font-size: 28rpx;
  color: gray;
  margin-bottom: 80rpx;
}

.start-btn {
  width: 70%;
  background-color: #4CAF50;
  color: white;
  font-size: 30rpx;
  border-radius: 40rpx;
}
</style>