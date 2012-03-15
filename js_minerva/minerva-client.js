/**
 * @fileoverview Standalone Minerva client, useful for people who don't want
 * 	to use Closure Library.
 */
goog.provide('minerva_client');

goog.require('goog.async.Deferred');
goog.require('goog.debug.Logger');
goog.require('goog.debug.LogManager');
goog.require('goog.debug.DivConsole');
goog.require('goog.json');
goog.require('cw.net.ClientStream');
goog.require('cw.repr');
goog.require('cw.eventual');
goog.require('cw.net.QANHelper');
goog.require('cw.net.QANProtocolWrapper');
goog.require('cw.net.demo.getEndpoint'); // TODO: remove this
goog.require('cw.net.demo.getEndpointByQueryArgs'); // TODO: remove this

goog.exportSymbol('Minerva.HttpEndpoint', cw.net.HttpEndpoint);
goog.exportSymbol('Minerva.SocketEndpoint', cw.net.SocketEndpoint);
goog.exportSymbol('Minerva.QANHelper', cw.net.QANHelper);

goog.exportProperty(cw.net.QANHelper.prototype, 'handleQANFrame', cw.net.QANHelper.prototype.handleQANFrame);
goog.exportProperty(cw.net.QANHelper.prototype, 'ask', cw.net.QANHelper.prototype.ask);
goog.exportProperty(cw.net.QANHelper.prototype, 'notify', cw.net.QANHelper.prototype.notify);
goog.exportProperty(cw.net.QANHelper.prototype, 'failAll', cw.net.QANHelper.prototype.failAll);

goog.exportSymbol('Minerva.QANProtocolWrapper', cw.net.QANProtocolWrapper);
goog.exportProperty(cw.net.QANProtocolWrapper.prototype, 'stream', cw.net.QANProtocolWrapper.prototype.stream);
goog.exportProperty(cw.net.QANProtocolWrapper.prototype, 'qanHelper', cw.net.QANProtocolWrapper.prototype.qanHelper);

goog.exportSymbol('Minerva.Deferred', goog.async.Deferred);
goog.exportProperty(goog.async.Deferred.prototype, 'cancel', goog.async.Deferred.prototype.cancel);
goog.exportProperty(goog.async.Deferred.prototype, 'callback', goog.async.Deferred.prototype.callback);
goog.exportProperty(goog.async.Deferred.prototype, 'errback', goog.async.Deferred.prototype.errback);
goog.exportProperty(goog.async.Deferred.prototype, 'addErrback', goog.async.Deferred.prototype.addErrback);
goog.exportProperty(goog.async.Deferred.prototype, 'addCallback', goog.async.Deferred.prototype.addCallback);
goog.exportProperty(goog.async.Deferred.prototype, 'addCallbacks', goog.async.Deferred.prototype.addCallbacks);
goog.exportProperty(goog.async.Deferred.prototype, 'chainDeferred', goog.async.Deferred.prototype.chainDeferred);
goog.exportProperty(goog.async.Deferred.prototype, 'awaitDeferred', goog.async.Deferred.prototype.awaitDeferred);
goog.exportProperty(goog.async.Deferred.prototype, 'branch', goog.async.Deferred.prototype.branch);
goog.exportProperty(goog.async.Deferred.prototype, 'addBoth', goog.async.Deferred.prototype.addBoth);
goog.exportProperty(goog.async.Deferred.prototype, 'hasFired', goog.async.Deferred.prototype.hasFired);

goog.exportSymbol('Minerva.Deferred.succeed', goog.async.Deferred.succeed);
goog.exportSymbol('Minerva.Deferred.fail', goog.async.Deferred.fail);
goog.exportSymbol('Minerva.Deferred.cancelled', goog.async.Deferred.cancelled);

goog.exportSymbol('Minerva.Deferred.AlreadyCalledError', goog.async.Deferred.AlreadyCalledError);
goog.exportSymbol('Minerva.Deferred.CancelledError', goog.async.Deferred.CancelledError);

