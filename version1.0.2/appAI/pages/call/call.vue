<template>
  <view class="chat-container">
    <!-- 消息列表 -->
    <scroll-view 
      class="message-list" 
      scroll-y 
      :scroll-into-view="scrollIntoView"
      :style="{ height: scrollHeight + 'px' }"
      @tap="hideAllMenus"
    >
      <view 
        v-for="(msg, index) in messages" 
        :key="index"
        :id="'msg-' + index"
        class="message-item"
        :class="msg.isMe ? 'message-right' : 'message-left'"
      >
        <!-- 头像 -->
        <image 
          class="avatar" 
          :src="msg.isMe ? myAvatar : otherAvatar"
          @tap="previewAvatar(msg.isMe ? myAvatar : otherAvatar)"
        ></image>
        
        <!-- 消息内容 -->
        <view class="message-content" @longpress="showMsgMenu(index)">
          <!-- 文字消息 -->
          <text v-if="msg.type === 'text'" class="message-text">{{ msg.content }}</text>
          
          <!-- 语音消息 -->
          <view 
            v-else-if="msg.type === 'voice'" 
            class="voice-message"
            :class="{ playing: playingIndex === index }"
            @tap="playVoice(msg, index)"
          >
            <text class="voice-icon">🎵</text>
            <text class="voice-duration">{{ msg.duration }}''</text>
            <view class="voice-wave" v-if="playingIndex === index">
              <text v-for="i in 3" :key="i" class="wave-bar"></text>
            </view>
          </view>
          
          <!-- 图片消息 -->
          <image 
            v-else-if="msg.type === 'image'" 
            class="message-image"
            :src="msg.content"
            mode="widthFix"
            @tap="previewImage(msg.content)"
          ></image>
        </view>
        
        <!-- 发送状态 -->
        <view v-if="msg.isMe && msg.status" class="msg-status">
          <text v-if="msg.status === 'sending'" class="sending">●</text>
          <text v-else-if="msg.status === 'failed'" class="failed">!</text>
        </view>
      </view>
      
      <!-- 底部占位 -->
      <view style="height: 40rpx;"></view>
    </scroll-view>
    
    <!-- 底部输入区域 -->
    <view class="input-area" :style="{ bottom: keyboardHeight + 'px' }">
      <!-- 语音/键盘切换 -->
      <text class="tool-btn" @tap="toggleInputMode">
        {{ isVoiceMode ? '⌨️' : '🎤' }}
      </text>
      
      <!-- 文字输入 -->
      <input 
        v-if="!isVoiceMode"
        class="message-input"
        v-model="inputMessage"
        placeholder="请输入消息..."
        :adjust-position="false"
        @focus="onFocus"
        @blur="onBlur"
        @confirm="sendText"
      />
      
      <!-- 语音按钮 -->
      <view 
        v-else
        class="voice-btn"
        @touchstart="startRecord"
        @touchend="stopRecord"
        @touchmove="checkMove"
      >
        {{ recording ? '松开结束' : '按住说话' }}
      </view>
      
      <!-- 更多功能 -->
      <text class="tool-btn" @tap="showMore = !showMore">➕</text>
      
      <!-- 发送按钮 -->
      <button 
        v-if="!isVoiceMode && inputMessage.trim()" 
        class="send-btn" 
        @tap="sendText"
      >
        发送
      </button>
    </view>
    
    <!-- 更多功能面板 -->
    <view v-if="showMore" class="more-panel">
      <view class="more-item" @tap="chooseImage">
        <text class="more-icon">📷</text>
        <text class="more-text">相册</text>
      </view>
      <view class="more-item" @tap="takePhoto">
        <text class="more-icon">📸</text>
        <text class="more-text">拍摄</text>
      </view>
    </view>
    
    <!-- 录音提示框 -->
    <view v-if="recording" class="record-modal">
      <view class="record-box">
        <view class="record-icon" :class="{ cancel: willCancel }">
          {{ willCancel ? '✕' : '🎤' }}
        </view>
        <text class="record-text">{{ willCancel ? '松开取消' : '正在录音...' }}</text>
        <view class="record-time">{{ recordTime }}s</view>
      </view>
    </view>
    
    <!-- 消息长按菜单 -->
    <view v-if="showMenu" class="msg-menu" :style="{ top: menuY + 'px', left: menuX + 'px' }">
      <text class="menu-item" @tap="copyMsg">复制</text>
      <text class="menu-item" @tap="deleteMsg">删除</text>
      <text class="menu-item" @tap="recallMsg">撤回</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 用户信息
      myAvatar: 'https://picsum.photos/100/100?random=1',
      otherAvatar: 'https://picsum.photos/100/100?random=2',
      
      // 消息列表
      messages: [
        { 
          content: '你好！很高兴认识你 👋', 
          type: 'text',
          isMe: false,
          time: Date.now() - 3600000
        },
        { 
          content: '你好呀！我也很高兴', 
          type: 'text',
          isMe: true,
          time: Date.now() - 3000000
        },
        { 
          content: '', 
          type: 'voice',
          voiceUrl: 'https://example.com/voice.mp3',
          duration: 8,
          isMe: false,
          time: Date.now() - 120000
        }
      ],
      
      // 输入相关
      inputMessage: '',
      isVoiceMode: false,
      showMore: false,
      
      // 语音相关
      recording: false,
      recordTime: 0,
      recordTimer: null,
      willCancel: false,
      recorderManager: null,
      
      // 播放相关
      playingIndex: -1,
      innerAudioContext: null,
      
      // 布局相关
      scrollIntoView: '',
      scrollHeight: 0,
      windowHeight: 0,
      keyboardHeight: 0,
      statusBarHeight: 0,
      
      // 菜单相关
      showMenu: false,
      menuX: 0,
      menuY: 0,
      selectedMsgIndex: -1
    }
  },
  
  onLoad() {
    this.initSystem()
    this.initVoice()
    this.scrollToBottom()
  },
  
  methods: {
    // 初始化系统信息
    initSystem() {
      const systemInfo = uni.getSystemInfoSync()
      this.windowHeight = systemInfo.windowHeight
      this.statusBarHeight = systemInfo.statusBarHeight
      this.calcHeight()
    },
    
    // 计算高度
    calcHeight() {
      const inputHeight = this.showMore ? 400 : 100
      this.scrollHeight = this.windowHeight - this.keyboardHeight - inputHeight
    },
    
    // 初始化语音
    initVoice() {
      // #ifdef APP-PLUS || MP-WEIXIN
      this.recorderManager = uni.getRecorderManager()
      this.innerAudioContext = uni.createInnerAudioContext()
      
      this.recorderManager.onStart(() => {
        console.log('录音开始')
        this.startRecordTimer()
      })
      
      this.recorderManager.onStop((res) => {
        console.log('录音结束', res)
        this.stopRecordTimer()
        if (!this.willCancel) {
          this.sendVoice(res.tempFilePath, this.recordTime)
        }
      })
      
      this.recorderManager.onError((res) => {
        console.error('录音错误', res)
        this.stopRecord()
        uni.showToast({ title: '录音失败', icon: 'none' })
      })
      // #endif
    },
    
    // 发送文字
    sendText() {
      const content = this.inputMessage.trim()
      if (!content) return
      
      const msg = {
        content,
        type: 'text',
        isMe: true,
        status: 'sending',
        time: Date.now()
      }
      
      this.messages.push(msg)
      this.inputMessage = ''
      this.showMore = false
      this.scrollToBottom()
      
      // 模拟发送成功
      setTimeout(() => {
        msg.status = 'success'
      }, 500)
      
      // 模拟对方回复
      setTimeout(() => {
        this.receiveMsg('收到：' + content)
      }, 1500)
    },
    
    // 接收消息
    receiveMsg(content) {
      this.messages.push({
        content,
        type: 'text',
        isMe: false,
        time: Date.now()
      })
      this.scrollToBottom()
    },
    
    // 发送语音
    sendVoice(url, duration) {
      this.messages.push({
        content: url,
        type: 'voice',
        voiceUrl: url,
        duration: Math.ceil(duration),
        isMe: true,
        time: Date.now()
      })
      this.scrollToBottom()
    },
    
    // 开始录音
    startRecord(e) {
      // #ifdef H5
      uni.showToast({ title: 'H5暂不支持录音', icon: 'none' })
      return
      // #endif
      
      this.recording = true
      this.recordTime = 0
      this.willCancel = false
      
      this.recorderManager.start({
        duration: 60000,
        format: 'mp3'
      })
    },
    
    // 停止录音
    stopRecord() {
      if (!this.recording) return
      this.recording = false
      this.recorderManager.stop()
    },
    
    // 检查移动（是否上滑取消）
    checkMove(e) {
      const touch = e.touches[0]
      const startY = this.recordStartY || touch.clientY
      this.recordStartY = startY
      this.willCancel = startY - touch.clientY > 50
    },
    
    // 录音计时器
    startRecordTimer() {
      this.recordTimer = setInterval(() => {
        this.recordTime++
        if (this.recordTime >= 60) {
          this.stopRecord()
        }
      }, 1000)
    },
    
    stopRecordTimer() {
      clearInterval(this.recordTimer)
      this.recordStartY = null
    },
    
    // 播放语音
    playVoice(msg, index) {
      if (this.playingIndex === index) {
        this.innerAudioContext.stop()
        this.playingIndex = -1
        return
      }
      
      this.playingIndex = index
      this.innerAudioContext.src = msg.voiceUrl || msg.content
      this.innerAudioContext.play()
      
      this.innerAudioContext.onEnded(() => {
        this.playingIndex = -1
      })
      
      this.innerAudioContext.onError(() => {
        this.playingIndex = -1
        uni.showToast({ title: '播放失败', icon: 'none' })
      })
    },
    
    // 选择图片
    chooseImage() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.messages.push({
            content: res.tempFilePaths[0],
            type: 'image',
            isMe: true,
            time: Date.now()
          })
          this.scrollToBottom()
        }
      })
    },
    
    // 拍照
    takePhoto() {
      uni.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: (res) => {
          this.messages.push({
            content: res.tempFilePaths[0],
            type: 'image',
            isMe: true,
            time: Date.now()
          })
          this.scrollToBottom()
        }
      })
    },
    
    // 预览图片
    previewImage(url) {
      uni.previewImage({
        urls: [url]
      })
    },
    
    // 预览头像
    previewAvatar(url) {
      uni.previewImage({
        urls: [url],
        current: url
      })
    },
    
    // 显示消息菜单
    showMsgMenu(index) {
      this.selectedMsgIndex = index
      this.showMenu = true
      // 简化处理，实际应该计算位置
      this.menuX = 100
      this.menuY = 300
    },
    
    // 隐藏菜单
    hideAllMenus() {
      this.showMenu = false
      this.showMore = false
    },
    
    // 复制消息
    copyMsg() {
      const msg = this.messages[this.selectedMsgIndex]
      uni.setClipboardData({
        data: msg.content,
        success: () => {
          uni.showToast({ title: '已复制', icon: 'none' })
          this.showMenu = false
        }
      })
    },
    
    // 删除消息
    deleteMsg() {
      this.messages.splice(this.selectedMsgIndex, 1)
      this.showMenu = false
    },
    
    // 撤回消息
    recallMsg() {
      const msg = this.messages[this.selectedMsgIndex]
      if (Date.now() - msg.time > 120000) {
        uni.showToast({ title: '超过2分钟无法撤回', icon: 'none' })
        return
      }
      msg.content = '已撤回'
      msg.type = 'text'
      this.showMenu = false
    },
    
    // 切换输入模式
    toggleInputMode() {
      this.isVoiceMode = !this.isVoiceMode
      this.keyboardHeight = 0
      this.calcHeight()
    },
    
    // 输入框聚焦
    onFocus(e) {
      this.keyboardHeight = e.detail.height || 0
      this.showMore = false
      this.calcHeight()
      this.scrollToBottom()
    },
    
    // 输入框失焦
    onBlur() {
      setTimeout(() => {
        this.keyboardHeight = 0
        this.calcHeight()
      }, 100)
    },
    
    // 滚动到底部
    scrollToBottom() {
      setTimeout(() => {
        this.scrollIntoView = 'msg-' + (this.messages.length - 1)
      }, 100)
    }
  }
}
</script>

