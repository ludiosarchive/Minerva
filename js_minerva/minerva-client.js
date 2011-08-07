/**
 * @fileoverview Standalone Minerva client, useful for people who don't want
 * 	to use Closure Library.
 */
goog.provide('Minerva.Client');

goog.require('cw.net.Stream');

goog.exportSymbol('Minerva.Client.Stream', cw.net.Stream);
goog.exportProperty(cw.net.Stream.prototype, 'start', cw.net.Stream.prototype.start);
goog.exportProperty(cw.net.Stream.prototype, 'sendStrings', cw.net.Stream.prototype.sendStrings);
goog.exportProperty(cw.net.Stream.prototype, 'reset', cw.net.Stream.prototype.reset);
