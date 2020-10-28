import React, { Component } from "react";
import { NavBar, Icon, InputItem, WingBlank, Modal, Toast } from "antd-mobile";

import { createForm } from "rc-form";
import { reqVerifyPhone } from "@api/regist";

import VerifyButton from "@comps/VerifyButton";

import "./index.css";

// web 端接入文档  https://cloud.tencent.com/document/product/1110/36841#.E5.AE.9E.E4.BE.8B.E6.96.B9.E6.B3.95
// const verifyBtnProps = {
//   id: "TencentCaptcha",
//   "data-appid": "2030765311",
//   "data-cbfn": "verifyCallback",
// };

class VerifyPhone extends Component {
  // 初始化状态
  state = {
    isDisabled: true,
  };
  // 页面渲染之前
  componentDidMount() {
    Modal.alert(
      "注册协议及隐私政策",
      <span className="policy-text">
        在您注册成为硅谷用户的过程中，您需要完成我们的注册流程并通过点击同意的形式在线签署以下协议，
        <strong className="policy-strong-text">
          请您务必仔细阅读、充分理解协议中的条款内容后再点击同意（尤其是以粗体并下划线标识的条款，因为这些条款可能会明确您应履行的义务或对您的权利有所限制）
        </strong>
        ：<span className="policy-content">《硅谷用户注册协议》</span>
        <span className="policy-content">《硅谷隐私政策》</span>
      </span>,
      [
        {
          text: "不同意",
          onPress: () => console.log("cancel"),
        },
        {
          text: "同意",
          style: { backgroundColor: "red", color: "#fff" },
        },
      ]
    );
    /*    window.verifyCallback = async (res) => {
      if (res.ret === 0) {
        // 验证成功，客户端验证成功，还需要进行二次验证，服务端验证
        await reqVerifyCode(res.randstr, res.ticket);
        // 服务端验证通过  --- 验证手机号码
        await this.verifyPhone();
      }
    }; */
  }

  // 当用户输入数据时就会触发
  validator = (rule, value, callback) => {
    const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57]|199)[0-9]{8}$/;

    let isDisabled = true;

    if (reg.test(value)) {
      isDisabled = false;
    }
    this.setState({
      isDisabled,
    });
    // callback 必须调用，否则检测失败
    // callback （message） 校验失败
    // callback () 校验成功
    callback();
  };

  verifyPhone = async () => {
    try {
      
      // 获取单个表单项的值
      const phone = this.props.form.getFieldValue("phone");
      // 获取所有表单项的值
      await reqVerifyPhone(phone);

      // 请求成功。 --手机号不存在
      // 提示弹框 --确认请求短信验证码
    } catch (e) {
      // 请求失败
      Toast.fail(e, 3);
    }
  };

  render() {
    const { isDisabled } = this.state;
    const { getFieldProps } = this.props.form;
    return (
      <div>
        {/* 导航栏 */}
        <NavBar
          mode="light"
          icon={<Icon className="left" type="left" />}
          onLeftClick={() => console.log("onLeftClick")}
        >
          硅谷注册
        </NavBar>
        {/* 两翼留白 */}
        <WingBlank>
          <div className="verify-phone-input">
            <InputItem
              {...getFieldProps("phone", {
                // 表单验证
                rules: [{ validator: this.validator }],
              })}
              clear
              placeholder="请输入手机号码"
            >
              <div className="verify-phone-prefix">
                <span>+86</span>
                <Icon type="down" />
              </div>
            </InputItem>
          </div>
          <VerifyButton
            disabled={isDisabled}
            callback={this.verifyPhone}
            btnText="下一步"
          />
        </WingBlank>
      </div>
    );
  }
}
// createForm 是高阶组件： 给VerifyPhone 传递操作表单from 对象
export default createForm()(VerifyPhone);