<style>
page {
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f5;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
}

/* 消息列表 */
.message-list {
  flex: 1;
  padding: 20rpx;
  box-sizing: border-box;
}

/* 消息项 */
.message-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 30rpx;
  position: relative;
}

.message-left {
  justify-content: flex-start;
}

.message-right {
  justify-content: flex-end;
  flex-direction: row-reverse;
}

/* 头像 */
.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 10rpx;
  background-color: #ddd;
  flex-shrink: 0;
  border: 2rpx solid #e0e0e0;
}

/* 消息内容 */
.message-content {
  max-width: 60%;
  margin: 0 20rpx;
  position: relative;
}

/* 文字消息 */
.message-text {
  display: inline-block;
  padding: 20rpx;
  border-radius: 10rpx;
  font-size: 30rpx;
  line-height: 1.5;
  word-break: break-all;
}

.message-left .message-text {
  background-color: #ffffff;
  border: 1rpx solid #e0e0e0;
}

.message-right .message-text {
  background-color: #95ec69;
}

/* 语音消息 */
.voice-message {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-radius: 10rpx;
  background-color: #ffffff;
  min-width: 120rpx;
}

.message-right .voice-message {
  background-color: #95ec69;
  flex-direction: row-reverse;
}

.voice-icon {
  font-size: 32rpx;
  margin-right: 10rpx;
}

