/**
 * @fileoverview Standalone Minerva client, useful for people who don't want
 * 	to use Closure Library.
 */
goog.provide('minerva_client');

goog.require('cw.net.ClientStream');
goog.require('cw.repr');

goog.exportSymbol('Minerva.ClientStream', cw.net.ClientStream);
goog.exportProperty(cw.net.ClientStream.prototype, 'start', cw.net.ClientStream.prototype.start);
goog.exportProperty(cw.net.ClientStream.prototype, 'sendStrings', cw.net.ClientStream.prototype.sendStrings);
goog.exportProperty(cw.net.ClientStream.prototype, 'reset', cw.net.ClientStream.prototype.reset);
goog.exportProperty(cw.net.ClientStream.prototype, 'maxUndeliveredStrings', cw.net.ClientStream.prototype.maxUndeliveredStrings);
goog.exportProperty(cw.net.ClientStream.prototype, 'maxUndeliveredBytes', cw.net.ClientStream.prototype.maxUndeliveredBytes);
goog.exportProperty(cw.net.ClientStream.prototype, 'ondisconnect', cw.net.ClientStream.prototype.ondisconnect);

// To help users debug things, include cw.repr.repr as Minerva.repr
goog.exportSymbol('Minerva.repr', cw.repr.repr);

// TODO: also include LogManager, so that users can control logging
