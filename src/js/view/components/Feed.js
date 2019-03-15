import React from 'react';
import { FeedView } from '../styled_components/Containers';
import { Input, Button } from '../styled_components/Interactions';
import { filterMatchingRows } from './helpers/feed_helper';

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filterText: '', live: false };
  }

  toggleLiveFeed = () => {
    this.setState({ live: !this.state.live });
  };

  onFilterInput = e => {
    this.setState({ filterText: e.target.value });
  };

  render() {
    const rows =
      this.props.rows &&
      filterMatchingRows(this.state.filterText, this.props.rows);

    return (
      <FeedView live={this.state.live}>
        <Button onClick={this.toggleLiveFeed} live={this.state.live}>
          Live
        </Button>
        <Input type="text" placeholder="Filter" onChange={this.onFilterInput} />
        {rows && rows.map((row, i) => <p key={i}>{row}</p>)}
      </FeedView>
    );
  }
}

export default Feed;
