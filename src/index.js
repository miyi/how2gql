import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom'

import { GC_AUTH_TOKEN } from './constants'
import './styles/index.css'

// configuring apollo into index.js
//STEP 1 import the goods
import { ApolloProvider, createNetworkInterface, ApolloClient } from 'react-apollo'
//STEP 2 define end point in interface
const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/cj6u6wp740m4u0107d5gl6u8f'
})
//STEP 3 instantialize client
const client = new ApolloClient({
  networkInterface
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
