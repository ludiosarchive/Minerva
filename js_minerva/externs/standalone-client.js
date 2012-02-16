/**
 * @fileoverview Externs that make minerva-client.js compile properly.
 *
 * John Lenz says: "One approach [to exporting L-values] is to define an
 * interface in your externs and have your class implement that interface.
 * The compiler will not rename those properties that are defined in the
 * extern file."
 *
 * @externs
 */

/**
 * @interface
 */
function RWPropertiesClientStream() {}

RWPropertiesClientStream.prototype.maxUndeliveredStrings;
RWPropertiesClientStream.prototype.maxUndeliveredBytes;
RWPropertiesClientStream.prototype.onstarted;
RWPropertiesClientStream.prototype.onreset;
RWPropertiesClientStream.prototype.onstring;
RWPropertiesClientStream.prototype.ondisconnect;
