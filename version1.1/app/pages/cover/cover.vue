<<template>
  <view class="launch-page">
    <!-- 轮播图（替代原手动层叠，兼容性更好） -->
    <view class="gallery-wrap">
      <swiper class="gallery" indicator-dots autoplay circular duration="400">
        <swiper-item v-for="(item, i) in banners" :key="i">
          <view class="gallery-card" :style="{ background: item.bg }">
            <image v-if="item.src" :src="item.src" mode="aspectFill" class="gallery-img" />
            <text v-else class="placeholder">{{ item.title }}</text>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 滑动解锁 -->
    <view class="unlock-wrap">
      <text class="hint">滑动进入应用</text>

      <view class="slider-box" id="sliderBox">
        <!-- 进度背景 -->
        <view class="slider-bg" :style="{ width: progress + '%' }"></view>

        <!-- 箭头/成功文字 -->
        <view class="slider-text" v-if="!isSuccess">
          <text class="arrow">›</text>
          <text class="arrow">›</text>
          <text class="arrow">›</text>
        </view>
        <text v-else class="slider-text success">正在进入…</text>

        <!-- 滑块 -->
        <view
          class="slider-thumb"
          :class="{ success: isSuccess }"
          :style="{ transform: `translateX(${thumbX}px)` }"
          @touchstart="onStart"
          @touchmove.stop.prevent="onMove"
          @touchend="onEnd"
        >
          <text v-if="!isSuccess" class="thumb-icon">›</text>
          <text v-else class="thumb-icon">✓</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      banners: [
        { src: '', bg: '#667eea', title: '智能连接' },
        { src: '', bg: '#764ba2', title: '高效管理' },
        { src: '', bg: '#f093fb', title: '数据安全' }
      ],
      startX: 0,       // 触摸起始 X（用于计算位移）
      thumbX: 0,       // 滑块当前位移（px）
      boxWidth: 0,     // 轨道实际宽度（px）
      thumbWidth: 0,   // 滑块实际宽度（px）
      isSuccess: false // 是否已解锁
    }
  },
  computed: {
    // 进度条百分比
    progress() {
      if (!this.boxWidth || !this.thumbWidth) return 0
      const max = this.boxWidth - this.thumbWidth
      if (max <= 0) return 0
      return Math.min(100, (this.thumbX / max) * 100)
    }
  },
  mounted() {
    // 延迟一点确保 DOM 渲染完成
    setTimeout(() => this.getBoxSize(), 100)
  },
  methods: {
    // 动态获取轨道和滑块的真实像素尺寸（解决不同手机适配问题）
    getBoxSize() {
      const query = uni.createSelectorQuery().in(this)
      query.select('#sliderBox').boundingClientRect(res => {
        if (res) this.boxWidth = res.width
      })
      query.select('.slider-thumb').boundingClientRect(res => {
        if (res) this.thumbWidth = res.width
      }).exec()
    },

    onStart(e) {
      if (this.isSuccess) return
      // 记录手指位置与当前滑块位置的差值，实现跟手拖动
      this.startX = e.touches[0].clientX - this.thumbX
    },

    onMove(e) {
      if (this.isSuccess) return
      const x = e.touches[0].clientX - this.startX
      const max = this.boxWidth - this.thumbWidth

      if (x < 0) this.thumbX = 0
      else if (x > max) this.thumbX = max
      else this.thumbX = x
    },

    onEnd() {
      if (this.isSuccess) return
      const max = this.boxWidth - this.thumbWidth
      const threshold = max * 0.85 // 滑动超过 85% 视为成功

      if (this.thumbX >= threshold) {
        this.thumbX = max
        this.isSuccess = true
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/index/index' })
        }, 500)
      } else {
        // 失败回弹
        this.thumbX = 0
      }
    }
  }
}
</script>

<style>
page {
  background: #0f0f23;
}

.launch-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 40rpx;
  box-sizing: border-box;
}

/* 轮播区域 */
.gallery-wrap {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
}

.gallery {
  width: 100%;
  height: 50vh;
}

.gallery-card {
  width: 100%;
  height: 100%;
  border-radius: 30rpx;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-img {
  width: 100%;
  height: 100%;
}

.placeholder {
  color: rgba(255, 255, 255, 0.8);
  font-size: 40rpx;
  font-weight: bold;
}

/* 解锁区域 */
.unlock-wrap {
  width: 100%;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.hint {
  display: block;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 26rpx;
  margin-bottom: 30rpx;
  letter-spacing: 2rpx;
}

/* 轨道 */
.slider-box {
  width: 80%;
  height: 90rpx;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 45rpx;
  position: relative;
  overflow: hidden;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
}

/* 进度条 */
.slider-bg {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #00d2ff, #3a7bd5);
  border-radius: 45rpx;
  transition: width 0.1s linear;
}

/* 箭头动画 */
.slider-text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 8rpx;
  pointer-events: none;
}

.arrow {
  color: #fff;
  font-size: 32rpx;
  opacity: 0.4;
  animation: flow 1.2s infinite;
}

.arrow:nth-child(2) {
  animation-delay: 0.2s;
}

.arrow:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes flow {
  0%, 100% {
    opacity: 0.3;
    transform: translateX(0);
  }
  50% {
    opacity: 0.9;
    transform: translateX(8rpx);
  }
}

.success {
  color: #fff;
  font-size: 28rpx;
  letter-spacing: 2rpx;
}

/* 滑块 */
.slider-thumb {
  width: 86rpx;
  height: 86rpx;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  left: 2rpx;
  top: 2rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.3);
  /* 回弹动画 */
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 2;
}

/* 拖动时取消过渡，保证跟手；成功后恢复 */
.slider-thumb:active {
  transition: none;
}

.slider-thumb.success {
  background: #52c41a;
  transition: all 0.3s ease;
}

.thumb-icon {
  font-size: 36rpx;
  color: #3a7bd5;
  font-weight: bold;
}

.slider-thumb.success .thumb-icon {
  color: #fff;
}
</style>