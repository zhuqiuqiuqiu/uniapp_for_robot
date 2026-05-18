<template>
  <view class="container">
<!--    <button @click="initialBluetooth">初始化蓝牙</button>
    <button @click="seekDevice">搜索设备</button>
    <button @click="stopSeekDevice">停止搜索</button>
	
	<input v-model="wifiName" placeholder="请输入WIFI名称" class="wifi_input"/>
	<input v-model="wifiPassword" placeholder="请输入WIFI密码" class="wifi_input"/>
	
    <button @click="sendDataDevice">发送数据</button> -->


    <view class="menu-list-BLE">
      <view 
        class="menu-item-BLE" 
        v-for="(item, index) in menuItems" 
        :key="index"
        @click="item.handler"
        hover-class="menu-item-hover-BLE"
        :hover-stay-time="100"
      >
        <view class="menu-icon-BLE" :style="{ background: item.iconBg }">
          <image :src="item.icon" class="icon-img" mode="aspectFit"/>
        </view>
        <text class="menu-text-BLE">{{ item.name }}</text>
        <text class="menu-arrow-BLE">›</text>
      </view>
    </view>

    <!-- WiFi 输入弹窗 -->
    <view v-if="showWifiModal" class="modal-overlay" @click="closeWifiModal">
      <view class="modal-box" @click.stop>
        <text class="modal-title">输入 WiFi 信息</text>
        
        <input 
          v-model="wifiName" 
          placeholder="请输入WiFi名称" 
          class="wifi-input"
        />
        
        <input 
          v-model="wifiPassword" 
          placeholder="请输入WiFi密码" 
          password
          class="wifi-input"
        />
        
        <view class="modal-actions">
          <button class="btn-cancel" @click="closeWifiModal">取消</button>
          <button class="btn-confirm" @click="confirmWifiInput">确定</button>
        </view>
      </view>
    </view>

    <view v-for="(item,index) in deviceList" :key="index">
      <view class="deviceItem">
        <text>{{item.name}}</text>
        <button size="mini" @click="linkDevice(item.deviceId)">连接</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      deviceList: [],
      deviceId: "",
      serviceId: "",
      characteristicId: "",
	  wifiName: '',
	  wifiPassword: '',
	  showWifiModal: false,
	  menuItems: [
	    { 
	      name: '初始化蓝牙', 
	      icon: '/static/bluetooth.png', 
	      iconBg: '#ffffff',
	      handler: this.initialBluetooth 
	    },
	    { 
	      name: '搜索设备', 
	      icon: '/static/device.png', 
	      iconBg: '#ffffff',
	      handler: this.seekDevice 
	    },
	    { 
	      name: '停止搜索', 
	      icon: '/static/stop.png', 
	      iconBg: '#ffffff',
	      handler: this.stopSeekDevice 
	    },
	    { 
	      name: 'wifi信息', 
	      icon: '/static/wifi-info.png', 
	      iconBg: '#ffffff',
	      handler: this.wifi_input
	    },
		{
		  name: '连接wifi', 
		  icon: '/static/wifi.png', 
		  iconBg: '#ffffff',
		  handler: this.sendDataDevice 
		}
	  ]
    }
  },

  methods: {
    // 初始化蓝牙
    initialBluetooth() {
      uni.openBluetoothAdapter({
        success: (res) => {
          console.log("初始化蓝牙成功", res)
        },
        fail: (err) => {
          console.log("初始化蓝牙失败", err)
        }
      })
    },

    // 搜索蓝牙设备
    seekDevice() {
      uni.startBluetoothDevicesDiscovery({
        allowDuplicatesKey: false,
        success: (res) => {
          console.log("开始搜索设备", res)
          this.monitorDevice()
        },
        fail: (err) => {
          console.log("搜索失败", err)
        }
      })
    },

    // 监听搜索到的设备
    monitorDevice() {
      uni.onBluetoothDeviceFound((res) => {
        console.log("发现设备", res)
        res.devices.forEach(device => {
          if (!device.name) return
          let index = this.deviceList.findIndex(item => item.deviceId == device.deviceId)
          if (index == -1) this.deviceList.push(device)
        })
      })
    },

    // 停止搜索
    stopSeekDevice() {
      uni.stopBluetoothDevicesDiscovery({
        success: () => {
          console.log("停止搜索成功")
        }
      })
    },

    // 连接设备
    linkDevice(deviceId) {
      this.deviceId = deviceId
      uni.createBLEConnection({
        deviceId,
        success: () => {
          console.log("连接成功")
          uni.showToast({ title: "连接成功" })
          this.getBLEService()
        },
        fail: (err) => {
          console.log("连接失败", err)
        }
      })
    },

    // 获取服务
    getBLEService() {
      uni.getBLEDeviceServices({
        deviceId: this.deviceId,
        success: (res) => {
          res.services.forEach(item => {
            if (item.uuid.toUpperCase() === "12345678-1234-1234-1234-1234567890AB") {
              this.serviceId = item.uuid
              console.log("找到目标服务")
              this.getBLECharacteristic()
            }
          })
        }
      })
    },

    // 获取特征值
    getBLECharacteristic() {
      uni.getBLEDeviceCharacteristics({
        deviceId: this.deviceId,
        serviceId: this.serviceId,
        success: (res) => {
          res.characteristics.forEach(item => {
            if (item.properties.write) this.characteristicId = item.uuid
          })
        }
      })
    },
	
    // 打开弹窗让用户输入
    wifi_input() {
      this.showWifiModal = true;
    },
    
    // 关闭弹窗
    closeWifiModal() {
      this.showWifiModal = false;
    },
    
    // 点击确定，保存输入（数据已经在 v-model 里同步了）
    confirmWifiInput() {
	  if (!this.wifiName.trim()) {
		uni.showToast({ 
		  title: '请输入WiFi名称', 
		  icon: 'none'      // none 表示纯文字提示
		});
		return;
	  }
	  this.showWifiModal = false;
	  uni.showToast({ 
		title: '保存成功', 
		icon: 'success'    // 显示打勾图标
	  });
	  console.log('已保存WiFi信息：', this.wifiName, this.wifiPassword);
    },
	
    // 发送wifi信息数据给esp32
    sendDataDevice() {
	  if (!this.wifiName) {
		uni.showToast({ title: '请先输入WiFi信息', icon: 'none' });
		return;
	  }
	  const wifiData = {
	    ssid: this.wifiName,
	    password: this.wifiPassword
	  };
      let data = JSON.stringify(wifiData);
	  
      let buffer = new ArrayBuffer(data.length);
      let dataView = new Uint8Array(buffer);
      for (let i = 0; i < data.length; i++) {
        dataView[i] = data.charCodeAt(i);
      }
	  
	  uni.writeBLECharacteristicValue({
		  deviceId: this.deviceId,
		  serviceId: this.serviceId,
		  characteristicId: this.characteristicId,
		  value: buffer,
		  success: () => {
			uni.showToast({ title: '发送成功', icon: 'success' });
			console.log("发送内容:", data);
		  },
		  fail: (err) => {
			uni.showToast({ title: '发送失败', icon: 'none' });
			console.log("发送失败", err);
		  }
		});
    },

    // ArrayBuffer转字符串
    ab2str(buffer) {
      let uint8Arr = new Uint8Array(buffer)
      let str = ""
      for (let i = 0; i < uint8Arr.length; i++) str += String.fromCharCode(uint8Arr[i])
      return str
    }
	
	
  },

  mounted() {
    // 监听特征值变化
    uni.onBLECharacteristicValueChange((res) => {
      let msg = this.ab2str(res.value)
      console.log("ESP32返回:", msg)
      if (msg === "wifi_success") uni.showToast({ title: "配网成功" })
      if (msg === "wifi_fail") uni.showToast({ title: "配网失败" })
    })
  },
  

  
  
}
</script>

