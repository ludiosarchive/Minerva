"""
QAN is a protocol that allows asking the peer a question and receiving an
answer or error-answer.  You can think of this as the "simplest wire-level
implementation of Deferreds", which is what AMP calls itself, though QAN takes
it even further: there is no command dispatching, and request/response data is
completely unspecified.

QAN does not require Minerval; you can use it over any bidirectional stream.
"""

import sys
import operator

_postImportVars = vars().keys()


# Not a meaningful superclass, just something to avoid copy/pasting
class _WithId(tuple):
	__slots__ = ()

	body = property(operator.itemgetter(1))
	qid = property(operator.itemgetter(2))

	def __new__(cls, body, qid):
		return tuple.__new__(cls, (cls._MARKER, body, qid))


	def __repr__(self):
		return '%s(%r, %r)' % (self.__class__.__name__, self[1], self[2])



class _WithoutId(tuple):
	__slots__ = ()

	body = property(operator.itemgetter(1))

	def __new__(cls, body):
		return tuple.__new__(cls, (cls._MARKER, body))


	def __repr__(self):
		return '%s(%r)' % (self.__class__.__name__, self[1])



class Question(_WithId):
	__slots__ = ()
	_MARKER = object()



class OkayAnswer(_WithId):
	__slots__ = ()
	_MARKER = object()



class ErrorAnswer(_WithId):
	__slots__ = ()
	_MARKER = object()



class Cancel(_WithId):
	__slots__ = ()
	_MARKER = object()



class Notify(_WithoutId):
	__slots__ = ()
	_MARKER = object()



_typeToCode = {
	 Question: "Q"
	,OkayAnswer: "O"
	,ErrorAnswer: "E"
	,Cancel: "C"
	,Notify: "N"
}


def qanFrameToString(qf):
	qanFrameType = type(qf)
	code = _typeToCode[qanFrameType]
	if qanFrameType == Notify:
		return qf.body + code
	else:
		return qf.body + "|" + str(qf.qid) + code


try: from refbinder.api import bindRecursive
except ImportError: pass
else: bindRecursive(sys.modules[__name__], _postImportVars)
