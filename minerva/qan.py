"""
QAN is a protocol that allows asking the peer a question and receiving an
answer or error-answer.  You can think of this as the "simplest wire-level
implementation of Deferreds", which is what AMP calls itself, though QAN takes
it even further: there is no command dispatching, and requests/responses
are completely unspecified.  (Though some helper functions here assume
that the requests/responses are bytestrings.)

QAN does not require Minerva; you can use it over any bidirectional stream.
"""

import sys
import operator

from twisted.internet import defer
from twisted.python import log

from minerva.objcheck import strToNonNegLimit


_postImportVars = vars().keys()


# Not a meaningful superclass, just something to avoid copy/pasting
class _BodyAndId(tuple):
	__slots__ = ()

	body = property(operator.itemgetter(1))
	qid = property(operator.itemgetter(2))

	def __new__(cls, body, qid):
		return tuple.__new__(cls, (cls._MARKER, body, qid))


	def __repr__(self):
		return '%s(%r, %r)' % (self.__class__.__name__, self[1], self[2])



class _JustQid(tuple):
	__slots__ = ()

	qid = property(operator.itemgetter(1))

	def __new__(cls, body):
		return tuple.__new__(cls, (cls._MARKER, body))


	def __repr__(self):
		return '%s(%r)' % (self.__class__.__name__, self[1])



class _JustBody(tuple):
	__slots__ = ()

	body = property(operator.itemgetter(1))

	def __new__(cls, body):
		return tuple.__new__(cls, (cls._MARKER, body))


	def __repr__(self):
		return '%s(%r)' % (self.__class__.__name__, self[1])



class Question(_BodyAndId):
	__slots__ = ()
	_MARKER = object()



class OkayAnswer(_BodyAndId):
	__slots__ = ()
	_MARKER = object()



class ErrorAnswer(_BodyAndId):
	__slots__ = ()
	_MARKER = object()



class Cancel(_JustQid):
	__slots__ = ()
	_MARKER = object()



class Notify(_JustBody):
	__slots__ = ()
	_MARKER = object()



qanTypeToCode = {
	 Question: "Q"
	,OkayAnswer: "K"
	,ErrorAnswer: "E"
	,Cancel: "C"
	,Notify: "N"
}


def qanFrameToString(qf):
	"""
	@param qf: The QAN frame to encode
	@type qf: a L{Question} or L{OkayAnswer} or L{ErrorAnswer} or
		L{Cancel} or L{Notify}, all of which must have a C{str} C{.body}.

	@return: The encoded QAN frame
	@rtype: str
	"""
	qanFrameType = type(qf)
	code = qanTypeToCode[qanFrameType]
	if qanFrameType == Notify:
		return qf.body + code
	elif qanFrameType == Cancel:
		return str(qf.qid) + code
	else:
		return qf.body + "|" + str(qf.qid) + code


class InvalidQANFrame(Exception):
	pass



def _qidOrThrow(s):
	try:
		return strToNonNegLimit(s, 2**53)
	except ValueError:
		raise InvalidQANFrame("bad qid")


def stringToQanFrame(frameString):
	"""
	@param frameString: The QAN frame, encoded as a string
	@type frameString: C{str}

	@return: The QAN frame
	@rtype qf: a L{Question} or L{OkayAnswer} or L{ErrorAnswer} or
		L{Cancel} or L{Notify}, with a C{str} C{.body}.
	"""
	try:
		lastByte = frameString[-1]
	except IndexError:
		raise InvalidQANFrame("0-length frame")

	if lastByte == "N":
		return Notify(frameString[:-1])
	elif lastByte == "C":
		qid = _qidOrThrow(frameString[:-1])
		return Cancel(qid)
	else:
		body, rest = frameString.rsplit('|', 1)
		qid = _qidOrThrow(rest[:-1])

		if lastByte == "Q":
			return Question(body, qid)
		elif lastByte == "K":
			return OkayAnswer(body, qid)
		elif lastByte == "E":
			return ErrorAnswer(body, qid)
		else:
			raise InvalidQANFrame("Invalid QAN frame type %r" % lastByte)


def isAnswerFrame(qanFrame):
	return isinstance(qanFrame, OkayAnswer) or isinstance(qanFrame, ErrorAnswer)


class ErrorResponse(Exception):
	pass



class InvalidResponse(Exception):
	pass



class InvalidQID(Exception):
	pass



class QANHelper(object):
	def __init__(self, bodyReceivedCallable, sendStringsCallable, resetStreamCallable):
		"""
		@param bodyReceivedCallable: The 2-arg function to call when
			a Question or Notify is received (via a call to .handleString).

		@param sendStringsCallable: A function that works like Stream.sendStrings

		@param resetStreamCallable: A function that works like Stream.resetStream
		"""
		self._bodyReceivedCallable = bodyReceivedCallable
		self._sendStringsCallable = sendStringsCallable
		self._resetStreamCallable = resetStreamCallable

		self._qid = 1
		self._ourQuestions = {}


	def _sendOkayAnswer(self, s, qid):
		if not isinstance(s, str):
			raise InvalidResponse("Your response must be a str, not %r" % (s,))

		qanString = qanFrameToString(OkayAnswer(s, qid))
		self._sendStringsCallable(qanString)


	def _resetOrSendErrorAnswer(self, failure, qid):
		failure.trap(ErrorResponse)

		qanString = qanFrameToString(ErrorAnswer(failure.getErrorMessage(), qid))
		self._sendStringsCallable(qanString)


	def handleString(self, s):
		qanFrame = stringToQanFrame(s)
		if isAnswerFrame(qanFrame):
			try:
				d = self._ourQuestions[qanFrame.qid]
			except KeyError:
				raise InvalidQID("Invalid qid: %r" % (qanFrame.qid,))

			if isinstance(qanFrame, OkayAnswer):
				d.callback(qanFrame.body)
			else:
				d.errback(ErrorResponse(qanFrame.body))

		elif isinstance(qanFrame, Notify):
			self._bodyReceivedCallable(qanFrame.body, False)

		elif isinstance(qanFrame, Question):
			qid = qanFrame.qid
			d = defer.maybeDeferred(
				self._bodyReceivedCallable(qanFrame.body, True))
			d.addCallbacks(self._sendOkayAnswer, self._resetOrSendErrorAnswer, qid, qid)
			d.addErrback(log.err) # TODO: reset Stream?

		elif isinstance(qanFrame, Cancel):
			1/0


	def ask(self, body):
		qid = self._qid
		self._qid += 1
		question = Question(body, qid)
		self._sendStringsCallable(qanFrameToString(question))

		assert qid not in self._ourQuestions
		d = defer.Deferred() # TODO: canceller?
		self._ourQuestions[qid] = d
		return d


	def notify(self, body):
		self._sendStringsCallable(qanFrameToString(Notify(body)))



try: from refbinder.api import bindRecursive
except ImportError: pass
else: bindRecursive(sys.modules[__name__], _postImportVars)
