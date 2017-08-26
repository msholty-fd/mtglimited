import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { firebaseConnect } from 'react-redux-firebase';
import { fromJS } from 'immutable';

import Heading from 'grommet/components/Heading';
import Box from 'grommet/components/Box';
import List from 'grommet/components/List';
import Value from 'grommet/components/Value';
import Image from 'grommet/components/Image';
import ListItem from 'grommet/components/ListItem';

@firebaseConnect(() => [
  '/users',
  '/experience',
])
@connect(state => ({
  users: state.firebase.data.users && fromJS(state.firebase.data.users),
  experience: state.firebase.data.experience && fromJS(state.firebase.data.experience),
}))
export default class Leaderboard extends React.Component {
  static propTypes = {
    users: PropTypes.shape(),
    experience: PropTypes.shape(),
  };


  render() {
    const { users, experience } = this.props;
    if (users && experience) {
      const userScores = [];
      users.forEach((userValue, userKey) => {
        let scoreTotal = 0;
        experience.forEach((experienceValue) => {
          if (userKey === experienceValue.get('user')) {
            scoreTotal += experienceValue.get('score');
          }
        });
        userScores.push({
          userKey,
          avatar: userValue.get('avatarUrl'),
          name: userValue.get('displayName'),
          score: scoreTotal,
        });
      });

      userScores.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

      return (
        <div>
          <Heading
            strong
            uppercase={false}
            truncate={false}
            align="center"
          >
              Leaderboard
          </Heading>
          <List>
            {userScores.map(user => (
              <ListItem>
                <Box
                  direction="row"
                  justify="start"
                  align="center"
                  wrap="true"
                >
                  <Image
                    size="thumb"
                    src={user.avatar}
                    style={{ borderRadius: 12 }}
                  />
                </Box>
                <Box
                  direction="row"
                  justify="start"
                  flex="grow"
                  align="center"
                  wrap="true"
                >
                  <Value value={user.name} />
                </Box>
                <Box
                  direction="row"
                  justify="end"
                  align="center"
                  wrap="true"
                >
                  <Value
                    value={user.score}
                    colorIndex="accent-1"
                  />
                </Box>
              </ListItem>
                ))}
          </List>
        </div>
      );
    }
    return <h2>Loading...</h2>;
  }
}
