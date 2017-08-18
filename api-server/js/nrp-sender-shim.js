const uuid = require("uuid");
const NRP = require("node-redis-pubsub");

const nrpConfig = {
    port: 6379,
    scope: 'queue'
};

const defaultRedisConnection = new NRP(nrpConfig);

const defaultMessageConfig = {
    data: {},
    timeout: 1000,
    eventName: "send",
    redis: defaultRedisConnection,
    expectsResponse: true
};

const sendMessage = (messageConfig = defaultMessageConfig) => {
    return new Promise((fulfill, reject) => {
        let settings = Object.assign({}, defaultMessageConfig, messageConfig);

        let messageId = uuid.v4();
        let killswitchTimeoutId = undefined;
        let redisConnection = settings.redis;
        let eventName = settings.eventName;

        let outgoingEventName = eventName;



        if(messageConfig.method === 'GET') {
            outgoingEventName = outgoingEventName + ':get:' + messageId;
        }
        
        else if(messageConfig.method === 'POST') {
            outgoingEventName = outgoingEventName + ':post:' + messageId;
        }
        



        console.log("OUTGOING EVENT NAME");
        console.log(outgoingEventName);
        // console.log("MESSAGE CONFIG");
        // console.log(messageConfig);


        if (settings.expectsResponse) {

            let successEventName = `${eventName}:success:${messageId}`;
            let failedEventName = `${eventName}:failed:${messageId}`;

            console.log("inside expects response");
            console.log(failedEventName);
            console.log(successEventName);
            let success = redisConnection.on(successEventName, (response, channel) => {
                console.log("The event has succeeded");
                fulfill(response.data);
                endMessageLifeCycle();
            });

            let error = redisConnection.on(failedEventName, (response, channel) => {
                reject(response.data);
                endMessageLifeCycle();
            });

            let shutoffEvents = [success, error];

            let endMessageLifeCycle = () => {
                shutoffEvents.forEach(shutOff => {
                    shutOff();
                });
                clearTimeout(killswitchTimeoutId);
            };

            if (settings.timeout >= 0) {
                killswitchTimeoutId = setTimeout(() => {
                    reject(new Error("timed out"));
                    endMessageLifeCycle();
                }, settings.timeout);
            }
        }

        redisConnection.emit(outgoingEventName, {
            requestId: messageId,
            data: settings.data,
            eventName: settings.eventName
        });

        if (!settings.expectsResponse) {
            fulfill();
        }

    });
};

module.exports = {
    sendMessage
};
