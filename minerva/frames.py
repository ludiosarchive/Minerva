"""
This file includes frame encoders and decoders for each frame type, so that
it is suitable for both both Minerva server, and a Python Minerva client (not
yet written).
"""

import operator
from simplejson import dumps
from simplejson.decoder import JSONDecodeError

from mypy.dictops import attrdict
from mypy.objops import (
	ensureBool, ensureNonNegIntLimit, strToNonNegLimit, strToIntInRange)
from mypy.strops import StringFragment
from mypy.constant import Constant, attachClassMarker
from minerva.decoders import strictDecoder, ParseError
from minerva.window import SACK

_postImportVars = vars().keys()


# Property key names for the hello frame.
class HelloFrameArguments(object):
	transportNumber = 'tnum'
	protocolVersion = 'ver'
	httpFormat = 'format'
	requestNewStream = 'new'
	streamId = 'id'
	credentialsData = 'cred'
	streamingResponse = 'ming'
	needPaddingBytes = 'pad'
	maxReceiveBytes = 'maxb'
	maxOpenTime = 'maxt'
	useMyTcpAcks = 'tcpack'
	succeedsTransport = 'eeds'
	sack = 'sack'
	lastSackSeenByClient = 'seenack'



# Make globals that pypycpyo.optimizer can optimize away
_hfa = HelloFrameArguments
Hello_transportNumber = _hfa.transportNumber
Hello_protocolVersion = _hfa.protocolVersion
Hello_httpFormat = _hfa.httpFormat
Hello_requestNewStream = _hfa.requestNewStream
Hello_streamId = _hfa.streamId
Hello_credentialsData = _hfa.credentialsData
Hello_streamingResponse = _hfa.streamingResponse
Hello_needPaddingBytes = _hfa.needPaddingBytes
Hello_maxReceiveBytes = _hfa.maxReceiveBytes
Hello_maxOpenTime = _hfa.maxOpenTime
Hello_useMyTcpAcks = _hfa.useMyTcpAcks
Hello_succeedsTransport = _hfa.succeedsTransport
Hello_sack = _hfa.sack
Hello_lastSackSeenByClient = _hfa.lastSackSeenByClient
del _hfa


FORMAT_XHR, FORMAT_HTMLFILE = 2, 3


class InvalidFrame(Exception):
	pass



class InvalidHello(InvalidFrame):
	pass



class CannotEncode(Exception):
	pass



