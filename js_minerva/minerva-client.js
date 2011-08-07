/**
 * @fileoverview Standalone Minerva client, useful for people who don't want
 * 	to use Closure Library.
 */
goog.provide('Minerva.Client');

goog.require('cw.net.Stream');
goog.require('cw.repr');

goog.exportSymbol('Minerva.Client.Stream', cw.net.Stream);
goog.exportProperty(cw.net.Stream.prototype, 'start', cw.net.Stream.prototype.start);
goog.exportProperty(cw.net.Stream.prototype, 'sendStrings', cw.net.Stream.prototype.sendStrings);
goog.exportProperty(cw.net.Stream.prototype, 'reset', cw.net.Stream.prototype.reset);
goog.exportProperty(cw.net.Stream.prototype, 'maxUndeliveredStrings', cw.net.Stream.prototype.maxUndeliveredStrings);
goog.exportProperty(cw.net.Stream.prototype, 'maxUndeliveredBytes', cw.net.Stream.prototype.maxUndeliveredBytes);

// To help users debug things, include cw.repr.repr as Minerva.repr
goog.exportSymbol('Minerva.repr', cw.repr.repr);

// TODO: also include LogManager, so that users can control logging
