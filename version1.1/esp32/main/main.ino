#include <ArduinoJson.h>
#include <WiFi.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>

#define SERVICE_UUID        "12345678-1234-1234-1234-1234567890ab"

#define CHARACTERISTIC_UUID "abcd1234-5678-1234-5678-abcdef123456"


class MyCallbacks : public BLECharacteristicCallbacks {

  void onWrite(BLECharacteristic *pCharacteristic) {

  String value = pCharacteristic->getValue();  // ⭐关键：String

  if (value.length() > 0) {

    Serial.println("收到数据:");
    Serial.println(value);

    StaticJsonDocument<200> doc;

    DeserializationError error = deserializeJson(doc, value);

    if (error) {
      Serial.println("JSON解析失败");
      return;
    }

    const char* ssid = doc["ssid"];
    const char* password = doc["password"];

    Serial.println(ssid);
    Serial.println(password);

    WiFi.begin(ssid, password);

    Serial.println("正在连接WiFi...");
  }
}

};


void setup() {

  Serial.begin(115200);

  // 初始化BLE
  BLEDevice::init("ESP32_WIFI_CONFIG");

  // 创建服务器
  BLEServer *pServer = BLEDevice::createServer();

  // 创建服务
  BLEService *pService =
    pServer->createService(SERVICE_UUID);

  // 创建特征值
  BLECharacteristic *pCharacteristic =
    pService->createCharacteristic(

      CHARACTERISTIC_UUID,

      BLECharacteristic::PROPERTY_WRITE

    );

  // 设置回调
  pCharacteristic->setCallbacks(new MyCallbacks());

  // 启动服务
  pService->start();

  // 开始广播
  BLEAdvertising *pAdvertising =
    BLEDevice::getAdvertising();

  pAdvertising->start();

  Serial.println("BLE服务已开启");

}

void loop() {

}