def helloDataToHelloFrame(helloData):
	"""
	Convert arbitrary JSON-decoded blob of objects into a L{HelloFrame}.
	Raises L{InvalidHello} if there were errors in the blob of objects.
	"""
	if not isinstance(helloData, dict):
		raise InvalidHello("helloData not a dict")

	obj = attrdict()

	# credentialsData is always optional.
	obj.credentialsData = helloData[Hello_credentialsData] if \
		Hello_credentialsData in helloData else ""
	if not isinstance(obj.credentialsData, str) or \
	not isValidShortRestrictedString(obj.credentialsData):
		raise InvalidHello("bad credentialsData")

	# sack is always optional.
	if Hello_sack in helloData:
		try:
			sack = helloData[Hello_sack]
			if not isinstance(sack, str):
				raise TypeError
			obj.sack = sackStringToSack(sack)
		except (KeyError, TypeError, InvalidSackString):
			raise InvalidHello("bad sack")
	else:
		obj.sack = None

	try:
		lastSackSeen = helloData[Hello_lastSackSeenByClient]
		if not isinstance(lastSackSeen, str):
			raise TypeError
		obj.lastSackSeenByClient = sackStringToSack(lastSackSeen)
	except (KeyError, TypeError, InvalidSackString):
		raise InvalidHello("bad lastSackSeenByClient")

	try:
		# Any line here can raise KeyError; additional exceptions marked with 'e:'

		# requestNewStream is always optional. If missing or False/0, transport
		# is intended to attach to an existing stream.
		obj.requestNewStream = ensureBool( # e: ValueError
			helloData[Hello_requestNewStream]) if \
			Hello_requestNewStream in helloData else False

		obj.transportNumber = ensureNonNegIntLimit( # e: ValueError, TypeError
			helloData[Hello_transportNumber], 2**53)

		obj.protocolVersion = helloData[Hello_protocolVersion]

		obj.streamingResponse = ensureBool( # e: ValueError
			helloData[Hello_streamingResponse])

		# Rules for streamId: must be 20-30 inclusive bytes, must not
		# contain codepoints > 127
		obj.streamId = helloData[Hello_streamId]
		# ,str is appropriate only because simplejson returns str when possible
		if not isinstance(obj.streamId, str) or not 20 <= len(obj.streamId) <= 30:
			raise InvalidHello("bad streamId")
	except (KeyError, TypeError, ValueError):
		raise InvalidHello(
			"problem with requestNewStream, transportNumber, "
			"protocolVersion, streamingResponse, or streamId")

	if obj.protocolVersion != 2:
		raise InvalidHello("bad protocolVersion")

	# Hello_succeedsTransport is always optional. If missing, the client does not
	# want to get S2C strings over this transport. If None, the client does,
	# but the transport does not succeed an existing primary transport. If a
	# number, the transport might succeed an existing primary transport.
	if Hello_succeedsTransport in helloData:
		obj.succeedsTransport = helloData[Hello_succeedsTransport]
		if obj.succeedsTransport is not None:
			try:
				obj.succeedsTransport = ensureNonNegIntLimit(
					obj.succeedsTransport, 2**53)
			except (TypeError, ValueError):
				raise InvalidHello("bad succeedsTransport")

	try:
		obj.httpFormat = helloData[Hello_httpFormat]
		if not obj.httpFormat in (FORMAT_XHR, FORMAT_HTMLFILE):
			raise InvalidHello("bad httpFormat")
	except KeyError:
		obj.httpFormat = None

	# needPaddingBytes is always optional. If missing, 0.
	if Hello_needPaddingBytes in helloData:
		try:
			obj.needPaddingBytes = ensureNonNegIntLimit(
				helloData[Hello_needPaddingBytes], 16*1024) # e: ValueError, TypeError
		except (TypeError, ValueError):
			raise InvalidHello("bad needPaddingBytes")
	else:
		obj.needPaddingBytes = 0

	# maxReceiveBytes is optional and have no limit by default
	try:
		obj.maxReceiveBytes = ensureNonNegIntLimit(
			helloData[Hello_maxReceiveBytes], 2**53) # e: ValueError, TypeError
	except KeyError:
		obj.maxReceiveBytes = 2**53
	except (TypeError, ValueError):
		raise InvalidHello("bad maxReceiveBytes")

	# maxOpenTime is optional and has no limit by default.
	# Time is in milliseconds.
	try:
		obj.maxOpenTime = ensureNonNegIntLimit(
			helloData[Hello_maxOpenTime], 2**53) # e: ValueError, TypeError
	except KeyError:
		obj.maxOpenTime = None
	except (TypeError, ValueError):
		raise InvalidHello("bad maxOpenTime")

	return HelloFrame(obj)



# The other frame classes are a tuple; this one is not, and some users
# like L{newlink.sanitizeHelloFrame} do mutate it.
class HelloFrame(object):

	def __init__(self, obj):
		self.__dict__ = obj


	def __eq__(self, other):
		return False if type(self) != type(other) else self.__dict__ == other.__dict__


	def __ne__(self, other):
		return True if type(self) != type(other) else self.__dict__ != other.__dict__


	def __repr__(self):
		return '%s(%r)' % (self.__class__.__name__, self.__dict__)


	@classmethod
	def decode(cls, frameString):
		"""
		C{frameString} is a L{StringFragment} that ends with "H".
		"""
		try:
			# Reach into the private attributes, we know what we're doing.
			helloData, stoppedAt = strictDecoder.raw_decode(
				frameString._string, frameString._pos)
		except (JSONDecodeError, ParseError):
			raise InvalidHello("corrupt JSON")
		# `- 1` because we expect to stop before the trailing "H"
		if stoppedAt != frameString._pos + frameString.size - 1:
			raise InvalidHello("trailing garbage")

		return helloDataToHelloFrame(helloData)


	def _yieldMapping(self):
		for k, v in self.__dict__.iteritems():
			argByte = getattr(HelloFrameArguments, k, None)
			if argByte is None:
				raise CannotEncode("Don't know argByte for %r" % (k,))
			# We allow the user to pass either a string or a SACK,
			# hopefully they'll pass a SACK.
			if isinstance(v, SACK):
				yield argByte, SackFrame(v).encode()[:-1]
			else:
				yield argByte, v


	def encode(self):
		return dumps(dict(self._yieldMapping()), separators=(',', ':'), allow_nan=False) + 'H'


	def wantsStrings(self):
		"""
		Returns a C{bool} indicating whether this HelloFrame indicates that
		client wants to receive strings.
		"""
		return hasattr(self, 'succeedsTransport')



