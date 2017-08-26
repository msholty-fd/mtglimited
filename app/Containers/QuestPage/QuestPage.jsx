import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { browserHistory } from 'react-router';
import TextInput from 'grommet/components/TextInput';
import DateTime from 'grommet/components/DateTime';
import Anchor from 'grommet/components/Anchor';
import Button from 'grommet/components/Button';
import Image from 'grommet/components/Image';

@firebaseConnect(ownProps => [
  `/quests/${ownProps.params.id}`,
  '/users',
])
@connect(({ firebase }) => ({
  quest: firebase.data.quests && Immutable.fromJS(firebase.data.quests).first(),
  users: firebase.data.users && Immutable.fromJS(firebase.data.users),
}))
class QuestPage extends React.Component {
  static propTypes = {
    params: PropTypes.string,
    quest: PropTypes.shape(),
    users: PropTypes.shape(),
    firebase: PropTypes.shape(),
  };

  update = (property, value) => {
    this.props.firebase.set(`/quests/${this.props.params.id}/${property}`, value);
  }

  delete = async () => {
    await this.props.firebase.remove(`/quests/${this.props.params.id}`);
    browserHistory.push('/dashboard');
  }

  joinQuest = async (uid) => {
    await this.props.firebase.push(`/quests/${this.props.params.id}/party/`, uid);
    console.log('joined party');
  }

  leaveQuest = async (party, uid) => {
    const myKey = party.findKey(value => value === uid);
    await this.props.firebase.remove(`/quests/${this.props.params.id}/party/${myKey}`);
    console.log('left party');
  }

  render() {
    const { quest, users } = this.props;
    const uid = this.props.firebase.auth().currentUser.uid;
    if (!quest || !users) {
      return <h1>LOADING</h1>;
    }
    const party = quest.get('party', new Immutable.Map());
    const populatedParty = party.map(id => users.get(id));
    return (
      <div>
        <h2>Quest Details Page </h2>
        {!party.contains(uid) &&
          <Button
            label="Join This Quest"
            onClick={() => this.joinQuest(uid)}
            primary
          />
        }
        {party.contains(uid) &&
          <Button
            label="Leave This Quest"
            onClick={() => this.leaveQuest(party, uid)}
            primary
          />
        }
        <br />
        Date: <DateTime
          id="date"
          name="name"
          onChange={value => this.update('date', value)}
          value={quest.get('date')}
        /><br />
        Location: <TextInput
          id="location"
          value={quest.get('location')}
          onDOMChange={event => this.update('location', event.target.value)}
        /><br />
        Name: <TextInput
          id="name"
          value={quest.get('name')}
          onDOMChange={event => this.update('name', event.target.value)}
        />
        <br />
        Users in this quest: <br />
        {populatedParty.map(user => (
          <Image
            size="thumb"
            src={user.get('avatarUrl')}
            style={{ borderRadius: 12 }}
          />
        ))}
        <br />
        {uid === quest.get('user') &&
          <Anchor
            label="Delete This Quest"
            onClick={() => this.delete()}
          />
        }
      </div>
    );
  }
}

export default QuestPage;
