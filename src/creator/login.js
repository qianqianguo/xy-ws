import * as React from "react";
import Stack from 'react-bootstrap/Stack';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Container,
  Form, InputGroup,
  FormControl,
  FormText,
  Button,
} from "react-bootstrap";
import LC from 'leancloud-storage';
import {Spin} from "antd";
import {LoadingOutlined} from '@ant-design/icons';
import login_bg from "../assert/images/login_bg.jpeg";
import {gifs} from '../assert/data/creator';
import withRouter from "../util/withRouter";
import {connect} from "react-redux";

class Login extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      gifs: gifs,
      phoneNumber: '',
      code: '',
      isGetCode: true,
      timer: 60,
      spinning: false,
      spinDecr: '',
      isToast: false,
    }
  }

  componentDidMount() {
    document.body.style.backgroundColor = '#f2f2f2';
    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      return;
    }
    const {gifs} = this.state;
    const query = new LC.Query('WsMp4');
    query.find().then((videoFiles) => {
      videoFiles.map((vf, i)=>{
        gifs[i].uri = vf.get('file').get('url');
        this.setState({gifs});
      })
    });
  }
  componentWillUnmount() {
    document.body.style.backgroundColor = '#17181B';
  }
  
  checkParams(isGetCode = false){
    const {phoneNumber, code} = this.state;
    let regex = /^((\+)?86|((\+)?86)?)0?1[3458]\d{9}$/;
    if (!regex.test(phoneNumber)) {
      this.props.enqueueSnackbar(
        '请填写正确的手机号',
        {variant: 'warning' }
      );
      return false;
    }
    if(code === '' && !isGetCode){
      this.props.enqueueSnackbar(
        '请填写验证码',
        {variant: 'warning' }
      );
      return false;
    }
    return true;
  }
  
  getPhoneCode = ()=>{
    if(!this.checkParams(true)){
      return;
    }
    const {phoneNumber, timer} = this.state;
    if (timer !== 60) {
      return;
    }
    this.setState({spinning: true, spinDecr: '正在发送...'});
    LC.User.requestLoginSmsCode('+86'+phoneNumber).then(res=>{
      this.setState({spinning: false});
      //variant could be success, error, warning, info, or default
      this.props.enqueueSnackbar(
        '验证码已发送',
        {variant: 'success' }
      );
      let time = setInterval(()=>{
        this.setState({
          timer: this.state.timer - 1
        },()=>{
          if(this.state.timer === 0) {
            clearInterval(time);
            this.setState({timer: 60});
          }
        })
      }, 1000);
    }).catch(e=>{
      let err = e.message;
      if (e?.code === 213) {
        err = '该手机号未注册，账号由平台分发，请联系客服！'
      }
      this.setState({spinning: false});
      this.props.enqueueSnackbar(
        err,
        {variant: 'error' }
      );
    })
  }
  
  signIn = ()=>{
    if(!this.checkParams()){
      return;
    }
    const {phoneNumber, code} = this.state;
    this.setState({
      spinning: true,
      spinDecr: '正在登录...'
    })
    LC.User.logInWithMobilePhoneSmsCode('+86'+phoneNumber, code)
      .then((user) => {
        // 登录成功
        this.setState({
          spinning: false,
        })
        if(!user?.get('isCreator')) {
          this.props.enqueueSnackbar(
            '你好，你还不是创作者，若有疑问，请联系客服!',
            {variant: 'warning' }
          );
          return;
        }
        setTimeout(()=>{
          this.props.enqueueSnackbar(
            '登录成功',
            {variant: 'success' }
          );
          console.log('阿贾克斯好的:',this.props.router)
          this.props.router.navigate('/create');
        }, 1000)
    }, (e) => {
      // 验证码不正确
        let err = e.message;
        if (e?.code === 603) {
          err = '验证码不正确'
        }
        this.setState({
          spinning: false,
        })
        setTimeout(()=>{
          this.props.enqueueSnackbar(
            err,
            {variant: 'error' }
          );
        }, 1000)
    });
  }
  
  renderMobile() {
    return <div style={{
      display: 'flex',
      width: '100vw',
      minHeight: '100vh',
      flexDirection: 'column',
      background: `url("${login_bg}") center center / cover no-repeat`,
    }}>
      <div>尊敬的用户，您好，为了给你更好的提供服务，此服务需在PC端使用，感谢您的支持</div>
    </div>
  }
  
  render() {
    const {timer, spinning, spinDecr} = this.state;
    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      return this.renderMobile();
    }
    return (
      <Spin
        style={{color: 'black'}}
        indicator={<LoadingOutlined />}
        spinning={spinning}
        tip={spinDecr}
        size={'large'}>
        <div style={{
          display: 'flex',
          width: '100vw',
          minHeight: '100vh',
          flexDirection: 'column',
          background: `url("${login_bg}") center center / cover no-repeat`,
        }}>
          {this.renderStack()}
          <Container
            style={{
              display: 'flex',
              flex: 1,
              minWidth: 888,
              flexDirection: 'row',
              alignItems: 'center',
              alignContent: 'center'
            }}>
            <Container
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: 500,
                width: 568,
                position: 'relative',
              }}>
              <FormText
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: 22
                }}>
                加入我们
              </FormText>
              <FormText
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: 22,
                  marginTop: 2,
                  marginBottom: 2,
                }}>
                让创作改变生活
              </FormText>
              <FormText
                style={{
                  color: '#888',
                  fontSize: 12,
                }}>
                拥抱健康、形象创作、社交达人，想你所想。
              </FormText>
              {this.state.gifs.map(gif=>{
                return (
                  <div
                    style={{
                      display: 'flex',
                      position: 'absolute',
                      width: gif.size,
                      height: gif.size,
                      top: gif.top,
                      left: gif.left,
                      borderRadius: gif.size/2,
                      overflow: 'hidden',
                    }}>
                    <video
                      style={{objectFit: 'cover'}}
                      src={gif.uri}
                      autoPlay={true}
                      loop={true}
                      muted={true}
                      height={gif.size}
                      width={gif.size}
                    />
                  </div>
                )
              })}
            </Container>
            <Container
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: 312,
                height: 368,
                backgroundColor: 'white',
                borderRadius: 22,
                padding: 36,
                boxShadow: '0px 2px 20px #aaa',
              }}>
              <FormText style={{color: 'black', fontWeight: 'bold', fontSize: 16}}>短信登录</FormText>
              <div style={{flex: 1, marginTop: 22}}>
                <Form>
                  <InputGroup className="mb-3" style={{}}>
                    <InputGroup.Text
                      id="basic-addon3"
                      style={{
                        fontSize: 12,
                        borderColor: '#eee',
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8
                      }}>
                      +86
                    </InputGroup.Text>
                    <FormControl
                      onChange={e=>{
                        this.setState({
                          phoneNumber: e.target?.value,
                        })
                      }}
                      placeholder="手机号"
                      style={{
                        fontSize: 12,
                        height: 48,
                        borderColor: '#eee',
                        borderTopRightRadius: 8,
                        borderBottomRightRadius: 8,
                      }}
                      id="basic-url"
                      aria-describedby="basic-addon3" />
                  </InputGroup>
                  <InputGroup className="mb-3" style={{alignContent: 'center', alignItems: 'center'}}>
                    <FormControl
                      onChange={e=>{
                        this.setState({
                          code: e.target?.value,
                        })
                      }}
                      placeholder="验证码"
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon2"
                      style={{
                        fontSize: 12,
                        height: 48,
                        borderColor: '#eee',
                        borderRightColor: 'transparent',
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8,
                      }}
                    />
                    <div style={{height: 20, backgroundColor: '#eee', width: 1}}/>
                    <Button
                      type={'button'}
                      disabled={false}
                      variant="contained"
                      style={{
                        height: 48,
                        fontSize: 12,
                        borderColor: '#eee',
                        borderLeftColor: 'transparent',
                        maxWidth: 77,
                        borderTopRightRadius: 8,
                        borderBottomRightRadius: 8,
                      }}
                      onClick={this.getPhoneCode}
                      id="button-addon2">
                      {timer === 60 ? '发送验证码' : (timer + '秒')}
                    </Button>
                  </InputGroup>
                </Form>
              </div>
              <Button
                onClick={this.signIn}
                variant="primary"
                style={{
                  marginBottom: 22,
                  fontSize: 15,
                  borderRadius: 6,
                  height: 42,
                  width: '100%',
                  fontWeight: 'bold',
                  // borderColor: '#121212',
                  // backgroundColor: '#121212',
                }}>登 录</Button>
            </Container>
          </Container>
          <div style={{margin: 0}}>
            <Copyright />
          </div>
        </div>
      </Spin>
    )
  }

  renderStack() {
    return (
      <Stack
        style={{
          display: 'flex',
          background: 'white',
          padding: 2,
          paddingLeft: 12,
          paddingRight: 12,
        }}
        direction="horizontal" gap={3}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            height: 50,
          }}>
          {/*<Image src={logo} style={{width: 40, height: 40, margin: 6}}/>*/}
          <FormText
            style={{
              color: '#000',
              fontFamily: 'serif',
              fontWeight: 'bold',
              fontSize: 16.8,
              marginRight: 12,
            }}>Youla</FormText>
          <FormText
            style={{
              color: '#222',
              fontFamily: '-moz-initial',
              fontWeight: 'bold',
              fontSize: 15.8
            }}>创作服务平台</FormText>
        </div>
        {/*<div className="ms-auto">*/}
        {/*  <FormText style={{color: '#666', fontSize: 15, margin: 6}}>创作助手</FormText>*/}
        {/*</div>*/}
      </Stack>
    )
  }
}