class StringFrame(tuple):
	__slots__ = ()
	__metaclass__ = attachClassMarker('_MARKER')

	string = property(operator.itemgetter(1))

	def __new__(cls, string):
		"""
		C{string} is a L{StringFragment} or C{str}.
		"""
		if not isinstance(string, StringFragment):
			string = StringFragment(string, 0, len(string))
		return tuple.__new__(cls, (cls._MARKER, string))


	def __repr__(self):
		return '%s(%r)' % (self.__class__.__name__, str(self[1]))


	@classmethod
	def decode(cls, frameString):
		"""
		C{frameString} is a L{StringFragment} that ends with " ".
		"""
		return cls(frameString[:-1])


	def encode(self):
		return str(self.string) + ' '



class SeqNumFrame(tuple):
	__slots__ = ()
	__metaclass__ = attachClassMarker('_MARKER')

	seqNum = property(operator.itemgetter(1))

	def __new__(cls, seqNum):
		"""
		C{seqNum} is an L{int} or L{long}.
		"""
		return tuple.__new__(cls, (cls._MARKER, seqNum))


	def __repr__(self):
		return '%s(%d)' % (self.__class__.__name__, self[1])


	@classmethod
	def decode(cls, frameString):
		"""
		C{frameString} is a L{StringFragment} that ends with "N".
		"""
		try:
			seqNum = strToNonNegLimit(str(frameString[:-1]), 2**53)
		except ValueError:
			raise InvalidFrame("bad seqNum")
		return cls(seqNum)


	def encode(self):
		return '%dN' % self.seqNum



class InvalidSackString(Exception):
	pass



def sackStringToSack(sackString):
	"""
	C{sackString} is a C{str}. Returns a L{window.SACK}.
	"""
	try:
		# If not enough args for split, Python raises ValueError
		joinedSackList, ackNumberStr = sackString.rsplit('|', 1)
		ackNumber = strToIntInRange(ackNumberStr, -1, 2**53)
		sackList = tuple(strToNonNegLimit(s, 2**53) for s in joinedSackList.split(',')) if joinedSackList else ()
	except ValueError:
		raise InvalidSackString("bad sack")
	return SACK(ackNumber, sackList)


def sackToSackString(sack):
	"""
	C{sack} is a L{window.SACK}. Returns a C{str}.
	"""
	return ','.join(str(s) for s in sack.sackList) + '|' + str(sack.ackNumber)


class SackFrame(tuple):
	__slots__ = ()
	__metaclass__ = attachClassMarker('_MARKER')

	sack = property(operator.itemgetter(1))

	def __new__(cls, sack):
		"""
		C{sack} is a {window.SACK}
		"""
		assert isinstance(sack, SACK), type(sack)
		return tuple.__new__(cls, (cls._MARKER, sack))


	def __repr__(self):
		return '%s(%r)' % (self.__class__.__name__, self[1])


	@classmethod
	def decode(cls, frameString):
		"""
		C{frameString} is a L{StringFragment} that ends with "A".
		"""
		try:
			return cls(sackStringToSack(str(frameString[:-1])))
		except InvalidSackString:
			raise InvalidFrame("bad sackList or ackNumber")


	def encode(self):
		return sackToSackString(self.sack) + 'A'



class StreamStatusFrame(tuple):
	__slots__ = ()
	__metaclass__ = attachClassMarker('_MARKER')

	lastSackSeen = property(operator.itemgetter(1))

	def __new__(cls, lastSackSeen):
		"""
		C{lastSackSeen} is a {window.SACK}
		"""
		assert isinstance(lastSackSeen, SACK), type(lastSackSeen)
		return tuple.__new__(cls, (cls._MARKER, lastSackSeen))


	def __repr__(self):
		return '%s(%r)' % (self.__class__.__name__, self[1])


	@classmethod
	def decode(cls, frameString):
		"""
		C{frameString} is a L{StringFragment} that ends with "A".
		"""
		try:
			return cls(sackStringToSack(str(frameString[:-1])))
		except InvalidSackString:
			raise InvalidFrame("bad sackList or ackNumber")


	def encode(self):
		return sackToSackString(self.lastSackSeen) + 'T'



