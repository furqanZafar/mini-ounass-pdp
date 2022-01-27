// -- react, redux --
import React from 'react';
import { hydrate } from 'react-dom';
import {
  applyMiddleware,
  bindActionCreators,
  createStore,
  compose,
} from 'redux';
import {
  Provider,
  connect,
} from 'react-redux';
import thunk from 'redux-thunk';

// -- actions --
import pdpActions from './actions';

import './pdp.less';

class PDP extends React.PureComponent {
  render() {
    const {
      pdp: {
        addingItem,
      },

      pdpActions: _pdpActions,
    } = this.props;

    return (
      <div>
        <button
          onClick={() => {
            _pdpActions.addItem('sku1');
          }}
          type="button"
          disabled={addingItem}
        >
          ADD TO BAG
        </button>
      </div>
    );
  }
}

const mapStateToProps = ({
  pdp,
}) => ({
  pdp,
});

const mapDispatchToProps = (dispatch) => ({
  pdpActions: bindActionCreators(pdpActions, dispatch),
});

const Page = connect(mapStateToProps, mapDispatchToProps)(PDP);

export default Page;

// for HMR in the browser
if (typeof window !== 'undefined') {
  const middlewares = [
    thunk,
  ];

  const store = createStore(
    // eslint-disable-next-line global-require
    require('../../root-reducer'),
    window.initialState,
    compose(applyMiddleware(...middlewares)),
  );

  hydrate(
    <Provider store={store}>
      <Page />
    </Provider>,
    document.getElementById('root'),
  );

  // enable webpack hot module replacement for JSX
  if (module.hot) {
    module.hot.accept();

    // enable webpack hot module replacement for reducers
    module.hot.accept('../../root-reducer', () => {
      // eslint-disable-next-line global-require
      store.replaceReducer(require('../../root-reducer'));
    });
  }
}
