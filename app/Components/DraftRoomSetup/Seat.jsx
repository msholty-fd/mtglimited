import React from 'react';
import PropTypes from 'prop-types';

import Box from 'grommet/components/Box';
import Tile from 'grommet/components/Tile';
import Button from 'grommet/components/Button';
import Image from 'grommet/components/Image';
import Heading from 'grommet/components/Heading';

const Seat = ({ index, joinDraft, seatOwner }) => {
  const owner = seatOwner;
  return (
    <Tile
      key={index}
      basis="1/3"
    >
      <Heading tag="h3">{`Seat ${index + 1}`}</Heading>

      {owner &&
        <Box
          direction="row"
          pad={{ between: 'small' }}
          responsive={false}
        >
          <Image
            size="thumb"
            src={owner.get('avatarUrl')}
            style={{ borderRadius: 12 }}
          />
          {owner &&
            <Heading
              flex
              tag="h4"
              margin="small"
            >
              {owner.get('displayName')}
            </Heading>
          }
        </Box>
      }
      {!owner &&
        <Button
          onClick={() => joinDraft(index)}
          label="Join"
        />
      }
    </Tile>
  );
};

Seat.propTypes = {
  index: PropTypes.number.isRequired,
  seatOwner: PropTypes.shape(),
  joinDraft: PropTypes.func.isRequired,
};

export default Seat;
