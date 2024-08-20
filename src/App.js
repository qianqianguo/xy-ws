import React from 'react';
import PropTypes from 'prop-types';
import {Image} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faRunning,
  faHatCowboySide,
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  Icon,
  AppBar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CssBaseline,
  Grid,
  Toolbar,
  Typography,
  Link,
  Container,
  Box,Slide,
  useScrollTrigger,
} from "@material-ui/core";
import makeStyles from '@material-ui/core/styles/makeStyles';
import banner from "./assert/images/banner.jpg";
import yxy from "./assert/images/Youla.png";
import logo_512 from "./assert/images/logo_512.png";
import la from "./assert/images/love.png";
import company from "./assert/images/company.png";
import companyBg from "./assert/images/bg_un.jpg";
import customer from "./assert/images/customer.PNG";
import police from "./assert/images/beian.png";
import {useNavigate} from "react-router-dom";
import {connect} from 'react-redux';

function Copyright() {
  // function Police() {
  //   return <div dangerouslySetInnerHTML={{__html: '<div style="margin:0 auto; padding:12px 0;">\n' +
  //       '        <a href="https://beian.mps.gov.cn/#/query/webSearch?code=50010902502524" rel=\\"noreferrer\\" target=\\"_blank\\" style="color: white; opacity: 0.6">渝公网安备50010902502524</a>\n' +
  //       '      </div>'}}/>;
  // }
  return (
    <Box mt={10} style={{borderTop: `1px solid #3C3E42`,}}>
      <Typography style={{opacity: 0.6, fontSize: 12, fontWeight: 'Regular', fontFamily: 'Serif', marginTop: 22}} align="center">版权所有 © 重庆月下童信息科技有限公司
      </Typography>
      <Typography style={{marginTop: 6, fontSize: 12, fontWeight: 'Regular', fontFamily: 'Serif'}} align="center">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div  style={{opacity: 0.6,}}>
            备案号/许可编号：
            <Link
              onClick={()=>{
                const w = window.open('about:blank');
                w.location.href = 'https://beian.miit.gov.cn/'
              }}
              color="inherit">
              {'  '}渝ICP备2023009607号-1
            </Link>
            <Link
              style={{marginRight: 12, marginLeft: 12}}
              onClick={()=>{
                const w = window.open('about:blank');
                w.location.href = 'https://dxzhgl.miit.gov.cn/'
              }}
              color="inherit">
              渝B2-20230538
            </Link>
          </div>
          {/*<Police/>*/}
        </div>
      </Typography>
      <Typography style={{marginTop: 6, fontSize: 12, fontWeight: 'Regular', fontFamily: 'Serif'}} align="center">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Image
            src={police}
            style={{
              float: 'right',
              marginRight: 8,
              width: 16,
              height: 16,
            }}
            preview={false}
          />
          <Link
            style={{marginRight: 12, opacity: 0.6,}}
            onClick={()=>{
              const w = window.open('about:blank');
              w.location.href = 'https://beian.mps.gov.cn/#/query/webSearch?code=50010902502524'
            }}
            color="inherit">
            渝公网安备50010902502524
          </Link>
        </div>
      </Typography>
      <Typography style={{marginTop: 6, opacity: 0.6, fontSize: 10, fontWeight: 'Regular', fontFamily: 'Serif'}} align="center">
        {'copyright '}
        www.moonxt.cn. 2023 All rights reserved.
      </Typography>
    </Box>
  );
}

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    backgroundColor: '#080809',
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
    color: '#FAD2A7'
  },
  link: {
    margin: theme.spacing(1, 1.5),
    color: '#FAD2A7',
    fontSize: 12,
  },
  header: {
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : '#2A2E39',
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginTop: theme.spacing(4),
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(3),
    },
  },
  root: {
    flexGrow: 1,
  },
  control: {
    padding: theme.spacing(2),
  },
}));
const tiers = [
  {
    title: '形象',
    price: '0',
    description: [
      '形象有多重要？',
      `俗话说，你的能力藏在你的“颜值”里，`,
      '不是说你要长得多好看，',
      '而是你要有管理形象的姿态。'],
    buttonText: '我们分享提升形象的诸多方法',
    img: faHatCowboySide,
  },
  {
    title: '健康',
    subheader: '健康是拥有美好生活的入场券',
    price: '15',
    description: [
      '健康多重要？',
      '健康事业，是人人需要的事业，自己足',
      '够健康，才能把健康幸福带给身边',
      '的人，健康是拥有一切的美好基础。',
    ],
    buttonText: '我们分享更多获取健康的信息',
    img: faRunning,
  },
  {
    title: '情感',
    price: '30',
    description: [
      '树立正确情感价值观？',
      '平等、独立、自信，然而不管是怎样，',
      '有能力爱自己，才有余力爱别人，',
      '让自己变得更好，担负应有的责任。',
    ],
    buttonText: '我们为你提供更多情感交流机会',
    img: la,
  },
];
const navs = [
  {
    title: '首页',
    anchorName: 'home',
  },
  {
    title: '创作者服务',
    anchorName: 'creator',
  },
  {
    title: '关于我们',
    anchorName: 'about',
  },
  {
    title: '联系我们',
    anchorName: 'contact',
  },
  {
    title: 'app下载',
    anchorName: 'download',
  },
  // {
  //   title: '用户协议',
  //   anchorName: 'agreement',
  // },
  // {
  //   title: '隐私政策',
  //   anchorName: 'privacy',
  // },
];
const footers = [
  {
    title: '联系我们',
    description: ['邮箱：contact@moonxt.cn', '客服微信：'],
  },
  {
    title: '加入我们',
    description: ['邮箱：hr@moonxt.cn'],
  },
  {
    title: 'Company',
    description: ['Team', 'History', 'Contact us', 'Locations'],
  },
];

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