class StreamCreatedFrame(tuple):
	__slots__ = ()
	__metaclass__ = attachClassMarker('_MARKER')

	def __new__(cls):
		"""
		No arguments.
		"""
		return tuple.__new__(cls, (cls._MARKER,))


	def __repr__(self):
		return '%s()' % (self.__class__.__name__,)


	@classmethod
	def decode(cls, frameString):
		"""
		C{frameString} is a L{StringFragment} that ends with "C".
		"""
		if len(frameString) != 1:
			raise InvalidFrame("leading garbage")
		return cls()


	def encode(self):
		return 'C'



class YouCloseItFrame(tuple):
	__slots__ = ()
	__metaclass__ = attachClassMarker('_MARKER')

	def __new__(cls):
		"""
		No arguments.
		"""
		return tuple.__new__(cls, (cls._MARKER,))


	def __repr__(self):
		return '%s()' % (self.__class__.__name__,)


	@classmethod
	def decode(cls, frameString):
		"""
		C{frameString} is a L{StringFragment} that ends with "Y".
		"""
		if len(frameString) != 1:
			raise InvalidFrame("leading garbage")
		return cls()


	def encode(self):
		return 'Y'



class PaddingFrame(tuple):
	__slots__ = ()
	__metaclass__ = attachClassMarker('_MARKER')

	numBytes = property(operator.itemgetter(1))

	def __new__(cls, numBytes):
		"""
		C{numBytes} is an L{int}.
		"""
		return tuple.__new__(cls, (cls._MARKER, numBytes))


	def __repr__(self):
		return '%s(%d)' % (self.__class__.__name__, self[1])


	@classmethod
	def decode(cls, frameString):
		"""
		C{frameString} is a L{StringFragment} that ends with "P".
		"""
		return cls(len(frameString) - 1)


	def encode(self):
		return (' ' * self.numBytes) + 'P'



def isValidShortRestrictedString(string):
	"""
	Return C{True} if C{str} C{string} has 0-255 bytes,
	and all bytes are within inclusive range 0x20 " " - 0x7E "~"

	C{string} is assumed to be a C{str}.
	"""
	if len(string) > 255:
		return False
	for c in string:
		if not ' ' <= c <= '~':
			return False
	return True


class ResetFrame(tuple):
	"""
	A reset frame indicates this side has given up on the Stream.
	A reset frame from the server implies a transport kill as well.
	"""
	__slots__ = ()
	__metaclass__ = attachClassMarker('_MARKER')

	reasonString = property(operator.itemgetter(1))
	applicationLevel = property(operator.itemgetter(2))

	def __new__(cls, reasonString, applicationLevel):
		"""
		@param reasonString: why the Stream reset.
			ASCII (0x20-0x7E)-only C{str}, max 255 bytes.
		"""
		return tuple.__new__(cls, (cls._MARKER, reasonString, applicationLevel))


	def __repr__(self):
		return '%s(%r, %r)' % (self.__class__.__name__, self[1], self[2])


	@classmethod
	def decode(cls, frameString):
		"""
		C{frameString} is a L{StringFragment} that ends with "!".
		"""
		reasonString, applicationLevelStr = str(frameString[:-1]).rsplit('|', 1)
		try:
			applicationLevel = {'0': False, '1': True}[applicationLevelStr]
		except KeyError:
			raise InvalidFrame("bad applicationLevel")
		if not isValidShortRestrictedString(reasonString):
			raise InvalidFrame("illegal bytes in reasonString")

		return cls(reasonString, applicationLevel)


	def encode(self):
		return self.reasonString + '|' + str(int(self.applicationLevel)) + '!'



class _TransportKillReason(Constant):
	__slots__ = ()



