import React from 'react';
import ReactDOM from 'react-dom';
import AppAgreement from './AppAgreement';
import reportWebVitals from './reportWebVitals';
import {createTheme, ThemeProvider} from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    type: 'dark',
    background: {
      paper: '#2A2E39',
      default: '#17181B',
    },
  },
});
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <AppAgreement />
    </React.StrictMode>
  </ThemeProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
