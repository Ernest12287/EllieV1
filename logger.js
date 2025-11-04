import logger from "ernest-logger";

const formatMsg = (msg) => {
    if (typeof msg === 'object' && msg !== null) {
        return JSON.stringify(msg, null, 2); 
    }
    return msg;
};

const ernest = logger({
    time: true,
    emoji: true,
    level: 'info' 
});

const logging = {
    error: (msg = "", ...args) => {
        ernest.log.error.red(`❌ Unfortunately, there is an error: ${formatMsg(msg)}`, ...args); 
    },
    success: (msg = "", ...args) => {
        ernest.log.success.green(`✅ Code run successfully: ${formatMsg(msg)}`, ...args);
    },
    fatal: (msg = "", ...args) => {
        ernest.log.error.red(`[FATAL]: ${formatMsg(msg)}`, ...args);
    },
    warn: (msg = "", ...args) => {
        ernest.log.warn.yellow(`[WARN]: ${formatMsg(msg)}`, ...args);
    },
    info: (msg = "", ...args) => {
        ernest.log.info.blue(`[INFO]: ${formatMsg(msg)}`, ...args);
    },
    debug: () => {}, 
    trace: () => {},
    child: () => logging 
};

export default logging;