class TransportKillFrame(tuple):
	__slots__ = ()
	__metaclass__ = attachClassMarker('_MARKER')

	reason = property(operator.itemgetter(1))

	# Either because no such Stream, or bad credentialsData
	stream_attach_failure = _TransportKillReason("stream_attach_failure")

	# Peer acked strings that we never sent
	acked_unsent_strings = _TransportKillReason("acked_unsent_strings")

	# Peer sent frames that we don't understand
	invalid_frame_type_or_arguments = _TransportKillReason("invalid_frame_type_or_arguments")

	# Peer sent data that could not even be decoded to frames
	# (only applies to some decoders).
	frame_corruption = _TransportKillReason("frame_corruption")

	# Peer has caused our receive window to overflow
	rwin_overflow = _TransportKillReason("rwin_overflow")

	allReasons = (
		stream_attach_failure, acked_unsent_strings,
		 invalid_frame_type_or_arguments, frame_corruption,
		 rwin_overflow)

	stringToConstant = {}
	constantToString = {}
	for _c in allReasons:
		stringToConstant[_c.value] = _c
		constantToString[_c] = _c.value
	del _c


	def __new__(cls, reason):
		"""
		C{reason} is a one of the L{_TransportKillReason}s defined on
		this class.
		"""
		return tuple.__new__(cls, (cls._MARKER, reason))


	def __repr__(self):
		return '%s(%r)' % (self.__class__.__name__, self[1])


	@classmethod
	def decode(cls, frameString):
		"""
		C{frameString} is a L{StringFragment} that ends with "K".
		"""
		string = str(frameString[:-1])
		try:
			reason = cls.stringToConstant[string]
		except KeyError:
			raise InvalidFrame("unknown kill reason %r" % string)

		return cls(reason)


	def encode(self):
		return self.constantToString[self.reason] + 'K'


# A readable mapping for your reference:
#	'H': HelloFrame,
#	' ': StringFrame,
#	'N': SeqNumFrame,
#	'A': SackFrame,
#	'C': StreamCreatedFrame,
#	'Y': YouCloseItFrame,
#	'P': PaddingFrame,
#	'!': ResetFrame,
#	'K': TransportKillFrame,

# Design note: for frames that carry arbitrary text, use a non-[A-Za-z]
# character, to avoid accidentally forming words that proxies may block.


def decodeFrameFromClient(frameString):
	"""
	Decode a frame received from a Minerva client.
	C{frameString} is a L{StringFragment}.
	"""
	try:
		lastByte = frameString[-1]
	except IndexError:
		raise InvalidFrame("0-length frame")

	# Keep this ordered by most-probable first
	if lastByte == " ":
		return StringFrame.decode(frameString)
	elif lastByte == "A":
		return SackFrame.decode(frameString)
	elif lastByte == "N":
		return SeqNumFrame.decode(frameString)
	elif lastByte == "H":
		return HelloFrame.decode(frameString)
	elif lastByte == "!":
		return ResetFrame.decode(frameString)
	else:
		raise InvalidFrame("Invalid frame type %r" % lastByte)


def decodeFrameFromServer(frameString):
	"""
	Decode a frame received from a Minerva server.
	C{frameString} is a L{StringFragment}.
	"""
	try:
		lastByte = frameString[-1]
	except IndexError:
		raise InvalidFrame("0-length frame")

	# Keep this ordered by most-probable first
	if lastByte == " ":
		return StringFrame.decode(frameString)
	elif lastByte == "A":
		return SackFrame.decode(frameString)
	elif lastByte == "N":
		return SeqNumFrame.decode(frameString)
	elif lastByte == "T":
		return StreamStatusFrame.decode(frameString)
	elif lastByte == "Y":
		return YouCloseItFrame.decode(frameString)
	elif lastByte == "P":
		return PaddingFrame.decode(frameString)
	elif lastByte == "C":
		return StreamCreatedFrame.decode(frameString)
	elif lastByte == "!":
		return ResetFrame.decode(frameString)
	elif lastByte == "K":
		return TransportKillFrame.decode(frameString)
	else:
		raise InvalidFrame("Invalid frame type %r" % lastByte)



# Frames TODO: timestamp, start timestamps, stop timestamps,
# "connect back in N seconds" frame


from pypycpyo import optimizer
optimizer.bind_all_many(vars(), _postImportVars)
