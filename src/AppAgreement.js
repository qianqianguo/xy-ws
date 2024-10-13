import React from "react";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import PrivacyPolicy from "./component/PrivacyPolicy";
import UserAgreement from "./component/UserAgreement";
import {vip_agreement} from "./assert/data/agreement/vip-agreement";

export default function AppAgreement(props) {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md" component="main">
        <Grid container
              direction="row"
              justifyContent="center"
              alignItems="center">
          <Typography
            style={{
              fontSize: 17,
              fontWeight: 'Regular',
              fontFamily: 'Serif',
              marginBottom: 22,
            }}
            variant={'h6'}
            color={'inherit'}>
            {props?.title ?? ''}
          </Typography>
          {props?.agreementType === 'vip_agreement' ?
            <div
              variant={'body2'}
              style={{
                lineHeight: 1.6,
                textAlign: 'justify',
                whiteSpace: 'pre-line',
                fontWeight: '500',
                fontFamily: 'Serif'
              }}>{vip_agreement}</div> :
            props?.agreementType === 'privacy_policy' ?
            <PrivacyPolicy /> : <UserAgreement />}
        </Grid>
      </Container>
    </React.Fragment>
  )
}
