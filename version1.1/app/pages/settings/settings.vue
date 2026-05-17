<<template>
  <view class="container">
    <!-- 顶部标题区 -->
    <view class="header">
      <text class="title">设置</text>
      <text class="subtitle">设备与账号管理</text>
    </view>

    <!-- 按钮列表 -->
    <view class="menu-list">
      <view 
        class="menu-item" 
        v-for="(item, index) in menuItems" 
        :key="index"
        @click="item.handler"
        hover-class="menu-item-hover"
        :hover-stay-time="100"
      >
        <view class="menu-icon" :style="{ background: item.iconBg }">
          <text class="iconfont">{{ item.icon }}</text>
        </view>
        <text class="menu-text">{{ item.name }}</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <!-- 版本信息 -->
    <view class="footer">
      <text class="version">Version 1.0.0</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { 
          name: '蓝牙连接', 
          icon: '🔷', 
          iconBg: '#007AFF',
          handler: this.goBluetooth 
        },
        { 
          name: 'WIFI连接', 
          icon: '📶', 
          iconBg: '#34C759',
          handler: this.goWifi 
        },
        { 
          name: '账号管理', 
          icon: '👤', 
          iconBg: '#FF9500',
          handler: this.goAccount 
        },
        { 
          name: '关于我们', 
          icon: 'ℹ️', 
          iconBg: '#8E8E93',
          handler: this.goAbout 
        }
      ]
    }
  },
  methods: {
    goBluetooth() {
      uni.navigateTo({
        url: '/Component/bluetooth'
      })
    },
    goWifi() {
      uni.navigateTo({
        url: '/Component/wifi'
      })
      // 或者 uni.showToast({ title: '功能开发中', icon: 'none' })
    },
    goAccount() {
      uni.navigateTo({
        url: '/Component/account'
      })
    },
    goAbout() {
      uni.navigateTo({
        url: '/Component/about'
      })
    }
  }
}
</script>

<style>
/* 页面容器 */
.container {
  min-height: 100vh;
  background: #f5f6fa;
  padding: 40rpx 30rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 头部 */
.header {
  margin-bottom: 40rpx;
  padding-left: 10rpx;
}

.title {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 10rpx;
}

.subtitle {
  display: block;
  font-size: 26rpx;
  color: #999;
}

/* 菜单列表 */
.menu-list {
  background: #fff;
  border-radius: 24rpx;
  padding: 10rpx 0;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  position: relative;
}

/* 分隔线（除最后一个） */
.menu-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 100rpx;
  right: 0;
  bottom: 0;
  height: 1rpx;
  background: #f0f0f0;
}

/* 点击效果 */
.menu-item-hover {
  background: #f8f9fa;
}

.menu-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.iconfont {
  font-size: 36rpx;
  color: #fff;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.menu-arrow {
  font-size: 36rpx;
  color: #c7c7cc;
  margin-left: 10rpx;
}

/* 底部 */
.footer {
  margin-top: auto;
  text-align: center;
  padding: 40rpx 0;
}

.version {
  font-size: 24rpx;
  color: #c7c7cc;
}
</style>