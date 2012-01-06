"""
QAN is a protocol that allows asking the peer a question and receiving an
answer or error-answer.  You can think of this as the "simplest wire-level
implementation of Deferreds", which is what AMP calls itself, though QAN takes
it even further: there is no command dispatching, and requests/responses
are completely unspecified.  (Though some helper functions here assume
that the requests/responses are bytestrings.)

QAN does not require Minerva; you can use it over any bidirectional framed
stream.
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



class KnownErrorAnswer(_BodyAndId):
	__slots__ = ()
	_MARKER = object()



class UnknownErrorAnswer(_BodyAndId):
	__slots__ = ()
	_MARKER = object()



class Cancellation(_JustQid):
	__slots__ = ()
	_MARKER = object()



class Notification(_JustBody):
	__slots__ = ()
	_MARKER = object()



qanTypeToCode = {
	 Question: "Q"
	,OkayAnswer: "K"
	,KnownErrorAnswer: "E"
	,UnknownErrorAnswer: "U"
	,Cancellation: "C"
	,Notification: "N"
}


def qanFrameToString(qf):
	"""
	@param qf: The QAN frame to encode
	@type qf: a L{Question} or L{OkayAnswer} or L{ErrorAnswer} or
		L{Cancellation} or L{Notification}, all of which must have a C{str} C{.body}.

	@return: The encoded QAN frame
	@rtype: str
	"""
	qanFrameType = type(qf)
	code = qanTypeToCode[qanFrameType]
	if qanFrameType == Notification:
		return qf.body + code
	elif qanFrameType == Cancellation:
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


def stringToQANFrame(frameString):
	"""
	@param frameString: The QAN frame, encoded as a string
	@type frameString: C{str}

	@return: The QAN frame
	@rtype qf: a L{Question} or L{OkayAnswer} or L{ErrorAnswer} or
		L{Cancellation} or L{Notification}, with a C{str} C{.body}.
	"""
	try:
		lastByte = frameString[-1]
	except IndexError:
		raise InvalidQANFrame("0-length frame")

	if lastByte == "N":
		return Notification(frameString[:-1])
	elif lastByte == "C":
		qid = _qidOrThrow(frameString[:-1])
		return Cancellation(qid)
	else:
		body, rest = frameString.rsplit('|', 1)
		qid = _qidOrThrow(rest[:-1])

		if lastByte == "Q":
			return Question(body, qid)
		elif lastByte == "K":
			return OkayAnswer(body, qid)
		elif lastByte == "E":
			return KnownErrorAnswer(body, qid)
		elif lastByte == "U":
			return UnknownErrorAnswer(body, qid)
		else:
			raise InvalidQANFrame("Invalid QAN frame type %r" % lastByte)


def isAnswerFrame(qanFrame):
	return isinstance(qanFrame, (OkayAnswer, KnownErrorAnswer, UnknownErrorAnswer))


class KnownError(Exception):
	pass



class UnknownError(Exception):
	pass



class QANHelper(object):
	def __init__(self, bodyReceived, sendQANFrame, fatalError):
		"""
		@param bodyReceived: The 2-arg function to call when
			a Question or Notification is received (via a call to .handleString).
			Called with arguments: body, isQuestion.

		@param sendQANFrame: A 1-arg function that sends a QAN frame to the
			peer.  Called with argument: qanFrame.

		@param fatalError: A 1-arg function called when QANHelper can no longer
			handle QAN frames.  Called with argument: reason (restricted
			string).
		"""
		self._bodyReceived = bodyReceived
		self._sendQANFrame = sendQANFrame
		self._fatalError = fatalError

		self._qidCounter = 1
		self._ourQuestions = {}
		self._theirQuestions = {}


	def _sendOkayAnswer(self, s, qid):
		del self._theirQuestions[qid]
		self._sendQANFrame(OkayAnswer(s, qid))


	def _sendErrorAnswer(self, failure, qid):
		del self._theirQuestions[qid]
		if failure.check(KnownError):
			self._sendQANFrame(KnownErrorAnswer(failure.value[0], qid))
		elif failure.check(defer.CancelledError):
			self._sendQANFrame(UnknownErrorAnswer("CancelledError"))
		else:
			# We intentionally do not reveal information about the
			# exception.
			self._sendQANFrame(UnknownErrorAnswer("Uncaught exception"))


	def handleQANFrame(self, qanFrame):
		if isAnswerFrame(qanFrame):
			qid = qanFrame.qid
			try:
				d = self._ourQuestions.pop(qid)
			except KeyError:
				self._fatalError("Received an answer with invalid qid: %d" % (qid,))
				return

			if d is None:
				# Ignore the answer to a question we cancelled.
				pass
			elif isinstance(qanFrame, OkayAnswer):
				d.callback(qanFrame.body)
			elif isinstance(qanFrame, KnownErrorAnswer):
				d.errback(KnownError(qanFrame.body))
			elif isinstance(qanFrame, UnknownErrorAnswer):
				d.errback(UnknownError(qanFrame.body))
			else:
				raise RuntimeError("bug")

		elif isinstance(qanFrame, Notification):
			self._bodyReceived(qanFrame.body, False)

		elif isinstance(qanFrame, Question):
			qid = qanFrame.qid
			if qid in self._theirQuestions:
				self._fatalError("Received Question with duplicate qid: %d" % (qid,))
				return
			d = defer.maybeDeferred(
				self._bodyReceived, qanFrame.body, True)
			self._theirQuestions[qid] = d
			d.addCallbacks(
				self._sendOkayAnswer, self._sendErrorAnswer,
				callbackArgs=(qid,), errbackArgs=(qid,))
			d.addErrback(log.err)

		elif isinstance(qanFrame, Cancellation):
			qid = qanFrame.qid
			try:
				# We don't .pop() it here because a cancelled Deferred
				# still goes through the callback or errback chain, and
				# our _sendOkayAnswer and _resetOrSendErrorAnswer
				# deletes it from self._theirQuestions.
				d = self._theirQuestions[qid]
			except KeyError:
				# Cancellations for nonexistent questions are ignored.
				pass
			else:
				d.cancel()


	def _sendCancel(self, qid):
		self._ourQuestions[qid] = None

		# Note: when we cancel something, we still expect to get either
		# an OkayAnswer or ErrorAnswer from the peer, at least in the
		# typical case where the Stream does not reset.
		self._sendQANFrame(Cancellation(qid))

		# Because we don't call .callback or .errback in this canceller,
		# Deferred calls .errback(CancelledError()) for us.


	def ask(self, body):
		qid = self._qidCounter
		self._qidCounter += 1
		self._sendQANFrame(Question(body, qid))

		assert qid not in self._ourQuestions
		d = defer.Deferred(lambda _: self._sendCancel(qid))
		self._ourQuestions[qid] = d
		return d


	def notify(self, body):
		self._sendQANFrame(Notification(body))


# class QANProtocol
# TODO: Show a helpful exception message if return value from bodyReceived is None


try: from refbinder.api import bindRecursive
except ImportError: pass
else: bindRecursive(sys.modules[__name__], _postImportVars)
