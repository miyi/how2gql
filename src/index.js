import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom'
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'

import { GC_AUTH_TOKEN } from './constants'
import './styles/index.css'

// configuring apollo into index.js
//STEP 1 import the goods
import { ApolloProvider, createNetworkInterface, ApolloClient } from 'react-apollo'
//STEP 2 define end point in interface
const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/cj6u6wp740m4u0107d5gl6u8f'
})

const wsClient = new SubscriptionClient('wss://subscriptions.ap-northeast-1.graph.cool/v1/cj6u6wp740m4u0107d5gl6u8f',{
  reconnect: true,
  connectionParams: {
     authToken: localStorage.getItem(GC_AUTH_TOKEN),
  },

})

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
)

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }
    const token = localStorage.getItem(GC_AUTH_TOKEN)
    req.options.headers.authorization = token ? `Bearer ${token}` : null
    next()
  }
}])

const client = new ApolloClient ({
  networkInterface: networkInterfaceWithSubscriptions,
})


//STEP 4 use Apollo in render
ReactDOM.render(
	<BrowserRouter>
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	</BrowserRouter>
	, document.getElementById('root')
);
registerServiceWorker();


