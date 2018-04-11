import React from 'react';
import PropTypes from 'prop-types';
import { Search } from 'semantic-ui-react';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';


class ProfileSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
    this.handleResultSelect = this.handleResultSelect.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.searchDelay = false;
  }

  handleResultSelect(e, { result }) {
    const newPath = `/profile/${result.id}`;
    if (newPath !== this.context.router.route.location.pathname) {
      this.context.router.history.push(newPath);
    }
    this.setState({ value: '', skip: true });
  }

  handleSearchChange(e, { value }) {
    this.setState({ value, skip: true });
    if (this.searchDelay) {
      clearTimeout(this.searchDelay);
    }
    this.searchDelay = setTimeout(() => {
      this.setState({ skip: false });
      this.searchDelay = false;
    }, 200);
  }

  render() {
    return (
      <Query
        query={gql`
          query profileSearchQuery($name: String!) {
            profiles(name: $name) {
              gcID
              name
              avatar
            }
          }`}
        skip={this.state.skip || !this.state.value}
        variables={{ name: this.state.value }}
      >
        {({
          loading,
          data,
        }) => {
          const { value } = this.state;
          const results = (data.profiles) ? data.profiles.map(a =>
            ({
              title: a.name,
              description: a.titleEn,
              image: a.avatar,
              id: a.gcID,
            })) : [];

          return (
            <Search
              loading={loading && !(!value)}
              onResultSelect={this.handleResultSelect}
              onSearchChange={this.handleSearchChange}
              results={results}
              value={value}
              noResultsMessage={__('No results found.')}
              {...this.props}
              // resultRenderer={item => (
              //   <div key={`search_result_${item.description.gcID}`}>
              //     {item.name}
              //   </div>
              // )}
            />
          );
        }}
      </Query>
    );
  }
}

ProfileSearch.contextTypes = {
  router: PropTypes.object,
};

export default LocalizedComponent(ProfileSearch);