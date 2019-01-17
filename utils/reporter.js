import manuh from 'manuh'
import topics from '../config/topics'
import { Client } from 'bugsnag-react-native';
const bugsnag = new Client("a823ebc055f48c9e1d408e6d093372af");

const localLogging = true

module.exports.reportError = (error) => {
    bugsnag.notify(new Error(error));
    if (localLogging) {
        console.log("+++== reportError:: ",error)
    }
    manuh.publish(topics.loader.activity.status.set, { value: 0})
}