# hypercat-demo

This is a demonstration of using the Hypercat catalogue within the CityVerve API.

Click [here](https://cityverve.org.uk/what-is-cityverve/) to learn more about CityVerve.

Click [here](http://developer.cityverve.org.uk/) to go to the CityVerve Developer Portal.

Click [here](http://developer.cityverve.org.uk/showcase) to see a showcase of working CityVerve apps (including this demo).

Click [here](https://www.bsigroup.com/en-GB/about-bsi/media-centre/press-releases/2016/july/Internet-of-Things-interoperability-specification-is-published/) to read the official HyperCat specification (BSI:PAS:212)

## Instructions

In order to get this demo working for yourself, you simply need to clone the repo and host the files within your web-server of choice.

Before it will work, however, you need to make **one modification**. At the top of the JavaScript file, you will find the following line of code:

```javascript
const API_KEY = 'YOUR-KEY-HERE';  // cityverve api key
```

You need to replace the string **YOUR-KEY-HERE** with your own personal _CityVerve API key_. You can get a key (for free) at our [Developer Portal](http://developer.cityverve.org.uk/home). Just follow the steps in our [Getting Started](http://developer.cityverve.org.uk/get-started) guide.

Have fun, and [please do share](https://cityverve.org.uk/contact/) any cool apps that you make with the CityVerve API.
