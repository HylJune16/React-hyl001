import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Toast } from "antd-mobile";
import { reqVerifyCode } from "@api/common";

// 滑块验证组件
export default class VerifyButton extends Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    callback: PropTypes.func.isRequired,
    btnText: PropTypes.string.isRequired,
  };

  componentDidMount() {
    window.verifyCallback = async (res) => {
      if (res.ret === 0) {
        try {
          // 服务端验证
          await reqVerifyCode(res.randstr, res.ticket);
          // 做其他事情
          this.props.callback();
        } catch (e) {
          Toast.fail(e, 3);
        }
      }
    };
  }
  render() {
    const { disabled, btnText } = this.props;

    return (
      <>
        <Button
          style={{ display: disabled ? "block" : "none" }}
          className="warning-btn"
          type="warning"
          disabled
        >
          {btnText}
        </Button>
        <Button
          style={{ display: !disabled ? "block" : "none" }}
          id="TencentCaptcha"
          data-appid="2030765311"
          data-cbfn="verifyCallback"
          className="warning-btn"
          type="warning"
        >
          {btnText}
        </Button>
      </>
    );
  }
}
