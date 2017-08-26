import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { browserHistory } from 'react-router';
import Button from 'grommet/components/Button';
import Tile from 'grommet/components/Tile';
import Card from 'grommet/components/Card';
import Tiles from 'grommet/components/Tiles';
import Header from 'grommet/components/Header';
import Box from 'grommet/components/Box';
import Search from 'grommet/components/Search';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Article from 'grommet/components/Article';
import Spinning from 'grommet/components/icons/Spinning';


const style = {
  aligner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
};

@firebaseConnect(() => [
  '/quests',
])
@connect(({ firebase }) => ({
  quests: firebase.data.quests && fromJS(firebase.data.quests),
}))
class Dashboard extends React.Component {
  static propTypes = {
    quests: PropTypes.shape(),
    firebase: PropTypes.shape(),
  };

  createQuest = async () => {
    const questRef = await this.props.firebase.push('/quests', {
      user: this.props.firebase.auth().currentUser.uid,
    });
    browserHistory.push(`/quests/${questRef.key}`);
  }

  render() {
    const { quests, firebase } = this.props;
    const { auth } = firebase;
    if (!quests) {
      return (
        <div
          style={style.aligner}
        >
          <div>
            <Spinning
              size="xlarge"
            />
          </div>
        </div>
      );
    }
    const createdQuests = quests.filter(quest =>
      quest.get('user') === auth().currentUser.uid);

    const acceptedQuests = quests.filter(quest =>
      quest.get('party') && quest.get('party').includes(auth().currentUser.uid));

    return (
      <Article>
        <Header>
          <h2>Quests</h2>
          <Box
            flex
            justify="end"
            direction="row"
            responsive={false}
            margin={{
              bottom: 'small',
            }}
          >
            <Search
              inline
              fill
              size="medium"
              placeHolder="Search"
              dropAlign={{ right: 'right' }}
            />
            <Button
              primary
              onClick={() => this.createQuest()}
              label="Create Quest"
            />
          </Box>
        </Header>
        <Tabs
          justify="start"
        >
          <Tab
            title="All"
          >
            <div>
              <Tiles>
                {quests.count() === 0 &&
                  <p>You have no quests. Create one now.</p>
                }
                {quests.map((quest, id) => (
                  <Tile>
                    <Card
                      key={id} // eslint-disable-line
                      thumbnail={quest.get('thumbnail')}
                      label={quest.get('name')}
                      onClick={() => browserHistory.push(`/quests/${id}`)}
                    />
                  </Tile>
                )).valueSeq()}
              </Tiles>
            </div>
          </Tab>
          <Tab
            title="Created"
          >
            <div>
              <Tiles>
                {createdQuests.count() === 0 &&
                  <p>You have no quests. Create one now.</p>
                }
                {createdQuests.map((quest, id) => (
                  <Tile>
                    <Card
                      key={id} // eslint-disable-line
                      thumbnail={quest.get('thumbnail')}
                      label={quest.get('name')}
                      onClick={() => browserHistory.push(`/quests/${id}`)}
                    />
                  </Tile>
                )).valueSeq()}
              </Tiles>
            </div>
          </Tab>
          <Tab
            title="Accepted"
          >
            <div>
              <Tiles>
                {acceptedQuests.count() === 0 &&
                  <p>You have no quests. Create one now.</p>
                }
                {acceptedQuests.map((quest, id) => (
                  <Tile>
                    <Card
                      key={id} // eslint-disable-line
                      thumbnail={quest.get('thumbnail')}
                      label={quest.get('name')}
                      onClick={() => browserHistory.push(`/quests/${id}`)}
                    />
                  </Tile>
                )).valueSeq()}
              </Tiles>
            </div>
          </Tab>
        </Tabs>
      </Article>
    );
  }
}

export default Dashboard;
