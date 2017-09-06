describe('Context', () => {
  const { possibleContext, Context } = require('../../src/context');
  const logger = require('../../src/utils/logger');

  const contextName = 'aContext';
  const anotherContextName = 'awesomeContext';

  let timeoutCallback = null;
  let breakCallback = null;
  let advancedCallback = null;

  beforeEach(() => {
    Context.setToDefaultContext();
    timeoutCallback = jasmine.createSpy('timeoutCallback');
    breakCallback = jasmine.createSpy('breakCallback');

    advancedCallback = () => {
      Context.change(anotherContextName);
    };
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be possible to change the current context', () => {
    Context.change(contextName);
    expect(Context.getCurrentContextName()).toEqual(contextName);
  });

  it('should be possible to set the context to the default one', () => {
    Context.change(contextName);
    Context.setToDefaultContext();
    expect(Context.getCurrentContextName()).toEqual(possibleContext.NONE);
  });

  it('should be possible to exit a context once a certain amount of time is passed', () => {
    Context.change(contextName, {}, timeoutCallback, breakCallback, 100);
    expect(timeoutCallback).not.toHaveBeenCalled();
    jasmine.clock().tick(101);
    expect(timeoutCallback).toHaveBeenCalled();
    expect(Context.getCurrentContextName()).toEqual(possibleContext.NONE);
  });

  it('should be possible to exit a context because of a timeout and instantly enter an other context', () => {
    Context.change(contextName, {}, advancedCallback, breakCallback, 100);
    expect(Context.getCurrentContextName()).toEqual(contextName);
    jasmine.clock().tick(101);
    expect(Context.getCurrentContextName()).toEqual(anotherContextName);
  });

  it('should be possible to change a context before timeout and fire the breakCallback', () => {
    Context.change(contextName, {}, timeoutCallback, breakCallback, 100);
    expect(breakCallback).not.toHaveBeenCalled();
    Context.change(anotherContextName, {}, null, null, 100);
    expect(breakCallback).toHaveBeenCalled();
  });

  it('should fire the timeoutCallBack when breaking timeout', () =>{
    Context.change(contextName, {}, timeoutCallback, breakCallback, 100);
    Context.change(anotherContextName, {}, null, null, 100);
    expect(timeoutCallback).not.toHaveBeenCalled();
  });
});