<style>
.container {
  padding: 20rpx;
}

.deviceItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
  padding: 20rpx;
  border: 1px solid #ccc;
}
/* 菜单列表 */
.menu-list-BLE {
  background: #f9f9f9;
  border-radius: 24rpx;
  padding: 10rpx 0;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.menu-item-BLE {
  display: flex;
  align-items: center;
  padding: 30rpx;
  position: relative;
}

/* 分隔线（除最后一个） */
.menu-item-BLE:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 100rpx;
  right: 0;
  bottom: 0;
  height: 1rpx;
  background: #f0f0f0;
}

/* 点击效果 */
.menu-item-hover-BLE {
  background: #f8f9fa;
}

.menu-icon-BLE {
  width: 72rpx;
  height: 72rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.iconfont-BLE {
  font-size: 36rpx;
  color: #fff;
}

.menu-text-BLE {
  flex: 1;
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.menu-arrow-BLE {
  font-size: 36rpx;
  color: #c7c7cc;
  margin-left: 10rpx;
}
.icon-img {
  width: 50rpx;
  height: 50rpx;
}


/* 弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-box {
  background: #fff;
  padding: 40rpx;
  border-radius: 24rpx;
  width: 600rpx;
}

.modal-title {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30rpx;
}

.wifi-input {
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  margin-bottom: 20rpx;
  border: 2rpx solid #ddd;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30rpx;
}

.btn-cancel, .btn-confirm {
  width: 46%;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 30rpx;
  border: none;
  border-radius: 12rpx;
}

.btn-cancel {
  background: #f0f0f0;
  color: #666;
}

.btn-confirm {
  background: #34C759;
  color: #fff;
}
</style>