goog.exportSymbol('Minerva.ClientStream', cw.net.ClientStream);
goog.exportProperty(cw.net.ClientStream.prototype, 'getUserContext', cw.net.ClientStream.prototype.getUserContext);
goog.exportProperty(cw.net.ClientStream.prototype, 'bindToProtocol', cw.net.ClientStream.prototype.bindToProtocol);
goog.exportProperty(cw.net.ClientStream.prototype, 'start', cw.net.ClientStream.prototype.start);
goog.exportProperty(cw.net.ClientStream.prototype, 'sendString', cw.net.ClientStream.prototype.sendString);
goog.exportProperty(cw.net.ClientStream.prototype, 'reset', cw.net.ClientStream.prototype.reset);
// 5 more read-write properties are in RWPropertiesClientStream

goog.exportSymbol('Minerva.Logger', goog.debug.Logger);
goog.exportProperty(goog.debug.Logger, 'Level', goog.debug.Logger.Level);
goog.exportProperty(goog.debug.Logger, 'getLogger', goog.debug.Logger.getLogger);

goog.exportProperty(goog.debug.Logger.prototype, 'setLevel', goog.debug.Logger.prototype.setLevel);
goog.exportProperty(goog.debug.Logger.prototype, 'shout', goog.debug.Logger.prototype.shout);
goog.exportProperty(goog.debug.Logger.prototype, 'severe', goog.debug.Logger.prototype.severe);
goog.exportProperty(goog.debug.Logger.prototype, 'warning', goog.debug.Logger.prototype.warning);
goog.exportProperty(goog.debug.Logger.prototype, 'info', goog.debug.Logger.prototype.info);
goog.exportProperty(goog.debug.Logger.prototype, 'config', goog.debug.Logger.prototype.config);
goog.exportProperty(goog.debug.Logger.prototype, 'fine', goog.debug.Logger.prototype.fine);
goog.exportProperty(goog.debug.Logger.prototype, 'finer', goog.debug.Logger.prototype.finer);
goog.exportProperty(goog.debug.Logger.prototype, 'finest', goog.debug.Logger.prototype.finest);

goog.exportProperty(goog.debug.Logger.Level, 'OFF', goog.debug.Logger.Level.OFF);
goog.exportProperty(goog.debug.Logger.Level, 'SHOUT', goog.debug.Logger.Level.SHOUT);
goog.exportProperty(goog.debug.Logger.Level, 'SEVERE', goog.debug.Logger.Level.SEVERE);
goog.exportProperty(goog.debug.Logger.Level, 'WARNING', goog.debug.Logger.Level.WARNING);
goog.exportProperty(goog.debug.Logger.Level, 'INFO', goog.debug.Logger.Level.INFO);
goog.exportProperty(goog.debug.Logger.Level, 'CONFIG', goog.debug.Logger.Level.CONFIG);
goog.exportProperty(goog.debug.Logger.Level, 'FINE', goog.debug.Logger.Level.FINE);
goog.exportProperty(goog.debug.Logger.Level, 'FINER', goog.debug.Logger.Level.FINER);
goog.exportProperty(goog.debug.Logger.Level, 'FINEST', goog.debug.Logger.Level.FINEST);
goog.exportProperty(goog.debug.Logger.Level, 'ALL', goog.debug.Logger.Level.ALL);

goog.exportSymbol('Minerva.LogManager', goog.debug.LogManager);
goog.exportProperty(goog.debug.LogManager, 'getRoot', goog.debug.LogManager.getRoot);

goog.exportSymbol('Minerva.DivConsole', goog.debug.DivConsole);
goog.exportProperty(goog.debug.DivConsole.prototype, 'setCapturing', goog.debug.DivConsole.prototype.setCapturing);

// Expose goog.json, because the browser's native JSON object is useless,
// because it does not encode Unicode to ASCII \uXXXX escapes.
goog.exportSymbol('Minerva.JSON', {});
goog.exportSymbol('Minerva.JSON.parse', goog.json.parse);
goog.exportSymbol('Minerva.JSON.serialize', goog.json.serialize);

goog.exportSymbol('Minerva.bind', goog.bind);
goog.exportSymbol('Minerva.repr', cw.repr.repr);
goog.exportSymbol('Minerva.theCallQueue', cw.eventual.theCallQueue);

// TODO: remove this
goog.exportSymbol('Minerva.getEndpoint', cw.net.demo.getEndpoint);
goog.exportSymbol('Minerva.getEndpointByQueryArgs', cw.net.demo.getEndpointByQueryArgs);
