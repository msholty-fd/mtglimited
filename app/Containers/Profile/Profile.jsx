import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { fromJS } from 'immutable';

import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import AnnotatedMeter from 'grommet-addons/components/AnnotatedMeter';

@firebaseConnect()
@connect(({ firebase: { auth } }) => ({ auth }))
export default class Authentication extends React.Component {
  static propTypes = {
    auth: PropTypes.shape(),
    firebase: PropTypes.shape(),
  };

  componentDidMount() {
    const { auth, firebase } = this.props;
    firebase.auth().fetchProvidersForEmail(auth.email).then((providers) => {
      this.setState({
        providers,
      });
    });
  }

  connectProvider = async (providerId) => {
    const { firebase } = this.props;
    const providerMap = {
      'google.com': firebase.auth.GoogleAuthProvider,
      'facebook.com': firebase.auth.FacebookAuthProvider,
    };

    const ProviderObject = providerMap[providerId];
    const provider = new ProviderObject();

    await firebase.auth().currentUser.linkWithPopup(provider);
    this.forceUpdate();
  }

  disconnectProvider = async (providerId) => {
    await this.props.firebase.auth().currentUser.unlink(providerId);
    this.forceUpdate();
  }

  render() {
    const { auth } = this.props;
    const providerData = fromJS(auth.providerData);
    const googleProvider = providerData.find(data => data.get('providerId') === 'google.com');
    const facebookProvider = providerData.find(data => data.get('providerId') === 'facebook.com');
    return (
      <div>
        <Box style={{ margin: 15 }}>
          <h1>{auth.displayName}</h1>
          {!googleProvider &&
            <Button
              primary
              label="Connect my account to Google"
              onClick={() => this.connectProvider('google.com')}
            />
          }
          {googleProvider &&
            <Button
              primary
              label="Disconnect my account to Google"
              onClick={() => this.disconnectProvider('google.com')}
            />
          }
          <br />
          {!facebookProvider &&
            <Button
              primary
              label="Connect my account to Facebook"
              onClick={() => this.connectProvider('facebook.com')}
            />
          }
          {facebookProvider &&
            <Button
              primary
              label="Disconnect my account to Facebook"
              onClick={() => this.disconnectProvider('facebook.com')}
            />
          }
        </Box>
        <Box
          align="end"
        >
          <AnnotatedMeter
            legend
            type="circle"
            size="medium"
            max={50}
            series={[{ label: 'Completed', value: 20, colorIndex: 'graph-1' }, { label: 'Remaining', value: 30, colorIndex: 'graph-2' }]}
          />
        </Box>
      </div>
    );
  }
}
