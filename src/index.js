import React from 'react';
import ReactDOM from 'react-dom';
import 'react-zmage/lib/zmage.css';
import reportWebVitals from './reportWebVitals';
import {createTheme, ThemeProvider} from "@material-ui/core/styles";
import LC from 'leancloud-storage';
import {AliveScope} from 'react-activation';
import {HashRouter} from 'react-router-dom';
import {SnackbarProvider} from 'notistack';
import RootRoute from "./config/routes";
import {Provider} from 'react-redux';
import store from './redux/store'

//BrowserRouter可以用，但是需要配合配置服务器, HashRouter可以不用配置服务器
const theme = createTheme({
  palette: {
    type: 'dark',
    background: {
      paper: '#2A2E39',
      default: '#17181B',
    },
  },
});

LC.init({
  appId: "59KKxFhgwrf3S3UirLndVQ5D-gzGzoHsz",
  appKey: "1DBEcEV3KfRQsDNrtzHCyGtJ",
  serverURL: "https://api.moonxt.cn",
});
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <SnackbarProvider//webapp通知提示全局配置
        maxSnack={3}
        autoHideDuration={5000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <HashRouter>
          <AliveScope>
            <RootRoute/>
          </AliveScope>
        </HashRouter>
      </SnackbarProvider>
    </Provider>
  </ThemeProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
