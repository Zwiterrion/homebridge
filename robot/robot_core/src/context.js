
const logger = require('./utils/logger');
const util = require('util');

/**
 * List of the possible context
 */
const possibleContext = {
  NONE: 'NONE',
  CHOOSING_COLOR: 'CHOOSING_COLOR',
};

const currentContext = {
  name: possibleContext.NONE,
  contextData: null, // information belonging to the context
  timeoutObject: null, // the timeout object that can be clear
  breakCallback: null, // function to be called if timeout is break
};

/**
 * Set a limited time for a context, when this time end currentContext return to null
 * and the callback is call
 * note : interval can be break with the break method of the Context object, if it happens,
 * the callback will not be called and the context may not return to none
 * @param {*} contextName name of the context
 * @param {*} interval duration in MS
 * @param {*} callback function to be called once the timer is over
 */
function setTimeoutContext(contextName, timeout, timeoutCallback, breakCallback) {
  logger.debug(`setting timeout context with name : ${contextName}`);
  let err = null;
  // launch timer
  currentContext.breakCallback = breakCallback;
  currentContext.timeoutObject = setTimeout(() => {
    logger.debug('timeout callback ready to be called');
    logger.debug(`current:${currentContext.name} === new:${contextName}`);
    // we ensure that we're still in the context of choosing a color
    if (currentContext.name === contextName) {
      // we did not recieve the response from the user in time, 
      // context return to none and we call the callback
      currentContext.name = possibleContext.NONE;
      if (timeoutCallback) { logger.debug(`timeoutCallback :  ${util.inspect(timeoutCallback)}`); timeoutCallback(err); }
    }
  },
  timeout
  );
}

const Context = {

  /**
   * Clear the timeout and call the breakCallback if it's specified
   * It does not modify the context otherwise
   */
  breakTimeout: () => {
    let err = null;
    if (currentContext.timeoutObject) {
      clearTimeout(currentContext.timeoutObject);

      currentContext.timeoutObject = null;
      if (currentContext.breakCallback) {
        currentContext.breakCallback(err);
        currentContext.breakCallback = null;
      }
    }
  },

  /**
   * Change the current context. The old context is remove and if it was waiting for the 
   * timeout its breakCallback its called.
   * If timeout is equal to 0, the timeout is not set and context last until it is change.
   */
  change: (contextName, contextObject = null, timeoutCallback = null, breakCallback = null, timeout = 0) => {
    logger.debug(`Changing context ${currentContext.name} for context ${contextName}`);
    Context.breakTimeout(); // break old timeout context if it exist
    // maybe test if a the contextName is valid ?
    currentContext.name = contextName;
    currentContext.contextData = contextObject;
    if (timeout !== 0) {
      setTimeoutContext(contextName, timeout, timeoutCallback, breakCallback);
    }
  },

  setToDefaultContext: () => Context.change(possibleContext.NONE),

  getCurrentContextName: () => currentContext.name,

  getCurrentContextData: () => currentContext.contextData,
};

module.exports = { possibleContext, Context };