function Copyright() {
  return (
    <div>
      {/*<div*/}
      {/*  style={{*/}
      {/*    paddingTop: 12,*/}
      {/*    paddingBottom: 14,*/}
      {/*    opacity: 0.6,*/}
      {/*    fontSize: 12,*/}
      {/*    fontFamily: 'initial'*/}
      {/*  }} align="center">*/}
      {/*  <a*/}
      {/*    onClick={()=>{*/}
      {/*      const w = window.open('about:blank');*/}
      {/*      w.location.href = 'https://www.moonxt.cn/'*/}
      {/*    }}*/}
      {/*    href=""*/}
      {/*    style={{color: 'black', opacity: 0.8, textDecoration: 'none'}}>*/}
      {/*    {'  '}关于Youla*/}
      {/*  </a>*/}
      {/*</div>*/}
      <div
        style={{
          paddingBottom: 22,
          opacity: 0.6,
          fontSize: 12,
          fontFamily: 'initial'
        }} align="center">
        <a
          onClick={()=>{
            const w = window.open('about:blank');
            w.location.href = 'https://beian.miit.gov.cn/'
          }}
          style={{color: 'black', opacity: 0.8, textDecoration: 'none'}}
          href="">
          重庆月下童信息科技有限公司 {'渝ICP备2023009607号-1 Copyright © '}{new Date().getFullYear()}
        </a>
      </div>
    </div>
  );
}


const mapStateToProps = (store) => {
  return store;
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