.message-right .voice-icon {
  margin-right: 0;
  margin-left: 10rpx;
}

.voice-duration {
  font-size: 28rpx;
  color: #666;
}

/* 语音播放动画 */
.voice-wave {
  display: flex;
  align-items: center;
  margin-left: 10rpx;
}

.wave-bar {
  width: 6rpx;
  height: 20rpx;
  background-color: #07c160;
  margin: 0 3rpx;
  animation: wave 0.5s ease-in-out infinite;
}

.wave-bar:nth-child(2) {
  animation-delay: 0.1s;
  height: 30rpx;
}

.wave-bar:nth-child(3) {
  animation-delay: 0.2s;
  height: 25rpx;
}

@keyframes wave {
  0%, 100% { transform: scaleY(0.5); }
  50% { transform: scaleY(1); }
}

/* 图片消息 */
.message-image {
  max-width: 400rpx;
  border-radius: 10rpx;
  display: block;
}

/* 发送状态 */
.msg-status {
  display: flex;
  align-items: center;
  margin: 0 10rpx;
}

.sending {
  color: #999;
  font-size: 24rpx;
  animation: rotate 1s linear infinite;
}

.failed {
  color: #ff4d4f;
  font-size: 32rpx;
  font-weight: bold;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 底部输入区域 */
.input-area {
  position: fixed;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #f7f7f7;
  border-top: 1rpx solid #e0e0e0;
  box-sizing: border-box;
  z-index: 100;
  transition: bottom 0.3s;
}

.tool-btn {
  font-size: 40rpx;
  padding: 10rpx;
  margin: 0 10rpx;
}

.message-input {
  flex: 1;
  height: 70rpx;
  padding: 0 20rpx;
  background-color: #ffffff;
  border-radius: 10rpx;
  font-size: 30rpx;
  border: 1rpx solid #e0e0e0;
}

.voice-btn {
  flex: 1;
  height: 70rpx;
  line-height: 70rpx;
  text-align: center;
  background-color: #ffffff;
  border-radius: 10rpx;
  font-size: 30rpx;
  color: #333;
  border: 1rpx solid #e0e0e0;
}

.voice-btn:active {
  background-color: #e0e0e0;
}

.send-btn {
  width: 100rpx;
  height: 64rpx;
  margin-left: 20rpx;
  padding: 0;
  line-height: 64rpx;
  font-size: 28rpx;
  color: #ffffff;
  background-color: #07c160;
  border-radius: 8rpx;
}

/* 更多功能面板 */
.more-panel {
  position: fixed;
  bottom: 100rpx;
  left: 0;
  right: 0;
  height: 300rpx;
  background-color: #f7f7f7;
  border-top: 1rpx solid #e0e0e0;
  display: flex;
  padding: 40rpx;
  box-sizing: border-box;
  z-index: 99;
}

.more-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 60rpx;
}

.more-icon {
  width: 100rpx;
  height: 100rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50rpx;
  margin-bottom: 10rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.more-text {
  font-size: 24rpx;
  color: #666;
}

/* 录音弹窗 */
.record-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.record-box {
  width: 300rpx;
  height: 300rpx;
  background-color: rgba(0,0,0,0.8);
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.record-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.record-icon.cancel {
  color: #ff4d4f;
}

.record-text {
  color: #ffffff;
  font-size: 28rpx;
  margin-bottom: 20rpx;
}

.record-time {
  color: #07c160;
  font-size: 40rpx;
  font-weight: bold;
}

/* 消息菜单 */
.msg-menu {
  position: fixed;
  background-color: #333;
  border-radius: 10rpx;
  display: flex;
  padding: 10rpx 0;
  z-index: 200;
}

.menu-item {
  color: #ffffff;
  font-size: 28rpx;
  padding: 10rpx 30rpx;
  border-right: 1rpx solid #555;
}

.menu-item:last-child {
  border-right: none;
}

.menu-item:active {
  opacity: 0.7;
}
</style>