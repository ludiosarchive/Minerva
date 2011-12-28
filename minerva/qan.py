"""
QAN is a protocol that allows asking the peer a question and receiving an
answer or error-answer.  You can think of this as the "simplest wire-level
implementation of Deferreds", which is what AMP calls itself, though QAN takes
it even further: there is no command dispatching, and request/response data is
completely unspecified.

QAN does not require Minerval; you can use it over any bidirectional stream.
"""


# Not a meaningful superclass, just something to avoid copy/pasting
class _QANWithId(tuple):
	__slots__ = ()

	body = property(operator.itemgetter(1))
	qid = property(operator.itemgetter(2))

	def __new__(cls, body, qid):
		return tuple.__new__(cls, (cls._MARKER, body, qid))


	def __repr__(self):
		return '%s(%r, %r)' % (self.__class__.__name__, self[1], self[2])



class _QANWithoutId(tuple):
	__slots__ = ()

	body = property(operator.itemgetter(1))

	def __new__(cls, body):
		return tuple.__new__(cls, (cls._MARKER, body))


	def __repr__(self):
		return '%s(%r)' % (self.__class__.__name__, self[1])



class QANQuestion(_QANWithId):
	__slots__ = ()
	_MARKER = object()



class QANAnswer(_QANWithId):
	__slots__ = ()
	_MARKER = object()



class QANErrorAnswer(_QANWithId):
	__slots__ = ()
	_MARKER = object()



class QANCancel(_QANWithId):
	__slots__ = ()
	_MARKER = object()



class QANNotify(_QANWithoutId):
	__slots__ = ()
	_MARKER = object()