function scrollToAnchor(anchorName){
  if (anchorName) {
    let anchorElement = document.getElementById(anchorName);
    if (anchorElement) {
      try {
        // chrome 61开始才兼容scrollIntoView(scrollIntoViewOption:object)的写法
        anchorElement.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (e) {
        // 低版本chrome(<61)
        anchorElement.scrollIntoView();
      }
    }
  }
}

function App(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar  color="default" elevation={0} className={classes.appBar}>
          <Toolbar variant="dense" className={classes.toolbar}>
            <Typography style={{fontFamily: 'Serif', fontSize: 16}} color="inherit" noWrap className={classes.toolbarTitle}>
              <Image src={logo_512} preview={false} width={22} height={22}/> Youla
            </Typography>
            <nav style={{display: 'flex'}}>
              {navs.map((item, i)=>{
                return (
                  <Link
                    onClick={()=>{
                      if(i === 1){
                        navigate({
                          pathname: '/creator',
                          state: { target: '_blank' },
                        });
                        return;
                      }
                      // if (i === 4) {
                      //   navigate({
                      //     pathname: '/user-agreement',
                      //     state: { target: '_blank' },
                      //   });
                      //   return;
                      // }
                      if (i === 5) {
                        navigate({
                          pathname: '/privacy-policy',
                          state: { target: '_blank' },
                        });
                        return;
                      }
                      scrollToAnchor(item.anchorName);
                    }}
                    style={{fontFamily: 'Serif', display: 'flex'}}
                    variant="button"
                    color="textPrimary"
                    className={classes.link}>
                    {item.title}
                  </Link>
                )
              })}
            </nav>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar variant="dense"/>
      {/* Hero unit */}
      <a id="home"/>
      <div>
        <Image src={banner} preview={false}/>
      </div>
      <Container maxWidth="md" component="main" className={classes.heroContent}>
        <Grid container
              direction="row"
              justifyContent="space-around"
              alignItems="flex-start">
          {[0, 1].map((value, i) => (
            <Grid key={value} item style={{marginTop: 12, marginBottom: 12}}>
              {i === 0 ? <div
                style={{
                  width: 125,
                  height: 125,
                  background: `url("${yxy}") center center / contain no-repeat`
                }}/> : <div
                style={{
                  padding: 22,
                  paddingTop: 0,
                  maxWidth: 368,
                  fontSize: 11,
                  textAlign: 'justify',
                  fontWeight: 'Regular',
                  fontFamily: 'Serif',
                }}>
                Youla app是一款专为年轻人提升自己，树立良好的情感观念以及生活习惯的信息服务平台，同时提供亿万级用户资源，帮助用户可以找到有共鸣的异性朋友，自由发展，主要集中面向中国亿万单身青年一代，
                努力打造形象、健康、情感集一体的新型社交模式，提供用户个人身体形象气质提升、素质提升、
                正确情感交友价值观等多方面信息服务，我们秉承先爱自己，有余力爱别人的理念，为有共同爱好、梦想的人提供相识、相知的网络环境，成就最好的自己， 从而形成一个健康、良好的情感社交模式以及优质的生活习惯，
                重塑中华人民中青年身体素质观念、形成优质良好的健康生活习惯以及树立正确的情感价值观。
              </div>}
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid
          container
          direction="row"
          alignItems="flex-start"
          justifyContent={'space-around'}>
          {tiers.map((tier, i) => (
            // Enterprise card is full width at sm breakpoint
            <Grid
              style={{marginTop: 12, marginBottom: 12}}
              item
              key={tier.title}>
              <Card>
                <div className={classes.cardPricing}>
                  {i === 2 ? <Image
                    src={tier.img}
                    style={{
                      width: 46,
                      height: 46,
                      margin: 6,
                    }}
                    preview={false}
                  /> : <FontAwesomeIcon style={{
                    width: 52,
                    height: 52,
                    color: '#E4BE94'
                  }} icon={tier.img} />}
                </div>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{
                    align: 'center',
                    style: {
                      fontWeight: 'Bold',
                      fontFamily: 'serif',
                      color: '#FAD2A7',
                    }}}
                  subheaderTypographyProps={{align: 'center',
                    style: {backgroundColor: '#FAD2A7',
                      color: '#2A2E39',
                      fontFamily: 'serif',
                      fontWeight: 'Bold',
                      fontSize: 12,
                      borderRadius: 20,
                      marginTop: 12,
                      paddingTop: 5,
                      paddingBottom: 5,
                  }}}
                  action={null}
                  className={classes.cardHeader}
                />
                <CardContent>
                  <ul>
                    {tier.description.map((line) => (
                      <Typography
                        style={{fontFamily: 'Serif', fontSize: 12, minHeight: 25}}
                        component="li"
                        variant="subtitle1"
                        align="center"
                        key={line}>
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                  <div style={{textAlign: 'center', flex: 1, marginBottom: 25, marginTop: 12}}>
                    <text style={{fontSize: 12, color: '#FAD2A7', fontFamily: 'Serif'}}>
                      {tier.buttonText}
                    </text>
                  </div>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* about */}
      <a id="about"/>
      <div style={{
        marginTop: 88,
        background: `url("${companyBg}") center center / cover no-repeat`,
        paddingTop: 58,
        paddingBottom: 58,
      }}>
        <Typography style={{
          textAlign: 'center',
          fontWeight: 'Regular',
          fontFamily: 'Microsoft YaHe',
          marginBottom: 38,
          color: 'white'
        }} variant="h6" component="h1" gutterBottom>
          关于我们
        </Typography>
        <Container maxWidth="md" component="main">
          <Grid
            container
            direction={'row'}
            alignItems={'flex-start'}
            justifyContent="center">
            {[0, 1].map((value, i) => (
              <Grid key={value} item style={{marginTop: 12, marginBottom: 12}}>
                {i === 0 ? <div
                    style={{
                      minWidth: 288,
                      minHeight: 328,
                      borderBottomLeftRadius: 8,
                      borderTopLeftRadius: 8,
                      background: `url("${company}") center center / contain no-repeat`
                    }}/> :
                  <div
                    className={classes.cardHeader}
                    style={{
                      maxWidth: 425,
                      textAlign: 'justify',
                      paddingLeft: 38,
                      paddingRight: 38,
                      paddingTop: 25,
                      paddingBottom: 25,
                      borderBottomRightRadius: 8,
                      borderTopRightRadius: 8,
                    }}>
                    <Typography style={{
                      fontFamily: 'Serif',
                      fontWeight: 'Regular',
                      marginBottom: 25,
                      fontSize: 20}} variant="h5" color={'#333333'} component="h1">
                      公司简介
                    </Typography>
                    <Typography style={{
                      fontFamily: 'Serif',
                      fontWeight: 'Regular',
                      fontSize: 12}}  variant="h5" color={'#333333'} component="h1" gutterBottom>
                      {'重庆月下童信息科技有限公司成立于2023年08月11日，致力于为年轻单身用户提升自己，提供亿万级用户资源的社交信息服务，' +
                      '打造形象、健康、情感集一体的新型社交模式，提供用户个人身体素质提升、形象气质提升、正确情感价值观等多方面信息服务，' +
                      '以此推动行业的发展和变革，为中国亿万的青年用户提供生活交友方式的多样化。' +
                      '从而形成一个健康、良好的情感社交模式以及优质的生活习惯。' +
                      '重塑中华人民中青年身体素质观念、形成优质良好的健康生活习惯以及树立正确的情感价值观。'}
                    </Typography>
                  </div>
                }
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>


      {/* Footer */}
      <a id="contact"/>
      <a id="download"/>
      <Container style={{marginTop: 0}} component="footer" className={classes.footer}>
        <Grid
          container
          direction={'row'}
          alignItems={'flex-start'}
          justifyContent="space-between">
          {footers.map((footer) => {
            return (
            <Grid
              item
              style={{marginTop: 22, marginBottom: 22}}
              key={footer.title}>
              {footer.title === "Company" ? null : <Typography style={{fontSize: 16, fontWeight: 'Regular', fontFamily: 'Serif', color: '#FAD2A7'}} variant="h5" gutterBottom>
                {footer.title}
              </Typography>}
              {footer.title === "Company" ? <div>
                <div style={{float: 'left',}}>
                  <div style={{backgroundColor: '#121212', textAlign: 'center', padding: 12, width: 88, height: 88, borderRadius: 2}}>
                    <Typography style={{fontSize: 8, fontFamily: 'serif'}}>开发中，敬请期待</Typography>
                  </div>
                  <div style={{fontWeight: 'Regular', width: 88, textAlign: 'center', fontFamily: 'serif', fontSize: 10, marginTop: 16}}>
                    扫码下载App
                  </div>
                </div>
                <Button
                  style={{marginTop: 2, marginBottom: 12, fontWeight: 'Regular', fontSize: 10, fontFamily: 'Serif', borderRadius: 2, marginLeft: 12, backgroundColor: '#FAD2A7'}}
                  variant="contained"
                  size={'small'}
                  startIcon={<Icon>android</Icon>}
                >
                  android下载
                </Button>
                <Button
                  style={{borderRadius: 2, fontWeight: 'Regular', fontSize: 10, fontFamily: 'Serif', marginTop: 2, marginBottom: 12, marginLeft: 12, backgroundColor: '#FAD2A7'}}
                  variant="contained"
                  size={'small'}
                  startIcon={<Icon>apple</Icon>}
                >
                  ios下载
                </Button>
              </div> : (
                  <div>
                    <ul>
                      {footer.description.map((item) => (
                        <li key={item}>
                          <Link style={{fontWeight: 'Regular', fontSize: 12, fontFamily: 'Serif'}} variant="subtitle1" color="textSecondary">
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {footer.title === "联系我们" ? <div style={{marginTop: 12, width: 88, height: 88, borderRadius: 2}}>
                      <Image src={customer} preview={false}/>
                    </div> : null}
                  </div>
                )}
            </Grid>
            )})}
        </Grid>
        <Copyright />
      </Container>
      {/* End footer */}
    </React.Fragment>
  );
}

//添加store中的state
const mapStateToProps = (store) => {
  return store;
};
//添加dispatch方法
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(App)
//react 腾讯云部署 cloudbase framework deploy -r gz -e docs-0ggu5ux357518ea5,
//有时候会出现部署错误，需要删除package-lock文件，npm install 还有可能需要yarn start --reset-cache
