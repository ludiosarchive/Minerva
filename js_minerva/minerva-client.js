/**
 * @fileoverview Standalone Minerva client, useful for people who don't want
 * 	to use Closure Library.
 */
goog.provide('minerva_client');

goog.require('goog.debug.Logger');
goog.require('goog.debug.LogManager');
goog.require('goog.debug.DivConsole');
goog.require('cw.net.ClientStream');
goog.require('cw.repr');
goog.require('cw.eventual');
goog.require('cw.net.demo.getEndpoint'); // TODO: remove this
goog.require('cw.net.demo.getEndpointByQueryArgs'); // TODO: remove this
goog.require('goog.async.Deferred'); // TODO: remove this

goog.exportSymbol('Minerva.HttpEndpoint', cw.net.HttpEndpoint);
goog.exportSymbol('Minerva.SocketEndpoint', cw.net.SocketEndpoint);
// Note: Minerva.SocketEndpoint not usable yet because FlashSocketTracker
// needs non-CL support.

goog.exportSymbol('Minerva.ClientStream', cw.net.ClientStream);
goog.exportProperty(cw.net.ClientStream.prototype, 'getUserContext', cw.net.ClientStream.prototype.getUserContext);
goog.exportProperty(cw.net.ClientStream.prototype, 'bindToProtocol', cw.net.ClientStream.prototype.bindToProtocol);
goog.exportProperty(cw.net.ClientStream.prototype, 'start', cw.net.ClientStream.prototype.start);
goog.exportProperty(cw.net.ClientStream.prototype, 'sendStrings', cw.net.ClientStream.prototype.sendStrings);
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

goog.exportSymbol('Minerva.bind', goog.bind);
goog.exportSymbol('Minerva.repr', cw.repr.repr);
goog.exportSymbol('Minerva.theCallQueue', cw.eventual.theCallQueue);

// TODO: remove this
goog.exportSymbol('Minerva.getEndpoint', cw.net.demo.getEndpoint);
goog.exportSymbol('Minerva.getEndpointByQueryArgs', cw.net.demo.getEndpointByQueryArgs);

// TODO: remove this
goog.exportProperty(goog.async.Deferred.prototype, 'addCallback', goog.async.Deferred.prototype.addCallback);
goog.exportProperty(goog.async.Deferred.prototype, 'addErrback', goog.async.Deferred.prototype.addErrback);
goog.exportProperty(goog.async.Deferred.prototype, 'addBoth', goog.async.Deferred.prototype.addBoth);
