<template>
	<view class="container">

		<button @click="initialBluetooth">
			初始化蓝牙
		</button>

		<button @click="seekDevice">
			搜索设备
		</button>

		<button @click="stopSeekDevice">
			停止搜索
		</button>

		<button @click="sendDataDevice">
			发送数据
		</button>

		<view v-for="(item,index) in deviceList" :key="index">

			<view class="deviceItem">
				<text>{{item.name}}</text>

				<button
					size="mini"
					@click="linkDevice(item.deviceId)"
				>
					连接
				</button>
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

				characteristicId: ""

			}
		},

		methods: {

			// 初始化蓝牙
			initialBluetooth() {

				uni.openBluetoothAdapter({

					success: (res) => {

						console.log("初始化蓝牙成功")
						console.log(res)

					},

					fail: (err) => {

						console.log("初始化蓝牙失败")
						console.log(err)

					}

				})

			},

			// 搜索蓝牙设备
			seekDevice() {

				uni.startBluetoothDevicesDiscovery({

					allowDuplicatesKey: false,

					success: (res) => {

						console.log("开始搜索设备")
						console.log(res)

						this.monitorDevice()

					},

					fail: (err) => {

						console.log("搜索失败")
						console.log(err)

					}

				})

			},

			// 监听搜索到的设备
			monitorDevice() {

				uni.onBluetoothDeviceFound((res) => {

					console.log("发现设备")
					console.log(res)

					res.devices.forEach(device => {

						// 没名字的不要
						if (!device.name) return

						// 去重
						let index = this.deviceList.findIndex(item => {
							return item.deviceId == device.deviceId
						})

						if (index == -1) {

							this.deviceList.push(device)

						}

					})

				})

			},

			// 停止搜索
			stopSeekDevice() {

				uni.stopBluetoothDevicesDiscovery({

					success: (res) => {

						console.log("停止搜索成功")

					}

				})

			},

			// 连接设备
			linkDevice(deviceId) {

				this.deviceId = deviceId

				uni.createBLEConnection({

					deviceId: deviceId,

					success: (res) => {

						console.log("连接成功")
						console.log(res)

						uni.showToast({
							title: "连接成功"
						})

						// 获取服务
						this.getBLEService()

					},

					fail: (err) => {

						console.log("连接失败")
						console.log(err)

					}

				})

			},

			// 获取服务
			getBLEService() {
				uni.getBLEDeviceServices({
					deviceId: this.deviceId,
					success: (res) => {
						console.log("获取服务成功")
						console.log(res.services)
						res.services.forEach(item => {
							console.log(item.uuid)
							// 找到我们自己的服务
							if(
								item.uuid.toUpperCase() ==
								"12345678-1234-1234-1234-1234567890AB"
							){
								
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
						console.log("获取特征值成功")
						console.log(res.characteristics)
						res.characteristics.forEach(item=>{
							console.log(item.uuid)
							console.log(item.properties)
							if(item.properties.write){
								this.characteristicId = item.uuid
								console.log("找到可写特征值")
							}
						})
					},
					fail:(err)=>{
						console.log("获取特征值失败")
						console.log(err)
					}
				})
			},

			// 发送数据
			sendDataDevice() {

				let data = JSON.stringify({

					ssid: "x200",

					password: "00000000"

				})

				let buffer = new ArrayBuffer(data.length)

				let dataView = new Uint8Array(buffer)

				for (let i = 0; i < data.length; i++) {

					dataView[i] = data.charCodeAt(i)

				}

				uni.writeBLECharacteristicValue({

					deviceId: this.deviceId,

					serviceId: this.serviceId,

					characteristicId: this.characteristicId,

					value: buffer,

					success: (res) => {

						console.log("发送成功")
						console.log(res)

					},

					fail: (err) => {

						console.log("发送失败")
						console.log(err)

					}

				})

			}

		}

	}
</script>

<style>

	.container{

		padding: 20rpx;

	}

	.deviceItem{

		display: flex;

		justify-content: space-between;

		align-items: center;

		margin-top: 20rpx;

		padding: 20rpx;

		border: 1px solid #ccc;

	}

</style>