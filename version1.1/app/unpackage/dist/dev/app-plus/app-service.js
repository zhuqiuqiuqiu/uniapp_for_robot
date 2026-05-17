if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$6 = {
    data() {
      return {
        banners: [
          { src: "", bg: "#667eea", title: "智能连接" },
          { src: "", bg: "#764ba2", title: "高效管理" },
          { src: "", bg: "#f093fb", title: "数据安全" }
        ],
        startX: 0,
        // 触摸起始 X（用于计算位移）
        thumbX: 0,
        // 滑块当前位移（px）
        boxWidth: 0,
        // 轨道实际宽度（px）
        thumbWidth: 0,
        // 滑块实际宽度（px）
        isSuccess: false
        // 是否已解锁
      };
    },
    computed: {
      // 进度条百分比
      progress() {
        if (!this.boxWidth || !this.thumbWidth)
          return 0;
        const max = this.boxWidth - this.thumbWidth;
        if (max <= 0)
          return 0;
        return Math.min(100, this.thumbX / max * 100);
      }
    },
    mounted() {
      setTimeout(() => this.getBoxSize(), 100);
    },
    methods: {
      // 动态获取轨道和滑块的真实像素尺寸（解决不同手机适配问题）
      getBoxSize() {
        const query = uni.createSelectorQuery().in(this);
        query.select("#sliderBox").boundingClientRect((res) => {
          if (res)
            this.boxWidth = res.width;
        });
        query.select(".slider-thumb").boundingClientRect((res) => {
          if (res)
            this.thumbWidth = res.width;
        }).exec();
      },
      onStart(e) {
        if (this.isSuccess)
          return;
        this.startX = e.touches[0].clientX - this.thumbX;
      },
      onMove(e) {
        if (this.isSuccess)
          return;
        const x = e.touches[0].clientX - this.startX;
        const max = this.boxWidth - this.thumbWidth;
        if (x < 0)
          this.thumbX = 0;
        else if (x > max)
          this.thumbX = max;
        else
          this.thumbX = x;
      },
      onEnd() {
        if (this.isSuccess)
          return;
        const max = this.boxWidth - this.thumbWidth;
        const threshold = max * 0.85;
        if (this.thumbX >= threshold) {
          this.thumbX = max;
          this.isSuccess = true;
          setTimeout(() => {
            uni.reLaunch({ url: "/pages/index/index" });
          }, 500);
        } else {
          this.thumbX = 0;
        }
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "launch-page" }, [
      vue.createElementVNode("view", { class: "gallery-wrap" }, [
        vue.createElementVNode("swiper", {
          class: "gallery",
          "indicator-dots": "",
          autoplay: "",
          circular: "",
          duration: "400"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.banners, (item, i) => {
              return vue.openBlock(), vue.createElementBlock("swiper-item", { key: i }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "gallery-card",
                    style: vue.normalizeStyle({ background: item.bg })
                  },
                  [
                    item.src ? (vue.openBlock(), vue.createElementBlock("image", {
                      key: 0,
                      src: item.src,
                      mode: "aspectFill",
                      class: "gallery-img"
                    }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        key: 1,
                        class: "placeholder"
                      },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ))
                  ],
                  4
                  /* STYLE */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createElementVNode("view", { class: "unlock-wrap" }, [
        vue.createElementVNode("text", { class: "hint" }, "滑动进入应用"),
        vue.createElementVNode("view", {
          class: "slider-box",
          id: "sliderBox"
        }, [
          vue.createElementVNode(
            "view",
            {
              class: "slider-bg",
              style: vue.normalizeStyle({ width: $options.progress + "%" })
            },
            null,
            4
            /* STYLE */
          ),
          !$data.isSuccess ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "slider-text"
          }, [
            vue.createElementVNode("text", { class: "arrow" }, "›"),
            vue.createElementVNode("text", { class: "arrow" }, "›"),
            vue.createElementVNode("text", { class: "arrow" }, "›")
          ])) : (vue.openBlock(), vue.createElementBlock("text", {
            key: 1,
            class: "slider-text success"
          }, "正在进入…")),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["slider-thumb", { success: $data.isSuccess }]),
              style: vue.normalizeStyle({ transform: `translateX(${$data.thumbX}px)` }),
              onTouchstart: _cache[0] || (_cache[0] = (...args) => $options.onStart && $options.onStart(...args)),
              onTouchmove: _cache[1] || (_cache[1] = vue.withModifiers((...args) => $options.onMove && $options.onMove(...args), ["stop", "prevent"])),
              onTouchend: _cache[2] || (_cache[2] = (...args) => $options.onEnd && $options.onEnd(...args))
            },
            [
              !$data.isSuccess ? (vue.openBlock(), vue.createElementBlock("text", {
                key: 0,
                class: "thumb-icon"
              }, "›")) : (vue.openBlock(), vue.createElementBlock("text", {
                key: 1,
                class: "thumb-icon"
              }, "✓"))
            ],
            38
            /* CLASS, STYLE, NEED_HYDRATION */
          )
        ])
      ])
    ]);
  }
  const PagesCoverCover = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__file", "E:/文创app/app/pages/cover/cover.vue"]]);
  const _sfc_main$5 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const goCall = () => {
        uni.navigateTo({
          url: "/pages/call/call"
        });
      };
      const __returned__ = { goCall };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("image", {
        class: "pet-avatar",
        src: "https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
      }),
      vue.createElementVNode("text", { class: "status" }, "🟢 在线"),
      vue.createElementVNode("text", { class: "battery" }, "电量：85%"),
      vue.createElementVNode("button", {
        class: "start-btn",
        onClick: $setup.goCall
      }, " 进入陪伴 ")
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__file", "E:/文创app/app/pages/index/index.vue"]]);
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const _sfc_main$4 = {
    data() {
      return {
        // 用户信息
        myAvatar: "https://picsum.photos/100/100?random=1",
        otherAvatar: "https://picsum.photos/100/100?random=2",
        // 消息列表
        messages: [
          {
            content: "你好！很高兴认识你 👋",
            type: "text",
            isMe: false,
            time: Date.now() - 36e5
          },
          {
            content: "你好呀！我也很高兴",
            type: "text",
            isMe: true,
            time: Date.now() - 3e6
          },
          {
            content: "",
            type: "voice",
            voiceUrl: "https://example.com/voice.mp3",
            duration: 8,
            isMe: false,
            time: Date.now() - 12e4
          }
        ],
        // 输入相关
        inputMessage: "",
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
        scrollIntoView: "",
        scrollHeight: 0,
        windowHeight: 0,
        keyboardHeight: 0,
        statusBarHeight: 0,
        // 菜单相关
        showMenu: false,
        menuX: 0,
        menuY: 0,
        selectedMsgIndex: -1
      };
    },
    onLoad() {
      this.initSystem();
      this.initVoice();
      this.scrollToBottom();
    },
    methods: {
      // 初始化系统信息
      initSystem() {
        const systemInfo = uni.getSystemInfoSync();
        this.windowHeight = systemInfo.windowHeight;
        this.statusBarHeight = systemInfo.statusBarHeight;
        this.calcHeight();
      },
      // 计算高度
      calcHeight() {
        const inputHeight = this.showMore ? 400 : 100;
        this.scrollHeight = this.windowHeight - this.keyboardHeight - inputHeight;
      },
      // 初始化语音
      initVoice() {
        this.recorderManager = uni.getRecorderManager();
        this.innerAudioContext = uni.createInnerAudioContext();
        this.recorderManager.onStart(() => {
          formatAppLog("log", "at pages/call/call.vue:231", "录音开始");
          this.startRecordTimer();
        });
        this.recorderManager.onStop((res) => {
          formatAppLog("log", "at pages/call/call.vue:236", "录音结束", res);
          this.stopRecordTimer();
          if (!this.willCancel) {
            this.sendVoice(res.tempFilePath, this.recordTime);
          }
        });
        this.recorderManager.onError((res) => {
          formatAppLog("error", "at pages/call/call.vue:244", "录音错误", res);
          this.stopRecord();
          uni.showToast({ title: "录音失败", icon: "none" });
        });
      },
      // 发送文字
      sendText() {
        const content = this.inputMessage.trim();
        if (!content)
          return;
        const msg = {
          content,
          type: "text",
          isMe: true,
          status: "sending",
          time: Date.now()
        };
        this.messages.push(msg);
        this.inputMessage = "";
        this.showMore = false;
        this.scrollToBottom();
        setTimeout(() => {
          msg.status = "success";
        }, 500);
        setTimeout(() => {
          this.receiveMsg("收到：" + content);
        }, 1500);
      },
      // 接收消息
      receiveMsg(content) {
        this.messages.push({
          content,
          type: "text",
          isMe: false,
          time: Date.now()
        });
        this.scrollToBottom();
      },
      // 发送语音
      sendVoice(url, duration) {
        this.messages.push({
          content: url,
          type: "voice",
          voiceUrl: url,
          duration: Math.ceil(duration),
          isMe: true,
          time: Date.now()
        });
        this.scrollToBottom();
      },
      // 开始录音
      startRecord(e) {
        this.recording = true;
        this.recordTime = 0;
        this.willCancel = false;
        this.recorderManager.start({
          duration: 6e4,
          format: "mp3"
        });
      },
      // 停止录音
      stopRecord() {
        if (!this.recording)
          return;
        this.recording = false;
        this.recorderManager.stop();
      },
      // 检查移动（是否上滑取消）
      checkMove(e) {
        const touch = e.touches[0];
        const startY = this.recordStartY || touch.clientY;
        this.recordStartY = startY;
        this.willCancel = startY - touch.clientY > 50;
      },
      // 录音计时器
      startRecordTimer() {
        this.recordTimer = setInterval(() => {
          this.recordTime++;
          if (this.recordTime >= 60) {
            this.stopRecord();
          }
        }, 1e3);
      },
      stopRecordTimer() {
        clearInterval(this.recordTimer);
        this.recordStartY = null;
      },
      // 播放语音
      playVoice(msg, index) {
        if (this.playingIndex === index) {
          this.innerAudioContext.stop();
          this.playingIndex = -1;
          return;
        }
        this.playingIndex = index;
        this.innerAudioContext.src = msg.voiceUrl || msg.content;
        this.innerAudioContext.play();
        this.innerAudioContext.onEnded(() => {
          this.playingIndex = -1;
        });
        this.innerAudioContext.onError(() => {
          this.playingIndex = -1;
          uni.showToast({ title: "播放失败", icon: "none" });
        });
      },
      // 选择图片
      chooseImage() {
        uni.chooseImage({
          count: 1,
          success: (res) => {
            this.messages.push({
              content: res.tempFilePaths[0],
              type: "image",
              isMe: true,
              time: Date.now()
            });
            this.scrollToBottom();
          }
        });
      },
      // 拍照
      takePhoto() {
        uni.chooseImage({
          count: 1,
          sourceType: ["camera"],
          success: (res) => {
            this.messages.push({
              content: res.tempFilePaths[0],
              type: "image",
              isMe: true,
              time: Date.now()
            });
            this.scrollToBottom();
          }
        });
      },
      // 预览图片
      previewImage(url) {
        uni.previewImage({
          urls: [url]
        });
      },
      // 预览头像
      previewAvatar(url) {
        uni.previewImage({
          urls: [url],
          current: url
        });
      },
      // 显示消息菜单
      showMsgMenu(index) {
        this.selectedMsgIndex = index;
        this.showMenu = true;
        this.menuX = 100;
        this.menuY = 300;
      },
      // 隐藏菜单
      hideAllMenus() {
        this.showMenu = false;
        this.showMore = false;
      },
      // 复制消息
      copyMsg() {
        const msg = this.messages[this.selectedMsgIndex];
        uni.setClipboardData({
          data: msg.content,
          success: () => {
            uni.showToast({ title: "已复制", icon: "none" });
            this.showMenu = false;
          }
        });
      },
      // 删除消息
      deleteMsg() {
        this.messages.splice(this.selectedMsgIndex, 1);
        this.showMenu = false;
      },
      // 撤回消息
      recallMsg() {
        const msg = this.messages[this.selectedMsgIndex];
        if (Date.now() - msg.time > 12e4) {
          uni.showToast({ title: "超过2分钟无法撤回", icon: "none" });
          return;
        }
        msg.content = "已撤回";
        msg.type = "text";
        this.showMenu = false;
      },
      // 切换输入模式
      toggleInputMode() {
        this.isVoiceMode = !this.isVoiceMode;
        this.keyboardHeight = 0;
        this.calcHeight();
      },
      // 输入框聚焦
      onFocus(e) {
        this.keyboardHeight = e.detail.height || 0;
        this.showMore = false;
        this.calcHeight();
        this.scrollToBottom();
      },
      // 输入框失焦
      onBlur() {
        setTimeout(() => {
          this.keyboardHeight = 0;
          this.calcHeight();
        }, 100);
      },
      // 滚动到底部
      scrollToBottom() {
        setTimeout(() => {
          this.scrollIntoView = "msg-" + (this.messages.length - 1);
        }, 100);
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "chat-container" }, [
      vue.createElementVNode("scroll-view", {
        class: "message-list",
        "scroll-y": "",
        "scroll-into-view": $data.scrollIntoView,
        style: vue.normalizeStyle({ height: $data.scrollHeight + "px" }),
        onClick: _cache[0] || (_cache[0] = (...args) => $options.hideAllMenus && $options.hideAllMenus(...args))
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.messages, (msg, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: index,
              id: "msg-" + index,
              class: vue.normalizeClass(["message-item", msg.isMe ? "message-right" : "message-left"])
            }, [
              vue.createElementVNode("image", {
                class: "avatar",
                src: msg.isMe ? $data.myAvatar : $data.otherAvatar,
                onClick: ($event) => $options.previewAvatar(msg.isMe ? $data.myAvatar : $data.otherAvatar)
              }, null, 8, ["src", "onClick"]),
              vue.createElementVNode("view", {
                class: "message-content",
                onLongpress: ($event) => $options.showMsgMenu(index)
              }, [
                msg.type === "text" ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    key: 0,
                    class: "message-text"
                  },
                  vue.toDisplayString(msg.content),
                  1
                  /* TEXT */
                )) : msg.type === "voice" ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 1,
                  class: vue.normalizeClass(["voice-message", { playing: $data.playingIndex === index }]),
                  onClick: ($event) => $options.playVoice(msg, index)
                }, [
                  vue.createElementVNode("text", { class: "voice-icon" }, "🎵"),
                  vue.createElementVNode(
                    "text",
                    { class: "voice-duration" },
                    vue.toDisplayString(msg.duration) + "''",
                    1
                    /* TEXT */
                  ),
                  $data.playingIndex === index ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "voice-wave"
                  }, [
                    (vue.openBlock(), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList(3, (i) => {
                        return vue.createElementVNode("text", {
                          key: i,
                          class: "wave-bar"
                        });
                      }),
                      64
                      /* STABLE_FRAGMENT */
                    ))
                  ])) : vue.createCommentVNode("v-if", true)
                ], 10, ["onClick"])) : msg.type === "image" ? (vue.openBlock(), vue.createElementBlock("image", {
                  key: 2,
                  class: "message-image",
                  src: msg.content,
                  mode: "widthFix",
                  onClick: ($event) => $options.previewImage(msg.content)
                }, null, 8, ["src", "onClick"])) : vue.createCommentVNode("v-if", true)
              ], 40, ["onLongpress"]),
              msg.isMe && msg.status ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "msg-status"
              }, [
                msg.status === "sending" ? (vue.openBlock(), vue.createElementBlock("text", {
                  key: 0,
                  class: "sending"
                }, "●")) : msg.status === "failed" ? (vue.openBlock(), vue.createElementBlock("text", {
                  key: 1,
                  class: "failed"
                }, "!")) : vue.createCommentVNode("v-if", true)
              ])) : vue.createCommentVNode("v-if", true)
            ], 10, ["id"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        vue.createElementVNode("view", { style: { "height": "40rpx" } })
      ], 12, ["scroll-into-view"]),
      vue.createElementVNode(
        "view",
        {
          class: "input-area",
          style: vue.normalizeStyle({ bottom: $data.keyboardHeight + "px" })
        },
        [
          vue.createElementVNode(
            "text",
            {
              class: "tool-btn",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.toggleInputMode && $options.toggleInputMode(...args))
            },
            vue.toDisplayString($data.isVoiceMode ? "⌨️" : "🎤"),
            1
            /* TEXT */
          ),
          !$data.isVoiceMode ? vue.withDirectives((vue.openBlock(), vue.createElementBlock(
            "input",
            {
              key: 0,
              class: "message-input",
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.inputMessage = $event),
              placeholder: "请输入消息...",
              "adjust-position": false,
              onFocus: _cache[3] || (_cache[3] = (...args) => $options.onFocus && $options.onFocus(...args)),
              onBlur: _cache[4] || (_cache[4] = (...args) => $options.onBlur && $options.onBlur(...args)),
              onConfirm: _cache[5] || (_cache[5] = (...args) => $options.sendText && $options.sendText(...args))
            },
            null,
            544
            /* NEED_HYDRATION, NEED_PATCH */
          )), [
            [vue.vModelText, $data.inputMessage]
          ]) : (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 1,
              class: "voice-btn",
              onTouchstart: _cache[6] || (_cache[6] = (...args) => $options.startRecord && $options.startRecord(...args)),
              onTouchend: _cache[7] || (_cache[7] = (...args) => $options.stopRecord && $options.stopRecord(...args)),
              onTouchmove: _cache[8] || (_cache[8] = (...args) => $options.checkMove && $options.checkMove(...args))
            },
            vue.toDisplayString($data.recording ? "松开结束" : "按住说话"),
            33
            /* TEXT, NEED_HYDRATION */
          )),
          vue.createElementVNode("text", {
            class: "tool-btn",
            onClick: _cache[9] || (_cache[9] = ($event) => $data.showMore = !$data.showMore)
          }, "➕"),
          !$data.isVoiceMode && $data.inputMessage.trim() ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 2,
            class: "send-btn",
            onClick: _cache[10] || (_cache[10] = (...args) => $options.sendText && $options.sendText(...args))
          }, " 发送 ")) : vue.createCommentVNode("v-if", true)
        ],
        4
        /* STYLE */
      ),
      $data.showMore ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "more-panel"
      }, [
        vue.createElementVNode("view", {
          class: "more-item",
          onClick: _cache[11] || (_cache[11] = (...args) => $options.chooseImage && $options.chooseImage(...args))
        }, [
          vue.createElementVNode("text", { class: "more-icon" }, "📷"),
          vue.createElementVNode("text", { class: "more-text" }, "相册")
        ]),
        vue.createElementVNode("view", {
          class: "more-item",
          onClick: _cache[12] || (_cache[12] = (...args) => $options.takePhoto && $options.takePhoto(...args))
        }, [
          vue.createElementVNode("text", { class: "more-icon" }, "📸"),
          vue.createElementVNode("text", { class: "more-text" }, "拍摄")
        ])
      ])) : vue.createCommentVNode("v-if", true),
      $data.recording ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "record-modal"
      }, [
        vue.createElementVNode("view", { class: "record-box" }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["record-icon", { cancel: $data.willCancel }])
            },
            vue.toDisplayString($data.willCancel ? "✕" : "🎤"),
            3
            /* TEXT, CLASS */
          ),
          vue.createElementVNode(
            "text",
            { class: "record-text" },
            vue.toDisplayString($data.willCancel ? "松开取消" : "正在录音..."),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "view",
            { class: "record-time" },
            vue.toDisplayString($data.recordTime) + "s",
            1
            /* TEXT */
          )
        ])
      ])) : vue.createCommentVNode("v-if", true),
      $data.showMenu ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 2,
          class: "msg-menu",
          style: vue.normalizeStyle({ top: $data.menuY + "px", left: $data.menuX + "px" })
        },
        [
          vue.createElementVNode("text", {
            class: "menu-item",
            onClick: _cache[13] || (_cache[13] = (...args) => $options.copyMsg && $options.copyMsg(...args))
          }, "复制"),
          vue.createElementVNode("text", {
            class: "menu-item",
            onClick: _cache[14] || (_cache[14] = (...args) => $options.deleteMsg && $options.deleteMsg(...args))
          }, "删除"),
          vue.createElementVNode("text", {
            class: "menu-item",
            onClick: _cache[15] || (_cache[15] = (...args) => $options.recallMsg && $options.recallMsg(...args))
          }, "撤回")
        ],
        4
        /* STYLE */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesCallCall = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "E:/文创app/app/pages/call/call.vue"]]);
  const _sfc_main$3 = {};
  function _sfc_render$2(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "" }, [
        vue.createElementVNode("text", null, "今日沟通次数")
      ]),
      vue.createElementVNode("br"),
      vue.createElementVNode("view", null, [
        vue.createElementVNode("text", null, "今日沟通时长")
      ]),
      vue.createElementVNode("view", null, [
        vue.createElementVNode("text", null, "今日沟通时长")
      ])
    ]);
  }
  const PagesLogsLogs = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "E:/文创app/app/pages/logs/logs.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {
        menuItems: [
          {
            name: "蓝牙连接",
            icon: "🔷",
            iconBg: "#007AFF",
            handler: this.goBluetooth
          },
          {
            name: "WIFI连接",
            icon: "📶",
            iconBg: "#34C759",
            handler: this.goWifi
          },
          {
            name: "账号管理",
            icon: "👤",
            iconBg: "#FF9500",
            handler: this.goAccount
          },
          {
            name: "关于我们",
            icon: "ℹ️",
            iconBg: "#8E8E93",
            handler: this.goAbout
          }
        ]
      };
    },
    methods: {
      goBluetooth() {
        uni.navigateTo({
          url: "/Component/bluetooth"
        });
      },
      goWifi() {
        uni.navigateTo({
          url: "/Component/wifi"
        });
      },
      goAccount() {
        uni.navigateTo({
          url: "/Component/account"
        });
      },
      goAbout() {
        uni.navigateTo({
          url: "/Component/about"
        });
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("text", { class: "title" }, "设置"),
        vue.createElementVNode("text", { class: "subtitle" }, "设备与账号管理")
      ]),
      vue.createElementVNode("view", { class: "menu-list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.menuItems, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "menu-item",
              key: index,
              onClick: item.handler,
              "hover-class": "menu-item-hover",
              "hover-stay-time": 100
            }, [
              vue.createElementVNode(
                "view",
                {
                  class: "menu-icon",
                  style: vue.normalizeStyle({ background: item.iconBg })
                },
                [
                  vue.createElementVNode(
                    "text",
                    { class: "iconfont" },
                    vue.toDisplayString(item.icon),
                    1
                    /* TEXT */
                  )
                ],
                4
                /* STYLE */
              ),
              vue.createElementVNode(
                "text",
                { class: "menu-text" },
                vue.toDisplayString(item.name),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "menu-arrow" }, "›")
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createElementVNode("view", { class: "footer" }, [
        vue.createElementVNode("text", { class: "version" }, "Version 1.0.0")
      ])
    ]);
  }
  const PagesSettingsSettings = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "E:/文创app/app/pages/settings/settings.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        deviceList: [],
        deviceId: "",
        serviceId: "",
        characteristicId: ""
      };
    },
    methods: {
      // 初始化蓝牙
      initialBluetooth() {
        uni.openBluetoothAdapter({
          success: (res) => {
            formatAppLog("log", "at Component/bluetooth.vue:64", "初始化蓝牙成功");
            formatAppLog("log", "at Component/bluetooth.vue:65", res);
          },
          fail: (err) => {
            formatAppLog("log", "at Component/bluetooth.vue:71", "初始化蓝牙失败");
            formatAppLog("log", "at Component/bluetooth.vue:72", err);
          }
        });
      },
      // 搜索蓝牙设备
      seekDevice() {
        uni.startBluetoothDevicesDiscovery({
          allowDuplicatesKey: false,
          success: (res) => {
            formatAppLog("log", "at Component/bluetooth.vue:89", "开始搜索设备");
            formatAppLog("log", "at Component/bluetooth.vue:90", res);
            this.monitorDevice();
          },
          fail: (err) => {
            formatAppLog("log", "at Component/bluetooth.vue:98", "搜索失败");
            formatAppLog("log", "at Component/bluetooth.vue:99", err);
          }
        });
      },
      // 监听搜索到的设备
      monitorDevice() {
        uni.onBluetoothDeviceFound((res) => {
          formatAppLog("log", "at Component/bluetooth.vue:112", "发现设备");
          formatAppLog("log", "at Component/bluetooth.vue:113", res);
          res.devices.forEach((device) => {
            if (!device.name)
              return;
            let index = this.deviceList.findIndex((item) => {
              return item.deviceId == device.deviceId;
            });
            if (index == -1) {
              this.deviceList.push(device);
            }
          });
        });
      },
      // 停止搜索
      stopSeekDevice() {
        uni.stopBluetoothDevicesDiscovery({
          success: (res) => {
            formatAppLog("log", "at Component/bluetooth.vue:144", "停止搜索成功");
          }
        });
      },
      // 连接设备
      linkDevice(deviceId) {
        this.deviceId = deviceId;
        uni.createBLEConnection({
          deviceId,
          success: (res) => {
            formatAppLog("log", "at Component/bluetooth.vue:163", "连接成功");
            formatAppLog("log", "at Component/bluetooth.vue:164", res);
            uni.showToast({
              title: "连接成功"
            });
            this.getBLEService();
          },
          fail: (err) => {
            formatAppLog("log", "at Component/bluetooth.vue:177", "连接失败");
            formatAppLog("log", "at Component/bluetooth.vue:178", err);
          }
        });
      },
      // 获取服务
      getBLEService() {
        uni.getBLEDeviceServices({
          deviceId: this.deviceId,
          success: (res) => {
            formatAppLog("log", "at Component/bluetooth.vue:191", "获取服务成功");
            formatAppLog("log", "at Component/bluetooth.vue:192", res.services);
            res.services.forEach((item) => {
              formatAppLog("log", "at Component/bluetooth.vue:194", item.uuid);
              if (item.uuid.toUpperCase() == "12345678-1234-1234-1234-1234567890AB") {
                this.serviceId = item.uuid;
                formatAppLog("log", "at Component/bluetooth.vue:203", "找到目标服务");
                this.getBLECharacteristic();
              }
            });
          }
        });
      },
      // 获取特征值
      getBLECharacteristic() {
        uni.getBLEDeviceCharacteristics({
          deviceId: this.deviceId,
          serviceId: this.serviceId,
          success: (res) => {
            formatAppLog("log", "at Component/bluetooth.vue:223", "获取特征值成功");
            formatAppLog("log", "at Component/bluetooth.vue:224", res.characteristics);
            res.characteristics.forEach((item) => {
              formatAppLog("log", "at Component/bluetooth.vue:226", item.uuid);
              formatAppLog("log", "at Component/bluetooth.vue:227", item.properties);
              if (item.properties.write) {
                this.characteristicId = item.uuid;
                formatAppLog("log", "at Component/bluetooth.vue:230", "找到可写特征值");
              }
            });
          },
          fail: (err) => {
            formatAppLog("log", "at Component/bluetooth.vue:235", "获取特征值失败");
            formatAppLog("log", "at Component/bluetooth.vue:236", err);
          }
        });
      },
      // 发送数据
      sendDataDevice() {
        let data = JSON.stringify({
          ssid: "x200",
          password: "00000000"
        });
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
          success: (res) => {
            formatAppLog("log", "at Component/bluetooth.vue:274", "发送成功");
            formatAppLog("log", "at Component/bluetooth.vue:275", res);
          },
          fail: (err) => {
            formatAppLog("log", "at Component/bluetooth.vue:281", "发送失败");
            formatAppLog("log", "at Component/bluetooth.vue:282", err);
          }
        });
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("button", {
        onClick: _cache[0] || (_cache[0] = (...args) => $options.initialBluetooth && $options.initialBluetooth(...args))
      }, " 初始化蓝牙 "),
      vue.createElementVNode("button", {
        onClick: _cache[1] || (_cache[1] = (...args) => $options.seekDevice && $options.seekDevice(...args))
      }, " 搜索设备 "),
      vue.createElementVNode("button", {
        onClick: _cache[2] || (_cache[2] = (...args) => $options.stopSeekDevice && $options.stopSeekDevice(...args))
      }, " 停止搜索 "),
      vue.createElementVNode("button", {
        onClick: _cache[3] || (_cache[3] = (...args) => $options.sendDataDevice && $options.sendDataDevice(...args))
      }, " 发送数据 "),
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($data.deviceList, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("view", { key: index }, [
            vue.createElementVNode("view", { class: "deviceItem" }, [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString(item.name),
                1
                /* TEXT */
              ),
              vue.createElementVNode("button", {
                size: "mini",
                onClick: ($event) => $options.linkDevice(item.deviceId)
              }, " 连接 ", 8, ["onClick"])
            ])
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const ComponentBluetooth = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "E:/文创app/app/Component/bluetooth.vue"]]);
  __definePage("pages/cover/cover", PagesCoverCover);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/call/call", PagesCallCall);
  __definePage("pages/logs/logs", PagesLogsLogs);
  __definePage("pages/settings/settings", PagesSettingsSettings);
  __definePage("Component/bluetooth", ComponentBluetooth);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "E:/文创app/app/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
